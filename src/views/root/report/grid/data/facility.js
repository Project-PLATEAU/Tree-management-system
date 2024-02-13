import PropTypes from "prop-types"
import React from "react"

const UseReportGridFacilityData = (props) => {

    const GetReviewPerIncident = (key) => {
        if (!Object.keys(props.data).includes(key)) { return "0/0"}

        let incident = 0
        let uncheck = 0
        for(let v of props.data[key]) {
            if (v.is_incident) {
                incident++
                if (!v.reviewed) {
                    uncheck++
                }
            }
        }
        return `${uncheck}/${incident}`
    }

    let d = []

    d = props.data?.playground.map(v => {
        return {kubun: `屋外遊具`, ...v}
    })

    d = d.concat(props.data.water_playground.map(v => {
        return {kubun: `水遊具`, ...v}
    }))

    d = d.concat(props.data.water_chlorine.am.map(v => {
        return {kubun: "水質（午前）", ...v, name: `残留塩素 ${v.name}`}
    }))
    d = d.concat(props.data.water_temp.am.map(v => {
        return {kubun: "水質（午前）", ...v, name: `水温 ${ v.name}`}
    }))
    d = d.concat(props.data.water_chlorine.pm.map(v => {
        return {kubun: "水質（午後）", ...v, name: `残留塩素 ${v.name}`}
    }))
    d = d.concat(props.data.water_temp.pm.map(v => {
        return {kubun: "水質（午後）", ...v, name: `水温 ${ v.name}`}
    }))

    d = d.concat(props.data.play_vill.map(v => {
        return {kubun: "遊びの里", ...v}
    }))

    d = d.concat(props.data.point.map(v => {
        return {kubun: "地点報告", ...v}
    }))

    d = d.concat(props.data.trail.map(v => {
        return {kubun: "トレラン", ...v}
    }))

    d = d.concat(props.data.facility.map(v => {
        return {kubun: "施設", ...v}
    }))

    d = d.concat(props.data.water_meter.am.map(v => {
        return {kubun: "水道メーター（午前）", ...v}
    }))
    d = d.concat(props.data.water_meter.pm.map(v => {
        return {kubun: "水道メーター（午後）", ...v}
    }))

    if (props.data.snow_fall) {
        d = d.concat(props.data.snow_fall.map(v => {
            return {kubun: "24h積雪", ...v}
        }))
    }

    return d

}

UseReportGridFacilityData.propTypes = {
    data: PropTypes.object,
}

export default UseReportGridFacilityData
