import axios from './axios'

export const workAttendanceRequest = (place_id, start_date, finish_date) => axios.get(`/WorkAttendance/${place_id}/${start_date}/${finish_date}`)