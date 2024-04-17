import { Box, FormControl, FilledInput, InputAdornment, InputLabel, Grid ,useTheme} from '@mui/material';
import Fab from '@mui/material/Fab';
import PushPinIcon from '@mui/icons-material/PushPin';
import HelpIcon from '@mui/icons-material/Help';

import { useEffect, useRef, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

import { DataGrid } from '@mui/x-data-grid';
import { apartarKey, getAllKeys } from '../../api/geocoding';
import { dispatch } from '../../redux/store';
import { setApikeyGeocodingSlice } from '../../redux/apikeyGeocodingSlice';
import { useSelector } from 'react-redux';


import { tokens } from '../../theme'
import Alert from '@mui/material/Alert';


const index = () => {
  const [keys,setKeys]=useState([])
  const inputApikey=useRef(null)
  const [apikey,setApikey]=useState(false)
  const [error,setError]=useState(false)

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const user = useSelector(a => a.user)

  useEffect(()=>{
    getAllKeys() 
    .then((res)=>{setKeys(res.data.data)})
  },[])

  const saveKey=async ()=>{ 

   try{
    const res=await apartarKey(apikey,user.user_id)
      dispatch(setApikeyGeocodingSlice(res?.data?.apikey?.apikey))
   }catch(error){
    console.log(error)
    setError(true)
    setTimeout(()=>{
      setError(false)
    },4000)
   }
    
  }

  const saveApikey=()=>{
    let apikeyValue=inputApikey.current.value
      setApikey(apikeyValue)
  }

  const columns = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'apikey', headerName: 'APIKEY', width: 280 },
    { field: 'peticiones', headerName: 'PETICIONES', width: 80 },
    { field: 'status', headerName: 'STATUS', width: 130,
    renderCell: (params) => {
      const c = params.row.status;
      

      return (
        <Box sx={{backgroundColor:!c?"#0f0":"#fffb00",width:"80%",textAlign:"center",color:"black",borderRadius:"10px"}} >{!c?"LIBRE":"OCUPADA"} </Box>
      );
    },
    }
  ];
  
  const rows = keys?.map(k=>{ 
    return{
      id:k.id,
      apikey:k.apikey,
      peticiones:k.peticiones,
      status:k.activo
    }
  });
  
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
        />
      </div>
    );
  }


  return (
    <>
    <Grid container sm={6} xs={9} display={'flex'} justifyContent={"center"}>
      <Grid item sm={9} marginBottom={"10px"}>
          <Box  style={{ backgroundColor: colors.primary[400], color: 'black', padding: '20px', borderRadius: '10px',width:"100%" } }>
            <FormControl fullWidth variant="filled">
              <InputLabel htmlFor="filled-adornment-amount"  color="primary">Inserta tu APIKEY</InputLabel>
              <FilledInput
                inputRef={inputApikey}
                onInput={saveApikey}
                id="filled-adornment-amount"
                startAdornment={<InputAdornment  position="start">APIKEY</InputAdornment>}
              />
            </FormControl>
            
            <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}} disabled={!apikey}>
            <Fab sx={{margin:2,padding:2,'&:disabled': { 
                    color: '#999', 
                  }}} variant="extended" size="small" color="secondary" onClick={saveKey} disabled={apikey.length<7||!apikey}  >
              <PushPinIcon sx={{ mr: 1 ,mal:3}} />
              GUARDAR
            </Fab>
            <Tooltip title="Puedes pedir una apikey al area de sistemas">
              <HelpIcon position="end" sx={{mal:3,color:"white"}}/>
            </Tooltip>
            </Box>
          </Box>
         {error&& <Alert severity="error" >Error al apartar esta apikey</Alert>}
      </Grid>


      <Grid item sm={12}>
         <DataTable/>
      </Grid>


    </Grid>
      
              

    </>
  );
};

export default index;