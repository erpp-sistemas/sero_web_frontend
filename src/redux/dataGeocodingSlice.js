import { createSlice } from "@reduxjs/toolkit";

const initialState={
    response:[],
    porSubir:[],
    cordenadas:[],
    cordenadasRestantes:[],
    cordenadasErrores:[],
    file:"",
}

// Slice para 'dataGeocodingSlice'
export const dataGeocodingSlice = createSlice({
    name: 'apikeyGeocodingSlice',
    initialState,
    reducers: {
        setCordenadasRestantes: (state, action) => {state.cordenadasRestantes.splice(0, 1)},
        resetPorsubir:(state, action) =>{state.porSubir=[]},
        valueInitCordenadas: (state, action) => {state.cordenadasRestantes=action.payload},
        setResponse: (state, action) => {state.response=action.payload},
        setPorSubir: (state, action) => {state.porSubir.push(action.payload)},
        setFile: (state, action) => {state.file=action.payload},
        setCordenadas: (state, action) => {state.cordenadas.push(action.payload) },
        setCordenadasErrores: (state, action) => {state.cordenadasErrores.push(action.payload)}
    }
  });
  
  // Exportar la acción y el reducer
  export const {    setCordenadasRestantes,
                    setCordenadas,
                    setCordenadasErrores,
                    valueInitCordenadas,
                    setFile,
                    setPorSubir,
                    resetPorsubir,
                    setResponse
                 } = dataGeocodingSlice.actions;
  export default dataGeocodingSlice.reducer;