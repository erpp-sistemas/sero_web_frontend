import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import { getAllServices } from "../../../../api/service";
import { getAllProcesses } from "../../../../api/process";
import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import { TabPanel } from "@mui/lab";
import {
  createPlace,
  createPlaceAndServiceAndProcess,
  getAllPlaces,
  getPlaceAndServiceAndProcess,
} from "../../../../api/place";
import PlaceIcon from "@mui/icons-material/Place";
import { getPlaceAndServiceAndProcessByUser } from "../../../../api/user";
import { uploadToS3 } from "../../../../services/s3.service";

function PlacesForm() {
  const [fileList, setFileList] = React.useState([]);
  const [nextStep, setNextStep] = React.useState(0);
  const [placesAndServicesAndProcess, setPlacesAndServicesAndProcess] =
    React.useState([]);
  const [GetProcesses, SetProcesses] = React.useState([]);
  const [placeData, setPlaceData] = React.useState({
    namePlace: "",
    active: "",
    imageUrl: "",
  });
  const [value, setValue] = React.useState(0);
  const [fotoUsuario, setFotoUsuario] = React.useState("");
  const [datosGenerales, setDatosGenerales] = React.useState({
    nombre: "",
    foto: "",
    active: "",
    latitud: "",
    longitud: "",
    entidad_federativa: "",
    radio: "",
  });
  const [snackbar, setSnackbar] = React.useState(null);


  const handleChangeInput = (e) => {
    const { name, value, type, checked } = e.target;
    // Actualiza el estado serviceData con el nuevo valor del campo Servicio
    const newValue = type === "checkbox" ? checked : value;
    setDatosGenerales((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const fetchImage = async () => {
    console.log("aqui prueba 1");
    // Fetch your base64 image URL from fileList[0].thumbUrl
    /*  if (!fileList || fileList.length === 0) {
      console.error("File list is empty or undefined.");
      return;
    } */
    const base64Image = fileList[0]?.thumbUrl;
 
    if (base64Image) {
     
      try {
        const file = await convertBase64ToFile(base64Image, fileList[0].name);
        // Now you have the File object, you can do something with it
        if (file) {
          const fileUrl = await uploadToS3(file);
          console.log("URL del archivo subido:", fileUrl);

          setFotoUsuario(fileUrl);

          setDatosGenerales({
            ...datosGenerales,
            foto: fileUrl, // Utiliza 'fileUrl' directamente aquí
          });
        }
      } catch (error) {
        console.error("Error converting base64 to file:", error);
      }
    }
  };

  async function convertBase64ToFile(base64Image, filename) {
    const response = await fetch(base64Image);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  React.useEffect(() => {
    fetchImage();
  }, [fileList[0]?.thumbUrl]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOnChangeProcess = (event, process, value, service) => {
    const { checked } = event.target;
    if (checked) {
      SetProcesses((prevProcesses) => [
        ...prevProcesses,
        {
          id_proceso: process.id_proceso,
          id_servicio: service[0].id_servicio,
          id_plaza: service[0].id_plaza,
        },
      ]);
    } else {
      SetProcesses((prevProcesses) =>
        prevProcesses.filter((item) => item.id_proceso !== process.id_proceso)
      );
    }
  };

  console.log(GetProcesses);

  const steps = ["Datos de la Plaza", "Seleccion de Servicios"];
  const handleNextStep = () => {
    setNextStep((prevStep) => prevStep + 1);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const label = "ratel";

  const [services, setServices] = React.useState([]);
  const [processes, setProcesses] = React.useState([]);
  const [places, setPlaces] = React.useState([]);
  const [serviceByPlace, setServiceByPlace] = React.useState([]);

  /* getAllPlaces */
  /*  getPlaceAndServiceAndProcessByUser */
  const fetchGetPlaceAndServiceAndProcess = async (idPlaza) => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getPlaceAndServiceAndProcess(idPlaza);

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_servicio || index.toString(),
      }));

      setPlacesAndServicesAndProcess(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPlaces = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllPlaces();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_servicio || index.toString(),
      }));

      setPlaces(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchServices = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllServices();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_servicio || index.toString(),
      }));

      setServices(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchProcesses = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllProcesses();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_proceso,
      }));

      setProcesses(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchProcesses();
    fetchServices();
    fetchPlaces();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (serviceByPlace?.id_plaza) {
        try {
          const response = await fetchGetPlaceAndServiceAndProcess(
            serviceByPlace?.id_plaza
          );
          // Puedes realizar alguna lógica con la respuesta aquí
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [serviceByPlace]);

  const handleCheckboxChange = (event, value, service, place) => {
    const { checked } = event.target;

    const { id_servicio } = service;

    // Create a new object with the updated values
    const updatedService = {
      id_plaza: place,
      id_servicio: checked ? id_servicio : "",
    };

    // Update the state with the new object added to the array
    setServiceByPlace((prevServiceByPlace) => {
      if (checked) {
        // If the checkbox is checked, add the new object to the array
        return [...prevServiceByPlace, updatedService];
      } else {
        // If the checkbox is unchecked, remove the object from the array
        return prevServiceByPlace.filter(
          (item) => item.id_servicio !== id_servicio
        );
      }
    });
  };

  console.log(serviceByPlace);

  /* 
  const handleOnChangeProcess = async(event, process) => {

    const { checked } = event.target;
    
     
    if (checked) {
     
      setServiceByPlace((prevState) => ({
        ...prevState,
        id_proceso: process?.id_proceso,
      }));

      const response =await createPlaceAndServiceAndProcess({
        id_proceso:serviceByPlace.id_proceso,
        id_plaza:serviceByPlace.id_plaza,
        id_servicio:serviceByPlace.id_servicio,
      })

    }

    // Realiza la lógica que necesites con el cambio en el checkbox
  };
 */

  const handleCloseSnackbar = () => setSnackbar(null);
    const handleCreatePlace = async()=>{
    
        try {
          console.log("Before createPlace");
          const response = await createPlace({
            nombre: datosGenerales.nombre,
            imagen: datosGenerales.foto,
            activo: datosGenerales.active,
            latitud: datosGenerales.latitud,
            longitud: datosGenerales.longitud,
            estado_republica: datosGenerales.entidad_federativa,
            radius: datosGenerales.radio,
          });
          console.log("After createPlace", response);
          setSnackbar({
            children: `Se creó la plaza ${datosGenerales.nombre} con éxito`,
            severity: "success",
          });
        } catch (error) {
          console.error("Error al crear la plaza:", error);
          setSnackbar({
            children: `Error al crear la plaza: ${error.message || JSON.stringify(error)}`,
            severity: "error",
          });
        }
     
       
       

      handleNextStep();

    }
  return (
    <>
      {" "}
      <Stepper activeStep={nextStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row" /* ,border:"1px solid white" */,
        }}
      >
        {nextStep === 0 && (
          <>
            <Box sx={{ width: "50%", marginLeft: "1rem", marginRight: "1rem" }}>
              <TextField
                sx={{ width: "100%", my: "1rem" }}
                name="nombre"
                id="input-with-icon-textfield"
                label="Nombre de la nueva plaza"
                onChange={handleChangeInput}
                value={datosGenerales?.nombre}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                color="secondary"
              />
              <TextField
                sx={{ width: "100%", my: "1rem" }}
                name="latitud"
                id="input-with-icon-textfield"
                label="Latitud"
                onChange={handleChangeInput}
                value={datosGenerales?.latitud}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                color="secondary"
              />
              <TextField
                sx={{ width: "100%", my: "1rem" }}
                name="longitud"
                id="input-with-icon-textfield"
                label="Longitud"
                onChange={handleChangeInput}
                value={datosGenerales?.longitud}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                color="secondary"
              />
              <TextField
                sx={{ width: "100%", my: "1rem" }}
                name="entidad_federativa"
                id="input-with-icon-textfield"
                label="Estado de la Republica"
                onChange={handleChangeInput}
                value={datosGenerales?.entidad_federativa}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                color="secondary"
              />
              <TextField
                sx={{ width: "100%", my: "1rem" }}
                name="radio"
                id="input-with-icon-textfield"
                label="Radio"
                onChange={handleChangeInput}
                value={datosGenerales?.radio}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                color="secondary"
              />
            </Box>
            <Box sx={{ width: "30%" }}>
              <ImgCrop rotationSlider>
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                >
                  {fileList.length < 1 && "+ Upload"}
                </Upload>
              </ImgCrop>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Checkbox
                  onChange={handleChangeInput}
                  name="active"
                  color="secondary"
                  {...label}
                />
                <Typography>Estatus de la plaza</Typography>
              </Box>
            </Box>
          </>
        )}

        {nextStep === 1 && (
          <>
            <Box
              sx={{
                border: "solid white 1px",
                width: "100%",
                height: "450px",
                padding: "1rem",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="icon tabs example"
              >
                {places.map((place) => {
                  return (
                    <Tab
                      icon={<PlaceIcon />}
                      aria-label="phone"
                      label={`${place.nombre}`}
                    />
                  );
                })}
              </Tabs>
              {value === 0 && (
                <>
                  {" "}
                  <Box
                    sx={{
                      border: "solid white 1px",
                      width: "100%",
                      padding: "1rem",
                    }}
                  >
                    <Typography>{`Servicios de la plaza ${places[value]?.nombre}`}</Typography>
                    <FormGroup>
                      {services.map((service, index) => {
                        return (
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() => {
                                  handleCheckboxChange(
                                    event,
                                    value,
                                    service,
                                    places[value].id_plaza
                                  );
                                }}
                                color="secondary"
                              />
                            }
                            label={`${service.nombre}`}
                          />
                        );
                      })}
                    </FormGroup>
                  </Box>
                  {serviceByPlace[0]?.id_plaza === 1 &&
                    serviceByPlace[0]?.id_servicio === 1 && (
                      <>
                        {" "}
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          {" "}
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace[0]?.id_servicio) - 1]
                              ?.nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={() => {
                                        handleOnChangeProcess(
                                          event,
                                          process,
                                          value,
                                          serviceByPlace
                                        );
                                      }}
                                      color="secondary"
                                    />
                                  }
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace[0]?.id_plaza === 1 &&
                    serviceByPlace[0]?.id_servicio === 2 && (
                      <>
                        {" "}
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          {" "}
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace[0]?.id_servicio) - 1]
                              ?.nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={() => {
                                        handleOnChangeProcess(
                                          event,
                                          process,
                                          value,
                                          serviceByPlace
                                        );
                                      }}
                                      color="secondary"
                                    />
                                  }
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace[0]?.id_plaza === 1 &&
                    serviceByPlace[0]?.id_servicio === 3 && (
                      <>
                        {" "}
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          {" "}
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace[0]?.id_servicio) - 1]
                              ?.nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={() => {
                                        handleOnChangeProcess(
                                          event,
                                          process,
                                          value,
                                          serviceByPlace
                                        );
                                      }}
                                      color="secondary"
                                    />
                                  }
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace[0]?.id_plaza === 1 &&
                    serviceByPlace[0]?.id_servicio === 4 && (
                      <>
                        {" "}
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          {" "}
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace[0]?.id_servicio) - 1]
                              ?.nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={() => {
                                        handleOnChangeProcess(
                                          event,
                                          process,
                                          value,
                                          serviceByPlace
                                        );
                                      }}
                                      color="secondary"
                                    />
                                  }
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {/*     {serviceByPlace[0]?.id_plaza === 1 &&
                    serviceByPlace[0]?.id_servicio === 1 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace[0]?.id_servicio) - 1]
                              ?.nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                       
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={()=>{handleOnChangeProcess(
                                        event,
                                        process,
                                   
                                      )}}
                                      color="secondary"
                                    />
                                  }
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 1 &&
                    serviceByPlace.id_servicio === 2 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                             services[Number(serviceByPlace.id_servicio) - 1]
                             ?.nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 1 &&
                    serviceByPlace.id_servicio === 3 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                            ?.nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={() => {}}
                                      color="secondary"
                                    />
                                  }
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 1 &&
                    serviceByPlace.id_servicio === 4 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                             services[Number(serviceByPlace.id_servicio) - 1]
                             ?.nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )} */}
                </>
              )}
              {value === 1 && (
                <>
                  {" "}
                  <Box
                    sx={{
                      border: "solid white 1px",
                      width: "100%",
                      padding: "1rem",
                    }}
                  >
                    <Typography>{`Servicios de la plaza ${places[value].nombre}`}</Typography>
                    <FormGroup>
                      {services.map((service, index) => {
                        return (
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() => {
                                  handleCheckboxChange(
                                    event,
                                    value,
                                    service,
                                    places[value].id_plaza
                                  );
                                }}
                                color="secondary"
                              />
                            }
                            label={`${service.nombre}`}
                          />
                        );
                      })}
                    </FormGroup>
                  </Box>
                  {serviceByPlace.id_plaza === 2 &&
                    serviceByPlace.id_servicio === 1 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 2 &&
                    serviceByPlace.id_servicio === 2 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      /* onChange={handleOnChangeProcess}  */ color="secondary"
                                    />
                                  }
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 2 &&
                    serviceByPlace.id_servicio === 3 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 2 &&
                    serviceByPlace.id_servicio === 4 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                </>
              )}
              {value === 2 && (
                <>
                  {" "}
                  <Box
                    sx={{
                      border: "solid white 1px",
                      width: "100%",
                      padding: "1rem",
                    }}
                  >
                    <Typography>{`Servicios de la plaza ${places[value].nombre}`}</Typography>
                    <FormGroup>
                      {services.map((service, index) => {
                        return (
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() => {
                                  handleCheckboxChange(
                                    event,
                                    value,
                                    service,
                                    places[value].id_plaza
                                  );
                                }}
                                color="secondary"
                              />
                            }
                            label={`${service.nombre}`}
                          />
                        );
                      })}
                    </FormGroup>
                  </Box>
                  {serviceByPlace.id_plaza === 3 &&
                    serviceByPlace.id_servicio === 1 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 3 &&
                    serviceByPlace.id_servicio === 2 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 3 &&
                    serviceByPlace.id_servicio === 3 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 3 &&
                    serviceByPlace.id_servicio === 4 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                </>
              )}
              {value === 3 && (
                <>
                  {" "}
                  <Box
                    sx={{
                      border: "solid white 1px",
                      width: "100%",
                      padding: "1rem",
                    }}
                  >
                    <Typography>{`Servicios de la plaza ${places[value].nombre}`}</Typography>
                    <FormGroup>
                      {services.map((service, index) => {
                        return (
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() => {
                                  handleCheckboxChange(
                                    event,
                                    value,
                                    service,
                                    places[value].id_plaza
                                  );
                                }}
                                color="secondary"
                              />
                            }
                            label={`${service.nombre}`}
                          />
                        );
                      })}
                    </FormGroup>
                  </Box>
                  {serviceByPlace.id_plaza === 4 &&
                    serviceByPlace.id_servicio === 1 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 4 &&
                    serviceByPlace.id_servicio === 2 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 4 &&
                    serviceByPlace.id_servicio === 3 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                  {serviceByPlace.id_plaza === 4 &&
                    serviceByPlace.id_servicio === 4 && (
                      <>
                        <Box
                          sx={{
                            border: "solid white 1px",
                            width: "100%",
                            padding: "1rem",
                          }}
                        >
                          <Typography>{`Procesos para el servicio ${
                            services[Number(serviceByPlace.id_servicio) - 1]
                              .nombre
                          }  de  la plaza ${
                            places[value].nombre
                          } `}</Typography>
                          <FormGroup
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            {processes.map((process) => {
                              return (
                                <FormControlLabel
                                  control={<Checkbox color="secondary" />}
                                  label={`${process.nombre}`}
                                />
                              );
                            })}
                          </FormGroup>
                        </Box>
                      </>
                    )}
                </>
              )}
            </Box>
          </>
        )}
        {nextStep === 2 && (
          <>
            <div>
              Se creo con exito la plaza y los procesos correspondientes{" "}
            </div>
          </>
        )}
      </Box>
      <Box></Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <Button
          color="secondary"
          onClick={() => {
          handleCreatePlace()
          
          }}
          variant="contained"
          style={{ display: nextStep > 1 ? "none" : "block" }}
        >
          {nextStep !== 1
            ? "Siguiente Paso"
            : nextStep <= 2
            ? "Guardar Datos"
            : null}
        </Button>
      </Box>
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </>
  );
}

export default PlacesForm;
