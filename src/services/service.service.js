import { placeServiceByUserIdRequest } from '../api/service'

export const getPlaceServiceByUserId = async (user_id, place_id) => {
	try {
		const res = await placeServiceByUserIdRequest(user_id, place_id)
		return res.data
	} catch (error) {
		console.error(error)
	}
}