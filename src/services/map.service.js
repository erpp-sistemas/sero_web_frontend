import {
    serviceMapByIdPlaza, layerMapByIdPlaza, updateLayerData,
    sendDataProjectWorkspace, getProjectsByUser, sendDataProjectShareWorkspace
} from '../api/map'

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

export const updateLayerDataByPlazaService = async (data) => {
    try {
        const res = await updateLayerData(data);
        return res.data;
    } catch (error) {
        console.error(error)
    }
}

export const sendDataProject = async (data) => {
    try {
        if (data.polygons) {
            data.polygons = data.polygons.map(polygon => {
                const { marker, points, ...rest } = polygon;
                return rest;
            });
        }
        const res = await sendDataProjectWorkspace(data);
        return res.data;
    } catch (error) {
        console.error('Error al enviar los datos del proyecto:', error);
        throw error;
    }
}

export const sendDataProjectShare = async (data) => {
    try {
        const res = await sendDataProjectShareWorkspace(data);
        return res.data;
    } catch (error) {
        console.error('Error al enviar los datos del proyecto para compartir:', error);
        throw error;
    }
}

export const getProjectsByUserId = async (userId) => {
    try {
        const res = await getProjectsByUser(userId);
        return res.data;
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        throw error;
    }
}


