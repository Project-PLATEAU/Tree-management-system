import PropTypes from "prop-types";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import APIManager from "../../../manager/api"
import {RootDataContext} from "../index";
import {Box, Button, Checkbox, CircularProgress, FormControlLabel, Snackbar, Typography} from "@mui/material";
import dayjs from "dayjs";
import GridView from "./grid"

const styles = {
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

const ReportDetailView = (props) => {

    const {state} = useContext(RootDataContext)

    const [userStatus, setUserStatus] = useState()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState()
    const [openSaveSuccess, setOpenSaveSuccess] = useState(false)
    const [openSaveFailed, setOpenSaveFailed] = useState(false)
    const [isLastPatrol, setIsLastPatrol] = useState(null)
    const [loadedTime, setLoadedTime] = useState()
    const health = useMemo(() => {
        if (!userStatus) {return ""}
        switch(userStatus.healeth) {
            case true:
                return "好調"
            case false:
                return "不調"
            default:
                return ""
        }
    }, [userStatus])


    useEffect(() => {
        load().then()
    }, [props.userId, state.date]);

    const load = useCallback(() => {
        return new Promise((resolve, reject) => {
            setLoading(true)
            APIManager.getOne(`report/summary/${state.date}/${props.userId}`).then(res => {
                setLoading(false)
                setUserStatus(res.user_status)
                setData(res)
                setIsLastPatrol(res.user_status.is_last_patrol ?? false)
                setLoadedTime(dayjs().unix())
                props.onLoad && props.onLoad(props.userId, )
            }).catch(reject)
        })
        if (!props.userId) {
            return
        }

    }, [props.userId, state.date])

    const onAdminReviewed = useCallback(() => {
        APIManager.put("report/summary", {
            status: "reviewed",
            user_id: props.userId,
            date: state.date,
        }).then(() => {
            load().then()
        }).catch(e => {
            console.log(e.message)
        })
    }, [props.userId, state.date])

    const onSave = useCallback((data) => {
        return new Promise((resolve, reject) => {
            setLoading(true)
            APIManager.put(`/report/update/${props.userId}`, {date: state.date, data})
                .then(() => {
                    setOpenSaveSuccess(true)
                    load()
                        .then(resolve)
                        .catch(reject)
                })
                .catch(e => {
                    setOpenSaveFailed(true)
                })
        })

    }, [props.userId, state.date])

    const onChangeIsLastPatrol = (e) => {
        console.log(e)

        APIManager.put(`report/last_patrol/${props.userId}`, {
            date: state.date,
            is_last_patrol: e.target.checked
        }).then(() => {
            setIsLastPatrol(prev => !prev)
        })
    }

    const onLoad = useCallback((gridData) => {
        props.onLoad && props.onLoad(props.userId, {...data, gridData})
    }, [props.userId, state.date, data])

    return (
        <Box style={{position: "relative", margin: "1rem", display: "flex", flexDirection: "row", gap: "1rem", alignItems: "start"}}>
            <Box style={{
                flexGrow: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}>
                {!userStatus?.active && <Typography>データがありません</Typography>}
                {userStatus?.active && (<><Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'start',
                        alignItems: 'center',
                        fontWeight: '700',
                        gap: "1rem",
                    }}>
                    <Box>{dayjs(state.date).tz().format("YYYY年MM月DD日")}</Box>
                    <Box
                        style={{}}>天候：{userStatus?.weather}　体調：{health ? "良好": "不調"}　作業開始：{dayjs(userStatus?.start).format("HH:mm")} 作業終了：{dayjs(userStatus?.end).format("HH:mm")}</Box>
                    <Box style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: "8px",
                    }}>
                        <Box>マネージャー確認</Box>
                        {userStatus?.admin_reviewed && <Box style={{color: '#913890'}}>確認済み</Box>}
                        {!userStatus?.admin_reviewed &&
                            <Button onClick={onAdminReviewed} variant="contained">確認</Button>}
                    </Box>
                    <Box>
                        <FormControlLabel control={<Checkbox checked={isLastPatrol} onChange={onChangeIsLastPatrol} />} label="巡回最終担当者" />
                    </Box>
                </Box>
                    <GridView data={data} userId={props.userId} onSave={onSave} dataRerefreshTime={loadedTime} onLoad={onLoad} />
                </>)}
            </Box>
            <Box style={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                marginRight: "8px",
                justifyContent: "end",
                alignItems: "center"
            }}>
                {!loading && <Box>表示更新：{userStatus?.time ? dayjs(userStatus.time).format("HH:mm") : ""}</Box>}
                <Box>
                    {!loading && <Button variant="outlined" onClick={load}>更新</Button>}
                    {loading && <CircularProgress />}
                </Box>
            </Box>
            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                open={openSaveSuccess}
                onClose={() => setOpenSaveSuccess(false)}
                message="保存しました"
                autoHideDuration={3000}
            />
            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                open={openSaveFailed}
                onClose={() => setOpenSaveFailed(false)}
                message="保存に失敗しました。管理者に問い合わせてください"
                autoHideDuration={3000}
                />
        </Box>
    )

}

ReportDetailView.propTypes = {
    userId: PropTypes.number.isRequired,
    onLoad: PropTypes.func,
}

export default ReportDetailView
