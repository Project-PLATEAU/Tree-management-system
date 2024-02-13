import React, {useContext} from "react";
import Column from "./column";
import APIManager from "../../../../../manager/api"
import { RootDataContext } from "../../../index";
import PropTypes from "prop-types";

const useIncidentListModel = (props) => {
    const { state, setMapMarker } = useContext(RootDataContext);

    const onCellClick = (e) => {
        // TODO: Not implemented
    }

    const onRowClick = (e) => {
        // TODO: Not Implemented
    }

    const onReviewClicked = (incidentId) => {
        console.log(props.api, state.date, incidentId)
        APIManager.put("incident/status", {
            incident_id: incidentId,
            status: "reviewed",
            date: state.date
        }).then(res => {
            console.log(res)
            props.api.current.refreshServerSide({purge: true})
        }).catch(e => {
            console.log(e)
        })
    }

    const onGetRows = (params, date, _, totalRowCountCallback) => {
        APIManager.getForAgGrid("list/incident", {...params?.request, date})
            .then(res => {
                totalRowCountCallback && totalRowCountCallback(res.rowCount)
                params.success(res)
            })
            .catch(e => {
                console.log(e.message)
                params.fail()
            })
    }

    const onViewMapClicked = (lngLat) => {
        setMapMarker(lngLat)
    }

    const columnDef = Column({onReviewClicked, onViewMapClicked});

    return {
        columnDef,
        onGetRows,
        onCellClick,
        onRowClick,
    };
};

useIncidentListModel.propTypes = {
    api: PropTypes.any,
}

export default useIncidentListModel;
