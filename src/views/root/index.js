import React from "react"
import {Box, Drawer} from "@mui/material"
import UseRootData from "./data"
import HeaderView from "./header"
import ListView from "./list"
import MapView from "./map"
import ReportView from "./report"
import DetailView from "./detail"
import {WindowMode} from "./data/state"

const styles = {
    root: {
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    content: {
        flexGrow: 1,
        position: "relative",
        overflow: "hidden",
    }
}

export const RootDataContext = React.createContext()

const RootView = (props) => {

    const useRootData = UseRootData()
    const { state } = useRootData
    const drawerWidth = 360;
    return (
        <RootDataContext.Provider value={useRootData}>
            <Box style={{width: "100%", height: "100%", display: "flex", flexDirection: "row"}}>
                <Box sx={styles.root}>
                    <HeaderView />
                    {(state.windowMode === WindowMode.Both || state.windowMode === WindowMode.List) && (
                        <Box sx={styles.content}>
                            <ListView />
                        </Box>)}
                    {(state.windowMode === WindowMode.Both || state.windowMode === WindowMode.Map) && (
                        <Box sx={styles.content} style={{height: state.windowMode === WindowMode.Both ? "80px" : "inherit"}}>
                            <MapView />
                        </Box>)}
                    {state.windowMode === WindowMode.Report && (
                        <Box sx={styles.content}>
                            <ReportView />
                        </Box>
                    )}
                </Box>
                {state.detail && <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={!!state.detail}
                >
                    <DetailView />
                </Drawer>}
            </Box>
        </RootDataContext.Provider>
    )
}

export default RootView
