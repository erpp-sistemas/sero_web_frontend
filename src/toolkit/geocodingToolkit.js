import axios from "axios"

const getCordenadas = async (address,apikeySlice) => {
    const KEY = apikeySlice
    let url = `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${KEY}`
    try {
		const response = await axios.get(url);
		const cordenadas = response?.data?.items[0]?.position;
		return cordenadas
    } catch (error) {
		console.error(error)
    }
}

const dowloandData = (arrayData, BookTittle) => {

    const exportToCsv = function (data) {
		let filas = []

		const encabezados = Object.keys(data[0])
		filas.push(encabezados.join(','))
		data.forEach(objeto => {
			const fila = encabezados.map(encabezado => objeto[encabezado])
			filas.push(fila.join(','))
		})

		const cvs = filas.join("\r\n")
		return "data:text/csv;charset=utf-8," + encodeURIComponent(cvs)

    }

    function exportar() {
		const link = document.createElement("a")
		const today = new Date()
		const day = String(today.getDate()).padStart(2, '0')
		const month = String(today.getMonth() + 1).padStart(2, '0')
		const year = today.getFullYear()
		const hours = String(today.getHours()).padStart(2, '0')
		const minutes = String(today.getMinutes()).padStart(2, '0')

		const fecha = `${day}-${month}-${year} ${hours}-${minutes}`   
		link.setAttribute("download", `${BookTittle } ${fecha} .csv`)
		link.href = exportToCsv(arrayData)
		document.body.appendChild(link)
		link.click()
		link.remove()
    }

    exportar()

}

const validateFileFields=(arrayFile)=>{
    const arrayValidaciones=[
        {validacion:arrayFile?.length ,message:"Ingrese un Archivo CSV"  },
        {validacion:arrayFile[0]?.cuenta ,message:"Se nesecita un campo de cuenta en el archivo"  },
        {validacion:arrayFile[0]?.calle ,message:"Se nesecita un campo  de calle en el archivo"  },
        {validacion:arrayFile[0]?.numExt ,message:"Se nesecita un campo  de NumExt en el archivo"  },
        {validacion:arrayFile[0]?.colonia ,message:"Se nesecita un campo  de colonia en el archivo"  },
        {validacion:arrayFile[0]?.cp ,message:"Se nesecita un campo  de cp en el archivo"  },
        {validacion:arrayFile[0]?.municipio ,message:"Se nesecita un campo  de municipio en el archivo"  },
        {validacion:arrayFile[0]?.estado ,message:"Se nesecita un campo  de estado en el archivo"  }
    ]

    for(let v of arrayValidaciones ){

        if(!v.validacion){
            return  {message:v.message}
        }

    }

    return 200

  }

const validateCuenta=(cuenta)=>{

    const caracteresNoAdmitidos=[
      "#",",",";"
    ]
    const direccion=`${cuenta.calle} ${cuenta.numExt} ${cuenta.colonia} ${cuenta.cp} ${cuenta.municipio}`
    const arrayValidaciones=[
        {validacion:cuenta ,message:"Se nesecitan campos en la cuenta"  },
        {validacion:cuenta.cuenta ,message:"Se nesecita un campo de cuenta en la cuenta"  },
        {validacion:cuenta.calle ,message:"Se nesecita un campo  de calle en la cuenta"  },
        {validacion:cuenta.numExt ,message:"Se nesecita un campo  de NumExt en la cuenta"  },
        {validacion:cuenta.colonia ,message:"Se nesecita un campo  de colonia en la cuenta"  },
        {validacion:cuenta.cp ,message:"Se nesecita un campo  de cp en la cuenta"  },
        {validacion:cuenta.municipio ,message:"Se nesecita un campo  de municipio en la cuenta"},
        {validacion:cuenta.estado ,message:"Se nesecita un campo  de estado en la cuenta"},
    ]
    for(let v of arrayValidaciones ){
        if(!v.validacion){
             
            return  {message:v.message}
        }
        for(let caracter of caracteresNoAdmitidos){
          if(direccion.includes(caracter)){
            
            return  {message:`caracter " ${caracter} "no admitido`}
        }
        }
    }

    return {cuenta:cuenta.cuenta,direccion:`${cuenta.calle} ${cuenta.numExt} ${cuenta.colonia} ${cuenta.cp} ${cuenta.municipio}`}

}
  
const formatearData = (cuenta) => {

    const caracteresNoAdmitidos = /[#,;.]/g
  
    let cuentaFormateada = {
      cuenta: cuenta.cuenta,
      calle: cuenta.calle,
      numExt: cuenta.numExt,
      colonia: cuenta.colonia,
      cp: cuenta.cp,
      municipio: cuenta.municipio,
      estado: cuenta.estado
    }
  
    for (let key in cuentaFormateada) {
		// eslint-disable-next-line no-prototype-builtins
		if (cuentaFormateada.hasOwnProperty(key)) {
			let valor = cuentaFormateada[key]
			if (typeof valor === 'string') {
				cuentaFormateada[key] = valor.replace(caracteresNoAdmitidos, '')
			}
		}
    }
  
    return cuentaFormateada

}

export default {
	getCordenadas,
	dowloandData,
	validateFileFields,
	validateCuenta,
	formatearData
}
