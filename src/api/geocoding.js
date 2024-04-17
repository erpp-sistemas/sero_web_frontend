
import instance from './axios';




export const subirCordenadas = async (data) => {
    try {
        const response = await instance.post('/geocode/5', data);
        return response.data.data;
    } catch (error) {
        return error;
    }
};
export const actualizar = async (data) => {
    try {
        const response = await instance.put('/geocode/5', data);
        return response;
    } catch (error) {
        // console.log(error);
        return error;
    }
};

export const obtener = async (data) => {
    try {
        const response = await instance.post('/geocode/masive/5', data);
        return response;
    } catch (error) {
        // console.log(error);
        return error;
    }
};

export const getAllKeys=async()=>{
    try {
        const response = await instance.get(`/geocode/apikeys/`);
        // console.log(response)
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const apartarKey=async(key,user)=>{ 
   
    try {
        const response = await instance.post(`/geocode/apikeys/${user}`,{key:key});
        // console.log(response)
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}
export const abandonarApikey=async(key)=>{ 
   
    try {
        const response = await instance.post(`/geocode/apikeys/abandonar/`,{key:key});
        // console.log(response)
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}
export const sumarConsultaApikey=async(key,user)=>{ 
   
    try {
        const response = await instance.post(`/geocode/apikeys/sumar/${user}`,{key:key});
        // console.log(response)
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}
