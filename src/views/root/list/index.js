import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react"
import { AgGridReact } from "ag-grid-react";
import LOCALE_JA from "../../../resources/aggrid/locale.ja"
import useIncidentListModel from "./model/incident"
import useWaterMeterListModel from "./model/water_meter";
import useWaterQualityListModel from "./model/water_quality";
import useMasterListModel from "./model/master";
import useTrackFacilityListModel from "./model/track_facility";
import useTreeListModel from "./model/tree"
import {Box, Button, CircularProgress} from "@mui/material";
import {RootDataContext} from "../index";
import {ViewMode} from "../data/state";
import useWaterTempListModel from "./model/water_temp";
import FilterView from "./filter"
import TreeFilterView from "./filter/tree"
import {TotalRowCountStatusPanel} from "../../../resources/aggrid/util";

const styles = {
    root: {
        width: '100%',
        height: 'calc(100% - 20px)',
    },
    excelExportingBox: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "rgba(255,255,255,0.75)",
    },
    totalRowCount: {
        backgroundColor: '#eee',
        display: 'flex',
        justifyContent: 'end',
        fontSize: '12px',
        height: '20px',
        alignItems: 'center',
        paddingRight: '1.3rem',
        color: '#575757',
    }
}

const RootListView = (props) => {

    const api = useRef()
    const columnApi = useRef()
    const { state, setMapMarker, setDetail, setMasterSortModel, setTreeSortModel, setMasterColumnState, setTreeColumnState } = useContext(RootDataContext)
    const [columnDef, setColumnDef] = useState()
    const [isExcelExporting, setIsExcelExporting] = useState(false)
    const [defaultColDef, setDefaultColDef] = useState({
        resizable: true,
        sortable: false,
        filter: false,
        floatingFilter: false,
    })
    const [totalRowCount, setTotalRowCount] = useState()

    const incidentModel = useIncidentListModel({api})
    const waterMeterModel = useWaterMeterListModel({api})
    const waterQualityModel = useWaterQualityListModel({api})
    const waterTempModel = useWaterTempListModel({api})
    const masterModel = useMasterListModel({api})
    const trackFacilityModel = useTrackFacilityListModel({api})
    const treeModel = useTreeListModel({api})
    const onCellClickRef = useRef()
    const onRowClickRef = useRef()
    const onGetRowsRef = useRef()
    const onExportExcelRef = useRef()
    const onExportExcelCancelRef = useRef()
    const detailRef = useRef()
    const onFilterChangedRef = useRef()

    const models = useMemo(() => {
        return {
            [ViewMode.Incident]: incidentModel,
            [ViewMode.WaterMeter]: waterMeterModel,
            [ViewMode.WaterQuality]: waterQualityModel,
            [ViewMode.WaterTemp]: waterTempModel,
            [ViewMode.TrackFacility]: trackFacilityModel,
            [ViewMode.Master]: masterModel,
            [ViewMode.Tree]: treeModel,
        }
    }, [])

    useEffect(() => {
        if (!state.viewMode) {
            return
        }

        let model = models[state.viewMode]
        setColumnDef(model.columnDef)
        if (model.defaultColDef) {
            setDefaultColDef(model.defaultColDef)
        }
        setTotalRowCount(null)
        onGetRowsRef.current = model.onGetRows
        onCellClickRef.current = model.onCellClick
        onRowClickRef.current = model.onRowClick
        onFilterChangedRef.current = model.onFilterChanged
        onExportExcelRef.current = model.onExportExcel
        onExportExcelCancelRef.current = model.onExportExcelCancel

    }, [state.viewMode])

    useEffect(() => {
        api.current?.refreshServerSide({purge: true})
    }, [state.masterSelectedData])

    useEffect(() => {
        if (!state.date) { return }
        api.current?.refreshServerSide({purge: true})

    }, [state.date])

    useEffect(() => {
        api.current?.setFilterModel(state.masterFilterModel)
    }, [state.masterFilterModel])

    const onGridReady = (params) => {
        api.current = params.api
        columnApi.current = params.columnApi
    }

    const onCellClicked = useCallback((e, f, g) => {
        if (state.viewMode === ViewMode.Incident) {
            if (e.column.colId === "map") {
                if (e.data.latitude && e.data.longitude) {
                    setMapMarker({
                        latitude: e.data.latitude,
                        longitude: e.data.longitude,
                    })
                }
            } else {
                detailRef.current = e.data
            }
        } else {
            onCellClickRef.current && onCellClickRef.current(e)
        }
    }, [state.viewMode, onCellClickRef.current])

    const onRowClicked = (e) => {
        if (state.viewMode === ViewMode.Incident) {
            setDetail({...e.data, mode: state.viewMode, detail_type: "incident"})
        }
    }

    const onFilterChanged = (e) => {
        onFilterChangedRef.current && onFilterChangedRef.current(api.current.getFilterModel())
    }

    const onSortChanged = useCallback((e) => {
        let sortModel = []

        for(let c of columnApi.current.getColumnState()) {
            if (c.sort) {
                sortModel.push({sort: c.sort, colId: c.colId})
            }
        }

        switch(state.viewMode) {
            case ViewMode.Master:
                setMasterSortModel(sortModel)
                break
            case ViewMode.Tree:
                setTreeSortModel(sortModel)
                break
            default:
                break
        }
    }, [state.viewMode])

    const onChangeColumnState = useCallback(() => {
        switch(state.viewMode) {
            case ViewMode.Master:
                setMasterColumnState(columnApi.current.getColumnState())
                break
            case ViewMode.Tree:
                setTreeColumnState(columnApi.current.getColumnState())
                break
            default:
                break
        }
    }, [state.viewMode])

    const onExportExcel = () => {
        if (!onExportExcelRef.current) {
            return
        }
        let fm = api.current.getFilterModel()

        let sm = []
        for(let c of columnApi.current.getColumnState()) {
            if (c.sort) {
                sm.push({sort: c.sort, colId: c.colId})
            }
        }

        setIsExcelExporting(true)
        onExportExcelRef.current(fm, sm, columnApi.current.getColumnState())
            .then(() => {
                setIsExcelExporting(false)
            })
    }

    const onExcelExportCancel = () => {
        onExportExcelCancelRef.current && onExportExcelCancelRef.current()
        setIsExcelExporting(false)
    }

    return (
        <Box sx={styles.root}>
            {state.viewMode === ViewMode.Master && <FilterView onExportExcel={onExportExcel} />}
            {state.viewMode === ViewMode.Tree && <TreeFilterView onExportExcel={onExportExcel} />}
            <AgGridReact
                containerStyle={{height: "calc(100% - 48px)"}}
                className={'ag-theme-balham'}
                onGridReady={onGridReady}
                rowModelType="serverSide"
                serverSideDatasource={{
                    getRows(params) {
                        if (!onGetRowsRef.current) {
                            params.fail()
                            return
                        }
                        onGetRowsRef.current(params, state.date, state.masterFacilityCode, setTotalRowCount)
                    }
                }}
                overlayLoadingTemplate={
                    '<span className="ag-overlay-loading-center">読込中...</span>'
                }
                localeText={LOCALE_JA}
                defaultColDef={defaultColDef}
                columnDefs={columnDef}
                onCellClicked={onCellClicked}
                onRowClicked={onRowClicked}
                onFilterChanged={onFilterChanged}
                onSortChanged={onSortChanged}
                onColumnMoved={onChangeColumnState}
                onColumnVisible={onChangeColumnState}
                onColumnResized={onChangeColumnState}
                sideBar={{
                        toolPanels: [
                            {
                                id: "columns",
                                labelDefault: "列選択",
                                labelKey: "columns",
                                iconKey: "columns",
                                toolPanel: "agColumnsToolPanel",
                                toolPanelParams: {
                                    suppressRowGroups: true,
                                    suppressValues: true,
                                    suppressPivots: true,
                                    suppressPivotMode: true,
                                    suppressColumnFilter: true,
                                    suppressColumnSelectAll: true,
                                    suppressColumnExpandAll: true,
                                },
                            },
                        ],
                    }}
            >
            </AgGridReact>
            {totalRowCount && <Box style={styles.totalRowCount}>検索結果：{totalRowCount?.toLocaleString()}</Box>}
            {isExcelExporting && (
                <Box style={styles.excelExportingBox}>
                    <Box>Excel生成中</Box>
                    <CircularProgress />
                    <Button style={{margin: "1rem"}} variant="contained" color="secondary" onClick={onExcelExportCancel}>キャンセル</Button>
                </Box>
            )}
        </Box>
    )
}

RootListView.propTypes = {

}

export default RootListView
