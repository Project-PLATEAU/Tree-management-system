import React, {useCallback, useContext, useEffect, useRef} from "react"
import Column from "./column"
import { RootDataContext } from "../../../index"
import APIManager from "../../../../../manager/api"
import ExcelJS from "exceljs";
import dayjs from "dayjs";

const useTreeListModel = () => {
    const { state, setMapMarker, setTreeFilterModel, setTreeSelectedData } = useContext(RootDataContext);
    const isExportExcelCancelRef = useRef(false)

    useEffect(() => {
    }, [state.date])

    const onCellClick = (e) => {
        setTreeSelectedData({...e.data, colId: e.colDef.field, colName: e.colDef.headerName, colValue: e.data[e.colDef.field]})
        e.event.stopPropagation()
    }

    const onRowClick = (e) => {
    }

    const onGetRows = useCallback((params, date, facilityCode, totalRowCountCallback) => {
        let selectedTreeData = window.localStorage.getItem("tree_selected") ? JSON.parse(window.localStorage.getItem("tree_selected")) : null

        APIManager.getForAgGrid("list/tree", {
            ...params.request, date: state.date,
            facility_code: selectedTreeData?.colId === "facility_code" ? selectedTreeData.facility_code : null,
        })
            .then(res => {
                totalRowCountCallback && totalRowCountCallback(res.rowCount)
                params.success(res)
            })
            .catch(e => {
                console.log(e)
                params.fail()
            })
    }, [state.date, state.treeSelectedData, state.treeFilterModel])

    const onViewMapClicked = (lngLat) => {
        setMapMarker(lngLat)
    }

    const onFilterChanged = (filterModel) => {
        setTreeFilterModel(filterModel)
    }

    const onExportExcel = (filterModel, sortModel, columnState) => {
        return new Promise(async (resolve, reject) => {
            isExportExcelCancelRef.current = false
            let rows = await APIManager.get("list/tree", {
                filterModel,
                sortModel,
            }).catch(e => {
                console.log(e)
                reject(e)
            })
            if (isExportExcelCancelRef.current){ return resolve()}

            const cols = columnState.map(v => {
                let d = columnDef.find(f => {
                    if (!f.field) { return false }
                    if (f.field !== v.colId) { return false }
                    if (v.hide) { return false }
                    return !!f.headerName
                })
                console.log(d)
                if (!d) { return null }
                return {...v, ...d}
            }).filter(v => !!v)
            console.log('[Master]', 'export excel', filterModel, sortModel, columnState, columnDef, cols)

            if (cols.length === 0) {
                return resolve()
            }
            if (isExportExcelCancelRef.current) { return resolve()}

            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet("植物管理", {
                views: [{ state: "frozen", ySplit: 2 }],
            })
            worksheet.properties.defaultRowHeight = 30
            worksheet.getCell("A1:ZZ10000").font = { size: 14 }

            let rowCount = 1
            // カラム名
            cols.map((v, i) => {
                worksheet.getCell(rowCount, i+ 1).value = v.field
                if (v.width) {
                    worksheet.getColumn(i + 1).width = parseInt(v.width/ 10)
                }
            }); worksheet.getRow(rowCount).hidden = true; rowCount++
            // 表示名
            cols.map((v, i) => worksheet.getCell(rowCount, i + 1).value = v.headerName); rowCount++
            // データ出力
            rows.forEach((row) => {
                cols.forEach((v, i) => {
                    worksheet.getCell(rowCount, i + 1).value = row[v.field]
                })
                rowCount++
            })

            if (isExportExcelCancelRef.current) { return resolve()}
            const uint8Array = await workbook.xlsx.writeBuffer()
            const blob = new Blob([uint8Array], {type: 'application/octet-binary'})
            const a = document.createElement('a')
            a.href = window.URL.createObjectURL(blob)
            a.download = `植物管理 - ${dayjs().format("YYYYMMDDHHmm")}.xlsx`
            a.click()
            a.remove()
            resolve()
        })
    }

    const onExportExcelCancel = () => isExportExcelCancelRef.current = true

    const columnDef = Column({onViewMapClicked});

    return {
        defaultColDef: {
            resizable: true,
            sortable: true,
            filter: true,
            floatingFilter: true,
            filterPrefix: "tree",
        },
        columnDef,
        onGetRows,
        onCellClick,
        onRowClick,
        onFilterChanged,
        onExportExcel,
        onExportExcelCancel,
    };
};

export default useTreeListModel;

