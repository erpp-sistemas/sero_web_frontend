import { placeServiceFormByUserIdRequest } from '../api/form.js'

export const getPlaceServiceFormByUserId = async (user_id, place_id, service_id) => {
    try {
        const res = await placeServiceFormByUserIdRequest(user_id, place_id, service_id)
        return res.data
    } catch (error) {
        console.error(error)
    }
}