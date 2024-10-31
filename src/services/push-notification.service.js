import { sendNotificationApi, uploadImageApi, saveNotificationBdApi } from '../api/map'

export const uploadImageNotificationService = async (formData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await uploadImageApi(formData);
            resolve(res.data);
        } catch (error) {
            console.error(error);
            reject(error)
        }
    })
}


export const sendNotificationService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await sendNotificationApi(data);
            resolve(res);
        } catch (error) {
            console.error(error);
            reject(error)
        }
    })
}

export const saveNotificationBdService = async ( data ) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await saveNotificationBdApi(data);
            resolve(res);
        } catch (error) {
            console.error(error);
            reject(error)
        }
    })
}