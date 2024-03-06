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

const DialogDetailContentEditMultiNumberEditor = (props) => {
  const [vals, setVals] = useState([])

  useEffect(() => {
    setVals(props.values ?? [])
  }, [props.values])

  const fullWidth2HalfWidth = (src) => {
    return String(src).replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    })
  }

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
                  props.onChange &&
                    props.onChange(
                      vals.map((v) => {
                        let p = parseInt(fullWidth2HalfWidth(v))
                        if (isNaN(p)) {
                          return null
                        }
                        return p
                      })
                    )
                }}
                inputProps={{
                  inputMode: "numeric",
                  style: { textAlign: "right" },
                }}
                endAdornment={
                  props.unitName && (
                    <InputAdornment position="end">
                      {props.unitName}
                    </InputAdornment>
                  )
                }
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

DialogDetailContentEditMultiNumberEditor.propTypes = {
  ...Base.propTypes,
  values: PropTypes.array,
  onChange: PropTypes.func,
  inputProps: PropTypes.any,
  unitName: PropTypes.string,
}
export default DialogDetailContentEditMultiNumberEditor
