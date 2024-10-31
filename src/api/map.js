import axios from './axios'

export const serviceMapByIdPlaza = (place_id) => axios.get(`/ServiceMapByIdPlaza/${place_id}`);
export const layerMapByIdPlaza = (place_id) => axios.get(`/LayersMapByIdPlaza/${place_id}`);

export const uploadImageApi = async (formData) => {
    return axios.post('/upload-image-notification', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const sendNotificationApi = async ( data ) => axios.post('/send-push-notification', data);

export const saveNotificationBdApi = async ( data ) => axios.post('/insert-info-notification', data);