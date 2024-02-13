import PropTypes from "prop-types";
import React, {useContext, useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import {RootDataContext} from "../../index";
import {ViewMode} from "../../data/state";
import APIManager from "../../../../manager/api"

const MapFacilityBillboardLayer = ({viewer, visible}) => {

    const { state } = useContext(RootDataContext)
    const [entities, setEntities] = useState([])

    useEffect(() => {
        if (!viewer) { return }

        Cesium.IonResource.fromAssetId(2428824)
            .then(async res => {
                let ds = await Cesium.CzmlDataSource.load(res)
                console.log('[Map]', 'billboard data source', ds)
                let ent = await viewer.dataSources.add(ds)
                setEntities(ent.entities.values)
            })
    }, [viewer]);

    useEffect(() => {
        if (state.viewMode !== ViewMode.Master) {
            for(let entity of entities) {
                entity.show = false
            }
        } else if (!state.masterSelectedData) {
            for(let entity of entities) {
                entity.show = state.showMapPoi
            }
        } else if(!state.masterSelectedData.colId || state.masterSelectedData.colId === "facility_code") {
            for(let entity of entities) {
                entity.show = state.masterSelectedData.facility_code === entity.name
            }
        } else {
            APIManager.get("list/facility_codes", {
                selected: {
                    colId: state.masterSelectedData?.colId,
                    colValue: state.masterSelectedData?.colValue
                },
                filterModel: state.masterFilterModel,
            }).then(rows => {
                let ids = rows.map(v => v.facility_code)
                for(let entity of entities) {
                    entity.show = ids.includes(entity.name)
                }
            })
        }
    }, [viewer, entities, state.viewMode, state.showMapPoi, state.masterSelectedData, state.masterFilterModel])


    return null
}

MapFacilityBillboardLayer.propTypes = {
    viewer: PropTypes.any,
    visible: PropTypes.bool,
    showAll: PropTypes.bool,
}

export default MapFacilityBillboardLayer
