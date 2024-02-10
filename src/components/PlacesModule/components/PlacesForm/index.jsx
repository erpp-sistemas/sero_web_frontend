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
import { getAllPlaces } from "../../../../api/place";
function PlacesForm() {
  const [fileList, setFileList] = React.useState([]);
  const [nextStep, setNextStep] = React.useState(0);
  const [placeData, setPlaceData] = React.useState({
    namePlace: "",
    active: "",
    imageUrl: "",
  });
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
  const [serviceByPlace,setServiceByPlace] = React.useState({
    id_plaza:"",
    id_servicio:"",
  })

  /* getAllPlaces */

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
    fetchPlaces()
  }, []);

  const handleCheckboxChange = (event,service,place) => {
   const {checked} = event.target
   const {id_servicio}=service
   setServiceByPlace((prevServiceByPlace) => ({
      ...prevServiceByPlace,
      id_plaza: place,
      id_servicio: checked ? id_servicio : "", // Set id_servicio if checked, otherwise clear it
    }));
  };



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
                {places.map((place)=>{

                  return   <Tab
                  icon={<PhoneIcon />}
                  aria-label="phone"
                  label={`${place.nombre}`}
                />
                })}
              
          
              </Tabs>
              {value === 0 && <>   <Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                <Typography>{`Servicios de la plaza ${places[value].nombre}`}</Typography>
                <FormGroup>
                  {services.map((service,index) => {
                    return (
                      <FormControlLabel
                        control={<Checkbox  onChange={()=>{
                          handleCheckboxChange(event,service,places[value].id_plaza)
                        }}  color="secondary" />}
                        label={`${service.nombre}`}
                      />
                    );
                  })}
                </FormGroup>
              </Box>
              {serviceByPlace.id_plaza === 1 && serviceByPlace.id_servicio===1 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              {serviceByPlace.id_plaza === 1 && serviceByPlace.id_servicio===2 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}

              {serviceByPlace.id_plaza === 1 && serviceByPlace.id_servicio===3 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              {serviceByPlace.id_plaza === 1 && serviceByPlace.id_servicio===4 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              </>}
              {value === 1 && <>   <Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                <Typography>{`Servicios de la plaza ${places[value].nombre}`}</Typography>
                <FormGroup>
                  {services.map((service,index) => {
                    return (
                      <FormControlLabel
                        control={<Checkbox  onChange={()=>{
                          handleCheckboxChange(event,service,places[value].id_plaza)
                        }}  color="secondary" />}
                        label={`${service.nombre}`}
                      />
                    );
                  })}
                </FormGroup>
              </Box>
              {serviceByPlace.id_plaza === 2 && serviceByPlace.id_servicio===1 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              {serviceByPlace.id_plaza === 2 && serviceByPlace.id_servicio===2 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}

              {serviceByPlace.id_plaza === 2 && serviceByPlace.id_servicio===3 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              {serviceByPlace.id_plaza === 2 && serviceByPlace.id_servicio===4 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              </>}
              {value === 2 && <>   <Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                <Typography>{`Servicios de la plaza ${places[value].nombre}`}</Typography>
                <FormGroup>
                  {services.map((service,index) => {
                    return (
                      <FormControlLabel
                        control={<Checkbox  onChange={()=>{
                          handleCheckboxChange(event,service,places[value].id_plaza)
                        }}  color="secondary" />}
                        label={`${service.nombre}`}
                      />
                    );
                  })}
                </FormGroup>
              </Box>
              {serviceByPlace.id_plaza === 3 && serviceByPlace.id_servicio===1 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              {serviceByPlace.id_plaza === 3 && serviceByPlace.id_servicio===2 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}

              {serviceByPlace.id_plaza === 3 && serviceByPlace.id_servicio===3 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              {serviceByPlace.id_plaza === 3 && serviceByPlace.id_servicio===4 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              </>}
              {value === 3 && <>   <Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                <Typography>{`Servicios de la plaza ${places[value].nombre}`}</Typography>
                <FormGroup>
                  {services.map((service,index) => {
                    return (
                      <FormControlLabel
                        control={<Checkbox  onChange={()=>{
                          handleCheckboxChange(event,service,places[value].id_plaza)
                        }}  color="secondary" />}
                        label={`${service.nombre}`}
                      />
                    );
                  })}
                </FormGroup>
              </Box>
              {serviceByPlace.id_plaza === 4 && serviceByPlace.id_servicio===1 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              {serviceByPlace.id_plaza === 4 && serviceByPlace.id_servicio===2 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}

              {serviceByPlace.id_plaza === 4 && serviceByPlace.id_servicio===3 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              {serviceByPlace.id_plaza === 4 && serviceByPlace.id_servicio===4 &&(<><Box
                sx={{
                  border: "solid white 1px",
                  width: "100%",
                  padding: "1rem",
                }}
              >
                 <Typography>{`Procesos para el servicio ${services[Number(serviceByPlace.id_servicio)-1].nombre}  de  la plaza ${places[value].nombre} `}</Typography>
                <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
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
              </>)}
              </>}

           
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
