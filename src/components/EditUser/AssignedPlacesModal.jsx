import React, { useState, useEffect } from "react";
import { placeByUserIdRequest } from "../../api/place.js";
import { placeServiceByUserIdRequest } from "../../api/service.js";
import { placeServiceProcessByUserIdRequest } from "../../api/process.js";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Box,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import { CardActionArea } from "@mui/material";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { tokens } from "../../theme";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";
import { Dialog, DialogContent } from "@mui/material";
import { Save } from "@mui/icons-material";
import { updateAssignedPlacesRequest } from "../../api/auth";

const AssignedPlacesModal = ({ open, onClose, data }) => {
  if (!data) return null;

  console.log("data inicial: ", data);

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [selectedProcesses, setSelectedProcesses] = useState({});
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const getPlaces = async (user_id) => {
    try {
      setIsLoading(true);
      const response = await placeByUserIdRequest(user_id);
      setPlaces(response.data);
      console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching places:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPlaces(user.user_id);
  }, [user.user_id]);

  useEffect(() => {
    if (data.assigned_place_service_process) {
      const parsedData = JSON.parse(data.assigned_place_service_process);
      const initialSelectedProcesses = {};

      parsedData.forEach((item) => {
        if (!initialSelectedProcesses[item.placeId]) {
          initialSelectedProcesses[item.placeId] = {};
        }
        if (!initialSelectedProcesses[item.placeId][item.serviceId]) {
          initialSelectedProcesses[item.placeId][item.serviceId] = [];
        }
        initialSelectedProcesses[item.placeId][item.serviceId].push(
          item.processId
        );
      });

      setSelectedProcesses(initialSelectedProcesses);

      // Set initial selected place and service
      const firstPlaceId = parsedData[0]?.placeId;
      const firstServiceId = parsedData[0]?.serviceId;

      if (firstPlaceId) {
        handleCardClick(firstPlaceId);
      }
      if (firstServiceId) {
        handleServiceChipClick(firstServiceId);
      }
    }
  }, [data]);

  const handleCardClick = (place_id) => {
    setSelectedPlace(place_id);
    setSelectedService(null);

    placeServiceByUserIdRequest(user.user_id, place_id)
      .then((response) => {
        console.log(response.data);
        const servicesWithSelection = response.data.map((service) => ({
          ...service,
          active:
            selectedProcesses[place_id]?.[service.service_id]?.length > 0 ||
            false,
        }));
        setServices(servicesWithSelection);
        setProcesses([]); // Clear processes when selecting a new place
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  };

  const handleServiceChipClick = async (service_id) => {
    setSelectedService(service_id);
    try {
      const response = await placeServiceProcessByUserIdRequest(
        user.user_id,
        selectedPlace,
        service_id
      );
      console.log(response.data);
      const processesWithSelection = response.data.map((process) => ({
        ...process,
        active:
          selectedProcesses[selectedPlace]?.[service_id]?.includes(
            process.process_id
          ) || false,
      }));
      setProcesses(processesWithSelection);
    } catch (error) {
      console.error("Error fetching processes:", error);
    }
  };

  const handleProcessChipClick = (process_id) => {
    const updatedSelectedProcesses = { ...selectedProcesses };
    if (selectedPlace && selectedService) {
      if (!updatedSelectedProcesses[selectedPlace]) {
        updatedSelectedProcesses[selectedPlace] = {};
      }
      if (!updatedSelectedProcesses[selectedPlace][selectedService]) {
        updatedSelectedProcesses[selectedPlace][selectedService] = [];
      }
      if (
        updatedSelectedProcesses[selectedPlace][selectedService].includes(
          process_id
        )
      ) {
        updatedSelectedProcesses[selectedPlace][selectedService] =
          updatedSelectedProcesses[selectedPlace][selectedService].filter(
            (id) => id !== process_id
          );
      } else {
        updatedSelectedProcesses[selectedPlace][selectedService].push(
          process_id
        );
      }

      const processesSelected =
        updatedSelectedProcesses[selectedPlace][selectedService].length > 0;

      if (!processesSelected) {
        delete updatedSelectedProcesses[selectedPlace][selectedService];
        if (Object.keys(updatedSelectedProcesses[selectedPlace]).length === 0) {
          delete updatedSelectedProcesses[selectedPlace];
        }
      }

      setSelectedProcesses(updatedSelectedProcesses);

      const updatedProcesses = processes.map((process) =>
        process.process_id === process_id
          ? { ...process, active: !process.active }
          : process
      );
      setProcesses(updatedProcesses);

      console.log(JSON.stringify(updatedSelectedProcesses, null, 2));
    }
  };

  const transformData = (selectedProcesses) => {
    const transformedData = [];

    Object.keys(selectedProcesses).forEach((placeId) => {
      Object.keys(selectedProcesses[placeId]).forEach((serviceId) => {
        selectedProcesses[placeId][serviceId].forEach((processId) => {
          transformedData.push({
            placeId: parseInt(placeId),
            serviceId: parseInt(serviceId),
            processId: parseInt(processId),
          });
        });
      });
    });

    return transformedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transformedData = transformData(selectedProcesses);

    if (transformedData.length === 0) {
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage("¡Error! Debes seleccionar al menos un proceso.");
      return;
    }

    console.log(transformedData);
    const userId = data.user_id;

    try {
      await updateAssignedPlaces(userId, transformedData);
      setAlertOpen(true);
      setAlertType("success");
      setAlertMessage(
        "El proceso se ha completado. Como gestor, no es necesario tener permisos de la plataforma web."
      );
    } catch (error) {
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage(`¡Error! ${error.message}`);
    }
  };

  const updateAssignedPlaces = async (user_id, dataAssignedPlaces) => {
    try {
      const res = await updateAssignedPlacesRequest(
        user_id,
        dataAssignedPlaces
      );

      if (res.status === 200) {
        console.log("Success:", res.data.message);
        // Aquí puedes manejar el éxito, por ejemplo, mostrar una notificación al usuario
      } else {
        console.log(`Unexpected status code: ${res.status}`);
        // Manejar otros códigos de estado inesperados
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          console.log("Bad Request:", error.response.data.message);
          // Aquí puedes manejar los errores de solicitud incorrecta (400)
        } else if (status === 500) {
          console.log("Server Error:", error.response.data.message);
          // Aquí puedes manejar los errores del servidor (500)
        } else {
          console.log(`Error (${status}):`, error.response.data.message);
          // Manejar otros códigos de estado de error
        }
      } else {
        console.log("Error:", error.message);
        // Manejar otros tipos de errores, como problemas de red
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          border: `2px solid ${colors.accentGreen[100]}`,
        },
      }}
    >
      <DialogContent
        sx={{
          "& .MuiDialog-paper": {
            boxShadow: "0px 5px 15px rgba(0,0,0,0.5)",
            borderRadius: "8px",
          },
          bgcolor: "background.paper",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div>
            <LoadingModal open={isLoading} />
            <CustomAlert
              alertOpen={alertOpen}
              type={alertType}
              message={alertMessage}
              onClose={setAlertOpen}
            />
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: colors.accentGreen[100],
                fontWeight: "bold",
              }}
            >
              Selecciona la plaza
            </Typography>
            <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
            <Box mb={2} mt={1}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {places.map((place) => (
                        <div key={place.place_id} style={{ margin: "5px" }}>
                          <Card
                            style={{
                              width: 100,
                              height: 150,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              backgroundColor:
                                selectedPlace === place.place_id
                                  ? colors.accentGreen[100]
                                  : "rgba(255, 255, 255, 0.1)",
                            }}
                            onClick={() => handleCardClick(place.place_id)}
                          >
                            <CardActionArea style={{ flexGrow: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Avatar
                                  alt={place.name}
                                  src={place.image}
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    margin: "auto",
                                    marginBottom: "10px",
                                  }}
                                />
                                <CardContent style={{ textAlign: "center" }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        selectedPlace === place.place_id
                                          ? colors.contentAccentGreen[100]
                                          : "default",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {place.name}
                                  </Typography>
                                </CardContent>
                              </div>
                            </CardActionArea>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </Stack>
                </Box>
              </Card>
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: colors.accentGreen[100],
                fontWeight: "bold",
              }}
            >
              Selecciona un servicio
            </Typography>
            <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
            <Box mb={2} mt={1}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {services.map((service) => (
                        <div
                          key={service.service_id}
                          style={{ margin: "10px" }}
                        >
                          <Chip
                            label={service.name}
                            clickable
                            // color={selectedService === service.service_id ? "secondary" : (service.active ? "secondary" : "default")}
                            onClick={() =>
                              handleServiceChipClick(service.service_id)
                            }
                            sx={{
                              backgroundColor:
                                selectedService === service.service_id
                                  ? colors.accentGreen[100]
                                  : service.active
                                  ? colors.accentGreen[100]
                                  : "default",
                              color:
                                selectedService === service.service_id
                                  ? colors.contentAccentGreen[100]
                                  : service.active
                                  ? colors.contentAccentGreen[100]
                                  : "default",
                              fontWeight: "bold",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </Stack>
                </Box>
              </Card>
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: colors.accentGreen[100],
                fontWeight: "bold",
              }}
            >
              Selecciona los procesos
            </Typography>
            <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
            <Box mt={1} >
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {processes.map((process) => (
                        <div
                          key={process.process_id}
                          style={{ margin: "10px" }}
                        >
                          <Chip
                            label={process.name}
                            clickable                            
                            sx={{
                              backgroundColor: process.active ? colors.accentGreen[100] : "default",
                              color: process.active ? colors.contentAccentGreen[100] : "default",
                              fontWeight: "bold"
                            }}
                            onClick={() =>
                              handleProcessChipClick(process.process_id)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </Stack>
                </Box>
              </Card>
            </Box>
            <Box mt={2}>
              <Button
                type="submit"
                sx={{
                  borderRadius: "35px",
                  color: "white"
                }}
                variant="contained"
                color="info"
                endIcon={<Save />}
              >
                Guardar cambios
              </Button>
            </Box>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignedPlacesModal;
