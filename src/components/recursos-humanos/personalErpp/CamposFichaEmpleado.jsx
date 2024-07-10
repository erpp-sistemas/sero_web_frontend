import { Button, Chip, Divider, Grid, TextField } from '@mui/material'
import React, {  useState } from 'react'
import DatePickerHook from '../DatePickerHook'
import { updateEmpleado } from '../../../api/personalErpp';
import { useForm } from 'react-hook-form';
import ModalFichaEmpleado from '../ModalFichaEmpleado';



const CamposFichaEmpleado = ({empleado,setAlert}) => {
    const [openModal,setOpenModal]=useState(false)
    const [instanceDataEmpleado,setInstanceDataEmpleado]=useState(false)
    

    const { handleSubmit, setValue,register } = useForm();

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
            console.log(res)
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
   };


   

  return (
    <form onSubmit={handleSubmit(submitData)}>
        <ModalFichaEmpleado close={setOpenModal} open={openModal} title={"Estas Seguro de actulizar este perfil"} action={editEmpleado}/>

               <Divider>
                  <Chip label="DATOS PERSONALES" size="small" color="secondary" />
               </Divider>

               <Grid container spacing={2} alignItems={"end"}>
                  <Grid item xs={6}>
                     <DatePickerHook fecha={empleado?.fecha_nacimiento} setFecha={(fecha) => setValue("fecha_nacimiento",fecha)} label={"Fecha Cumpleaños"} />
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
                     <TextField sx={{ width: "100%", margin: "10px 0" }} label="TELÉFEONO" defaultValue={empleado?.info_empleado?.telefono}{...register("telefono")} />
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
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} label="CARGO" defaultValue={empleado?.info_empleado?.cargo} {...register("cargo")}/>
                  </Grid>
                  <Grid item xs={6}>
                     <TextField sx={{ width: "100%", margin: "10px 0" }} label="PLAZA" defaultValue={empleado?.info_empleado?.plaza} {...register("plaza")}/>
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