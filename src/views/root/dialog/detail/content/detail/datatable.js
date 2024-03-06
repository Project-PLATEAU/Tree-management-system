import React, { useEffect, useMemo } from "react"
import { Box } from "@mui/material"
import { makeStyles } from "@mui/styles"
import PropTypes from "prop-types"
//import ColumnsDef from "../../../../table/column"
import ColumnsDef from "../../../../../../master_data"
import noImage from "../../../../../../resources/images/noimage.png"
import dayjs from "dayjs"
import "dayjs/locale/ja"
import "./databable.css"
dayjs.locale("ja")

const useStyles = makeStyles({
  root: {
    color: "inherit",
  },
  image: {
    width: "340px",
  },
})

const DialogDetailDetailContentDataTable = (props) => {
  const classes = useStyles()
  const columnDef = useMemo(() => [...ColumnsDef], [])

  return (
    <Box id="dialog_detail_datatable" className={classes.root}>
      {props.data.photos &&
        props.data.photos.split(",").map((v) => {
          return (
            <Box key={v}>
              <img
                className={classes.image}
                src={`${process.env.REACT_APP_IMAGE_URL}/${v}`}
              />
            </Box>
          )
        })}

      <table>
        {columnDef.flatMap((def) => {
          let d = props.data[def.field]
          if (typeof d !== "boolean" && !d) {
            return []
          }
          if (def.field === "photos") {
            return
          }
          if (def.field === "diagnostic_pdf") {
            return
          }

          switch (def.field) {
            case "date":
              d = dayjs(d).format("YYYY年M月D日(ddd)")
                  break
            case "hasmushrooms":
              console.log("[Datatable]", "hasmushrooms", d)
              if (d === true) {
                d = "あり"
              } else if (d === false) {
                d = "なし"
              }
              break
            case "treevigor":
              if (d === "good") {
                d = "良い"
              } else if (d === "poor") {
                d = "少し悪い"
              } else if (d === "bad") {
                d = "悪い"
              } else if (d == "died") {
                d = "枯死"
              }
              break
            default:
              break
          }

          return (
            <tr key={def.field}>
              <th>{def.headerName}</th>
              <td>{d}</td>
            </tr>
          )
        })}
      </table>
    </Box>
  )
}

DialogDetailDetailContentDataTable.propTypes = {
  data: PropTypes.any,
  sx: PropTypes.object,
}

export default DialogDetailDetailContentDataTable
