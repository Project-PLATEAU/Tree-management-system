import React, { useContext, useMemo } from "react"
import { RootDataContext } from "../index"
import { Box, IconButton, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ColumnDef from "../../../master_data"
import { Close as CloseIcon } from "@mui/icons-material"

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#d1ec8e",
    margin: "8px 4px",
    fontSize: "12px",
    padding: "2px 8px 2px 16px",
    alignItems: "center",
    borderRadius: "8px",
    whiteSpace: "nowrap",
  },
})

const RootFilterSelectedView = (props) => {
  const { state, clearSelectedData } = useContext(RootDataContext)
  const classes = useStyles()
  const columns = useMemo(
    () =>
      ColumnDef.reduce((l, v) => {
        l[v.field] = v
        return l
      }, {}),
    []
  )

  const onRemove = () => {
    clearSelectedData()
  }

  return (
    <>
      {state.selectedData && (
        <>
          <Typography
            style={{ margin: "18px 8px", whiteSpace: "nowrap" }}
            fontSize="small"
          >
            選択中：
          </Typography>
          <Box className={classes.box}>
            <Box>{columns[state.selectedData.field]?.headerName}：</Box>
            <Box>{state.selectedData.displayValue}</Box>
            <IconButton>
              <CloseIcon fontSize="small" onClick={onRemove} />
            </IconButton>
          </Box>
        </>
      )}
    </>
  )
}

export default RootFilterSelectedView
