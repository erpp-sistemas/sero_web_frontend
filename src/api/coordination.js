import axios from './axios'

export const coordinationDashboardRequest = (place_id, service_id, process_id, start_date, finish_date) => axios.get(`/CoordinationDashboard/${place_id}/${service_id}/${process_id}/${start_date}/${finish_date}`)
export const viewPositionDailyWorkSummaryRequest = (place_id, service_id, process_id, user_id, date_capture) => axios.get(`/ViewPositionDailyWorkSummary/${place_id}/${service_id}/${process_id}/${user_id}/${date_capture}`)