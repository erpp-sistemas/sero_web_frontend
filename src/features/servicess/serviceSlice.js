import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  service_id: 0,
  name: '',
  image: '',
  place_id: 0,  
}

export const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        setUser : (state, action) => {
            const { service_id, name, image, place_id } = action.payload
            state.service_id = service_id
            state.name = name
            state.image = image            
            state.place_id = place_id
        }
    }
})

export const { setService } = serviceSlice.actions
export default serviceSlice.reducer

export const logoutService = () => (dispatch) => {
    dispatch(setService(initialState))
}