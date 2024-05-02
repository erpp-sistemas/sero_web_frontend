import axios from "axios"
import instance from "../api/axios"



const getPaquete=async(paquete)=>{

    const url=`/records/paquete/${paquete}/`
   try{
    const res=await  instance.get(url)
    return res.data.data
   }catch{
    return false
   }
       
}
const getRegistros=async(paquete)=>{

    const url=`/records/registro/${paquete}/`
   try{
    const res=await  instance.get(url)
    return res.data.data
   }catch{
    return false
   }
}
const getPlantilla=async(plaza,servicio)=>{
    const url=`/records/plantilla/${plaza}/${servicio}`
   try{
    const res=await  instance.get(url)
    return res.data.plantilla
   }catch{
    return false
   }
}





export default {
    getPaquete,
    getRegistros,
    getPlantilla
}



