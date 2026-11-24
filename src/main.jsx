import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { instalarRenovacionDeFotos } from './utils/renovarFotosVencidas'
import { MAPBOX_TOKEN } from './config/mapbox'

// S01-H1.6: si una foto del sistema deja de abrir (URL firmada vencida), se pide una nueva.
instalarRenovacionDeFotos()

mapboxgl.accessToken = MAPBOX_TOKEN;

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</PersistGate>
	</Provider>
)
