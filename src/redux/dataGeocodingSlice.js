import { createSlice } from "@reduxjs/toolkit"

export const initialStateMemo={
    totalIngresos:0, 
    vistaPanel:0,  
    response:[],    
    cordendasComparacion:[], 
    porSubir:[],    
    cordenadas:[],  
    cordenadasRestantes:[], 
    cordenadasActDomicilio:[],
    cordenadasErrores:[], 
    cordenadasFormatoErrores:[],
    file:"",
}

export const dataGeocodingSlice = createSlice({
    name: 'apikeyGeocodingSlice',
    initialState:initialStateMemo,
    reducers: {
        Reset: (state) => {
            state.totalIngresos = 0
            state.vistaPanel = 0
            state.response = []
            state.cordendasComparacion= []
            state.porSubir = []
            state.cordenadas = []
            state.cordenadasRestantes = []
            state.cordenadasActDomicilio = []
            state.cordenadasErrores = []
            state.cordenadasFormatoErrores = []
            state.file = ''
        },
        setCordenadasRestantes: (state) => {state.cordenadasRestantes.splice(0, 1)},
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
        setReseteCordenadasErrores: (state) => {state.cordenadasErrores=[]},
        setResetCordenadasFormatoErrores: (state) => {state.cordenadasFormatoErrores=[]},
        resetCordenadasFormatoErrores: (state, action) => {state.cordenadasFormatoErrores=action.payload},
        setCordenadasFormatoErrores: (state, action) => {state.cordenadasFormatoErrores.push(action.payload)},
        setSumaTotalCordendas:(state,action)=>{state.totalIngresos+=action.payload},
        setVistaPanel: (state, action) => {state.vistaPanel=action.payload},
        setCordenadasDomicilio: (state, action) => {state.cordenadasActDomicilio=action.payload},

    }
  })

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
                    setSumaTotalCordendas,
                    setCordenadasDomicilio,
                    Reset
                 } = dataGeocodingSlice.actions
  export default dataGeocodingSlice.reducer
  