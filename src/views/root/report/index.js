import {Box, Button, Tab, Tabs} from "@mui/material";
import React, {useCallback, useContext, useEffect, useState} from "react";
import APIManager from "../../../manager/api"
import {RootDataContext} from "../index";
import ReportDetail from "./detail"
import ExcelJS from "exceljs";
import dayjs from "dayjs";

const styles = {
    root: {
        width: "100%",
        height: "100%",
    }
}

const RootReportView = (props) => {

    const { state } = useContext(RootDataContext)
    const [value, setValue] = useState(0)
    const [users, setUsers] = useState([])
    const [loadedData, setLoadedData] = useState()
    const allyProps = (index) => {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        }
    }

    const onTabChange = (_, newValue) => {
        setValue(newValue)
    }
    useEffect(() => {
        APIManager.get("report/users", {
            date: state.date
        }).then(res => {
            setUsers(res)
        }).catch(e => {
            console.log(e.message)
        })
    }, [])

    const onLoadUserReport = (userId, data) => {
        setLoadedData(prev => {
            if (!prev) { return {[userId]: data}}
            prev[userId] = data
            return prev
        })
    }

    const generateExcelIncident = (sheet, rowCount, data, name) => {
        sheet.getCell(rowCount++, 1).value = name
        sheet.getCell(rowCount, 1).value = "遊具・施設名"
        sheet.getCell(rowCount, 2).value = "異常有無"
        sheet.getCell(rowCount, 3).value = "状態"
        sheet.getCell(rowCount, 4).value = "処置"
        sheet.getCell(rowCount, 5).value = "事務所確認"
        sheet.getCell(rowCount, 6).value = "IN時間"
        sheet.getCell(rowCount, 7).value = "OUT時間"
        rowCount++
        for(let v of data) {
            sheet.getCell(rowCount, 1).value = v.name
            sheet.getCell(rowCount, 2).value = v.is_incident
            sheet.getCell(rowCount, 3).value = v.report_text
            sheet.getCell(rowCount, 4).value = v.repair_text
            sheet.getCell(rowCount, 5).value = v.is_reviewed ? "✓" : ""
            sheet.getCell(rowCount, 6).value = v.in_time
            sheet.getCell(rowCount, 7).value = v.out_time
            rowCount++
        }
        rowCount++
        return rowCount
    }

    const generateExcelWaterQuality = (sheet, rowCount, chlorine, temp,  name) => {
        sheet.getCell(rowCount++, 1).value = name
        sheet.getCell(rowCount, 1).value = "施設名"
        sheet.getCell(rowCount, 2).value = "数値"
        sheet.getCell(rowCount, 3).value = "事務所確認"
        sheet.getCell(rowCount, 4).value = "計測時間"
        rowCount++
        for(let v of chlorine) {
            sheet.getCell(rowCount, 1).value = `残留塩素 ${v.name}`
            sheet.getCell(rowCount, 2).value = v.value
            sheet.getCell(rowCount, 3).value = v.is_reviewed ? "✓" : ""
            sheet.getCell(rowCount, 4).value = v.in_time
            rowCount++
        }
        rowCount++
        return rowCount
    }

    const generateExcelWaterMeter = (sheet, rowCount, data, name) => {
        sheet.getCell(rowCount++, 1).value = name
        sheet.getCell(rowCount, 1).value = "施設名"
        sheet.getCell(rowCount, 2).value = "数値"
        sheet.getCell(rowCount, 3).value = "事務所確認"
        sheet.getCell(rowCount, 4).value = "計測時間"
        rowCount++
        for(let v of data) {
            sheet.getCell(rowCount, 1).value = v.name
            sheet.getCell(rowCount, 2).value = v.value
            sheet.getCell(rowCount, 3).value = v.is_reviewed ? "✓" : ""
            sheet.getCell(rowCount, 4).value = v.in_time
            rowCount++
        }
        rowCount++
        return rowCount
    }

    const generateExcelSheet = (workbook, data) => {

        console.log('[GenerateExcelSheet]', data)

        let rowCount = 1
        let unionRowCount = 1

        const sheet = workbook.addWorksheet(data.user_status.user_name)
//        sheet.properties.defaultRowHeight = 30
        sheet.getCell("A1:ZZ10000").font = { size: 14 }
        sheet.getColumn(1).width = 60

        let {weather, health, start, end} = data.user_status
//        sheet.getCell(rowCount++,1).value = `${dayjs(state.date,"YYYYMMDD").format("YYYY年MM月DD日")} 天候:${weather} 体調:${health ? "良好": "不調"} 開始:${dayjs(start)?.format("HH:mm")} 終了:${dayjs(end)?.format("HH:mm")}`
        sheet.getCell(rowCount, 1).value = "日付"
        sheet.getCell(rowCount++, 2).value = dayjs(state.date,"YYYYMMDD").format("YYYY年MM月DD日")
        sheet.getCell(rowCount, 1).value = "天気"
        sheet.getCell(rowCount++, 2).value = weather
        sheet.getCell(rowCount, 1).value = "体調"
        sheet.getCell(rowCount++, 2).value = health ? "良好" : "不調"
        rowCount++
        sheet.getCell(rowCount, 1).value = "開始時刻"
        sheet.getCell(rowCount++, 2).value = dayjs(start)?.format("HH:mm")
        sheet.getCell(rowCount, 1).value = "終了時刻"
        sheet.getCell(rowCount++, 2).value = dayjs(end)?.format("HH:mm")

        rowCount++
        sheet.getCell(rowCount++, 1).value = "特記事項等"
        for(let v of data.other_work) {
            sheet.getCell(rowCount++, 1).value = v.voice_type
            sheet.getCell(rowCount++, 1).value = v.voice_text
        }
        rowCount++
        sheet.getCell(rowCount++, 1).value = "開園業務"
        sheet.getCell(rowCount, 1).value = "内容"
        sheet.getCell(rowCount, 2).value = "巡視員確認"
        rowCount++
        for(let v of data.open_work) {
            sheet.getCell(rowCount, 1).value = v.name
            sheet.getCell(rowCount, 2).value = v.is_check ? "✓" : ""
            rowCount++
        }
        rowCount++

        sheet.getCell(rowCount++, 1).value = "巡回業務"
        sheet.getCell(rowCount, 1).value = "内容"
        sheet.getCell(rowCount, 2).value = "巡視員確認"
        rowCount++
        for(let v of data.patrol_work) {
            sheet.getCell(rowCount, 1).value = v.name
            sheet.getCell(rowCount, 2).value = v.is_check ? "✓" : ""
            rowCount++
        }
        rowCount++

        sheet.getCell(rowCount++, 1).value = "閉園業務"
        sheet.getCell(rowCount, 1).value = "内容"
        sheet.getCell(rowCount, 2).value = "巡視員確認"
        rowCount++
        for(let v of data.patrol_work) {
            sheet.getCell(rowCount, 1).value = v.name
            sheet.getCell(rowCount, 2).value = v.is_check ? "✓" : ""
            rowCount++
        }
        rowCount++

        rowCount = generateExcelIncident(sheet, rowCount, data.playground, "屋外遊具")
        rowCount = generateExcelIncident(sheet, rowCount, data.water_playground, "水遊具")
        rowCount = generateExcelWaterQuality(sheet, rowCount, data.water_chlorine.am, data.water_temp.am, "水質（午前）")
        rowCount = generateExcelWaterQuality(sheet, rowCount, data.water_chlorine.pm, data.water_temp.pm, "水質（午後）")
        rowCount++
        rowCount = generateExcelIncident(sheet, rowCount, data.play_vill, "遊びの里")
        rowCount = generateExcelIncident(sheet, rowCount, data.point, "地点報告")
        rowCount = generateExcelIncident(sheet, rowCount, data.trail, "トレラン")
        rowCount = generateExcelIncident(sheet, rowCount, data.facility, "施設")
        rowCount = generateExcelWaterMeter(sheet, rowCount, data.water_meter.am, "水道メーター（午前）")

    }

    const onExcelExport = useCallback(async () => {

        console.log(loadedData)
        // TODO: 後でモジュール化


        const workbook = new ExcelJS.Workbook()
        const unionSheet = workbook.addWorksheet("まとめ")

        let unionSheetCol = 0
        Object.values(loadedData).forEach((data, i) => {
            if (data && i === 0) {
                generateExcelUnionSheet(unionSheet, data)
            }
            if (data) {
                addExcelUnionSheetData(unionSheet, data, unionSheetCol)
                generateExcelSheet(workbook, data)
                unionSheetCol++
            }
        })


        const uint8Array = await workbook.xlsx.writeBuffer()
        const blob = new Blob([uint8Array], {type: 'application/octet-binary'})
        const a = document.createElement('a')
        a.href = window.URL.createObjectURL(blob)
        a.download = `作業日報${state.date}.xlsx`
        a.click()
        a.remove()

    }, [loadedData])

    //                 generateExcelUnionSheet(unionSheet, data)
    const generateExcelUnionSheet = (sheet, data) => {
        let rowCount = 1
        sheet.getCell(rowCount, 1).value = "日付"
        sheet.getCell(rowCount++, 2).value = dayjs(state.date,"YYYYMMDD").format("YYYY年MM月DD日")
        rowCount++
        sheet.getCell(rowCount,2).value = "確認"
        sheet.getCell(rowCount++,1).value = "検査員"
        sheet.getCell(rowCount++,1).value = "勤務体系"
        sheet.getCell(rowCount++,1).value = "体調"
        sheet.getCell(rowCount++,1).value = "開始時刻"
        sheet.getCell(rowCount++,1).value = "終了時刻"
        rowCount++
        sheet.getCell(rowCount++,1).value = "開園業務"
        for(let v of data.open_work) {
            sheet.getCell(rowCount, 1).value = v.name
            rowCount++
        }
        rowCount++
        sheet.getCell(rowCount++,1).value = "巡回業務"
        for(let v of data.patrol_work) {
            sheet.getCell(rowCount, 1).value = v.name
            rowCount++
        }
        rowCount++
        sheet.getCell(rowCount++,1).value = "閉園業務"
        for(let v of data.close_work) {
            sheet.getCell(rowCount, 1).value = v.name
            rowCount++
        }

    }

    const addExcelUnionSheetData = (sheet, data, i) => {
        let {weather, health, start, end} = data.user_status
        let colCount = 3 + i
        let rowCount = 3
        sheet.getCell(rowCount++,colCount).value = data.user_status.user_name
        sheet.getCell(rowCount++,colCount).value = data.user_status.shift_text
        sheet.getCell(rowCount++,colCount).value = data.user_status.weather ? "良好": "不調"
        sheet.getCell(rowCount++,colCount).value = dayjs(start)?.format("HH:mm")
        sheet.getCell(rowCount++,colCount).value = dayjs(end)?.format("HH:mm")
        rowCount++
        sheet.getCell(rowCount++,1).value = "開園業務"
        for(let v of data.open_work) {
            if (v.is_check) {
                sheet.getCell(rowCount, 2).value = "✓"
                sheet.getCell(rowCount, colCount).value = "✓"
            }
            rowCount++
        }
        rowCount++
        sheet.getCell(rowCount++,1).value = "巡回業務"
        for(let v of data.patrol_work) {
            if (v.is_check) {
                sheet.getCell(rowCount, 2).value = "✓"
                sheet.getCell(rowCount, colCount).value = "✓"
            }
            rowCount++
        }
        rowCount++
        sheet.getCell(rowCount++,1).value = "閉園業務"
        for(let v of data.close_work) {
            if (v.is_check) {
                sheet.getCell(rowCount, 2).value = "✓"
                sheet.getCell(rowCount, colCount).value = "✓"
            }
            rowCount++
        }
    }

    return (
        <Box style={{...styles.root, flexGrow: 1, bgColor: "background.paper", display: "flex", overflow: "hidden"}}>
            <Box style={{display: "flex", flexDirection: "column"}}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={onTabChange}
                    aria-label="Vertical tabls"
                    style={{borderRight: 1, borderColor: "divider"}}
                >
                    {users.map((user, i) => {
                        return <Tab key={user.user_id} label={user.user_name} {...allyProps(i)}  />
                    })}
                </Tabs>
                <Box style={{flexGrow: 1}}></Box>
                <Box style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "1rem"}}>
                    <Button style={{marginBottom: "1rem"}} variant="contained" onClick={onExcelExport}>エクスポート</Button>
                </Box>
            </Box>
            {users.map((user, i) => {
                return <Box style={{flexGrow: 1, overflow: "auto"}} hidden={value !== i} id={`vertical-tabpanel-${i}`} aria-labelledby={`vertical-tab-${i}`}>
                    <ReportDetail userId={parseInt(user.user_id)} onLoad={onLoadUserReport} />
                </Box>
            })}
        </Box>
    )
}


export default RootReportView
