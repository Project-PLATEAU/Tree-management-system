import React from "react"
import ReactDOM from "react-dom"

export const componentToHtml = (component) => {
  const div = document.createElement("div")

  return new Promise((resolve) => {
    ReactDOM.render(component, div, () => {
      resolve(div.innerHTML)
    })
  })
}
