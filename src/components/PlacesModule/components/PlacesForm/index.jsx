import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
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
  createPlaceAndServiceAndProcess,
  getAllPlaces,
  getPlaceAndServiceAndProcess,
} from "../../../../api/place";
import PlaceIcon from "@mui/icons-material/Place";
import { getPlaceAndServiceAndProcessByUser } from "../../../../api/user";

function PlacesForm() {
  const [fileList, setFileList] = React.useState([]);
  const [nextStep, setNextStep] = React.useState(0);
  const [placesAndServicesAndProcess, setPlacesAndServicesAndProcess] =
    React.useState([]);
  const [GetProcesses,SetProcesses] = React.useState([])
  const [placeData, setPlaceData] = React.useState({
    namePlace: "",
    active: "",
    imageUrl: "",
  });
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOnChangeProcess = (event, process, value, service) => {
    const {checked} = event.target
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
                sx={{ width: "100%" }}
                id="input-with-icon-textfield"
                label="Nombre de la nueva plaza"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                color="secondary"

                /*   onChange={(e) => changeControl(e, "nombre")}
  value={datosGenerales?.nombre} */
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
                <Checkbox color="secondary" {...label} />
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
                    serviceByPlace[0]?.id_servicio === 2 &&  <>
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
                      </>}
                  {serviceByPlace[0]?.id_plaza === 1 &&
                    serviceByPlace[0]?.id_servicio === 3 &&  <>
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
                  </>}
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
            <div>paso 2</div>
          </>
        )}
      </Box>
      <Button onClick={handleNextStep} variant="contained">
        Agregar
      </Button>
    </>
  );
}

export default PlacesForm;
