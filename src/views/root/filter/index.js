import React, { useContext, useEffect, useMemo, useState } from "react"
import { Box, Button, IconButton, Typography } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import PropTypes from "prop-types"
import ColumnDef from "../table/column"
import { makeStyles } from "@mui/styles"
import { RootDataContext } from "../index"
import SelectedView from "./selected"
import FilterView from "./filter"

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  selectTag: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#d1ec8e",
    margin: "8px 4px",
    fontSize: "12px",
    padding: "2px 8px 2px 16px",
    alignItems: "center",
    borderRadius: "8px",
  },
  tag: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#b28eed",
    margin: "8px 4px",
    fontSize: "12px",
    padding: "2px 8px 2px 16px",
    alignItems: "center",
    borderRadius: "8px",
  },
  clearButton: {
    marginRight: "16px !important",
  },
  clearButtonText: {
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
})

const RootFilterView = (props) => {
  const {
    state,
    setSelectedData,
    setFilterData,
    setColumnState,
    clearColumnState,
    clearSelectedData,
  } = useContext(RootDataContext)

  const [columns, setColumns] = useState({})
  const classes = useStyles()
  const columnDef = ColumnDef({})

  const selectedData = useMemo(() => state.selectedData, [state.selectedData])
  const filterData = useMemo(() => state.filterData, [state.filterData])

  useEffect(() => {
    let vals = {}
    columnDef.forEach((v) => {
      vals[v.field] = v
    })
    setColumns(vals)
  }, [])

  const onRemove = async (key) => {
    let data = { ...state.filterData }
    delete data[key]
    setFilterData(data)
  }

  const onUnselect = async () => {
    clearSelectedData()
  }

  const onResetColumn = async () => {
    console.log("onResetColumn")
    await setColumnState(false)
  }

  return (
    <Box className={classes.root}>
      <Box style={{ display: "flex", overflowX: "auto" }}>
        <SelectedView />
        <FilterView />
      </Box>
      <Box style={{ flexGrow: 1 }} />
      <Button className={classes.clearButton} onClick={onResetColumn}>
        <Typography className={classes.clearButtonText} fontSize="small">
          表示列初期化
        </Typography>
      </Button>
    </Box>
  )
}

RootFilterView.propTypes = {
  openMap: PropTypes.any,
}

export default RootFilterView
