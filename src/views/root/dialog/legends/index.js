import React from "react"
import PropTypes from "prop-types"
import { Box, Button, Divider, IconButton, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { Close as CloseIcon } from "@mui/icons-material"

const legendsData = [
  { name: "イチョウ", color: "#ffd700" },
  { name: "スズカケノキ", color: "#8b4513" },
  { name: "ハナミズキ", color: "#ff69b4" },
  { name: "サクラ", color: "#ff1493" },
  { name: "ユリノキ", color: "#ffff00" },
  { name: "ヤマモモ", color: "#da70d6" },
  { name: "エンジュ", color: "#7cfc00" },
  { name: "アオギリ", color: "#00bfff" },
  { name: "クスノキ", color: "#32cd32" },
  { name: "トウカエデ", color: "#ff6347" },
  { name: "ケヤキ", color: "#6b8e23" },
  { name: "モミジバフウ", color: "#ff4500" },
  { name: "シダレヤナギ", color: "#d8bfd8" },
  { name: "クロガネモチ", color: "#4169e1" },
  { name: "ジョウリョクヤマボウシ", color: "#9370db" },
  { name: "マテバシイ", color: "#cd853f" },
  { name: "ハナノキ", color: "#8a2be2" },
  { name: "サルスベリ", color: "#b22222" },
  { name: "シマトネリコ", color: "#87cefa" },
  { name: "モッコク", color: "#d2b48c" },
  { name: "コブシ", color: "#deb887" },
  { name: "シラカシ", color: "#a0522d" },
  { name: "イヌエンジュ", color: "#808000" },
  { name: "アキニレ", color: "#ba55d3" },
  { name: "イロハモミジ", color: "#e9967a" },
  { name: "キンモクセイ", color: "#ff8c00" },
]

const styles = {
  root: {
    display: "flex",
    color: "inherit",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  dialog: {
    padding: "8px",
    minWidth: "200",
    width: "30%",
    minHeight: "500",
    height: "70%",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "1px 8px 12px 0 rgba(0,0,0, .5)",
  },
  title: {
    height: "20px",
  },
  content: {
    height: "calc(100% - 48px)",
    display: "flex",
    flexDirection: "column",
  },
  circle: {
    width: "16px",
    height: "16px",
    borderRadius: "40px",
    border: "1px solid #c7c7c7",
  },
}

const DialogLegendsView = (props) => {
  return (
    <Box sx={styles.root}>
      <Box sx={styles.dialog}>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "30px",
            marginLeft: "8px",
          }}
        >
          <Typography variant="h6">地図凡例</Typography>
          <Box flexGrow={1} />
          <Box sx={{ m: 1 }} />
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider style={{ margin: "8px" }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {legendsData.map((v) => (
            <Box key={v.name} sx={{ display: "flex", flexDirection: "row" }}>
              <Box sx={{ ...styles.circle, backgroundColor: v.color }}></Box>
              <Box>{v.name}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

DialogLegendsView.propTypes = {
  sx: PropTypes.object,
  onClose: PropTypes.func,
}

export default DialogLegendsView
