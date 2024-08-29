import axios from './axios'

export const MonthsOfDebtRequest = (place_id, service_id) => axios.get(`/MonthsOfDebt/${place_id}/${service_id}`)