import axios from 'axios';

import { Alert, Button, Collapse, Grid, Snackbar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';


import WarningIcon from '@mui/icons-material/Warning';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import Papa from "papaparse";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { setApikeyGeocodingSlice } from '../../redux/apikeyGeocodingSlice';


import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { setCordenadas, setCordenadasErrores, setCordenadasFormatoErrores, setCordenadasRestantes, setFile, setPorSubir, setResponse, setVistaPanel, valueInitCordenadas } from '../../redux/dataGeocodingSlice';

import tool from '../../toolkit/geocodingToolkit'

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Tooltip from '@mui/material/Tooltip';
 


//*Genera un div con estilos en especifico para el documento
const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
  display:"flex",
  justifyContent:"center"
}));



//*Genera la linea de progreso
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  color:"red"
};



const columns = [
  { id: 'id', label: '#', minWidth: 5 },
  { id: 'name', label: 'Sección', minWidth: 100 },
  { id: 'total',label: 'Total',minWidth: 10,align: 'right'},
  { id: 'accion',label: '',minWidth: 10,align: 'center'}
];

function createData(id, name, total,accion) {
  return { id, name, total,accion };
}



let bj = { bandera: false }; //! Variable que maneja el estado de la pausa

const Geocoding = () => {
   
    const [progreso, setProgreso] = useState(0);
    const [accionBtn,setAccionBtn]=useState(0)
    const [snackbar, setSnackbar] = useState(null);

    const dataGeocoding=useSelector(a=>a.dataGeocoding)
    const dispatch=useDispatch()
    const apikeySlice=useSelector(a=>a.apikeyGeocoding)
    const user=useSelector(a=>a.user)
    
    const resetApikey=()=>{
        dispatch(setApikeyGeocodingSlice(null))
      }
      //*Funcion que genera las alertas
      const showSnackbar = (arrayOptiones) => {
        setSnackbar({ 
          ...arrayOptiones
        });
      };
    //* Genera el array del scv 
    const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
        complete: (result) => {
        let conteo = result.data.length - 1;
        showSnackbar(
                {children: `Archivo ${file.name} , cargado correctamente `,
                severity: "success"}
        )
        dispatch(valueInitCordenadas(result.data))
        dispatch(setFile({name:file.name,total:conteo}))
        },
        header: true,
    });
    };

    //*Genera el boton para insertar el file
const InputFileUpload=()=> {
    
    

    return (
    <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        color='secondary'
        sx={{
            '&.Mui-disabled': {
            backgroundColor: '#17212fdb',
            color: '#999',
            },
        }}
        disabled={dataGeocoding?.file?.name}
        
    >
        Selecciona un archivo
        <VisuallyHiddenInput type="file" accept=".csv"  onChange={handleFileUpload}/>
    </Button>
    );
}

 //*Calcula el rogreso de el total de cuentas buscadas
 const calcularProgreso = () => {
    const cordenadas = dataGeocoding?.cordenadas.length + dataGeocoding?.cordenadasErrores.length+dataGeocoding?.cordenadasFormatoErrores.length;
    const cuentas = dataGeocoding?.file?.total;
    const total = (cordenadas * 100) / cuentas;
    setProgreso(total);
  };


  //*Pausa la busqueda del las direcciones
  const Pausa = () => {
    bj.bandera = !bj.bandera;
    if (!bj.bandera) {
      search();
    } else {
        setAccionBtn(2)
        showSnackbar(
            {children: `"BUSQUEDA PAUSADA"`,
            severity: "warning"}
    )
    }
  };
 //*Resetea solo los datos del file sin laterar las datos que ya se tenian
  const resetFile=()=>{
    if(!dataGeocoding.response.totales){
      Pausa()
      dispatch(setFile(""))
      dispatch(setResponse([]))
      setAccionBtn(0)
      bj.bandera = false
    }else{
      showSnackbar( {children: `ANTES DE CAMBIAR DE ARCHIVO DESCARTA LAS CORDENADAS REPETIDAS`,severity: "warning"})
    }
  }

 //*Empieza la busqueda y genera errores de los resultados de busqueda
 const search = async () => {

  const newArray=dataGeocoding?.cordenadasRestantes
  const validacionArray=tool.validateFileFields(newArray)

  if (validacionArray.message) {
    showSnackbar(
        {children: validacionArray.message,
        severity: "warning"}
  )
  } else {
      setAccionBtn(1)
      showSnackbar({children: `BUSCANDO`, severity: "success"} )

    for (let index = 0; newArray.length>=index ; index++) {

      if (bj.bandera){ console.log("breakeado"); break; }

      const cuenta = dataGeocoding?.cordenadasRestantes[index];
      const validarCuenta=cuenta?tool.validateCuenta(cuenta):false

     if(!validarCuenta.message&&validarCuenta?.direccion){
      try {
          const cordenadas = await tool.getCordenadas(validarCuenta.direccion,apikeySlice);
          
          if (cordenadas?.lat) {
            let cor={
              ...cuenta,
              id:`${new Date().getMilliseconds()}${cordenadas.lat}`,
              latitud: `${cordenadas.lat}`,
              longitud: `${cordenadas.lng}`,
              plaza:5,
              usuario_id:user.user_id
            }
            dispatch(setCordenadas(cor));
            dispatch(setPorSubir(cor));
          }else{
            console.log(">>>NO SE ENCONTRO<<<");
            dispatch(setCordenadasErrores(cuenta ));
          }
        } catch (error) {
          console.log(">>>ERROR EN LA PETICION<<<");
          if (error?.response?.status == 429) {
            Pausa()
            showSnackbar(
              {children: `SE ALCANZÓ EL LÍMITE DE PETICIONES CON ESTA APIKEY O INTENTE DE NUEVO`,
              severity: "error"}
           )
          }
          if (error?.response?.status == 401) {
            Pausa()
            showSnackbar({children: `LA APIKEY INGRESADA NO ESTÁ AUTORIZADA`,severity: "error"})
          }
          dispatch(setCordenadasErrores(cuenta));
        }
     }else{
      cuenta&&cuenta.cuenta!==""&&dispatch(setCordenadasFormatoErrores(cuenta))
     }
      dispatch(setCordenadasRestantes())
      calcularProgreso();
    }
  }
  setAccionBtn(0)
};
 

const setPage=(page)=>{
  dispatch(setVistaPanel(page))
}

  const arrayDataTable=[
    {num:1,name:"TOTAL",dbLength:dataGeocoding?.file?.total},
    {num:2,name:"RESTANTES",dbLength:dataGeocoding?.cordenadasRestantes.length},
    {num:3,name:"ENCONTRADAS",dbLength:dataGeocoding?.cordenadas.length},
    {num:4,name:"ERRORES",dbLength:dataGeocoding?.cordenadasErrores.length},
    {num:5,name:"DIRECCIONES INCOMPLETAS",dbLength:dataGeocoding?.cordenadasFormatoErrores.length},
  ]

    const rows =arrayDataTable.map(t=>(
      createData(
        t.num,
        t.name,
        t.dbLength,
        t.dbLength!==0&&t.num!==1?
      <Tooltip placement="top-start" title="Ver informes">
        <Button onClick={()=>setPage(t.num -1)} variant='contained' color='secondary' >
          <RemoveRedEyeIcon/>
        </Button>
      </Tooltip>:""
      )
    ))
    
 
    const  StickyHeadTable=()=> {
    
    
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                {columns.map((column) => (
                    <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => {
                    return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.num}>
                        {columns.map((column) => {
                        const value = row[column.id];
                        return (
                            <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                        );
                        })}
                    </TableRow>
                    );
                })}
            </TableBody>
            </Table>
        </TableContainer>
        </Paper>
    );
    }

      
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 20,
      });
      
    //   function test(){
    //     console.log(dataGeocoding)
    //   }
      
      const accionesBtn=[
        {text:"GENERAR CORDENADAS",accion: search,color:"#17212f"},
        {text:"PAUSAR BUSQUEDA",accion:Pausa,color:"#f44336"},
        {text:"REANUDAR BUSQUEDA",accion: search,color:"#0d6efd"}
      ]
      const formatoPlantilla=[
        {
          cuenta: 'SRMRAN00032715M700 (EJEMPLO)',
          calle: 'SANTA MARIA (EJEMPLO)',
          numExt: '29 (EJEMPLO)',
          colonia: 'TOTOLTEPEC (EJEMPLO)',
          cp: 'cp 50245 (EJEMPLO)',
          municipio: 'TOLUCA (EJEMPLO)',
        }]

      const handleCloseSnackbar = () => setSnackbar(null);
  return (
    <>
       <Grid container  justifyContent={"space-between"}  >
                {
                    !dataGeocoding?.file.name?<InputFileUpload/>:
                    <Button variant='contained' color='warning'  startIcon={<WarningIcon  />}onClick={resetFile} >
                            Cambiar archivo
                    </Button>
                }
               
                <Button variant="contained" color='success' onClick={()=>tool.dowloandData(formatoPlantilla,"PLANTILLA")} startIcon={<InsertDriveFileIcon  />}>
                Plantilla
                </Button>

            </Grid>
            {dataGeocoding?.file?.name&&
            <Div style={{display:"flex",justifyContent:"space-between"}}>
                <Box sx={{backgroundColor:"#00ff00", padding:"5px 20px",color:"black",borderRadius:"3px"}} >{dataGeocoding?.file?.name}</Box>
                {dataGeocoding.file?.name&&dataGeocoding.cordenadasRestantes==0?
                <Box sx={{backgroundColor:"#0d6efd",color:"white",padding:"5px 20px",borderRadius:"3px"}} >Ya se finalizo la busqueda de este archivo</Box>:""}
                <span>Total : {dataGeocoding?.file.total}</span> 
            </Div>}
            <hr/>
            <Button  variant="contained" style={{margin:"10px",backgroundColor:accionesBtn[accionBtn].color}} onClick={accionesBtn[accionBtn].accion} >
                {accionesBtn[accionBtn].text}
            </Button>
            <Collapse in={dataGeocoding?.cordenadas.length||dataGeocoding?.cordenadasErrores.length} >
                <div>
                <Box sx={{ width: '100%' }}>
                    <LinearProgressWithLabel  
                     sx={{
                            '& .MuiLinearProgress-bar': {
                            backgroundColor: '#00ff00',
                            },
                        }}value={progreso}
                     />
                </Box>
                <StickyHeadTable />
                {/* <Grid container justifyContent={"space-around"} marginTop={5}>
                    {dataGeocoding?.cordenadasRestantes.length?<Button onClick={()=>tool.dowloandData(dataGeocoding?.cordenadasRestantes,"RESTANTES")} variant='contained' sx={{backgroundColor:'#0d6efd'}} >Descargar Restantes</Button>:""}
                    {dataGeocoding?.cordenadas.length?<Button onClick={()=>tool.dowloandData(dataGeocoding?.cordenadas,"CORDENADAS")} variant='contained'color='success' >Descargar Encontradas</Button>:""}
                    {dataGeocoding?.cordenadasErrores.length?<Button onClick={()=>tool.dowloandData(dataGeocoding?.cordenadasErrores,"ERRORES")} variant='contained' color='error' >Descargar Errores</Button>:""}
                    {dataGeocoding?.cordenadasFormatoErrores.length?<Button onClick={()=>tool.dowloandData(dataGeocoding?.cordenadasFormatoErrores,"ERRORES FORMATO")} variant='contained' color='warning' >Errores Formato</Button>:""}
                </Grid> */}
                </div>
            </Collapse>
            {/* <Button onClick={test}>test</Button> */}
            {!!snackbar && (
                <Snackbar open  autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
                transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
                >
                <Alert {...snackbar} onClose={handleCloseSnackbar} sx={{backgroundColor:"rtx"}} />
                </Snackbar>
        )}
    </>
  )
}

export default Geocoding