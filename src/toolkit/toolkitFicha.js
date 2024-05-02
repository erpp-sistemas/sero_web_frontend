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

const getServicios=async()=>{
    const responsetwo = await axios.get(`${baseURL}/api/services`)
    const data = responsetwo.data
    const servicios = data.services.map((item) => ({
        id: item.id_servicio,
        nombre: item.nombre,
        active: item.activo
    }))
	
    return servicios
}

const generatePaquete=async(data)=>{

	const formData = new FormData()

	const fecha_corteString = (typeof data.fecha_corte === 'object') ? data.fecha_corte.toISOString().split('T')[0] : data.fecha_corte;

    formData.append('servicio', data.servicio)
    formData.append('fecha_corte', fecha_corteString)
    formData.append('folio', data.folio || 'desconocido')
    formData.append('plaza', data.plaza)
    formData.append('excel_document', data.excel_document)

    const url=`${baseURL}/paquetes/create/`

    try{

        const res=await axios.post(url,formData)
        return res?.data?.id

    }catch(error){
		
        console.log(error)

    }

}

const uploadFichas=async(data)=>{	
    const url=`${baseURL}/paquetes/create/register/`
    await axios.post(url,data)
        .then(()=>{
            console.log("success")
            return "success"
        })
        .catch(res=>{
            console.log(res)
        })
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
        tipo_gestion: 'tipo de gestion',
        estatus_predio: 'estatus_predio',
        estatus_gestion_Valida: 'estatus de getion valida',
        estatus_nuestra_cartera: 'estatus en nuestra cartera',
        estatus_cuenta: 'estatus de la cuenta',
        foto_fachada: 'foto fachada predio',
        url_fachada: 'urlImagenFachada',
        foto_evidencia: 'foto evidencia predio',
        url_evidencia: 'urlImagenEvidencia'
    };

    const resultados = []

     await jsonData.forEach( (fila, index) => {

        if (index === 0) return

        const ficha = Object.keys(columnIndexes).reduce((ficha, columnName) => {
            const columnIndex = jsonData[0].indexOf(columnIndexes[columnName]);
            ficha[columnName] = (columnIndex !== -1) ? fila[columnIndex] || 'desconocido' : 'desconocido';
            
            return ficha;
        }, {});

        if (ficha.cuenta !== "desconocido") {
            let candado = true
			const fecha_pago = null
			const fecha_gestion = null
            for (let key in ficha) {
                if (ficha[key] !== undefined) {
                    if (typeof ficha.fecha_pago === 'number') {
                        ficha.fecha_pago = NumberToDate(fecha_pago)
                    }
                    if (typeof ficha.fecha_gestion === 'number') {
                        ficha.fecha_gestion = NumberToDate(fecha_gestion)
                    }
                    ficha.fecha_pago = ficha.fecha_pago.slice(0, 10).replace(/ /g, '')
                    ficha.fecha_gestion = ficha.fecha_gestion.slice(0, 10).replace(/ /g, '')
                    ficha.porcentaje_paga =  parseFloat(ficha.porcentaje_paga)
                    ficha.porcentaje_descuento =  parseFloat(ficha.porcentaje_descuento)

                } else {
                    candado = false
                }
            }
            if (candado) {
                resultados.push({folio:folio||"xxx",...ficha})
            }
        }
    })
    return resultados
}

function NumberToDate(serial) {
    const MS_PER_DAY = 24 * 60 * 60 * 1000
    const EPOCH_OFFSET_DAYS = 25569
    const excelEpoch = new Date(Date.UTC(1970, 0, 1))

    const utcDays = serial - EPOCH_OFFSET_DAYS
    const utcMilliseconds = utcDays * MS_PER_DAY

    const date = new Date(excelEpoch.getTime() + utcMilliseconds)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const ampm = hours >= 12 ? 'p. m.' : 'a. m.'
    const formattedDate = `${date.toLocaleDateString()} ${hours % 12}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${ampm}`
    return formattedDate
}



const formatearHtml=(html,data)=>{
    let text_html=html
    for(let key in data){
        let value=data[key]?data[key]:""
        let keyUpper=key.toUpperCase();
        text_html=text_html.replace(`{{${keyUpper}}}`,value)
    }

    return text_html
}


const unificarRegistros=(data)=>{
    console.log(data)
    const registros=[];

    for(let registro of data){
        // let repetido=false;
            const repetido= registros.findIndex(r=>r.cuenta==registro.cuenta)

        if(repetido==-1){
           
            let allPagos=[
                {servicio:registro.servicio,descripcion:registro.descripcion,total_pagado:registro.total_pagado}
            ] 
            registros.push({...registro,allPagos})
        }else{
            let pago={servicio:registro.servicio,descripcion:registro.descripcion,total_pagado:registro.total_pagado}
            registros[repetido].allPagos.push(pago)
        }

    }
    console.log(registros)
    
}


export default {
    generatePaquete,
    uploadFichas,
    getServicios,
    getPlazas,
    formatearFila,
    formatearHtml,
    unificarRegistros
}