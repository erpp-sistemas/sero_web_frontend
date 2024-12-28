import instance from './axios';


export const getReportsTestRH = async (date_init, date_end) => {
    return instance.get(`/get-register-test-rh/${date_init}/${date_end}`)
        .then(response => {
            return response.data
        })
        .catch(error => {
            return error.response.data
        })
}


