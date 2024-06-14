import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  process_id: 0,
  name: '',
  image: '',  
  place_id: 0,
  service_id: 0,  
}

export const processSlice = createSlice({
    name: 'process',
    initialState,
    reducers: {
        setUser : (state, action) => {
            const { process_id, name, image, place_id, service_id } = action.payload
            state.process_id = process_id
            state.name = name
            state.image = image            
            state.place_id = place_id
            state.service_id = service_id
        }
    }
})

export const { setProcess } = processSlice.actions
export default processSlice.reducer

export const logoutProcess = () => (dispatch) => {
    dispatch(setProcess(initialState))
}