import React, {useEffect} from "react";
import IconButton from "@mui/material/IconButton";
import {Place as PlaceIcon} from "@mui/icons-material";
import PropTypes from "prop-types";

const ViewMapButtonRenderer = (props) => {

    return (
        <>
            {props.data.latitude && props.data.longitude && <IconButton
                onClick={() => props.clicked({latitude: props.data.latitude, longitude: props.data.longitude})}
                size="small">
                <PlaceIcon size="small" />
            </IconButton>}
        </>
    )
}

ViewMapButtonRenderer.propTypes = {
    clicked: PropTypes.func.isRequired,
    data: PropTypes.any,
}

export default ViewMapButtonRenderer
