import { useReducer } from "react"
import reducer, { ActionType } from "./reducer"
import initialAuthState from "./state"

const UseAuthData = () => {
  const [authState, dispatch] = useReducer(reducer, {
    ...initialAuthState,
  })

  const setAuth = (auth) => {
    dispatch({ type: ActionType.SetAuth, value: auth })
  }

  const login = (user) => {
    dispatch({ type: ActionType.SetUserData, value: user })
  }

  const logout = () => {
    dispatch({ type: ActionType.SetUserData, value: null })
  }

  return {
    authState,
    setAuth,
    login,
    logout,
  }
}

export default UseAuthData
