import React, { useContext, useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@mui/styles"
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  Typography,
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import Datatable from "./content/detail/datatable"
import Map from "./content/detail/map"
import { AuthDataContext } from "../../../../App"
import DialogDetailContentDetailView from "./content/detail"
import DialogDetailContentEditView from "./content/edit"
import { First } from "../../../../manager/carto"
import { RootDataContext } from "../../index"
import DialogDetailContentHistoryView from "./content/history"
import DialogDetailContentCommentView from "./content/comment"
import DialogDetailContentWorkLogView from "./content/workLog"

const useStyles = makeStyles({
  root: {
    display: "flex",
    color: "inherit",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  dialog: {
    position: "relative",
    top: "15%",
    left: "15%",
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
  },
})

const ViewType = {
  Detail: "detail",
  WorkLog: "work_log",
  Comments: "comments",
  Edit: "edit",
  History: "history",
}

const RootDialogDetailView = (props) => {
  const classes = useStyles()
  const contentRef = useRef(null)
  const { authState } = useContext(AuthDataContext)
  const { state, setRefreshTime } = useContext(RootDataContext)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [viewType, setViewType] = useState(ViewType.Detail)
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    console.log("Detail", "update refresh time", state.refreshTime)
    if (!props.treeId) {
      return
    }
    loadData()
  }, [state.refreshTime])

  useEffect(() => {
    setRefreshTime()
  }, [viewType])

  const loadData = () => {
    setLoading(true)
    First(`
      SELECT * FROM ${process.env.REACT_APP_TABLE_TREE_VIEW}
      WHERE tree_id = '${props.treeId}'`)
      .then((res) => {
        setLoading(false)
        setData(res)
      })
      .catch((e) => {
        setLoading(false)
        console.log(e)
      })
  }

  // useEffect(() => {
  //   console.log("Dialog Detail view data", props.data)
  // }, [props.data])

  return (
    <Box className={classes.dialog}>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: "30px",
          marginLeft: "8px",
          gap: "8px",
        }}
      >
        <Typography variant="h6">
          {viewType === ViewType.Detail && "詳細画面"}
          {viewType === ViewType.WorkLog && "管理履歴"}
          {viewType === ViewType.Comments && "相談記録"}
          {viewType === ViewType.Edit && "データ編集"}
          {viewType === ViewType.History && "編集履歴"}
        </Typography>
        <Box flexGrow={1} />

        <>
          <Button
            variant="contained"
            onClick={() => setViewType(ViewType.Detail)}
            disabled={viewType === ViewType.Detail}
          >
            詳細画面
          </Button>
          <Button
            variant="contained"
            onClick={() => setViewType(ViewType.WorkLog)}
            disabled={viewType === ViewType.WorkLog}
          >
            管理履歴
          </Button>
          <Button
            variant="contained"
            onClick={() => setViewType(ViewType.Comments)}
            disabled={viewType === ViewType.Comments}
          >
            相談記録
          </Button>
          <Button
            variant="contained"
            onClick={() => setViewType(ViewType.Edit)}
            disabled={viewType === ViewType.Edit}
          >
            データ編集
          </Button>
          <Button
            variant="contained"
            onClick={() => setViewType(ViewType.History)}
            disabled={viewType === ViewType.History}
          >
            編集履歴
          </Button>
        </>
        <IconButton onClick={() => props.onClose(updated)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider style={{ margin: "8px" }} />
      {data && (
        <Box className={classes.content}>
          {viewType === ViewType.Detail && (
            <DialogDetailContentDetailView data={data} />
          )}
          {viewType === ViewType.WorkLog && (
            <DialogDetailContentWorkLogView treeId={data.tree_id} />
          )}
          {viewType === ViewType.Comments && (
            <DialogDetailContentCommentView treeId={data.tree_id} />
          )}
          {viewType === ViewType.Edit && (
            <DialogDetailContentEditView
              data={data}
              onUpdated={() => {
                setUpdated(true)
              }}
            />
          )}
          {viewType === ViewType.History && (
            <DialogDetailContentHistoryView treeId={data.tree_id} />
          )}
        </Box>
      )}
    </Box>
  )
}

RootDialogDetailView.propTypes = {
  style: PropTypes.any,
  className: PropTypes.string,
  data: PropTypes.any,
  treeId: PropTypes.string,
  onClose: PropTypes.func,
}

export default RootDialogDetailView
