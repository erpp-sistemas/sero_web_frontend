
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { actualizar, obtener, subirCordenadas } from '../../api/geocoding';
import { dispatch } from '../../redux/store';
import { resetPorsubir, setCordendasComparacion, setPushCordendasRestantes, setResetCordenadasFormatoErrores, setReseteCordenadasErrores, setResponse, setVistaPanel } from '../../redux/dataGeocodingSlice';


import {
  Box, Stack, Button, Checkbox, Alert, AlertTitle, Tooltip
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid';

import Grow from '@mui/material/Grow';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

import PinDropIcon from '@mui/icons-material/PinDrop';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';


import tool from '../../toolkit/geocodingToolkit'
import './styles/style.css'
import EditModal from './EditModal';

const SubirCordenadasPanel = ({ setValue,value }) => {
  const [espera, setEspera] = useState(false)
  const [cordenadasRep, setCordenadasRep] = useState([])
  const [cuentasSeleccionadas, setCuentasSeleccionadas] = useState([])
  const [changePage, setChangePage] = useState(false)
  const [cordenadaEdit, setCordenadaEdit] = useState(false)



  const dataGeocoding = useSelector(s => s.dataGeocoding)
  const vistaPanel = dataGeocoding.vistaPanel;

  //*Manda las cordendas con errores al arreglo de Restantes para intentar la busqueda de nuevo
  const reBuscar = () => {
    if (cuentasSeleccionadas.length > 0) {
      setEspera(true)
      cuentasSeleccionadas.forEach(c => {
        dispatch(setPushCordendasRestantes(c))
      });

      vistaPanel == 4 ?
        dispatch(setResetCordenadasFormatoErrores()) :
        dispatch(setReseteCordenadasErrores())
      setCuentasSeleccionadas([])
      setEspera(false)
    }

  }
//* Busca las cordendas para identificar si existe en la base ya
  const getCordenadas = (data) => {
    setEspera(true)
    const cuentas = { cuentas: data }
    obtener(cuentas)
      .then(res => {
        if (res?.data?.encontradas && res?.data?.encontradas > 0) {
          setCordenadasRep(res.data.data)
        }
        setEspera(false)
      })
    setCuentasSeleccionadas(vistaPanel == 2 ? dataGeocoding.porSubir : panel.data)
  }
//*Manda ya todas cuentas seleccionadas a la dDB
  const mandarCordenadasDB = () => {
    setEspera(true)
    dispatch(setVistaPanel(0))
    const data = { cuentas: cuentasSeleccionadas }
    subirCordenadas(data)
      .then(res => {
        const Instance = [...dataGeocoding.porSubir]
        const InstanceSeleccion = [...cuentasSeleccionadas]

        InstanceSeleccion.forEach((c) => {

          const index = Instance.findIndex(I => I.id == c.id)
          if (index != -1) {
            Instance.splice(index, 1)
          }
        });
        dispatch(resetPorsubir(Instance))
        dispatch(setResponse(res))

      })

    setEspera(false)
  }

  //*En caso de tener cuentas repetidas se actualizan 
  const actualizarCordenadas = () => {
    setEspera(true)
    const data = { cuentas: cuentasSeleccionadas }
    actualizar(data)
      .then(res => {
        if (res.status == 200) {
          dispatch(setResponse(["TODO ACTUALIZADO"]))
        }
        setEspera(false)
      })
  }
  //* Es un array de las vistas y tablas donde su identificador es el index
  const arrayObjTable = [
    { data: dataGeocoding.response.repetidas ? dataGeocoding.response.repetidas : [], color: "warning", tittle: "REPETIDAS", textButton: "actualizar" },
    { data: dataGeocoding.cordenadasRestantes, color: "info", tittle: "RESTANTES", accionPanel: false, textButton: "false" },
    { data: dataGeocoding.cordenadas, color: "success", tittle: "ENCONTRADAS", accionPanel: mandarCordenadasDB, textButton: "REVISAR POR SUBIR" },
    { data: dataGeocoding.cordenadasErrores, color: "error", tittle: "ERRORES", accionPanel: reBuscar, textButton: "VOLVER A BUSCAR" },
    { data: dataGeocoding.cordenadasFormatoErrores, color: "error", tittle: "ERRORES FORMATO", accionPanel: reBuscar, textButton: "VOLVER A BUSCAR" },
    { data: dataGeocoding.porSubir, color: "info", tittle: "POR SUBIR", accionPanel: mandarCordenadasDB, textButton: "SUBIR CUENTAS" }
  ]
  const panel = arrayObjTable[vistaPanel]


  useEffect(() => {

    if (vistaPanel !== 0 || dataGeocoding?.response?.repetidas) {
      getCordenadas(panel.data)
    }
    setChangePage(true)
    setTimeout(() => {
      setChangePage(false)
    }, 200)
    setCordenadaEdit(false)
  }, [vistaPanel])


  useEffect(() => {
    if (dataGeocoding?.response?.repetidas) {
      getCordenadas(arrayObjTable[0].data)
    }
  }, [dataGeocoding?.response])


  //*mete y saca de cuentas selecciondas
  const chekCuenta = (index) => {
    let arrayTemp = [...cuentasSeleccionadas]
    let cuenta = panel.data[index]
    let repetida = cuentasSeleccionadas.findIndex(c => c.id == cuenta?.id)
    if (repetida !== -1) {
      arrayTemp.splice(repetida, 1)
      setCuentasSeleccionadas(arrayTemp)
    } else {
      arrayTemp.push(cuenta)
      setCuentasSeleccionadas(arrayTemp)
    }
  }
  //*manda a la vista del mapa con las cuentas que se quiere comparar
  const vewMap = (data) => {
    dispatch(setCordendasComparacion(data))
    setValue(1)
  }
  //*Selecciona todas o deseleccionada todas las cuentas en el check box
  const actionSelectPanel = () => {
    if (cuentasSeleccionadas.length > 0) {
      setCuentasSeleccionadas([])
    } else { 
      let data=panel.data
      if(vistaPanel==2){
        data=dataGeocoding.porSubir
      }
      setCuentasSeleccionadas(data)
     }
  }
  //*son las columnas que existiran en las tablas
  const columns = [
    {
      field: 'check', headerName: <Checkbox
        color="secondary"
        onClick={actionSelectPanel}
        defaultChecked={cuentasSeleccionadas.length}
      />, width: 50, align: 'center', disableColumnMenu: true, sortable: false,
      renderCell: (params) => {
        const prop = params.row
        let index = params.row.index;
        let subido = dataGeocoding.porSubir.find(c => c.id == prop.id)
        let repetida = dataGeocoding?.response.repetidas ? dataGeocoding?.response.repetidas.find(c => c.id == prop.id) : false
        return (
          <>
            {
              subido || vistaPanel !== 2 ?
                <Checkbox
                  color="secondary"
                  onClick={() => chekCuenta(index)}
                  defaultChecked={params.row.check ? true : false}
                />
                :
                repetida ?
                  <Tooltip placement="top-start" title="Cordenada Repetida en espera de subir">
                    <WarningIcon color='warning' />
                  </Tooltip>
                  :
                  <Tooltip placement="top-start" title="Subida">
                    <CheckCircleIcon color='success' />
                  </Tooltip>
            }
          </>
        )
      }
    },
    { field: 'num', headerName: '#', width: 30 },
    { field: 'cuenta', headerName: 'CUENTAS', width: 150 },
    { field: 'nuevas', headerName: 'NUEVAS', width: 130 },
    { field: 'actuales', headerName: 'ACTUALES', width: 140 },
    {
      field: 'accion', headerName: 'ACCIÓN', width: 120,
      renderCell: (params) => {
        const c = params.row;
        const index = params.row.index;

        const handleButtonClick = () => {
          if (vistaPanel !== 3 && vistaPanel !== 4 && vistaPanel !== 1) {
            vewMap([
              {id:20, longitud: cordenadasRep?.find(b => b.cuenta === c.cuenta)?.longitud, latitud: cordenadasRep?.find(b => b.cuenta === c.cuenta)?.latitud, color: "red", text: "Actual", cuenta: c.cuenta},
              {id:18, longitud: c.longitud, latitud: c.latitud, color: "#00ff00", text: "Nueva", cuenta: c.cuenta }
            ]);
          } else {
            setCordenadaEdit({ ...c.dataCuenta, index, data: panel.data });
          }
        };

        return (
          <Tooltip placement="top-start" title={vistaPanel !== 3 && vistaPanel !== 4 && vistaPanel !== 1 ? "Ver en mapa" : "Editar cuenta"}>
            <Button variant='contained' color={vistaPanel !== 3 && vistaPanel !== 4 && vistaPanel !== 1 ? 'secondary' : 'info'} onClick={handleButtonClick}>
              {vistaPanel !== 3 && vistaPanel !== 4 && vistaPanel !== 1 ? <PinDropIcon /> : <BorderColorIcon />}
            </Button>
          </Tooltip>
        );
      },
    },  
    { field: 'status', headerName: 'ESTATUS', width: 130 },
  ];

//*son las filas que se generan para las tablas dependiendo del panel que este a la vista cambia su informacion 

  const rows = panel ? panel.data?.map((c, index) => {
    const check = cuentasSeleccionadas.findIndex(cu => cu.id == c.id) != -1 ? true : false
    const cuenta = c.cuenta;
    const latitud = !c.latitud && vistaPanel !== 3 ? tool.validateCuenta(c).message :
      c.latitud ? `${c.latitud}, ${c.longitud}` : "No se encontro";
    const repetidaLatitud = cordenadasRep?.find(b => b.cuenta === cuenta)?.latitud;
    const repetidaLongitud = cordenadasRep?.find(b => b.cuenta === cuenta)?.longitud;
    let subido = dataGeocoding.porSubir.find(d => d.id == c.id)
    let repetida = dataGeocoding?.response.repetidas ? dataGeocoding?.response.repetidas.find(d => d.id == c.id) : false
    let status= subido || vistaPanel !== 2 ?"PENDIENTE":repetida?"REPETIDA":"SUBIDO"
    return {
      id: c.id,
      check,
      num: (index + 1),
      cuenta,
      nuevas: latitud,
      actuales: repetidaLatitud ? `${repetidaLatitud} , ${repetidaLongitud}` : "SIN SUBIR",
      accion: "",
      longitud: repetidaLongitud,
      latitud: repetidaLatitud,
      status,
      index,
      dataCuenta:c
    };
  }) : [];


//*Esta es la tabla generada
  function DataTable() {
    return (
      <div style={{ height: 400, width: '100%' }}>
       {
        value==0&&
        <DataGrid
        color="secundary"
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 50, 100]}
      />
       }
      </div>
    );
  }
//* Borra las cordendas repetidas
  const DescartarCordenadasRepetidas = () => {
    dispatch(setResponse([]))
  }




  return (
    <>
      {vistaPanel !== 0 &&
        <Button onClick={() => dispatch(setVistaPanel(0))} variant='contained' color='info' slot='end'>
          <KeyboardReturnIcon /> Regresar al panel
        </Button>
      }

      <Box sx={{ width: "100%", minHeight: "400px" }}>


        <Grow style={{ transformOrigin: 'center center' }} {...(vistaPanel == 0 ? { timeout: 1000 } : {})}
          in={vistaPanel == 0}>
          {
            vistaPanel == 0 ?
              <div>
                <Stack sx={{ width: '100%' }} spacing={2}  >
                  {
                    !dataGeocoding?.file?.total &&
                    <h3 style={{ textAlign: "center" }}>En espera de un archivo </h3>
                  }
                  {
                    dataGeocoding.cordenadas[0] &&
                    <>
                      {
                        dataGeocoding.porSubir[0] &&
                        <Alert variant="filled" severity="info" sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                          {dataGeocoding.porSubir.length} cordenadas en espera de subir
                          <Button variant='contained' sx={{ marginLeft: "30px" }} onClick={() => dispatch(setVistaPanel(2))} disabled={espera} >Revisar Cordenadas </Button>
                        </Alert>
                      }

                      {
                        dataGeocoding?.response?.totales && dataGeocoding?.response?.totales?.cordenadas_exitosas !== 0 &&
                        <Alert variant="filled" severity="success">
                          Cordenas subidas correctamente :{dataGeocoding.response.totales.cordenadas_exitosas}
                        </Alert>
                      }
                      {
                        dataGeocoding?.response?.totales && dataGeocoding?.response?.totales?.repetidas !== 0 &&
                        <>
                          <Alert variant="filled" severity="warning" sx={{ color: "white" }}>
                            <Box marginBottom={"10px"}> Cordenas repetidas sin subir :{dataGeocoding.response.totales.repetidas}</Box>
                            <Box >
                              <Button variant='contained' sx={{ marginLeft: "5px" }} onClick={actualizarCordenadas} disabled={espera} >Actualizar cordenadas </Button>
                              <Button variant='contained' sx={{ marginLeft: "5px" }} disabled={espera} color='error' onClick={DescartarCordenadasRepetidas} >Descartar Cordenadas</Button>
                              <Button variant='contained' sx={{ marginLeft: "5px" }} disabled={espera} onClick={() => tool.dowloandData(dataGeocoding?.response?.repetidas, "CORDENADAS REPETIDAS")} color='success' >Descargar Excel</Button>
                            </Box>
                          </Alert>
                          <Box>
                            <DataTable />
                          </Box>
                        </>
                      }
                      {
                        dataGeocoding?.response[0] == "TODO ACTUALIZADO" &&
                        <Alert variant="filled" severity="success" sx={{ color: "white" }}>
                          {dataGeocoding?.response[0]}
                        </Alert>
                      }
                    </>
                  }

                </Stack>
              </div> : <span></span>
          }
        </Grow>


        <Grow style={{ transformOrigin: 'center center' }} {...(!changePage && vistaPanel ? { timeout: 1000 } : {})}
          in={!changePage && vistaPanel}>
          {
            vistaPanel != 0 ?
              <div>

                <Alert variant="filled" spacing={2} severity={panel.color} >
                  <AlertTitle>
                    {panel.data.length} CUENTAS {panel.tittle}
                    <br />   cuentas seleccionadas {cuentasSeleccionadas.length}
                  </AlertTitle>

                  {
                    panel.accionPanel &&
                    <Button variant='contained' onClick={panel.accionPanel} disabled={espera} >
                      {panel.textButton}
                    </Button>
                  }
                  <Button sx={{ marginLeft: "20px" }}
                    variant='contained' color='success'
                    onClick={() => tool.dowloandData(panel.data, `CUENTAS ${panel.tittle}`)}
                    disabled={espera} >
                    Descargar reporte
                  </Button>

                </Alert>
                <DataTable />
              </div> :
              <span></span>
          }
        </Grow>
        {
          cordenadaEdit &&
          <EditModal cuenta={cordenadaEdit} close={setCordenadaEdit} setSeleccionadas={setCuentasSeleccionadas} seleccionadas={cuentasSeleccionadas} />
        }

      </Box>

    </>
  )
}

export default SubirCordenadasPanel