import React from "react"
import Base from "./base"
import { TextField } from "@mui/material"
const DialogDetailContentEditInputEditor = (props) => {
  return (
    <Base {...props}>
      <TextField
        sx={{ width: "100%" }}
        size="small"
        value={props.value}
        onChange={(e) => {
          props.onChange && props.onChange(e.target.value)
        }}
      />
    </Base>
  )
}

DialogDetailContentEditInputEditor.propTypes = {
  ...Base.propTypes,
}
export default DialogDetailContentEditInputEditor
