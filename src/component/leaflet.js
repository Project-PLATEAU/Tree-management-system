import * as L from "leaflet/dist/leaflet"
import "leaflet/dist/leaflet.css"
import PropTypes from "prop-types"
import { makeStyles } from "@mui/styles"
import { useContext, useEffect, useRef, useState } from "react"
import { RootDataContext } from "../views/root"

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
})

const Leaflet = (props) => {
  const classes = useStyles()
  const ref = useRef(null)
  const [map, setMap] = useState(null)
  const [baseMapLayer, setBaseMapLayer] = useState(null)

  useEffect(() => {
    let m = L.map(ref.current, props.mapOptions)
    m.setView([35.651731319201154, 139.54483522795422], 13)
    setMap(m)
  }, [])

  useEffect(() => {
    if (!map) {
      return
    }

    L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 20,
      maxNativeZoom: 18,
    }).addTo(map)
  }, [map])

  const setBaseMap = (urlTemplate, options) => {
    if (!map) {
      return false
    }
    L.tileLayer(urlTemplate, options).addTo(map)
    return true
  }

  return (
    <div
      classheaderName={`${classes.root} ${props.classheaderName}`}
      style={props.style}
      ref={ref}
    ></div>
  )
}

Leaflet.propTypes = {
  ref: PropTypes.any,
  classheaderName: PropTypes.string,
  style: PropTypes.any,
  mapOptions: PropTypes.any,
}

export default Leaflet
