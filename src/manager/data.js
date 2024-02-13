import APIManager from "./api"
export default new class {

    constructor() {
    }

    getIncidentRows = (params, date) => {
        return APIManager.getForAgGrid("list/incident", {...params.request, date})
    }

    getWaterMeterRows = (params, date) => {
        return APIManager.getForAgGrid("list/water_meter", {...params.request, date})
    }

    getWaterTempRows = (params, date) => {
        return APIManager.getForAgGrid("list/water_temp", {...params.request, date})
    }

    getWaterQualityRows = (params, date) => {
        return APIManager.getForAgGrid("list/water_quality", {...params.request, date})
    }

    getMaster = (params, date) => {

    }
}()
