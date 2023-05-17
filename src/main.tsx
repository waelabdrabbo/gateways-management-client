import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Devices from './Devices.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GatewaysRedux from './store/features/gateways/Gateways.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<GatewaysRedux />} />
          <Route path="devices" element={<Devices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
