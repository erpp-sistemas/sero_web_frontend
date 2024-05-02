import axios from './axios'

export const AccountHistoryRequest = (place_id, account) => axios.get(`/AccountHistory/${place_id}/${account}`)