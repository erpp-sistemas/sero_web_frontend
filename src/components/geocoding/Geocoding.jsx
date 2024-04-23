import axios from 'axios';

import { Alert, Button, Collapse, Grid, Snackbar } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
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
import { Reset, setCordenadas, setCordenadasErrores, setCordenadasFormatoErrores, setCordenadasRestantes, setFile, setPorSubir, setResponse, setSumaTotalCordendas, setVistaPanel, valueInitCordenadas } from '../../redux/dataGeocodingSlice';

import tool from '../../toolkit/geocodingToolkit'

import CancelIcon from '@mui/icons-material/Cancel';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Tooltip from '@mui/material/Tooltip';
import { abandonarApikey, sumarConsultaApikey } from '../../api/geocoding';
import PlaceSelect from '../PlaceSelect';
import { setPlazaNumber } from '../../redux/plazaNumberSlice';
import ModalAviso from './ModalAviso';
import CustomAlert from '../CustomAlert';
import { message } from 'antd';



//*Genera un div con estilos en especifico para el documento
const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1),
  display: "flex",
  justifyContent: "center"
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





function createData(id, name, total, accion) {
  return { id, name, total, accion };
}


const StickyHeadTable = ({rows}) => {
  const columns = [
    { id: 'id', label: '#', minWidth: 5 },
    { id: 'name', label: 'Sección', minWidth: 100 },
    { id: 'total', label: 'Total', minWidth: 10, align: 'right' },
    { id: 'accion', label: '', minWidth: 10, align: 'center' }
  ];

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

let bj = { bandera: false }; //! Variable que maneja el estado de la pausa

const Geocoding = () => {
  const [accionBtn, setAccionBtn] = useState(0)
  const [snackbar, setSnackbar] = useState(null);
  const [Instanceplaza, setInstancePlaza] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [dataAlert,setDataAlert]=useState(false)


  const dispatch = useDispatch()
  const dataGeocoding = useSelector(a => a.dataGeocoding)
  const apikeySlice = useSelector(a => a.apikeyGeocoding)
  const user = useSelector(a => a.user)
  const plazaSlice = useSelector(p => p.plazaNumber)

  const [plaza, setPlaza] = useState(plazaSlice);
  
  //*Funcion que genera las alertas
  const showSnackbar = (arrayOptiones) => {
    setDataAlert({
      ...arrayOptiones
    });
  };
  //* Genera el array del scv 

  const handleFileUpload = (event) => {
    if (!plaza) {
      showSnackbar(
        {
          message: "Escoge una plaza de destino",
          type: "warning"
        })
    } else {
 
      const file = event.target.files[0];
      Papa.parse(file, {
        complete: (result) => {
          const validacionArray = tool.validateFileFields(result.data)
          if (validacionArray.message) {
            showSnackbar(
              {
                message: validacionArray.message,
                type: "warning"
              }
            )
          } else {
            let conteo = result.data.length - 1;
            showSnackbar(
              {
                message: `Archivo ${file.name} , cargado correctamente `,
                type: "success"
              }
            )
            let Instance = []
            result.data.forEach(c => {
              const formatoCuenta=tool.formatearData(c)
              if (c.cuenta) {
                
                Instance.push({ id: `${new Date().getMilliseconds()}${Math.floor(Math.random() * 400)}${c.cuenta}`, ...formatoCuenta })
              }
            });
            dispatch(valueInitCordenadas([...Instance, ...dataGeocoding.cordenadasRestantes]))
            dispatch(setSumaTotalCordendas(conteo))
            dispatch(setFile({ name: file.name, total: conteo }))
          }
        },
        header: true,
      });
    }
  };

  //*Calcula el progreso de el total de cuentas buscadas
  const calcularProgreso = () => {
    const cordenadas = dataGeocoding?.cordenadas.length + dataGeocoding?.cordenadasErrores.length + dataGeocoding?.cordenadasFormatoErrores.length;
    const cuentas = dataGeocoding?.totalIngresos;
    const total = (cordenadas * 100) / cuentas;
    return total
  };
  const progreso=useMemo(()=>{
    return calcularProgreso()
  },[dataGeocoding.cordenadasRestantes, dataGeocoding.totalIngresos])


  //*Pausa la busqueda del las direcciones
  const setPage = (page) => {
    dispatch(setVistaPanel(page))
  }

  const Pausa = () => {
    bj.bandera = !bj.bandera;
    if (!bj.bandera) {
      setAccionBtn(1)
      search();
    } else {
      setAccionBtn(2)
      showSnackbar(
        {
          message: `BUSQUEDA PAUSADA`,
          type: "warning"
        }
      )
    }
   
  };
 

  //*Resetea solo los datos del file sin laterar las datos que ya se tenian
  const resetFile = () => {
    if (!dataGeocoding.response.repidas) {
      if(dataGeocoding.cordenadas.length){
        bj.bandera=true
        setAccionBtn(2)
      }
      dispatch(setFile(""))
      dispatch(setResponse([]))
   
    } else {
      showSnackbar({ message: `ANTES DE CAMBIAR DE ARCHIVO DESCARTA LAS CORDENADAS REPETIDAS`, type: "warning" })
    }
  }

  //*Empieza la busqueda y genera errores de los resultados de busqueda
  const search = async () => {

    const newArray = dataGeocoding?.cordenadasRestantes
    if (newArray.length==0) {
      showSnackbar({ message: "Ingresa otro archivo para seguir buscando", type: "warning" });
      return "break"
    }
    
    setAccionBtn(1)
    showSnackbar({ message: `BUSCANDO`, type: "success" })

    for (let index = 0; newArray.length >= index; index++) {
      if (bj.bandera) { console.log("breakeado"), setAccionBtn(2); break; }
      const cuenta = dataGeocoding?.cordenadasRestantes[index];
      const validarCuenta = cuenta ? tool.validateCuenta(cuenta) : false

      if (!validarCuenta.message && validarCuenta?.direccion) {

        try {
          const cordenadas = await tool.getCordenadas(validarCuenta.direccion, apikeySlice);

          if (cordenadas?.lat) {
            let cor = {
              ...cuenta,
              latitud: `${cordenadas.lat}`,
              longitud: `${cordenadas.lng}`,
              plaza: plaza,
              usuario_id: user.user_id
            }
            dispatch(setCordenadas(cor));
            dispatch(setPorSubir(cor));
            //!aqui validamos si alguien mas uso la apikey o sumamos peticiones
          } else {
            // console.log(">>>NO SE ENCONTRO<<<");
            dispatch(setCordenadasErrores(cuenta));
          }
          try { await sumarConsultaApikey(apikeySlice, user.user_id) }
          catch (error) { Pausa(); dispatch(setApikeyGeocodingSlice(null)) }
        } catch (error) {
          // console.log(">>>ERROR EN LA PETICION<<<");
          if (error?.response?.status == 429) {
            Pausa()
            showSnackbar(
              {
                message: `SE ALCANZÓ EL LÍMITE DE PETICIONES CON ESTA APIKEY O INTENTE DE NUEVO`,
                type: "error"
              }
            )
            break
          }
          if (error?.response?.status == 401) {
            Pausa()
            showSnackbar({ message: `LA APIKEY INGRESADA NO ESTÁ AUTORIZADA O INTENTE DE NUEVO`, type: "error" })
            break
          }
          dispatch(setCordenadasErrores(cuenta));
        }
      } else {
        cuenta && cuenta.cuenta !== "" && dispatch(setCordenadasFormatoErrores(cuenta))
      }
      dispatch(setCordenadasRestantes())
      
    }

     if(!bj.bandera){
      showSnackbar(
        {
          message: `Termino la busqueda de este archivo `,
          type: "info"
        }
      )
      setAccionBtn(0)
     }
    
  };


  

  const arrayDataTable = [
    { num: 1, name: "TOTAL", dbLength: dataGeocoding?.file?.total },
    { num: 2, name: "RESTANTES", dbLength: dataGeocoding?.cordenadasRestantes.length },
    { num: 3, name: "ENCONTRADAS", dbLength: dataGeocoding?.cordenadas.length },
    { num: 4, name: "ERRORES", dbLength: dataGeocoding?.cordenadasErrores.length },
    { num: 5, name: "DIRECCIONES INCOMPLETAS", dbLength: dataGeocoding?.cordenadasFormatoErrores.length },
  ]

  const rows = arrayDataTable.map(t => (
    createData(
      t.num,
      t.name,
      t.dbLength,
      t.dbLength !== 0 && t.num !== 1 ?
        <Tooltip placement="top-start" title="Ver informes">
          <Button onClick={() => {  setPage(t.num - 1)}} variant='contained' color='secondary' >
            <RemoveRedEyeIcon />
          </Button>
         </Tooltip> 
        : ""
    )
  ))

  const accionesBtn = [
    { text: "GENERAR CORDENADAS", accion: search, color: "#17212f" },
    { text: "PAUSAR BUSQUEDA", accion: Pausa, color: "#f44336" },
    { text: "REANUDAR BUSQUEDA", accion: Pausa, color: "#0d6efd" }
  ]
  const formatoPlantilla = [
    {
      cuenta: 'SRMRAN00032715M700 (EJEMPLO)',
      calle: 'SANTA MARIA (EJEMPLO)',
      numExt: '29 (EJEMPLO)',
      colonia: 'TOTOLTEPEC (EJEMPLO)',
      cp: 'cp 50245 (EJEMPLO)',
      municipio: 'TOLUCA (EJEMPLO)',
    }]

  const handleCloseSnackbar = () => setSnackbar(null);

  const changeApikey = () => {
    abandonarApikey(apikeySlice)
      .then(dispatch(setApikeyGeocodingSlice(null)))
  }

  const handlePlaceChange = (event) => {
    if (plaza) {
     if(!bj.bandera&&dataGeocoding.porSubir[0]){ Pausa()}
      setInstancePlaza(event.target.value)
      setOpenModal(true)
    } else {
      setPlaza(event.target.value)
      dispatch(setPlazaNumber(event.target.value))
    }
  }
  const changePlaza = () => {
    dispatch(Reset())
    setAccionBtn(0)
    setPlaza(Instanceplaza)
    dispatch(setPlazaNumber(Instanceplaza))
    setOpenModal(false)
  }

  

  return (
    <>
      <CustomAlert alertOpen={dataAlert} type={dataAlert.type} message={dataAlert.message} onClose={()=>setDataAlert(false)} />
      <ModalAviso open={openModal} setOpen={setOpenModal} plaza={changePlaza} />
      <Box marginBottom={"20px"}>
        <PlaceSelect selectedPlace={plaza} handlePlaceChange={handlePlaceChange} />
      </Box>

      <Grid container justifyContent={"space-between"}  >
        {
          !dataGeocoding?.file.name ?
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
          disabled={plaza==null||dataGeocoding?.file?.name}
  
        >
          Selecciona un archivo 
          <input id='fileInput' type="file" accept='.csv' onInput={handleFileUpload} style={{opacity:"0",display:"none"}} />
       
        </Button>
           :
            <Button variant='contained' color='warning' startIcon={<WarningIcon />} onClick={resetFile} >
              Cambiar archivo
            </Button>
        }

        <Box>
          <Button variant="contained" color='success' onClick={() => tool.dowloandData(formatoPlantilla, "PLANTILLA")} startIcon={<InsertDriveFileIcon />}>
            Plantilla
          </Button>
          <Button variant="contained" color='error' onClick={changeApikey} startIcon={<CancelIcon />}>
            CAMBIAR APIKEY
          </Button>
        </Box>

      </Grid>
      {dataGeocoding?.file?.name &&
        <Div style={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ backgroundColor: "#00ff00", padding: "5px 20px", color: "black", borderRadius: "3px" }} >{dataGeocoding?.file?.name}</Box>
          <span>Total : {dataGeocoding?.file.total}</span>
        </Div>}
      <hr />
     {
      plaza&&
      <Button variant="contained" style={{ margin: "10px", backgroundColor: accionesBtn[accionBtn].color }} onClick={accionesBtn[accionBtn].accion} >
        {accionesBtn[accionBtn].text}
      </Button>
     }
      <Collapse in={dataGeocoding?.cordenadas.length || dataGeocoding?.cordenadasErrores.length} >
        <div>
          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel
              sx={{
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00ff00',
                },
              }} value={progreso}
            />
          </Box>
          <StickyHeadTable rows={rows}  />
        </div>
      </Collapse>
      {!!snackbar && (
        <Snackbar open
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} sx={{ backgroundColor: "rtx" }} />
        </Snackbar>
      )}
    </>
  )
}

export default Geocoding