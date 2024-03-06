import { initialSortData } from "./state"
import initialColumnState from "../table/column"

export const ActionType = {
  ClearFilterData: "CLEAR_FILTER",
  ClearSortData: "CLEAR_SORT_DATA",
  ClearColumnState: "CLEAR_COLUMN_STATE",
  ClearSelectedData: "CLEAR_SELECTED_DATA",
  SetFilterData: "SET_FILTER_DATA",
  SetSortData: "SET_SORT_DATA",
  SetColumnState: "SET_COLUMN_STATE",
  SetSelectedData: "SET_SELECTED_DATA",
  SetViewType: "SET_VIEW_TYPE",
  SetMapLabel: "SET_MAP_LABEL",
  SetMapZoom: "SET_MAP_ZOOM",
  SetRefreshTime: "SET_REFRESH_TIME",
  SetWindowMode: "SET_WINDOW_MODE",
  SetListEditedData: "SET_LIST_EDITED_DATA",
}

const RootViewDataReducer = (state, action) => {
  let type = action.type
  // 実質クリアの場合には処理を変換
  if (type === ActionType.SetFilterData && !action.value) {
    type = ActionType.ClearFilterData
  }
  if (type === ActionType.SetSortData && !action.value) {
    type = ActionType.ClearSortData
  }
  if (type === ActionType.SetColumnState && !action.value) {
    type = ActionType.ClearColumnState
  }

  switch (type) {
    case ActionType.ClearFilterData:
      window?.localStorage?.setItem("filter_data", null)
      return { ...state, filterData: {} }
    case ActionType.ClearSortData:
      window?.localStorage?.setItem("sort_data", null)
      return { ...state, sortData: initialSortData }
    case ActionType.ClearColumnState:
      window?.localStorage.removeItem("column_state")
      return { ...state, columnState: null }
    case ActionType.ClearSelectedData:
      return { ...state, selectedData: null }
    case ActionType.SetFilterData:
      window?.localStorage.setItem("filter_data", JSON.stringify(action.value))
      return { ...state, filterData: action.value }
    case ActionType.SetSortData:
      window?.localStorage.setItem("sort_data", JSON.stringify(action.value))
      return { ...state, sortData: action.value }
    case ActionType.SetColumnState:
      window?.localStorage.setItem("column_state", JSON.stringify(action.value))
      return { ...state, columnState: action.value }
    case ActionType.SetViewType:
      window?.localStorage.setItem("view_type", JSON.stringify(action.value))
      return { ...state, viewType: action.value }
    case ActionType.SetSelectedData:
      return { ...state, selectedData: action.value }
    case ActionType.SetMapLabel:
      return { ...state, mapLabel: action.value }
    case ActionType.SetMapZoom:
      return { ...state, mapZoom: action.value }
    case ActionType.SetRefreshTime:
      return { ...state, refreshTime: action.value }
    case ActionType.SetWindowMode:
      return { ...state, windowMode: action.value }
    case ActionType.SetListEditedData:
      return { ...state, listEditedData: action.value }
    default:
      break
  }

  return state
}

export default RootViewDataReducer
