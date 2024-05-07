import axios from "axios"

const baseURL = 'http://localhost:3001/sero-web'

const getPaquetes = async () => {
    const response = await axios.get(`${baseURL}/api/records/paquete`)
	const data = response.data
	const paquetes = data.data.map((item) => ({
		id: item.id,
		nombre: item.nombre,	
		plaza: item.plaza,
		servicio: item.servicio,
		folio: item.folio,
		fecha_corte: item.fecha_corte,
		usuario: item.usuario,
	}))
	return paquetes
}

const getRegistrosById = async (idPaquete) => {
	try {
		const response = await axios.get(`${baseURL}/api/records/registro/${idPaquete}`)
		const data = response.data
		return(data.data)

	} catch (error) {
		console.error('Error fetching data:', error)
	}
}

export default {
    getPaquetes,
	getRegistrosById
}