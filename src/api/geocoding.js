
import instance from './axios'

export const subirCordenadas = async (data,plaza) => {
   
    try {
        const response = await instance.post(`/geocode/${plaza}`, data)
        return response.data.data
    } catch (error) {
        return error
    }

}

export const actualizar = async (data,plaza) => {

    try {
        const response = await instance.put(`/geocode/${plaza}`, data)
        return response
    } catch (error) {
        return error
    }

}

export const obtener = async (data,plaza) => {

    try {
        const response = await instance.post(`/geocode/masive/${plaza}`, data)
        return response
    } catch (error) {
        return error
    }

}

export const getAllKeys=async()=>{

    try {
        const response = await instance.get(`/geocode/apikeys/`)
        return response
    } catch (error) {
		console.error(error)
    }

}

export const apartarKey=async(key,user)=>{ 
   
    try {
        const response = await instance.post(`/geocode/apikeys/${user}`,{key:key})
        return response
    } catch (error) {
        return error
    }

}

export const abandonarApikey=async(key)=>{ 
   
    try {
        const response = await instance.post(`/geocode/apikeys/abandonar/`,{key:key})
        return response
    } catch (error) {
        return error
    }

}

export const sumarConsultaApikey=async(key,user)=>{ 
   
    try {
        const response = await instance.post(`/geocode/apikeys/sumar/${user}`,{key:key})
        return response
    } catch (error) {
        return error
    }

}