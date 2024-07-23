import axios from 'axios'
import { mode } from '../config/credentials'

const instance = axios.create({
    baseURL: mode === 'prod' ? "https://erpp.center/sero-web/api" : "http://localhost:3001/sero-web/api",
    withCredentials: true
})

export default instance
