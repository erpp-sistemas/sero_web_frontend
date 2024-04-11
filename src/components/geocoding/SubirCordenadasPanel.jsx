
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { actualizar, obtener, subirCordenadas } from '../../api/geocoding';
import { dispatch } from '../../redux/store';
import { resetPorsubir, setCordendasComparacion, setPushCordendasRestantes, setResetCordenadasFormatoErrores, setReseteCordenadasErrores, setResponse, setVistaPanel } from '../../redux/dataGeocodingSlice';


import { Box, Stack,Button, Checkbox } from '@mui/material'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import tool from '../../toolkit/geocodingToolkit'

import Grow from '@mui/material/Grow';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

import Tooltip from '@mui/material/Tooltip';
import PinDropIcon from '@mui/icons-material/PinDrop';
import BorderColorIcon from '@mui/icons-material/BorderColor';
 
const SubirCordenadasPanel = ({setValue}) => {
    const [espera,setEspera]=useState(false)
    const [cordenadasRep,setCordenadasRep]=useState([])
    const [cuentasSeleccionadas,setCuentasSeleccionadas]=useState([])
    const [changePage,setChangePage]=useState(false)
    const dataGeocoding=useSelector(s=>s.dataGeocoding)
    const vistaPanel=dataGeocoding.vistaPanel;
    
 
    const reBuscar=()=>{
     if(cuentasSeleccionadas.length>0){
      console.log("hola")
      setEspera(true)
      cuentasSeleccionadas.forEach(c => {
        dispatch(setPushCordendasRestantes(c))
      });

     vistaPanel==4? 
     dispatch(setResetCordenadasFormatoErrores()):
     dispatch(setReseteCordenadasErrores())
     setCuentasSeleccionadas([])
     setEspera(false)
     }
    
  }
   
    const getCordenadas=(data)=>{
        setEspera(true)
        // console.log("busqueda",data)
        const cuentas={cuentas:data}
           obtener(cuentas)
        .then(res=>{
           if(res?.data?.encontradas&&res?.data?.encontradas>0){
            setCordenadasRep(res.data.data)
           }
           setEspera(false)
        })
        setCuentasSeleccionadas(panel.data)
   }
    
    const mandarCordenadasDB=()=>{
        setEspera(true)
        dispatch(setVistaPanel(0))
        const data={cuentas:cuentasSeleccionadas}
         subirCordenadas(data)
         .then(res=>{
            dispatch(resetPorsubir())
            dispatch(setResponse(res))
            setEspera(false)
         })
    }
    

    const actualizarCordenadas=()=>{
         setEspera(true)
        const data={cuentas:cuentasSeleccionadas}
            actualizar(data)
         .then(res=>{
          console.log(res)
            if(res.status==200){
                dispatch(setResponse(["TODO ACTUALIZADO"]))
            }
            setEspera(false)
         })
    }
    const arrayObjTable=[
      {data:dataGeocoding.response.repetidas?dataGeocoding.response.repetidas:[],color:"warning",tittle:"REPETIDAS",textButton:"actualizar"},
      {data:dataGeocoding.cordenadasRestantes,color:"info",tittle:"RESTANTES",accionPanel:false,textButton:"false"},
      {data:dataGeocoding.cordenadas,color:"success",tittle:"ENCONTRADAS",accionPanel:(()=>dispatch(setVistaPanel(5))) ,textButton:"REVISAR POR SUBIR"},
      {data:dataGeocoding.cordenadasErrores,color:"error",tittle:"ERRORES",accionPanel:reBuscar,textButton:"VOLVER A BUSCAR"},
      {data:dataGeocoding.cordenadasFormatoErrores,color:"error",tittle:"ERRORES FORMATO",accionPanel:reBuscar,textButton:"VOLVER A BUSCAR"},
      {data:dataGeocoding.porSubir,color:"info",tittle:"POR SUBIR",accionPanel:mandarCordenadasDB,textButton:"SUBIR CUENTAS"}
    ]
    const panel=arrayObjTable[vistaPanel]
    

    
   useEffect(()=>{

    if(vistaPanel!==0||dataGeocoding?.response?.repetidas){
      getCordenadas(panel.data)
  }
    setChangePage(true)
    setTimeout(()=>{
      setChangePage(false)
    },200)
  }, [vistaPanel])
 

   useEffect(()=>{
    if(dataGeocoding?.response?.repetidas){
        getCordenadas(arrayObjTable[0].data)
    }
  }, [dataGeocoding?.response])

  
    const columns = [
      { id: 'num', label: '#', minWidth: 10 },
      { id: 'cuenta', label: 'cuenta', minWidth: 100 },
      { id: 'nuevas', label: 'Nuevas Cordenadas', minWidth: 100 },
      { id: 'anteriores', label: 'Cordenadas Anteriores', minWidth: 100 },
      { id: 'comparar', label: 'Comparar', minWidth: 100 }
    ];
    
    function createData(num, cuenta, nuevas, anteriores,comparar) {
      return { num, cuenta, nuevas, anteriores,comparar };
    }
    const chekCuenta=(index)=>{  
      let arrayTemp=[...cuentasSeleccionadas]
      let cuenta=panel.data[index]
      let repetida=cuentasSeleccionadas.findIndex(c=>c.id==cuenta?.id)
      if(repetida!==-1){
        arrayTemp.splice(repetida,1) 
        setCuentasSeleccionadas(arrayTemp)
      }else{
        arrayTemp.push(cuenta)
        setCuentasSeleccionadas(arrayTemp)
      }
    }

    const test=()=>{
     console.log(cuentasSeleccionadas)
     console.log(dataGeocoding.cordenadasErrores)
  } 

  const vewMap=(data)=>{
    console.log(data)
    dispatch(setCordendasComparacion(data))
    setValue(1)
  }

    const rows = panel?panel.data?.map((c, index) => {
      const ckeck=cuentasSeleccionadas.findIndex(cu=>cu.id==c.id)!=-1?true:false
      const cuenta = c.cuenta;
      const latitud = !c.latitud&&vistaPanel!==3?tool.validateCuenta(c).message:
      c.latitud?`${c.latitud}, ${c.longitud}`:"No se encontro";
      const repetidaLatitud = cordenadasRep?.find(b => b.cuenta === cuenta)?.latitud;
      const repetidaLongitud = cordenadasRep?.find(b => b.cuenta === cuenta)?.longitud;
      const comparacion=[
        {longitud:repetidaLongitud,latitud:repetidaLatitud ,color:"red",text:"Actual",cuenta:c.cuenta},
        {longitud:"-99.58884",latitud:c.latitud ,color:"#00ff00",text:"Nueva",cuenta:c.cuenta}
      ]

      return createData(
        <Checkbox
        color="secondary" 
        style={{ color: "#00ff00" }} 
        onClick={()=>chekCuenta(index)}
        defaultChecked={ckeck}
        />,
          cuenta,
          latitud,
          repetidaLatitud?`${repetidaLatitud} , ${repetidaLongitud}`:"SIN SUBIR" ,
          vistaPanel!=3&&vistaPanel!=4?
          <Tooltip placement="top-start" title="Ver en mapa">
          <Button onClick={()=>vewMap(comparacion)} variant='contained' color='secondary'> <PinDropIcon/></Button>
          </Tooltip>:
          <Tooltip placement="top-start" title="Editar cuenta">
          <Button variant='contained' color='info'> <BorderColorIcon/></Button>
          </Tooltip>
      );
  }):[];
    
    
function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    
    return (
      <Paper sx={{ minWidth: '100%', overflow: 'hidden' }}>
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }

    const DescartarCordenadasRepetidas=()=>{
        dispatch(setResponse([]))
    }

  
    
  return (
    <>
      {vistaPanel!==0&&
      <Button onClick={()=>dispatch(setVistaPanel(0))} variant='contained' color='info' slot='end'>
        <KeyboardReturnIcon/> Regresar al panel
      </Button>
      }
   
    <Box sx={{width:"100%",minHeight:"400px"}}>
      
      
    <Grow style={{ transformOrigin: 'center center' }} {...(vistaPanel==0 ? { timeout: 1000 } : {})}
            in={vistaPanel==0}>
       {
        vistaPanel==0?
          <div>
        <Stack sx={{ width:'100%'}} spacing={2}  >
                 {
                   !dataGeocoding?.file?.total&&
                   <h3 style={{textAlign:"center"}}>En espera de un archivo </h3>  
                 }
                 {
                     dataGeocoding.cordenadas[0]&&
                     <>
                 {
                     dataGeocoding.porSubir[0]&&
                     <Alert variant="filled" severity="info" sx={{display:"flex",justifyContent:"start",alignItems:"center"}}>
                         {dataGeocoding.porSubir.length} cordenadas en espera de subir
                         <Button variant='contained' sx={{marginLeft:"30px"}} onClick={()=>dispatch(setVistaPanel(5))} disabled={espera} >Revisar Cordenadas </Button>
                     </Alert>
                 }
 
                 {
                     dataGeocoding?.response?.totales&&dataGeocoding?.response?.totales?.cordenadas_exitosas!==0&&
                     <Alert variant="filled" severity="success">
                       Cordenas subidas correctamente :{dataGeocoding.response.totales.cordenadas_exitosas}
                     </Alert>
                 }
                 {
                   dataGeocoding?.response?.totales&&dataGeocoding?.response?.totales?.repetidas!==0&&
                   <>
                     <Alert variant="filled" severity="warning" sx={{color:"white"  }}>
                       <Box marginBottom={"10px"}> Cordenas repetidas sin subir :{dataGeocoding.response.totales.repetidas}</Box>
                         <Box >
                             <Button variant='contained' sx={{marginLeft:"5px"}} onClick={actualizarCordenadas} disabled={espera} >Actualizar cordenadas </Button>
                             <Button variant='contained' sx={{marginLeft:"5px"}}  disabled={espera} color='error'onClick={DescartarCordenadasRepetidas} >Descartar Cordenadas</Button>
                             <Button variant='contained' sx={{marginLeft:"5px"}}  disabled={espera} onClick={()=>tool.dowloandData(dataGeocoding?.response?.repetidas,"CORDENADAS REPETIDAS")} color='success' >Descargar Excel</Button>
                         </Box>
                     </Alert>
                     <Box>
                         <StickyHeadTable/>
                     </Box>
                  </>
                 }
                 {
                   dataGeocoding?.response[0]=="TODO ACTUALIZADO"&&
                     <Alert variant="filled" severity="success" sx={{color:"white"  }}>
                         { dataGeocoding?.response[0]}
                     </Alert>
                 }
               
               {/* <button onClick={test}>TEST</button> */}
                 
                     </>
               
                 
                 }
                 
         </Stack>
         </div>:<span></span>
       }
    </Grow> 

        
        <Grow style={{ transformOrigin: 'center center' }} {...(!changePage&&vistaPanel ? { timeout: 1000 } : {})}
            in={!changePage &&vistaPanel}>
        {
          vistaPanel!=0?
          <div>
        
        <Alert variant="filled" spacing={2} severity={panel.color} >
          <AlertTitle>  
            {panel.data.length} CUENTAS {panel.tittle}
          <br />   cuentas seleccionadas {cuentasSeleccionadas.length} 
          </AlertTitle>

       {
        panel.accionPanel&&
          <Button variant='contained'  onClick={panel.accionPanel} disabled={espera} >
            {panel.textButton} 
          </Button>
       }
        <Button sx={{marginLeft:"20px"}} 
        variant='contained'color='success' 
        onClick={()=>tool.dowloandData(panel.data,`CUENTAS ${panel.tittle}`)} 
        disabled={espera} >
          Descargar reporte 
        </Button>
   
        </Alert>
        <StickyHeadTable />
        </div>:
        <span></span>
        }
        </Grow>
 
      
       
    </Box>
    {/* <button onClick={test}>TEST</button> */}
    </>
  )
}

export default SubirCordenadasPanel