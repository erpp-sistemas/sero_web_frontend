import axios from './axios'

export const managementByRangeDateAndIndicatorTypeRequest = (place_id, service_id, process_id, start_date, finish_date, indicator_type) => axios.get(`/ManagementByRangeDateAndIndicatorType/${place_id}/${service_id}/${process_id}/${start_date}/${finish_date}/${indicator_type}`)
export const photoManagementRequest = (place_id, service_id, start_date, finish_date) => axios.get(`/PhotoManagement/${place_id}/${service_id}/${start_date}/${finish_date}`)