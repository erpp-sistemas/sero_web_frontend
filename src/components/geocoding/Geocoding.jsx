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
import { setCordenadas, setCordenadasErrores, setCordenadasRestantes, setFile, setPorSubir, setResponse, valueInitCordenadas } from '../../redux/dataGeocodingSlice';
 
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
  { id: 'total',label: 'Total',minWidth: 10,align: 'right'}
];

function createData(id, name, total) {
  return { id, name, total };
}



let bj = { bandera: false }; //! Variable que maneja el estado de la pausa

const Geocoding = () => {
    const [progreso, setProgreso] = useState(false);
    const [accionBtn,setAccionBtn]=useState(0)
    const [snackbar, setSnackbar] = useState(null);
    const dispatch=useDispatch()
    const apikeySlice=useSelector(a=>a.apikeyGeocoding)
    const dataGeocoding=useSelector(a=>a.dataGeocoding)
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
    const cordenadas = dataGeocoding?.cordenadas.length + dataGeocoding?.cordenadasErrores.length;
    const cuentas = dataGeocoding?.file?.total;
    const total = (cordenadas * 100) / cuentas;
    setProgreso(total);
  };
  //*Obtiene las cordenadas de la api
  const getCordenadas = async (address) => {
    console.log(">>>BUSCAMOS<<<");
    const KEY = apikeySlice;
    let url = `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${KEY}`;

    try {
      const response = await axios.get(url);
      const cordenadas = response?.data?.items[0]?.position;
      return cordenadas;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
    Pausa()
    dispatch(setFile(""))
    dispatch(setResponse([]))
    setAccionBtn(0)
  }
  //*Empieza la busqueda y genera errores de los resultados de busqueda
  const search = async () => {
    const newArray=dataGeocoding?.cordenadasRestantes
    if (!dataGeocoding?.cordenadasRestantes.length) {
        showSnackbar(
            {children: `"INGRESE UN ARCHIVO CSV"`,
            severity: "warning"}
         )
    }
    if (!dataGeocoding?.cordenadasRestantes[0].cuenta || !dataGeocoding?.cordenadasRestantes[0].direccion) {
    showSnackbar(
        {children: `"EL ARCHIVO QUE INGRESO NO TIENE ENCABEZADOS DE CUENTA O DIRECCIÓN`,
        severity: "warning"}
    )
    } else {
        setAccionBtn(1)
        showSnackbar(
            {children: `BUSCANDO`,
            severity: "success"}
    )
      for (let index = 0; newArray.length>=0 ; index++) {
        if (bj.bandera) {
          break;
        }
        const cuenta = dataGeocoding?.cordenadasRestantes[index];
       if(cuenta?.cuenta!=""){ 
        try {
            const cordenadas = await getCordenadas(cuenta.direccion);

            if (cordenadas?.lat) {
              dispatch(setCordenadas({
                cuenta: cuenta.cuenta,
                direccion: cuenta.direccion,
                latitud: `${cordenadas.lat}`,
                longitud: `${cordenadas.lng}`,
                plaza:5,
                usuario_id:user.user_id
              }));
              dispatch(setPorSubir({
                cuenta: cuenta.cuenta,
                direccion: cuenta.direccion,
                latitud: `${cordenadas.lat}`,
                longitud: `${cordenadas.lng}`,
                plaza:5,
                usuario_id:user.user_id
              }));
            }
            if (!cordenadas) {
              console.log(">>>NO SE ENCONTRO<<<");
              dispatch(setCordenadasErrores({
                cuenta: cuenta.cuenta,
                direccion: cuenta.direccion,
              }));
            }
          } catch (error) {
            console.log(">>>ERROR EN LA PETICION<<<");
            if (error?.response?.status == 429) {
              showSnackbar(
                {children: `SE ALCANZÓ EL LÍMITE DE PETICIONES CON ESTA APIKEY`,
                severity: "error"}
             )
              break;
            }
            if (error?.response?.status == 401) {
              showSnackbar(
                {children: `LA APIKEY INGRESADA NO ESTÁ AUTORIZADA`,
                severity: "error"}
             )
              break;
            }
            dispatch(setCordenadasErrores({
                cuenta: cuenta.cuenta,
                direccion: cuenta.direccion
              }));
          }
       }
        dispatch(setCordenadasRestantes())
        calcularProgreso();
      }
    }
  };
  //*Genera un reporte de excel de cada apartado de arreglos dinamicamente
  const dowloandData = (arrayData, BookTittle) => {
    showSnackbar(
        {children: `EMPEZANDO DESCARGA DE EXEL`,
        severity: "success"}
    )
    const exportToCsv = function (data) {
      console.log(">>> EMPEZAMOS DESCARGA <<<");
      let filas = [];
      for (let i = 0; i < data.length; i++) {
        filas.push(
          `${data[i].cuenta},${data[i].direccion},${
            data[i].latitud ? data[i].latitud : ""
          },${data[i].longitud ? data[i].longitud : ""}`
        );
      }
      const cvs = filas.join("\r\n");
      return "data:text/csv;charset=utf-8," + encodeURIComponent(cvs);
    };

    function exportar() {
      const link = document.createElement("a");
      link.setAttribute("download", `${BookTittle}.csv`);
      link.href = exportToCsv(arrayData);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    exportar();
  };

    const rows = [
        createData('1', 'TOTAL', dataGeocoding?.file?.total),
        createData('2', 'RESTANTES', dataGeocoding?.cordenadasRestantes.length),
        createData('3', 'ENCONTRADAS', dataGeocoding?.cordenadas.length),
        createData('4', 'ERRORES', dataGeocoding?.cordenadasErrores.length)
      ];
      
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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
        {text:"GENERAR CORDENADAS",accion:search,color:"#17212f"},
        {text:"PAUSAR BUSQUEDA",accion:Pausa,color:"#f44336"},
        {text:"REANUDAR BUSQUEDA",accion:search,color:"#0d6efd"}
      ]

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
               
                <Button variant="contained" color='success' startIcon={<InsertDriveFileIcon  />}>
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
            <Collapse in={dataGeocoding?.cordenadas.length} >
                <div>
                <Box sx={{ width: '100%' }}>
                    <LinearProgressWithLabel  
                     sx={{
                            '& .MuiLinearProgress-bar': {
                            backgroundColor: '#00ff00', // Cambia 'red' al color que desees
                            },
                        }}value={progreso}
                     />
                </Box>
                <StickyHeadTable />
                <Grid container justifyContent={"space-around"} marginTop={5}>
                    
                    {dataGeocoding?.cordenadasRestantes.length?<Button onClick={()=>dowloandData(dataGeocoding?.cordenadasRestantes,"RESTANTES")} variant='contained' sx={{backgroundColor:'#0d6efd'}} >Descargar Restantes</Button>:""}
                    {dataGeocoding?.cordenadas.length?<Button onClick={()=>dowloandData(dataGeocoding?.cordenadas,"CORDENADAS")} variant='contained'color='success' >Descargar Encontradas</Button>:""}
                    {dataGeocoding?.cordenadasErrores.length?<Button onClick={()=>dowloandData(dataGeocoding?.cordenadasErrores,"ERRORES")} variant='contained' color='error' >Descargar Errores</Button>:""}
                </Grid>
                </div>
            </Collapse>
            {/* <Button onClick={test}>test</Button> */}
            {!!snackbar && (
                <Snackbar open  autoHideDuration={10000}
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