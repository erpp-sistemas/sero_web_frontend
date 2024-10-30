import axios from './axios'

export const workAttendanceRequest = (place_id, start_date, finish_date, user_id_session) => axios.get(`/WorkAttendance/${place_id}/${start_date}/${finish_date}/${user_id_session}`)