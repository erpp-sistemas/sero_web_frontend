import { Box, Button, CircularProgress, Grid, Tooltip, Typography } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import React, { useState } from "react";
import { Cancel, Upload } from "@mui/icons-material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

function InputFileUpload({ file, sendFile,update,setUpdate }) {
  
   const [valueFile, setValueFile] = useState(null);
   const [cargando, setCargando] = useState(false);


   const values = (value) => {
      setValueFile(value[0]);
   };

   const uploandFile = () => {
      setCargando(true);

      sendFile({
         fileAws: valueFile,
         carpeta: file.nombre_archivo,
         id_archivo: file.id,
      });
   };

   const cancelValue = () => {
      setTimeout(() => {
         setValueFile(null);
      }, 100);
   };

   return (
      <>
         {!valueFile ? 
            <Button 
                sx={{ margin: "5px 10px", width: "85%", display: "flex", justifyContent: "start" }} 
                variant="contained"
                tabIndex={-1} 
                startIcon={<CloudUploadIcon />}
                component="label"
                role={undefined}
            >
               {file.nombre_archivo}

            <VisuallyHiddenInput type="file" onChange={(e) => values(e.target.files)} />

            {
                update&&
                <Tooltip title="Cancelar Edición">
                    <Cancel onClick={()=>setUpdate(false)} sx={{ margin: "0px 10px 0px auto" }} color="error" />
                </Tooltip>
            }

            </Button>
          : cargando ? 
            <Button sx={{ margin: "5px 10px", width: "85%", display: "flex", flexWrap: "wrap" }} color="info" variant="contained">
               
               <Box sx={{ display: "flex" }}>
                  <CircularProgress />
               </Box>
            </Button>
          : 
            <Button sx={{ margin: "5px 10px", width: "85%", display: "flex", flexWrap: "wrap" }} color="info" variant="contained">
               <Grid container spacing={2} alignItems="center" sx={{ width: "100%" }}>
                  <Grid item xs={7}>
                     <Tooltip title={valueFile.name}>
                        <Typography variant="caption" color="#000">
                           {valueFile.name} -
                           <Typography px={1} component="span" variant="caption" backgroundColor="#000" color="#fff">
                              {file.nombre_archivo}
                           </Typography>
                        </Typography>
                     </Tooltip>
                  </Grid>

                  <Grid item xs={5}>
                     <Tooltip title="Subir Archivo">
                        <Upload onClick={uploandFile} sx={{ margin: "0 10px" }} />
                     </Tooltip>

                     <Tooltip title="Cancelar Archivo">
                        <Cancel color="error" sx={{ margin: "0px 10px" }} onClick={cancelValue} />
                     </Tooltip>
                  </Grid>
               </Grid>

               <Typography width="100%" variant="caption" color="#fff" backgroundColor="#000">
                  Pendiente de subir
               </Typography>
            </Button>
         }
      </>
   );
}

const ItemFile = ({ file, sendFile }) => {
    const [update,setUpdate]=useState(false)
    const fileInstance = file.DocumentosEmpleados[0];


   return (
      <>
         {fileInstance&&!update ? (
            <Button sx={{ margin: "5px 10px", width: "85%", display: "flex", flexWrap: "wrap",justifyContent:"center" }} color="success" variant="contained">
               <Typography color="#000" backgroundColor="#fff" sx={{borderRadius:"30px"}} width="70%" overflow="hidden">
                  {file.nombre_archivo}
               </Typography>

               <Grid container spacing={2} justifyContent="end" mt={1} width="30%" >
                  <Tooltip title="Descargar Archivo">
                     <a href={`https://erpp-rh.s3.amazonaws.com/${fileInstance.url_archivo}`}>
                        <CloudDownloadIcon sx={{ margin: "0 10px", color: "#000" }} />
                     </a>
                  </Tooltip>

                  <Tooltip title="Editar Archivo">
                     <BorderColorIcon onClick={()=>setUpdate(true)} sx={{ margin: "0px 10px", color: "#000" }} />
                  </Tooltip>
               </Grid>
            </Button>
         ) : (
            <InputFileUpload file={file} sendFile={sendFile} update={update} setUpdate={setUpdate} />
         )}
      </>
   );
};

export default ItemFile;
