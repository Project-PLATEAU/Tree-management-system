import PropTypes from "prop-types";
import React from "react";

const UseReportGridReportData = (props) => {

    const routeItemId = {
        all: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        route_a: [11, 13, 14, 15, 16, 17, 18],
        route_b: [9, 10, 12, 15, 16, 17, 18]
    }

    let work = []

    let openWork = Object.fromEntries(props.data.open_work.map(v=> [v.item_id, v]))
    let closeWork = Object.fromEntries(props.data.close_work.map(v => [v.item_id, v]))
    let patrolWork = Object.fromEntries(props.data.patrol_work.map(v => [v.item_id, v]))

//    console.log('[Get prop data]', openWork, patrolWork, closeWork)

    for(let v of props.data.work_time) {
        work.push({kubun: '業務時刻', type: 'time', ...v})
    }

    for (let v of props.data.item_master.filter(v => v.type === "open")) {
        if (!v[`${props.data.user_status.season}_shift`]) { continue }
        work.push({kubun: '開園業務', type: 'value', ...v, ...openWork[v.item_id], name: v.item_name})
    }
    for (let v of props.data.item_master.filter(v => v.type === "patrol")) {
        if (!v[`${props.data.user_status.season}_shift`]) { continue }
        work.push({kubun: '巡回業務', type: 'value', ...v, ...patrolWork[v.item_id], name: v.item_name})
    }
    for (let v of props.data.item_master.filter(v => v.type === "close")){
        if (!v[`${props.data.user_status.season}_shift`]) { continue }
        work.push({kubun: '閉園業務', type: 'value', ...v, ...closeWork[v.item_id], name: v.item_name})
    }

    return work
}

UseReportGridReportData.propTypes = {
    data: PropTypes.object,
}

export default UseReportGridReportData
