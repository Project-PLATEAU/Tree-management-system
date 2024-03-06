import React from "react"
import { IconButton } from "@mui/material"
import { PictureAsPdf as PictureAsPdfIcon } from "@mui/icons-material"
import { makeStyles } from "@mui/styles"
import PropTypes from "prop-types"

const useStyles = makeStyles({})

const TableDiagnosticPdfCellRenderer = (props) => {
  if (!props.value) {
    return <></>
  }

  return (
    <IconButton size="small">
      <PictureAsPdfIcon fontSize="small" />
    </IconButton>
  )
}

TableDiagnosticPdfCellRenderer.propTypes = {
  value: PropTypes.any,
}

export default TableDiagnosticPdfCellRenderer
