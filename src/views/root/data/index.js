import initialState from "./state"
import reducer, { ActionType } from "./reducer"
import { useReducer } from "react"
import dayjs from "dayjs"

const UseRootViewData = () => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  const clearFilterData = () => {
    dispatch({ type: ActionType.ClearFilterData })
  }

  const clearColumnState = () => {
    dispatch({ type: ActionType.ClearColumnState })
  }

  const clearSortData = () => {
    dispatch({ type: ActionType.ClearSortData })
  }

  const clearSelectedData = () => {
    dispatch({ type: ActionType.ClearSelectedData })
  }

  const setFilterData = (filterData) => {
    if (!filterData) {
      dispatch({ type: ActionType.ClearFilterData })
      return
    }
    dispatch({ type: ActionType.SetFilterData, value: filterData })
  }

  const setColumnState = (columnState) => {
    if (!columnState) {
      dispatch({ type: ActionType.ClearColumnState })
      return
    }
    dispatch({ type: ActionType.SetColumnState, value: columnState })
  }

  const setSortData = (sortData) => {
    if (!sortData) {
      dispatch({ type: ActionType.ClearSortData })
      return
    }
    dispatch({ type: ActionType.SetSortData, value: sortData })
  }

  const setViewType = (types) => {
    dispatch({ type: ActionType.SetViewType, value: types })
  }

  const setSelectedData = (data) => {
    dispatch({ type: ActionType.SetSelectedData, value: data })
  }

  const setMapLabel = (name) => {
    dispatch({ type: ActionType.SetMapLabel, value: name })
  }

  const setMapZoom = (zoom) => {
    dispatch({ type: ActionType.SetMapZoom, value: zoom })
  }

  const setRefreshTime = () => {
    dispatch({ type: ActionType.SetRefreshTime, value: dayjs() })
  }

  const setWindowMode = (value) => {
    dispatch({type: ActionType.SetWindowMode, value})
  }

  const setListEditedData = (value) => {
    dispatch({type: ActionType.SetListEditedData, value})
  }

  return {
    state,
    clearFilterData,
    clearColumnState,
    clearSortData,
    clearSelectedData,
    setFilterData,
    setSortData,
    setColumnState,
    setViewType,
    setSelectedData,
    setMapLabel,
    setMapZoom,
    setRefreshTime,
    setWindowMode,
    setListEditedData,
  }
}

export default UseRootViewData
