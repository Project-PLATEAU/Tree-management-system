import { useEffect, useRef } from "react"
import * as Cesium from "cesium"
import PropTypes from "prop-types"

const CesiumBuildingLayer = (props) => {
  const tileset = useRef()

  useEffect(() => {
    if (!props.viewer || tileset.current || !props.viewer?.scene || !props.enable) {
      return
    }
    console.log("[Cesium]", "tree layer", props.viewer)

    Cesium.IonResource.fromAssetId(2366924, {}).then((res) => {
      console.log(res)
      Cesium.Cesium3DTileset.fromUrl(res).then((_tileset) => {
        tileset.current = _tileset
        props.viewer?.scene?.primitives.add(_tileset)
      })
    })

    return () => {
      try {
        tileset.current && props.viewer?.scene?.primitives.remove(tileset.current)
      } catch(e) {
        console.log(e)
      }
      tileset.current = null
    }
  }, [props.viewer])

  return null
}

CesiumBuildingLayer.propTypes = {
  viewer: PropTypes.any,
  enable: PropTypes.bool,
}

export default CesiumBuildingLayer
