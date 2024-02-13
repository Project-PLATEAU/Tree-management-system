import PropTypes from "prop-types"
import {useContext, useEffect, useRef, useState} from "react"
import * as Cesium from "cesium"
import {RootDataContext} from "../../index"
import ColumnDef from "../../list/model/tree/column"
import {StyleDefineFromAgGridColumnDef} from "../../../../manager/cesium"

const tilesetVariableDefine = {
    cartodb_id: "${feature['cartodb_id']}",
    park_code: "${feature['park_code']}",
    park_name: "${feature['park_name']}",
    park_type: "${feature['park_type']}",
    facility_code: "${feature['facility_code']}",
    facility_type: "${feature['facility_type']}",
    facility_name: "${feature['facility_name']}",
    facility_name_optional: "${feature['facility_name_optional']}",
    specific_facility_name: "${feature['specific_facility_name']}",
    perimeter: "${feature['perimeter']}",
    height: "${feature['height']}",
    quantity_numeric: "${feature['quantity_numeric']}",
    quantity_unit: "${feature['quantity_unit']}",
    note: "${feature['note']}",
    longitude: "${feature['longitude']}",
    latitude: "${feature['latitude']}",
    elevation: "${feature['elevation']}",
}

const MapTreeLayer = ({viewer, visible}) => {

    const tileset = useRef()
    const { state } = useContext(RootDataContext)
    const [layerInitialized, setLayerInitialized] = useState(false)

    useEffect(() => {
        if (!viewer) { return }

        Cesium.IonResource.fromAssetId(2428690)
            .then(res => {
                Cesium.Cesium3DTileset.fromUrl(res).then(async ts => {
                    if (!viewer?.scene) { return }
                    ts.name = "tree"
                    ts.style = new Cesium.Cesium3DTileStyle({
                        filter: getFilter(),
                    })
                    viewer.scene.primitives.add(ts)
                    const extras = ts.asset.extras;
                    if (
                        Cesium.defined(extras) &&
                        Cesium.defined(extras.ion) &&
                        Cesium.defined(extras.ion.defaultStyle)
                    ) {
                        ts.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
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

    useEffect(() => {
        if (!viewer || !layerInitialized) { return }
        let showConditions = []

        tileset.current.style = new Cesium.Cesium3DTileStyle({
            defines: StyleDefineFromAgGridColumnDef(ColumnDef()),
            show: showConditions.length > 0 ? showConditions.join(" && ") : "true",
        })
    }, [viewer, tileset.current, state.treeSelectedData, state.treeFilterModel, layerInitialized])

    const getFilter = () => {
        return null
    }

    return null
}

MapTreeLayer.propTypes = {
    viewer: PropTypes.any,
    visible: PropTypes.bool,
}

export default MapTreeLayer
