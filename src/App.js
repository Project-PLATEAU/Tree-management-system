import React, { useEffect, useMemo, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Root from "./views/root"
import Map from "./views/root/map"
import UseAuthData from "./auth"
import LoginView from "./views/login"
import "firebase/compat/auth"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Box, CircularProgress } from "@mui/material"
import { makeStyles } from "@mui/styles"
import "dayjs/locale/ja"
import dayjs from "dayjs"
import {First} from "./manager/carto";
export const AuthDataContext = React.createContext()

dayjs.locale("ja")

const useStyles = makeStyles({
  circle: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#333",
  },
})

const App = () => {
  const classes = useStyles()
  const useAuthData = UseAuthData()
  const { authState, setAuth, login } = useAuthData
  const [authInitialized, setAuthInitialized] = useState(false)

  useMemo(() => {
    return setAuth(getAuth())
  }, [])

  useEffect(() => {
    if (!authState.auth) {
      return
    }
    onAuthStateChanged(authState.auth, (user) => {
      if (user && user.email) {
        First(
            `SELECT * FROM ${process.env.REACT_APP_TABLE_USER} WHERE LOWER(email) = '${user.email.toLowerCase()}'`
        )
            .then((res) => {
              console.log('[Login]', 'user', res)
              login({ ...user, detail: res })
            })
            .catch((e) => {
              login({ ...user, detail: {} })
            })
      } else if (user) {
        login({ ...user, detail: {} })
      } else {
        login(user)
      }

      setAuthInitialized(true)
    })
  }, [authState.auth])


  return (
    <AuthDataContext.Provider value={useAuthData}>
      {!authInitialized && (
        <Box className={classes.circle}>
          <CircularProgress color="success" />
        </Box>
      )}
      {authInitialized && !authState.userData && <LoginView />}
      {authInitialized && authState.userData && (
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Root />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </BrowserRouter>
      )}
    </AuthDataContext.Provider>
  )
}

export default App
