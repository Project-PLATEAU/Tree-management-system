import React from "react"
import dayjs from "dayjs"
import {
  distinctFilterParams,
  distinctShikuchosonFilterParams,
  teibokuFilterParams,
} from "../../../manager/filter"
import GairojuManager from "../../../manager/gairoju"


const RootTableColumnDef = (options) => [
  {
    field: "tree_id",
    headerName: "樹木ID",
    filter: "agTextColumnFilter",
    sort: "asc",
    pinned: "left",
    editable: false,
    sheetStatic: true,

    cellRendererFramework: (params) => {
      return (
        <span
          style={{
            color: "#38389d",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {params.value}
        </span>
      )
    },
  },
  {
    field: "citycode",
    headerName: "市区町村コード",
    filterParams: distinctFilterParams,
    hide: true,
    editable: false,
    editVisible: false,
  },
  {
    field: "cityname",
    headerName: "市区町村名",
    filterParams: distinctShikuchosonFilterParams,
  },
  {
    field: "parkname",
    headerName: "公園名",
    filterParams: distinctFilterParams,
  },
  {
    field: "area_id",
    headerName: "エリアID",
    filterParams: distinctFilterParams,
  },
  {
    field: "area_name",
    headerName: "エリア名",
    filterParams: distinctFilterParams,
  },
  {
    field: "administrator",
    headerName: "管理者",
    filterParams: distinctFilterParams,
  },
  {
    field: "tree_name",
    headerName: "樹名",
    filterParams: distinctFilterParams,
  },
  {
    field: "taxon",
    headerName: "樹木タイプ",
    filterParams: distinctFilterParams,
  },
  {
    headerName: "樹高(m)",
    field: "height",
    unit: "m",
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "胸高直径(cm)",
    field: "diameter",
    unit: "cm",
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "幹周(cm)",
    field: "perimeter",
    unit: "cm",
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "枝張(m)",
    field: "width",
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "樹冠長(m)",
    field: "crown_height",
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "枝下高(m)",
    field: "trunk_height",
    filter: "agNumberColumnFilter",
  },
  {
    field: "carbon_storage_kg",
    headerName: "炭素貯蔵量（kg）",
    filter: "agNumberColumnFilter",
  },
  {
    field: "carbon_dioxide_absorption",
    headerName: "CO₂吸収量（kg/年）",
    filter: "agNumberColumnFilter",
  },
  {
    field: "rainwater_canopy_interception",
    headerName: "雨水樹冠遮断量（m3/年）",
    filter: "agNumberColumnFilter",
  },
  {
    field: "environmental_index_measurement_date",
    headerName: "環境指標計測日",
    filter: "agDateColumnFilter",
  },
  // {
  //   field: "is_dead",
  //   headerName: "枯損",
  //   filter: "agNumberColumnFilter",
  //   hide: true,
  // },
  // {
  //   field: "is_remove",
  //   headerName: "撤去",
  //   filter: "agNumberColumnFilter",
  //   hide: true,
  // },
  {
    field: "note",
    headerName: "メモ",
    filter: "agTextColumnFilter",
  },
]

export default RootTableColumnDef
