import { Avatar, Box, Button, Grid, Skeleton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

import Viewer from "react-viewer";
import { useEffect } from "react";

import { getEmpleadoById } from "../../api/personalErpp";
import CamposFichaEmpleado from "./personalErpp/CamposFichaEmpleado";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomAlert from "../CustomAlert";
import DocumentosFicha from "./personalErpp/DocumentosFicha";

import * as ExcelJS from "exceljs";
import PDFfichaEmpleado from "./personalErpp/PDFfichaEmpleado";
import ModalFichaEmpleado from "./ModalFichaEmpleado";

function TabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
         {value === index && (
            <Box sx={{ p: 3 }}>
               <Typography>{children}</Typography>
            </Box>
         )}
      </div>
   );
}

TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.number.isRequired,
   value: PropTypes.number.isRequired,
};

function a11yProps(index) {
   return {
      "id": `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
   };
}

const AvatarImage = ({ data, mds }) => {
   const [visibleAvatar, setVisibleAvatar] = useState(false);
   return (
      <>
         <Avatar
            onClick={() => {
               setVisibleAvatar(true);
            }}
            sx={{ cursor: "pointer", ...mds }}
            alt="Remy Sharp"
            src={data}
         />

         <Viewer
            visible={visibleAvatar}
            onClose={() => {
               setVisibleAvatar(false);
            }}
            images={[{ src: data, alt: "avatar" }]}
         />
      </>
   );
};

const FichaEmpleado = ({ user }) => {
   const [empleado, setEmpleado] = useState(null);
   const [cargando, setCargando] = useState(false);
   const [dowloandfiles,setdowloandfiles]=useState(false)
   const [dataAlert, setDataAlert] = useState(false);
   const [value, setValue] = React.useState(0);

   const theme = useTheme();

   useEffect(() => {
      if (user) {
         setCargando(true);
         getEmpleadoById(user)
            .then((res) => {
               setEmpleado(res.data);
               setTimeout(() => {
                  setCargando(false);
               }, 100);
            })
            .catch((err) => {
               setCargando(false);
            });
      }
   }, [user]);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   const handleChangeIndex = (index) => {
      setValue(index);
   };


   const exportToExcel = async () => {
      try {
         const workbook = new ExcelJS.Workbook();
         const worksheet = workbook.addWorksheet("Información General");

         const headers = Object.keys(empleado);
         const infoEmpleado =[...empleado?.info_empleado&& Object.keys(empleado?.info_empleado)];

         const allHeaders=[...headers,...infoEmpleado].map(header=>{
           return header.toUpperCase().replace("_"," ")
         })
         
         worksheet.addRow(allHeaders);
       
         const values = headers.map((header) => empleado[header]);
         const valuesEmpleado = infoEmpleado.map((header) => empleado?.info_empleado[header]);
         worksheet.addRow([...values,...valuesEmpleado]);
         

         const buffer = await workbook.xlsx.writeBuffer();
         const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement("a");
         a.href = url;
         a.download = `${empleado.nombre}_informacion_general.xlsx`;
         a.click();
         window.URL.revokeObjectURL(url);
      } catch (error) {
         console.log(error)
         console.error("Error:", error);
         return null;
      }
   };


   return (
      <Grid item xs={6}> 
         <CustomAlert alertOpen={dataAlert} type={dataAlert.type} message={dataAlert.message} onClose={setDataAlert} />

         <ModalFichaEmpleado close={setdowloandfiles} open={dowloandfiles} title={"¿ Deseas descar solo la ficha o el expediente completo ?"}
            OtionesHtml2={
         <Grid   container spacing={2} justifyContent="center">
               <PDFfichaEmpleado empleado={empleado} close={setdowloandfiles} />
               <PDFfichaEmpleado empleado={empleado} expediente={true} close={setdowloandfiles}/>
         </Grid>
            }
         />

         <Box sx={{ backgroundColor: "#425977", margin: "0 30px", height: "80vh", overflowY: "auto" }} p={1}>
            {cargando ? (
               <Stack spacing={1}>
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

                  <Grid container spacing={2} alignItems="center" justifyContent="space-around">
                     <Skeleton variant="circular" width={80} height={80} />
                     <Skeleton variant="rectangular" width={"70%"} height={120} />
                  </Grid>

                  <Skeleton variant="text" sx={{ fontSize: "4rem" }} />
                  <Skeleton variant="text" sx={{ fontSize: "4rem" }} />
                  <Skeleton variant="text" sx={{ fontSize: "4rem" }} />
                  <Skeleton variant="text" sx={{ fontSize: "4rem" }} />
               </Stack>
            ) : (
               <>
                  <Grid container spacing={2} py={2} sx={{ backgroundColor: "#15263c", borderRadius: "10px", width: "100%", margin: "auto" }}>
                     <Grid item alignItems={"center"} justifyContent={"center"} sx={{ backgroundColor: "redd" }}>
                        <AvatarImage data={empleado?.foto} mds={{ width: " 100px ", height: "100px", margin: "auto", border: "3px solid #00bfff" }} />
                     </Grid>

                     <Grid item xl={7} xs={6} justifyContent={"start"}>
                        <Typography variant="h3">{`${empleado?.nombre} ${empleado?.apellido_materno} ${empleado?.apellido_paterno}`}</Typography>
                        <Typography variant="h5" ml={2} mt={2} color={"#00bfff"}>
                           {empleado?.usuario_correo}
                        </Typography>
                        <Typography variant="h5" ml={2} mt={1} color={"secondary"}>
                           {empleado?.info_empleado?.correo || "SIN CORREO AUN"}
                        </Typography>
                 
                     </Grid>
                     <Grid container spacing={2} mt={1} justifyContent="center">
                           <Button onClick={exportToExcel} sx={{ margin: "5px 10px", display: "flex", justifyContent: "start"}}  startIcon={<InsertDriveFileIcon />} color="success" variant="contained" >
                             Generar Excel
                           </Button>
                           {
                            empleado?.nombre&&
                            <Button onClick={()=>setdowloandfiles(true)} sx={{ margin: "5px 10px", display: "flex", justifyContent: "start" }}  startIcon={<InsertDriveFileIcon />} color="error" variant="contained" >
                            Descargar PDF
                             </Button>
                           }
                        </Grid>
                  </Grid>
                  <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
                     <AppBar position="static">
                        <Tabs value={value} onChange={handleChange} indicatorColor="secondary" textColor="inherit" variant="fullWidth" aria-label="full width tabs example">
                           <Tab label="DATOS" {...a11yProps(0)} />
                           <Tab label="DOCUMENTOS" {...a11yProps(1)} />
                        </Tabs>
                     </AppBar>

                     <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value} onChangeIndex={handleChangeIndex}>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                           <CamposFichaEmpleado empleado={empleado} setAlert={setDataAlert} />
                        </TabPanel>

                        <TabPanel value={value} index={1} dir={theme.direction}>
                           <DocumentosFicha empleado={empleado} setAlert={setDataAlert} />
                        </TabPanel>
                     </SwipeableViews>
                     
                  </Box>

                   
               </>
            )}
         </Box>
      </Grid>
   );
};

export default FichaEmpleado;
