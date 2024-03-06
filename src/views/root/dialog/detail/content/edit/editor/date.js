import React, { useMemo } from "react"
import Base from "./base"
import PropTypes from "prop-types"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
//import { parse, format } from "date-fns"
//import { ja } from "date-fns/locale"
//import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)


const DialogDetailContentEditDateEditor = (props) => {

    const defaultValue = useMemo(() => {
        if (!props.current) { return null }
        return dayjs(props.current)
    }, [props.current])

    const value = useMemo(() => {
        if (!props.value) { return null}
        return dayjs(props.value)
    }, [props.value])

    const baseProps = useMemo(() => {
        if (!defaultValue?.isValid()) {
            return {...props, current: null}
        }
        return {...props, current: defaultValue?.format("YYYY-MM-DD")}
    }, [props, defaultValue])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <Base {...baseProps}>
        <DatePicker
          label={props.label}
          slotProps={{ textField: { size: "small" } }}
          sx={{ width: "100%" }}
          defaultValue={defaultValue}
          value={value}
          onChange={(e) => {
            props.onChange && props.onChange(e.format("YYYY-MM-DD"))
          }}
        />
      </Base>
    </LocalizationProvider>
  )
}

DialogDetailContentEditDateEditor.propTypes = {
  ...Base.propTypes,
  onChange: PropTypes.func,
}

export default DialogDetailContentEditDateEditor
