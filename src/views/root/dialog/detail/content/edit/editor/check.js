import React from "react"
import Base from "./base"
import {
  Checkbox,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material"
import PropTypes from "prop-types"
const DialogDetailContentEditCheckEditor = (props) => {
  return (
    <Base {...props}>
      <Checkbox
        checked={props.checked}
        onClick={() => {
          props.onChange && props.onChange(!props.checked)
        }}
      />
    </Base>
  )
}

DialogDetailContentEditCheckEditor.propTypes = {
  ...Base.propTypes,
  checked: PropTypes.bool,
}
export default DialogDetailContentEditCheckEditor
