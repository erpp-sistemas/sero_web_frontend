import { Box, FormControl, FilledInput, InputAdornment, InputLabel, Grid } from '@mui/material';
import Fab from '@mui/material/Fab';
import PushPinIcon from '@mui/icons-material/PushPin';
import HelpIcon from '@mui/icons-material/Help';

import { useEffect, useRef, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';

import { DataGrid } from '@mui/x-data-grid';





const index = ({apikey,setApikey,saveKey}) => {
  const inputApikey=useRef(null)

  useEffect(()=>{
    
  },[])

  const saveApikey=()=>{
    let apikeyValue=inputApikey.current.value
      setApikey(apikeyValue)
  }

  const columns = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160
    },
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
  
   function DataTable() {
    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          // checkboxSelection
        />
      </div>
    );
  }




  return (
    <>
    <Grid container sm={6} xs={9} display={'flex'} justifyContent={"center"}>
      <Grid item sm={9} marginBottom={"10px"}>
          <Box style={{ backgroundColor: '#60ae61', color: 'black', padding: '20px', borderRadius: '10px',width:"100%" } }>
            <FormControl fullWidth variant="filled">
              <InputLabel htmlFor="filled-adornment-amount"  color="success">Inserta tu APIKEY</InputLabel>
              <FilledInput
                inputRef={inputApikey}
                onInput={saveApikey}
                id="filled-adornment-amount"
                startAdornment={<InputAdornment  position="start">APIKEY</InputAdornment>}
              />
            </FormControl>
            
            <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}} disabled={!apikey}>
            <Fab sx={{margin:2,padding:2,'&:disabled': { 
                    backgroundColor: '#17212fdb', 
                    color: '#999', 
                  }}} variant="extended" size="small" color="primary" onClick={saveKey} disabled={apikey.length<7||!apikey}  >
              <PushPinIcon sx={{ mr: 1 ,mal:3}} />
              GUARDAR
            </Fab>
            <Tooltip title="Puedes pedir una apikey al area de sistemas">
              <HelpIcon position="end" sx={{mal:3,color:"white"}}/>
            </Tooltip>
            </Box>
          </Box>
      </Grid>


      <Grid item sm={12}>
         <DataTable/>
      </Grid>


    </Grid>
      
              

    </>
  );
};

export default index;