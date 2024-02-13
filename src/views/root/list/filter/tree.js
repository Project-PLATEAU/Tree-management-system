import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {RootDataContext} from "../../index";
import TreeColumnDef from "../model/tree/column";
import {Box, Button, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Close as CloseIcon} from "@mui/icons-material";
import APIManager from "../../../../manager/api";
import {ExportExcelView} from "./component/export";
import PropTypes from "prop-types";

const TreeListFilterView = (props) => {

    const {state, setTreeSelectedData, setMasterSelectedData, setTreeFilterModel} = useContext(RootDataContext)
    const [filterModelContents, setFilterModelContens] = useState([])
    const columnDef = useMemo(() => TreeColumnDef(), [])
    const selectedLabel = useMemo(() => {
        if (!state.treeSelectedData) { return null }
        console.log('[TreeSelect]', 'selected label', state.treeSelectedData)
        return state.treeSelectedData.colName
    }, [state.treeSelectedData])
    const selectedValue = useMemo(() => {
        if (!state.treeSelectedData) { return null }
        return state.treeSelectedData.colValue
    }, [state.treeSelectedData])

    useEffect(() => {
        let contents = [(<Typography style={{fontSize: "12px"}}>フィルタ：</Typography>)]
        if (!state.treeFilterModel) {
            setFilterModelContens(contents)
            return
        }
        let filters = Object.keys(state.treeFilterModel)?.map(key => {
            let def = columnDef.find(v => v.field === key)
            return (
                <Box style={{padding: '0 8px',
                    backgroundColor: '#ccccea',
                    borderRadius: '12px',
                    margin: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'}}>{def?.headerName}<IconButton onClick={() => removeFilterModel(key)} size="small"><CloseIcon size="small" style={{width: "18px"}} /></IconButton></Box>
            )
        })
        if ((filters?.length ?? 0) > 0) {
            contents = [...contents, ...filters]
        }
        setFilterModelContens(contents)
    }, [state.treeFilterModel]);

    const removeFilterModel = useCallback((key) => {
        let res = Object.fromEntries(Object.entries(state.treeFilterModel).filter(([k, v]) => {
            return k !== key
        }))
        if (Object.keys(res).length === 0) {
            setTreeFilterModel(null)
        } else {
            setTreeFilterModel(res)
        }
    }, [state.treeFilterModel])

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
            {selectedValue && (<Box style={{padding: '0 8px',
                backgroundColor: '#ccccea',
                borderRadius: '12px',
                margin: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'}}>{selectedLabel}: {selectedValue} <IconButton onClick={() => {
                    setTreeSelectedData(null)
                    setMasterSelectedData(null)
            }} size="small"><CloseIcon size="small" style={{width: "18px"}} /></IconButton></Box>)}
            {filterModelContents}
            <Box style={{flexGrow: 1}} />
            {props.onExportExcel && <Button onClick={props.onExportExcel} variant="outlined">Excelエクスポート</Button>}
        </Box>
    )
}

TreeListFilterView.propTypes = {
    onExportExcel: PropTypes.func,
}

export default TreeListFilterView

export const treeDistinctFilterParams = {
    values: (params) => {
//        console.log('[Distinct filter]', params)
        let storageKey = params.colDef.filterPrefix ? `${params.colDef.filterPrefix}_filter`: 'filter'
        let filterModel = window.localStorage.getItem(storageKey) ?? "{}"

        console.log('[Distinct filter]', params, filterModel)

        APIManager.getOne(`list/distinct/${params.colDef.field}`, {
            filterModel: filterModel,
            type: "tree",
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
