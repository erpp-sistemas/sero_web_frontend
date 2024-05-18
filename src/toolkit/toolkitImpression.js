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
		excel_document: item.excel_document,
		usuario: item.usuario,
		activate: item.activate,
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

const createRecords = async (data) => {
	
	const url=`${baseURL}/api/records/registro/pdf`

	try{
		const res=await axios.post(url,data)
		return res.status
	}catch(error){
		false
	}

}

const downloadZip = async (idPaq, paquetes) => {
	if (idPaq === 0) {
		console.warn('No se ha seleccionado ningún paquete')
		return
	}
	const selectedPaquete = paquetes.find(item => item.id === idPaq)
	if (!selectedPaquete) {
		console.error('Paquete seleccionado no encontrado')
		return
	}
	const nombreCarpeta = selectedPaquete.nombre

	try {
		const response = await axios.get(`${baseURL}/api/records/download/${nombreCarpeta}`, {
			responseType: 'blob', 
		})

		const url = window.URL.createObjectURL(new Blob([response.data]))
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('download', `${nombreCarpeta}.zip`)
		document.body.appendChild(link)
		link.click()
		link.remove()
	} catch (error) {
		console.error('Error al descargar el archivo:', error)
	}
	
}

const updateActiveStatus = async (cuenta) => {

	try {
		const response = await axios.put(`${baseURL}/api/records/registro/activate/${cuenta}`)
		const data = response.data
		return(data.data)

	} catch (error) {
		console.error('Error fetching data:', error)
	}

}

const updateActivePaquete = async (id) => {

	try {
		const response = await axios.put(`${baseURL}/api/records/paquete/activate/${id}`)
		const data = response.data
		return(data.data)

	} catch (error) {
		console.error('Error fetching data:', error)
	}

}

export default {
    getPaquetes,
	getRegistrosById,
	createRecords,
	updateActiveStatus,
	updateActivePaquete,
	downloadZip
}