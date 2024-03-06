import React from "react"
import {
  SheetCheckData,
  SheetDateData,
  SheetFloatData,
  SheetIntData,
  SheetNameListData,
  SheetStandardData,
  SheetStringData,
} from "./manager/street"
import { distinctFilterParams } from "./manager/filter"
import { Query, Rows } from "./manager/carto"
import GairojuManager from "./manager/gairoju"

export default [
  {
    field: "tree_id",
    headerName: "樹木ID",
    filter: "agTextColumnFilter",
    sort: "asc",
    pinned: "left",
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
    sheet: {
      ...SheetStringData,
      type: "text",
      disable: true,
      static: true,
      primary_key: 1,
    },
  },
  {
    field: "measurement_date",
    headerName: "計測日",
    filter: "agDateColumnFilter",
    sheet: {
      ...SheetDateData,
      type: "date",
    },
  },
  {
    field: "latitude",
    headerName: "緯度",
    hide: true,
    filter: "agNumberColumnFilter",
    sheet: { ...SheetFloatData, type: "float", fixed: 6, visible: false },
  },
  {
    field: "longitude",
    headerName: "経度",
    hide: true,
    filter: "agNumberColumnFilter",
    sheet: { ...SheetFloatData, type: "float", fixed: 6, visible: false },
  },
  {
    field: "ground_level",
    headerName: "地盤高",
    filter: "agNumberColumnFilter",
    sheet: { ...SheetFloatData, type: "float", fixed: 1 },
  },
  {
    field: "citycode",
    headerName: "市区町村コード",
    filterParams: distinctFilterParams,
    sheet: {
      type: "string",
      editable: false,
      visible: false,
    },
  },
  {
    field: "cityname",
    headerName: "市区町村名",
    filterParams: distinctFilterParams,
    sheet: {
      ...SheetNameListData,
      type: "string",
      value_col: "citycode",
      name_col: "cityname",
    },
  },
  {
    field: "parkname",
    headerName: "公園名",
    filterParams: distinctFilterParams,
    sheet: {
      ...SheetNameListData,
      type: "string",
      value_col: "parkname",
      name_col: "parkname",
    },
  },
  {
    field: "area_id",
    headerName: "エリアID",
    filter: "agNumberColumnFilter",
    sheet: { type: "string", visible: false, editable: false },
  },
  {
    field: "area_name",
    headerName: "エリア名",
    filterParams: distinctFilterParams,
    sheet: {
      ...SheetNameListData,
      type: "string",
      name_col: "area_name",
      value_col: "area_id",
    },
  },
  {
    field: "administrator",
    headerName: "管理者",
    filterParams: distinctFilterParams,
    sheet: {
      ...SheetNameListData,
      type: "string",
      value_col: "administrator",
      name_col: "administrator",
    },
  },
  {
    field: "tree_name",
    headerName: "種名",
    filterParams: distinctFilterParams,
    sheet: {
      ...SheetNameListData,
      type: "string",
      value_col: "tree_name",
      name_col: "tree_name",
    },
  },
  {
    field: "tree_type",
    headerName: "樹木タイプ",
    filterParams: distinctFilterParams,
    sheet: {
      ...SheetNameListData,
      type: "string",
      value_col: "tree_type",
      name_col: "tree_type",
    },
  },
  {
    field: "height",
    headerName: "樹高",
    filter: "agNumberColumnFilter",
    sheet: { ...SheetFloatData, type: "float", fixed: 1, unit: "m" },
  },
  {
    field: "diameter",
    headerName: "胸高直径",
    filter: "agNumberColumnFilter",
    sheet: { ...SheetIntData, type: "int", unit: "cm" },
  },
  {
    field: "perimeter",
    headerName: "幹周",
    filter: "agNumberColumnFilter",
    sheet: { ...SheetIntData, type: "int", unit: "cm" },
  },
  {
    field: "width",
    headerName: "枝張",
    filter: "agNumberColumnFilter",
    sheet: { ...SheetFloatData, type: "float", fixed: 1, unit: "m" },
  },
  {
    field: "crown_height",
    headerName: "樹冠高",
    filter: "agNumberColumnFilter",
    sheet: { ...SheetFloatData, type: "float", fixed: 1, unit: "m" },
  },
  {
    field: "trunk_height",
    headerName: "枝下高",
    filter: "agNumberColumnFilter",
    sheet: { ...SheetFloatData, type: "float", fixed: 1, unit: "m" },
  },
  {
    field: "carbon_storage",
    headerName: "炭素固定量",
    filter: "agNumberColumnFilter",
    sheet: { ...SheetFloatData, type: "float", fixed: 7, unit: "kg" },
  },
  {
    field: "carbon_dioxide_absorption",
    headerName: "二酸化炭素吸収量",
    filter: "agNumberColumnFilter",
    sheet: { ...SheetFloatData, type: "number", fixed: 8, unit: "kg/年" },
  },
  {
    field: "rainwater_canopy_interception",
    headerName: "雨水樹冠遮断量",
    filter: "agNumberColumnFilter",
    sheet: { type: "number", editable: false },
  },
  {
    field: "environmental_index_measurement_date",
    headerName: "環境指標計測日",
    filter: "agDateColumnFilter",
    sheet: { ...SheetDateData, type: "date" },
  },
  {
    field: "is_dead",
    headerName: "枯損",
    filterParams: distinctFilterParams,
    sheet: {
      ...SheetCheckData,
      type: "boolean",
      getValues: (def) => {
        return [{ name: "あり", value: true }, { name: "なし" }]
      },
    },
    map: {
      type: "boolean",
      getGridValue: (value) => {
        switch(value) {
          case "あり":
            return true
          case "なし":
            return false
          case "(空白)":
            return null
          default:
            // eslint-disable-next-line no-throw-literal
            throw "unknown value type"
        }
      },
    },
  },
  {
    field: "is_remove",
    headerName: "移植",
    filterParams: distinctFilterParams,
    sheet: { ...SheetCheckData, type: "boolean" },
  },
  {
    field: "note",
    headerName: "メモ",
    filter: "agTextColumnFilter",
    sheet: { ...SheetStringData, type: "string" },
  },
  {
    field: "hasmushrooms",
    headerName: "腐朽菌有無",
    filterParams: {
      values: (params) => {
        params.success(["(空白)", "あり", "なし"])
      },
      refreshValuesOnOpen: true,
    },
    cellRenderer: (param) => {
      switch (param.value) {
        case true:
          return "あり"
        case false:
          return "なし"
        default:
          return ""
      }
    },
    getValues: (def) => {
      return [
        { value: true, name: "あり" },
        { value: false, name: "なし" },
      ]
    },
    sheet: {
      ...SheetNameListData,
      type: "boolean",
      editor_type: "select",
      editable: true,
      name_col: "hasmushrooms",
      value_col: "hasmushrooms",
      getValues: (def) => {
        return [
          { value: true, name: "あり" },
          { value: false, name: "なし" },
        ]
      },
    },
  },
  {
    field: "treevigor",
    headerName: "樹勢",
    filterParams: {
      values: (params) => {
        params.success(["(空白)", "良い", "少し悪い", "悪い", "枯死"])
      },
      refreshValuesOnOpen: true,
    },
    cellRenderer: (param) => {
//      console.log("[OpenTreevigor]", "cell renderer", param)
      switch (param.value) {
        case "good":
          return "良い"
        case "poor":
          return "少し悪い"
        case "bad":
          return "悪い"
        case "died":
          return "枯死"
        default:
          return ""
      }
    },
    getValues: (def) => {
      return [
        { value: "good", name: "良い" },
        { value: "poor", name: "少し悪い" },
        { value: "bad", name: "悪い" },
        { value: "died", name: "枯死" },
      ]
    },
    sheet: {
      ...SheetNameListData,
      editor_type: "select",
      type: "string",
      name_col: "treevigor",
      value_col: "treevigor",
      getValues: (def) => {
        return [
          { value: "good", name: "良い" },
          { value: "poor", name: "少し悪い" },
          { value: "bad", name: "悪い" },
          { value: "died", name: "枯死" },
        ]
      },
    },
  },
]
