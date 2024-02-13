import * as Cesium from "cesium"
import {useEffect, useRef, useState} from "react";

const MapViewMode = {
    v2D: "2d",
    v3D: "3d",
}

export const TileType = {
    tTerrain: "terrain",
    t3DTiles: "3d_tiles",
    tGeoJson: "geo_json",
}

let initLoad = false

const useCesium = ({mapRef, basemapDef, layersDef, onFeatureClick}) => {

    /**
     * @type {[Cesium.Viewer, React.Dispatch<Cesium.Viewer>]} state
     */
    const [viewer, setViewer] = useState()
    const [layerInitialized, setLayerInitialized] = useState(false)

    const initRef = useRef(0)

    useEffect(() => {
        initRef.current++
        if (initRef.current > 1) { return }

        let v
        Cesium.CesiumTerrainProvider.fromIonAssetId(basemapDef.asset_id)
            .then(provider => {
                v = new Cesium.Viewer(mapRef.current, {
                    terrainProvider: provider,
                    sceneMode: Cesium.SceneMode.SCENE3D,
                    baseLayerPicker: false,
                    timeline : false,
                    animation : false,
                    homeButton: false,
                    vrButton: false,
                    geocoder:false,
                    sceneModePicker:false,
                    navigationHelpButton:false,
                    infoBox: false,
                    selectionIndicator: false,
                    shadows: false,
                    shouldAnimate: true,
                    clampToHeightSupported:true,
                })
                const fixedTime = Cesium.JulianDate.fromIso8601('2023-06-20T01:00:00Z');

                v.clock.currentTime = fixedTime;
                setViewer(v)
                setLayerInitialized(true)
            }).catch(e => {
                console.log('basemap layer error', e)
        })

        return () => {
            v?.destroy()
            setViewer(null)
            initLoad = false
        }
    }, [])

    return {
        viewer,
        layerInitialized,
    }
}


export const AgGridFilterToCesiumShowConditions = (filterData) => {
    let conditions = []

    Object.entries(filterData).forEach(([key, filter]) => {
        let ret = null
        switch (filter.filterType) {
            case "text":
                ret = AgGridTextFilterToShowCondition(key, filter)
                break
            case "number":
                ret = AgGridNumberFilterToShowCondition(key, filter)
                break
            case "set":
                ret = AgGridSetFilterToShowCondition(key, filter.values)
                break
            default:
                break
        }
        if (ret && Array.isArray(ret)) {
            conditions = conditions.concat(ret)
        }
    })

    return conditions
}

const AgGridTextFilterToShowCondition = (key, param) => {
    if (param.operator && param.condition1 && param.condition2) {
        let con1 = AgGridTextFilterToShowCondition(key, param.condition1)
        let con2 = AgGridTextFilterToShowCondition(key, param.condition2)
        if (param.operator === "AND") {
            return [con1, con2]
        } else {
            return [`(${con1} || ${con2})`]
        }
    }

    let pValue =
        typeof param.filter === "string" ? `'${param.filter}'` : param.filter

    switch (param.type) {
        case "equals":
            return [`(\${${key}} === ${pValue})`]
        case "notEqual":
            return [`(\${${key} === ${pValue})`]
        case "contains":
            return [`(regExp('${param.filter}').test(\${${key}}))`]
        case "notContains":
            return [`(regExp('${param.filter}').test(\${${key}}) === false)`]
        case "startsWith":
            return [`(regExp('^${param.filter}').test(\${${key}}))`]
        case "endsWith":
            return [`(regExp('${param.filter}$').test(\${${key}}))`]
        default:
            return null
    }
}

const AgGridNumberFilterToShowCondition = (key, param) => {
    if (param.operator && param.condition1 && param.condition2) {
        let con1 = AgGridNumberFilterToShowCondition(key, param.condition1)
        let con2 = AgGridNumberFilterToShowCondition(key, param.condition2)
        if (param.operator === "AND") {
            return [con1, con2]
        } else {
            return [`(${con1} || ${con2})`]
        }
    }

    switch (param.type) {
        case "equals":
            return [`(\${${key}} === ${param.filter})`]
        case "notEquals":
            return [`(\${${key}} !== ${param.filter})`]
        case "lessThan":
            return [`(\${${key}} < ${param.filter})`]
        case "lessThanOrEqual":
            return [`(\${${key}} <= ${param.filter})`]
        case "greaterThan":
            return [`(\${${key}} > ${param.filter})`]
        case "greaterThanOrEqual":
            return [`(\${${key}} >= ${param.fitler})`]
        case "inRange":
            return [`((\${${key}} >= ${param.filter}) && (\${${key}} <= ${param.filterTo}))`]
        default:
            break
    }
    return null
}

const AgGridSetFilterToShowCondition = (key, values, MasterData) => {
    if (values.length === 0) {
        return ["false"]
    }

    let def = MasterData?.find((v) => v.field === key)
    let defValues = def?.getValues ? def.getValues() : null

    return [
        "(" +
        values
            .map((v) => {
                let df = defValues?.filter((d) => v === d.name) ?? []
                if (df?.length > 0) {
                    v = df[0].value
                }
                if (v === "(空白)") {
                    v = "null"
                } else if (typeof v === "string") {
                    v = `'${v}'`
                } else if (typeof v === "boolean") {
                    if (v === true) {
                        v = "true"
                    } else {
                        v = "false"
                    }
                }
                return `(\${${key}} === ${v})`
            })
            .join(" || ") +
        ")",
    ]
}

export const StyleDefineFromAgGridColumnDef = (master) => {
    return Object.fromEntries(master.map(v => {
        if (v.field) {
            return [v.field, `\${feature['${v.field}']}`]
        }
        return null
    }).filter(v => !!v))
}

export default useCesium
