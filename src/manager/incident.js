import APIManager from "./api"
import dayjs from "dayjs";

const IncidentManager = new class {

    constructor() {

    }

    getListData = (params) => {
        return new Promise((resolve, reject) => {
            APIManager.get("incident/list", params.request)
                .then(rows => {
                    resolve({rows: rows, rowCount: Array.from(rows).length})
                })
                .catch(reject)
        })
    }

}()

export default IncidentManager
