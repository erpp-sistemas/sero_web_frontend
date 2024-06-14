import axios from './axios'

export const loginRequest = user => axios.post(`/login`, user)

export const verifyTokenRequest = () => axios.get('/verify')

export const registerRequest = user => axios.post(`/register`, user)