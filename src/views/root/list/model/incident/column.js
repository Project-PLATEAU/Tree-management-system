import React from "react"
import PropTypes from "prop-types";
import dayjs from "dayjs";
import ReviewedButtonRenderer from "../../renderer/reviewed_button";
import ViewMapButtonRenderer from "../../renderer/view_map_button";

const IncidentListColumn = (props) => {
    return [
        {
            headerName: "",
            width: 40,
            cellRenderer: ViewMapButtonRenderer,
            cellRendererParams: {
                clicked: (value) => {
                    props.onViewMapClicked && props.onViewMapClicked(value)
                },
            },
        },
        {
            colId: "incident_id",
            field: "incident_id",
            headerName: "ID",
            filter: "agNumberColumnFilter",
            sort: "asc",
            width: 60,
        },
        {
            field: 'status',
            headerName: "個票で確認",
            cellRenderer: ReviewedButtonRenderer,
            cellRendererParams: {
                clicked: (incidentId) => {
                    props.onReviewClicked && props.onReviewClicked(incidentId)
                },
            },
            width: 80,
        },
        {
            colId: "measured_at",
            field: "measured_at",
            headerName: "報告時刻",
            filter: "agTextColumnFilter",
            width: 100,
            cellRenderer: (params) => {
                if (dayjs(params.value).format("HH:mm") === "00:00") {
                    return "報告書で入力"
                }
                return dayjs(params.value).format("HH:mm")
            }
        },
        {
            colId: "specific_facility_name",
            field: "specific_facility_name",
            headerName: "施設名",
            filter: "agTextColumnFilter",
        },
        {
            colId: "facility_type",
            field: "facility_type",
            headerName: "種類",
            filter: "agTextColumnFilter",
        },
        {
            headerName: "異常の状態",
            children: [
                {
                    colId: "report_text",
                    field: "report_text",
                    headerName: "報告",
                },
                {
                    colId: "report_voice",
                    field: "report_voice",
                    headerName: "音声",
                    width: 60,
                    cellRenderer: (params) => {
                        return params.value?.voice_url ? "●" : ""
                    },
                },
            ],
        },
        {
            headerName: "異常の処置",
            children: [
                {
                    colId: "repair_text",
                    field: "repair_text",
                    headerName: "報告",
                },
                {
                    colId: "repair_voice",
                    field: "repair_voice",
                    headerName: "音声",
                    width: 60,
                    cellRenderer: (params) => {
                        return params.value?.voice_url ? "●" : ""
                    },
                },
            ]
        },
        {
            colId: 'photos',
            field: 'photos',
            headerName: "写真",
            cellRenderer: (params) => {
                return `${params.value?.length ?? 0}枚`
            }
        },
        {
            colId: "user_name",
            field: "user_name",
            headerName: "報告者",
        }
    ]
}

IncidentListColumn.propTypes = {
    onReviewClicked: PropTypes.func,
}

export default IncidentListColumn
