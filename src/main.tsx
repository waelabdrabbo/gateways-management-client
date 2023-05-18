import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Devices from './store/features/devices/Devices.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gateways from './store/features/gateways/Gateways.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Gateways />} />
          <Route path="devices" element={<Devices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
