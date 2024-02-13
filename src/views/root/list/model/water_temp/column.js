import React from "react"
import dayjs from "dayjs"

const WaterTempListColumn = (props) => {
    return [
        {
            field: "facility_name",
            headerName: "水温",
            filter: "agTextColumnFilter",
        },
        {
            headerName: "1回目",
            children: [
                {
                    field: "time1",
                    headerName: "時間",
                    filter: 'agTextColumnFilter',
                    cellRenderer: (params) => {
                        if (!params.value) { return null }
                        if (dayjs(params.value).format("HH:mm") === "00:00") {
                            return "報告書で入力"
                        }
                        return dayjs(params.value).format("HH:mm")
                    },
                },
                {
                    field: "val1",
                    headerName: "数値",
                    filter: 'agNumberColumnFilter'
                },
                {
                    field: "user1",
                    headerName: "作業者",
                    filter: "agTextColumnFilter",
                }
            ]
        },
        {
            headerName: "2回目",
            children: [
                {
                    field: "time2",
                    headerName: "時間",
                    filter: 'agTextColumnFilter',
                    cellRenderer: (params) => {
                        if (!params.value) { return null }
                        if (dayjs(params.value).format("HH:mm") === "00:00") {
                            return "報告書で入力"
                        }
                        return dayjs(params.value).format("HH:mm")
                    },
                },
                {
                    field: "val2",
                    headerName: "数値",
                    filter: 'agNumberColumnFilter'
                },
                {
                    field: "user2",
                    headerName: "作業者",
                    filter: "agTextColumnFilter",
                }
            ]
        },
        {
            headerName: "3回目",
            children: [
                {
                    field: "time3",
                    headerName: "時間",
                    filter: 'agTextColumnFilter',
                    cellRenderer: (params) => {
                        if (!params.value) { return null }
                        if (dayjs(params.value).format("HH:mm") === "00:00") {
                            return "報告書で入力"
                        }
                        return dayjs(params.value).format("HH:mm")
                    },
                },
                {
                    field: "val3",
                    headerName: "数値",
                    filter: 'agNumberColumnFilter'
                },
                {
                    field: "user3",
                    headerName: "作業者",
                    filter: "agTextColumnFilter",
                }
            ]
        },
        {
            headerName: "4回目",
            children: [
                {
                    field: "time4",
                    headerName: "時間",
                    filter: 'agTextColumnFilter',
                    cellRenderer: (params) => {
                        if (!params.value) { return null }
                        if (dayjs(params.value).format("HH:mm") === "00:00") {
                            return "報告書で入力"
                        }
                        return dayjs(params.value).format("HH:mm")
                    },
                },
                {
                    field: "val4",
                    headerName: "数値",
                    filter: 'agNumberColumnFilter'
                },
                {
                    field: "user4",
                    headerName: "作業者",
                    filter: "agTextColumnFilter",
                }
            ]
        },
        {
            headerName: "5回目",
            children: [
                {
                    field: "time5",
                    headerName: "時間",
                    filter: 'agTextColumnFilter',
                    cellRenderer: (params) => {
                        if (!params.value) { return null }
                        if (dayjs(params.value).format("HH:mm") === "00:00") {
                            return "報告書で入力"
                        }
                        return dayjs(params.value).format("HH:mm")
                    },
                },
                {
                    field: "val5",
                    headerName: "数値",
                    filter: 'agNumberColumnFilter'

                },
                {
                    field: "user5",
                    headerName: "作業者",
                    filter: "agTextColumnFilter",
                }
            ]
        },
    ]
}

export default WaterTempListColumn
