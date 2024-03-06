export const ActionType = {
  SetAuth: "SET_AUTH",
  SetUserData: "SET_USER_DATA",
}

const AuthDataReducer = (authState, action) => {
  switch (action.type) {
    case ActionType.SetAuth:
      return { ...authState, auth: action.value }
    case ActionType.SetUserData:
      return { ...authState, userData: action.value }
    default:
      break
  }

  return authState
}

export default AuthDataReducer
