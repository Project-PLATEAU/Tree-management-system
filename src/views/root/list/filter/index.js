import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {RootDataContext} from "../../index";
import {Box, Button, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Close as CloseIcon} from "@mui/icons-material";
import APIManager from "../../../../manager/api"
import MasterColumnDef from "../../../root/list/model/master/column"
import { saveAs } from "file-saver"
import PropTypes from "prop-types";

const ListFilterView = (props) => {

    const {state, setMasterSelectedData, setMasterFilterModel, setTreeSelectedData} = useContext(RootDataContext)
    const [filterModelContents, setFilterModelContens] = useState([])
    const columnDef = useMemo(() => MasterColumnDef(), [])
    const selectedLabel = useMemo(() => {
        return state.masterSelectedData?.colName
    }, [state.masterSelectedData])
    const selectedValue = useMemo(() => {
        return state.masterSelectedData?.colValue
    })
    useEffect(() => {
        let contents = [(<Typography style={{fontSize: "12px"}}>フィルタ：</Typography>)]
        if (!state.masterFilterModel) {
            setFilterModelContens(contents)
            return
        }
        let filters = Object.keys(state.masterFilterModel)?.map(key => {
            let def = columnDef.find(v => v.field === key)
            return (
                <Box style={{padding: '0 8px',
                    backgroundColor: '#ccccea',
                    borderRadius: '12px',
                    margin: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'}}>{def.headerName}<IconButton onClick={() => removeFilterModel(key)} size="small"><CloseIcon size="small" style={{width: "18px"}} /></IconButton></Box>
            )
        })
        if ((filters?.length ?? 0) > 0) {
            contents = [...contents, ...filters]
        }
        setFilterModelContens(contents)
    }, [state.masterFilterModel]);

    const removeFilterModel = useCallback((key) => {
        let res = Object.fromEntries(Object.entries(state.masterFilterModel).filter(([k, v]) => {
            return k !== key
        }))
        if (Object.keys(res).length === 0) {
            setMasterFilterModel(null)
        } else {
            setMasterFilterModel(res)
        }
    }, [state.masterFilterModel])

    const onExportExcel = () => {
        props.onExportExcel(state.masterFilterModel, state.masterSortModel)
        /*
        APIManager.postBinary(`list/excel_export/${state.viewMode}`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', {
            filterModel: state.masterFilterModel,
            facility_code: state.masterSelectedData?.facility_code,
            sortModel: state.masterSortModel,
            column_def: MasterColumnDef,
        })
            .then(res => {
                saveAs(res, 'test.xlsx')
            })
            .catch(e => {
                console.log(e)
            })
         */
    }

    return (
        <Box style={{display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            alignItems: 'center',
            fontSize: '12px',
            height: '40px',
            margin: '4px 4px 4px 1rem',
        }}>
            <Typography style={{fontSize: "12px"}}>選択：</Typography>
            {selectedLabel && selectedValue && <Box style={{padding: '0 8px',
                backgroundColor: '#ccccea',
                borderRadius: '12px',
                margin: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'}}>{selectedLabel}: {selectedValue}
                <IconButton
                    onClick={() => {
                        setMasterSelectedData(null)
                    }}
                    size="small">
                    <CloseIcon size="small" style={{width: "18px"}} />
                </IconButton>
            </Box>}
            {filterModelContents}
            <Box style={{flexGrow: 1}} />
            {props.onExportExcel && <Button onClick={props.onExportExcel} variant="outlined">Excelエクスポート</Button>}
        </Box>
    )
}

ListFilterView.propTypes = {
    onExportExcel: PropTypes.func,
}


export default ListFilterView

export const distinctFilterParams = {
    values: (params) => {
        let filterModel = params.api.getFilterModel()
        APIManager.getOne(`list/distinct/${params.colDef.field}`, {
            filterModel: filterModel,
            type: params.colDef.filterPrefix,
        })
            .then(res => {
                console.log(res)
                params.success(
                    ["(空白)", ...res.values]
                )
            })
            .catch(e => {
                params.success([])
            })
    },
    refreshValuesOnOpen: true,
}
