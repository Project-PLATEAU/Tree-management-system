import React, {useContext} from "react";
import Column from "./column";
import APIManager from "../../../../../manager/api";

const useWaterMeterListModel = () => {

    const onCellClick = (e) => {
        // TODO: Not Implemented
    }

    const onRowClick = (e) => {
        // TODO: Not Implemented
    }

    const onGetRows = (params, date, _, totalRowCountCallback) => {
        APIManager.getForAgGrid("list/water_meter", {...params.request, date})
            .then(res => {
                totalRowCountCallback && totalRowCountCallback(res.rowCount)
                params.success(res)
            })
            .catch(e => {
                console.log(e.message)
                params.fail()
            })
    }

    const columnDef = Column();

    return {
        columnDef,
        onGetRows,
        onCellClick,
        onRowClick,
    };
};

export default useWaterMeterListModel;

