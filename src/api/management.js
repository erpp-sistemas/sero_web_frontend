import axios from './axios'

export const managementByRangeDateAndIndicatorTypeRequest = (place_id, service_id, process_id, start_date, finish_date, indicator_type) => axios.get(`/ManagementByRangeDateAndIndicatorType/${place_id}/${service_id}/${process_id}/${start_date}/${finish_date}/${indicator_type}`)
export const photoManagementRequest = (place_id, service_id, process_ids, start_date, finish_date) => axios.get(`/PhotoManagement/${place_id}/${service_id}/${process_ids}/${start_date}/${finish_date}`)
export const lektorManagementRequest = (place_id, service_id, form_id, date_start, date_finish) => axios.get(`/LektorManagement/${place_id}/${service_id}/${form_id}/${date_start}/${date_finish}`)
export const registerFormDynamicManagementRequest = (place_id, service_id, form_id, date_start, date_finish) => axios.get(`/RegisterFormDynamicManagement/${place_id}/${service_id}/${form_id}/${date_start}/${date_finish}`)