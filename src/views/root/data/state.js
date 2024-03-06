import { ViewType } from "../index"

export const WindowMode = {
  Map: "map",
  List: "list",
  Both: "both",
}

export const initialSortData = [{ colId: "tree_id", sort: "asc" }]

const RootViewDataState = {
  filterData: JSON.parse(window?.localStorage?.getItem("filter_data") ?? "{}"),
  sortData: JSON.parse(
    window?.localStorage?.getItem("sort_data") ??
      JSON.stringify(initialSortData)
  ),
  columnState: JSON.parse(
    window?.localStorage?.getItem("column_state") ?? null
  ),
  selectData: null,
  viewType: window?.localStorage.getItem("view_type")
    ? JSON.parse(window.localStorage.getItem("view_type"))
    : ["list"],
  mapLabel: null,
  mapZoom: null,
  refreshTime: null,

  windowMode: WindowMode.List,
  listEditedData: null,
}

export default RootViewDataState
