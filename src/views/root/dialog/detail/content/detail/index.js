import PropTypes from "prop-types"
import { Box } from "@mui/material"
import Map from "./map"
import React from "react"
import Datatable from "./datatable"

const DialogDetailContentDetailView = (props) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        //          display: "flex",
        //          flexDirection: "row",
        overflowY: "scroll",
        gap: 8,
      }}
    >
      <Datatable data={props.data} sx={{ minWidth: "400px" }} />
      <Map data={props.data} />
    </Box>
  )
}

DialogDetailContentDetailView.propTypes = {
  className: PropTypes.string,
  data: PropTypes.any,
}

export default DialogDetailContentDetailView
