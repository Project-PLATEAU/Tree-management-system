import React, { useMemo } from "react"
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
import Base from "./base"

const DialogDetailContentEditSelectEditor = (props) => {
  const currentValue = useMemo(() => {
    console.log('[SelectEditor]', 'value', props.value)
    if ((props.options?.length ?? 0) === 0) {
      return null
    }
    return props.value
  }, [props.value, props.options])

  const options = useMemo(() => {
    console.log('[SelectEditor]', 'options', props.options)
    return props.options ?? []
  }, [props.options])

  const baseProps = useMemo(() => {
    if ((props.options?.length ?? 0) === 0) {
      return { ...props, current: null }
    }
    let v = props.options.filter((p) => p.value === props.current)
    if (v.length === 0) {
      return { ...props, current: null }
    }
    return {...props, current: v[0].name}
  }, [props.current, props.options])

  return (
    <Base {...baseProps}>
      <FormControl size="small" sx={{ width: "100%" }}>
        <InputLabel id={`${props.id}-select-label`}>{props.label}</InputLabel>
        <Select
          sx={{ width: "100%" }}
          labelId={`${props.id}-select-label`}
          id={props.id}
          value={currentValue ?? ""}
          onChange={(e) => {
            let value = e.target.value
            if (value === "　") {
              value = null
            }
            let opt = props.options.filter((v) => v.value === value)
            if (opt.length === 0) {
              value = null
            } else value = opt[0]
            props.onChange && props.onChange(value)
          }}
          label={props.label}
          defaultValue={props.current ?? ""}
        >
          <MenuItem value="">{"　"}</MenuItem>
          {Object.keys(options).map((k) => {
            return (
              <MenuItem key={`${props.id}-${k}-item`} value={options[k].value}>
                {options[k].name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Base>
  )
}

DialogDetailContentEditSelectEditor.propTypes = {
  ...Base.props,
  value: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
}

export default DialogDetailContentEditSelectEditor
