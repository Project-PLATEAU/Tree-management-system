import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import "ag-grid-enterprise"
import "ag-grid-enterprise/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"

import { LicenseManager } from "ag-grid-enterprise"
if (process.env.REACT_APP_AGGRID_LICENSE) {
  LicenseManager.setLicenseKey(process.env.REACT_APP_AGGRID_LICENSE)
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
console.log(analytics)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)

serviceWorkerRegistration.unregister()
