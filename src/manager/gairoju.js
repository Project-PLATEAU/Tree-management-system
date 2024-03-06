import { filterModelToWhereStringArray } from "./filter"
import { First, One, Rows } from "./carto"

export default new (class {
  getById = (cartodbId) => {
    return new Promise((resolve, reject) => {
      First(`
        SELECT * FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
        WHERE cartodb_id = ${cartodbId}
      `)
        .then((ret) => {
          resolve(ret)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  chuteibokuSummaryQuery = (filter) => {
    return new Promise((resolve, reject) => {
      let wheres = this.basicQuery(filter)
      if (wheres.length === 0) {
        wheres = ["TRUE"]
      }

      let sql = `
      SELECT 
        route_number AS rosen_no,
        name,
        SUM(CASE WHEN chuteiboku_height_rank = 'A' THEN 1 ELSE 0 END) AS rank_a,
        SUM(CASE WHEN chuteiboku_height_rank = 'B' THEN 1 ELSE 0 END) AS rank_b,
        SUM(CASE WHEN chuteiboku_height_rank = 'C' THEN 1 ELSE 0 END) AS rank_c,
        SUM(CASE WHEN chuteiboku_height_rank = 'D' THEN 1 ELSE 0 END) AS rank_d,
        COUNT(*) AS rosen_sum
      FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
      WHERE type IN ('低木', '中木') AND chuteiboku_height_rank IS NOT NULL AND ${wheres.join(
        " AND "
      )}
      GROUP BY route_number, name
      ORDER BY route_number::int
      `

      Rows(sql)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  sendaiSummaryQuery = (filter) => {
    return new Promise((resolve, reject) => {
      let wheres = this.basicQuery(filter)
      if (wheres.length === 0) {
        wheres = ["TRUE"]
      }

      let sql = `
      SELECT
        tree_name,
        SUM(CASE WHEN perimeter::INT < 59 THEN 1 ELSE 0 END) AS rank_a,
        SUM(CASE WHEN perimeter::INT BETWEEN 60 AND 89 THEN 1 ELSE 0 END) AS rank_b,
        SUM(CASE WHEN perimeter::INT BETWEEN 90 AND 119 THEN 1 ELSE 0 END) AS rank_c,
        SUM(CASE WHEN perimeter::INT BETWEEN 120 AND 149 THEN 1 ELSE 0 END) AS rank_d,
        SUM(CASE WHEN perimeter::INT BETWEEN 150 AND 179 THEN 1 ELSE 0 END) AS rank_e,
        SUM(CASE WHEN perimeter::INT BETWEEN 180 AND 209 THEN 1 ELSE 0 END) AS rank_f,
        SUM(CASE WHEN perimeter::INT BETWEEN 210 AND 239 THEN 1 ELSE 0 END) AS rank_g,
        SUM(CASE WHEN perimeter::INT BETWEEN 240 AND 269 THEN 1 ELSE 0 END) AS rank_h,
        SUM(CASE WHEN perimeter::INT BETWEEN 270 AND 299 THEN 1 ELSE 0 END) AS rank_i,
        SUM(CASE WHEN perimeter::INT >= 300 THEN 1 ELSE 0 END) AS rank_k,
        COUNT(1) AS sum
      FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
      WHERE 
        perimeter IS NOT NULL
        AND tree_name IS NOT NULL
        AND tree_name <> ''
        AND ${wheres.join(" AND ")}
      GROUP BY tree_name
      ORDER BY 12 DESC
      `
      Rows(sql, {})
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  kobokuSummaryQuery = (filter) => {
    return new Promise((resolve, reject) => {
      let wheres = this.basicQuery(filter)
      if (wheres.length === 0) {
        wheres = ["TRUE"]
      }

      let sql = `
      SELECT
        route_number AS rosen_no,
        name,
        SUM(CASE WHEN koboku_perimeter_rank = 'A' THEN 1 ELSE 0 END) AS rank_a,
        SUM(CASE WHEN koboku_perimeter_rank = 'B' THEN 1 ELSE 0 END) AS rank_b,
        SUM(CASE WHEN koboku_perimeter_rank = 'C' THEN 1 ELSE 0 END) AS rank_c,
        SUM(CASE WHEN koboku_perimeter_rank = 'D' THEN 1 ELSE 0 END) AS rank_d,
        SUM(CASE WHEN koboku_perimeter_rank = 'E' THEN 1 ELSE 0 END) AS rank_e,
        SUM(CASE WHEN koboku_perimeter_rank = 'F' THEN 1 ELSE 0 END) AS rank_f,
        SUM(CASE WHEN koboku_perimeter_rank = 'G' THEN 1 ELSE 0 END) AS rank_g,
        SUM(CASE WHEN koboku_perimeter_rank = 'H' THEN 1 ELSE 0 END) AS rank_h,
        SUM(CASE WHEN koboku_perimeter_rank = 'I' THEN 1 ELSE 0 END) AS rank_i,
        SUM(CASE WHEN koboku_perimeter_rank = 'J' THEN 1 ELSE 0 END) AS rank_j,
        SUM(CASE WHEN koboku_perimeter_rank = 'K' THEN 1 ELSE 0 END) AS rank_k,
        COUNT(*) AS rosen_sum
      FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
      WHERE type = '高木' AND koboku_perimeter_rank IS NOT NULL
        AND ${wheres.join(" AND ")}
      GROUP BY route_number, name
      ORDER BY route_number::int
    `

      Rows(sql, {})
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  basicQuery = (filter) => {
    let wheres = filter
      ? Object.keys(filter).flatMap((name) => {
          let fName = name
          console.log("[FilterName]", name, filter[name])
          // 名前の変更
          if (name === "hedge_count") {
            fName =
              "CASE WHEN hedge_count = '多数' THEN 9999 ELSE hedge_count::int END"
          } else if (name === '"tree_count') {
            fName =
              "CASE WHEN tree_count = '多数' THEN 9999 ELSE tree_count::int END"
          } else if (name === "teiboku_name") {
            return this._filterModelTeibokuToWhereStringArray(filter[name])
          } else if (name === "is_dead") {
            let vals = []
            if (filter[name].values.includes("(空白)")) {
              vals.push(`is_dead IS NULL`)
            }
            if (filter[name].values.includes("枯れ")) {
              vals.push(`is_dead = 1`)
            }
            if (vals.length === 0) {
              return []
            } else {
              return [`(${vals.join(" OR ")})`]
            }
          } else if (name === "photos") {
            let vals = []
            if (filter[name].values.includes("写真あり")) {
              vals.push("photos IS NOT NULL")
            }
            if (filter[name].values.includes("写真なし")) {
              vals.push("photos IS NULL")
            }
            if (vals.length === 0) {
              return []
            } else {
              return [`(${vals.join(" OR ")})`]
            }
          } else if (name === "diagnostic_pdf") {
            let vals = []
            if (filter[name].values.includes("PDFあり")) {
              vals.push("diagnostic_pdf IS NOT NULL")
            }
            if (filter[name].values.includes("PDFなし")) {
              vals.push("diagnostic_pdf IS NULL")
            }
            if (vals.length === 0) {
              return []
            } else {
              return [`(${vals.join(" OR ")})`]
            }
          } else if (name === "hasmushrooms") {
            let vals = []
            filter[name].values?.map((v) => {
              if (v === "あり") {
                vals.push("hasmushrooms = true")
              } else if (v === "なし") {
                vals.push("hasmushrooms = false")
              } else if (v === "(空白)") {
                vals.push("hasmushrooms is null")
              }
            })
            if (vals.length === 0) {
              return ["FALSE"]
            } else {
              return [`(${vals.join(' OR ')})`]
            }
          } else if (name === "treevigor") {
            let vals = []
            filter[name].values?.map((v) => {
              switch (v) {
                case "良い":
                  vals.push("treevigor = 'good'")
                  break
                case "少し悪い":
                  vals.push("treevigor ='poor'")
                  break
                case "悪い":
                  vals.push("treevigor = 'bad'")
                  break
                case "枯死":
                  vals.push("treevigor = 'died'")
                  break
                default:
                  vals.push("treevigor is null")
              }
            })
            console.log('[Treevigor]', vals)
            if (vals.length === 0) {
              return ["FALSE"]
            } else {
              return [`(${vals.join(' OR ')})`]
            }
          }

          return filterModelToWhereStringArray(fName, filter[name])
        })
      : null
    if ((wheres?.length ?? 0) === 0) {
      wheres = ["TRUE"]
    }

    return wheres
  }

  tableQuery = (params) => {
    let wheres = this.basicQuery(params.request.filterModel)

    let orderBy = params.request.sortModel.map((v) => {
      return `${v.colId} ${v.sort}`
    })
    if (orderBy.length === 0) {
      orderBy = ["id"]
    }

    let limit = params.request.endRow - (params.request.startRow ?? 0)
    let offset = params.request.startRow ?? 0

    Promise.all([
      this._getTableRows(wheres, orderBy, limit, offset),
      this._getTableCount(wheres),
    ])
      .then((values) => {
        params.success({
          rowData: values[0],
          rowCount: values[1],
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  selectLayerQuery = (filter, select) => {
    let wheres = this.basicQuery(filter)
    // 選択されたものだけを抽出するクエリを作成

    if (!select || Object.keys(select).length === 0) {
      wheres = ["FALSE"]
    } else {
      switch (select.field) {
        case "perimeter":
        case "width":
        case "height":
        case "hedge_length":
        case "pit_Number":
        case "tree_Number":
          wheres.push(`${select.field} = ${select.value}`)
          break
        case "date":
          wheres.push(`${select.field}::date = '${select.value}'::date`)
          break
        default:
          wheres.push(`${select.field} = '${select.value}'`)
      }
    }

    return `
      SELECT *, ST_Y(the_geom) AS latitude, ST_X(the_geom) AS longitude
      FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
      WHERE ${wheres.join(" AND ")}
      `
  }

  exportQuery = (filter, sort) => {
    let wheres = this.basicQuery(filter)

    let orderBy =
      sort?.map((v) => {
        return `${v.colId} ${v.sort}`
      }) ?? []
    if (orderBy.length === 0) {
      orderBy = ["tree_id"]
    }
    return `
    SELECT *
    FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
    WHERE ${wheres.join(" AND ")}
    ORDER BY ${orderBy.join(", ")}
    `
  }

  kokuLayerQuery = () => {
    return `SELECT * FROM ${process.env.REACT_APP_TABLE_KOKU}`
  }

  gyoseikaiLayerQuery = () => {
    return `SELECT * FROM ${process.env.REACT_APP_TABLE_GYOSEIKAI}`
  }

  roadGridLayerQuery = () => {
    return `SELECT * FROM ${process.env.REACT_APP_TABLE_ROAD_GRID}`
  }

  tableLayerQuery = (filter) => {
    let wheres = this.basicQuery(filter)

    return `
      SELECT *
      FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
      WHERE ${wheres.join(" AND ")}
      `
  }


  labelLayerQuery = (filter) => {
    let wheres = this.basicQuery(filter)

    let sql = `
    SELECT
      cartodb_id,
      the_geom_webmercator,
      tree_id,
      citycode,
      cityname,
      map_name,
      route_number,
      name,
      variant,
      type_adjust,
      koboku_perimeter_rank,
      chuteiboku_height_rank,
      height || 'm' AS height,
      tree_count || '本' AS tree_count,
      perimeter || 'cm' AS perimeter,
      width || 'm' AS width,
      teiboku_name,
      CASE WHEN is_hedge = 1 THEN '生垣' ELSE '' END AS is_hedge,
      hedge_length || 'm' AS hedge_length,
      hedge_count || '本' AS hedge_count,
      CASE WHEN is_mytree = 1 THEN 'マイツリー' ELSE '' END is_mytree,
      CASE WHEN photos IS NOT NULL THEN '写真' ELSE '' END AS photos,
      route_remarks,
      side,
      date,
      CASE WHEN is_dead = 1 THEN '枯れ' ELSE '' END AS is_dead,
      remarks
    FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
    WHERE ${wheres.join(" AND ")}
    `

    return sql
  }

  _filterModelTeibokuToWhereStringArray = (params) => {
    if (params.values.length === 0) {
      return ["FALSE"]
    }

    let v = "'{" + params.values.map((v) => `"${v}"`).join(",") + "}'"
    let val = " teiboku_array && " + v
    return [val]
  }

  _getTableRows = (wheres, order, limit, offset) => {
    return new Promise((resolve, reject) => {
      Rows(`
      SELECT * FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
      WHERE ${wheres.join(" AND ")}
      ORDER BY ${order.join(",")}
      LIMIT ${limit} OFFSET ${offset}
      `)
        .then((ret) => {
          resolve(ret)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  _getTableCount = (wheres) => {
    return new Promise((resolve, reject) => {
      One(`
        SELECT COUNT(*) FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
        WHERE ${wheres.join(" AND ")}
      `)
        .then((ret) => {
          resolve(ret)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  getDistinctValues = (params) => {
    return new Promise((resolve, reject) => {
      console.log(params)
      resolve(["ほげ", "ふが"])
    })
  }
})()
