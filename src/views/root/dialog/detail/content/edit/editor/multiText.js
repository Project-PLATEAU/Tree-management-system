import React, { useEffect, useState } from "react"
import Base from "./base"
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material"
import PropTypes from "prop-types"
import { Close as CloseIcon } from "@mui/icons-material"

const DialogDetailContentEditMultiTextEditor = (props) => {
  const [vals, setVals] = useState([])

  useEffect(() => {
    setVals(props.values ?? [])
  }, [props.values])

  return (
    <Base {...props}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {vals.map((v, i) => {
          return (
            <Box
              key={`${props.id}-${i}`}
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <OutlinedInput
                sx={{ width: "100%" }}
                size="small"
                value={v}
                onChange={(e) => {
                  let v = [...vals]
                  v[i] = e.target.value
                  setVals(v)
                }}
                onBlur={(e) => {
                  props.onChange && props.onChange(vals)
                }}
              />
              <IconButton
                size="small"
                tabIndex={-1}
                onClick={() => {
                  let v = [...vals]
                  v.splice(i, 1)
                  setVals(v)
                  props.onChange && props.onChange(v)
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )
        })}
        {props.max > vals.length && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => setVals([...vals, ""])}
            >
              {props.label}を追加
            </Button>
          </Box>
        )}
      </Box>
    </Base>
  )
}

DialogDetailContentEditMultiTextEditor.propTypes = {
  ...Base.propTypes,
  values: PropTypes.array,
  onChange: PropTypes.func,
  inputProps: PropTypes.any,
}
export default DialogDetailContentEditMultiTextEditor
