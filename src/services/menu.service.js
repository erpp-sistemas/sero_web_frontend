import {menusUserIdRequest} from '../api/menu'

export const getMenusUserId = async (user_id) => {
	try {
		const res = await menusUserIdRequest(user_id)
		return res.data
	} catch (error) {
		console.error(error)
	}
}