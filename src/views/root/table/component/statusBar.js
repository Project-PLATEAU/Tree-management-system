import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"

const RootTableStatusBarComponent = (props) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(props.api.getModel().getRowCount())
  }, [])

  return (
    <div className="ag-status-name-value">
      <span className="component">Row Count Component&nbsp;</span>
      <span className="ag-status-name-value-value">{count}</span>
    </div>
  )
}

RootTableStatusBarComponent.propTypes = {
  api: PropTypes.any,
}

export default RootTableStatusBarComponent
