import initialState from "./state"
import reducer, {ActionType} from "./reducer";
import { useReducer} from "react"


const UseRootData = () => {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState
    })

    const setViewMode = (value) => {
        dispatch({type: ActionType.SetViewMode, value})
    }

    const setDate = (value) => {
        dispatch({type: ActionType.SetDate, value})
    }

    const setWindowMode = (value) => {
        dispatch({type: ActionType.SetWindowMode, value})
    }

    const showMapView = (value) => {
        dispatch({type: ActionType.ShowMapView, value})
    }

    const setMapMarker = (value) => {
        dispatch({type: ActionType.SetMapMarker, value})
    }

    const clearMapParams = (value) => {
        dispatch({type: ActionType.ClearMapParams, value})
    }

    const setDetail = (value) => {
        dispatch({type: ActionType.SetDetail, value})
    }

    const setMasterFacilityCode = (value) => {
        dispatch({type: ActionType.SetMasterFacilityCode, value})
    }

    const setMasterSelectedData = (value) => {
        dispatch({type: ActionType.SetMasterSelectedData, value})
    }

    const setMasterFilterModel = (value) => {
        dispatch({type: ActionType.SetMasterFilterModel, value})
    }

    const setMasterSortModel = (value) => {
        dispatch({type: ActionType.SetMasterSortModel, value})
    }

    const setMasterColumnState = (value) => {
        dispatch({type: ActionType.SetMasterColumnState, value})
    }

    const setTreeSelectedData = (value) => {
        dispatch({type: ActionType.SetTreeSelectedData, value})
    }

    const setTreeFilterModel = (value) => {
        dispatch({type: ActionType.SetTreeFilterModel, value})
    }

    const setTreeSortModel = (value) => {
        dispatch({type: ActionType.SetTreeSortModel, value})
    }

    const setTreeColumnState = (value) => {
        dispatch({type: ActionType.SetTreeColumnState, value})
    }

    const setShowMapPoi = (value) => {
        dispatch({type: ActionType.SetShowMapPoi, value})
    }

    return {
        state,
        setViewMode,
        setDate,
        setWindowMode,
        setMapMarker,
        showMapView,
        clearMapParams,
        setDetail,
        setMasterFacilityCode,
        setMasterFilterModel,
        setMasterSortModel,
        setMasterSelectedData,
        setMasterColumnState,
        setTreeFilterModel,
        setTreeSortModel,
        setTreeSelectedData,
        setTreeColumnState,
        setShowMapPoi,
    }
}

export default UseRootData
