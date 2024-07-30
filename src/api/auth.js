import axios from './axios'

export const loginRequest = user => axios.post(`/login`, user)

export const verifyTokenRequest = token => axios.post('/verify', { token })

export const registerRequest = user => axios.post(`/register`, user)

export const updateRegisterRequest = user => axios.post(`/updateRegister`, user)

export const registerAssignedPlacesRequest = (user_id, dataAssignedPlaces) => axios.post(`/registerAssignedPlaces`, {user_id, dataAssignedPlaces})

export const updateAssignedPlacesRequest = (user_id, dataAssignedPlaces) => axios.post(`/updateAssignedPlaces`, {user_id, dataAssignedPlaces})

export const registerMenuAndSubMenuRequest = (user_id, role_id, dataAssignedMenus) => axios.post(`/registerMenuAndSubMenu`, {user_id, role_id, dataAssignedMenus})

export const updateMenuAndSubMenuRequest = (user_id, role_id, dataAssignedMenus) => axios.post(`/updateMenuAndSubMenu`, {user_id, role_id, dataAssignedMenus})

export const updateActiveUserRequest = (user_id, name, user_name, password, type, status_user) => axios.post(`/updateActiveUser`, {user_id, name, user_name, password, type, status_user})
