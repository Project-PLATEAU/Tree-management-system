import React, { useEffect, useMemo, useRef, useState } from "react"
import { Box, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import PropTypes from "prop-types"
import * as L from "leaflet/dist/leaflet"
import "leaflet/dist/leaflet.css"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIconShadow from "leaflet/dist/images/marker-shadow.png"

const useStyles = makeStyles({
  root: {
    width: "100%",
    backgroundColor: "red",
  },
  map: {
    width: "100%",
    height: "100%",
  },
})

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
})

const baseLayres = {
  地理院地形図: L.tileLayer(
    "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
    { tileSize: 256, maxNativeZoom: 18, maxZoom: 22 }
  ),
  街区地図: L.tileLayer(
      process.env.REACT_APP_MAP_LAYER_GAIKU_URL,
    { tileSize: 256, maxNativeZoom: 18, maxZoom: 22 }
  ),
}

const DialogDetailContentDetailMap = (props) => {
  const classes = useStyles()
  const ref = useRef(null)
  const [map, setMap] = useState(null)
  const [baseLayer, setBaseLayer] = useState(baseLayres["街区地図"])

  useEffect(() => {
    L.Icon.Default.imagePath = "leaflet/dist/images"

    let m = L.map(ref.current, props.mapOptions ?? {})
    m.setView(
      [
        props.data.latitude ?? 35.6813706610132,
        props.data.longitude ?? 139.76727819517552,
      ],
      17
    )
    setMap(m)

    return () => {
      m.remove()
      setMap(null)
    }
  }, [])

  useEffect(() => {
    if (!map) {
      return
    }
    L.control.layers(baseLayres, null, { position: "topright" }).addTo(map)

    if (props.data.latitude && props.data.longitude) {
      L.marker([props.data.latitude, props.data.longitude], {
        icon: new L.Icon({
          iconUrl: markerIcon,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      }).addTo(map)
    }
  }, [map])

  useEffect(() => {
    if (!map) {
      return
    }
    baseLayer.addTo(map)
    map.invalidateSize()

    return () => {
      map.removeLayer(baseLayer)
    }
  }, [map, baseLayer])

  return (
    <Box
      sx={props.sx}
      className={classes.root}
      style={{ height: props.height ?? "100%" }}
    >
      <div className={classes.map} ref={ref}></div>
    </Box>
  )
}

DialogDetailContentDetailMap.propTypes = {
  mapOptions: PropTypes.any,
  data: PropTypes.any,
  height: PropTypes.number,
  sx: PropTypes.object,
}

export default DialogDetailContentDetailMap
