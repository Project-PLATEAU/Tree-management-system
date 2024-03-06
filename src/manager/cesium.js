import * as Cesium from "cesium"
import { useCallback, useEffect, useRef, useState } from "react"
import MasterData from "../master_data"

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

export const AgGridFilterToCesiumShowConditions = (filterData) => {
  let conditions = []
  console.log("[Cesium]", "filter data", filterData)
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
      return ["(${" + key + "} === " + pValue + ")"]
    case "notEqual":
      return ["(${" + key + "} !== " + pValue + ")"]
    case "contains":
      return ["(regExp('" + param.filter + "').test(${" + key + "}))"]
    case "notContains":
      return ["(RegExp('" + param.filter + "').test(${" + key + "}) === false)"]
    case "startsWith":
      return [
        "(regExp('^" + param.filter + "').test(${" + key + "}) === false)",
      ]
    case "endsWith":
      return [
        "(regExp('" + param.filter + "$').test(${" + key + "}) === false)",
      ]
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
      return ["(${" + key + "} === " + param.filter + ")"]
    case "notEquals":
      return ["(${" + key + "} !== " + param.filter + ")"]
    case "lessThan":
      return ["(${" + key + "} < " + param.filter + ")"]
    case "lessThanOrEqual":
      return ["(${" + key + "} <= " + param.filter + ")"]
    case "greaterThan":
      return ["(${" + key + "} > " + param.filter + ")"]
    case "greaterThanOrEqual":
      return ["(${" + key + "} >= " + param.filter + ")"]
    case "inRange":
      return [
        "((${" +
          key +
          "} >= " +
          param.filter +
          ") && (${" +
          key +
          "} <= " +
          param.filterTo +
          "))",
      ]
    default:
      break
  }
  return null
}

const AgGridSetFilterToShowCondition = (key, values) => {
  if (values.length === 0) {
    return ["false"]
  }

  let def = MasterData.filter((v) => v.field === key)[0]
  console.log("[AgGridSetFilter]", "show condition def", def, values)
  let defValues = def?.getValues ? def.getValues() : null

  return [
    "(" +
      values
        .map((v) => {
          let df = defValues?.filter((d) => v === d.name) ?? []
          console.log("[AgGridSetFilter]", "define values", df)
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
          return "(${" + key + "} === " + v + ")"
        })
        .join(" || ") +
      ")",
  ]
}

const AgGridDateFilter = (type, value) => {}

const useCesium = ({ mapRef, basemapDef, layersDef, onFeatureClick }) => {
  /**
   * @type {[Cesium.Viewer, React.Dispatch<Cesium.Viewer>]} state
   */
  const [viewer, setViewer] = useState()
  const [initializing, setInitializing] = useState(false)
  const [layersInfo, setLayersInfo] = useState(layersDef)
  const [viewMode, setViewMode] = useState(MapViewMode.v3D)
  const [layers2D, setLayers2D] = useState({})
  const [layers3D, setLayers3D] = useState({})
  const [layerInitialized, setLayerInitialized] = useState(false)
  const featureRef = useRef()
  const featureColorRef = useRef()
  const [properties, setProperties] = useState()

  const initRef = useRef(0)

  useEffect(() => {
    initRef.current++
    console.log("load cesium", initRef.current)
    if (initRef.current > 1) {
      return
    }

    let v
    let options = {}

    if (basemapDef.access_token) {
      options = { accessToken: basemapDef.access_token }
    }

    Cesium.CesiumTerrainProvider.fromIonAssetId(basemapDef.asset_id, options)
      .then((provider) => {
        v = new Cesium.Viewer(mapRef.current, {
          terrainProvider: provider,
          sceneMode: Cesium.SceneMode.SCENE3D,
          baseLayerPicker: false,
          timeline: false,
          animation: false,
          homeButton: false,
          vrButton: false,
          geocoder: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          infoBox: false,
          selectionIndicator: false,
          shadows: true,
          shouldAnimate: true,
          clampToHeightSupported: true,
        })

        const fixedTime = Cesium.JulianDate.fromIso8601("2023-06-20T01:00:00Z")

        // ビューアの時計を上記の日時に設定
        v.clock.currentTime = fixedTime
        setViewer(v)
        setLayerInitialized(true)
      })
      .catch((e) => {
        console.log("basemap layer error", e)
      })

    return () => {
      v?.destroy()
      setViewer(null)
      initLoad = false
    }
  }, [])

  const leftClickHandler = useCallback(
    (click) => {
      if (!viewer || !layerInitialized) {
        return
      }

      console.log(featureRef.current, featureColorRef.current)
      if (featureRef.current && featureColorRef.current) {
        featureRef.current.color = featureColorRef.current
      }

      const feature = viewer.scene.pick(click.position)
      if (!feature) {
        featureRef.current = null
        featureColorRef.current = null
        setProperties(null)
        onFeatureClick(null)
        return
      }

      if (feature.getProperty("tree_id")) {
        featureRef.current = feature
        featureColorRef.current = feature.color
        feature.color = Cesium.Color.YELLOW
      }

      let p = Object.fromEntries(
        feature.getPropertyIds().map((id) => [id, feature.getProperty(id)])
      )
      onFeatureClick && onFeatureClick(p)
    },
    [viewer, layerInitialized]
  )

  useEffect(() => {
    if (!viewer || !layerInitialized) {
      return
    }
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
    handler.setInputAction(
      leftClickHandler,
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    )
  }, [viewer, layerInitialized])
  //
  // useEffect(() => {
  //   console.log("[check update]", !!viewer, !!layersInfo, !!layerInitialized)
  //   if (!viewer || !layersInfo || layerInitialized) {
  //     return
  //   }
  //   let l2d = {}
  //   let l3d = {}
  //
  //   console.log(layersInfo)
  //
  //   Promise.all(
  //     layersInfo.map((layer) => {
  //       // eslint-disable-next-line no-async-promise-executor
  //       return new Promise(async (resolve, reject) => {
  //         try {
  //           if (layer["2d"]) {
  //             let { data, visible } = await loadLayer(
  //               layer["2d"],
  //               MapViewMode.v2D,
  //               { clampToGround: true, meta: layer }
  //             ).catch((e) => {
  //               console.log("2d layer load fail", layer["2d"], e)
  //               reject(e)
  //             })
  //             console.log("2d layer loaded", layer["2d"])
  //             l2d[layer.id] = { data, layer, visible }
  //           }
  //           if (layer["3d"]) {
  //             let { data, visible } = await loadLayer(
  //               layer["3d"],
  //               MapViewMode.v3D,
  //               { meta: layer }
  //             ).catch((e) => {
  //               console.log("3d layer load fail", layer["3d"], e)
  //             })
  //             console.log("3d layer loaded", layer["3d"])
  //             l3d[layer.id] = { data, layer, visible }
  //           }
  //           resolve()
  //         } catch (e) {
  //           reject(e.message)
  //         }
  //       })
  //     })
  //   ).then(() => {
  //     setLayers2D(l2d)
  //     setLayers3D(l3d)
  //     setLayerInitialized(true)
  //   })
  // }, [viewer, layersInfo])

  useEffect(() => {
    if (!viewer || !viewMode || !layerInitialized) {
      return
    }

    Object.entries(layers2D).forEach(([k, v]) => {
      layerVisible(
        v.data,
        viewMode === MapViewMode.v2D &&
          (v.visible === undefined ? true : v.visible)
      )
    })
    Object.entries(layers3D).forEach(([k, v]) => {
      layerVisible(v.data, viewMode === MapViewMode.v3D && v.visible)
    })
  }, [viewer, viewMode, layerInitialized])

  const loadLayer = (info, view, geojsonOptions = {}) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!viewer) {
        return reject("viewer not declared")
      }
      let visible =
        view === viewMode && (info.visible === undefined ? true : info.visible)
      let data
      switch (info.type) {
        case TileType.tGeoJson:
          // eslint-disable-next-line no-case-declarations
          let resource = await Cesium.IonResource.fromAssetId(
            info.asset_id
          ).catch((e) => {
            reject("asset not found: " + info.asset_id)
          })
          data = await Cesium.GeoJsonDataSource.load(resource, geojsonOptions)
          layerVisible(data, visible)
          viewer.dataSources.add(data)
          break
        case TileType.t3DTiles:
          data = await Cesium.Cesium3DTileset.fromIonAssetId(info.asset_id)

          layerVisible(data, visible)
          viewer.scene.primitives.add(data)
          break
        default:
          reject("Unknown tile type: " + info.type)
      }
      data.name = info.id
      resolve({ data, visible })
    })
  }

  const layerVisible = (data, visible) => {
    if (data instanceof Cesium.GeoJsonDataSource) {
      data.entities.values.forEach((entity) => (entity.show = visible))
    } else if (data instanceof Cesium.Cesium3DTileset) {
      data.show = visible
    }
  }

  const switchViewTo2D = () => {
    viewMode === MapViewMode.v3D && setViewMode(MapViewMode.v2D)
  }

  const switchViewTo3D = () => {
    viewMode === MapViewMode.v2D && setViewMode(MapViewMode.v3D)
  }

  const toggleView = () => {
    setViewMode(
      viewMode === MapViewMode.v2D ? MapViewMode.v3D : MapViewMode.v2D
    )
  }

  const setVisible = (layerId, visible) => {
    let l2d = { ...layers2D }
    let l3d = { ...layers3D }
    l2d[layerId].visible = visible
    l2d[layerId].visible = visible
    layerVisible(l2d[layerId].data, visible)
    layerVisible(l3d[layerId].data, visible)
    setLayers2D({ ...l2d })
    setLayers3D({ ...l3d })
  }

  const clearSelectObject = () => {
    if (featureRef.current && featureColorRef.current) {
      featureRef.current.color = featureColorRef.current
    }
    setProperties(null)
    onFeatureClick(null)
  }

  return {
    viewer,
    layerInitialized,
    switchViewTo2D,
    switchViewTo3D,
    toggleView,
    setVisible,
    clearSelectObject,
  }
}

export default useCesium
