import React from "react"
import Base from "./base"
import { InputAdornment, OutlinedInput, TextField } from "@mui/material"
import PropTypes from "prop-types"
const DialogDetailContentEditTextEditor = (props) => {
  return (
    <Base {...props}>
      <OutlinedInput
        sx={{ width: "100%" }}
        size="small"
        value={props.value}
        onChange={(e) => props.onChange && props.onChange(e.target.value)}
        endAdornment={
          props.unitName && (
            <InputAdornment position="end">{props.unitName}</InputAdornment>
          )
        }
      />
    </Base>
  )
}

DialogDetailContentEditTextEditor.propTypes = {
  ...Base.propTypes,
}
export default DialogDetailContentEditTextEditor
