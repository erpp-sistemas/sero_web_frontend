import axios from './axios'

export const placeServiceFormByUserIdRequest = (user_id, place_id, service_id) => axios.get(`/PlaceServiceFormByUserId/${user_id}/${place_id}/${service_id}`)
