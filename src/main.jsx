import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'

mapboxgl.accessToken = 'pk.eyJ1IjoibGVzdGF0eCIsImEiOiJjbDJoMzJrbmYwYTNrM2NteGVtMzBsODFvIn0.lTrpDiiVnBWEv141_PnuUg';
//mapboxgl.accessToken = 'pk.eyJ1IjoibGVzdGF0eCIsImEiOiJjbDRxNGxvazMwMTVzM2RyemtzbDBvZnFoIn0.1Z-Eve85dnZLmkCs6BQ5Tw';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>

  // </React.StrictMode>,
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
