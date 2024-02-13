import {Button} from "@mui/material";
import React, {useCallback, useContext} from "react";
import APIManager from "../../../../../manager/api";
import MasterColumnDef from "../../model/master/column";
import TreeColumnDef from "../../model/tree/column"
import {RootDataContext} from "../../../index";
import { saveAs } from "file-saver"
import {ViewMode} from "../../../data/state";
import dayjs from "dayjs";

export const ExportExcelView = (props) => {

    const { state } = useContext(RootDataContext)
    const onExportExcel = useCallback(() => {
        let filterModel
        let facility_code
        let sortModel
        let columnState
        let columnDef
        let fileName

        switch(state.viewMode) {
            case ViewMode.Master:
                filterModel = state.masterFilterModel
                facility_code = state.masterSelectedData?.facility_code
                sortModel = state.masterSortModel
                columnState = state.masterColumnState
                columnDef = MasterColumnDef()
                fileName = "長寿命化計画対象"
                break
            case ViewMode.Tree:
                filterModel = state.treeFilterModel
                facility_code = state.treeSelectedData?.facility_code
                sortModel = state.treeSortModel
                columnState = state.treeColumnState
                columnDef = TreeColumnDef()
                fileName = "植物管理"
                break
            default:
                return
        }

        APIManager.postBinary(`list/excel_export/${state.viewMode}`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', {
            filterModel,
            facility_code,
            sortModel,
            columnState,
            columnDef,
        })
            .then(res => {
                saveAs(res, `${fileName} - ${dayjs().format("YYYYMMDDHHmm")}.xlsx`)
            })
            .catch(e => {
                console.log(e)
            })
    }, [
        state.viewMode,
        state.masterFilterModel,
        state.masterSelectedData,
        state.masterSortModel,
        state.masterColumnState,
        state.treeFilterModel,
        state.treeSelectedData,
        state.treeSortModel,
        state.treeColumnState,
    ])

    return (
        <Button onClick={onExportExcel} variant="outlined">Excelエクスポート</Button>
    )
}

export const ExportCSVView =(props) => {

}
