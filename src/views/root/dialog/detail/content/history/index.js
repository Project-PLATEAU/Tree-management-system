import React, { useContext, useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
} from "@mui/material"
import { RootDataContext } from "../../../../index"
import { Rows } from "../../../../../../manager/carto"
import dayjs from "dayjs"
import dataDefList from "../../../../../../master_data"
import {
  ExpandMore as ExpandMoreIcon,
  KeyboardDoubleArrowDown as KeyboardDoubleArrowDownIcon,
  KeyboardDoubleArrowUp as KeyboardDoubleArrowUpIcon,
} from "@mui/icons-material"

const styles = {
  historyBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  titleBox: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    alignItems: "center",
    backgroundColor: "#c2c0da",
    padding: "4px 1rem",
    borderRadius: "8px",
  },
}

const DialogDetailContentHistoryView = (props) => {
  const { state, setRefreshTime } = useContext(RootDataContext)
  const [elems, setElems] = useState()
  const [openElems, setOpenElems] = useState([])

  const toggleOpen = (key) => {
    if (openElems.includes(key)) {
      setOpenElems((prev) => prev.filter((v) => v !== key))
    } else {
      setOpenElems((prev) => [...prev, key])
    }
  }

  useEffect(() => {
    console.log(openElems)
  }, [openElems])

  useEffect(() => {
    if (!props.treeId) {
      return
    }

    Rows(`
    SELECT * FROM ${process.env.REACT_APP_TABLE_TREE_CHANGE_VIEW}
    WHERE tree_id = '${props.treeId}'
    ORDER BY created_at_jst DESC
    `)
      .then((rows) => {
        setElems(
          rows.map((row) => {
            return (
              <Accordion key={`${row.tree_id}_${row.seq}`}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id={`${row.tree_id}_${row.seq}`}
                >
                  <Box style={styles.titleBox}>
                    <Box>
                      {dayjs(row.created_at_jst).format("YYYY-MM-DD HH:mm:ss")}
                    </Box>
                    <Box>{row.name ?? "管理ユーザ"}</Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    {Object.keys(row)
                      .filter(
                        (k) =>
                          ![
                            "name",
                            "tree_id",
                            "seq",
                            "created_user_id",
                            "created_at_jst",
                          ].includes(k) && row[k]
                      )
                      .map((k) => {
                        let dataDef = dataDefList.find((def) => def.field === k)
                        console.log(row[k])
                        let old_value = row[k].old
                        let new_value = row[k].new
                        switch (dataDef.sheet?.type) {
                          case "int":
                            if (
                              old_value === "" ||
                              old_value === null ||
                              old_value === undefined
                            ) {
                              old_value = "<NULL>"
                            } else {
                              old_value = parseInt(old_value)
                            }
                            if (
                              new_value === "" ||
                              new_value === null ||
                              new_value === undefined
                            ) {
                              new_value = "<NULL>"
                            } else {
                              new_value = parseInt(new_value)
                            }
                            break
                          case "float":
                          case "string":
                            if (
                              old_value === "" ||
                              old_value === null ||
                              old_value === undefined
                            ) {
                              old_value = "<NULL>"
                            }
                            if (
                              new_value === "" ||
                              new_value === null ||
                              new_value === undefined
                            ) {
                              new_value = "<NULL>"
                            }
                            break
                          case "bool":
                          case "boolean":
                            if (
                              old_value === "" ||
                              old_value === null ||
                              old_value === undefined
                            ) {
                              old_value = "<NULL>"
                            } else {
                              old_value = old_value ? "True" : "False"
                            }
                            if (
                              new_value === "" ||
                              new_value === null ||
                              new_value === undefined
                            ) {
                              new_value = "<NULL>"
                            } else {
                              new_value = new_value ? "True" : "False"
                            }
                            break
                        }

                        return (
                          <li key={k}>
                            {dataDef.headerName} （{old_value} → {new_value}）
                          </li>
                        )
                      })}
                  </ul>
                </AccordionDetails>
              </Accordion>
            )
          })
        )
      })
      .catch((e) => {
        console.log(e)
      })
  }, [props.treeId, state.refreshTime])

  return <Box>{elems}</Box>
}

DialogDetailContentHistoryView.propTypes = {
  treeId: PropTypes.string,
}

export default DialogDetailContentHistoryView
