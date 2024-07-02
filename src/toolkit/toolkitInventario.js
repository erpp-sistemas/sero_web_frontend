import instance from "../api/axios"

const getTiposProducto = async() => {
	const response = await instance.get(`/inventory/tipo`)
	const data = response.data.data
	return data
}

export default {
    getTiposProducto
}