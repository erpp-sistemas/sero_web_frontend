import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: null,
    features_layer: [],
    coordinates: {},
    layers_activos: [],
    draw: null,
    puntos_in_poligono: [],
    cargar_layer: null,
    polygonsCreated: [],
    editingPolygons: false,
    filtrosActivos: []
}

export const featuresSlice = createSlice({
    name: 'features',
    initialState,
    reducers: {
        setData: ( state, action ) => {
            state.data = action.payload;
        },
        setFeatures: (state, action) => {
            state.features_layer = action.payload
        },
        setCoordinates: (state, action) => {
            state.coordinates = action.payload
        },
        setLayersActivos: (state, action) => {
            state.layers_activos = action.payload
        },
        setDraw: (state, action) => {
            state.draw = action.payload
        },
        setPuntosInPoligono: (state, action) => {
            state.puntos_in_poligono = action.payload
        },
        setCargarLayer: (state, action) => {
            state.cargar_layer = action.payload
        },
        setPolygonsCreated: (state, action) => {
            state.polygonsCreated = action.payload
        },
        setEditingPolygons: (state, action) => {
            state.editingPolygons = action.payload
        },
        setFiltrosActivos: (state, action) => {
         state.filtrosActivos = action.payload   
        }
    }
})


export const { setData, setFeatures, setCoordinates, setLayersActivos, setDraw, setPuntosInPoligono, setCargarLayer, setPolygonsCreated, setEditingPolygons, setFiltrosActivos } = featuresSlice.actions
export default featuresSlice.reducer