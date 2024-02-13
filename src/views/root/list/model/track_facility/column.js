import dayjs from "dayjs";

const TrackFacilityListColumn = (props) => {
    return [
        {
            field: 'user_name',
            headerName: '作業者',
            filter: 'agTextColumnFilter'
        },
        {
            field: 'zone_name',
            headerName: 'ゾーン',
            filter: 'agTextColumnFilter',
        },
        {
            field: 'facility_name',
            headerName: '設備名',
            filter: 'agTextColumnFilter',
        },
        {
            headerName: '時間',
            children: [
                {
                    field: 'in_time',
                    headerName: '入',
                    filter: 'agTextColumnFilter',
                    cellRenderer: (params) => {
                        if (!params.value) { return null }
                        return dayjs(params.value).format("HH:mm")
                    },
                },
                {
                    field: 'out_time',
                    headerName: '出',
                    filter: 'agTextColumnFilter',
                    cellRenderer: (params) => {
                        if (!params.value) { return null }
                        return dayjs(params.value).format("HH:mm")
                    },
                },
                {
                    field: 'duration',
                    headerName: '滞在時間',
                    filter: 'agNumberColumnFilter',
                },
            ],
        },
    ]
}

export default TrackFacilityListColumn
