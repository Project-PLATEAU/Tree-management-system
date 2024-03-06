import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { makeStyles } from "@mui/styles"
import { Box, Button, TextField, Typography } from "@mui/material"
import { StyledFirebaseAuth } from "react-firebaseui"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import PropTypes from "prop-types"
import { AuthDataContext } from "../../App"

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // We will display Google and Facebook as auth providers.
  signInOptions: [],
}

const useStyles = makeStyles({
  root: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
})

const LoginView = (props) => {
  const classes = useStyles()
  const [showPassword, setShowPassword] = useState(false)
  const { authState } = useContext(AuthDataContext)
  const [error, setError] = useState()
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const auth = useMemo(() => getAuth(), [])

  const passwordAuth = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        console.log(credential)
      })
      .catch((e) => {
        console.log(e.name, e.message, e.code)
        setError(e)
      })
  }

  useEffect(() => {
    setError(null)
  }, [email, password])

  return (
    <Box className={classes.root}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
          {process.env.REACT_APP_TITLE}
      </Typography>
      {error &&
        ["auth/user-not-found", "auth/wrong-password"].includes(error.code) && (
          <Typography variant="subtitle2" sx={{ color: "#e66" }}>
            メールアドレスまたはパスワードが間違っています
          </Typography>
        )}
      {error &&
        !["auth/user-not-found", "auth/wrong-password"].includes(
          error.code
        ) && (
          <Typography variant="subtitle2" sx={{ color: "#e66" }}>
            不明なエラー({error.code})
          </Typography>
        )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "360px",
            width: "80%",
            gap: "8px",
          }}
        >
          <TextField
            id="email-input"
            variant="standard"
            label="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyUp={(e) => {
              if (e.code === "Enter") {
                passwordAuth()
              }
            }}
          />
          <TextField
            id="password-input"
            variant="standard"
            label="パスワード"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => {
              if (e.code === "Enter") {
                passwordAuth()
              }
            }}
          />
        </Box>
        <Box>
          <Button variant="contained" onClick={() => passwordAuth()}>
            ログイン
          </Button>
        </Box>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={authState.auth} />
      </Box>
    </Box>
  )
}

export default LoginView
