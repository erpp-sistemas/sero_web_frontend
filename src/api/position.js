import instance from './axios'
 
export const getAllPositions = async () => {

    try {
        const response = await instance.get('/AllPositions')
        return response.data
    } catch (error) {
        console.error("Error al obtener todos los puestos:", error.response?.data || error.message)
        throw error.response?.data || error
    }

}