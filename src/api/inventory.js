import instance from './axios'
 
export const getAllInventory = async () => {

    try {
        const response = await instance.get('/inventory/AllInventory')
        return response.data
    } catch (error) {
        console.error("Error al obtener todos los articulos:", error.response?.data || error.message)
        throw error.response?.data || error
    }

}

export const getAllInventoryCategory = async () => {

    try {
        const response = await instance.get('/inventory/AllInventoryCategory')
        return response.data
    } catch (error) {
        console.error("Error al obtener todas las categorias:", error.response?.data || error.message)
        throw error.response?.data || error
    }

}

export const getAllInventorySubcategory = async () => {

    try {
        const response = await instance.get('/inventory/AllInventorySubcategory')
        return response.data
    } catch (error) {
        console.error("Error al obtener todas las sub categorias:", error.response?.data || error.message)
        throw error.response?.data || error
    }

}

export const getAllInventoryFieldsCategorySubcategory = async () => {

    try {
        const response = await instance.get('/inventory/AllInventoryFieldsCategorySubcategory')
        return response.data
    } catch (error) {
        console.error("Error al obtener todos los campos de los articulos :", error.response?.data || error.message)
        throw error.response?.data || error
    }

}