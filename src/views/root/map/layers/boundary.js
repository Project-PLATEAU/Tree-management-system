import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types";
import * as Cesium from "cesium";

const MapBoundaryLayer = ({viewer, visible}) => {

    useEffect(() => {
        console.log('[Map]', 'boundary layer initializing', viewer, visible)
        if (!viewer) { return }
        if (visible === false) {
            return
        }
        Cesium.IonResource.fromAssetId(2340702)
            .then(async (resource) => {
                if (!viewer?.entities) { return }
                const ds = await Cesium.GeoJsonDataSource.load(resource)
                await viewer.dataSources.add(ds)
                console.log('[Map]', 'layer boundary', ds)
                for(let entity of ds.entities.values) {
                    if (entity.polygon) {
                        entity.polygon.material = Cesium.Color.TRANSPARENT
                        entity.polygon.outlineColor = Cesium.Color.TRANSPARENT
                        const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions
                        viewer.entities.add({
                            name: "boundary",
                            polyline: {
                                positions: positions,
                                width: 5, // your desired width here
                                material: Cesium.Color.RED,
                                clampToGround: true // 地形に貼る
                            }
                        })

                    }
                }
            })
        return () => {
            viewer?.entities?.values.forEach(e => {
                if (e.name === "boundary") {
                    viewer.entities.remove(e)
                }
            })
        }
    }, [viewer, visible])

    return null
}

MapBoundaryLayer.propTypes = {
    viewer: PropTypes.any,
    visible: PropTypes.bool,
}

export default MapBoundaryLayer
