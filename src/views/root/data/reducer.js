import {WindowMode} from "./state";

export const ActionType = {
    SetViewMode: "SET_VIEW_MODE",
    SetDate: "SET_DATE",
    SetWindowMode: "SET_WINDOW_MODE",
    SetMapMarker: "SET_MAP_MARKER",
    ClearMapParams: "CLEAR_MAP_PARAMS",
    ShowMapView: "SHOW_MAP_VIEW",
    SetDetail: "SET_DETAIL",

    SetMasterFacilityCode: "SET_MASTER_FACILITY_CODE",
    SetMasterFilterModel: "SET_MASTER_FILTER_MODEL",
    SetMasterSortModel: "SET_MASTER_SORT_MODEL",
    SetMasterSelectedData: "SET_MASTER_SELECTED_DATA",
    SetMasterColumnState: "SET_MASETR_COLUMN_STATE",

    SetTreeFilterModel: "SET_TREE_FILTER_MODEL",
    SetTreeSortModel: "SET_TREE_SORT_MODEL",
    SetTreeSelectedData: "SET_TREE_SELECTED_DATA",
    SetTreeColumnState: "SET_TREE_COLUMN_STATE",

    SetShowMapPoi: "SET_SHOW_MAP_POI",
}

const RootDataReducer = (state, action) => {

    let { type, value } = action

    switch (type) {
        case ActionType.SetViewMode:
            if (state.windowMode === WindowMode.Report) {
                return {...state, viewMode: value, windowMode: WindowMode.List}
            }
            return {...state, viewMode: value}
        case ActionType.SetDate:
            return {...state, date: value}
        case ActionType.SetWindowMode:
            return {...state, windowMode: value}
        case ActionType.ClearMapParams:
            return {...state,
                mapCenter: null,
                mapMarker: null,
            }
        case ActionType.SetMapMarker:
            return {
                ...state,
                windowMode: state.windowMode === WindowMode.List ? WindowMode.Both : state.windowMode, // TODO: Bothにするべき
                mapCenter: value,
                mapMarker: value,
            }
        case ActionType.ShowMapView:
            return {
                ...state,
                windowMode: WindowMode.Map,
                mapCenter: value,
                mapMarker: value,
            }
        case ActionType.SetDetail:
            return {
                ...state,
                detail: value
            }
        case ActionType.SetMasterFacilityCode:
            return {
                ...state,
                masterFacilityCode: value,
            }
        case ActionType.SetMasterSelectedData:
            if (value) {
                window.localStorage.setItem("master_selected", JSON.stringify(value))
            } else {
                window.localStorage.removeItem("master_selected")
            }
            return {
                ...state,
                masterSelectedData: value,
            }
        case ActionType.SetMasterFilterModel:
            if (value) {
                window.localStorage.setItem("master_filter", JSON.stringify(value))
            } else {
                window.localStorage.removeItem("master_filter")
            }
            return {
                ...state,
                masterFilterModel: value,
            }
        case ActionType.SetMasterSortModel:
            return {
                ...state,
                masterSortModel: value
            }
        case ActionType.SetMasterColumnState:
            if (value) {
                window.localStorage.setItem("master_column_state", JSON.stringify(value))
            } else {
                window.localStorage.removeItem("master_column_state")
            }
            return {
                ...state,
                masterColumnState: value,
            }
        case ActionType.SetTreeSelectedData:
            if (value) {
                window.localStorage.setItem("tree_selected", JSON.stringify(value))
            } else {
                window.localStorage.removeItem("tree_selected")
            }
            return {
                ...state,
                treeSelectedData: value
            }
        case ActionType.SetTreeFilterModel:
            if (value) {
                window.localStorage.setItem("tree_filter", JSON.stringify(value))
            } else {
                window.localStorage.removeItem("tree_filter")
            }
            return {
                ...state,
                treeFilterModel: value,
            }
        case ActionType.SetTreeSortModel:
            return {
                ...state,
                treeSortModel: value,
            }
        case ActionType.SetTreeColumnState:
            if (value) {
                window.localStorage.setItem("tree_column_state", JSON.stringify(value))
            } else {
                window.localStorage.removeItem("tree_column_state")
            }
        case ActionType.SetShowMapPoi:
            return {
                ...state,
                showMapPoi: value,
            }
        default:
            break
    }

    return state
}

export default RootDataReducer
