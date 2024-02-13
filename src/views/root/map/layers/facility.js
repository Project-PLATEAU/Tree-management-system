import PropTypes from "prop-types"
import {useEffect, useRef, useState} from "react"
import * as Cesium from "cesium"

const MapFacilityLayer = ({viewer, visible}) => {

    const tileset = useRef()
    const [layerInitialized, setLayerInitialized] = useState(false)

    useEffect(() => {
        if (!viewer) { return }

        Cesium.IonResource.fromAssetId(2428710)
            .then(res => {
                Cesium.Cesium3DTileset.fromUrl(res).then(async ts => {
                    if (!viewer?.scene) { return }
                    ts.style = new Cesium.Cesium3DTileStyle({
                        filter: getFilter(),
                    })
                    ts.name = "facility"
                    viewer.scene.primitives.add(ts)
                    const extras = ts.asset.extras;
                    if (
                        Cesium.defined(extras) &&
                        Cesium.defined(extras.ion) &&
                        Cesium.defined(extras.ion.defaultStyle)
                    ) {
                        tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
                    }
                    tileset.current = ts
                    setLayerInitialized(true)
                })
            })

        return () => {
            if (tileset.current) {
                viewer?.scene?.primitives?.remove(tileset.current)
            }
        }
    }, [viewer]);

    const getFilter = () => {
        return null
    }

    return null
}

MapFacilityLayer.propTypes = {
    viewer: PropTypes.any,
    visible: PropTypes.bool,
}

export default MapFacilityLayer
