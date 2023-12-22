import {validPaymentRequest} from '../api/payment.js'

export const getValidPayment = async (place_id, service_id, process_ids, valid_days, start_date, finish_date, type) => {
    try {

      
      const response = await validPaymentRequest(place_id, service_id, process_ids, valid_days, start_date, finish_date, type);
      return response.data; 
      
    } catch (error) {
      console.error('Error al enviar datos a la API', error.response?.data || error.message);
      throw error; // O maneja el error según tus necesidades
    }
  };