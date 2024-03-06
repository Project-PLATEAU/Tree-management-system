import PropTypes from "prop-types"
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"
import { ArrowRight as ArrowRightIcon } from "@mui/icons-material"
import React from "react"

const DialogDetailContentEditEditorBase = (props) => {
  return (
    <Box sx={props.styles?.rowBox}>
      <Box sx={{ ...props.styles?.columnBox, ...props.styles?.leftColumnBox }}>
        <Box sx={{ ...props.styles?.labelBox, ...props.styles?.leftLabelBox }}>
          <Typography
            style={{ ...props.styles?.label, ...props.styles?.leftLabel }}
          >
            {props.label}
          </Typography>
          <Typography
            style={{ ...props.styles?.subLabel, ...props.styles?.leftSubLabel }}
          >
            {props.subLabel}
          </Typography>
        </Box>
        <Box sx={{ ...props.styles?.valueBox, ...props.styles?.leftValueBox }}>
          <Typography style={{ ...props.styles?.currentValue }}>
            {props.current}
          </Typography>
          {props.unitName && (
            <Typography sx={{ marginLeft: "4px" }} style={{ color: "#666" }}>
              {props.unitName}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={props.styles?.arrowBox}>
        <ArrowRightIcon style={props.styles?.arrowIcon} fontSize="large" />
      </Box>
      <Box sx={{ ...props.styles?.columnBox, ...props.styles?.rightColumnBox }}>
        <Box sx={{ ...props.styles?.labelBox, ...props.styles?.rightLabelBox }}>
          <Typography
            style={{
              ...props.styles?.label,
              ...props.styles?.rightLabel,
            }}
          >
            {props.label}
          </Typography>
          <Typography
            style={{
              ...props.styles?.subLabel,
              ...props.styles?.rightSubLabel,
            }}
          >
            {props.subLabel}
          </Typography>
        </Box>
        <Box sx={{ ...props.styles?.valueBox, ...props.styles?.rightValueBox }}>
          {props.children}
        </Box>
      </Box>
    </Box>
  )
}

DialogDetailContentEditEditorBase.propTypes = {
  children: PropTypes.element,
  styles: PropTypes.object,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  current: PropTypes.any,
  value: PropTypes.any,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  unitName: PropTypes.string,
}

export default DialogDetailContentEditEditorBase
