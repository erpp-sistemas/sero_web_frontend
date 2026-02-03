import axios from './axios'

export const coordinationDashboardRequest = (place_id, service_id, process_id, start_date, finish_date) => axios.get(`/CoordinationDashboard/${place_id}/${service_id}/${process_id}/${start_date}/${finish_date}`)
export const homeCoordinationRequest = (place_id, service_id, process_id) => axios.get(`/HomeCoordination/${place_id}/${service_id}/${process_id}`)
export const homeCoordinationWSRequest = (place_id, service_id, process_id, account, date_capture) => axios.get(`/HomeCoordinationWS/${place_id}/${service_id}/${process_id}/${account}/${date_capture}`)
export const viewPositionDailyWorkSummaryRequest = (place_id, service_id, process_id, user_id, date_capture) => axios.get(`/ViewPositionDailyWorkSummary/${place_id}/${service_id}/${process_id}/${user_id}/${date_capture}`)
export const viewPositionVerifiedAddressRequest = (place_id, service_id, process_id, user_id, date_capture) => axios.get(`/ViewPositionVerifiedAddress/${place_id}/${service_id}/${process_id}/${user_id}/${date_capture}`)
export const coordinatorMonitorResultsRequest = (id_plaza, id_servicio, id_procesos, fecha_inicio, fecha_fin) => axios.get(`/CoordinatorMonitorResults/${id_plaza}/${id_servicio}/${id_procesos}/${fecha_inicio}/${fecha_fin}`)