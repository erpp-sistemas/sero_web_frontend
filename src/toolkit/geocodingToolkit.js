import axios from "axios";

 //*Obtiene las cordenadas de la api
  const getCordenadas = async (address,apikeySlice) => {
    console.log(">>>BUSCAMOS<<<");
    const KEY = apikeySlice;
    let url = `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${KEY}`;
    try {
      const response = await axios.get(url);
      const cordenadas = response?.data?.items[0]?.position;
      return cordenadas;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


//*Genera un reporte de excel de cada apartado de arreglos dinamicamente
  const dowloandData = (arrayData, BookTittle) => {
   console.log(arrayData)
    const exportToCsv = function (data) {

      console.log(">>> EMPEZAMOS DESCARGA <<<");
      let filas = [];
     //*Genera encabezados dinamicos
      const encabezados = Object.keys(data[0]);
      filas.push(encabezados.join(','));
      data.forEach(objeto => {
        //* va a recorrer cada encavezdo 
        const fila = encabezados.map(encabezado => objeto[encabezado]);
        filas.push(fila.join(','));
      });
      const cvs = filas.join("\r\n");
      return "data:text/csv;charset=utf-8," + encodeURIComponent(cvs);
    };

    function exportar() {
      const link = document.createElement("a");
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); 
      const year = today.getFullYear();
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes()).padStart(2, '0');

      const fecha = `${day}-${month}-${year} ${hours}-${minutes}`;      
      link.setAttribute("download", `${BookTittle } ${fecha} .csv`);
      link.href = exportToCsv(arrayData);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    exportar();
  };


  const validateFileFields=(arrayFile)=>{
    //*validaciones por objeto
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
            console.log(v.message)
            return  {message:v.message}
        }
    }

    return 200

  }
  const validateCuenta=(cuenta)=>{
    //*validaciones por objeto
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



  export default {
    getCordenadas,
    dowloandData,
    validateFileFields,
    validateCuenta
  }
