import axios from './axios'

export const coordinationDashboardRequest = (place_id, service_id, process_id, start_date, finish_date) => axios.get(`/CoordinationDashboard/${place_id}/${service_id}/${process_id}/${start_date}/${finish_date}`)