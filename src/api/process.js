import axios from './axios'

//export const loginRequest = user => axios.post(`/login`, user)

export const placeServiceProcessByUserIdRequest = (user_id, place_id, service_id) => axios.get(`/PlaceServiceProcessByUserId/${user_id}/${place_id}/${service_id}`)