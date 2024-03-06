import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import PropTypes from "prop-types"
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  Typography,
} from "@mui/material"
import RichTextEditor from "react-rte"
import { Send as SendIcon } from "@mui/icons-material"
import { RootDataContext } from "../../../../index"
import { Query, Rows } from "../../../../../../manager/carto"
import { AuthDataContext } from "../../../../../../App"
import dayjs from "dayjs"

const DialogDetailContentWorkLogView = (props) => {
  const { authState } = useContext(AuthDataContext)
  const { state, setRefreshTime } = useContext(RootDataContext)
  const [value, setValue] = useState()
  const [category, setCategory] = useState()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const listRef = useRef(null)
  const messageEndRef = useRef(null)

  const list = useMemo(() => {
    return (
      data?.map((v, i) => {
        return (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: "column",
              margin: "8px",
              border: "1px solid #000",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                backgroundColor: "#eee",
                padding: "16px",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "120px",
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                <Box
                  sx={{
                    border: "1px solid #999",
                    borderRadius: "8px",
                    padding: "6px",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* 6p */}
                  <Typography variant="caption">
                    {v.category ?? "その他"}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2">
                  {dayjs(v.created_at).format("YYYY年M月D日(ddd) H時m分")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">{v.name}</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}></Box>
            </Box>
            <Box
              sx={{ padding: "8px" }}
              dangerouslySetInnerHTML={{
                __html: decodeURI(v.description).replaceAll("\n", "<br />"),
              }}
            ></Box>
          </Box>
        )
      }) ?? []
    )
  }, [data])

  useEffect(() => {
    if (!props.treeId) {
      return
    }

    setData([])
    setLoading(true)
    try {
      Rows(`
        SELECT * FROM ${process.env.REACT_APP_TABLE_COMMENT_VIEW}
        WHERE tree_id = '${props.treeId}' AND type = 1
        ORDER BY created_at`
      )
        .then((rows) => {
          setData(rows)
          setLoading(false)
        })
        .catch((e) => {
          console.log(e)
          setLoading(false)
        })
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }, [props.treeId, state.refreshTime])

  useEffect(() => {
    if (!list || !messageEndRef.current) {
      return
    }

    scrollToBottom()
  }, [list, messageEndRef.current])

  const scrollToBottom = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView()
    }, 100)
  }

  const send = () => {
    if ((value?.trim()?.length ?? 0) === 0) {
      return
    }
    let encoded = encodeURI(value)

    Query(`
        INSERT INTO ${process.env.REACT_APP_TABLE_COMMENT}
        (tree_id, type, description, created_at, created_user_id, category) 
        VALUES (
            '${props.treeId}',
            1,
            '${encoded}',
            NOW(),
            ${authState.userData.detail.cartodb_id},
            '${category ?? "その他"}'
        )`
    )
      .then((res) => {
        setValue("")
        setRefreshTime()
      })
      .catch((e) => {})
  }

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 1 }}
    >
      {!loading && data && (
        <Box sx={{ flexGrow: 1, overflowY: "auto" }} ref={listRef}>
          {list}
          <div ref={messageEndRef} />
        </Box>
      )}
      {!loading && !data && <Box sx={{ flexGrow: 1 }}>コメントなし</Box>}
      {loading && <Box sx={{ flexGrow: 1 }}>読込中...</Box>}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #000",
          borderRadius: "8px",
          justifyContent: "center",
        }}
      >
        <TextareaAutosize
          placeholder="コメント入力..."
          minRows={2}
          style={{
            width: "calc(100% - 16px)",
            flexGrow: 1,
            border: 0,
            margin: "8px",
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></TextareaAutosize>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "4px",
              marginRight: "8px",
            }}
          >
            <Typography variant="subtitle2">カテゴリ選択:</Typography>
            <select
              id="category-select"
              onChange={(e) => {
                setCategory(e.target.value)
              }}
            >
              <option>その他</option>
              <option>剪定</option>
            </select>
          </Box>
          <IconButton disabled={!value} sx={{ mr: "4px" }} onClick={send}>
            <SendIcon
              size="small"
              sx={{ color: value ? "#4343e1" : "gray", width: "24px" }}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

DialogDetailContentWorkLogView.propTypes = {
  treeId: PropTypes.string,
}

export default DialogDetailContentWorkLogView
