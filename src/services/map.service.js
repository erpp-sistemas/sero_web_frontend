import { serviceMapByIdPlaza, layerMapByIdPlaza } from '../api/map'

export const getServicesMapByIdPlaza = async (place_id) => {
    try {
        const res = await serviceMapByIdPlaza(place_id)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const getLayersMapByIdPlaza = async (place_id) => {
    try {
        const res = await layerMapByIdPlaza(place_id)
        return res.data
    } catch (error) {
        console.error(error)
    }
}


