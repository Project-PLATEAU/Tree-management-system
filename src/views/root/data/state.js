import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Asia/Tokyo")
export const ViewMode = {
    Incident: "incident",
    WaterMeter: "water_meter",
    WaterTemp: "water_temp",
    WaterQuality: "water_quality",
    TrackFacility: "track",
    Master: "master",
    Tree: "tree",
}

export const WindowMode = {
    List: "list",
    Map: "map",
    Both: "both",
    Report: "report",
}

const RootDataState = {

    date: dayjs().tz().format("YYYYMMDD"),
    viewMode: ViewMode.Incident,
    windowMode: WindowMode.List,
    mapCenter: null,
    mapMarker: null,
    detail: null,

    masterFacilityCode: null,
    masterFilterModel: window.localStorage.getItem("master_filter") ? JSON.parse(window.localStorage.getItem("master_filter")): null,
    masterSortModel: null,
    masterSelectedData: window.localStorage.getItem("master_selected") ? JSON.parse(window.localStorage.getItem("master_selected")): null,
    masterColumnState: window.localStorage.getItem("master_column_state") ? JSON.parse(window.localStorage.getItem("master_column_state")): null,

    treeFacilityCode: null,
    treeFilterModel: window.localStorage.getItem("tree_filter") ? JSON.parse(window.localStorage.getItem("tree_filter")): null,
    treeSortModel: null,
    treeSelectedData: window.localStorage.getItem("tree_selected") ? JSON.parse(window.localStorage.getItem("tree_selected")): null,
    treeColumnState: window.localStorage.getItem("tree_column_state") ? JSON.parse(window.localStorage.getItem("tree_column_state")): null,

    showMapPoi: false,
}

export default RootDataState
