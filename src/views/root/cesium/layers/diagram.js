import PropTypes from "prop-types"
import CesiumTreeLayer from "./tree"
import { useEffect, useRef, useState } from "react"
import * as Cesium from "cesium"
import geojson from "../../../../resources/map/tsutsujigaoka_park.geojson"

const CesiumDiagramLayer = (props) => {
  const dataSourceRef = useRef()

  useEffect(() => {
    if (!props.viewer || !props.visible) {
      return
    }
    console.log("[Cesium]", "tree layer", props.viewer)

    if (dataSourceRef.current) {
      props.viewer.dataSource.add(dataSourceRef.ds)
    } else {
      Cesium.GeoJsonDataSource.load(geojson, {
        stroke: Cesium.Color.GREEN,
        fill: Cesium.Color.GREEN.withAlpha(0.5),
        strokeWidth: 3,
      }).then((ds) => {
        props.viewer.dataSources.add(ds)
        dataSourceRef.current = ds
        props.onLoad && props.onLoad()
      })
    }

    return () => {
      try {
        props.viewer.dataSources.remove(dataSourceRef.current)
      } catch (e) {
        console.log(e)
      }
      dataSourceRef.current = null
    }
  }, [props.viewer, props.visible])


  return null
}

CesiumDiagramLayer.propTypes = {
  viewer: PropTypes.any,
  onLoad: PropTypes.func,
  visible: PropTypes.bool,
}

export default CesiumDiagramLayer
