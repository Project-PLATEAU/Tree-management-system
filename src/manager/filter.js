import dayjs from "dayjs"
import { Query } from "./carto"
import localStorage from "./localStorage"
import GairojuManager from "./gairoju"

export const filterModelToWhereStringArray = (name, filterModel) => {
  let val = filterModelToWhereString(name, filterModel)
  return val ? [val] : []
}

export const filterModelToWhereString = (name, filterModel) => {
  switch (filterModel.filterType) {
    case "text":
      return textFilterModelToWhereString(name, filterModel)
    case "number":
      return numberFilterModelToWhereString(name, filterModel)
    case "set":
      return setFilterModelToWhereString(name, filterModel)
    case "date":
      return dateFilterModelToWhereString(name, filterModel)
    default:
      break
  }
  return null
}

export const numberDateFilterModelToWhereString = (name, filterModel) => {
  if (filterModel.condition1 && filterModel.condition2) {
    let c1 = numberDateFilterModelToWhereString(name, filterModel.condition1)
    let c2 = numberDateFilterModelToWhereString(name, filterModel.condition2)
    if (!c1 || !c2) {
      return null
    }
    return `(${c1} ${filterModel.operator ?? "AND"} ${c2})`
  }
  let ymd = dayjs(filterModel.dateFrom).format("YYYYMMDD")
  if (!ymd) {
    return null
  }
  let ymdTo = filterModel.dateTo && dayjs(filterModel.dateTo).format("YYYYMMDD")
  switch (filterModel.type) {
    case "equals":
      return `${name} = ${ymd}`
    case "notEquals":
      return `${name} <> ${ymd}`
    case "lessThan":
      return `${name} < ${ymd}`
    case "lessThanOrEqual":
      return `${name} <= ${ymd}`
    case "greaterThan":
      return `${name} > ${ymd}`
    case "greaterThanOrEqual":
      return `${name} >= ${ymd}`
    case "inRange":
      return `${name} BETWEEN ${ymd} AND ${ymdTo}`
    default:
      break
  }
  return null
}

export const setFilterModelToWhereString = (name, filterModel) => {
  if (filterModel.values.length === 0) {
    return "FALSE"
  }
  if (filterModel.values && filterModel.values.length > 0) {
    let isEmpty = false
    let values = filterModel.values
    if (values.includes("(空白)")) {
      values.splice(values.indexOf("(空白)"), 1)
      isEmpty = true
    }
    return (
      `(${name} IN ('${filterModel.values.join("','")}')` +
      (isEmpty ? ` OR ${name} IS NULL OR ${name} = '')` : ")")
    )
  }

  return null
}

export const dateFilterModelToWhereString = (name, filterModel) => {
  if (filterModel.condition1 && filterModel.condition2) {
    let c1 = dateFilterModelToWhereString(name, filterModel.condition1)
    let c2 = dateFilterModelToWhereString(name, filterModel.condition2)
    if (!c1 || !c2) {
      return null
    }
    return `(${c1} ${filterModel.operator ?? "AND"} ${c2}`
  }

  if (!filterModel.dateFrom || filterModel.dateFrom.indexOf("'") !== -1) {
    return null
  }
  if (filterModel.dateTo && filterModel.dateTo.indexOf("'") !== -1) {
    return null
  }

  switch (filterModel.type) {
    case "equals":
      return `${name}::date = '${filterModel.dateFrom}'::date`
    case "notEquals":
      return `${name}::date <> '${filterModel.dateFrom}'::date`
    case "lessThan":
      return `${name}::date < '${filterModel.dateFrom}'::date`
    case "greaterThan":
      return `${name}::date > '${filterModel.dateFrom}'::date`
    case "inRange":
      return `${name}::date BETWEEN '${filterModel.dateFrom}'::date AND '${filterModel.dateTo}'::date`
    default:
      break
  }

  return null
}

export const numberFilterModelToWhereString = (name, filterModel) => {
  if (filterModel.condition1 && filterModel.condition2) {
    let c1 = numberFilterModelToWhereString(name, filterModel.condition1)
    let c2 = numberFilterModelToWhereString(name, filterModel.condition2)
    if (!c1 || !c2) {
      return null
    }
    return `(${c1} ${filterModel.operator ?? "AND"} ${c2})`
  }
  if (filterModel.filter.toString().indexOf("'") !== -1) {
    // シングルクォーテーションを含む場合は処理しない
    return null
  }
  switch (filterModel.type) {
    case "equals":
      return `${name} = ${filterModel.filter}`
    case "notEquals":
      return `${name} <> ${filterModel.filter}`
    case "lessThan":
      return `${name} < ${filterModel.filter}`
    case "lessThanOrEqual":
      return `${name} <= ${filterModel.filter}`
    case "greaterThan":
      return `${name} > ${filterModel.filter}`
    case "greaterThanOrEqual":
      return `${name} >= ${filterModel.filter}`
    case "inRange":
      return `${name} BETWEEN ${filterModel.filter} AND ${filterModel.filterTo}`
    default:
      break
  }
  return null
}

export const textFilterModelToWhereString = (name, filterModel) => {
  if (filterModel.condition1 && filterModel.condition2) {
    let c1 = textFilterModelToWhereString(name, filterModel.condition1)
    let c2 = textFilterModelToWhereString(name, filterModel.condition2)
    if (!c1 || !c2) {
      return null
    }
    return `(${c1} ${filterModel.operator ?? "AND"} ${c2})`
  }
  if (filterModel.filter.toString().indexOf("'") !== -1) {
    // シングルクォーテーションを含む場合は処理しない
    return null
  }
  switch (filterModel.type) {
    case "contains":
      return `${name} LIKE '%${filterModel.filter}%'`
    case "notContains":
      return `${name} NOT LIKE '%${filterModel.filter}%'`
    case "equals":
      return `${name} = '${filterModel.filter}'`
    case "notEqual":
      return `${name} <> '${filterModel.filter}'`
    case "startsWith":
      return `${name} LIKE '${filterModel.filter}%'`
    case "endsWith":
      return `${name} LIKE '%${filterModel.filter}'`
    default:
      break
  }
  return null
}

export const distinctShikuchosonFilterParams = {
  values: (params) => {
    Query(`
    SELECT DISTINCT citycode::int, cityname
    FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
    WHERE cityname IS NOT NULL
    ORDER BY citycode::int
    `)
      .then((ret) => {
        let values = ["(空白)"].concat(ret.data.rows.map((v) => v.cityname))
        params.success(values)
      })
      .catch((e) => {
        console.error(e)
      })
  },
}

export const distinctFilterParams = {
  values: (params) => {
    let filterData = JSON.parse(window.localStorage.getItem("filter") ?? "{}")
    delete filterData[params.colDef.field]
    let wheres = GairojuManager.basicQuery(filterData) ?? []
    if (wheres.length === 0) {
      wheres = ["TRUE"]
    }

    if (params.colDef.field) {
      let selcols = [params.colDef.field]
      let order = params.colDef.field
      Query(`
        SELECT DISTINCT
            ${selcols.join(",")}
        FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
        WHERE ${wheres.join(" AND ")}
        ORDER BY ${order}`)
        .then((ret) => {
          let values = ["(空白)"].concat(
            ret.data.rows.flatMap((v) => {
              if (v[params.colDef.field]) {
                return [v[params.colDef.field]]
              } else {
                return []
              }
            })
          )
          params.success(values)
        })
        .catch((e) => {
          params.success([])
        })
    }
    params.success([])
  },
  refreshValuesOnOpen: true,
}

export const teibokuFilterParams = {
  values: (params) => {
    if (params.colDef.field) {
      Query(`
        SELECT DISTINCT
            UNNEST(teiboku_array) AS ${params.colDef.field}
        FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
        `)
        .then((ret) => {
          let values = ["(空白)"].concat(
            ret.data.rows.flatMap((v) => {
              if (v[params.colDef.field]) {
                return [v[params.colDef.field]]
              } else {
                return []
              }
            })
          )
          params.success(values)
        })
        .catch((e) => {
          params.success([])
        })
    }
    params.success([])
  },
}
