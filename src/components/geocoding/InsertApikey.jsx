import { Box, FormControl, FilledInput, InputAdornment, InputLabel } from '@mui/material';
import Fab from '@mui/material/Fab';
import PushPinIcon from '@mui/icons-material/PushPin';
import HelpIcon from '@mui/icons-material/Help';
import { useRef, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

const index = ({apikey,setApikey,saveKey}) => {
  const inputApikey=useRef(null)

  const saveApikey=()=>{
    let apikeyValue=inputApikey.current.value
      setApikey(apikeyValue)
  }


  return (
    <>
      <div style={{ backgroundColor: '#60ae61', color: 'black', padding: '20px', borderRadius: '10px',width:"50%" } }>
        <FormControl fullWidth variant="filled">
          <InputLabel htmlFor="filled-adornment-amount"  color="success">Inserta tu APIKEY</InputLabel>
          <FilledInput
            inputRef={inputApikey}
            onInput={saveApikey}
            id="filled-adornment-amount"
            startAdornment={<InputAdornment  position="start">APIKEY</InputAdornment>}
          />
        </FormControl>
        
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}} disabled={!apikey}>
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
        </div>
      </div>
    </>
  );
};

export default index;