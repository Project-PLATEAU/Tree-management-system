import carto from "@carto/carto.js"
import axios from "axios"
import dayjs from "dayjs"

export const cartClient = new carto.Client({
  apiKey: process.env.REACT_APP_CARTO_API_KEY,
  username: process.env.REACT_APP_CARTO_USERNAME,
  serverUrl: process.env.REACT_APP_CARTO_ENDPOINT,
})

export const CreateCartoQuerySource = (initialSql) =>
  new carto.source.SQL(initialSql)

export const CreateCartoCss = (initialStyle) =>
  new carto.style.CartoCSS(initialStyle)

export const GetLeafletLayer = (cartoLayer) =>
  cartClient.getLeafletLayer(cartoLayer)

export const CreateCartoLayer = (source, style, options = {}) => {
  let layer = new carto.layer.Layer(source, style, options)
  cartClient.addLayer(layer).then(() => {})
  return layer
}

export const RemoveCartoLayer = async (cartoLayer) =>
  await cartClient.removeLayer(cartoLayer)

// export const Query = (sql, params = {}) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .post(`${process.env.REACT_APP_CARTO_ENDPOINT}/api/v2/sql`, {
//         q: sql,
//         api_key: process.env.CARTO_API_KEY,
//       })
//       .then((res) => {
//         resolve(res.data)
//       })
//       .catch((e) => {
//         reject(e)
//       })
//   })
// }
//

export const Query = (sql, params = {}) => {
  return new Promise((resolve, reject) => {
    try {
      params["api_key"] = process.env.REACT_APP_CARTO_API_KEY

      let queryString = sql
        .replace(/\n/g, " ")
        .replace(/ +/g, " ")
        .replace(/ +/g, " ")
      params["q"] = encodeURI(queryString)
      // &&の変換、+の変換
      params["q"] = params["q"].replace(/&&/g, "%26%26")
      params["q"] = params["q"].replace(/\+/g, "%2B")
      params["tm"] = dayjs().unix()
      let queryValues = []
      Object.keys(params).forEach((v, i) =>
        queryValues.push(`${v}=${params[v]}`)
      )
      let url = `${
        process.env.REACT_APP_CARTO_ENDPOINT
      }/api/v2/sql?${queryValues.join("&")}`

      axios.get(url).then((res) => {
        resolve(res)
      })
    } catch (e) {
      reject(e)
    }
  })
}

export const Rows = (sql, params = {}) => {
  return new Promise((resolve, reject) => {
    Query(sql, params)
      .then((ret) => {
        resolve(ret?.data?.rows)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const First = (sql, params = {}) => {
  return new Promise((resolve, reject) => {
    Rows(sql, params)
      .then((ret) => {
        resolve(ret?.shift())
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const One = (sql, params = {}, columnName = null) => {
  return new Promise((resolve, reject) => {
    Query(sql, params)
      .then((ret) => {
        let colName = columnName ?? Object.keys(ret?.data?.fields ?? [])[0]
        let row = ret?.data?.rows?.shift()
        if (!row) {
          return resolve(null)
        }
        resolve(row[colName])
      })
      .catch((e) => {
        reject(e)
      })
  })
}
