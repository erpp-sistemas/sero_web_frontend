// Token público de Mapbox (pk.…) para los mapas de la web, desde VITE_MAPBOX_TOKEN (.env.development / .env.production).
// Todo VITE_* termina en el bundle: usar un token PÚBLICO restringido por URL en Mapbox (dominios de la web y localhost),
// distinto del que usa el backend para las fichas (MAPBOX_TOKEN del servidor).
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? ''

if (!MAPBOX_TOKEN) {
	console.warn('Falta VITE_MAPBOX_TOKEN: los mapas de Mapbox no se van a mostrar.')
}

// Imagen estática 400×250 con un pin en la coordenada (PDF del historial de cuenta)
export const urlMapaEstatico = (latitud, longitud) =>
	`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-l+000(${longitud},${latitud})/${longitud},${latitud},17,0/400x250?access_token=${encodeURIComponent(MAPBOX_TOKEN)}`
