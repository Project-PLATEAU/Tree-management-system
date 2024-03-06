import React, { useContext, useEffect, useMemo, useState } from "react"
import { RootDataContext } from "../index"
import ColumnDef from "../table/column"
import { Box, IconButton, Typography } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import { makeStyles } from "@mui/styles"
import dayjs from "dayjs"

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#b28eed",
    margin: "8px 4px",
    fontSize: "12px",
    padding: "2px 8px 2px 16px",
    alignItems: "center",
    borderRadius: "8px",
    whiteSpace: "nowrap",
  },
})

const RootFilterFilterView = (props) => {
  const classes = useStyles()
  const { state, setFilterData } = useContext(RootDataContext)
  const [filterElems, setFilterElems] = useState([])

  const columns = useMemo(
    () =>
      ColumnDef({}).reduce((l, v) => {
        l[v.field] = v
        return l
      }, {}),
    []
  )

  const onRemove = (key) => {
    let v = { ...state.filterData }
    delete v[key]
    setFilterData(v)
  }

  const numberConditionToString = (condition) => {
    switch (condition.type) {
      case "equals":
        return `『${condition.filter}』と等しい`
      case "notEqual":
        return `『${condition.filter}』と等しくない`
      case "lessThan":
        return `『${condition.filter}』未満`
      case "lessThanOrEqual":
        return `『${condition.filter}』以下`
      case "greaterThan":
        return `『${condition.filter}』を超える`
      case "greaterThanOrEqual":
        return `『${condition.filter}』以上`
      case "inRange":
        return `『${condition.filter}〜${condition.filterTo}』の範囲`
      default:
        break
    }

    return ""
  }

  const textConditionToString = (condition) => {
    switch (condition.type) {
      case "contains":
        return `含む『${condition.filter}』`
      case "notContains":
        return `含まない『${condition.filter}』`
      case "equals":
        return `一致『${condition.filter}』`
      case "notEqual":
        return `不一致『${condition.filter}』`
      case "startsWith":
        return `前方一致『${condition.filter}』`
      case "endsWith":
        return `末尾一致『${condition.filter}』`
      default:
        break
    }

    return ""
  }

  const dateConditionToString = (condition) => {
    switch (condition.type) {
      case "equals":
        return `『${dayjs(condition.dateFrom).format("YYYY年M月D日")}』`
      case "greaterThen":
        return `『${dayjs(condition.dateFrom).format("YYYY年M月D日")}』より後`
      case "lessThan":
        return `『${dayjs(condition.dateFrom).format("YYYY年M月D日")}』より前`
      case "notEqual":
        return `『${dayjs(condition.dateFrom).format("YYYY年M月D日")}』以外`
      case "inRange":
        return `『${dayjs(condition.dateFrom).format(
          "YYYY年M月D日"
        )}から${dayjs(condition.dateTo).format("YYYY年M月D日")}』の範囲`
      default:
        break
    }
    return ""
  }

  useEffect(() => {
    console.log("[Filter]", "effected", state.filterData)
    let elems = Object.keys(state.filterData ?? {}).map((k) => {
      let c = columns[k]
      if (!c) {
        return null
      }
      let f = state.filterData[k]
      let name = c.headerName
      let values = []

      switch (f.filterType) {
        case "set":
          values = f.values
          break
        case "number":
          if (f.condition1 && f.condition2) {
            let n = []
            n.push(numberConditionToString(f.condition1))
            switch (f.operator) {
              case "AND":
                n.push("かつ")
                break
              case "OR":
                n.push("または")
                break
              default:
                break
            }
            n.push(numberConditionToString(f.condition2))
            values = [n.join("")]
          } else {
            values.push(numberConditionToString(f))
          }
          break
        case "text":
          if (f.condition1 && f.condition2) {
            let n = []
            n.push(textConditionToString(f.condition1))
            switch (f.operator) {
              case "AND":
                n.push("かつ")
                break
              case "OR":
                n.push("または")
                break
              default:
                break
            }
            n.push(textConditionToString(f.condition2))
            values = [n.join("")]
          } else {
            values.push(textConditionToString(f))
          }
          break
        case "date":
          if (f.condition1 && f.condition2) {
            let n = []
            n.push(dateConditionToString(f.condition1))
            switch (f.operator) {
              case "AND":
                n.push("かつ")
                break
              case "OR":
                n.push("または")
                break
              default:
                break
            }
            n.push(dateConditionToString(f.condition2))
            values = [n.join("")]
          } else {
            values.push(dateConditionToString(f))
          }
          break
        default:
          break
      }

      return (
        <Box key={k} className={classes.box}>
          <Typography fontSize="small">{name}</Typography>
          {values.length > 0 && (
            <Typography fontSize="small">：{values.join(",")}</Typography>
          )}
          <IconButton>
            <CloseIcon fontSize="small" onClick={() => onRemove(k)} />
          </IconButton>
        </Box>
      )
    })
    setFilterElems(elems)
  }, [state.filterData])

  return (
    <>
      <Typography
        style={{ margin: "18px 8px", whiteSpace: "nowrap" }}
        fontSize="small"
      >
        絞り込み：
      </Typography>
      {filterElems}
    </>
  )
}

export default RootFilterFilterView
