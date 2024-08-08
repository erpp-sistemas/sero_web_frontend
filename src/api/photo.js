import axios from './axios'

export const savePhotoRequest = ( photo_data) => axios.post(`/SavePhoto`, photo_data)