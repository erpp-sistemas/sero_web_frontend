import axios from 'axios'

const instance = axios.create({
   baseURL: 'http://127.0.0.1:3000/api',
   withCredentials: true
}) // Se usa en modo local

//const instance = axios.create({ baseURL: "https://erpp.center/sero-web/api"}) // Se usa en modo produccion

export default instance