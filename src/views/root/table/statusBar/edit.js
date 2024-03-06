import React, { useContext, useEffect } from "react"
import { Button } from "@mui/material"
import PropTypes from "prop-types"
import { RootDataContext } from "../../index"

const styles = {
  root: {
    margin: "0.3rem",
    display: "flex",
    gap: "8px",
  },
  button: {
    height: "28px !important",
  },
}

const RootTableStatusBarEditComponent = (props) => {
  const { state, setListEditedData } = useContext(RootDataContext)

  const onSave = () => {
    setListEditedData(null)
    props.onRefresh()
  }

  const onReset = () => {
    setListEditedData(null)
    props.onRefresh()
  }

  return (
    <div style={styles.root}>
      <Button
        disabled={!state.listEditedData}
        size="small"
        variant="contained"
        style={styles.button}
        onClick={onSave}
      >
        変更を保存
      </Button>
      <Button
        disabled={!state.listEditedData}
        size="small"
        variant="contained"
        color="secondary"
        style={styles.button}
        onClick={onReset}
      >
        リセット
      </Button>
    </div>
  )
}

RootTableStatusBarEditComponent.propTypes = {
  edited: PropTypes.string,
  onRefresh: PropTypes.func,
}

export default RootTableStatusBarEditComponent
