import PropTypes from "prop-types"
import {useEffect, useRef} from "react"
import * as Cesium from "cesium"

const MapBridgeLayer = ({viewer, visible}) => {

    const tileset = useRef()

    useEffect(() => {
        if (!viewer) { return }

        Cesium.IonResource.fromAssetId(2428711)
            .then(res => {
                Cesium.Cesium3DTileset.fromUrl(res).then(async ts => {
                    if (!viewer?.scene) { return }
                    tileset.current = ts
                    ts.name = "bridge"
                    ts.style = new Cesium.Cesium3DTileStyle({
                        filter: getFilter(),
                    })
                    viewer.scene.primitives.add(ts)
                })
            })
    }, [viewer]);

    const getFilter = () => {
        return null
    }

    return null
}

MapBridgeLayer.propTypes = {
    viewer: PropTypes.any,
    visible: PropTypes.bool,
}

export default MapBridgeLayer
