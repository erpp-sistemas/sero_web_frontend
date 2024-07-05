import instance from "../api/axios"

const getPlazas=async()=>{
	const response = await instance.get(`/places`)
	const data = response.data
	const plazas = data.map((item) => ({
		id: item.id_plaza,
		nombre: item.nombre,
		active: item.activo
	}))
	return plazas
}

const getRespaldos = async () => {
	const response = await instance.get(`/records/respaldo`)
	const data = response.data
	return data
}

const getServicios = async () => {
	const responsetwo = await instance.get(`/services`)
	const data = responsetwo.data
	const servicios = data.services.map((item) => ({
		id: item.id_servicio,
		nombre: item.nombre,
		active: item.activo
	}))
	
	return servicios
}

const getName = async (nombre) => {
	const resposeName = await instance.get(`/records/paquete/nombre/${nombre}`)
	return resposeName
}

const generatePaquete=async(data)=>{
	const url=`/records/paquete`

	try{
		const res=await instance.post(url,data)
		return res.data.data.id
	}catch(error){
		false
	}

}

const generateCondicional = async(data) => {
	const url=`/condicionales`

	try{
		const res=await instance.post(url,data)
		return res.data.data.id
	}catch(error){
		false
	}

}

const uploadFichas = async (data) => {	
	const url = `/records/registro/`
	const dataToSend = {
		...data,
		counter: data.counter
	}
	try {
		await instance.post(url, dataToSend)
		return "success"
	} catch (error) {
		console.error("Error al subir las fichas:", error)
		return false;
	}
}

const formatearFila = async (data, folio) => {
    const jsonData = data
    const idIndex = jsonData[0].indexOf('id')
    const sortedData = [jsonData[0], ...jsonData.slice(1).sort((a, b) => {
        const idA = parseInt(a[idIndex], 10) || 0
        const idB = parseInt(b[idIndex], 10) || 0
        return idA - idB
    })]

    const columnIndexes = {
        id_local: 'id',
        cuenta: 'cuenta',
        propietario: 'propietario',
        calle: 'calle',
        colonia: 'colonia',
        latitud: 'latitud',
        longitud: 'longitud',
        tipo_servicio: 'tipo_de_servicio',
        tipo_tarifa: 'tipo_tarifa',
        medidor: 'serie_medidor',
        servicio: 'servicio',
        recibo: 'recibo',
        clave_catastral: 'clave_catastral',
        superficie_terreno: 'superficie_terreno_h',
        superficie_construccion: 'superficie_construccion_h',
        valor_terreno: 'valor_terreno_h',
        valor_construccion: 'valor_construccion_h',
        valor_catastral: 'valor_catastral_h',
        descripcion: 'descripcion',
        promocion: 'promocion',
        fecha_pago: 'fecha de pago',
        total_pagado: 'total_pagado',
        porcentaje_paga: '% pagado',
        porcentaje_descuento: '% descuento',
        descuento: '$ descuento',
        gestor: 'gestor',
		giro: 'giro',
		proceso: 'proceso',
        tarea_gestionada: 'tarea_gestionada',
        fecha_gestion: 'fecha_de_gestion',
        tabla_gestion: 'tabla_gestion',
        tipo_gestion: 'tabla_gestion',
        status_predio: 'estatus_predio',
        status_gestion_valida: 'estatus de getion valida',
        status_nuestra_cartera: 'estatus en nuestra cartera',
        status_cuenta: 'estatus de la cuenta',
        foto_fachada_predio: 'foto fachada predio',
        url_fachada: 'urlImagenFachada',
        foto_evidencia_predio: 'foto evidencia predio',
        url_evidencia: 'urlImagenEvidencia'
    }

    const tiposDeDatos = {}
    const resultados = []

    for (let index = 1; index < sortedData.length; index++) {
        const fila = sortedData[index]

        const ficha = Object.keys(columnIndexes).reduce((ficha, columnName) => {
            const columnIndex = sortedData[0].indexOf(columnIndexes[columnName])
            ficha[columnName] = (columnIndex !== -1) ? fila[columnIndex] || 'desconocido' : 'desconocido'

			if (['id', 'latitud', 'longitud', 'total_pagado', 'descuento'].includes(columnName) && ficha[columnName] === 'desconocido') {
				ficha[columnName] = 0
			}

            if (['calle', 'propietario', 'colonia', 'tipo_servicio', 'tipo_tarifa', 'medidor', 'servicio', 'recibo', 'clave_catastral', 'descripcion', 'porcentaje_paga', 'porcentaje_descuento', 'gestor', 'tarea_gestionada', 'tabla_gestion', 'tipo_gestion', 'status_predio', 'status_gestion_valida', 'status_nuestra_cartera', 'status_cuenta', 'cuenta', 'url_fachada', 'url_evidencia'].includes(columnName)) {
                ficha[columnName] = ficha[columnName] === 'desconocido' ? '0' : String(ficha[columnName])
            }

            return ficha

        }, {})

        if (ficha.cuenta !== 'desconocido') {
            let candado = true
            for (let key in ficha) {
                if (ficha[key] !== undefined) {
                    ficha.foto_fachada_predio = ficha.foto_fachada_predio === 'si' || ficha.foto_fachada_predio === 'Si' ? 1 : 0
                    ficha.foto_evidencia_predio = ficha.foto_evidencia_predio === 'si' || ficha.foto_evidencia_predio === 'Si' ? 1 : 0
                    ficha.promocion = String(ficha.promocion)
                } else {
                    candado = false
                }
            }

            if (candado) {
                ficha.activate = 0
                resultados.push({ folio: folio ? folio : 'desconocido', ...ficha })

                Object.keys(ficha).forEach((key) => {
                    if (!tiposDeDatos[key]) {
                        tiposDeDatos[key] = typeof ficha[key]
                    } else if (tiposDeDatos[key] !== typeof ficha[key]) {
                        console.warn(`Diferente tipo de dato en la columna '${key}': Esperado '${tiposDeDatos[key]}', Encontrado '${typeof ficha[key]}'`)
                    }
                })

            }

        }

    }
	console.log(resultados)
    return resultados

}

const uploadS3 = async (file, name) => {
	const formData = new FormData()
	formData.append('file', file)

	try {
		const response = await instance.post(`/records/uploadS3/${name}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		return response.data
	} catch (error) {
		console.error('Error al subir archivo a S3:', error)
		throw error
	}

}

const uploadBackup = async (file, nombre) => {
	const formData = new FormData()
	formData.append('file', file)

	try {
		const response = await instance.post(`/records/backup/${nombre}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		return response.data

	} catch (error) {
		console.error('Error al subir archivo a S3:', error)
		throw error
	}

}

const createRespaldo = async (data) => {	
	const url = `/records/respaldo`
	try {
		await instance.post(url, data)
		return "success"
	} catch (error) {
		console.error("Error al crear el respaldo:", error)
		return false
	}
}

export default {
	generatePaquete,
	uploadFichas,
	getServicios,
	getPlazas,
	formatearFila,
	uploadS3,
	getName,
	uploadBackup,
	createRespaldo,
	getRespaldos,
	generateCondicional
}