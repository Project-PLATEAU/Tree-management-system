import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@mui/styles"
import { Box, Typography } from "@mui/material"
import noImage from "../../../../../../resources/images/noimage.png"

const useStyles = makeStyles({
  root: {
    color: "inherit",
  },
})

const DialogDetailContentDetailImages = (props) => {
  const classes = useStyles()

  return <Box>{props.data.photos ?? <img src={noImage} />}</Box>
}

DialogDetailContentDetailImages.propTypes = {
  data: PropTypes.any,
}

export default DialogDetailContentDetailImages
