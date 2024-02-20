import axios from 'axios'

const instance = axios.create({ baseURL: "http://localhost:3000/api"}) // Se usa en modo local

//const instance = axios.create({ baseURL: "https://erpp.center/sero-web"}) // Se usa en modo produccion

export default instance