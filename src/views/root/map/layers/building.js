import PropTypes from "prop-types";
import {useEffect, useRef} from "react";
import * as Cesium from "cesium";

const MapBuildingLayer = ({viewer, visible}) => {

    const tileset = useRef()

    useEffect(() => {
        if (!viewer) { return }

        Cesium.IonResource.fromAssetId(2428699)
            .then(res => {
                Cesium.Cesium3DTileset.fromUrl(res).then(async ts => {
                    if (!viewer?.scene) {return }
                    tileset.current = ts
                    ts.style = new Cesium.Cesium3DTileStyle({
                        filter: getFilter(),
                    })
                    viewer.scene.primitives.add(ts)
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
}

MapBuildingLayer.propTypes = {
    viewer: PropTypes.any,
    visible: PropTypes.bool,
}

export default MapBuildingLayer
