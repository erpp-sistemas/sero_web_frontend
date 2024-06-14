import axios from 'axios'

// Se usa en modo local
// const instance = axios.create({
//    baseURL: 'http://127.0.0.1:3001/api',
//    withCredentials: true
// }) 

// Se usa en modo produccion
const instance = axios.create({ baseURL: "https://erpp.center/sero-web/api"}) 

export default instance