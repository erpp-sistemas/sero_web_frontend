import React from 'react'
import { useForm } from 'react-hook-form';

import {Box, Button,TextField } from '@mui/material'

import { dispatch } from '../../redux/store';
import { useSelector } from 'react-redux'
import { resetCordenadasErrores, resetCordenadasFormatoErrores, valueInitCordenadas } from '../../redux/dataGeocodingSlice';
    

const EditModal = ({cuenta,close,setSeleccionadas,seleccionadas}) => {
	
    const panel=useSelector(p=>p.dataGeocoding.vistaPanel)
    const dtt=useSelector(p=>p.dataGeocoding)
 
    const {handleSubmit,register}=useForm()
    const panelActions ={
            "1":{save:((data)=>dispatch(valueInitCordenadas(data)))},
            "3":{save:((data)=>dispatch(resetCordenadasErrores(data)))},
            "4":{save:((data)=>{dispatch(resetCordenadasFormatoErrores(data))})}
        }
    

    const saved=(data)=>{
        //! AQUI VVV actualiza los datos en el Slice 
        const dataInstance=[...cuenta.data]
        const unificado={...cuenta,...data}
            delete unificado.data
        dataInstance.splice(cuenta.index,1,unificado )
        panelActions[panel].save(dataInstance)
        // //! Aqui VVVVV es para cuando exista en la seleccion, actualice los datos igual
        const dataInstanceSelecciondas=[...seleccionadas]
        let repetida = dataInstanceSelecciondas.findIndex(c => c.id == cuenta?.id)
        if (repetida !== -1) {
            dataInstanceSelecciondas.splice(cuenta.index,1, unificado)
            setSeleccionadas(dataInstanceSelecciondas)
        } 
        
        close(false)
    }
  
  return (
    <Box className={`BoxCustomModal `}  >
    <Box className="collapseF" >
       
      <Box className="showFomr" sx={{display:"inline-block",margin:"auto",width:"100%",background:""}} >
      <div style={{display:'flex'}}>
      <Button sx={{margin:"0 0 0 auto"}} variant='contained' color='error' onClick={()=>close(false)}>close</Button>
      </div >
        <Box sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.paper,padding:"10px",borderRadius:"20px"}}>
         <form onSubmit={handleSubmit(saved)} >
         <TextField
          className='customInputs'
          required
          id="outlined-required"
          label="Cuenta"
          defaultValue={cuenta?.cuenta}
          {...register("cuenta")}
        /> 
          <TextField
           className='customInputs'
          required
          id="outlined-required"
          label="Calle"
          defaultValue={cuenta?.calle}
          {...register("calle")}
        /> 
          <TextField
           className='customInputs'
          required
          id="outlined-required"
          label="Num Ext"
          defaultValue={cuenta?.numExt}
          {...register("numExt")}
        /> 
          <TextField
           className='customInputs'
          required
          id="outlined-required"
          label="Colonia"
          defaultValue={cuenta?.colonia}
          {...register("colonia")}
        /> 
          <TextField
           className='customInputs'
          required
          id="outlined-required"
          label="C.P."
          defaultValue={cuenta?.cp}
          {...register("cp")}
        /> 
          <TextField
           className='customInputs'
          required
          id="outlined-required"
          label="Municipio"
          defaultValue={cuenta?.municipio}
          {...register("municipio")}
        /> 
          <TextField
           className='customInputs'
          required
          id="outlined-required"
          label="Estado"
          defaultValue={cuenta?.estado}
          {...register("estado")}
        /> 
        <Button  className='customInputs' variant='contained' color='success' type='submit'>
            Guardar
        </Button>
         </form>
          </Box>
      </Box>
    </Box>
  </Box>
  )
}

export default EditModal