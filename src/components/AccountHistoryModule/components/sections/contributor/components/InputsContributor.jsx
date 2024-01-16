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
import { IoIosHelpCircle } from "react-icons/io";
import { tokens } from '../../../../../../theme';
import useCombinedSlices from '../../../../../../hooks/useCombinedSlices';
import { withErrorBoundary } from '@sentry/react';
/**
 * Componente que muestra campos de información sobre la dirección de un contribuyente.
 *
 * @component
 * @returns {JSX.Element} - Elemento JSX que representa los campos de información del contribuyente.
 */
function InputsContributor() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    const {informationContributor}=useCombinedSlices()
    const[help,setHelp]=React.useState(false)
  return  (
    <Box sx={{padding:"2rem",maxHeight:"400px",overflow:"auto"}}>
      
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
        value={informationContributor[0]?.street || ""}
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
        value={informationContributor[0]?.["outdoor_number"] || ""}
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
        value={ informationContributor[0]?.["interior_number"] || "" }
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
        value={informationContributor[0]?.cologne || ""}
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
        value={informationContributor[0]?.square || ""}
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
        value={informationContributor[0]?.allotment || ""}
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
        value={informationContributor[0]?.["between_street_1"] || ""}
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
        value={informationContributor[0]?.["between_street_2"] || ""}
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
        value={ informationContributor[0]?.reference || ""}
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
        value={informationContributor[0]?.town || ""}
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
        value={informationContributor[0]?.poastal_code || ""}
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

export default withErrorBoundary(InputsContributor);