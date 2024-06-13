import axios from './axios'

export const surveyReportRequest = (place_id, start_date, finish_date) => axios.get(`/SurveyReport/${place_id}/${start_date}/${finish_date}`)