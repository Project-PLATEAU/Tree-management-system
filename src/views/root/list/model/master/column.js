import React from "react";
import PropTypes from "prop-types";
import ViewMapButtonRenderer from "../../renderer/view_map_button";
import {distinctFilterParams} from "../../filter";

const MasterListColumn = (props) => {

    return [
        {
            headerName: "",
            width: 120,
            cellRenderer: ViewMapButtonRenderer,
            cellRendererParams: {
                clicked: (value) => {
                    props.onViewMapClicked && props.onViewMapClicked(value)
                },
            },
        },
        {
            field: "facility_code",
            headerName: "施設コード",
            cellDataType: "text",
            filter: "agTextColumnFilter",
        },
        {
            field: "specific_facility_name",
            headerName: "具体的施設名称",
            cellDataType: "text",
            filter: "agTextColumnFilter",
        },
        {
            field: "facility_name",
            headerName: "公園施設名【選択】",
            cellDataType: "text",
            filterParams: distinctFilterParams,
        },
        {
            field: "facility_type",
            headerName: "公園施設種類【選択】",
            cellDataType: "text",
            filterParams: distinctFilterParams,
        },
        {
            field: "park_code",
            headerName: "公園コード",
            cellDataType: "text",
            filterParams: distinctFilterParams,
        },
        {
            field: "park_name",
            headerName: "公園名",
            cellDataType: "text",
            filterParams: distinctFilterParams,
        },
        {
            field: "park_type",
            headerName: "公園種別",
            cellDataType: "text",
            filterParams: distinctFilterParams,
        },
        {
            field: "facility_name_optional",
            headerName: "公園施設名（任意）",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "quantity_numeric",
            headerName: "数量（数値）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "quantity_unit",
            headerName: "数量（単位【選択】)",
            cellDataType: "text",
            filter: "agTextColumnFilter",
        },
        {
            field: "size",
            headerName: "規模",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "main_material",
            headerName: "主要部材【選択】",
            cellDataType: "text",
            filterParams: distinctFilterParams,
            hide: true,
        },
        {
            field: "main_material_optional",
            headerName: "主要部材（任意）",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "installation_year",
            headerName: "設置年度",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "elapsed_years",
            headerName: "経過年数",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "disposal_limit_period",
            headerName: "処分制限期間など",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "expected_usage_period",
            headerName: "使用見込み期間",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "repairs_before_healthcheck_exists",
            headerName: "健全度調査以前に実施した補修の有無（有無）",
            cellDataType: "boolean",
            filter: false,
        },
        {
            field: "repairs_before_healthcheck_year",
            headerName: "健全度調査以前に実施した補修の有無（年度）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "health_check_year",
            headerName: "健全度調査（年度）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "health_check_deterioration_status",
            headerName: "健全度調査（劣化状況）",
            cellDataType: "text",
            filter: "agTextColumnFilter",
        },
        {
            field: "health_check_condition",
            headerName: "健全度調査（健全度）",
            cellDataType: "text",
            filterParams: distinctFilterParams,
        },
        {
            field: "health_check_urgency",
            headerName: "健全度調査（緊急度）",
            cellDataType: "text",
            filterParams: distinctFilterParams,
        },
        {
            field: "management_type",
            headerName: "管理類型",
            cellDataType: "text",
            filterParams: distinctFilterParams,
        },
        {
            field: "updated_year_with_measures",
            headerName: "対策を踏まえた更新見込み年度",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "cost_2020_thousand_yen",
            headerName: "対策費用・2020年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2020",
            headerName: "対策内容・2020年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "cost_2021_thousand_yen",
            headerName: "対策費用・2021年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2021",
            headerName: "対策内容・2021年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "cost_2022_thousand_yen",
            headerName: "対策費用・2022年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2022",
            headerName: "対策内容・2022年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "cost_2023_thousand_yen",
            headerName: "対策費用・2023年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2023",
            headerName: "対策内容・2023年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "cost_2024_thousand_yen",
            headerName: "対策費用・2024年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2024",
            headerName: "対策内容・2024年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "cost_2025_thousand_yen",
            headerName: "対策費用・2025年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2025",
            headerName: "対策内容・2025年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "cost_2026_thousand_yen",
            headerName: "対策費用・2026年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2026",
            headerName: "対策内容・2026年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "cost_2027_thousand_yen",
            headerName: "対策費用・2027年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2027",
            headerName: "対策内容・2027年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "cost_2028_thousand_yen",
            headerName: "対策費用・2028年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2028",
            headerName: "対策内容・2028年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "cost_2029_thousand_yen",
            headerName: "対策費用・2029年（千円）",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            hide: true,
        },
        {
            field: "content_2029",
            headerName: "対策内容・2029年",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "note_for_longevity",
            headerName: "長寿命化に向けた特記事項",
            cellDataType: "text",
            filter: "agTextColumnFilter",
            hide: true,
        },
        {
            field: "latitude",
            headerName: "緯度",
            hide: true,
        },
        {
            field: "longitude",
            headerName: "経度",
            hide: true,
        }
    ]
}

MasterListColumn.propTypes = {
    onViewMapClicked: PropTypes.func,
}

export default MasterListColumn
