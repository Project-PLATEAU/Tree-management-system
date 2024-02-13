import {Box, Button, ButtonGroup, Typography} from "@mui/material";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import * as Cesium from "cesium";
import useCesium from "../../../manager/cesium";
import basemapDef from "./basemap"
import "cesium/Build/Cesium/Widgets/widgets.css"
import {RootDataContext} from "../index";
import MapClearLayer from "./layers/clear";
import MapFacilityLayer from "./layers/facility";
import MapGateLayer from "./layers/gate";
import MapBuildingLayer from "./layers/building";
import MapBridgeLayer from "./layers/bridge";
import MapTreeLayer from "./layers/tree";
import MapWaterLayer from "./layers/water";
import MapBoundaryLayer from "./layers/boundary";
import MapTreeBillboardLayer from "./layers/tree_billboard";
import MapFacilityBillboardLayer from "./layers/facility_billboard";
import APIManager from "../../../manager/api"
import {CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon} from "@mui/icons-material";
import {ViewMode} from "../data/state";
import MasterColumnDef from "../list/model/master/column"
import TreeColumnDef from "../list/model/tree/column"

const styles = {
    map: {
        width: "100%",
        flexGrow: 1,
        overflow: "hidden",
        position: "relative",
        height: "100%",
    },
    busyBox: {
        backgroundColor: "white",
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "calc(100% - 100px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "24px",
        fontWeight: "bold",
    },
    detailBox: {
        position: 'absolute',
        bottom: '2rem',
        right: '1rem',
        zIndex: '100',
        backgroundColor: '#ffffff5e',
        padding: '8px',
        borderRadius: '8px',
    }
}

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZWQ1ODBmOC1mZTUxLTQ1YjYtOWJmYi1lYWQwNmYyYjkzMTAiLCJpZCI6Nzc3MjAsImlhdCI6MTY0MDUxODAyMH0.zWLiXFgaGXueoHP0tzeDXwp3ys7dqSDqu2l3SlB80PY'
window.CESIUM_BASE_URL = "./cesium/"


const MapMode = {
    MapMode2D: "2d",
    MapMode3D: "3d",
}

const RootMapView = (props) => {
    const { state, clearMapParams, setMasterSelectedData, setTreeSelectedData, setShowMapPoi} = useContext(RootDataContext)
    const mapRef = useRef()
    const markerRef = useRef()
    const myLocationPointRef = useRef()
    const myLocationCircleRef = useRef()
    const circleEntityRef = useRef()
    const [detailContent, setDetailContent] = useState()
    const [mapMode, setMapMode] = useState(MapMode.MapMode3D)
    const masterColumnDef = useMemo(() => MasterColumnDef(), [])
    const treeColumnDef = useMemo(() => TreeColumnDef(), [])

    const { viewer, layerInitialized} = useCesium({mapRef, basemapDef, layersDef: []})

    useEffect(() => {
        let val
        let contents = []
        if (state.viewMode === ViewMode.Tree && state.treeSelectedData?.colId === "facility_code") {
            val = state.treeSelectedData
            contents = treeColumnDef.map(def => {
                if (!def.map_detail) { return null}
                return (<tr><th>{def.headerName}</th><td>{state.treeSelectedData[def.field] ?? "--"}</td></tr>)
            }).filter(v => !!v)
        } else if(state.viewMode === ViewMode.Master && state.masterSelectedData?.colId === "facility_code") {
            val = state.masterSelectedData
            if (!state.masterSelectedData) { return }
            contents = masterColumnDef.map(def => {
                if (!def.map_detail) { return null }
                return (<tr><th>{def.headerName}</th><td>{state.masterSelectedData[def.field] ?? "--"}</td></tr>)
            }).filter(v => !!v)
        } else {
            setDetailContent(null)
            return
        }

        if (viewer && val.latitude && val.longitude) {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(val.longitude, val.latitude, 300)
            })
        }
        setDetailContent(<table><tbody>{contents}</tbody></table>)


    }, [viewer, state.masterSelectedData, state.treeSelectedData])

    useEffect(() => {
        if (!viewer) { return }

        myLocationPointRef.current = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0,0), // 初期位置
            point: {
                pixelSize: 10,  // ピクセル単位での点のサイズ
                color: Cesium.Color.BLUE.withAlpha(0.8),  // 点の色
                outlineColor: Cesium.Color.WHITE,  // 点の外枠の色
                outlineWidth: 2,  // 外枠の幅
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            }
        });

        myLocationCircleRef.current = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0,0), // 初期位置
            ellipse: {
                semiMinorAxis: 1,
                semiMajorAxis: 1,
                material: Cesium.Color.CYAN.withAlpha(0.3),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            }
        });

        // 中心座標の設定
        const center = Cesium.Cartesian3.fromDegrees(
            state.mapCenter?.longitude ?? 138.746397,
            state.mapCenter?.latitude ?? 37.428517, 300.0);

        // カメラの設定
        const cameraHeading = Cesium.Math.toRadians(0);
        const cameraPitch = Cesium.Math.toRadians(-60);

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
        handler.setInputAction(leftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        // カメラの初期位置の指定
        viewer.camera.setView({
            destination: center,
            orientation: {
                heading: cameraHeading,
                pitch: cameraPitch,
                roll: 0.0
            }
        })

        return () => {
            clearMapParams()
        }

    }, [viewer])

    useEffect(() => {
        console.log('Update detail data', state.detail)
    }, [viewer, state.detail]);

    const leftClickHandler = useCallback((e) => {
        if (!viewer) { return }

        const features = viewer.scene.drillPick(e.position)
        let feature = null


        for(let f of features) {
            let p = {}
            for(let propertyName of f.getPropertyIds()) {
                p[propertyName] = f.getProperty(propertyName)
            }
            console.log('[GetLeftClick]', p)

            if (p.facility_code) {
                feature = p
                break
            }
        }
        if (!feature) {
            setMasterSelectedData(null)
            setTreeSelectedData(null)
            return
        }

        let facilityCode = feature.facility_code
        if (state.viewMode === ViewMode.Tree && facilityCode.startsWith("GRN")) {
            APIManager.getOne(`tree/info/${facilityCode}`)
                .then(res => {
                    setTreeSelectedData({
                        ...res,
                        colId: 'facility_code',
                        colName: '樹木ID',
                        colValue: facilityCode,
                    })
                })
                .catch(e => {
                    console.log(e.message)
                })
        } else if (state.viewMode === ViewMode.Master) {
            APIManager.getOne(`facility/info/${facilityCode}`)
                .then(res => {
                    setMasterSelectedData({
                        ...res,
                        colId: 'facility_code',
                        colName: '施設コード',
                        colValue: facilityCode,
                    })
                })
                .catch(e => {
                    console.log(e.message)
                })
        }
    }, [viewer, state.viewMode])

    useEffect(() => {
        if (!viewer || !layerInitialized){ return }

        let inv = setInterval(() => {
            navigator.geolocation.getCurrentPosition((position) => {
                const longitude = position.coords.longitude;
                const latitude = position.coords.latitude;
                const accuracy = position.coords.accuracy;

                // 座標を更新
                myLocationPointRef.current.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
                myLocationCircleRef.current.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);

                // 精度円のサイズを更新
                myLocationCircleRef.current.ellipse.semiMinorAxis = accuracy;
                myLocationCircleRef.current.ellipse.semiMajorAxis = accuracy;

            }, (e) => {
                console.error('Geolocation error:', e.message);
            });
        }, 1000)

        return () => {
            clearInterval(inv)
        }

    }, [viewer, layerInitialized])

    useEffect(() => {
        if (!viewer) { return }

        switch(mapMode) {
            case MapMode.MapMode2D:
                viewer.scene.mode = Cesium.SceneMode.SCENE2D
                break
            case MapMode.MapMode3D:
                viewer.scene.mode = Cesium.SceneMode.SCENE3D
                break
            default:
                break
        }
    }, [viewer, mapMode]);

    useEffect(() => {
        //if (!marker) { return }
        if (!viewer || !layerInitialized) { return }
        if (!state.mapMarker) {
            if (markerRef.current) {
                markerRef.current.position = Cesium.Cartesian3.fromDegrees(0, 0, 0)
            }
            return
        }

        const center = Cesium.Cartesian3.fromDegrees(
            state.mapMarker.longitude,
            state.mapMarker.latitude, 300.0);

        // カメラの設定
        const cameraHeading = Cesium.Math.toRadians(0);
        const cameraPitch = Cesium.Math.toRadians(-60);
        viewer.camera.setView({
            destination: center,
            orientation: {
                heading: cameraHeading,
                pitch: cameraPitch,
                roll: 0.0
            }
        })
    }, [viewer, state.mapMarker, layerInitialized]);

    return (
        <Box ref={mapRef} style={styles.map}>
            {detailContent && <Box style={styles.detailBox}>{detailContent}</Box>}
            <MapClearLayer viewer={viewer} />
            <MapTreeBillboardLayer viewer={viewer} />
            <MapFacilityBillboardLayer viewer={viewer} />
            <MapBoundaryLayer viewer={viewer} />
            <MapFacilityLayer viewer={viewer} />
            <MapGateLayer viewer={viewer} />
            <MapBuildingLayer viewer={viewer} />
            <MapBridgeLayer viewer={viewer} />
            <MapTreeLayer viewer={viewer} />
            <MapWaterLayer viewer={viewer} />
            <Box style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 1000,
                backgroundColor: "white",
            }}>
                <ButtonGroup>
                    <Button onClick={() => setMapMode(MapMode.MapMode2D)} variant={mapMode === MapMode.MapMode2D ? "contained": "outlined"}>2D</Button>
                    <Button onClick={() => setMapMode(MapMode.MapMode3D)} variant={mapMode === MapMode.MapMode3D ? "contained": "outlined"}>3D</Button>
                </ButtonGroup>
            </Box>

            {(state.viewMode === ViewMode.Tree || state.viewMode === ViewMode.Master) && <Box style={{
                position: "absolute",
                top: "5rem",
                right: "1rem",
                zIndex: 1000,
                backgroundColor: "white",
            }}>
                <Button variant="outlined" onClick={() => setShowMapPoi(!state.showMapPoi)}>
                    <Typography>POI表示</Typography>
                    {state.showMapPoi && <CheckBoxIcon />}
                    {!state.showMapPoi && <CheckBoxOutlineBlankIcon />}
                </Button>
            </Box>}
        </Box>
    )

}

export default RootMapView
