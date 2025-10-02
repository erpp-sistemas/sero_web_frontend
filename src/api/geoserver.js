import axios from './axios';


export const getDataGeoserver = (url) => {
    return axios.post(`/get-data-geoserver`, { url })
}