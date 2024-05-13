import axios from './axios'

export const workAssignmentRequest = (place_id, service_id, excelData) => axios.post(`/WorkAssignment`, {place_id, service_id, excelData})