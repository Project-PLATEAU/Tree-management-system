import React, { useContext, useEffect, useRef, useState } from "react"
import { makeStyles } from "@mui/styles"
import { Box, Button, Divider, IconButton, Typography } from "@mui/material"
import SendaiTable from "./table/sendai"
import { Close as CloseIcon } from "@mui/icons-material"
import PropTypes from "prop-types"
import GairojuManager from "../../../../manager/gairoju"
import { exportSummaryExcel } from "../../../../manager/excel"
import { RootDataContext } from "../../index"

const useStyles = makeStyles({
  root: {
    display: "flex",
    color: "inherit",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  dialog: {
    padding: "8px",
    minWidth: "500",
    width: "70%",
    minHeight: "500",
    height: "70%",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "1px 8px 12px 0 rgba(0,0,0, .5)",
  },
  title: {
    height: "20px",
  },
  content: {
    height: "calc(100% - 48px)",
    display: "flex",
    flexDirection: "column",
  },
})

const RootDialogSummaryView = (props) => {
  const classes = useStyles()
  const { state } = useContext(RootDataContext)
  // const [kobokuData, setKobokuData] = useState([])
  // const [chutebokuData, setChutebokuData] = useState([])
  const [sendaiData, setSendaiData] = useState([])

  useEffect(() => {
    GairojuManager.sendaiSummaryQuery(state.filterData).then((ret) => {
      setSendaiData(ret)
    })

    // GairojuManager.kobokuSummaryQuery(state.filterData).then((ret) => {
    //   setKobokuData(ret)
    // })
    // GairojuManager.chuteibokuSummaryQuery(state.filterData).then((ret) => {
    //   setChutebokuData(ret)
    // })
  }, [state.filterData])

  const onExcelExport = async () => {
    await exportSummaryExcel(sendaiData)
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.dialog}>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "30px",
            marginLeft: "8px",
          }}
        >
          <Typography variant="h6">ランク集計表</Typography>
          <Box flexGrow={1} />
          <Button variant="outlined" size="small" onClick={onExcelExport}>
            Excel出力
          </Button>
          <Box sx={{ m: 1 }} />
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider style={{ margin: "8px" }} />
        <Box className={classes.content}>
          <Box
            style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography style={{ marginLeft: "16px" }} fontSize="small">
              集計表
            </Typography>
            <SendaiTable data={sendaiData} style={{ flexGrow: 1 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

RootDialogSummaryView.propTypes = {
  onClose: PropTypes.func,
}

export default RootDialogSummaryView
