import React, { useState } from "react";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Viewer from "react-viewer";
import { red } from "@mui/material/colors";

import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import functionsCustom from "../../../../../../helpers";
import { BiTask } from "react-icons/bi";
import { FaImages } from "react-icons/fa";
import { MdCloudSync } from "react-icons/md";
import "animate.css";
import PlaceIcon from "@mui/icons-material/Place";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useStoreZustand } from "../../../../../../zustan_store/useStoreZustand";
import dayjs from "dayjs";
import { store } from "../../../../../../redux/store";
import axios from "axios";

import { ImCancelCircle } from "react-icons/im";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoLaptop } from "react-icons/io5";
import { FaMobile } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

import { IoDuplicate } from "react-icons/io5";
import useAccountData from "../../../../../../hooks/accountDataHook";

const tasksArray = [
  { idTask: 1, nameTask: "1ra Carta Invitación" },
  { idTask: 2, nameTask: "2da Carta Invitación" },
  { idTask: 3, nameTask: "3ra Carta Invitación" },
  { idTask: 4, nameTask: "Citatorio 1er Requerimiento Obligaciones Omitidas" },
  {
    idTask: 5,
    nameTask: "Notificación 1er Requerimiento Obligaciones Omitidas",
  },
  { idTask: 6, nameTask: "Citatorio 2do Requerimiento Obligaciones Omitidas" },
  {
    idTask: 7,
    nameTask: "Notificación 2do Requerimiento Obligaciones Omitidas",
  },
  { idTask: 8, nameTask: "Citatorio Determinación De Crédito Fiscal" },
  { idTask: 9, nameTask: "Notificación Determinación De Crédito Fiscal" },
  { idTask: 10, nameTask: "Citatorio Mandamiento De Ejecución" },
  { idTask: 11, nameTask: "Notificación Mandamiento De Ejecución" },
  { idTask: 12, nameTask: "Citatorio Requerimiento De Pago" },
  { idTask: 13, nameTask: "Notificación Requerimiento De Pago" },
  { idTask: 14, nameTask: "Remate Y/o Adjudicación" },
  { idTask: 15, nameTask: "Citatorio Reducción De Suministro" },
  { idTask: 16, nameTask: "Notificación Reducción De Suministro" },
  { idTask: 17, nameTask: "Esto Es Una Prueba" },
  { idTask: 18, nameTask: "Sello En Proceso De Restricción De Suministro" },
  { idTask: 19, nameTask: "Restricción Y Sello De Restricción" },
  { idTask: 20, nameTask: "Restricción De Suministro" },
  { idTask: 22, nameTask: "Lectura De Medidor" },
  { idTask: 23, nameTask: "Lona/sello Embargo Precautorio" },
  { idTask: 24, nameTask: "Carta Invitación Ultimo Aviso" },
  { idTask: 25, nameTask: "4ta Carta Invitación" },
];

const findTask = (nameTask) => {
  const findedTask = tasksArray.find((task) => task.nameTask === nameTask);

  return findedTask.idTask;
};

// Puedes usar tasksArray como desees en tu aplicación
console.log(findTask("4ta Carta Invitación"));

function ImageCard({ photoObject }) {
  const {
    getImageData,
    setImageData,
    informationContributorPersonalData,
   
    plazaNumber,
  } = useStoreZustand();
  const{setAccountData} = useAccountData()
  

  const [checked, setChecked] = useState(photoObject.active);
  const [visible, setVisible] = useState(false);
  const [visibleAvatar, setVisibleAvatar] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [valueDateTime, setValueDateTime] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [openDialogSwitch, setOpenDialogSwitch] = React.useState(false);

  const [visibleAvatarSelectBox, setVisibleAvatarSelectbox] =
    React.useState(false);
  const [users, setUsers] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState("");

  const [validateInputs, setValidateInputs] = React.useState({
  
    dateTimeInput: false,
    avatarInput: false,
   
  });

  const changeControl = (event) => {
    // Otras lógicas según sea necesario
    console.log(event);

    setSelectedUserId(event.target.value);
    setValidateInputs((prev) => ({
      ...prev,
      avatarInput: !!event.target.value,
    }));
     
  
  }


 console.log(selectedUserId);
  // Efecto para realizar la solicitud cuando el componente se monta
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Realizar la solicitud GET utilizando Axios
        const response = await axios.get(
          "http://localhost:3000/api/GetUsersByPlaceId"
        );

        // Actualizar el estado con los datos obtenidos
       
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    // Llamar a la función para obtener datos
    fetchData();
  }, []);

  const handleMouseOver = (e) => {
    const element = e.target;
    element.classList.add("animate__animated", "animate__bounce");
  };

  const handleMouseOut = (e) => {
    const element = e.target;
    element.classList.remove("animate__animated", "animate__bounce");
  };

  /*   const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  }; */

  const handleImageDuplication = async () => {
    if (
     
      !validateInputs.avatarInput &&
      !validateInputs.dateTimeInput 
    ) {
      // Muestra un mensaje de error o realiza alguna acción si el archivo no está cargado
      console.error("¡Por favor, te faltan campos por llenar ");
      return;
    }
    const ImageData = {
      imageId: photoObject.image_id,
      account: informationContributorPersonalData.account,
      type: photoObject.image_type,
      user_id: selectedUserId,
      date_capture: valueDateTime.format("YYYY-MM-DD HH:mm:ss"),
      session_user_id: store.getState().user.user_id,
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/api/DuplicatePhoto/${plazaNumber}/`,
        ImageData
      );

      
      const { message} = response.data;

      if (message === "Operación exitosa") {

        const getResponse = await axios.get(
          `http://localhost:3000/api/AccountHistoryByCount/${plazaNumber}/${informationContributorPersonalData.account}/`
        );

        if (getResponse.status === 200) {
          const accountHistory = getResponse.data;
          console.log('Account History:', accountHistory);

          setAccountData(accountHistory); 
          setValidateInputs({
  
            dateTimeInput: false,
            avatarInput: false,
           
          })
          // Aquí puedes hacer lo que necesites con los datos obtenidos
         /*  return accountHistory; */
        } else {
          console.error('Error obteniendo datos de la cuenta:', getResponse.status, getResponse.data);
          // Puedes lanzar una excepción, devolver un objeto de error, o manejarlo de otra manera según tus necesidades
          throw new Error('Error obteniendo datos de la cuenta');
        }

        
        
         

     
      } else {
        console.error("Error en la operación:", response.data.message);
      }
    } catch (error) {
      console.error("Error al enviar datos al backend:", error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  /* console.log(getImageData); */
  const handleChangeDateTime = (newValue) => {
    setValueDateTime(newValue);
    setImageData({
      fechaCaptura: newValue.format("YYYY-MM-DD HH:mm:ss"), // Usa selectedValue en lugar de task
    });
    setValidateInputs((prev) => ({
      ...prev,
      dateTimeInput: !!newValue,
    }));
  };

  const handleCheckboxChange = (
    imageId,
    newCheckedState,
    userId,
    setChecked
  ) => {
    const payload = {
      imageId,
      active: newCheckedState ? 1 : 0,
      userId,
    };

    // Send PATCH request using Axios
    axios
      .patch("http://localhost:3000/api/UpdatePhotoState", payload)
      .then((response) => {
        // Handle the response if needed
        console.log(response.data.message);
        if (response.data.message === "Operación exitosa") {
          setShowSuccessAlert(true);
        }
        console.log(response.data);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error updating photo state:", error);
      });

    // Update local state if needed
    setChecked(newCheckedState);
  };

 

  // Utilizamos un conjunto para almacenar user_ids únicos
  const uniqueUserIds = new Set();

  // Filtramos el array original para eliminar duplicados
  const uniqueUsers = users.filter((user) => {
    // Verificamos si el user_id ya está en el conjunto
    if (uniqueUserIds.has(user.user_id)) {
      return false; // Duplicado, no incluir en el array resultante
    }

    // Agregamos el user_id al conjunto
    uniqueUserIds.add(user.user_id);

    return true; // No es un duplicado, incluir en el array resultante
  });

  return (
    <Card
      sx={{
        maxWidth: 285,
        minWidth: 200,
        minHeight: 200,
        width: "100%",
        /* backgroundColor: checked ? "black" : "rgba(0,0,0,0.4)", */
      }}
    >
      {showSuccessAlert && (
        <Alert severity={checked ? "success" : "warning"}>
          <AlertTitle>{checked ? "Èxito" : "Advertencia"}</AlertTitle>
          ¡El estado de la imagen se actualizó correctamente! Estado actual:{" "}
          {checked ? "Activa" : "Inactiva"}
        </Alert>
      )}
      <CardHeader
        avatar={
          <Avatar
            onClick={() => {
              setVisibleAvatar(true);
            }}
            src={photoObject.photo_person_who_capture}
            aria-label="recipe"
          >
            R
          </Avatar>
        }
        action={
          <>
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleOpenDialog}>
                <ListItemIcon>
                  <IoDuplicate fontSize="small" />
                </ListItemIcon>
                <ListItemText>Duplicar</ListItemText>
                {/*   <Typography variant="body2" color="text.secondary">
            ⌘X
          </Typography> */}
              </MenuItem>
            </Menu>
          </>
        }
        title={photoObject.person_who_capture}
        subheader={functionsCustom.formatDate(photoObject.synchronization_date, "full")}
        /* subheader={functionsCustom.formatDate(photoObject.dateCapture, "full")} */
      />
      <Viewer
        visible={visibleAvatar}
        onClose={() => {
          setVisibleAvatar(false);
        }}
        images={[
          {
            src: photoObject.photo_person_who_capture,
            alt: photoObject.image_type,
          },
        ]}
      />
      <Box sx={{ position: "relative" }}>
        <Checkbox
          checked={checked}
          onChange={() => setOpenDialogSwitch(true)}
          sx={{ position: "absolute", right: "0" }}
          icon={<ToggleOffIcon fontSize="large" />}
          checkedIcon={
            <ToggleOnIcon
              fontSize="large"
              color={checked ? "secondary" : "warning"}
            />
          }
        />

        <Chip
          icon={checked ? <TiTick /> : <ImCancelCircle />}
          size="small"
          sx={{
            position: "absolute",
            marginTop: "0.5rem",
            marginLeft: "0.5rem",
          }}
          label={checked ? "Activo" : "Inactivo"}
          color={checked ? "secondary" : "warning"}
        />
        <CardMedia
          component="img"
          image={photoObject.image_url}
          alt={photoObject.image_type}
          sx={{ height: "150px" }}
          onClick={() => {
            setVisible(true);
          }}
        />
        <Viewer
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          images={[{ src: photoObject.image_url, alt: photoObject.image_type }]}
        />
      </Box>
      <CardContent>
        <List dense={true}>
          <ListItem>
            <ListItemIcon sx={{ color: "#5EBFFF" }}>
              <FaImages />
            </ListItemIcon>
            <ListItemText
              sx={{ color: "#5EBFFF" }}
              primary="Tipo de Imagen"
              secondary={`${photoObject.image_type}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ color: "#5EBFFF" }}>
              <BiTask />
            </ListItemIcon>
            <ListItemText
              sx={{ color: "#5EBFFF" }}
              primary="Tarea"
              secondary={`${photoObject.task_done}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ color: "#5EBFFF" }}>
              <MdCloudSync
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              />
            </ListItemIcon>
            <ListItemText
              sx={{ color: "#5EBFFF" }}
              primary="Fecha de ingeso al sistema"
              /* secondary={`${functionsCustom.formatDate(
                photoObject.synchronizationDate,
                "full"
              )}`} */
              secondary={`${functionsCustom.formatDate(
                photoObject.date_capture,
                "full"
              )}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ color: "#5EBFFF" }}>
              {photoObject.type_load === "0" ? <FaMobile /> : <IoLaptop />}
            </ListItemIcon>
            <ListItemText
              sx={{ color: "#5EBFFF" }}
              primary="Plataforma"
              secondary={
                photoObject.type_load === "0" ? "SER0 MOBIL" : "SER0 WEB"
              }
            />
          </ListItem>
        </List>
      </CardContent>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Duplicar Imagen</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* id_tarea */}
              {/*  <SelectBox
                hasFetchData={true}
                title={"Tarea"}
                array={""}
                field={"idTarea"}
              /> */}
              {/* Fecha */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={2} sx={{ minWidth: 200, marginTop: "1rem" }}>
                  <DateTimePicker
                    value={valueDateTime}
                    onChange={handleChangeDateTime}
                    referenceDate={dayjs("2022-04-17T15:30")}
                  />
                  <Typography>
                    Stored value:{" "}
                    {valueDateTime == null
                      ? "null"
                      : valueDateTime.format("YYYY-MM-DD HH:mm:ss")}
                  </Typography>
                </Stack>
              </LocalizationProvider>
              {validateInputs.dateTimeInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
                          ¡Gracias por ingresar una fecha!
                  </Typography></Stack> : (
                  <Typography sx={{ color: "red" }} variant="caption">
                    * ¡Por favor, ingresa una fecha!
                  </Typography>
                )}
              {/*  Tipo Imagen*/}
            </Grid>
            <Grid item xs={6}>
              <TextField
                color="secondary"
                id="filled-select-user"
                select
                label="Usuario"
                /*   InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PlaceIcon />
            </InputAdornment>
          ),
        }} */
                variant="filled"
                sx={{ width: "230px" }}
                value={selectedUserId}
                onChange={changeControl}
              >
                {uniqueUsers.map((user, index) => {
                  return (
                    <MenuItem key={user.user_id} value={user.user_id}>
                      <IconButton>
                        <Avatar
                          alt={user.name}
                          src={user.photo_user}
                          sx={{ width: 24, height: 24 }}
                        />
                      </IconButton>

                      {user.name}
                    </MenuItem>
                  );
                })}
              </TextField>
              {validateInputs.avatarInput? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
                          ¡Gracias por ingresar un usuario!
                  </Typography></Stack> : (
                  <Typography sx={{ color: "red" }} variant="caption">
                    * ¡Por favor, ingresa una user!
                  </Typography>
                )}
              {/* <SelectBox
              
                hasFetchData={false}
                title={"TipoImagen"}
                array={[
                  {
                    value: "Carta invitación fachada predio",
                    name: "Carta invitación fachada predio",
                  },
                  {
                    value: "Carta invitación evidencia",
                    name: "Carta invitación evidencia",
                  },
                ]}
                field={"tipo"}
              /> */}
              {/* Url Imagen*/}
              {/*   <Input 
              sx={{marginTop:"1rem"}}
                type="file"
                onChange={handleFileChange}
                startAdornment={
                  <InputAdornment position="start">
                    <IconButton component="label" color="primary">
                      <FaCloudUploadAlt />
                    </IconButton>
                  </InputAdornment>
                }
              /> */}

              {/* Activo */}

              {/* id_servicio */}
              {/*  <SelectBox
                hasFetchData={false}
                title={"Servicio"}
                array={[
                  { value: 1, name: "Agua" },
                  { value: 2, name: "Predio" },
                ]}
                field={"id_servicio"}
              /> */}
            </Grid>
          </Grid>
          {/* Cuenta */}
        </DialogContent>
        <DialogActions>
          <Button
            endIcon={<IoDuplicate />}
            onClick={handleImageDuplication}
            color="secondary"
          >
            Duplicar Archivo
          </Button>
          <Button
            onClick={handleCloseDialog}
            endIcon={<ImCancelCircle />}
            color="secondary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialogSwitch}
        onClose={() => setOpenDialogSwitch(false)}
        aria-labelledby="alert-dialog-title_estate"
        aria-describedby="alert-dialog-description_estate"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Está seguro de cambiar el estado?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description_estate">
            Este cambio afectará el estado de la imagen. ¿Está seguro de
            continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            startIcon={<FaRegCircleCheck />}
            onClick={() => {
              setOpenDialogSwitch(false);
              // Ejecuta la acción al confirmar
              const newCheckedState = !checked; // Invierte el estado actual
              handleCheckboxChange(
                photoObject.image_id,
                newCheckedState,
                store.getState().user.user_id,
                setChecked
              );
            }}
            autoFocus
          >
            Confirmar
          </Button>
          <Button
            color="secondary"
            onClick={() => setOpenDialogSwitch(false)}
            startIcon={<ImCancelCircle />}
          >
            Cancelar{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default ImageCard;
