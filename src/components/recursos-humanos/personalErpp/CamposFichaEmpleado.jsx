import { Avatar, AvatarGroup, Button, Chip, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material'
import React, {  useEffect, useState } from 'react'
import DatePickerHook from '../DatePickerHook'
import { getAreas, getCargos, getPlace, updateEmpleado } from '../../../api/personalErpp';
import { useForm } from 'react-hook-form';
import ModalFichaEmpleado from '../ModalFichaEmpleado';
import SelectHook from '../SelectHook';
import { lightBlue } from '@mui/material/colors';


const CamposFichaEmpleado = ({empleado,setAlert}) => {
    const [openModal,setOpenModal]=useState(false)
    const [area, setArea] = useState([]);
    const [instanceDataEmpleado,setInstanceDataEmpleado]=useState(false)
    
    console.log(empleado) 

    const { handleSubmit, setValue,register } = useForm();

    const obtenerCargos=()=>{
      getCargos()
      .then((res) => {
         console.log(res.data)
         setArea(res.data);
      })
      .catch((err) => {
         console.log(err);
      });
   }

    const showSnackbar = (message,type) => {
        setAlert({
                message,
                type
        });
      };

    
    const editEmpleado=()=>{
        updateEmpleado(empleado.id_usuario,instanceDataEmpleado)
        .then(res=>{ 
           showSnackbar("Se actualizo la informacion correctamente Holaaaaaa","success")
        })
        .catch(res=>{
         console.log(res)
            showSnackbar("Hubo un error al Actualizar","error")
        })
        setOpenModal(false)
    }

   const submitData = (datEmpleado) => {
        setInstanceDataEmpleado(datEmpleado)
        setOpenModal(true)
         console.log(datEmpleado)
   };

   useEffect(() => {
      obtenerCargos()
   }, [])
   
   
  return (
    <form onSubmit={handleSubmit(submitData)}>
        <ModalFichaEmpleado close={setOpenModal} open={openModal} title={"Estas Seguro de actulizar este perfil"} action={editEmpleado}/>

               <Divider>
                  <Chip label="DATOS PERSONALES" size="small" color="secondary" />
               </Divider>

               <Grid container spacing={2} alignItems={"end"}>
                  <Grid item xs={6}>
                     <DatePickerHook disabled={true} fecha={empleado?.fecha_nacimiento} setFecha={(fecha) => setValue("fecha_nacimiento",fecha)} label={"Fecha Cumpleaños"} />
                  </Grid>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "0" }} inputProps={{maxLength: 11}} label="NSS" defaultValue={empleado?.info_empleado?.nss}  {...register("nss")} />
                  </Grid>
               </Grid>
               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} inputProps={{maxLength: 13}} label="RFC" defaultValue={empleado?.info_empleado?.rfc} {...register("rfc")}/>
                  </Grid>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} label="CURP" inputProps={{maxLength: 18}} defaultValue={empleado?.info_empleado?.curp} {...register("curp")} />
                  </Grid>
               </Grid>

               <Divider>
                  <Chip label="DATOS DE CONTACTO" size="small" color="secondary" />
               </Divider>

               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} label="TELÉFEONO" defaultValue={empleado?.telefono_personal}{...register("telefono")} disabled/>
                  </Grid>
                  <Grid item xs={6}>
                     <TextField  type="email" sx={{ width: "100%", margin: "10px 0" }} label="CORREO" defaultValue={empleado?.info_empleado?.correo} {...register("correo")} />
                  </Grid>
               </Grid>
               <TextField sx={{ width: "100%", margin: "10px 0" }} label="CONTACTO DE EMERGENCIA" defaultValue={empleado?.info_empleado?.contacto_de_emergencia}{...register("contacto_de_emergencia")} />

               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} label="CALLE" defaultValue={empleado?.info_empleado?.calle} {...register("calle")}/>
                  </Grid>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} inputProps={{maxLength: 5}} label="C.P." defaultValue={empleado?.info_empleado?.cp} {...register("cp")}/>
                  </Grid>
               </Grid>
               <Grid container spacing={3}>
                  <Grid item xs={3}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} inputProps={{maxLength: 10}} label="NO. INT" defaultValue={empleado?.info_empleado?.no_int} {...register("no_int")}/>
                  </Grid>
                  <Grid item xs={3}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} inputProps={{maxLength: 10}} label="NO. EXT" defaultValue={empleado?.info_empleado?.no_ext} {...register("no_ext")}/>
                  </Grid>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} label="COLONIA" defaultValue={empleado?.info_empleado?.colonia} {...register("colonia")}/>
                  </Grid>
               </Grid>
               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} label="ALCALDIA/MUNICIPIO" defaultValue={empleado?.info_empleado?.municipio_alcaldia} {...register("municipio_alcaldia")}/>
                  </Grid>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} label="ESTADO/CIUDAD" defaultValue={empleado?.info_empleado?.estado_ciudad} {...register("estado_ciudad")}/>
                  </Grid>
               </Grid>

               <Divider>
                  <Chip label="DATOS DE CONTRATACIÓN" size="small" color="secondary" />
               </Divider>

               <Grid container spacing={2}>
                  <Grid item xs={6} >
                     <SelectHook defaultValue={empleado?.rol} itemRender={"cargo"} items={area} labele={"CARGO"} register={register} disabled={true} />
                  </Grid>
                  <Grid item xs={6}>
                     <label htmlFor="PLAZA ASIGNADAS" style={{fontSize:"10px",color:"#ababab"}}>PLAZA ASIGNADAS</label>
                  <AvatarGroup max={10}>
                     {empleado?.plazas?.map((place) => (
                     <Tooltip key={place.id} title={place.place}>
                        <Avatar sx={{ bgcolor: lightBlue[500], width: 35, height: 35, fontWeight: 'bold' }}>
                        {place?.nombre
                           .split(' ')
                           .map(word => word[0])
                           .join('')
                           }
                        </Avatar>
                     </Tooltip>
                     ))}
                  </AvatarGroup>
                  </Grid>
               </Grid>
               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     <DatePickerHook fecha={empleado?.info_empleado?.fecha_de_ingreso} setFecha={(fecha) => setValue("fecha_de_ingreso",fecha)} label={"FECHA INGRESO"} />
                  </Grid>
                  <Grid item xs={6}>

                     <DatePickerHook fecha={empleado?.info_empleado?.alta_imss} setFecha={(fecha) => setValue("alta_imss",fecha)} label={"ALTA IMMS"} />
                  </Grid>
               </Grid>
               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     <DatePickerHook fecha={empleado?.info_empleado?.contrato_determinado_1} setFecha={(fecha) => setValue("contrato_determinado_1",fecha)} label={"C. DETERMINADO 1"} />
                  </Grid>
                  <Grid item xs={6}>
                     <DatePickerHook fecha={empleado?.info_empleado?.contrato_determinado_2} setFecha={(fecha) => setValue("contrato_determinado_2",fecha)} label={"C. DETERMINADO 2"} />
                  </Grid>
               </Grid>
               <Grid container spacing={2}>
                  <Grid item xs={6}>
                  <DatePickerHook fecha={empleado?.info_empleado?.contrato_determinado_3} setFecha={(fecha) => setValue("contrato_determinado_3",fecha)} label={"C. DETERMINADO 3"} />
                  </Grid>
                  <Grid item xs={6}>
                  <DatePickerHook fecha={empleado?.info_empleado?.contrato_indeterminado} setFecha={(fecha) => setValue("contrato_indeterminado",fecha)} label={"C. INDETERMINADO "} />
                  </Grid>
               </Grid>
               <Divider aria-hidden="true" />
               <Grid container>
                  <Button type="submit" variant="contained" size="large" color="success" sx={{ margin: "23px auto" }}>
                     Guardar Cambios
                  </Button>
               </Grid>

             
        </form>
  )
}

export default CamposFichaEmpleado