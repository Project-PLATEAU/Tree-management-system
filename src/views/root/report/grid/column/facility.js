
export const editableParams = (params) => {
    console.log("[EditableParams]", params)
    if (params.data.data_type === "value") {
        return ([
            "value",
            "in_time",
        ].includes(params.column.colId))
    } else if (params.data.data_type === "incident") {
        return ([
            "is_incident",
            "report_text",
            "repair_text",
            "in_time",
            "out_time",
        ].includes(params.column.colId))
    }
    return false
}


const ReportGridFacilityColumnDef = [
    {
        field: "kubun",
        headerName: "区分",
        rowGroup: true,
        hide: true,
        width: 100,
        cellRenderer: "agGroupCellRenderer",
    },
    {
        field: "data_type",
        cellDataType: "string",
        hide: true,
    },
    {
        field: "name",
        headerName: "遊具・施設名",
        width: 200,
    },
    {
        field: "value",
        headerName: "数値",
        width: 100,
        cellDataType: "number",
        editable: editableParams,
    },
    {
        field: "is_incident",
        headerName: "異常有無",
        width: 100,
        cellDataType: "string",
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ["     ", "異常なし", "異常あり"]
        },
        cellRenderer: (e) => {
            if (!e.data || e.data.data_type !== "incident") { return "" }
            let v = e.getValue()
            console.log(e, v)
            return v
        },
        cellStyle: (e) => {
            if (e.value === "異常あり") {
                return {color: "red"}
            }
        },
        editable: editableParams,
    },
    {
        field: "report_text",
        headerName: "状態",
        width: 100,
        cellDataType: "string",
        editable: editableParams,
    },
    {
        field: "repair_text",
        headerName: "処置",
        width: 100,
        cellDataType: "string",
        editable: editableParams,
    },
    {
        field: "is_reviewed",
        headerName: "事務所確認",
        width: 100,
        editable: true,
        cellDataType: "boolean"
    },
    {
        field: "in_time",
        headerName: "IN・点検時間",
        width: 120,
        editable: editableParams,
        cellDataType: "string",
    },
    {
        field: "out_time",
        headerName: "OUT時間",
        width: 100,
        editable: editableParams,
        cellDataType: "string",
    },
]

export default ReportGridFacilityColumnDef
