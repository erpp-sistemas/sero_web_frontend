import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Button, FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';
import { getKeyFiles } from '../../../api/personalErpp';
import { useEffect } from 'react';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const keysInfo = [
  'curp',
  'fecha_de_ingreso',
  'alta_imss',
  'contrato_determinado_1',
  'contrato_determinado_2',
  'contrato_determinado_3',
  'contrato_indeterminado',
  'rfc',
  'nss',
  'correo',
  'contacto_de_emergencia',
  'calle',
  'no_int',
  'no_ext',
  'cp',
  'colonia',
  'municipio_alcaldia',
  'estado_ciudad',
  'cargo',
  'plaza'
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.palette.secondary
        : theme.typography.fontWeightMedium,
    backgroundColor: personName.indexOf(name) === -1 ?"#17212F":"#40506D",
    color: personName.indexOf(name) === -1&&"#00ff00"
  };
}


const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

export default function SelectChipMultiple({getUsuarios}) {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);

  const [valuesFiltros, setValuesFiltros] = useState([]);


  const [filtro,setFiltro]=useState(false)
  const [existentes,setExistentes]=useState(false)

  const [filesKeys,setFilesKeys]=useState([])



  const getFilesGenerales=()=>{
    getKeyFiles(1)
        .then(res=>{setFilesKeys(res.data)})
  }

  const searchBelonged=()=>{
        const filterInfo=[]
        const filterfiles=[]

        for(let key of personName){
            const key_id=filesKeys.find(k=>k.nombre_archivo==key)?.id
            if(key_id!=undefined){
                filterfiles.push(key_id)
            }else{
                filterInfo.push(key)
            }
        }
        return {
            filterInfo,
            filterfiles
        }
    
  }
  
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
   
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const switshFiltro=()=>{
    if(filtro){
        getUsuarios()
    }
    setFiltro(!filtro)
  }

  const aplciarFiltro=()=>{
    const filters=searchBelonged()
    const parametros={
        ...filters,
        existentes
    }
   
    getUsuarios(parametros)
  }



  useEffect(() => {
    getFilesGenerales()
  }, [])
  

  return (
    <div style={{transition:"3s"}}>
   <Box>
   <FormControlLabel
        control={<IOSSwitch sx={{ m: 1 }}  />}
        label="Filtro Información"
        onChange={switshFiltro}
    />
   {
    filtro&&
    <>
        <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }}  />}
            label="Existentes"
            onChange={()=>setExistentes(!existentes)}
        />
        <Button variant="contained" onClick={aplciarFiltro} color="info">Aplicar Filtro</Button>
    </>
   }
   </Box>
      {
      
      filtro&&

      <>
      <FormControl sx={{ m: 1, maxWidth: "500px",minWidth:"300px" }}>
        
        <InputLabel id="demo-multiple-chip-label">Información</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const color=keysInfo.findIndex(e=>e==value)!=-1?"success":"info"
                return (
                    <Chip key={value} label={value} color={color}/>
                  )
              })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
        
          {keysInfo.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        <div style={{backgroundColor:"#29b6f6",display:"flex",justifyContent:"center"}}>
            Documentos
        </div>

        {filesKeys.map((file) => (
            <MenuItem
              key={file.id}
              value={file.nombre_archivo    }
              style={getStyles(file.nombre_archivo, personName, theme)}
            >
              {file.nombre_archivo}
            </MenuItem>
          ))}
     
        </Select>
      </FormControl>
      </>
      }
    </div>
  );
}
