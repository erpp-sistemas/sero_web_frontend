import instance from "../api/axios"

const getPaquetes = async () => {

    const response = await instance.get(`/records/paquete`)
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
		id_usuario: item.id_usuario,
		activate: item.activate,
		fecha_impresion: item.fecha_impresion,
		firma: item.firma,
		cfdi: item.cfdi,
		mes_facturacion: item.mes_facturacion,
	}))
	return paquetes
}

const getRegistrosById = async (idPaquete) => {

	try {
		const response = await instance.get(`/records/registro/${idPaquete}`)
		const data = response.data
		return(data.data)

	} catch (error) {
		console.error('Error fetching data:', error)
	}

}

const createRecords = async (data) => {
	
	const url=`/records/registro/pdf`

	try{
		const res=await instance.post(url,data)
		return res.status
	}catch(error){
		false
	}

}

const deleteRecords = async (id) => {
	
	const url=`/records/paquete/delete/${id}`

	try{
		const res=await instance.delete(url)
		return res.status
	}catch(error){
		false
	}

}

const counterFiles = async (idPaq, paquetes) => {
    let totalDeFichas = 0

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
    const usuario = selectedPaquete.usuario

    try {
        const response = await instance.get(`/records/download/${nombreCarpeta}/${usuario}`)
        totalDeFichas = response.data.count

        const numParts = Math.ceil(totalDeFichas / 200)

        for (let part = 1; part <= numParts; part++) {
			const initial_id = (part - 1) * 200 + 1
            const end_id = part * 200
            const partResponse = await instance.get(`/records/downloadRange/${nombreCarpeta}/${usuario}/${part}/${initial_id}/${end_id}`, {
                responseType: 'arraybuffer'
            })

            if (partResponse && partResponse.data) {
                const blob = new Blob([partResponse.data], { type: 'application/zip' })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `parte_${part}.zip`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                console.error('La respuesta para la parte', part, 'no contiene datos válidos.')
            }
        }

    } catch (error) {
        console.error('Error al descargar el archivo:', error)
    }
}

const updateActiveStatus = async (cuenta) => {

	try {
		const response = await instance.put(`/records/registro/activate/${cuenta}`)
		const data = response.data
		return(data.data)

	} catch (error) {
		console.error('Error fetching data:', error)
	}

}

const updateActivePaquete = async (id) => {

	try {
		const response = await instance.put(`/records/paquete/activate/${id}`)
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
	counterFiles,
	deleteRecords
}