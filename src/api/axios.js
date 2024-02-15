import axios from 'axios'

const instance = axios.create({ baseURL: "https://erpp.center/sero-web"})

export default instance