import { Box, IconButton, InputAdornment, Paper, TextField, Tooltip, colors, useTheme } from '@mui/material'
import React from 'react'
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { BiStreetView } from "react-icons/bi";
import { MdConfirmationNumber } from "react-icons/md";
import { FaHouseChimneyWindow } from "react-icons/fa6";
import { FaMountainCity } from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import { GoCrossReference } from "react-icons/go";
import { BsMailbox2 } from "react-icons/bs";
import { useStoreZustand } from '../../../../../../zustan_store/useStoreZustand';
import { IoIosHelpCircle } from "react-icons/io";
import { tokens } from '../../../../../../theme';
import useCombinedSlices from '../../../../../../hooks/useCombinedSlices';

function InputsContributor() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    const {informationContributor}=useCombinedSlices()
    const[help,setHelp]=React.useState(false)
  return  (
    <Box sx={{padding:"2rem",maxHeight:"400px",overflow:"auto"}}>
        {/* "street": "LUIS PASTEUR No EX.07 C, PARQUE INDUSTRIAL LA JOYA, CUAUTITLAN IZCALLI, ESTADO DE MEXICO",
"outdoor_number": "",
"interior_number": "",
"cologne": "PARQUE INDUSTRIAL LA JOYA",
"square": "",
"allotment": "",
"between_street_1": "",
"between_street_2": "",
"reference": "",
"town": "",
"poastal_code": "", */}
<Tooltip title="Ayuda">
  <IconButton onClick={()=>{
    if (help) {
      setHelp(false)
      
    }else{
      setHelp(true)
    }
  }}>
    <IoIosHelpCircle />
  </IconButton>
</Tooltip>
         <TextField
         FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
         helperText={help?"Informaciòn de la direccion en general":null}
         color='secondary'
         
        sx={{marginBottom:"1rem",marginRight:"1rem",width:"92%"}}
        id="input-with-icon-textfield"
        label="Direccion"
        value={informationContributor?.street || ""}
        multiline
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BiStreetView />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
        <TextField
         FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
        helperText={help?"Informaciòn numero exterior":null}
        color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem"}}
        id="input-with-icon-textfield"
        label="Num. Ext."
        value={informationContributor?.["outdoor_number"] || ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaHouseChimneyWindow />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
        <TextField
         FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
          helperText={help?"Informaciòn numero interior":null}
        color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem"}}
        id="input-with-icon-textfield"
        label="Num. Int."
        value={ informationContributor?.["interior_number"] || "" }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaHouseChimneyWindow />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
        <TextField
         FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
          helperText={help?"Informaciòn de la colonia":null}
        color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem",width:"92%"}}
        id="input-with-icon-textfield"
        label="Colonia"
        value={informationContributor?.cologne || ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <RecentActorsIcon />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
       <TextField
        FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
         helperText={help?"Informaciòn de la manzana":null}
       color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem"}}
        id="input-with-icon-textfield"
        label="Manzana"
        value={informationContributor?.square || ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdConfirmationNumber />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
       <TextField
        FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
       helperText={help?"Informaciòn del lote":null}
       color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem"}}
        id="input-with-icon-textfield"
        label="Lote"
        value={informationContributor?.allotment || ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdAssignment />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
     
       <TextField 
        FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
       helperText={help?"Informaciòn entre que calles se encuentra":null}
       color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem"}}
        id="input-with-icon-textfield"
        label="Entre Calle"
        value={informationContributor?.["between_street_1"] || ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdConfirmationNumber />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
       <TextField
        FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
       helperText={help?"Informaciòn entre que calles se encuentra":null}
       color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem"}}
        id="input-with-icon-textfield"
        label="Entre Calle 2"
        value={informationContributor?.["between_street_2"] || ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdConfirmationNumber />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
       <TextField
        FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
        helperText={help?"Informaciòn de la referencia":null}
       color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem"}}
        id="input-with-icon-textfield"
        label="Referencia"
        value={ informationContributor?.reference || ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <GoCrossReference />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
       <TextField
        FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
        helperText={help?"Informaciòn de la poblaciòn":null}
       color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem"}}
        id="input-with-icon-textfield"
        label="Poblaciòn"
        value={informationContributor?.town || ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaMountainCity />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
       <TextField
        FormHelperTextProps={{ sx: { color: colors.greenAccent[400] } }}
       helperText={help?"Informaciòn del codigo postal":null}
       color='secondary'
        sx={{marginBottom:"1rem",marginRight:"1rem"}}
        id="input-with-icon-textfield"
        label="Codigo Postal"
        value={informationContributor?.poastal_code || ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BsMailbox2 />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        variant="standard"
      />
    </Box>
  )
}

export default InputsContributor