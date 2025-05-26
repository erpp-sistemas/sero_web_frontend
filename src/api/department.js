import instance from './axios'
 
export const getAllDepartment = async () => {

    try {
        const response = await instance.get('/AllDepartment')
        return response.data
    } catch (error) {
        console.error("Error al obtener todos las areas:", error.response?.data || error.message)
        throw error.response?.data || error
    }

}