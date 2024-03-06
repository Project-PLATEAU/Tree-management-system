import React from "react"
import Base from "./base"
import {
  Autocomplete,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material"
import PropTypes from "prop-types"
const DialogDetailContentEditAutocompleteEditor = (props) => {
  return (
    <Base {...props}>
      <Autocomplete
        freeSolo
        sx={{ width: "100%" }}
        size="small"
        options={props.options}
        onInputChange={(e) => {
          if (!e?.target?.value) {
            return props.onChange && props.onChange("")
          }
          props.onChange && props.onChange(e.target.value)
        }}
        onChange={(e) => {
          if (!e.target?.innerText) {
            return props.onChange && props.onChange("")
          }
          props.onChange && props.onChange(e.target.innerText)
        }}
        value={props.value}
        getOptionLabel={(option) => {
          console.log(option)
          return option.label
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            value={props.value.label}
          />
        )}
      />
    </Base>
  )
}

DialogDetailContentEditAutocompleteEditor.propTypes = {
  ...Base.propTypes,
  options: PropTypes.array,
}
export default DialogDetailContentEditAutocompleteEditor
