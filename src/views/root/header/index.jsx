import React, { useContext, useEffect, useState } from "react"
import {
  AppBar,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import useLocalStorage from "../../../manager/localStorage"
import { makeStyles } from "@mui/styles"
import { RootDataContext, ViewType } from "../index"
import { AuthDataContext } from "../../../App"
import { WindowMode } from "../data/state"

const useStyles = makeStyles({
  toggle: {
    color: "#526981 !important",
    borderColor: "#76a1cb !important",
  },
  toggleButton: {
    borderColor: "white",
    color: "#99bde2 !important",
    paddingLeft: "16px !important",
    paddingRight: "16px !important",
  },
  toggleButtonSelected: {
    backgroundColor: "#c8e0f7 !important",
    color: "#1e3176 !important",
    paddingLeft: "16px !important",
    paddingRight: "16px !important",
  },
})

const Header = (props) => {
  const { title } = props
  const classes = useStyles()
  const navigate = useNavigate()
  const { state, setFilterData, setWindowMode } = useContext(RootDataContext)
  const { authState, logout } = useContext(AuthDataContext)

  const [wmode, setWMode] = useState()

  useEffect(() => {
    // eslint-disable-next-line default-case
    switch (state.windowMode) {
      case WindowMode.Map:
        setWMode([WindowMode.Map])
        break
      case WindowMode.List:
        setWMode([WindowMode.List])
        break
      case WindowMode.Both:
        setWMode([WindowMode.Map, WindowMode.List])
        break
      default:
        break
    }
  }, [])

  useEffect(() => {
    console.log("AppBar", "auth", authState.userData)
  }, [authState.userData])

  const toHome = () => {
    navigate("/")
  }

  const onFilterReset = async () => {
    await setFilterData({})
  }

  // const onChangeViewType = (event, newViewTypes) => {
  //   if (newViewTypes.length === 0) {
  //     return
  //   }
  //   setViewType(newViewTypes)
  // }

  const onChangeWindowMode = (event, newValue) => {
    console.log(event, newValue)
    setWMode(newValue)
    if (newValue.length === 2) {
      setWindowMode(WindowMode.Both)
    } else {
      setWindowMode(newValue[0])
    }
  }

  const onLogout = () => {
    authState.auth.signOut().then(() => {
      logout()
    })
  }

  const onOpenReceipt = () => {
    window.open("https://diagnostic.gairoju.jp/", "_blank")
  }

  return (
    <Box>
      <AppBar
        position="static"
        color={
          (authState.userData?.detail?.type ?? 0) === 1
            ? "secondary"
            : "primary"
        }
      >
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            fontWeight="bold"
            style={{ fontFamily: "Zen Kaku Gothic New" }}
          >
            {title || process.env.REACT_APP_TITLE || "データベース"}
            {(authState.userData?.detail?.type ?? 0) === 1 && "(管理)"}
          </Typography>

          {!props.disableHomeButton && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="home"
              sx={{ mr: 2 }}
              onClick={toHome}
            >
              <HomeIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ m: 1 }} />
          <Button
            variant="outlined"
            style={{ color: "white", borderColor: "white" }}
            onClick={onFilterReset}
          >
            条件クリア
          </Button>
          <Box sx={{ m: 2 }} />
          <ToggleButtonGroup
            className={classes.toggle}
            onChange={onChangeWindowMode}
            value={wmode}
          >
            <ToggleButton
              className={classes.toggleButton}
              aria-label="right aligned"
              size="small"
              value={WindowMode.List}
              classes={{
                selected: classes.toggleButtonSelected,
              }}
            >
              リスト
            </ToggleButton>
            <ToggleButton
              className={classes.toggleButton}
              size="small"
              aria-label="left aligned"
              value={WindowMode.Map}
              classes={{
                selected: classes.toggleButtonSelected,
              }}
            >
              地図
            </ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ m: 1 }} />
          {props.onSummary && (
            <>
              <Button
                variant="outlined"
                style={{ color: "white", borderColor: "white" }}
                onClick={props.onSummary}
              >
                集計表表示
              </Button>
              <Box sx={{ m: 1 }} />
            </>
          )}
          {props.onExport && (
            <>
              <Button
                variant="outlined"
                style={{ color: "white", borderColor: "white" }}
                onClick={props.onExport}
              >
                Excel出力
              </Button>
              <Box sx={{ m: 1 }} />
            </>
          )}
          <Button
            variant="outlined"
            style={{ color: "white", borderColor: "white" }}
            onClick={onLogout}
          >
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  disableHomeButton: PropTypes.bool,
  onChangeViewMode: PropTypes.func,
  onSummary: PropTypes.func,
  onLegends: PropTypes.func,
  onExport: PropTypes.func,
}

export default Header
