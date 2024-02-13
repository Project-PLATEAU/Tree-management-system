import axios from "axios";

export default new class {

    _user

    setUser = (user) => {
        this._user = user
    }

    _accessToken = async () => {
        return null
    }

    _headers = (token, otherHeaders) => {
        return {
//            AuthorizationToken: `Bearer ${token}`,
            ...otherHeaders,
        }
    }
    _encodeParams = (params) => {
        if (!params) {
            return null
        }
        return Object.fromEntries(
            Object.keys(params).map((k) => {
                switch (typeof params[k]) {
                    case "object":
                        return [k, encodeURI(JSON.stringify(params[k]))]
                    default:
                        break
                }
                return [k, encodeURI(params[k])]
            })
        )
    }

    _req = (method, path, options = null, headers = null) => {
        return new Promise((resolve, reject) => {
            let url = `${process.env.REACT_APP_API_ENDPOINT}/${path}`

            options.params = {user_id: this._user?.user_id, ...options.params}

            if (path.startsWith('/')) {
                path = path.slice(1)
            }

            this._accessToken()
                .then((token) => {
                    axios({
                        url,
                        method,
                        headers: this._headers(token, headers),
                        ...{ ...options, params: this._encodeParams(options.params) },
                    })
                        .then((res) => {
                            if (res.status !== 200) {
                                return reject(res.statusText)
                            }
                            if (!res.data) {
                                return resolve(null)
                            }
                            if (!res.data.result) {
                                return reject(res.data.rows)
                            }

                            if (options?.rawResponse) {
                                resolve(res.data)
                            } else {
                                resolve(res.data.rows)
                            }
                        })
                        .catch((e) => {
                            reject(e)
                        })
                })
                .catch((e) => {
                    reject(e)
                })
        })
    }

    _reqOne = (method, path, options = null, headers = null) => {
        return new Promise((resolve, reject) => {
            this._req(method, path, options, headers)
                .then(res => {
                    if (!res || res.length === 0) {
                        return resolve(null)
                    }
                    resolve(res[0])
                })
                .catch(reject)
        })
    }


    get = (path, params = null, headers = null) => {
        return this._req("get", path, { params }, headers)
    }

    getForAgGrid = (path, params = null, headers = null) => {
        return new Promise((resolve, reject) => {
            this._req("get", path, {params, rawResponse: true}, headers)
                .then(res => {
                    resolve({
                        rowData: res.rows ?? [],
                        rowCount: res.rowCount ?? res.rows.length,
                    })
                })
                .catch(reject)
        })
    }

    getOne = (path, params = null, headers = null) => {
        return this._reqOne("get", path, { params }, headers)
    }

    post = (path, data = null, params = null, headers = null) => {
        return this._req("post", path, { params, data }, headers)
    }

    postOne = (path, data = null, params = null, headers = null) => {
        return this._reqOne("post", path, { params, data }, headers)
    }

    put = (path, data = null, params = null, headers = null) => {
        return this._req("put", path, { params, data }, headers)
    }

    putOne = (path, data = null, params = null, headers = null) => {
        return this._reqOne("put", path, { params, data }, headers)
    }

    delete = (path, data = null, params = null, headers = null) => {
        return this._req("delete", path, { params, data }, headers)
    }

    deleteOne = (path, data = null, params = null, headers = null) => {
        return this._reqOne("delete", path, { params, data }, headers)
    }

    blobConvertToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
            fileReader.onerror = (err) => {
                reject(err)
            }
            fileReader.readAsDataURL(blob)
        })
    }

    _reqBinary = (method, contentType, path, options, headers) => {
        return new Promise((resolve, reject) => {
            let url = `${process.env.REACT_APP_API_ENDPOINT}/${path}`
            options.params = {user_id: this._user?.user_id, ...options.params}

            if (path.startsWith('/')) {
                path = path.slice(1)
            }

            let contentTypeKey = headers ? Object.keys(headers).find(k => k.toLowerCase() === "accept") ?? "accept" : "accept"
            if (!headers) {
                headers = {[contentTypeKey]: contentType}
            } else {
                headers[contentTypeKey] = contentType
            }

            this._accessToken()
                .then((token) => {
                    axios({
                        url,
                        method,
                        headers: this._headers(token, headers),
                        ...options,
                        params: this._encodeParams(options.params),
                        responseType: 'blob',
                    })
                        .then(res => {
                            if (res.data) {
                                return resolve(null)
                            }
                            const blob  = new Blob([res.data], {type: contentType})
                            resolve(blob)
                        })
                        .catch(e => {
                            console.log('[Response]', 'request binary failed', e.message)
                            reject(e)
                        })
                })
        })
    }

    getBinary = (path, contentType, params = null, headers = null) => {
        return this._reqBinary('get', contentType, path, {params}, headers)
    }

    postBinary = (path, contentType, data = null, params = null, headers = null) => {
        return this._reqBinary('post', contentType, path, {data, params}, headers)
    }

    putBinary = (path, contentType, data = null, params = null, headers = null) => {
        return this._reqBinary('put', contentType, path, {data, params}, headers)
    }

    deleteBinary = (path, contentType, data = null, params = null, headers = null) => {
        return this._reqBinary('delete', contentType, path, {data, params}, headers)
    }

    uploadDataURI = (dataUri, contentType, path) => {
        return new Promise(async(resolve, reject) => {
            const formData = new FormData()
            formData.append("data", `data:image/jpeg;base64,${dataUri}`)
            formData.append("content-type", contentType)

            let url = `${process.env.REACT_APP_API_ENDPOINT}/${path}`
            const res = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).catch(e => {
                console.log('[UploadData]', 'error', e.message)
                reject(e)
            })

            resolve(res.data.rows[0])
        })
    }

    uploadData = (blob, extension, path) => {
        return new Promise(async(resolve, reject) => {
            let base64 = await this.blobConvertToBase64(blob)
                .catch(e => {
                    console.log('Cloud not convert to base64', e.message)
                    reject(e)
                })
            const formData = new FormData()
            formData.append("data", base64)
            formData.append("ext", extension)

            let url = `${process.env.REACT_APP_API_ENDPOINT}/${path}`
            const res = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).catch(e => {
                reject(e)
            })

            if (res.data.error) {
                reject(res.data.error)
                return
            }
            if (!res.data.rows || !res.data.rows[0].path) {
                reject("No data")
            }
            resolve(res.data.rows[0])
        })
    }

}()
