import axios from 'axios';

import { Alert, Button, Collapse, Grid, Snackbar } from '@mui/material'
import React, { useState } from 'react'
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

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
  display:"flex",
  justifyContent:"center"
}));




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
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
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
    const [csvData, setCsvData] = useState([]); //! GUARDA LOS DATOS DEL CSV
    const [dataCordenas, setDataCordenas] = useState([]); //!GUARDA LAS DIRECCIONES QUE SI SE LOGRARON ENCONTRAR
    const [errorCordenadas, setErrorCordenadas] = useState([]); //! GUARDA LAS DIRECCIONES QUE NO SE ENCONTRARON
    const [progreso, setProgreso] = useState(false); //!GUARDA EL PROGRESO
    const [dataFile,setDataFile]=useState(false)
    const [accionBtn,setAccionBtn]=useState(0)
    const [snackbar, setSnackbar] = useState(null);
    const [toastad, setToastad] = useState(false);
    const dispatch=useDispatch()
    const apikeySlice=useSelector(a=>a.apikeyGeocoding)
    
  
    const resetApikey=()=>{
        dispatch(setApikeyGeocodingSlice(null))
      }
    const resetFile=()=>{
        setDataFile(false)
      }
      const showSnackbarError = (arrayOptiones) => {
        setSnackbar({
          
          ...arrayOptiones
        });
      };

    const InputFileUpload=()=> {
      
        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            Papa.parse(file, {
              complete: (result) => {
                let conteo = result.data.length - 1;
                setCsvData(result.data)
                showSnackbarError(
                        {children: `Archivo ${file.name} , cargado correctamente `,
                        severity: "success"}
                )
                setDataFile({name:file.name,total:conteo})
              },
              header: true,
            });
          };
    
    
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
          disabled={dataFile?.name}
         
        >
          Selecciona un archivo
          <VisuallyHiddenInput type="file" accept=".csv"  onChange={handleFileUpload}/>
        </Button>
      );
    }

 //*Calcula el rogreso de el total de cuentas buscadas
 const calcularProgreso = () => {
    const cordenadas = dataCordenas.length + errorCordenadas.length;
    const cuentas = dataFile?.total;
    const total = (cordenadas * 100) / cuentas;
    setProgreso(total);
    console.log(progreso)
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
  //*Elimina la cuenta del arreglo csv una vez esta ya se haya pasado a dataCordenadas o erroresCordendas
  const remeveCuenta = (index) => {
    csvData.splice(index, 1);
  };
  //*Pausa la busqueda del las direcciones
  const Pausa = () => {
    bj.bandera = !bj.bandera;
    if (!bj.bandera) {
      search();
    } else {
        setAccionBtn(2)
        showSnackbarError(
            {children: `"BUSQUEDA PAUSADA"`,
            severity: "warning"}
    )
    }
  };
  //*Empieza la usqueda y genera errores de los resultados de busqueda
  const search = async () => {
    const newArray=csvData
    if (!csvData.length) {
        showSnackbarError(
            {children: `"INGRESE UN ARCHIVO CSV"`,
            severity: "warning"}
    )
    }
    if (!csvData[0].cuenta || !csvData[0].direccion) {
    showSnackbarError(
        {children: `"EL ARCHIVO QUE INGRESO NO TIENE ENCABEZADOS DE CUENTA O DIRECCIÓN`,
        severity: "warning"}
)
    } else {
        setAccionBtn(1)
        console.log("alerta")
        showSnackbarError(
            {children: `BUSCANDO`,
            severity: "success"}
    )
      for (let index = 0; newArray.length>=0 ; index) {
        if (bj.bandera) {
          break;
        }
        const cuenta = csvData[index];
       if(cuenta.cuenta!=""){ 
        try {
            const cordenadas = await getCordenadas(cuenta.direccion);
  
            if (cordenadas?.lat) {
              dataCordenas.push({
                cuenta: cuenta.cuenta,
                direccion: cuenta.direccion,
                lat: cordenadas.lat,
                lng: cordenadas.lng,
              });
             
            }
            if (!cordenadas) {
              console.log(">>>NO SE ENCONTRO<<<");
              errorCordenadas.push({
                cuenta: cuenta.cuenta,
                direccion: cuenta.direccion,
              });
             
            }
          } catch (error) {
            
            console.log(">>>ERROR EN LA PETICION<<<");
            if (error.response.status == 429) {
              showSnackbarError(
                {children: `SE ALCANZÓ EL LÍMITE DE PETICIONES CON ESTA APIKEY`,
                severity: "error"}
        )
              break;
            }
            if (error.response.status == 401) {
              showSnackbarError(
                {children: `LA APIKEY INGRESADA NO ESTÁ AUTORIZADA`,
                severity: "error"}
        )
              break;
            }
            errorCordenadas.push({
              cuenta: cuenta.cuenta,
              direccion: cuenta.direccion,
            });
          }
       }
        remeveCuenta(index);
        calcularProgreso();
        
      }
    }
  };
  //*Genera un reporte de excel de cada apartado de arreglos dinamicamente
  const dowloandData = (arrayData, BookTittle) => {
    showSnackbarError(
        {children: `EMPEZANDO DESCARGA DE EXEL`,
        severity: "success"}
)
    const exportToCsv = function (data) {
      console.log(">>> EMPEZAMOS DESCARGA <<<");
      let filas = [];
      for (let i = 0; i < data.length; i++) {
        filas.push(
          `${data[i].cuenta},${data[i].direccion},${
            data[i].lat ? data[i].lat : ""
          },${data[i].lng ? data[i].lng : ""}`
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
        createData('1', 'TOTAL', dataFile?.total),
        createData('2', 'RESTANTES', csvData.length),
        createData('3', 'ENCONTRADAS', dataCordenas.length),
        createData('4', 'ERRORES', errorCordenadas.length)
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
      
      function test(){
        console.log(errorCordenadas)
        console.log(dataCordenas)
      }
      
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
                    !dataFile.name?<InputFileUpload/>:
                    <Button variant='contained' color='warning'  startIcon={<WarningIcon  />}onClick={resetFile} >
                            Cambiar archivo
                    </Button>
                }
               
                <Button variant="contained" color='success' startIcon={<InsertDriveFileIcon  />}>
                Plantilla
                </Button>

            </Grid>
            {dataFile&&
            <Div style={{display:"flex",justifyContent:"space-between"}}>
                <Box sx={{backgroundColor:"#00ff00", padding:"5px 20px",color:"black",borderRadius:"3px"}} >{dataFile?.name}</Box>
                <span>Total : {dataFile.total}</span> 
            </Div>}
            <hr/>
            <Button  variant="contained" style={{margin:"10px",backgroundColor:accionesBtn[accionBtn].color}} onClick={accionesBtn[accionBtn].accion} >
                {accionesBtn[accionBtn].text}
            </Button>
            <Collapse in={dataCordenas.length} >
                <div>
                <Box sx={{ width: '100%' }}>
                    <LinearProgressWithLabel value={38} />
                </Box>
                <StickyHeadTable />
                <Grid container justifyContent={"space-around"} marginTop={5}>
                    {/* <Button onClick={showSnackbarError}>test</Button> */}
                    {csvData.length?<Button onClick={()=>dowloandData(csvData,"RESTANTES")} variant='contained' sx={{backgroundColor:'#0d6efd'}} >Descargar Restantes</Button>:""}
                    {dataCordenas.length?<Button onClick={()=>dowloandData(dataCordenas,"CORDENADAS")} variant='contained'color='success' >Descargar Encontradas</Button>:""}
                    {errorCordenadas.length?<Button onClick={()=>dowloandData(errorCordenadas,"ERRORES")} variant='contained' color='error' >Descargar Errores</Button>:""}
                </Grid>
                </div>
            </Collapse>
            {!!snackbar && (
                <Snackbar open  autoHideDuration={10000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Cambia la posición de la alerta
                transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
                >
                <Alert {...snackbar} onClose={handleCloseSnackbar} sx={{backgroundColor:"rtx"}} />
                </Snackbar>
        )}
    </>
  )
}

export default Geocoding