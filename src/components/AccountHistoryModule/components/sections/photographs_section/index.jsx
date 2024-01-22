import React from "react";
import ImageCard from "./components/ImageCard";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useStoreZustand } from "../../../../../zustan_store/useStoreZustand";

import { BiSolidImageAdd } from "react-icons/bi";
import SelectBox from "./components/SelectBox";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FaCloudUploadAlt } from "react-icons/fa";
import dayjs from "dayjs";
import axios from "axios";
import { store } from "../../../../../redux/store";
import AWS from "aws-sdk";
import { ImCancelCircle } from "react-icons/im";
import { FaRegCircleCheck } from "react-icons/fa6";
import { GrUploadOption } from "react-icons/gr";
import { useSelector } from "react-redux";
import functionsCustom from "../../../../../helpers";
import useAccountData from "../../../../../hooks/accountDataHook";
import useCombinedSlices from "../../../../../hooks/useCombinedSlices";


const AWS_BUCKET_NAME = "bucket-files-msg";
const AWS_BUCKET_REGION = "us-east-2";
const AWS_PUBLIC_KEY = "AKIAT5FEWJS6OYP6WLHR";
const AWS_SECRET_KEY = "Soirilyzbm7tzjzYRq/B+ZPCXMt73eTisIARzrlf";




// Use these variables wherever needed in your application


AWS.config.update({
  accessKeyId: AWS_PUBLIC_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_BUCKET_REGION,
});

const s3 = new AWS.S3();
const bucketName = AWS_BUCKET_NAME;

const checkFileExists = async (fileName) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    await s3.headObject(params).promise();
    return fileName; // El archivo existe
  } catch (error) {
    if (error.code === "NotFound") {
      return false; // El archivo no existe
    }

    throw error; // Otro error
  }
};

const uploadFile = async (selectedFile, remoteFileName, maxFileSizeMB = 1) => {
  try {
    // Verificar el tamaño del archivo
    const fileSizeBytes = selectedFile.size;
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024; // Convertir MB a bytes

    if (fileSizeBytes > maxFileSizeBytes) {
      throw new Error(
        `El archivo excede el tamaño máximo permitido de ${maxFileSizeMB} MB.`
      );
    }

    // Leer el contenido del archivo como un ArrayBuffer
    const fileContent = await selectedFile.arrayBuffer();

    // Configurar los parámetros para la carga
    const params = {
      Bucket: bucketName,
      Key: remoteFileName,
      Body: fileContent,
    };

    // Realizar la carga del archivo
    const result = await s3.upload(params).promise();
    return result;
  } catch (error) {
    console.error("Error al cargar el archivo a AWS S3:", error);
    throw error; // Puedes lanzar el error nuevamente si es necesario
  }
};

const signUrl = async (
  fileName,
  operation = "getObject",
  expirationTimeInSeconds = 604800
) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: expirationTimeInSeconds,
  };

  try {
    // Puedes personalizar la operación según tus necesidades
    const signedUrl = await s3.getSignedUrlPromise(operation, params);
    return signedUrl;
  } catch (error) {
    console.error("Error al generar la URL firmada:", error);
    throw error;
  }
};

/* const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  })); */
function PhotographsSections() {
  const isUploadingRef = React.useRef(false);
  const {
    getImageData,
    setImageData,
    
    /* setAccountData, */
    plazaNumber,
    /* photos, */
  } = useStoreZustand();
  const {photos,informationContributor}=useCombinedSlices()

  const { setAccountData } = useAccountData();

  console.log(photos);

  const user = useSelector((state) => state.user);
  console.log(user);

  const [open, setOpen] = React.useState(false);
  const [openDialogForm, setOpenDialogForm] = React.useState(false);
  const [valueDateTime, setValueDateTime] = React.useState(null);

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [signedUrl, setSignedUrl] = React.useState(null);
  const [imageURL, setImageURL] = React.useState(null);
  /* const [openBackdrop, setOpenBackdrop] = React.useState(false); */
  /* const [isUploading, setIsUploading] = React.useState(false); */
  const [users, setUsers] = React.useState([]);
  const [selectedUserId, setSelectedUserId] = React.useState("");
  const [validateInputs, setValidateInputs] = React.useState({
    inputFile: false,
    dateTimeInput: false,
    avatarInput: false,
    taskInput: false,
    typeInput: false,
    serviceInput: false,
  });
  const changeControl = (event) => {
    // Otras lógicas según sea necesario
    console.log(event);

    setSelectedUserId(event.target.value);
    setValidateInputs((prev) => ({
      ...prev,
      avatarInput: !!event.target.value,
    }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenDialogForm = () => {
    setOpenDialogForm(true);
  };
  const handleClickCloseDialogForm = () => {
    setOpenDialogForm(false);
    setOpen(false);
  };

  const handleChangeDateTime = (newValue) => {
    setValueDateTime(newValue);
    setImageData({
      date_capture: newValue.format("YYYY-MM-DD HH:mm:ss"), // Usa selectedValue en lugar de task
    });
    setValidateInputs((prev) => ({
      ...prev,
      dateTimeInput: !!newValue,
    }));
  };

  const [fileLoaded, setFileLoaded] = React.useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setImageURL(url);

    setSelectedFile(file);
    setValidateInputs((prev) => ({
      ...prev,
      inputFile: !!file,
    }));
  };

  const [imageDataNew, setImageDataNew] = React.useState({
    //ya
    account: "",
    user_id: "",
    namePhoto: "",
    task_id: "",
    date_capture: "",
    type: "",
    imageUrl: "",
    active: 1,
    service_id: "",
    session_user_id: "",
  });

  React.useEffect(() => {
    // This block of code will run after the state update is complete
    console.log(imageDataNew);

    const postImageData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/InsertPhoto/${plazaNumber}/`,
          imageDataNew
        );
      } catch (error) {
        // Handle errors
        console.error("Error:", error);
      }
    };

    // Check if the necessary data is present before making the POST request
    if (
      imageDataNew.account &&
      imageDataNew.user_id &&
      imageDataNew.namePhoto &&
      imageDataNew.imageUrl &&
      imageDataNew.active &&
      imageDataNew.service_id &&
      imageDataNew.session_user_id
    ) {
      postImageData();
    }
  }, [
    imageDataNew.account,
    imageDataNew.user_id,
    imageDataNew.namePhoto,
    imageDataNew.imageUrl,
    imageDataNew.active,
    imageDataNew.service_id,
    imageDataNew.session_user_id,
  ]);

  const handleFileUpload = async () => {
    if (
      !validateInputs.inputFile &&
      !validateInputs.avatarInput &&
      !validateInputs.dateTimeInput &&
      !validateInputs.serviceInput &&
      !validateInputs.taskInput &&
      !validateInputs.typeInput
    ) {
      // Muestra un mensaje de error o realiza alguna acción si el archivo no está cargado
      console.error("¡Por favor, te faltan campos por llenar ");
      return;
    }

    try {
      const fechaActual = new Date();
      const fileName = `${
        informationContributor[0].account
      }${functionsCustom.formatDate(fechaActual, "full")}`;
      const remoteFileName = fileName;

      // Subir el archivo al servidor
      await uploadFile(selectedFile, remoteFileName, 1);

      // Obtener la URL firmada para el archivo
      const signedUrl = await signUrl(remoteFileName);
      setSignedUrl(signedUrl);
      

      // Actualizar el estado con los datos de la imagen
      setImageDataNew((prevImageData) => ({
        ...prevImageData,
        account: informationContributor[0].account,
        user_id: selectedUserId,
        session_user_id: store.getState().user.user_id,
        namePhoto: remoteFileName,
        imageUrl: signedUrl,
        active: 1,
      }));

      setSignedUrl(null);
      setSelectedFile(null);
     

      try {
        const getResponse = await axios.get(
          `http://localhost:3000/api/AccountHistoryByCount/${plazaNumber}/${informationContributor[0].account}/`
        );

        if (getResponse.status === 200) {
          const accountHistory = getResponse.data;
          console.log("Account History:", accountHistory);
          // Update the state with the new account data
          setAccountData(accountHistory);

          setValidateInputs({
            inputFile: false,
            dateTimeInput: false,
            avatarInput: false,
            taskInput: false,
            typeInput: false,
            serviceInput: false,
          })

          setSignedUrl(null);
          setSelectedFile(null);
          handleClickCloseDialogForm();
        } else {
          console.error(
            "Error obtaining account data:",
            getResponse.status,
            getResponse.data
          );
          throw new Error("Error obtaining account data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /*  try {
      if (isUploadingRef.current || !selectedFile) {
        console.warn("La carga ya está en curso o no se ha seleccionado ningún archivo.");
        return;
      }

      isUploadingRef.current = true;
      const fechaActual = new Date();

      const fileName = `${
        informationContributorPersonalData.account
      }${functionsCustom.formatDate(fechaActual, "full")}`;
      const remoteFileName = fileName;

      await uploadFile(selectedFile, remoteFileName, 1);

      const signedUrl = await signUrl(remoteFileName);
      setSignedUrl(signedUrl);

      setImageData({
        account: informationContributorPersonalData.account,
        user_id: selectedUserId,
        session_user_id: store.getState().user.user_id,
        namePhoto: remoteFileName,
        imageUrl: signedUrl,
      });

      setSignedUrl(null);
      setSelectedFile(null);
      setOpenDialogForm(false);
      setOpen(false);
    } catch (error) {
      // Manejar el error...
    } finally {
      isUploadingRef.current = false;
    }
  };

  React.useEffect(() => {
    console.log("Ejecutando useEffect");
    if (
      getImageData.account &&
      getImageData.user_id &&
      getImageData.namePhoto &&
      getImageData.imageUrl &&
      getImageData.session_user_id
    ) {
      // Verificar si ya se envió una solicitud
      if (!isUploadingRef.current) {
        // Enviar datos al backend solo si no se ha enviado previamente
        const sendDataToBackend = async () => {
          try {
            const response = await axios.post(
              `http://localhost:3000/api/InsertPhoto/${plazaNumber}/`,
              getImageData
            );

            const { message, lastRecord, account } = response.data;

            if (message === "Operación exitosa") {
              // Restablecer el estado después de realizar todas las operaciones
              setImageData({
                account: "",
                user_id: "",
                namePhoto: "",
                task_id: "",
                date_capture: "",
                type: "",
                imageUrl: "",
                active: 1,
                service_id: "",
                session_user_id: "",
              });
              setSignedUrl(null);
              setSelectedFile(null);
            } else {
              console.error("Error en la operación:", response.data.message);
            }
          } catch (error) {
            console.error("Error al enviar datos al backend:", error);
          }
        };

        sendDataToBackend();
      }
    }
  }, [getImageData]);
  

  console.log(getImageData); */

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Realizar la solicitud GET utilizando Axios
        const response = await axios.get(
          "http://localhost:3000/api/GetUsersByPlaceId"
        );

        // Actualizar el estado con los datos obtenidos
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    // Llamar a la función para obtener datos
    fetchData();
  }, []);
  return (
    <>
      {/* <h1>ddd</h1> */}

      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        sx={{
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem",
        }}
        spacing={2}
      >
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <ImageCard key={photo.image_url} photoObject={photo} />
          ))
        ) : (
          <Typography variant="h3" gutterBottom>
            No hay fotos disponibles
          </Typography>
        )}
      </Stack>
      {/* <Stack direction="row"
    divider={<Divider orientation="vertical" flexItem />}
    spacing={2}>
        
        
  <ImageCard/>
  <ImageCard/>
  <ImageCard/>
        
    </Stack> */}
      <Fab onClick={handleClickOpen} color="secondary" aria-label="add">
        <BiSolidImageAdd size={26} />
      </Fab>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Información"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Deseas agregar una nueva imagen?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              onClick={handleClickOpenDialogForm}
              startIcon={<FaRegCircleCheck />}
            >
              Confirmar
            </Button>
            <Button
              color="secondary"
              onClick={handleClose}
              autoFocus
              startIcon={<ImCancelCircle />}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {openDialogForm && (
        <Dialog open={openDialogForm} onClose={handleClickCloseDialogForm}>
          <DialogTitle>Subir Imagen</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
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
                  sx={{ width: "100%" }}
                  value={selectedUserId}
                  onChange={changeControl}
                >
                  {users.map((user, index) => {
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
                {validateInputs.avatarInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
                          ¡Gracias por ingresar un usuario!
                  </Typography></Stack> : (
                  <Typography sx={{ color: "red" }} variant="caption">
                    * ¡Por favor, ingresa un usuario!
                  </Typography>
                )}
                {/* id_tarea */}
                <SelectBox
                  hasFetchData={true}
                  title={"Tarea"}
                  array={""}
                  field={"idTarea"}
                  setImageDataNew={setImageDataNew}
                  imageDataNew={imageDataNew}
                  setValidateInputs={setValidateInputs}
                />
                {validateInputs.taskInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
                          ¡Gracias por ingresar una tarea!
                  </Typography></Stack> : (
                  <Typography sx={{ color: "red" }} variant="caption">
                    * ¡Por favor, ingresa una tarea!
                  </Typography>
                )}
                {/* Fecha */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={2} sx={{ minWidth: 200, marginTop: "1rem" }}>
                    <DateTimePicker
                      value={valueDateTime}
                      onChange={handleChangeDateTime}
                      referenceDate={dayjs("2023-11-23T09:53:16.000").format(
                        "YYYY-MM-DDTHH:mm:ss.SSS"
                      )}
                    />
                    <Typography>
                      Stored value:{" "}
                      {valueDateTime == null
                        ? "null"
                        : valueDateTime.format("YYYY-MM-DD HH:mm:ss.SSS")}
                    </Typography>
                  </Stack>
                </LocalizationProvider>
                {validateInputs.dateTimeInput ?   <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
                          ¡Gracias por ingresar una fecha!
                  </Typography></Stack> : (
                  <Typography sx={{ color: "red" }} variant="caption">
                    * ¡Por favor, ingresa una fecha!
                  </Typography>
                )}
                {/*  Tipo Imagen*/}
              </Grid>
              <Grid item xs={6}>
                <SelectBox
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
                  setImageDataNew={setImageDataNew}
                  imageDataNew={imageDataNew}
                  setValidateInputs={setValidateInputs}
                />
                {validateInputs.typeInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
                          ¡Gracias por cargar un tipo de tarea!
                  </Typography></Stack> : (
                  <Typography sx={{ color: "red" }} variant="caption">
                    * ¡Por favor, ingresa un tipo de tarea!
                  </Typography>
                )}
                {/* Url Imagen*/}
                <Input
                  sx={{ marginTop: "1rem" }}
                  type="file"
                  onChange={handleFileChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <IconButton component="label" color="primary">
                        <FaCloudUploadAlt />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {imageURL ? (
                  <img
                    src={imageURL}
                    alt="prueba"
                    style={{
                      width: "100%",
                      marginTop: "1rem",
                      height: "150px",
                    }}
                  />
                ) : (
                  <Typography variant="body1">
                    No hay imagen disponible
                  </Typography>
                )}
                {validateInputs.inputFile ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
                          ¡Gracias por cargar una imagen!
                  </Typography></Stack> : (
                  <Typography sx={{ color: "red" }} variant="caption">
                    * ¡Por favor, carga una foto!
                  </Typography>
                )}
                {/* Resto del código... */}

                {/* Activo */}

                {/* id_servicio */}
                <SelectBox
                  hasFetchData={false}
                  title={"Servicio"}
                  array={[
                    { value: 1, name: "Agua" },
                    { value: 2, name: "Predio" },
                  ]}
                  field={"id_servicio"}
                  setImageDataNew={setImageDataNew}
                  imageDataNew={imageDataNew}
                  setValidateInputs={setValidateInputs}
                />
                {validateInputs.serviceInput ? <Stack sx={{marginTop:"0.5rem"}} direction="row"><FaRegCircleCheck style={{color:"#14B814"}}/>{" "} <Typography  color={"secondary"} variant="caption">
                          ¡Gracias por ingresar un servicio!
                  </Typography></Stack> : (
                  <Typography sx={{ color: "red" }} variant="caption">
                    * ¡Por favor, ingresa un servicio!
                  </Typography>
                )}
              </Grid>
            </Grid>
            {/* Cuenta */}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleFileUpload}
              color="secondary"
              startIcon={<GrUploadOption />}
            >
              Subir Archivo
            </Button>
            <Button
              onClick={handleClickCloseDialogForm}
              color="secondary"
              startIcon={<ImCancelCircle />}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default PhotographsSections;
