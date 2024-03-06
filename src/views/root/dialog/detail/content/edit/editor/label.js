import React from "react"
import Base from "./base"
import { useMemo } from "react"

const DialogDetailContentLabel = (props) => {
  const baseProps = useMemo(() => {
    if (!props) {
      return null
    }
    let p = { ...props }
    p.styles["arrowBox"] = { display: "none" }
    return p
  }, [])

  return (
    <Base {...baseProps}>
      <></>
    </Base>
  )
}

DialogDetailContentLabel.propTypes = {
  ...Base.propTypes,
}

export default DialogDetailContentLabel
