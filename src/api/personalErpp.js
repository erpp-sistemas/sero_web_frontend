import instance from './axios'

export const getAllEmpleados=()=>instance.get('/personal')
export const getEmpleadoById=(id)=>instance.get('/empleado/'+id)

