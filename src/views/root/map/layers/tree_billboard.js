import PropTypes from "prop-types"
import React, {useContext, useEffect, useRef, useState} from "react"
import * as Cesium from "cesium"
import {RootDataContext} from "../../index"
import {ViewMode} from "../../data/state"
import APIManager from "../../../../manager/api"

const MapTreeBillboardLayer = ({viewer, visible}) => {

    const { state } = useContext(RootDataContext)
    const [entities, setEntities] = useState([])

    useEffect(() => {
        if (!viewer) { return }

        Cesium.IonResource.fromAssetId(2428790)
            .then(async res => {
                let ds = await Cesium.CzmlDataSource.load(res)
                let ent = await viewer.dataSources.add(ds)
                setEntities(ent.entities.values)
            })
    }, [viewer]);

    useEffect(() => {

        if (state.viewMode !== ViewMode.Tree) {
            for(let entity of entities) {
                entity.show = false
            }
        } else if (!state.treeSelectedData) {
            for(let entity of entities) {
                entity.show = state.showMapPoi
            }
        } else if(!state.treeSelectedData.colId || state.treeSelectedData.colId === "facility_code") {
            for(let entity of entities) {
                entity.show = state.treeSelectedData.facility_code === entity.id
            }
        } else {
            APIManager.get("list/tree_codes", {
                selected: {
                    colId: state.treeSelectedData?.colId,
                    colValue: state.treeSelectedData?.colValue,
                },
                filterModel: state.treeFilterModel,
            }).then(rows => {
                let ids = rows.map(v => v.facility_code)
                for(let entity of entities) {
                    entity.show = ids.includes(entity.id)
                }
            })
        }

    }, [viewer, entities, state.viewMode, state.showMapPoi, state.treeSelectedData, state.treeFilterModel])

    return null
}

MapTreeBillboardLayer.propTypes = {
    viewer: PropTypes.any,
    visible: PropTypes.bool,
    showAll: PropTypes.bool,
}

export default MapTreeBillboardLayer
