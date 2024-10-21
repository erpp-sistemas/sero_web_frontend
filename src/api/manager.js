import axios from './axios'

export const managerDashboardRequest = (place_id, service_id, process_ids, start_date, finish_date) => axios.get(`/ManagerDashboard/${place_id}/${service_id}/${process_ids}/${start_date}/${finish_date}`)