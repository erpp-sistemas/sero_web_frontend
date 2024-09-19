import axios from './axios'

export const workAssignmentRequest = (place_id, service_id, excelData, user_id_session) => axios.post(`/WorkAssignment`, {place_id, service_id, excelData, user_id_session})