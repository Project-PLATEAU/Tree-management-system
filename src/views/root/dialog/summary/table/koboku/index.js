import React, { useEffect, useMemo, useState } from "react"
import { makeStyles } from "@mui/styles"
import { Typography, Box } from "@mui/material"
import "ag-grid-enterprise"
import "ag-grid-enterprise/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import { AgGridColumn, AgGridReact } from "ag-grid-react"
import LOCALE_JA from "../../../../../../resources/aggrid/locale.ja"
import ColumnDef from "./column"
import PropTypes from "prop-types"
import GairojuManager from "../../../../../../manager/gairoju"
import { useReadLocalStorage } from "../../../../../../manager/localStorage"

const useStyles = makeStyles({
  root: {
    color: "inherit",
  },
})

const DialogSummaryTableKoboku = (props) => {
  const classes = useStyles()
  const [filterData] = useReadLocalStorage("filter")
  const [columnDef, setColumnDef] = useState(ColumnDef({}))
  const [columnApi, setColumnApi] = useState(null)
  const [gridApi, setGridApi] = useState(null)

  const onGridReady = (params) => {
    setGridApi(params.api)
    setColumnApi(params.columnApi)
  }

  return (
    <Box className={props.className + " " + classes.root} style={props.style}>
      <AgGridReact
        onGridReady={onGridReady}
        columnDefs={columnDef}
        className={`${classes.root} ag-theme-balham`}
        localeText={LOCALE_JA}
        headerHeight={20}
        rowData={props.data}
        groupIncludeFooter={true}
        groupIncludeTotalFooter={true}
        defaultColDef={{
          resizable: true,
          sortable: true,
        }}
      />
    </Box>
  )
}

DialogSummaryTableKoboku.propTypes = {
  className: PropTypes.string,
  style: PropTypes.any,
  data: PropTypes.array,
}

export default DialogSummaryTableKoboku
