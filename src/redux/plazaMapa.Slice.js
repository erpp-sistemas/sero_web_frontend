import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    place_id: 0,
    name: '',
    latitud: 0,
    longitud: 0
}

export const plazaMapaSlice = createSlice({
    name: 'plaza_mapa',
    initialState,
    reducers: {
        setPlazaMapa: (state, action) => {
            const { place_id, name, latitud, longitud } = action.payload
            state.place_id = place_id
            state.name = name
            state.latitud = latitud
            state.longitud = longitud
        }
    }
})

export const { setPlazaMapa } = plazaMapaSlice.actions;
export default plazaMapaSlice.reducer
