

const initialState={
    id:null,
    plaza:"",
    servicio:'',
    fecha_corte:null,
    folio:null
}


const paqueteReducer=(state=initialState,action)=>{
    switch (action.type){
        case "SET_ID":
            return{
                ...state,
                id:action.payload
            }
        case "SET_PLAZA":
            return{
                ...state,
                plaza:action.payload
            }
        case "SET_SERVICIO":
            return{
                ...state,
                servicio:action.payload
            }
        case "SET_FECHA_CORTE":
            return{
                ...state,
                fecha_corte:action.payload
            }
        case "SET_FOLIO":
            return{
                ...state,
                folio:action.payload
            }
        default:
            return state
    }
}
export default paqueteReducer


export const setIdPaquete=(id)=>({
    type:"SET_ID",
    payload:id
})
export const setPlazaPaquete=(plaza)=>({
    type:"SET_PLAZA",
    payload:plaza
})
export const setServicioPaquete=(servicio)=>({
    type:"SET_SERVICIO",
    payload:servicio
})
export const setFechaCortePaquete=(fecha)=>({
    type:"SET_FECHA_CORTE",
    payload:fecha
})
export const setFolioPaquete=(folio)=>({
    type:"SET_FOLIO",
    payload:folio
})

