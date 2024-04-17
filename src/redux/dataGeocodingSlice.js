import { createSlice } from "@reduxjs/toolkit";

const initialState={
    totalIngresos:0, //* almacena el monto total de las cuentas ingresadas y tener un porcentaje certero
    vistaPanel:0,   //*Controla la vista que tendra el panel 
    response:[],    //* se almacena las respuestas que hubo al subir las cordendas
    cordendasComparacion:[], //* almacena las cordendas que se vana comparar en el mapa
    porSubir:[],    //*almacena las que faltan por subir a la DB
    cordenadas:[],  //* almacena las cordendas encontrdas 
    cordenadasRestantes:[], //*Almacena las cordendas restantes por buscar o ver que tipo de error hay
    cordenadasErrores:[],   //*Almacena las cordenadas que no se pudieron encontrar o hubo un error 
    cordenadasFormatoErrores:[],//*Almacena las cordendas que les hace falta un dato
    file:"",//* Almacena los datos del archivo ingresado
}

// Slice para 'dataGeocodingSlice'
export const dataGeocodingSlice = createSlice({
    name: 'apikeyGeocodingSlice',
    initialState,
    reducers: {
        setCordenadasRestantes: (state, action) => {state.cordenadasRestantes.splice(0, 1)},
        resetPorsubir:(state, action) =>{state.porSubir=action.payload},
        valueInitCordenadas: (state, action) => {state.cordenadasRestantes=action.payload},
        setCordendasComparacion: (state, action) => {state.cordendasComparacion=action.payload},
        setPushCordendasRestantes: (state, action) => {state.cordenadasRestantes.push(action.payload)},
        setResponse: (state, action) => {state.response=action.payload},
        setPorSubir: (state, action) => {state.porSubir.push(action.payload)},
        setFile: (state, action) => {state.file=action.payload},
        setCordenadas: (state, action) => {state.cordenadas.push(action.payload) },
        setCordenadasErrores: (state, action) => {state.cordenadasErrores.push(action.payload)},
        resetCordenadasErrores: (state, action) => {state.cordenadasErrores=action.payload},
        setReseteCordenadasErrores: (state, action) => {state.cordenadasErrores=[]},
        setResetCordenadasFormatoErrores: (state, action) => {state.cordenadasFormatoErrores=[]},
        resetCordenadasFormatoErrores: (state, action) => {state.cordenadasFormatoErrores=action.payload},
        setCordenadasFormatoErrores: (state, action) => {state.cordenadasFormatoErrores.push(action.payload)},
        setSumaTotalCordendas:(state,action)=>{state.totalIngresos+=action.payload},
        setVistaPanel: (state, action) => {state.vistaPanel=action.payload}
    }
  });
  
  // Exportar la acción y el reducer
  export const {    setCordenadasRestantes,
                    setCordenadas,
                    setCordenadasErrores,
                    valueInitCordenadas,
                    setFile,
                    resetCordenadasErrores,
                    setPorSubir,
                    resetPorsubir,
                    setResponse,
                    setCordendasComparacion,
                    setCordenadasFormatoErrores,
                    setVistaPanel,
                    setPushCordendasRestantes,
                    setResetCordenadasFormatoErrores,
                    setReseteCordenadasErrores,
                    resetCordenadasFormatoErrores,
                    setSumaTotalCordendas
                 } = dataGeocodingSlice.actions;
  export default dataGeocodingSlice.reducer;