import axios from './axios'

export const directionDashboardRequest = (user_id) => axios.get(`/DirectionDashboard/${user_id}`)