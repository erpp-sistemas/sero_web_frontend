import { Box, Stack,Button } from '@mui/material'
import Alert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { actualizar, obtener, subirCordenadas } from '../../api/geocoding';
import { dispatch } from '../../redux/store';
import { resetPorsubir, setResponse } from '../../redux/dataGeocodingSlice';


import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


const SubirCordenadasPanel = () => {
    const [espera,setEspera]=useState(false)
    const [cordenadasRep,setCordenadasRep]=useState([])
    const dataGeocoding=useSelector(s=>s.dataGeocoding)
    
    const getCordenadas=()=>{
        setEspera(true)
       const data={cuentas:dataGeocoding.response.repetidas}
           obtener(data)
        .then(res=>{
           if(res.data.encontradas>0){
            setCordenadasRep(res.data.data)
           }
           setEspera(false)
        })
   }
    
    const mandarCordenadasDB=()=>{
        setEspera(true)
        const data={cuentas:dataGeocoding.porSubir}
         subirCordenadas(data)
         .then(res=>{
            dispatch(resetPorsubir())
            dispatch(setResponse(res))
            setEspera(false)
         })
    }
    

    const actualizarCordenadas=()=>{
         setEspera(true)
        const data={cuentas:dataGeocoding.response.repetidas}
            actualizar(data)
         .then(res=>{
            if(res.status==200){
                dispatch(setResponse(["TODO ACTUALIZADO"]))
            }
            setEspera(false)
         })
    }


   useEffect(()=>{
    if(dataGeocoding?.response?.repetidas){
        getCordenadas()
    }
 
  }, [dataGeocoding?.response])

    const test=()=>{
        getCordenadas()
        // console.log(dataGeocoding)
    }

    
    const columns = [
      { id: 'num', label: '#', minWidth: 10 },
      { id: 'cuenta', label: 'cuenta', minWidth: 100 },
      { id: 'nuevas', label: 'Nuevas Cordenadas', minWidth: 100 },
      { id: 'anteriores', label: 'Cordenadas Anteriores', minWidth: 100 }
    ];
    
    function createData(num, cuenta, nuevas, anteriores) {
      return { num, cuenta, nuevas, anteriores };
    }

    const rows = cordenadasRep?.map((c, index) => {
        const cuenta = c.cuenta;
        const latitud = `${c.latitud}, ${c.longitud}`;
        const repetidaLatitud = dataGeocoding.response.repetidas?.find(b => b.cuenta === cuenta)?.latitud;
        const repetidaLongitud = dataGeocoding.response.repetidas?.find(b => b.cuenta === cuenta)?.longitud;
    
        return createData(
            index + 1,
            cuenta,
            latitud,
            `${repetidaLatitud} , ${repetidaLongitud}` ,
            
        );
    });
    
    
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
    <Box>
     <Stack sx={{ width: '100%' }} spacing={2}>
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
                    <Button variant='contained' sx={{marginLeft:"30px"}} onClick={mandarCordenadasDB} disabled={espera} >Subir Cordenadas </Button>
                </Alert>
            }

            {
                dataGeocoding?.response?.totales&&dataGeocoding?.response?.totales?.cordenadas_exitosas!==0&&
                <Alert variant="filled" severity="success" onClick={mandarCordenadasDB}>
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
                        <Button variant='contained' sx={{marginLeft:"5px"}}  disabled={espera} color='success' >Descargar Excel</Button>
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
        
       
    </Box>
  )
}

export default SubirCordenadasPanel