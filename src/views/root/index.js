import React, { useEffect, useRef, useState } from "react"
import {
  Box,
  Typography,
  Modal,
  ClickAwayListener,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material"
import { makeStyles } from "@mui/styles"
import UseRootViewData from "./data"
import FilterView from "./filter"
import MapView from "./map"
import TableView, { exportExcel as exportTableToExcel } from "./table"
import StandardView from "../../component/view"
import Header from "./header"
import GairojuManager from "../../manager/gairoju"
import DialogSummary from "./dialog/summary"
import DialogDetail from "./dialog/detail"
import { exportTableExcel } from "../../manager/excel"
import DialogLegends from "./dialog/legends"
import CesiumView from "./cesium"
import { WindowMode } from "./data/state"

// const useStyles = makeStyles({
//   root: {
//     height: "100%",
//   },
//   hidden: {
//     display: "none",
//   },
// })

const styles = {
  root: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    position: "relative",
    overflow: "hidden",
    height: "100%",
  },
}

export const ViewType = {
  Map: "map",
  List: "list",
}

export const RootDataContext = React.createContext()

const RootView = (props) => {
  const useRootData = UseRootViewData()
  const { state, setSelectedData } = useRootData

  const [openMap, setOpenMap] = useState(false)
  const [openSummaryDialog, setOpenDialogSummary] = useState(false)
  const [openLegendsDialog, setOpenLegendsDialog] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [hideList, setHideList] = useState(false)
  const [hideMap, setHideMap] = useState(false)
  const [mapViewType, setMapViewType] = useState(state.viewType)

  const tableViewRef = useRef()

  useEffect(() => {
    setHideList(!(state.viewType ?? [ViewType.List]).includes(ViewType.List))
    setHideMap(!(state.viewType && state.viewType.includes(ViewType.Map)))
    setMapViewType(state.viewType)
  }, [state.viewType])

  const showDetailDialog = (data) => {
    setDetailData(data)
  }

  const showDetailDialogByCartodbId = (cartodbId) => {
    GairojuManager.getById(cartodbId).then((data) => {
      showDetailDialog(data)
    })
  }

  const onChangeViewMode = (e) => {
    setSelectedData({})
    setOpenMap(e.target.checked)
  }

  const onCloseSummary = (event, reason) => {
    switch (reason) {
      case "backdropClick":
        setOpenDialogSummary(false)
        break
      default:
        setOpenDialogSummary(false)
        break
    }
  }

  const onCloseLegends = () => {
    setOpenLegendsDialog(false)
  }

  const onCloseDetail = (event, updated) => {
    setDetailData(null)
    if (updated) {
      console.log(tableViewRef.current)
    }
  }

  const exportExcel = () => {
    exportTableExcel(state.filterData, state.selectedData)
  }

  return (
    <RootDataContext.Provider value={useRootData}>
      <StandardView>
        <Header
          disableHomeButton={true}
          onChangeViewMode={onChangeViewMode}
          onSummary={() => setOpenDialogSummary(true)}
          onLegends={() => setOpenLegendsDialog(true)}
          onExport={() => exportExcel()}
        />
        <Box style={styles.root}>
          <FilterView openMap={openMap} />
          {state.windowMode !== WindowMode.Map && (
            <Box style={styles.content}>
              <TableView
                showDetailDialog={showDetailDialog}
                ref={tableViewRef}
              />
            </Box>
          )}
          {state.windowMode !== WindowMode.List && (
            <Box style={styles.content}>
              <CesiumView
                viewType={mapViewType}
                showDetailDialogByCartodbId={showDetailDialogByCartodbId}
              />
            </Box>
          )}
          <Modal
            open={openSummaryDialog}
            onClose={onCloseSummary}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <DialogSummary onClose={onCloseSummary} />
          </Modal>

          <Modal open={!!detailData} onClose={onCloseDetail}>
            <DialogDetail
              data={detailData}
              treeId={detailData?.tree_id}
              onClose={onCloseDetail}
            />
          </Modal>

          <Modal
            open={openLegendsDialog}
            onClose={onCloseLegends}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <DialogLegends onClose={onCloseLegends} />
          </Modal>
        </Box>
      </StandardView>
    </RootDataContext.Provider>
  )
}

export default RootView
