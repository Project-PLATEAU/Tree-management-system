import React, {useContext, useMemo} from "react"
import PropTypes from "prop-types";
import {Box} from "@mui/material";
import {RootDataContext} from "../index";
import IconButton from "@mui/material/IconButton";
import {Close as CloseIcon} from "@mui/icons-material";
import {ViewMode} from "../data/state";
import IncidentContent from "./content/incident"

// eslint-disable-next-line no-undef
const RootDetailView = React.memo((props) => {

    const { state, setDetail } = useContext(RootDataContext)

    const elem = useMemo(() => {
        if (state.detail.mode === ViewMode.Incident) {
            return <IncidentContent data={state.detail} />
        }
        return []
    }, [state.detail])


    return (
        <Box>
            <Box>
                <IconButton onClick={() => setDetail(null)}>
                    <CloseIcon />
                </IconButton>
                {elem}
            </Box>
        </Box>
    )

})

RootDetailView.propTypes = {
    data: PropTypes.any,
    onCLose: PropTypes.func,
}

export default RootDetailView
