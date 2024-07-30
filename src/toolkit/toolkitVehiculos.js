import instance from "../api/axios"

const generateVehiculo = async (data) => {
	const url=`/vehiculos`
	try{
		const res = await instance.post(url,data)
		return res.data.data.id_vehiculo
	}catch(error){
		console.error(error)
	}
}

export default {
	generateVehiculo
}