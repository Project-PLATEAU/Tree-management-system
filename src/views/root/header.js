import React, {useContext, useEffect, useMemo, useState} from "react"
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from  '@mui/icons-material/Menu'
import {ViewMode, WindowMode} from "./data/state";
import {RootDataContext} from "./index";
import {Button} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import ja from "dayjs/locale/ja"
import dayjs from "dayjs";
import APIManager from "../../manager/api"
import {ToggleButton, ToggleButtonGroup} from "@mui/lab";
import BtnIncidentOff from "../../resources/images/btn_incident_off.png"
import BtnIncidentOn from "../../resources/images/btn_incident_on.png"
import BtnChojukaOff from "../../resources/images/btn_chojuka_off.png"
import BtnChojukaOn from "../../resources/images/btn_chojuka_on.png"
import BtnEnsonodoOff from "../../resources/images/btn_ensonodo_off.png"
import BtnEnsonodoOn from "../../resources/images/btn_ensonodo_on.png"
import BtnHokokushoOff from "../../resources/images/btn_hokokusho_off.png"
import BtnHokokushoOn from "../../resources/images/btn_hokokusho_on.png"
import BtnKodorirekiOff from "../../resources/images/btn_kodorireki_off.png"
import BtnKodorirekiOn from "../../resources/images/btn_kodorireki_on.png"
import BtnListOff from "../../resources/images/btn_list_off.png"
import BtnListOn from "../../resources/images/btn_list_on.png"
import BtnMapOff from "../../resources/images/btn_map_off.png"
import BtnMapOn from "../../resources/images/btn_map_on.png"
import BtnSuidouOff from "../../resources/images/btn_suidou_off.png"
import BtnSuidouOn from "../../resources/images/btn_suidou_on.png"
import BtnSuionOff from "../../resources/images/btn_suion_off.png"
import BtnSuionOn from "../../resources/images/btn_suion_on.png"
import BtnShokubutuOff from "../../resources/images/btn_shokubutu_off.png"
import BtnShokubutuOn from "../../resources/images/btn_shokubutu_on.png"

const styles = {
    toggle: {
        color: "#526981 !important",
        borderColor: "#76a1cb !important",
    },
    toggleButton: {
        borderColor: "white",
        color: "#99bde2 !important",
        paddingLeft: "16px !important",
        paddingRight: "16px !important",
    },
    toggleSelect: {
        backgroundColor: "#c8e0f7 !important",
        color: "#1e3176 !important",
        paddingLeft: "16px !important",
        paddingRight: "16px !important",
    }
}

const RootHeaderView = (props) => {

    const { state, setViewMode, setDate, setWindowMode, setDetail } = useContext(RootDataContext)
    const [activeDays, setActiveDays] = useState([])
    const [mode, setMode] = useState([WindowMode.List])
    const [highlightDays, setHighlightDays] = useState([])

    const contents = [
        {title: "インシデント", viewMode: ViewMode.Incident, icon: [BtnIncidentOn, BtnIncidentOff]},
        {title: "水道メーター", viewMode: ViewMode.WaterMeter, icon: [BtnSuidouOn, BtnSuidouOff]},
        {title: "水温", viewMode: ViewMode.WaterTemp, icon: [BtnSuionOn, BtnSuionOff]},
        {title: "塩素濃度", viewMode: ViewMode.WaterQuality, icon: [BtnEnsonodoOn, BtnEnsonodoOff]},
        {title: "行動履歴", viewMode: ViewMode.TrackFacility, icon: [BtnKodorirekiOn, BtnKodorirekiOff]},
        {title: "管理台帳", viewMode: ViewMode.Master, icon: [BtnChojukaOn, BtnChojukaOff]},
        {title: "植物台帳", viewMode: ViewMode.Tree, icon: [BtnShokubutuOn, BtnShokubutuOff]}
    ]
    const title = useMemo(() => {
        let ret = contents.filter(v => v.viewMode === state.viewMode)
        if (ret.length === 1) {
            return ret[0].title
        }
        return null
    }, [state.viewMode])

    const value = useMemo(() => {
        if (!state.date) { return null}
        return dayjs(state.date, "YYYYMMDD")
    }, [state.date])

    useEffect(() => {
        APIManager.get("report/reported_dates")
            .then(res => {
                setActiveDays(res.map(d => dayjs(d).format("YYYYMMDD")))
            })
            .catch(e => {
                console.log('参照日付は確認できません', e.message)
            })
    }, [])

    useEffect(() => {
        switch(state.windowMode) {
            case WindowMode.List:
                setMode([WindowMode.List])
                break
            case WindowMode.Map:
                setMode([WindowMode.Map])
                break
            case WindowMode.Both:
                setMode([WindowMode.List, WindowMode.Map])
                break
            case WindowMode.Report:
                setMode([WindowMode.Report])
                break
            default:
                break
        }
    }, [state.windowMode]);

    const onChangeDate = (e) => {
        setDate(e.format("YYYYMMDD"))
    }

    const onChangeToggle = (e, newWindowMode) => {
        setDetail(null)
        if (state.windowMode === newWindowMode) {
            return
        }
        if (state.windowMode === WindowMode.Report) {
            setWindowMode(newWindowMode)
            return
        }
        if (state.windowMode === WindowMode.Both) {
            setWindowMode(newWindowMode === WindowMode.List ? WindowMode.Map : WindowMode.List)
            return
        }
        setWindowMode(WindowMode.Both)
    }

    const onClick = (viewMode) => {
        setDetail(null)
        setViewMode(viewMode)
    }

    return (
        <Box>
            <AppBar position="static" color="default">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ width: "200px" }}>
                        {title}一覧
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ja}>
                            <DatePicker
                                label="日付"
                                onChange={onChangeDate}
                                value={value}
                                format="YYYY/MM/DD"
                            />
                        <Box sx={{width: "20px"}} />
                    </LocalizationProvider>
                    {state.windowMode !== WindowMode.Map && (<Box sx={{display: "flex", gap: "8px", margin: "8px 0"}}>
                        {contents.map(cont => {
                            return (<Button
                                onClick={() => onClick(cont.viewMode)}
                                key={cont.title}
                                style={{
                                    color: "#333",
                                    backgroundColor: state.viewMode === cont.viewMode ? "#ceffc0" : "#6be742",
                                }}
                                variant="contained"
                                color="info">
                                <img style={{width: "50px"}} src={state.viewMode === cont.viewMode ? cont.icon[0] : cont.icon[1]}  alt={cont.title}/>
                            </Button>)
                        })}
                    </Box>)}
                    <Box style={{marginLeft: "2rem"}}>
                        {state.windowMode !== WindowMode.Map && (<Button
                            onClick={() => setWindowMode(WindowMode.Report)}
                            style={{
                                color: "#333",
                                backgroundColor: state.windowMode === WindowMode.Report ? "#eeeed2": "#cece70"
                            }}
                            variant="contained"
                        >
                            <img style={{width: "50px"}} src={state.viewMode === WindowMode.Report ? BtnHokokushoOn : BtnHokokushoOff} alt="報告書" />
                        </Button>)}
                    </Box>
                    <Box sx={{flexGrow: 1}} />

                    <ToggleButtonGroup
                        color="primary"
                        value={mode}
                        exclusive
                        onChange={onChangeToggle}
                        size="small"
                        style={{marginRight: "1rem"}}
                    >
                        <ToggleButton style={{width: "80px"}} value={WindowMode.List}>
                            <img style={{width: "50px"}} src={state.windowMode !== WindowMode.Map ? BtnListOn : BtnListOff} alt="リスト" />
                        </ToggleButton>
                        <ToggleButton style={{width: "80px"}} value={WindowMode.Map}>
                            <img style={{width: "50px"}} src={state.windowMode !== WindowMode.List ? BtnMapOn : BtnMapOff} alt="地図" />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Button variant="outlined" color="inherit">ログアウト</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );

}

export default RootHeaderView
