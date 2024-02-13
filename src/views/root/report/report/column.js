
const ReportGridReportColumnDef = [
    {
        field: "kubun",
        headerName: "区分",
        rowSpan: {"function": "rowSpanningKubun"},
        width: 100,
    },
    {
        field: "name",
        headerName: "内容",
        width: 400,
    },
    {
        field: "is_check",
        headerName: "巡視員確認",
        width: 100,
    },
    {
        field: "time",
        headerName: "時刻",
    },
    {
        field: "is_reviewed",
        headerName: "事務所確認",
    },
]

export default ReportGridReportColumnDef
