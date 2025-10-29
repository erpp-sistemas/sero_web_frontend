import axios from './axios'

export const validPaymentRequest = (place_id, service_id, process_ids, valid_days, start_date, finish_date, type) => axios.get(`/ValidPayment/${place_id}/${service_id}/${process_ids}/${valid_days}/${start_date}/${finish_date}/${type}`)
export const paymentValidationResultsRequest = (id_plaza, id_servicio, id_procesos, dias_rango, fecha_inicio, fecha_fin) => axios.get(`/PaymentValidationResults/${id_plaza}/${id_servicio}/${id_procesos}/${dias_rango}/${fecha_inicio}/${fecha_fin}`)