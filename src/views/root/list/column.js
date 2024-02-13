import ReviewedButtonRenderer from "./renderer/reviewed_button";
import {FacilityTypeName} from "../../../manager/const";


const RootIncidentListColumnDef = [
        {
            field: "incident_id",
            headerName: "ID",
            filter: "agNumberColumnFilter",
            sort: "asc",
        },
        {
            field: 'status',
            headerName: "確認",
            cellRenderer: ReviewedButtonRenderer,
            cellRendererParams: {
                clicked: (incidentId) => {
                    // TODO: not implemented
                },
            }
        },
        {
            field: "measured_at",
            headerName: "報告時刻",
            filter: "agDateColumnFilter",
        },
        {
            field: "facility_name",
            headerName: "施設名",
            filter: "agTextColumnFilter",
        },
        {
            field: "facility_type",
            headerName: "種類",
            filter: "agTextColumnFilter",
            cellRenderer: (params) => {
                return FacilityTypeName[params.value] ?? "--"
            },
        },
        {
            headerName: "異常の状態",
            children: [
                {
                    field: "report_text",
                    headerName: "報告",
                },
                {
                    field: "report_voice",
                    headerName: "音声",
                    cellRenderer: (params) => {
                        return params.value ? (<span style={{color: "blue", textDecoration: "underline", cursor: "pointer"}}>再生</span>) : ""
                    },
                },
            ],
        },
        {
            headerName: "異常の処置",
            children: [
                {
                    field: "repair_text",
                    headerName: "報告",
                },
                {
                    field: "repair_voice",
                    headerName: "音声",
                    cellRenderer: (params) => {
                        return params.value ? (<span style={{color: "blue", textDecoration: "underline", cursor: "pointer"}}>再生</span>) : ""
                    },
                },
            ]
        },
        {
            field: 'photos',
            headerName: "写真",
            cellRenderer: (params) => {
                return `${params.value.length}枚`
            }
        },
    ]

export default RootIncidentListColumnDef
