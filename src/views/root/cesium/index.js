import PropTypes from "prop-types"
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { Box, Button, ButtonGroup } from "@mui/material"
import * as Cesium from "cesium"
import useCesium from "../../../manager/cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"
import basemapDef from "./basemap"
import CesiumTreeLayer from "./layers/tree"
import { RootDataContext } from "../index"
import GairojuManager from "../../../manager/gairoju"
import CesiumBuildingLayer from "./layers/building"
import CesiumDiagramLayer from "./layers/diagram";

window.CESIUM_BASE_URL = "./cesium/"

const styles = {
  map: {
    width: "100%",
    flexGrow: 1,
    overflow: "hidden",
    position: "relative",
    height: "100%",
  },
  busyBox: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "calc(100% - 100px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
  detailBox: {
    position: "absolute",
    bottom: "2rem",
    right: "1rem",
    zIndex: "100",
    backgroundColor: "#ffffff5e",
    padding: "8px",
    borderRadius: "8px",
  },
  viewToggleButton: {
    position: "absolute",
    zIndex: "100",
    background: "white",
    top: "1rem",
    right: "1rem",
  },
}

const MapViewMode = {
  View2D: "view_2d",
  View3D: "view_3d",
}

const CesiumView = (props) => {
  const { state, setSelectedData, setFilterData } = useContext(RootDataContext)
  const mapRef = useRef()
  const [mapViewMode, setMapViewMode] = useState(MapViewMode.View3D)
  const [diagramLoaded, setDiagramLoaded] = useState(false)

  const onFeatureClick = useCallback(
    (e) => {
      if (!e || !e.tree_id) {
        //        setFilterData(null) // TODO: 他のフィルタも消えてしまう問題を解消するべき
      } else {
        console.log(e)
        setFilterData({
          tree_id: {
            filterType: "text",
            type: "equals",
            filter: e.tree_id,
          },
        })
      }
    },
    [state.filterData]
  )

  const { viewer, layerInitialized } = useCesium({
    mapRef,
    basemapDef,
    onFeatureClick,
  })

  useEffect(() => {
    if (!viewer) {
      return
    }

    // 中心座標の設定
    const center = Cesium.Cartesian3.fromDegrees(140.894629, 38.261388, 300.0)
    // カメラの設定
    const cameraHeading = Cesium.Math.toRadians(0)
    const cameraPitch = Cesium.Math.toRadians(-90)

    // カメラの初期位置の指定
    viewer.camera.setView({
      destination: center,
      orientation: {
        heading: cameraHeading,
        pitch: cameraPitch,
        roll: 0.0,
      },
      mapProjection : new Cesium.WebMercatorProjection(),
    })

    initLayer()
  }, [viewer])

  useEffect(() => {
    if (!viewer || !layerInitialized || !state.selectedData) {
      return
    }
    console.log("[Map]", "Update selected data", state.selectedData)
  }, [viewer, layerInitialized, state.selectedData])

  const initLayer = useCallback(() => {
    if (!viewer) {
      return
    }
  }, [viewer])

  useEffect(() => {
    if (!viewer) {
      return
    }

    if (mapViewMode === MapViewMode.View3D) {
      viewer.scene.mode = Cesium.SceneMode.SCENE3D
    } else {
      viewer.scene.mode = Cesium.SceneMode.SCENE2D
    }
  }, [viewer, mapViewMode])

  return (
    <Box id="map" ref={mapRef} style={styles.map}>
      <CesiumDiagramLayer viewer={viewer} enable={true} onLoad={() => setDiagramLoaded(true)} visible={mapViewMode === MapViewMode.View2D} />
      <CesiumTreeLayer viewer={viewer} enable={true} />
      <CesiumBuildingLayer viewer={viewer} enable={true} />
      <ButtonGroup style={styles.viewToggleButton}>
        <Button
          variant={
            mapViewMode === MapViewMode.View2D ? "contained" : "outlined"
          }
          onClick={() => setMapViewMode(MapViewMode.View2D)}
        >
          2D
        </Button>
        <Button
          variant={
            mapViewMode === MapViewMode.View3D ? "contained" : "outlined"
          }
          onClick={() => setMapViewMode(MapViewMode.View3D)}
        >
          3D
        </Button>
      </ButtonGroup>
    </Box>
  )
}

CesiumView.propTypes = {
  viewType: PropTypes.any,
}

export default CesiumView
