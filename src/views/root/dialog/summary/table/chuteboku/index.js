import React, { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import PropTypes from "prop-types"
import "ag-grid-enterprise"
import "ag-grid-enterprise/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import { AgGridColumn, AgGridReact } from "ag-grid-react"
import LOCALE_JA from "../../../../../../resources/aggrid/locale.ja"
import ColumnDef from "./column"
import { useReadLocalStorage } from "../../../../../../manager/localStorage"
import GairojuManager from "../../../../../../manager/gairoju"

const useStyles = makeStyles({
  root: {
    color: "inherit",
  },
})

const DialogSummaryTableChutebokuView = (props) => {
  const classes = useStyles()
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
        groupIncludeTotalFooter={true}
        defaultColDef={{
          resizable: true,
          sortable: true,
        }}
      />
    </Box>
  )
}

DialogSummaryTableChutebokuView.propTypes = {
  className: PropTypes.string,
  style: PropTypes.any,
  data: PropTypes.array,
}

export default DialogSummaryTableChutebokuView
