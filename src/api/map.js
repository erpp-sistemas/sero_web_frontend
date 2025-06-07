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

export const updateLayerData = (data) => axios.post('/update-layer-data', data);

export const sendDataProjectWorkspace = (data) => axios.post('/save-workspace', data);

export const sendDataProjectShareWorkspace = (data) => axios.post('/save-project-share', data);

export const getProjectsByUser = (userId) => axios.get(`/get-projects-by-user/${userId}`);
