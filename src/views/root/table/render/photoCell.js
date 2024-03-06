import React from "react"
import { IconButton } from "@mui/material"
import { Photo as PhotoIcon } from "@mui/icons-material"
import { makeStyles } from "@mui/styles"
import PropTypes from "prop-types"

const useStyles = makeStyles({})

const TablePhotoCellRenderer = (props) => {
  if (!props.value) {
    return <></>
  }

  return (
    <IconButton size="small">
      <PhotoIcon fontSize="small" />
    </IconButton>
  )
}

TablePhotoCellRenderer.propTypes = {
  value: PropTypes.any,
}

export default TablePhotoCellRenderer
