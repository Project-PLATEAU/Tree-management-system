import React from "react"
import Base from "./base"
import { InputAdornment, OutlinedInput, TextField } from "@mui/material"
import PropTypes from "prop-types"

const DialogDetailContentEditNumberEditor = (props) => {
  const fullWidth2HalfWidth = (src) => {
    return src.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    })
  }

  return (
    <Base {...props}>
      <OutlinedInput
        error={props.error}
        sx={{ width: "100%" }}
        size="small"
        value={props.value}
        onChange={(e) =>
          props.onChange && props.onChange(fullWidth2HalfWidth(e.target.value))
        }
        onBlur={(e) => {
          props.onBlur && props.onBlur()
        }}
        inputProps={{ inputMode: "numeric", style: { textAlign: "right" } }}
        endAdornment={
          props.unitName && (
            <InputAdornment position="end">{props.unitName}</InputAdornment>
          )
        }
      />
    </Base>
  )
}

DialogDetailContentEditNumberEditor.propTypes = {
  ...Base.propTypes,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  inputProps: PropTypes.any,
}
export default DialogDetailContentEditNumberEditor
