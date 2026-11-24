import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

// S02 (2026-11-23): en producción la web (Firebase) y el backend están en dominios distintos y la cookie "token"
// que pone el frontend no viaja al backend. Las rutas con authRequired también aceptan el token de localStorage
// en "Authorization: Bearer"; las demás rutas lo ignoran. Solo para esta instancia (la de nuestra API).
instance.interceptors.request.use((config) => {
    let token = null
    try {
        token = localStorage.getItem('token')
    } catch {
        token = null
    }
    if (token && !config.headers?.Authorization) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default instance
