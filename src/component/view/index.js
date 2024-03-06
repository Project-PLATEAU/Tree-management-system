import React from "react"
import PropTypes from "prop-types"
import { Box } from "@mui/material"

const StandardView = (props) => {
  const { children } = props

  return (
    <Box
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: "1200px",
        height: "100%",
      }}
    >
      {children}
    </Box>
  )
}

StandardView.propTypes = {
  className: PropTypes.any,
  children: PropTypes.any,
  isLoading: PropTypes.bool,
}

StandardView.defaultProps = {
  isLoading: false,
}

export default StandardView
