import React, { useState, useEffect, useMemo } from "react";
import { Box, Avatar, Tooltip, Button, TextField, Typography, Badge, InputAdornment, Grid, Divider, createTheme, responsiveFontSizes } from "@mui/material";
import Header from "../../components/Header";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";

import Viewer from "react-viewer";
import Chip from "@mui/material/Chip";

import InfoIcon from "@mui/icons-material/Info";

import { AddOutlined, Cancel, CheckCircle, FileDownload, Label, People, PeopleAlt, Search, TextFields } from "@mui/icons-material";
import { Link } from "react-router-dom";

import * as ExcelJS from "exceljs";
import { getAllEmpleados, getEmpleadoById } from "../../api/personalErpp.js";
import DatePickerHook from "../../components/recursos-humanos/DatePickerHook.jsx";

let theme = createTheme();
theme = responsiveFontSizes(theme);

function Index() {
   const [selectedEmpleado, setSelectedUser] = useState(null);

   const [filter, setFilter] = useState("all");
   const [searchText, setSearchText] = useState("");

   const [empleados, setEmpleados] = useState([]);

   useEffect(() => {
      getAllEmpleados()
         .then((res) => {
            setEmpleados(res.data);
         })
         .catch((err) => {
            console.log(err);
         });
   }, []);

   const handleOpenInfoUser = (user) => {
      getEmpleadoById(user)
         .then((res) => {
            setSelectedUser(res.data);
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const buildColumns = useMemo(() => {
      return [
         {
            field: "nombre",
            renderHeader: () => <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>,
            width: 150,
            editable: false,
         },
         {
            field: "apellido_materno",
            renderHeader: () => <strong style={{ color: "#5EBFFF" }}>{"APELLIDO "}</strong>,
            width: 120,
         },
         {
            field: "apellido_paterno",
            renderHeader: () => <strong style={{ color: "#5EBFFF" }}>{"APELLIDO MATERNO"}</strong>,
            width: 120,
         },
         {
            field: "foto",
            renderHeader: () => <strong style={{ color: "#5EBFFF" }}>{"FOTO"}</strong>,
            width: 70,
            renderCell: (params) => <AvatarImage data={params.row.foto} />,
         },
         {
            field: "usuario_correo",
            renderHeader: () => <strong style={{ color: "#5EBFFF" }}>{"CORREO"}</strong>,
            width: 200,
            renderCell: (params) => <div style={{ color: "rgba(0, 191, 255, 1)" }}>{params.value}</div>,
         },
         {
            field: "actions",
            headerName: "Acciones",
            width: 150,
            renderCell: (params) => (
               <Tooltip title="Detalles">
                  <Button variant="outlined" color="info" size="small" onClick={() => handleOpenInfoUser(params.row.id_usuario)} sx={{ minWidth: "auto" }}>
                     <InfoIcon />
                  </Button>
               </Tooltip>
            ),
         },
      ];
   }, []);

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

   function CustomToolbar() {
      return (
         <GridToolbarContainer>
            <GridToolbarColumnsButton color="secondary" />
            <GridToolbarFilterButton color="secondary" />
            <GridToolbarDensitySelector color="secondary" />

            <GridToolbarExport color="secondary" />

            <Link to="/user-new" style={{ textDecoration: "none" }}>
               <Button color="secondary" startIcon={<AddOutlined />} size="small">
                  Agregar Nuevo Usuario
               </Button>
            </Link>
         </GridToolbarContainer>
      );
   }

   const handleFilterChange = (newFilter) => {
      setFilter(newFilter);
      setSearchText("");
   };

   const handleSearchChange = (event) => {
      setSearchText(event.target.value);
   };

   const filteredUsers = useMemo(() => {
      let filtered = empleados;

      switch (filter) {
         case "active":
            filtered = empleados.filter((user) => user.activo == true);
            break;
         case "inactive":
            filtered = empleados.filter((user) => user.activo == false);
            break;
         case "all":
         default:
            break;
      }
      if (searchText) {
         filtered = filtered.filter((user) => Object.values(user).some((value) => String(value).toLowerCase().includes(searchText.toLowerCase())));
      }
      return filtered;
   }, [empleados, filter, searchText]);

   const exportToExcel = async () => {
      try {
         const workbook = new ExcelJS.Workbook();
         const worksheet = workbook.addWorksheet("Registros Encontrados");

         const headers = Object.keys(filteredUsers[0]);
         worksheet.addRow(headers);

         filteredUsers.forEach((row) => {
            const values = headers.map((header) => row[header]);
            worksheet.addRow(values);
         });

         const buffer = await workbook.xlsx.writeBuffer();
         const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement("a");
         a.href = url;
         a.download = "users.xlsx";
         a.click();
         window.URL.revokeObjectURL(url);
      } catch (error) {
         console.error("Error:", error);
         return null;
      }
   };

   return (
      <Box m="20px">
         <Header title="Personal ERPP" />
         <Box mb={2}>
            <Badge badgeContent={filter === "all" ? filteredUsers.length : 0} color="secondary" anchorOrigin={{ vertical: "top", horizontal: "right" }} max={9999}>
               <Chip label="Todos los usuarios" clickable color={filter === "all" ? "success" : "default"} onClick={() => handleFilterChange("all")} icon={<People />} sx={{ m: 1 }} />
            </Badge>
            <Badge badgeContent={filter === "active" ? filteredUsers.length : 0} color="secondary" anchorOrigin={{ vertical: "top", horizontal: "right" }} max={9999}>
               <Chip label="Usuarios activos" clickable color={filter === "active" ? "success" : "default"} onClick={() => handleFilterChange("active")} icon={<CheckCircle />} sx={{ m: 1 }} />
            </Badge>
            <Badge badgeContent={filter === "inactive" ? filteredUsers.length : 0} color="error" anchorOrigin={{ vertical: "top", horizontal: "right" }} max={9999}>
               <Chip label="Usuarios baja" clickable color={filter === "inactive" ? "success" : "default"} onClick={() => handleFilterChange("inactive")} icon={<Cancel />} sx={{ m: 1 }} />
            </Badge>
         </Box>
         <Grid container spacing={2} alignItems="center" mb={2}>
            <Grid item xs={6}>
               <TextField
                  label="Buscar"
                  variant="outlined"
                  fullWidth
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder="Ingresa lo que quieres buscar"
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <Search color="secondary" />
                        </InputAdornment>
                     ),
                  }}
                  sx={{
                     "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                           borderColor: "grey",
                        },
                        "&:hover fieldset": {
                           borderColor: "secondary.main",
                        },
                        "&.Mui-focused fieldset": {
                           borderColor: "secondary.main",
                        },
                     },
                  }}
               />
               {filteredUsers.length === 0 && (
                  <Typography variant="body2" color="textSecondary">
                     No se encontraron resultados.
                  </Typography>
               )}
            </Grid>
            <Grid item xs={3}>
               <Button variant="contained" color="secondary" onClick={exportToExcel} startIcon={<FileDownload />}>
                  Exportar a Excel
               </Button>
            </Grid>
         </Grid>

         <Grid container spacing={2} alignItems="" m={2}>
            <Grid item xs={6}>
               <Box
                  sx={{
                     "margin": "s",
                     "height": "80vh",
                     "width": "100%",
                     ".css-196n7va-MuiSvgIcon-root": {
                        fill: "white",
                     },
                  }}
               >
                  <DataGrid rows={filteredUsers} columns={buildColumns} getRowId={(row) => row.id_usuario} editable={false} slots={{ toolbar: CustomToolbar }} />
               </Box>
            </Grid>

            <Grid item xs={6}>
               <Box sx={{ backgroundColor: "#425977", margin: "0 30px", height: "80vh", overflowY: "auto" }} p={3}>
                  <Grid container spacing={2} py={2} sx={{ backgroundColor: "#15263c", borderRadius: "10px", width: "100%", margin: "auto" }}>
                     <Grid item alignItems={"center"} justifyContent={"center"} sx={{ backgroundColor: "redd" }}>
                        <AvatarImage data={selectedEmpleado?.foto} mds={{ width: " 100px ", height: "100px", margin: "auto", border: "3px solid #00bfff" }} />
                     </Grid>

                     <Grid item xl={7} xs={6} justifyContent={"start"}>
                        <Typography variant="h3">{`${selectedEmpleado?.nombre} ${selectedEmpleado?.apellido_materno} ${selectedEmpleado?.apellido_paterno}`}</Typography>
                        <Typography variant="h5" ml={2} mt={2} color={"#00bfff"}>
                           {selectedEmpleado?.usuario_correo}
                        </Typography>
                        <Typography variant="h5" ml={2} mt={1} color={"secondary"}>
                           {selectedEmpleado?.infoEmpleado?.correo || "SIN CORREO AUN"}
                        </Typography>
                     </Grid>
                  </Grid>

                  <Divider>
                     <Chip label="DATOS PERSONALES" size="small" color="secondary" />
                  </Divider>

                  <Grid container spacing={2} alignItems={"end"}>
                     <Grid item xs={6}>
					 <DatePickerHook fecha={selectedEmpleado?.fecha_nacimiento} setFecha={(fecha) => console.log(fecha)} label={"Fecha Cumpleaños"} />
                     </Grid>
                     <Grid item xs={6}>
                        <TextField sx={{ width: "100%", margin: "0" }} label="NSS" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                     <Grid item xs={6}>
                        <TextField sx={{ width: "100%", margin: "10px 0" }} label="RFC" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="CURP" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>

                
                  <Divider>
                     <Chip label="DATOS DE CONTACTO" size="small" color="secondary" />
                  </Divider>

				  <Grid container spacing={2}>
                     <Grid item xs={6}>
						 <TextField sx={{ width: "100%", margin: "10px 0" }} label="TELÉFEONO" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="CORREO" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>
				  <TextField sx={{ width: "100%", margin: "10px 0" }} label="CONTACTO DE EMERGENCIA" defaultValue={selectedEmpleado?.info_empleado?.rfc} />


				  <Grid container spacing={2}>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="CALLE" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="C.P." defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>
				  <Grid container spacing={3}>
                     <Grid item xs={3}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="NO. INT" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={3}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="NO. EXT" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="COLONIA" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>
				  <Grid container spacing={2}>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="ALCALDIA/MUNICIPIO" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="ESTADO/CIUDAD" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>

                

                 
                  <Divider>
                     <Chip label="DATOS DE CONTRATACIÓN" size="small" color="secondary" />
                  </Divider>

				  <Grid container spacing={2}>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="CARGO" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="PLAZA" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>
				  <Grid container spacing={2}>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="FECHA INGRESO" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="ALTA IMMS" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>
				  <Grid container spacing={2}>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="C. DETERMINADO 1" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="C. DETERMINADO 2" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>
				  <Grid container spacing={2}>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="C. DETERMINADO 3" defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                     <Grid item xs={6}>
					 <TextField sx={{ width: "100%", margin: "10px 0" }} label="C. iINETERMINADO " defaultValue={selectedEmpleado?.info_empleado?.rfc} />
                     </Grid>
                  </Grid>
				  
    
               </Box>
            </Grid>
         </Grid>
      </Box>
   );
}

export default Index;
