import axios from './axios'

export const citizenAttentionAppointmentsRequest = (place_id, service_id, date_start, date_finish) => axios.get(`/CitizenAttentionAppointments/${place_id}/${service_id}/${date_start}/${date_finish}`)