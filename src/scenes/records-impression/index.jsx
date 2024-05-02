import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, useTheme } from '@mui/material'

import RangeSlider from '../../components/Impresiones/RangeSlider'

import toolApi from '../../api/impresion'
import tool from '../../toolkit/toolkitFicha'

import { tokens } from '../../theme'
import VentanaPreview from '../../components/Impresiones/VentanaPreview';

 function DataTable({rows}) {
    const columns = [
        { field: 'id', headerName: '#', width: 70 },
        { field: 'campo', headerName: 'Campo', width: 200 },
        { field: 'data', headerName: 'Data', width: 200 },
      ]
  return (
    <div style={{height:'100%', width:'100%'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}


const index = () => {
    const [fichaPreview,setFichaPreview]=useState(false)
    const [paquete,setPaquete]=useState({})
    const [plantilla,setPlantilla]=useState({})
    const [registros,setRegistros]=useState([])

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const rows = [
        { id: 1, campo: 'id', data: paquete.id||"PAQUETE INEXISTENTE" },
        { id: 2, campo: 'Folio', data: paquete.folio },
        { id: 3, campo: 'Fecha Corte', data: paquete.fecha_corte },
        { id: 4, campo: 'Total Registros', data: registros.length }
    ];

    const reducerPaquete=useSelector(p=>p.paquete)
    
    const getDataPaquete=async(e)=>{
        setRegistros([])
        setFichaPreview(false)
        const id=2
         const paquete= await toolApi.getPaquete(2)
            if(paquete){setPaquete(paquete)}else{setPaquete({})}

        setTimeout(async() => {

            if(paquete){
                const plantilla=await toolApi.getPlantilla(paquete.plaza,paquete.servicio)
                const registros=await toolApi.getRegistros(id)
                tool.unificarRegistros(registros)
                setRegistros(registros)
                setPlantilla(plantilla)

             }else{setRegistros([])}

        }, 1000);        
   }
   

    const preview=async(e)=>{
        const ficha=e.target.value
           setFichaPreview(ficha)
   }
  
    useEffect(()=>{
        getDataPaquete()
        if(reducerPaquete?.id){
            setPaquete(reducerPaquete)
        }
    },[])

   

    return (

        <Box padding={'40px'} minHeight='100vh' display={'flex'} justifyContent={'start'} flexDirection={'column'}>

           <Typography  textAlign={"start"} fontSize={'2rem'}>Impresión</Typography>
            {paquete.folio}
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    
                    <Box sx={{backgroundColor:colors.primary[400],padding:"20px"}}>
                        
                        <TextField id="outlined-basic" label="PAQUETE" variant="outlined" onInput={getDataPaquete}   />

                        <RangeSlider total={registros?.length} />

                        <Typography  color={'#0f0'} fontSize={'1rem'} mb={"20px"} mt={"20"} >Ficha Preview</Typography>
        
                        <Box sx={{backgroundColor:"#47658e",padding:"10px 20px"}} display={"flex"} justifyContent={"space-between"} >

                            <FormControl sx={{width:"40%"}}  className='inputCustom' disabled={!registros.length&&true}>

                                <InputLabel id="demo-simple-select-label" color='primary' sx={{color:"#fff"}} >FICHA</InputLabel>

                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={fichaPreview}
                                    label="FICHA"
                                    onChange={preview}
                                    sx={{ color: '#ffffff', '& .MuiSelect-select': { borderColor: '#ffffff', }, '& .MuiSvgIcon-root': { color: '#ffffff', }, }}
                                >
                                    {
                                        registros.map((r)=>(
                                            <MenuItem key={r.id} value={r}  >{`${r.id}_${r.folio} `}</MenuItem>
                                        ))
                                    }

                                </Select>

                            </FormControl>

                                <VentanaPreview ficha={fichaPreview} plantilla={plantilla} />


                        </Box>

                        <Button variant='contained' color='success'  sx={{marginTop:"30px"}} fullWidth onClick={preview}> GENERAR FICHAS PDF</Button>

                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box sx={{height:"100%"}} fullWidth >
                        <DataTable rows={rows}/>
                    </Box>
                </Grid>

            </Grid>

        </Box>

    )

}

export default index

