	import axios from "axios"

	const baseURL = 'http://localhost:3001/sero-web'

	const getPlazas=async()=>{
		const response = await axios.get(`${baseURL}/api/places`)
		const data = response.data
		const plazas = data.map((item) => ({
			id: item.id_plaza,
			nombre: item.nombre,
			active: item.activo
		}))
		return plazas
	}

	const getServicios = async () => {
		const responsetwo = await axios.get(`${baseURL}/api/services`)
		const data = responsetwo.data
		const servicios = data.services.map((item) => ({
			id: item.id_servicio,
			nombre: item.nombre,
			active: item.activo
		}))
		
		return servicios
	}

	const getName = async (nombre) => {
		const resposeName = await axios.get(`${baseURL}/api/records/paquete/nombre/${nombre}`)
		return resposeName
	}

	const generatePaquete=async(data)=>{

		const url=`${baseURL}/api/records/paquete`

		try{
			const res=await axios.post(url,data)
			return res.data.data.id
		}catch(error){
			false
		}

	}

	const uploadFichas=async(data)=>{	
		const url=`${baseURL}/api/records/registro/`
		await axios.post(url,data)
			.then(()=>{
				return "success"
			})
			.catch(()=>{
				false
			})
	}

	function NumberToDate(numeroSerie) {
		const fechaInicioExcel = new Date(1899, 12, 1)
		const ajuste1900 = 2
		const milisegundos = (numeroSerie - ajuste1900) * 24 * 60 * 60 * 1000
		const fechaHora = new Date(fechaInicioExcel.getTime() + milisegundos)
		const dia = fechaHora.getDate().toString().padStart(2, '0')
		const mes = (fechaHora.getMonth() + 1).toString().padStart(2, '0')
		const año = fechaHora.getFullYear()
		return `${año}/${mes}/${dia}`
	}

	const formatearFila =async (data,folio) => {
		const jsonData=data
		const columnIndexes = {
			cuenta: 'cuenta',
			propietario: 'propietario',
			calle: 'calle',
			colonia: 'colonia',
			latitud: 'latitud',
			longitud: 'longitud',
			tipo_servicio: 'tipo_de_servicio',
			tipo_tarifa: 'tipo_tarifa',
			serie_medidor: 'serie_medidor',
			servicio: 'servicio',
			recibo: 'recibo',
			descripcion: 'descripcion',
			promocion: 'promocion',
			fecha_pago: 'fecha de pago',
			total_pagado: 'total_pagado',
			porcentaje_paga: '% pagado',
			porcentaje_descuento: '% descuento',
			descuento: '$ descuento',
			gestor: 'gestor',
			tarea_gestionada: 'tarea_gestionada',
			fecha_gestion: 'fecha_de_gestion',
			tipo_gestion: 'tabla_gestion',
			estatus_predio: 'estatus_predio',
			estatus_gestion_Valida: 'estatus de getion valida',
			estatus_nuestra_cartera: 'estatus en nuestra cartera',
			estatus_cuenta: 'estatus de la cuenta',
			foto_fachada_predio: 'foto fachada predio',
			url_fachada: 'urlImagenFachada',
			foto_evidencia_predio: 'foto evidencia predio',
			url_evidencia: 'urlImagenEvidencia'
		}	

		const resultados = []

		await jsonData.forEach( (fila, index) => {

			if (index === 0) return

			const ficha = Object.keys(columnIndexes).reduce((ficha, columnName) => {
				const columnIndex = jsonData[0].indexOf(columnIndexes[columnName])
				ficha[columnName] = (columnIndex !== -1) ? fila[columnIndex] || 'desconocido' : 'desconocido'
				
				return ficha
			}, {})

			if (ficha.cuenta !== "desconocido") {
				let candado = true
				for (let key in ficha) {
					if (ficha[key] !== undefined) {
						if (typeof ficha.fecha_pago === 'number') {
							ficha.fecha_pago = NumberToDate(ficha.fecha_pago)
						}
						if (typeof ficha.fecha_gestion === 'number') {
							ficha.fecha_gestion = NumberToDate(ficha.fecha_gestion)
						}
						ficha.fecha_pago = ficha.fecha_pago.replace(/\//g, '-').slice(0, 10).replace(/ /g, '');
						ficha.fecha_gestion = ficha.fecha_gestion.replace(/\//g, '-').slice(0, 10).replace(/ /g, '');
						ficha.foto_fachada_predio = ficha.foto_fachada_predio==='si'||ficha.foto_fachada_predio==='Si'?1:0
						ficha.foto_evidencia_predio = ficha.foto_evidencia_predio==='si'||ficha.foto_evidencia_predio==='Si'?1:0
						ficha.promocion = ficha.promocion + ""

					} else {
						candado = false
					}
				}
				if (candado) {
					ficha.active = 0
					resultados.push({folio: folio ? folio : 'desconocido', ...ficha})
				}
			}
		})
		return resultados
		
	}

	const uploadS3 = async (file) => {
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await axios.post(`${baseURL}/api/records/uploadS3`, formData, {
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

	export default {
		generatePaquete,
		uploadFichas,
		getServicios,
		getPlazas,
		formatearFila,
		uploadS3,
		getName
	}