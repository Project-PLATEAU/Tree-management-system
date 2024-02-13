import React, {useMemo} from "react"
import PropTypes from "prop-types";
import {Box} from "@mui/material";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import {RecordVoiceOver as RecordVoiceOverIcon} from "@mui/icons-material";

const styles= {
    table: {
        borderCollapse: "collapse",
    },
    th: {
        border: "1px solid #000",
        padding: "4px",
        backgroundColor: "#bff1b8",
    },
    td_group_title: {
        border: "1px solid #000",
        padding: "4px",
        verticalAlign: "top",
        backgroundColor: "#eee",
    },
    td_title: {
        border: "1px solid #000",
        padding: "4px",
        backgroundColor: "#eee",
    },
    td_value: {
        border: "1px solid #000",
        padding: "4px",
        minWidth: "80px",
    },
}
const IncidentDetailContent = (props) => {

    const data = useMemo(() => props.data, [props.data])

    const playRepairVoice = () => {
        if (!data.repair_voice.voice_url) {
            return
        }
        new Audio(process.env.REACT_APP_MEDIA_ENDPOINT + data.repair_voice.voice_url).play()
            .catch(e => {
                console.log(e.message)
            })
    }

    const playReportVoice = () => {
        if (!data.report_voice.voice_url) {
            return
        }
        new Audio(process.env.REACT_APP_MEDIA_ENDPOINT + data.report_voice.voice_url).play()
            .catch(e => {
                console.log(e.message)
            })
    }

    return (
        <Box>
            <Box>
                <table style={styles.table}>
                    <tbody>
                    <tr><th style={{...styles.th, whiteSpace: "nowrap"}}>施設コード</th><td style={styles.td_value}>{data?.facility_code}</td></tr>
                    <tr><th style={{...styles.th, whiteSpace: "nowrap"}}>施設名</th><td style={styles.td_value}>{data?.facility_name}</td></tr>
                    <tr><th style={{...styles.th, whiteSpace: "nowrap"}}>報告時間</th><td style={styles.td_value}>{dayjs(data?.measured_at).format("HH時mm分")}</td></tr>
                    <tr><th style={{...styles.th, whiteSpace: "nowrap"}}>異常の状態</th><td style={styles.td_value}>{data?.report_text} {data?.repair_voice?.voice_url && <IconButton onClick={playReportVoice} size="small" disabled={!data?.report_voice}><RecordVoiceOverIcon /></IconButton>}</td></tr>
                    <tr><th style={{...styles.th, whiteSpace: "nowrap"}}>異常の処置</th><td style={styles.td_value}>{data?.repair_text} {data?.report_voice?.voice_url && <IconButton onClick={playRepairVoice} size="small" disabled={!data?.repair_voice}><RecordVoiceOverIcon /></IconButton>}</td></tr>
                    <tr>
                        <th style={{...styles.th, whiteSpace: "nowrap"}}>画像</th>
                        <td style={{...styles.td_value, display: "flex",}}>
                            {data?.photos?.map((p) => {
                                return (
                                    <div style={{flexGrow: 1, maxHeight: "240px"}}>
                                        <img style={{cursor: "pointer"}} onClick={() => window.open(process.env.REACT_APP_MEDIA_ENDPOINT + p.photo_url, "_blank")} src={process.env.REACT_APP_MEDIA_ENDPOINT + (p.photo_url.replace(/\.png/, '_thumb.png'))} />
                                    </div>
                                )
                            })}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </Box>
        </Box>
    )
}

IncidentDetailContent.propTypes = {
    data: PropTypes.any,
}

export default IncidentDetailContent
