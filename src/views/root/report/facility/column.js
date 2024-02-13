
const ReportGridFacilityColumnDef = [
    {
        field: "kubun",
        headerName: "区分",
        rowGroup: true,
        hide: false,
        width: 100,
    },
    {
        field: "name",
        headerName: "遊具・施設名",
        width: 300,
    },
    {
        field: "is_incident",
        headerName: "異常有無",

        width: 100,
    },
    {
        field: "report_text",
        headerName: "状態",
        width: 300,
    },
    {
        field: "repair_text",
        headerName: "処置",
        width: 300,
    },
    {
        field: "is_reviewed",
        headerName: "事務所確認",
        width: 100,
    }
]

export default ReportGridFacilityColumnDef
