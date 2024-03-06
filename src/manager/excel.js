import dayjs from "dayjs"
import ColumnDef from "../views/root/table/column"
import GairojuManager from "./gairoju"
import { Rows } from "./carto"
import { useMemo } from "react"
const ExcelJS = require("exceljs")

const _exportExcelIgnoreFieldNames = [
  "variant",
  "hedge_length",
  "pit_Number",
  "suggested_type",
  "is_hedge",
  "route_remarks",
  "teiboku_remarks",
  "remarks",
  "outofscope",
  "hedge_count",
  "tree_count",
  "no",
]

export const exportTableExcel = async (filterData) => {
  const columnDef = ColumnDef({})
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Data")
  worksheet.columns = columnDef.flatMap((v) => {
    if (_exportExcelIgnoreFieldNames.includes(v.field)) {
      return []
    }
    return [{ header: v.headerName, key: v.field }]
  })

  const columns = ColumnDef({}).reduce((l, v) => {
    l[v.field] = v
    return l
  }, {})

  let fileNames = []
  fileNames.push(`公園樹木台帳DB`)
  fileNames.push(dayjs().format("-M月D日H時m分作成"))
  let filterNames = []
  console.log('[Filter data]', filterData)
  //
  // for (let f of Object.keys(filterData)) {
  //   console.log(f)
  //   let n = columns[f]
  //   if (n) {
  //     filterNames.push(n.headerName)
  //   }
  // }
  // console.log(filterNames)
  // if (filterNames.length > 0) {
  //   fileNames.push(`-絞り込み（${filterNames.join("・")}）`)
  // }

  let sql = GairojuManager.exportQuery(filterData)
  let data = await Rows(sql)
  worksheet.addRows(data)
  await _downloadWorkbook(workbook, `${fileNames.join("")}.xlsx`)
}

export const exportSummaryExcel = (sendaiData) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const workbook = new ExcelJS.Workbook()

    _generateSendaiSummarySheet(sendaiData, workbook)
    //_generateKobokuSummarySheet(sendaiData, workbook)
    //    _generateChutebokuSummarySheet(chutebokuData, workbook)

    _downloadWorkbook(
      workbook,
      `集計データ【${dayjs().format("YYYY年M月D日H時m分")}作成】.xlsx`,
      () => {
        resolve()
      }
    )
  })
}

const _downloadWorkbook = async (workbook, name, callback) => {
  const uint8Array = await workbook.xlsx.writeBuffer()
  const blob = new Blob([uint8Array], { type: "application/octet-binary" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.click()
  a.remove()
  if (callback) {
    callback()
  }
}

const _generateSendaiSummarySheet = (sendaiData, workbook) => {
  const worksheet = workbook.addWorksheet("集計表")

  worksheet.columns = [
    { header: "樹種", key: "tree_name" },
    { header: "29cm以下", key: "rank_a" },
    { header: "30〜59cm", key: "rank_b" },
    { header: "60〜89cm", key: "rank_c" },
    { header: "90〜119cm", key: "rank_d" },
    { header: "120〜149cm", key: "rank_e" },
    { header: "150〜179cm", key: "rank_f" },
    { header: "180〜209cm", key: "rank_g" },
    { header: "210〜239cm", key: "rank_h" },
    { header: "240〜269cm", key: "rank_i" },
    { header: "270〜299cm", key: "rank_j" },
    { header: "300cm以上", key: "rank_k" },
    { header: "計", key: "sum" },
  ]

  let sum = {
    name: "計",
    rank_a: 0,
    rank_b: 0,
    rank_c: 0,
    rank_d: 0,
    rank_e: 0,
    rank_f: 0,
    rank_g: 0,
    rank_h: 0,
    rank_i: 0,
    rank_j: 0,
    rank_k: 0,
    sum: 0,
  }
  for (const row of sendaiData) {
    sum.rank_a += row.rank_a ?? 0
    sum.rank_b += row.rank_b ?? 0
    sum.rank_c += row.rank_c ?? 0
    sum.rank_d += row.rank_d ?? 0
    sum.rank_e += row.rank_e ?? 0
    sum.rank_f += row.rank_f ?? 0
    sum.rank_g += row.rank_g ?? 0
    sum.rank_h += row.rank_h ?? 0
    sum.rank_i += row.rank_i ?? 0
    sum.rank_j += row.rank_j ?? 0
    sum.rank_k += row.rank_k ?? 0
    sum.sum += row["sum"] ?? 0
    worksheet.addRow(row)
  }

  worksheet.addRow(sum)
}

const _generateKobokuSummarySheet = (kobokuData, workbook) => {
  const worksheet = workbook.addWorksheet("高木幹周ランク集計表")

  worksheet.columns = [
    { header: "路線番号", key: "rosen_no" },
    { header: "路線名", key: "rosen_name" },
    { header: "樹種", key: "name" },
    { header: "29cm以下", key: "rank_a" },
    { header: "30〜59cm", key: "rank_b" },
    { header: "60〜89cm", key: "rank_c" },
    { header: "90〜119cm", key: "rank_d" },
    { header: "120〜149cm", key: "rank_e" },
    { header: "150〜179cm", key: "rank_f" },
    { header: "180〜209cm", key: "rank_g" },
    { header: "210〜239cm", key: "rank_h" },
    { header: "240〜269cm", key: "rank_i" },
    { header: "270〜299cm", key: "rank_j" },
    { header: "300cm以上", key: "rank_k" },
    { header: "路線計", key: "rosen_sum" },
  ]

  // 1行目
  worksheet.addRow({
    rank_a: "A",
    rank_b: "B",
    rank_c: "C",
    rank_d: "D",
    rank_e: "E",
    rank_f: "F",
    rank_g: "G",
    rank_h: "H",
    rank_i: "I",
    rank_j: "J",
    rank_k: "K",
  })

  let sum = {
    rosen_no: "計",
    rank_a: 0,
    rank_b: 0,
    rank_c: 0,
    rank_d: 0,
    rank_e: 0,
    rank_f: 0,
    rank_g: 0,
    rank_h: 0,
    rank_i: 0,
    rank_j: 0,
    rank_k: 0,
    rosen_sum: 0,
  }
  for (const row of kobokuData) {
    sum.rank_a += row.rank_a ?? 0
    sum.rank_b += row.rank_b ?? 0
    sum.rank_c += row.rank_c ?? 0
    sum.rank_d += row.rank_d ?? 0
    sum.rank_e += row.rank_e ?? 0
    sum.rank_f += row.rank_f ?? 0
    sum.rank_g += row.rank_g ?? 0
    sum.rank_h += row.rank_h ?? 0
    sum.rank_i += row.rank_i ?? 0
    sum.rank_j += row.rank_j ?? 0
    sum.rank_k += row.rank_k ?? 0
    sum.rosen_sum += row.rosen_sum ?? 0
    worksheet.addRow(row)
  }

  worksheet.addRow(sum)
}

const _generateChutebokuSummarySheet = (chutebokuData, workbook) => {
  const worksheet = workbook.addWorksheet("中低木高さランク集計表")

  worksheet.columns = [
    { header: "路線番号", key: "rosen_no" },
    { header: "路線名", key: "rosen_name" },
    { header: "樹種", key: "name" },
    { header: "29cm以下", key: "rank_a" },
    { header: "30〜99cm", key: "rank_b" },
    { header: "100〜199cm", key: "rank_c" },
    { header: "200〜299cm", key: "rank_d" },
    { header: "路線計", key: "rosen_sum" },
  ]

  worksheet.addRow({
    rank_a: "A",
    rank_b: "B",
    rank_c: "C",
    rank_d: "D",
  })

  let sum = {
    rosen_no: "計",
    rank_a: 0,
    rank_b: 0,
    rank_c: 0,
    rank_d: 0,
    rosen_sum: 0,
  }
  for (const row of chutebokuData) {
    sum.rank_a += row.rank_a ?? 0
    sum.rank_b += row.rank_b ?? 0
    sum.rank_c += row.rank_c ?? 0
    sum.rank_d += row.rank_d ?? 0
    sum.rosen_sum += row.rosen_sum ?? 0

    worksheet.addRow(row)
  }

  const sumRow = worksheet.addRow(sum)
}
