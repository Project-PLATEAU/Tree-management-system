import PropTypes from "prop-types"
import { useCallback, useContext, useEffect, useRef } from "react"
import { RootDataContext } from "../../index"
import * as Cesium from "cesium"
import { AgGridFilterToCesiumShowConditions } from "../../../../manager/cesium"

const tilesetVariableDefine = {
  administrator: "${feature['administrator']}",
  area_id: "${feature['area_id']}",
  area_name: "${feature['area_name']}",
  carbon_dioxide_absorption: "${feature['carbon_dioxide_absorption']}",
  carbon_storage: "${feature['carbon_storage']}",
  citycode: "${feature['citycode']}",
  cityname: "${feature['cityname']}",
  crown_height: "${feature['crown_height']}",
  diameter: "${feature['diameter']}",
  environmental_index_measurement_date:
    "${feature['environmental_index_measurement_date']}",
  ground_level: "${feature['ground_level']}",
  hasmushrooms: "${feature['hasmushrooms']}",
  height: "${feature['height']}",
  is_dead: "${feature['is_dead']}",
  is_remove: "${feature['is_remove']}",
  latitude: "${feature['latitude']}",
  longitude: "${feature['longitude']}",
  measurement_date: "${feature['measurement_date']}",
  note: "${feature['note']}",
  parkname: "${feature['parkname']}",
  part: "${feature['part']}",
  perimeter: "${feature['perimeter']}",
  rainwater_canopy_interception: "${feature['rainwater_canopy_interception']}",
  tree_id: "${feature['tree_id']}",
  tree_name: "${feature['tree_name']}",
  tree_type: "${feature['tree_type']}",
  treevigor: "${feature['treevigor']}",
  trunk_height: "${feature['trunk_height']}",
  width: "${feature['width']}",
}

export const TreeColorDefaultCondition = [
  ["${part} === 'crown'", "color('green')"],
  ["${part} === 'trunk'", "color('brown')"],
]

const CesiumTreeLayer = (props) => {
  const { state } = useContext(RootDataContext)

  const tileset = useRef()

  useEffect(() => {
    if (!props.viewer || tileset.current || !props.enable) {
      return
    }
    console.log("[Cesium]", "tree layer", props.viewer)

    Cesium.IonResource.fromAssetId(2399883, {}).then((res) => {
      console.log(res)
      Cesium.Cesium3DTileset.fromUrl(res).then((_tileset) => {
        tileset.current = _tileset

        let colorConditions = [
          ...TreeColorDefaultCondition,
          ["true", "color('white')"],
        ]
        console.log("[Tree]", "color conditions", "default", colorConditions)

        try {
          props.viewer?.scene?.primitives.add(_tileset)
          _tileset.style = new Cesium.Cesium3DTileStyle({
            defines: tilesetVariableDefine,
            color: {
              conditions: [...TreeColorDefaultCondition, ["true", "color('white')"]],
            },
          })
        } catch (e) {
          console.log(e)
        }
      })

      updateStyle()
    })

    return () => {
      try {
        tileset.current &&
          props.viewer?.scene?.primitives.remove(tileset.current)
      } catch (e) {
        console.log(e)
      }
      tileset.current = null
    }
  }, [props.viewer])

  useEffect(() => {
    console.log(state.selectedData, tileset.current)
    if (!tileset.current) {
      return
    }

    console.log("[Ceisum]", "set tree color", state.selectedData)
    if (!state.selectedData) {

      console.log("[Tree]", "reset color conditions", [...TreeColorDefaultCondition, ["true", "color('white')"]])

      tileset.current.style = new Cesium.Cesium3DTileStyle({
        defines: tilesetVariableDefine,
        color: {
          conditions: [...TreeColorDefaultCondition, ["true", "color('white')"]],
        },
      })
    } else {
      let conditions = [...TreeColorDefaultCondition]
      console.log(state.selectedData)

      let val = state.selectedData.value
      let col = state.selectedData.colId
      if (typeof val === "string") {
        val = `'${val}'`
      }
      conditions.unshift(["${" + col + "} === " + val, "color('yellow')"])
      conditions.push(["true", "color('white')"])

      console.log("[Tree]", "update color condition with selected", conditions)

      tileset.current.style = new Cesium.Cesium3DTileStyle({
        defines: tilesetVariableDefine,
        color: {
          conditions,
        },
      })
    }
  }, [tileset.current, props.viewer, state.selectedData])

  useEffect(() => {
    if (!props.viewer || !tileset.current) {
      return
    }

    updateStyle()
  }, [props.viewer, state.filterData])

  const updateStyle = useCallback(() => {
    if (!tileset.current) {
      return
    }

    console.log(
      "[TreeLayer]",
      "load update style",
      state.selectedData,
      state.filterData
    )

    let colorConditions = TreeColorDefaultCondition
    let showConditions = []

    if (state.selectedData) {
      let val = state.selectedData.value
      let col = state.selectedData.colId
      if (typeof val === "string") {
        val = `'${val}'`
      }
      colorConditions.unshift(["${" + col + "} === " + val, "color('yellow')"])
    }
    if (state.filterData) {
      showConditions = AgGridFilterToCesiumShowConditions(state.filterData)
    }

    console.log(
      "[TreeLayer]",
      "update conditions",
      [...colorConditions, ["true", "color('white')"]],
      showConditions
    )

    tileset.current.style = new Cesium.Cesium3DTileStyle({
      defines: tilesetVariableDefine,
      color: {
        conditions: [...colorConditions, ["true", "color('white')"]],
      },
      show: showConditions.length === 0 ? "true" : showConditions.join(" && "),
    })
  }, [state.selectedData, state.filterData])

  return null
}

CesiumTreeLayer.propTypes = {
  viewer: PropTypes.any,
  enable: PropTypes.bool,
  onClick: PropTypes.func,
}

export default CesiumTreeLayer
