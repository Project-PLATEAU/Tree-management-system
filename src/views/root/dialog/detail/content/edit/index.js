import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Alert, Box, Button, Snackbar } from "@mui/material"
import PropTypes from "prop-types"
import { One, Query, Rows } from "../../../../../../manager/carto"
import SelectEditor from "./editor/select"
import NumberEditor from "./editor/number"
import TextEditor from "./editor/text"
import DateEditor from "./editor/date"
import CheckEditor from "./editor/check"
import {
  SheetEditorType,
  SheetNameListData,
} from "../../../../../../manager/street"
import dataDefList from "../../../../../../master_data"
import data from "../../../../data"
import dayjs from "dayjs"
import { RootDataContext } from "../../../../index"
import { CheckBox } from "@mui/icons-material"
import {AuthDataContext} from "../../../../../../App";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    height: "100%",
  },
  body: {
    overflowY: "scroll",
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    gap: 1,
  },
  footer: {
    height: "40px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
    gap: "16px",
    marginRight: "32px",
  },
  row: {
    height: "50px",
    display: "flex",
    flexDirection: "row",
  },
  title: {
    width: "240px",
    height: "80%",
    display: "flex",
    alignItems: "center",
    paddingLeft: 1,
  },
  title1: {
    backgroundColor: "#eee",
  },
  title2: {
    backgroundColor: "#eef",
  },
  value: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    paddingLeft: 1,
  },
  text_field: {
    marginBottom: 1,
  },
  editor: {
    rowBox: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
    },
    columnBox: {
      display: "flex",
      flexDirection: "row",
      gap: "16px",
      minHeight: "42px",
      width: "480px",
    },
    labelBox: {
      width: "200px",
      display: "flex",
      alignItems: "center",
      paddingLeft: "8px",
    },
    subLabel: {
      fontSize: "12px",
      color: "#575757",
      marginLeft: "8px",
    },
    leftLabelBox: {
      backgroundColor: "#d0d0d0",
    },
    rightLabelBox: {
      backgroundColor: "#ddddfa",
    },
    valueBox: {
      flexGrow: 1,
    },
    leftValueBox: {
      display: "flex",
      alignItems: "center",
    },
  },
}
const DialogDetailContentEditView = (props) => {
  const [editedData, setEditedData] = useState({ ...props.data })
  const [errorData, setErrorData] = useState({})
  const { state, setRefreshTime } = useContext(RootDataContext)
  const { authState } = useContext(AuthDataContext)
  const [isChanged, setIsChanged] = useState(false)
  const [updateSuccessful, setUpdateSuccessful] = useState(false)
  const [changedData, setChangedData] = useState(null)
  const fullWidth2HalfWidth = (src) => {
    return src.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    })
  }

  const saveData = async () => {
    // 変更されたものだけを収集

    if (!changedData || Object.keys(changedData).length === 0) {
      return
    }

    let primaries = dataDefList
      .filter((d) => !!d.sheet?.primary_key)
      .sort((v1, v2) => {
        if (v1.sheet.primary_key > v2.sheet.primary_key) {
          return 1
        }
        if (v1.sheet.primary_key < v2.sheet.primary_key) {
          return -1
        }
        return 0
      })
    if (primaries.length === 0) {
      console.log("[DataDef]", "syntax error: sheet.primary_key not found!")
    }

    let wheres = primaries
      .map((d) => {
        if (props.data[d.field] === null || props.data[d.field] === undefined) {
          return `${d.field} = null`
        }
        switch (d.sheet.type) {
          case "int":
          case "float":
            return `${d.field} = ${props.data[d.field]}`
          case "string":
          case "text":
            return `${d.field} = '${props.data[d.field].replace("'", "’")}'`
          case "boolean":
          case "bool":
            return `${d.field} = ${props.data[d.field] ? "true" : "false"}`
          default:
            break
        }
        return null
      })
      .filter((v) => !!v)
    console.log(wheres)

    let values = Object.keys(changedData)
      .map((key) => {
        let dataDef = dataDefList.find((d) => d.field === key)
        if (!dataDef || !dataDef.sheet) {
          return null
        }

        if (changedData[key] === null || changedData[key] === undefined) {
          return `${key} = null`
        }

        switch (dataDef.sheet.type) {
          case "int":
          case "float":
            return `${key} = ${changedData[key]}`
          case "string":
            return `${key} = '${changedData[key].replace("'", "’")}'`
          case "boolean":
          case "bool":
            return `${key} = ${changedData[key] ? "true" : "false"}`
          default:
            break
        }
        return null
      })
      .filter((v) => !!v)

    console.log(primaries, values)

    let rows = await Rows(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = '${process.env.REACT_APP_TABLE_TREE_EDITED}' 
        AND column_name not in ('cartodb_id', 'created_at_jst', 'created_user_id')
    ORDER BY ordinal_position    
    `)
    let columns = rows.map((row) => row["column_name"])

    let q = `
    INSERT INTO ${process.env.REACT_APP_TABLE_TREE_EDITED}
    (${columns.join(",")}, created_at_jst, created_user_id)
    SELECT ${columns.join(",")}, NOW() AS created_at_jst, ${
      authState.userData?.detail?.cartodb_id ?? "null"
    } AS created__user_id FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
    WHERE ${wheres.join(" AND ")}
    RETURNING cartodb_id
    `

    let cartodbId = await One(q)

    let u = `
    UPDATE ${process.env.REACT_APP_TABLE_TREE_EDITED}
    SET
        ${values.join(",")}
    WHERE cartodb_id = ${cartodbId}
    `

    Query(u)
      .then((res) => {
        console.log(res)
        setRefreshTime()
        setUpdateSuccessful(true)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  // 数字入力欄のonChange
  const onChange = useCallback(
    (dataDef, value) => {
      console.log("[OnChange]", dataDef, value)
      if (
        // もしdataDefにonChangeがあればそれを実行
        dataDef.sheet.onChange &&
        typeof dataDef.sheet.onChange === "function"
      ) {
        try {
          let ret = dataDef.sheet.onChange(
            editedData,
            dataDef.field,
            value,
            dataDef
          )
          console.log("[OnChange]", "function call", ret)
          if (ret instanceof Promise) {
            // 結果がPromiseなら
            ret
              .then((res) => {
                setEditedData(res)
                setErrorData({ ...errorData, [dataDef.field]: null })
              })
              .catch((e) => {
                setErrorData({
                  ...errorData,
                  [dataDef.field]: e ?? "値が正しくありません",
                })
              })
          } else {
            setEditedData(ret)
          }
        } catch (e) {
          console.log("[OnChange]", "function call error", e)
          setErrorData({ ...errorData, [dataDef.field]: e.message })
        }
      } else {
        setEditedData({ ...editedData, [dataDef.field]: value })
      }
    },
    [editedData, errorData]
  )

  const onBlurNumber = useCallback(
    (dataDef) => {
      console.log(dataDef, editedData[dataDef.field])
      if (dataDef.sheet.onBlur && typeof dataDef.sheet.onBlur === "function") {
        try {
          let ret = dataDef.sheet.onBlur(
            editedData,
            dataDef.field,
            editedData[dataDef.field]
          )
          if (ret instanceof Promise) {
            ret
              .then((res) => {
                setEditedData(res)
                setErrorData({ ...errorData, [dataDef.field]: null })
              })
              .catch((e) => {
                setErrorData({ ...errorData, [dataDef.field]: e })
              })
          } else {
            setEditedData(ret)
          }
        } catch (e) {
          setErrorData({ ...errorData, [dataDef.field]: null })
        }
      } else if ((editedData[dataDef.field]?.length ?? 0) > 0) {
        let val = fullWidth2HalfWidth(editedData[dataDef.field])
        if (val.length === 0) {
          return
        }
        switch (dataDef.sheet.type) {
          case "int":
            val = parseInt(val)
            if (isNaN(val)) {
              setErrorData({ ...errorData, [dataDef.field]: "不正な文字列" })
              return
            }
            setEditedData({ ...editedData, [dataDef.field]: val })
            setErrorData({ ...errorData, [dataDef.field]: null })
            break
          case "float":
            val = parseFloat(val)
            if (isNaN(val)) {
              setErrorData({ ...errorData, [dataDef.field]: "不正な文字列" })
              return
            }
            if (dataDef.sheet.fixed) {
              setEditedData({
                ...editedData,
                [dataDef.field]: val.toFixed(dataDef.sheet.fixed),
              })
            } else {
              setEditedData({ ...editedData, [dataDef.field]: val })
              setErrorData({ ...errorData, [dataDef.field]: null })
            }
            break
          default:
            break
        }
      }
    },
    [editedData, errorData]
  )

  const onBlur = (dataDef) => {
    if (dataDef.sheet.onBlur && typeof dataDef.sheet.onBlur === "function") {
      try {
        let ret = dataDef.sheet.onBlur(
          editedData,
          dataDef.field,
          editedData[dataDef.field]
        )
        if (ret instanceof Promise) {
          ret
            .then((res) => {
              setEditedData({ ...editedData, [dataDef.field]: res })
              setErrorData({ ...errorData, [dataDef.field]: null })
            })
            .catch((e) => {
              setErrorData({ ...errorData, [dataDef.field]: e })
            })
        } else {
          setEditedData({ ...editedData, [dataDef.field]: ret })
          setErrorData({ ...errorData, [dataDef.field]: null })
        }
      } catch (e) {
        setErrorData({ ...errorData, [dataDef.field]: e.message })
      }
    }
  }

  useEffect(() => {
    if (!props.data) {
      setChangedData({})
      return
    }

    let changed = Object.fromEntries(
      Object.entries(props.data)
        .map(([key, value]) => {
          if (value !== editedData[key]) {
            if (editedData[key] === undefined) {
              return [key, null]
            }
            return [key, editedData[key]]
          }
          return null
        })
        .filter((v) => !!v)
    )
    console.log(changed, Object.keys(changed))
    if (Object.keys(changed).length === 0) {
      setChangedData(null)
    } else {
      setChangedData(changed)
    }
    //
    // let changed = false
    // let keys = Object.keys(props.data)
    // for (var i = 0; i < keys.length; i++) {
    //   if (props.data[keys[i]] !== editedData[keys[i]]) {
    //     changed = true
    //     break
    //   }
    // }
    // console.log("[CheckChanged]", changed)
    // setIsChanged(changed)
  }, [props.data, editedData])

  useEffect(() => {
    console.log('[Update Props Data]', props.data)
    setEditedData({ ...props.data })
  }, [props.data, state.refreshTime])

  return (
    <Box sx={styles.root}>
      <Box
        sx={{
          height: "calc(100% - 48px)",
          overflowY: "scroll",
          margin: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          paddingTop: "8px",
        }}
      >
        {dataDefList.map((dataDef) => {
          if (!dataDef.sheet?.editor_type) {
            return null
          }
          if (dataDef.sheet?.visible === false) {
            return null
          }

          switch (dataDef.sheet.editor_type) {
            case SheetEditorType.Number:
              return (
                <NumberEditor
                  error={!!errorData[dataDef.field]}
                  errorMessage={errorData[dataDef.field]}
                  id={dataDef.field}
                  label={dataDef.headerName}
                  current={props.data[dataDef.field]}
                  value={editedData[dataDef.field]}
                  unitName={dataDef.sheet.unit}
                  styles={styles.editor}
                  onChange={(value) => onChange(dataDef, value)}
                  onBlur={() => onBlurNumber(dataDef)}
                />
              )
            case SheetEditorType.Select:
              return (
                <Suspense fallback={<div>loading.</div>}>
                  <NameListEditView
                    dataDef={dataDef}
                    data={props.data}
                    editedData={editedData}
                    onChange={(value) => {
                      onChange(dataDef, value)
                    }}
                  />
                </Suspense>
              )
            case SheetEditorType.Date:
              return (
                <DateEditor
                  id={dataDef.field}
                  label={dataDef.headerName}
                  current={dayjs(props.data[dataDef.field]).format(
                    "YYYY-MM-DD"
                  )}
                  value={editedData[dataDef.field]}
                  styles={styles.editor}
                  onChange={(value) => {
                    onChange(dataDef, value)
                  }}
                />
              )
            case SheetEditorType.String:
              return (
                <TextEditor
                  error={!!errorData[dataDef.field]}
                  errorMessage={errorData[dataDef.field]}
                  id={dataDef.field}
                  label={dataDef.headerName}
                  current={props.data[dataDef.field]}
                  value={editedData[dataDef.field]}
                  unitName={dataDef.sheet.unit}
                  styles={styles.editor}
                  onChange={(value) => onChange(dataDef, value)}
                  onBlur={() => onBlur(dataDef)}
                />
              )
            case SheetEditorType.Check:
              return (
                <CheckEditor
                  error={!!errorData[dataDef.field]}
                  errorMessage={errorData[dataDef.field]}
                  id={dataDef.field}
                  label={dataDef.headerName}
                  current={props.data[dataDef.field] ? <CheckBox /> : null}
                  checked={!!editedData[dataDef.field]}
                  styles={styles.editor}
                  onChange={(value) => onChange(dataDef, value)}
                />
              )
            default:
              break
          }
          return null
        })}
      </Box>
      <Box style={styles.footer}>
        <Button
          variant="contained"
          disabled={!changedData}
          onClick={() => setRefreshTime()}
        >
          リセット
        </Button>
        <Button variant="contained" disabled={!changedData} onClick={saveData}>
          保存
        </Button>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={updateSuccessful}
        autoHideDuration={3000}
        onClose={() => setUpdateSuccessful(false)}
      >
        <Alert severity="success">更新しました</Alert>
      </Snackbar>
    </Box>
  )
}

const NumberEditView = (props) => {
  return (
    <NumberEditor
      id={props.dataDef.field}
      label={props.dataDef.headerName}
      current={props.data[props.dataDef.field]}
      value={props.editedData[props.dataDef.field]}
      unitName={props.dataDef.sheet.unit}
      styles={styles.editor}
      onChange={(value) => {
        props.onChange(value)
      }}
      onBlur={() => {
        props.onBlur()
      }}
    />
  )
}
NumberEditView.propTypes = {
  dataDef: PropTypes.object,
  data: PropTypes.any,
  editedData: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
}

const NameListEditView = (props) => {
  const [options, setOptions] = useState()

  useEffect(() => {
    if (!props.dataDef) {
      return
    }
    if (
      props.dataDef.getValues &&
      typeof props.dataDef.getValues === "function"
    ) {
      let res = props.dataDef.getValues(props.dataDef)
      if (res instanceof Promise) {
        res.then(setOptions).catch((e) => {
          console.log(e)
        })
      } else {
        setOptions(res)
      }
    } else {
      Rows(
        `SELECT DISTINCT ${props.dataDef.sheet.name_col} AS name, ${props.dataDef.sheet.value_col} AS value
           FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
           ORDER BY ${props.dataDef.sheet.name_col}`
      ).then(setOptions)
    }
  }, [props.dataDef])

  useEffect(() => {}, [props.data])

  if (!options) {
    return <div>Loading...</div>
  }

  return (
    <SelectEditor
      id={props.dataDef.field}
      label={props.dataDef.headerName}
      current={props.data[props.dataDef.sheet.value_col]}
      value={props.editedData[props.dataDef.sheet.value_col]}
      options={options}
      styles={styles.editor}
      onChange={(value) => {
        props.onChange(value)
      }}
    />
  )
}
NameListEditView.propTypes = {
  dataDef: PropTypes.object,
  data: PropTypes.any,
  editedData: PropTypes.any,
  onChange: PropTypes.func,
}

DialogDetailContentEditView.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.object,
}

export default DialogDetailContentEditView
