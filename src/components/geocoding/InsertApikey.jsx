import { Box, FormControl, FilledInput, InputAdornment, InputLabel, Grid ,useTheme,Modal,Typography,Fade} from '@mui/material';
import Fab from '@mui/material/Fab';
import PushPinIcon from '@mui/icons-material/PushPin';
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';

import { useEffect, useRef, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

import { DataGrid } from '@mui/x-data-grid';
import { apartarKey, deleteApikey, getAllKeys,guardarYutlizar } from '../../api/geocoding';
import { dispatch } from '../../redux/store';
import { setApikeyGeocodingSlice } from '../../redux/apikeyGeocodingSlice';
import { useSelector } from 'react-redux';


import { tokens } from '../../theme'
import Alert from '@mui/material/Alert';


const InserApikey = () => {
  const [keys,setKeys]=useState([])
  const inputApikey=useRef(null)
  const [apikey,setApikey]=useState(false)
  const [error,setError]=useState(false)

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const user = useSelector(a => a.user)

  const getAllApikeys=()=>{
    getAllKeys() 
    .then((res)=>{
      setKeys(res.data.data)
    })
  }

  useEffect(()=>{
    getAllApikeys()
  },[])

  const saveKey=async ()=>{ 
    const res=await apartarKey(apikey,user.user_id)
     setOpen(false)

   if(!res?.data){
      setError(true)
      setTimeout(()=>{
      setError(false)
    },4000)
   }else{

    if(res.data!="Libre"){
      dispatch(setApikeyGeocodingSlice(res?.data?.apikey?.apikey))
    }else{
      setOpen(true)
    }

   }

  }

  const saveApikey=()=>{
    let apikeyValue=inputApikey.current.value
      setApikey(apikeyValue)
  }

  const deleteKey=async(keyParamas)=>{
    await deleteApikey(keyParamas)
    setApikey("")
    getAllApikeys()
}


  const columns = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'apikey', headerName: 'APIKEY', width: 280 },
    { field: 'peticiones', headerName: 'PETICIONES', width: 80 },
    { field: 'status', headerName: 'STATUS', width: 130,
    renderCell: (params) => {
      const c = params.row.status;
      const limitPeticiones = params.row.peticiones;
      return (
        <Box sx={{
          backgroundColor:limitPeticiones<1000?!c?"#0f0":"#fffb00":"red",
          width:"100%",textAlign:"center",color:"black",borderRadius:"10px"}} >
            <p>
              {limitPeticiones<1000?!c?"LIBRE":"OCUPADA":"LIMITE ALCANZADO"} 
            </p>
        </Box>
      );
    },
    },{ field: 'action', headerName: '', width: 130,
      renderCell: (params) => {

        const c = params.row.apikey;
     
        return (
          <Tooltip title="Borrar apikey" >
          <Box onClick={()=>deleteKey(c)} sx={{
            backgroundColor:"red",cursor:"pointer",
            p:1,textAlign:"center",color:"#fff",borderRadius:"10px"}} >
              <DeleteIcon/>
          </Box>
        </Tooltip>
         
        );
      },
    }
    
  ];

 
  
  const rows = keys?.map((k,index)=>{ 

    return{
      id:index+1,
      apikey:k.apikey,
      peticiones:k.peticiones,
      status:k.activo,
      action:k.id
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


  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    justifyContent:"center",
    display: 'flex',
    alignItems:"center",
    bgcolor: 'background.paper',
    boxShadow: 24,
    maxWidth:"750px",
    p:4 ,
  };

  const guardarNuevaApikey=async()=>{
      await guardarYutlizar(apikey)
      saveKey()
  }

 
  return (
    <>
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={styleModal}>
              <Typography id="transition-modal-title" color={"secondarys"}  variant="h4" component="h2">
                Esta apikey aun no esta guardada
              </Typography>
          
              <Box style={{display:"flex",maxWidth:"300px",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}} >
              <Fab sx={{margin:2,padding:2}} variant="extended" size="small" color="secondary"  onClick={guardarNuevaApikey}  >
                <PushPinIcon sx={{ mr: 1 ,mal:3}} />
                GUARDAR Y USAR
              </Fab>
              <Fab sx={{margin:2,padding:2}} variant="extended" size="small" color="info"  onClick={()=>dispatch(setApikeyGeocodingSlice(apikey))}  >
                <PushPinIcon sx={{ mr: 1 ,mal:3}} />
                SOLO USAR
              </Fab>
              <Fab sx={{margin:2,padding:2}} variant="extended" size="small" color="primary"  onClick={()=>setOpen(false)}  >
                <PushPinIcon sx={{ mr: 1 ,mal:3}} />
                CANCELAR
              </Fab>
          
            </Box>
          </Box>
        </Fade>
      </Modal>


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

export default InserApikey;