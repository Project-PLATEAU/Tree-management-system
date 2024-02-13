
const ReportGridReportColumnDef = [
    {
        field: "kubun",
        headerName: "区分",
        rowGroup: true,
        hide: true,
        width: 100,
    },
    {
        field: "name",
        headerName: "内容",
        width: 400,
        editable: true,
        cellDataType: "string",
    },
    {
        field: "is_check",
        headerName: "巡視員確認",
        width: 100,
        cellDataType: 'boolean',
        editable: true,
    },
    {
        field: "start_time",
        headerName: "開始時刻",
        editable: true,
        cellDataType: "string"
    },
    {
        field: "end_time",
        headerName: "終了時刻",
        editable: true,
        cellDataType: "string",
    }
]

export default ReportGridReportColumnDef
