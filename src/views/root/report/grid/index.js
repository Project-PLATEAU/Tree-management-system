import React, {useCallback, useEffect, useRef, useState} from "react"
import {Box, Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import LOCALE_JA from "../../../../resources/aggrid/locale.ja";
import ReportGridReportColumnDef from "./column/report";
import ReportGridFacilityColumnDef from "./column/facility";
import PropTypes from "prop-types";
import UseReportGridOtherData from "./data/other";
import UseReportGridReportData from "./data/report";
import UseReportGridFacilityData from "./data/facility";
import ReportGridOtherColumnDef from "./column/other";

const styles = {
    root: {
        position :"relative",
    },
    bottomNav: {
        position: 'fixed',
        bottom: '0px',
        width: '90%',
        height: '60px',
        backgroundColor: '#f6f6ec',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center',
        zIndex: '1000',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#c8c8c8'
    }
}

const ReportGridView = (props) => {

    const otherGridApiRef = useRef()
    const otherColumnApiRef = useRef()
    const reportGridApiRef = useRef()
    const reportColumnApiRef = useRef()
    const facilityGridApiRef = useRef()
    const facilityColumnApiRef = useRef()

    const [otherRowData, setOtherRowData] = useState(UseReportGridOtherData(props))
    const [reportRowData, setReportRowData] = useState(UseReportGridReportData(props))
    const [facilityRowData, setFacilityRowData] = useState(UseReportGridFacilityData(props))

    const editedReportRowDataRef = useRef([])
    const editedFacilityRowDataRef = useRef([])
    const editedOtherRowDataRef = useRef([])

    const [edited, setEdited] = useState(false)

    useEffect(() => {
        if (!props.data) { return }
        console.log('[Grid]', 'update props.data', props.data)
    }, [props.data]);

    useEffect(() => {
        console.log('[ReportGrid]', 'report new data', reportRowData)
    }, [reportRowData]);

    const onOtherGridReady = ({api, columnApi}) => {
        otherGridApiRef.current = api
        otherColumnApiRef.current = columnApi
    }

    const onReportGridReady = ({ api, columnApi }) => {
        reportGridApiRef.current = api
        reportColumnApiRef.current = columnApi
    }

    const onFacilityGridReady = ({api, columnApi}) => {
        facilityGridApiRef.current = api
        facilityColumnApiRef.current = columnApi
    }

    const onOtherCellEditingStopped = (e) => {
        editedOtherRowDataRef.current = editedOtherRowDataRef.current.filter(
            v => v.voice_id !== e.data.voice_id
        )
        editedOtherRowDataRef.current = [...editedOtherRowDataRef.current, e.data]
        console.log('[Other]', 'edited' , reportRowData, e, editedOtherRowDataRef.current)
        setEdited(true)
    }

    const onReportCellEditingStopped = (e) => {
        console.log('[Report]', 'cell edit stopped', e, reportRowData)

        editedReportRowDataRef.current = editedReportRowDataRef.current.filter(
            v => v.kubun !== e.data.kubun
            || v.code !== e.data.code
            || v.value_id !== e.data.value_id
            || v.facility_id !== e.data.facility_id
            || v.item_id !== e.data.item_id
            || v.work_time_type_id !== e.data.work_time_type_id
        )
        editedReportRowDataRef.current = [...editedReportRowDataRef.current, e.data]
        console.log('[Report]', 'edited' , reportRowData, e, editedReportRowDataRef.current)
        setEdited(true)
    }

    const onFacilityCellEditingStopped = (e) => {

        editedFacilityRowDataRef.current = editedFacilityRowDataRef.current.filter(
            v => v.kubun !== e.data.kubun
                || v.code !== e.data.code
                || v.value_id !== e.data.value_id
                || v.facility_id !== e.data.facility_id)

        editedFacilityRowDataRef.current = [...editedFacilityRowDataRef.current, e.data]
        console.log('[Facility]', 'edited' , facilityRowData, e, editedFacilityRowDataRef.current)
        setEdited(true)
    }

    const onReset = useCallback(() => {
        editedReportRowDataRef.current = []
        editedFacilityRowDataRef.current = []
        editedOtherRowDataRef.current = []
        setOtherRowData(UseReportGridOtherData(props))
        setReportRowData(UseReportGridReportData(props))
        setFacilityRowData(UseReportGridFacilityData(props))
        setEdited(false)
    }, [
        editedReportRowDataRef.current,
        editedFacilityRowDataRef.current,
        editedOtherRowDataRef.current,
        otherRowData,
        reportRowData,
        facilityRowData,
        edited,
        props.dataRefreshTime,
        props.data,
    ])

    useEffect(() => {
        console.log('[Report]', 'data refreshed')
        editedReportRowDataRef.current = []
        editedFacilityRowDataRef.current = []
        editedOtherRowDataRef.current = []
        setOtherRowData(UseReportGridOtherData(props))
        setReportRowData(UseReportGridReportData(props))
        setFacilityRowData(UseReportGridFacilityData(props))
    }, [props.dataRefreshTime, props.data]);

    useEffect(() => {
        props.onLoad && props.onLoad({reportRowData, facilityRowData, otherRowData})
    }, [reportRowData, facilityRowData, otherRowData])

    const onSubmit = () => {
        console.log(props, editedReportRowDataRef.current, editedFacilityRowDataRef.current)
        props.onSave && props.onSave({report: editedReportRowDataRef.current, facility: editedFacilityRowDataRef.current, other: editedOtherRowDataRef.current})
            .then(() => {
                setTimeout(() => {
                    onReset()
                }, 1000)
            })
    }

    return (
        <Box style={styles.root}>
            <Box style={{width: "100%", height: "160px"}}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    onGridReady={onOtherGridReady}
                    rowModelType="clientSide"
                    localeText={LOCALE_JA}
                    defaultColDef={{
                        resizable: true,
                        sortable: false,
                        filter: false,
                        floatingFilter: false,
                        suppressKeyboardEvent: (e) => {
                            if (e.event.isComposing && e.event.code === 'Enter') {
                                return true
                            }
                        }
                    }}
                    rowData={otherRowData}
                    columnDefs={ReportGridOtherColumnDef}
                    onCellEditingStopped={onOtherCellEditingStopped}
                />
            </Box>
            <Box style={{width: "100%", height: "400px"}}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    onGridReady={onReportGridReady}
                    rowModelType="clientSide"
                    localeText={LOCALE_JA}
                    defaultColDef={{
                        resizable: true,
                        sortable: false,
                        filter: false,
                        floatingFilter: false,
                        suppressKeyboardEvent: (e) => {
                            if (e.event.isComposing && e.event.code === 'Enter') {
                                return true
                            }
                        }
                    }}
                    rowData={reportRowData}
                    columnDefs={ReportGridReportColumnDef}
                    onCellEditingStopped={onReportCellEditingStopped}
                />
            </Box>
            <Box style={{width: "100%", height: "1000px", marginBottom: "60px"}}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    onGridReady={onFacilityGridReady}
                    rowModelType="clientSide"
                    localeText={LOCALE_JA}
                    defaultColDef={{
                        resizable: true,
                        sortable: false,
                        filter: false,
                        floatingFilter: false,
                        suppressKeyboardEvent: (e) => {
                            if (e.event.isComposing && e.event.code === 'Enter') {
                                return true
                            }
                        }
                    }}
                    rowData={facilityRowData}
                    columnDefs={ReportGridFacilityColumnDef}
                    onCellEditingStopped={onFacilityCellEditingStopped}
                />
            </Box>
            {edited && (
                <Box style={styles.bottomNav}>
                    <Button onClick={onReset} variant="contained" color="secondary">変更をリセット</Button>
                    <Button onClick={onSubmit} variant="contained">変更を保存</Button>
                </Box>)}
        </Box>
    )
}

ReportGridView.propTypes = {
    data: PropTypes.object,
    dataRefreshTime: PropTypes.number,
    onSave: PropTypes.func,
    onLoad: PropTypes.func,
}

export default ReportGridView
