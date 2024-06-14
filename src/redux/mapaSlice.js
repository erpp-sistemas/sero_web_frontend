import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mapa: null,
}

export const mapaSlice = createSlice({
    name: 'mapa',
    initialState,
    reducers: {
        setMapa : (state, action) => {
            state.mapa = action.payload
        }
    }
})

export const { setMapa } = mapaSlice.actions;
export default mapaSlice.reducer