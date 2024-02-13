import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Root from "./views/root"
import "ag-grid-enterprise"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-balham.css"
import { LicenseManager } from "ag-grid-enterprise"
import {useEffect} from "react"

function App() {

    useEffect(() => {
        process.env.REACT_APP_AG_GRID_LICENSE_KEY && LicenseManager.setLicenseKey(process.env.REACT_APP_AG_GRID_LICENSE_KEY)
    }, []);

  return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Root />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
