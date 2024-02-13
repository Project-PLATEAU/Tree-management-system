import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {Button, Typography} from "@mui/material";
import {contentStyles} from "../styles";
import IconButton from "@mui/material/IconButton";
import {RecordVoiceOver as RecordVoiceOverIcon} from "@mui/icons-material";
import dayjs from "dayjs";

const styles = {...contentStyles}

const DetailIncidentContent = (props) => {


    const playRepairVoice = () => {
        if (!props.data.repair_voice.voice_url) {
            return
        }
        new Audio(process.env.REACT_APP_MEDIA_ENDPOINT + props.data.repair_voice.voice_url).play()
            .catch(e => {
                console.log(e)
            })
    }

    const playReportVoice = () => {
        if (!props.data.report_voice.voice_url) {
            return
        }
        new Audio(process.env.REACT_APP_MEDIA_ENDPOINT + props.data.report_voice.voice_url).play()
            .catch(e => {
                console.log(e)
            })
    }

    const reportTime = useMemo(() => {
        if (!props.data.measured_at) { return ""}
        let val = dayjs(props.data.measured_at).format("HH:mm")
        return val === "00:00" ? "報告書で入力" : val
    }, [props.data])

    return (
        <table cellSpacing={0} cellPadding={0} style={{borderCollapse: "collapse", width: "100%"}}>
            <tbody>
            <tr style={styles.tr}>
                <th style={styles.th}>ID</th>
                <td style={styles.td}>{props.data.incident_id}</td>
            </tr>
            <tr style={styles.tr}>
                <th style={styles.th}>報告時刻</th>
                <td style={styles.td}>{reportTime}</td>
            </tr>
            <tr style={styles.tr}>
                <th style={styles.th}>確認</th>
                <td style={styles.td}>
                    {props.data.status === "reported" && <Button>確認</Button>}
                    {props.data.status === "reviewed" && <Typography>確認済み</Typography>}
                </td>
            </tr>
            <tr style={styles.tr}>
                <th style={styles.th}>施設コード</th>
                <td style={styles.td}>{props.data.facility_id}</td>
            </tr>
            <tr style={styles.tr}>
                <th style={styles.th}>施設名</th>
                <td style={styles.td}>{props.data.facility_name}</td>
            </tr>
            <tr style={styles.tr}>
                <th style={styles.th}>種類</th>
                <td style={styles.td}>{props.data.facility_type}</td>
            </tr>
            <tr style={styles.tr}>
                <th style={styles.th}>状態</th>
                <td style={styles.td}>
                    <Typography>{props.data.report_text}</Typography>
                    <IconButton onClick={playReportVoice} size="small" disabled={!props.data?.report_voice}><RecordVoiceOverIcon /></IconButton>
                </td>
            </tr>
            <tr style={styles.tr}>
                <th style={styles.th}>処置</th>
                <td style={styles.td}>
                    <Typography>{props.data.repair_text}</Typography>
                    <IconButton onClick={playRepairVoice} size="small" disabled={!props.data?.repair_voice}><RecordVoiceOverIcon /></IconButton>
                </td>
            </tr>
            {props.data.photos?.length && (
                    <tr style={styles.tr}>
                        <th colSpan={2} style={styles.th}>画像</th>
                    </tr>
            )}
            {props.data.photos?.map((p, i) => {
                return (
                    <tr>
                        <td colSpan={2} style={{...styles.td, textAlign: "center"}}>
                            <img
                                alt={`画像${i}`}
                                style={{cursor: 'pointer'}}
                                onClick={() => window.open(process.env.REACT_APP_MEDIA_ENDPOINT + p.photo_url, "_blank")}
                                src={process.env.REACT_APP_MEDIA_ENDPOINT + (p.photo_url.replace(/\.png/, '_thumb.png'))}
                            />
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

DetailIncidentContent.propTypes = {
    data: PropTypes.object,
}

export default DetailIncidentContent
