import axios from './axios'

export const workAssignmentRequest = (place_id, service_id, excelData, user_id_session) => axios.post(`/WorkAssignment`, {place_id, service_id, excelData, user_id_session})
export const assignmentAllRequest = (place_id, service_id) => axios.get(`/AssignmentAll/${place_id}/${service_id}`)