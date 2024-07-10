import instance from './axios'

export const getAllEmpleados=()=>instance.get('/personal')
export const getEmpleadoById=(id)=>instance.get('/empleado/'+id)
export const updateEmpleado=(id,data)=>instance.put('/empleado/'+id,data)
export const getAllCategoriesWhitDocuments=(categoria,user)=>instance.get(`/categoria_archivos_empleados/${categoria}/${user}`)
export const generateKeyFile=(data)=>instance.post(`/key_archivo`,data)
export const uploandFileAws=(data,headers)=>instance.post(`/awsSend`,data,headers)





