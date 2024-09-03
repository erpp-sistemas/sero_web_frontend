import instance from "../api/axios"

const generateVehiculo = async ( data ) => {
	const url=`/vehiculos`
	try{
		const response = await instance.post(url,data)
		return response
	}catch(error){
		console.error(error)
	}
}

const getVehiculos = async () => {
	const url=`/vehiculos`
	try{
		const response = await instance.get( url )
		return response
	}catch(error){
		console.error(error)
	}
}

const subirImagen = async ( file, name ) => {
	const formData = new FormData()
	formData.append('file', file)

	try {
		const response = await instance.post(`/vehiculos/subida/${name}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		return response
	} catch (error) {
		console.error('Error al subir archivo a S3:', error)
		throw error
	}

}

const actualizarDocumentos = async ( data ) => {
	const url=`/vehiculos/documentos`
	try{
		const response = await instance.post( url, data )
		return response
	}catch(error){
		console.error(error)
	}
}

const actualizarImagenes = async ( data, name ) => {
	const url=`/vehiculos/${name}`
	try{
		const response = await instance.post( url, data )
		return response
	}catch(error){
		console.error(error)
	}
}

const actualizarComentarios = async ( data, name ) => {
	const url=`/vehiculos/comentario/${name}`
	try{
		const response = await instance.post( url, data )
		return response
	}catch(error){
		console.error(error)
	}
}

const crearEstadoVehiculo = async ( data ) => {
	const url=`/vehiculos/estado`
	try{
		const response = await instance.post( url, data )
		return response
	}catch(error){
		console.error(error)
	}
} 

const actualizarVerificacion = async ( data ) => {
	const url=`/vehiculos/verificacion`
	try{
		const response = await instance.post( url, data )
		return response
	}catch(error){
		console.error(error)
	}
}

const actualizarTenencia = async ( data ) => {
	const url=`/vehiculos/tenencia`
	try{
		const response = await instance.post( url, data )
		return response
	}catch(error){
		console.error(error)
	}
}

const actualizarPlacas = async ( data ) => {
	const url=`/vehiculos/placas`
	try{
		const response = await instance.post( url, data )
		return response
	}catch(error){
		console.error(error)
	}
}

const actualizarExtraordinarios = async ( data ) => {
	const url=`/vehiculos/extraordinarios`
	try{
		const response = await instance.post( url, data )
		return response
	}catch(error){
		console.error(error)
	}
}

const crearQr = async ( data ) => {
	const url=`/vehiculos/qr`
	console.log(data)
	try{
		const response = await instance.post( url, data )
		return response
	}catch(error){
		console.error(error)
	}

}

export default {
	generateVehiculo,
	subirImagen,
	actualizarDocumentos,
	actualizarComentarios,
	crearEstadoVehiculo,
	actualizarImagenes,
	actualizarVerificacion,
	actualizarTenencia,
	actualizarPlacas,
	actualizarExtraordinarios,
	getVehiculos, 
	crearQr,
}