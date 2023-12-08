import { placeByUserIdRequest, placeById } from '../api/place'

export const getPlacesByUserId = async (user_id) => {
  try {
    const res = await placeByUserIdRequest(user_id)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getPlaceById = async (place_id) => {
  try {
    const res = await placeById(place_id)    
    return res.data
  } catch(error) {
    console.log(error)
  }
}