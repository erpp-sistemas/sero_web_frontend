import axios from './axios'

export const loginRequest = user => axios.post(`/login`, user)

export const verifyTokenRequest = token => axios.post('/verify', { token })

export const registerRequest = user => axios.post(`/register`, user)

export const editRegisterRequest = user => axios.post(`/editRegister`, user)

export const registerAssignedPlacesRequest = (user_id, dataAssignedPlaces) => axios.post(`/registerAssignedPlaces`, {user_id, dataAssignedPlaces})

export const registerMenuAndSubMenuRequest = (user_id, role_id, dataAssignedMenus) => axios.post(`/registerMenuAndSubMenu`, {user_id, role_id, dataAssignedMenus})
