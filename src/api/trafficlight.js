import axios from './axios'

export const trafficLightRequest = (place_id, service_id, process_ids, date) => axios.get(`/TrafficLight/${place_id}/${service_id}/${process_ids}/${date}`)