import { Box, Chip, CircularProgress, Divider, Grid, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

import { generateKeyFile, getAllCategoriesWhitDocuments, uploandFileAws } from "../../../api/personalErpp";

import AddCircleIcon from "@mui/icons-material/AddCircle";

import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import ErrorIcon from "@mui/icons-material/Error";
import FileUploadIcon from "@mui/icons-material/FileUpload";



import { useForm } from "react-hook-form";
import { Cancel, EditAttributes, EditAttributesRounded, EditAttributesSharp, Upload } from "@mui/icons-material";
import ItemFile from "./ItemFile";
const style = {
   position: "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: 400,
   bgcolor: "background.paper",
   border: "2px primary #000",
   boxShadow: 24,
   text: "center",
   display: "flex",
   flexWrap: "wrap",
   p: 4,
};





function ModalNewFile({ open, close, action, categoria, setAlert }) {
   const { handleSubmit, register } = useForm();

   const handleClose = () => close(false);

   const createKeyFile = (data) => {
      generateKeyFile({ id_cargo: categoria.id, ...data })
         .then((res) => {
            setAlert({
               message: "Se agrego correctamente el nuevo campo de archivo",
               type: "success",
            });
            action();
            close(false);
         })
         .catch((res) => {
            console.log(res)
            setAlert({
               message: `Hubo un error ${res.response.data} , vuelve a intentarlo`,
               type: "error",
            });
         });
   };

   return (
      <div>
         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
               backdrop: {
                  timeout: 500,
               },
            }}
         >
            <Fade in={open}>
               <Box sx={style}>
                  <form onSubmit={handleSubmit(createKeyFile)} style={{ width: "100%", margin: "20px 5px" }}>
                     <Typography variant={"h5"} sx={{ textAlign: "center" }}>
                        Se agregara un nuevo campo de archivo para la categoria
                        <Typography component="span" color={"secondary"} variant={"h5"} sx={{ marginLeft: "4px" }}>
                           {categoria?.categoria?.toUpperCase()}
                        </Typography>
                     </Typography>
                     <TextField required {...register("nombre_archivo")} id="outlined-required" label="Nombre del nuevo archivo" sx={{ width: "100%", marginTop: "10px" }} />
                     <Grid container spacing={2}>
                        <Button onClick={handleClose} variant="contained" size="medium" sx={{ margin: "23px auto" }}>
                           CANCELAR
                        </Button>
                        <Button type={"submit"} variant="contained" size="medium" color="success" sx={{ margin: "23px auto" }}>
                           Agregar
                        </Button>
                     </Grid>
                  </form>
               </Box>
            </Fade>
         </Modal>
      </div>
   );
}

const DocumentosFicha = ({ empleado, setAlert }) => {
   const [categoria, setCategoria] = useState({});
   const [openModal, setOpenModal] = useState(false);
   const [files, setFiles] = useState([]);
   const [filesGenerales, setFilesGenerales] = useState([]);


   
   const getAllFiles = () => {
      getAllCategoriesWhitDocuments(empleado?.rol , empleado.id_usuario)
         .then((res) => {
            console.log(res)
            setFiles(res.data);
         })
         .catch((res) => {
            console.log(res);
         });
   };

   const getAllFilesGenerales = () => {
      getAllCategoriesWhitDocuments(5, empleado.id_usuario)
         .then((res) => {
            console.log("restro")
            setFilesGenerales(res.data);
         })
         .catch((res) => {
            console.log(res);
         });
   };

   useEffect(() => {
      getAllFiles();
      getAllFilesGenerales();
   }, []);

   const sendFile=(file)=>{
      const body={
        id_usuario:empleado.id_usuario,
        ...file
      }
      uploandFileAws(body,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res=>{
          console.log(res)
          setFiles([])
          setFilesGenerales([])
          setTimeout(() => {
            getAllFiles()
            getAllFilesGenerales()
          }, 100);
          setAlert({message:"Se guardo el documento correctamnet",type:"success"})
        })
        .catch(res=>{
          console.log(res)
        })
   }


   return (
      <Box sx={{ minHeight: "70vh" }}>
         <ModalNewFile close={setOpenModal} open={openModal} categoria={categoria} action={categoria.id == 5 ? getAllFilesGenerales : getAllFiles} setAlert={setAlert} />

         <Divider>
            <Chip label="DOCUMENTOS GENERALES" size="small" color="secondary" />
         </Divider>

         <Box sx={{ display: "flex", margin: "10px auto", flexWrap: "wrap", justifyContent: "centers", justifyContent: "center" }}>
            {filesGenerales?.ArchivoKeys?.map((f) => (
               <ItemFile file={f} sendFile={sendFile} key={f.id}/>
            ))}
            <Tooltip describeChild title="Añadir nuevo archivo">
               <Button
                  onClick={() => {
                     setOpenModal(true);
                     setCategoria({ id: 5, categoria: "General" });
                  }}
                  variant="contained"
                  color={"warning"}
                  sx={{ margin: "5px 10px", width: "90%" }}
               >
                  <AddCircleIcon />
                  Nuevo Documento
               </Button>
            </Tooltip>
         </Box>

                  
            {  
               files.nombre&&
               <>
               <Divider>
                  <Chip label={`ARCHIVOS DE ${files?.nombre?.toUpperCase()}`} size="small" color="secondary" />
               </Divider>
               <Box sx={{ display: "flex", margin: "10px 0px", flexWrap: "wrap", justifyContent: "center" }}>
                  {
                  files?.ArchivoKeys?.length>0&&
                  files.ArchivoKeys.map((f) => (
                     <ItemFile file={f} sendFile={sendFile} key={f.id}/>
                  ))
                  }
                  <Tooltip describeChild title="Añadir nuevo archivo">
                     <Button
                        onClick={() => {
                           setOpenModal(true);
                           setCategoria({ id: empleado.rol, categoria: empleado.nombre_rol });
                        }}
                        variant="contained"
                        color={"warning"}
                        sx={{ margin: "5px 10px", width: "90%" }}
                     >
                        <AddCircleIcon />
                        Nuevo Documento
                     </Button>
                  </Tooltip>
               </Box>
            </>
            }
      
      </Box>
   );
};

export default DocumentosFicha;
