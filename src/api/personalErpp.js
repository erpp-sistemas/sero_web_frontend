import instance from './axios'

export const getPlace=()=>instance.get('/places')
export const getCargos=()=>instance.get('/cargos')
export const getAreas=()=>instance.get('/areas')
export const getAllEmpleados=(data)=>instance.post('/personal',data)
export const getEmpleadoById=(id)=>instance.get('/empleado/'+id)
export const updateEmpleado=(id,data)=>instance.put('/empleado/'+id,data)
export const getAllCategoriesWhitDocuments=(categoria,user)=>instance.get(`/categoria_archivos_empleados/${categoria}/${user}`)
export const generateKeyFile=(data)=>instance.post(`/key_archivo`,data)
export const getKeyFiles=(categoria)=>instance.get(`/key_archivo/${categoria}`)
export const uploandFileAws=(data,headers)=>instance.post(`/awsSend`,data,headers)




