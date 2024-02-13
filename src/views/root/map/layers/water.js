import PropTypes from "prop-types";
import {useEffect, useRef} from "react";
import * as Cesium from "cesium";

const MapWaterLayer = ({viewer, visible}) => {

    const tileset = useRef()

    useEffect(() => {
        if (!viewer) { return }

        Cesium.IonResource.fromAssetId(2428713)
            .then(res => {
                Cesium.Cesium3DTileset.fromUrl(res).then(async ts => {
                    if (!viewer?.scene) { return }
                    tileset.current = ts
                    ts.style = new Cesium.Cesium3DTileStyle({
                        filter: getFilter(),
                    })
                    ts.name = "water"
                    viewer.scene.primitives.add(ts)
                    const extras = ts.asset.extras;
                    if (
                        Cesium.defined(extras) &&
                        Cesium.defined(extras.ion) &&
                        Cesium.defined(extras.ion.defaultStyle)
                    ) {
                        tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
                    }
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

MapWaterLayer.propTypes = {
    viewer: PropTypes.any,
    visible: PropTypes.bool,
}

export default MapWaterLayer
