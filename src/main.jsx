import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Underlay from "./Underlay.jsx";
import Overlay from "./Overlay.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Underlay />
    <App />
    <Overlay />
  </React.StrictMode>,
)
