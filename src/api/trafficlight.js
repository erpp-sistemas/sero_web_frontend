import axios from './axios'

export const trafficLightRequest = (place_id, service_id, process_ids, date) => axios.get(`/TrafficLight/${place_id}/${service_id}/${process_ids}/${date}`)
export const trafficLightByTypeRequest = (place_id, service_id, process_ids, date, type) => axios.get(`/TrafficLightByType/${place_id}/${service_id}/${process_ids}/${date}/${type}`)