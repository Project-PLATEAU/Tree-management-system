import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { Box, IconButton, Typography } from "@mui/material"
import {
  SkipNext as SkipNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  SkipPrevious as SkipPreviosIcon,
} from "@mui/icons-material"
import { makeStyles } from "@mui/styles"

import { AgGridColumn, AgGridReact } from "ag-grid-react"
import LOCALE_JA from "../../../resources/aggrid/locale.ja"
//import DefaultColumnDef from "./column"
import TablePhotoCellRenderer from "./render/photoCell"
import PropTypes from "prop-types"
import GairojuManager from "../../../manager/gairoju"
import dayjs from "dayjs"
import { RootDataContext } from "../index"
import TableDiagnosticPdfCellRenderer from "./render/diagnosticPdfCell"
import TableStatusBarEditComponent from "./statusBar/edit"
import DefaultColumnDef from "../../../master_data"
const tableSavedStateKey = "root-table-state-key"

// スタイル定義
const useStyle = makeStyles({
  root: {
    height: "calc(100% - 40px) !important",
    color: "inherit",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "end",
    color: "#6c6c6c",
    fontSize: "12px",
    marginRight: "16px",
  },
  pageButton: {
    padding: "0 !important",
    margin: "0 !important",
    color: "#999",
  },
})

let _gridApi = null

const LOCAL_STORAGE_COLUMN_STATE_KEY = "__column_state"

const RootTableView = (props) => {
  // スタイル
  const classes = useStyle()
  // AgGridのGridAPI
  //  const [gridApi, setGridApi] = useState(null)
  // AgGridのColumnAPI
  //const [columnApi, setColumnApi] = useState(null)

  const gridApiRef = useRef()
  const columnApiRef = useRef()
  const editedDataRef = useRef()

  const {
    state,
    setFilterData,
    setSortData,
    setColumnState,
    setSelectedData,
    setListEditedData,
  } = useContext(RootDataContext)

  const [startPageItemNumber, setStartPageItemNumber] = useState(0)
  const [endPageItemNumber, setEndPageItemNumber] = useState(0)
  const [totalPageItemNumber, setTotalPageItemNumber] = useState(0)
  const [currentPageNumber, setCurrentPageNumber] = useState(0)
  const [totalPageNumber, setTotalPageNumber] = useState(0)
  const [initColumnState, setInitColumnState] = useState(false)

  const [columnDef, setColumnDef] = useState([...DefaultColumnDef])

  useEffect(() => {
    if (!gridApiRef.current) {
      return
    }
    state.filterData && gridApiRef.current.setFilterModel(state.filterData)
    state.sortData && gridApiRef.current.setSortModel(state.sortData)
  }, [state.filterData, state.sortData])

  useEffect(() => {
    if (!columnApiRef.current) {
      return
    }
    console.log("[AgGrid]", "column api column state effected")
    if (localStorage.getItem(LOCAL_STORAGE_COLUMN_STATE_KEY)) {
      if (!initColumnState) {
        columnApiRef.current.applyColumnState({
          state: JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_COLUMN_STATE_KEY)
          ),
          applyOrder: true,
        })
        setInitColumnState(true)
      }
    } else {
      columnApiRef.current.resetColumnState()
      setInitColumnState(false)
    }
  }, [state.columnState])

  useEffect(() => {
    if (!gridApiRef.current || !state.refreshTime) {
      return
    }
    console.log(gridApiRef.current)
    gridApiRef.current.refreshServerSideStore()
  }, [state.refreshTime])

  const onGridReady = (params) => {
    _gridApi = params.api

    gridApiRef.current = params.api
    columnApiRef.current = params.columnApi

    params.api.setServerSideDatasource(dataSource)
  }

  const dataSource = {
    async getRows(params) {
      await GairojuManager.tableQuery(params)
    },
  }

  const onCellClicked = (e) => {}

  const onCellFocused = async (e) => {
    let row = gridApiRef.current.getDisplayedRowAtIndex(e.rowIndex)
    if (!row || !row.data || !Object.keys(row.data).includes(e.column.colId)) {
      return
    }
    let value = row.data[e.column.colId]

    // 同じ場所をクリックしたらクリアする
    if (
      state.selectData?.rowIndex === e.rowIndex &&
      state.selectData?.colId === e.column.colId
    ) {
      setSelectedData(null)
    } else {
      let colId = e.column.colId
      let displayValue = value

      switch (colId) {
        case "date":
          displayValue = dayjs(value).format("YYYY年MM月DD日")
          break
        case "tree_id":
          props.showDetailDialog(row.data)
          break
        case "diagnostic_pdf":
          window.open(value)
          break
        case "hasmushrooms":
          if (value === true) {
            displayValue = "あり"
          } else if (value === false) {
            displayValue = "なし"
          } else {
            displayValue = "(空白)"
          }
          break
        case "treevigor":
          if (value === "good") {
            displayValue = "良い"
          } else if(value === "poor") {
            displayValue = "少し悪い"
          } else if(value === "bad") {
            displayValue = "悪い"
          } else if(value === "died") {
            displayValue = "枯死"
          } else {
            displayValue = "(空白)"
          }
          break
        default:
          break
      }

      setSelectedData({
        value,
        displayValue,
        colId,
        rowIndex: e.rowIndex,
        field: e.column.colDef.field,
      })
    }
  }

  const onFilterChanged = (e) => {
    setFilterData(gridApiRef.current.getFilterModel())
  }

  const onSortChanged = (e) => {
    setSortData(gridApiRef.current.getSortModel())
    onColumnStateChanged()
  }

  const onPaginationChanged = (e) => {
    if (gridApiRef.current) {
      setCurrentPageNumber(
        gridApiRef.current.paginationGetPageSize() === 0
          ? 0
          : gridApiRef.current.paginationGetCurrentPage() + 1
      )
      setStartPageItemNumber(
        gridApiRef.current.paginationGetPageSize() === 0
          ? 0
          : gridApiRef.current.paginationGetCurrentPage() *
              gridApiRef.current.paginationGetPageSize() +
              1
      )
      setEndPageItemNumber(
        gridApiRef.current.paginationGetPageSize() === 0
          ? 0
          : gridApiRef.current.paginationGetCurrentPage() *
              gridApiRef.current.paginationGetPageSize() +
              gridApiRef.current.paginationGetPageSize() >
            gridApiRef.current.paginationGetRowCount()
          ? gridApiRef.current.paginationGetRowCount()
          : gridApiRef.current.paginationGetCurrentPage() *
              gridApiRef.current.paginationGetPageSize() +
            gridApiRef.current.paginationGetPageSize()
      )
      setTotalPageItemNumber(gridApiRef.current.paginationGetRowCount())
      setTotalPageNumber(
        gridApiRef.current.paginationGetPageSize() === 0
          ? 0
          : Math.ceil(
              gridApiRef.current.paginationGetRowCount() /
                gridApiRef.current.paginationGetPageSize()
            )
      )
    }
  }

  const onFirstPage = () => {
    gridApiRef.current.paginationGoToFirstPage()
  }

  const onLastPage = () => {
    gridApiRef.current.paginationGoToLastPage()
  }

  const onNextPage = () => {
    gridApiRef.current.paginationGoToNextPage()
  }

  const onPrevPage = () => {
    gridApiRef.current.paginationGoToPreviousPage()
  }

  const onColumnStateChanged = (e) => {
    if (!columnApiRef.current) {
      return
    }
    localStorage.setItem(
      LOCAL_STORAGE_COLUMN_STATE_KEY,
      JSON.stringify(columnApiRef.current.getColumnState())
    )
    setColumnState(columnApiRef.current.getColumnState())
  }

  const onCellEditingStarted = (e) => {
    console.log("[Editing]", "start", e)
  }

  useEffect(() => {
    console.log("[Update]", "list edited data", state.listEditedData)
  }, [state.listEditedData])

  const changed = (e) => {
    setListEditedData({ hoge: "fuga" })
  }

  const onCellValueChanged = (e) => {
    console.log("[CellValueChanged]", e)
  }

  const onCellEditingStopped = (e) => {
    console.log("[CellEditingStopped]", e)
    if (e.newValue === undefined) {
      return
    }
    console.log(state.listEditedData)
    let prev = { ...state.listEditedData }
    if (!Object.keys(prev).includes(e.data.tree_id)) {
      console.log("no tree_id")
      prev = {
        ...prev,
        [e.data.tree_id]: {
          [e.column.colId]: { old: e.oldValue, new: e.newValue },
        },
      }
    } else if (!Object.keys(prev[e.data.tree_id]).includes(e.column.colId)) {
      console.log("no colId")
      prev = {
        ...prev,
        [e.data.tree_id]: {
          ...prev[e.data.tree_id],
          [e.column.colId]: { old: e.oldValue, new: e.newValue },
        },
      }
    } else if (prev[e.data.tree_id][e.column.colId].old === e.newValue) {
      console.log("revert value")
      delete prev[e.data.tree_id][e.column.colId]
      if (Object.keys(prev[e.data.tree_id]).length === 0) {
        delete prev[e.data.tree_id]
      }
    } else {
      console.log("update value")
      prev[e.data.tree_id][e.column.colId].new = e.newValue
    }
    console.log("[update]", prev)
    if (Object.keys(prev).length === 0) {
      setListEditedData(null)
      editedDataRef.current = null
    } else {
      setListEditedData(prev)
      editedDataRef.current = prev
    }
    gridApiRef.current.refreshCells({
      force: true,
      rowNodes: [e.node],
      columns: [e.column.colId],
    })
  }

  const onSave = useCallback(() => {
    console.log(state.listEditedData)
  }, [state.listEditedData])

  const onRefresh = () => {
    editedDataRef.current = null
    gridApiRef.current.refreshServerSideStore({ purge: true })
  }

  const setCellStyle = useCallback(
    (params) => {
      if (!editedDataRef.current) {
        return null
      }

      console.log("[CellStyle]", params, editedDataRef.current)
      if (
        Object.keys(editedDataRef.current).includes(params.data.tree_id) &&
        Object.keys(editedDataRef.current[params.data.tree_id]).includes(
          params.column.colId
        )
      ) {
        return { "font-weight": "bold" }
      }

      return null
    },
    [editedDataRef.current]
  )

  return (
    <>
      <AgGridReact
        className={`${classes.root} ag-theme-balham`}
        onGridReady={onGridReady}
        onCellClicked={onCellClicked}
        onCellFocused={onCellFocused}
        onFilterChanged={onFilterChanged}
        onSortChanged={onSortChanged}
        onColumnResized={onColumnStateChanged}
        onColumnVisible={onColumnStateChanged}
        onColumnRowGroupChanged={onColumnStateChanged}
        onColumnValueChanged={onColumnStateChanged}
        onColumnPinned={onColumnStateChanged}
        onColumnMoved={onColumnStateChanged}
        onColumnPivotChanged={onColumnStateChanged}
        onPaginationChanged={onPaginationChanged}
        onCellValueChanged={onCellValueChanged}
        onCellEditingStarted={onCellEditingStarted}
        onCellEditingStopped={onCellEditingStopped}
        rowModelType="serverSide"
        localeText={LOCALE_JA}
        overlayLoadingTemplate={
          '<span className="ag-overlay-loading-center">読込中...</span>'
        }
        serverSideStoreType="partial"
        rowSelection="multiple"
        enableRangeSelection={true}
        rowHeight={30}
        headerHeight={20}
        suppressRowClickSelection={true}
        suppressPaginationPanel={true}
        floatingFiltersHeight={20}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          floatingFilter: true,
          editable: true,
          cellStyle: setCellStyle,
        }}
        columnDefs={columnDef}
        statusBar={{
          statusPanels: [
            {
              statusPanel: "editStatusBar",
              statusPanelParams: {
                onRefresh,
              },
            },
          ],
        }}
        sideBar={{
          toolPanels: [
            {
              id: "columns",
              labelDefault: "列選択",
              labelKey: "columns",
              iconKey: "columns",
              toolPanel: "agColumnsToolPanel",
              toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true,
                suppressColumnFilter: true,
                suppressColumnSelectAll: true,
                suppressColumnExpandAll: true,
              },
            },
          ],
          //          defaultToolPanel: "columns",
        }}
        frameworkComponents={{
          photoCellRenderer: TablePhotoCellRenderer,
          diagnosticPdfCellRenderer: TableDiagnosticPdfCellRenderer,
          editStatusBar: TableStatusBarEditComponent,
        }}
      ></AgGridReact>
      <Box style={{ height: "30px" }} className={classes.footer}>
        表示中の樹木本数：{startPageItemNumber.toLocaleString()}〜
        {endPageItemNumber.toLocaleString()}本 全体の樹木本数：
        {totalPageItemNumber.toLocaleString()}本
        <Box sx={{ m: 2 }} />
        <IconButton
          size="small"
          className={classes.pageButton}
          onClick={onFirstPage}
        >
          <SkipPreviosIcon />
        </IconButton>
        <IconButton
          size="small"
          className={classes.pageButton}
          onClick={onPrevPage}
        >
          <NavigateBeforeIcon />
        </IconButton>
        ページ：{currentPageNumber.toLocaleString()} / 全ページ{" "}
        {totalPageNumber.toLocaleString()}
        <IconButton
          size="small"
          className={classes.pageButton}
          onClick={onNextPage}
        >
          <NavigateNextIcon />
        </IconButton>
        <IconButton
          size="small"
          className={classes.pageButton}
          onClick={onLastPage}
        >
          <SkipNextIcon />
        </IconButton>
      </Box>
    </>
  )
}

RootTableView.propTypes = {
  windowUuid: PropTypes.string,
  showDetailDialog: PropTypes.func,
}

export default RootTableView
