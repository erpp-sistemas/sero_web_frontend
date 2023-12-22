import { placeServiceProcessByUserIdRequest } from '../api/process.js'

export const getPlaceServiceProcessByUserId = async (user_id, place_id, service_id) => {
  try {
    const res = await placeServiceProcessByUserIdRequest(user_id, place_id, service_id)
    return res.data
  } catch (error) {
    console.log(error)
  }
}