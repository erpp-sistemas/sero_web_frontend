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
