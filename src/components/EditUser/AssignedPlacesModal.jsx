// Adaptación del AssignedPlacesModal al diseño de StepTwo
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Divider,
  Box,
  IconButton,
  Tooltip,
  Button,
  Checkbox,
  Paper,
  TableContainer,
  useTheme,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
  SkipNext as SkipNextIcon,
  Save as SaveIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBoxOutlineBlank,
  CheckBox,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { placeByUserIdRequest } from "../../api/place";
import { placeServiceByUserIdRequest } from "../../api/service";
import { placeServiceProcessByUserIdRequest } from "../../api/process";
import { updateAssignedPlacesRequest } from "../../api/auth";
import LoadingModal from "../../components/LoadingModal";
import CustomAlert from "../../components/CustomAlert";
import { tokens } from "../../theme";

const AssignedPlacesModal = ({ open, onClose, data }) => {
  const [places, setPlaces] = useState([]);
  const [services, setServices] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProcesses, setSelectedProcesses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!data) return;
    setIsLoading(true);
    placeByUserIdRequest(user.user_id)
      .then((res) => {
        setPlaces(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    if (data.assigned_place_service_process) {
      const parsed = JSON.parse(data.assigned_place_service_process);
      const initial = {};
      parsed.forEach(({ placeId, serviceId, processId }) => {
        if (!initial[placeId]) initial[placeId] = {};
        if (!initial[placeId][serviceId]) initial[placeId][serviceId] = [];
        initial[placeId][serviceId].push(processId);
      });
      setSelectedProcesses(initial);
      const firstPlace = parsed[0]?.placeId;
      if (firstPlace) handleSelectPlace(firstPlace);
    }
  }, [data]);

  const hasAssignedProcesses = (place_id) => {
    return (
      selectedProcesses[place_id] &&
      Object.values(selectedProcesses[place_id]).some((arr) => arr.length > 0)
    );
  };

  const hasAssignedProcessesService = (place_id, service_id) => {
    return selectedProcesses[place_id]?.[service_id]?.length > 0;
  };

  const handleSelectPlace = (place_id) => {
    setSelectedPlace(place_id);
    setSelectedService(null);
    setProcesses([]);
    placeServiceByUserIdRequest(user.user_id, place_id)
      .then((res) => setServices(res.data))
      .catch(() => setServices([]));
  };

  const handleSelectService = (service_id) => {
    setSelectedService(service_id);
    placeServiceProcessByUserIdRequest(user.user_id, selectedPlace, service_id)
      .then((res) => setProcesses(res.data))
      .catch(() => setProcesses([]));
  };

  const handleProcessCheckbox = (process_id) => {
    const updated = { ...selectedProcesses };
    if (!updated[selectedPlace]) updated[selectedPlace] = {};
    if (!updated[selectedPlace][selectedService])
      updated[selectedPlace][selectedService] = [];
    const arr = updated[selectedPlace][selectedService];
    if (arr.includes(process_id)) {
      updated[selectedPlace][selectedService] = arr.filter(
        (id) => id !== process_id
      );
    } else {
      arr.push(process_id);
    }
    if (updated[selectedPlace][selectedService].length === 0) {
      delete updated[selectedPlace][selectedService];
      if (Object.keys(updated[selectedPlace]).length === 0) {
        delete updated[selectedPlace];
      }
    }
    setSelectedProcesses(updated);
  };

  const isProcessActive = (place_id, service_id, process_id) => {
    return (
      selectedProcesses[place_id]?.[service_id]?.includes(process_id) || false
    );
  };

  const transformData = (obj) => {
    const result = [];
    Object.keys(obj).forEach((p) => {
      Object.keys(obj[p]).forEach((s) => {
        obj[p][s].forEach((proc) => {
          result.push({ placeId: +p, serviceId: +s, processId: +proc });
        });
      });
    });
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = transformData(selectedProcesses);
    if (dataToSend.length === 0) {
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage("Debes seleccionar al menos un proceso.");
      return;
    }
    try {
      await updateAssignedPlacesRequest(data.user_id, dataToSend);
      setAlertType("success");
      setAlertMessage("Asignaciones actualizadas correctamente.");
    } catch (err) {
      setAlertType("error");
      setAlertMessage("Hubo un error al guardar.");
    } finally {
      setAlertOpen(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <LoadingModal open={isLoading} />
          <CustomAlert
            alertOpen={alertOpen}
            type={alertType}
            message={alertMessage}
            onClose={setAlertOpen}
          />
          <Typography variant="h6" mb={2}>
            Editar plazas, servicios y procesos asignados
          </Typography>
          <div className="flex flex-row gap-4 w-full">
            {/* Plazas */}
            <div className="flex-1">
              <div className="overflow-x-auto">
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    mb: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    background: "rgba(128, 128, 128, 0.1)",
                    boxShadow: 3,
                  }}
                >
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left">Plaza</th>
                        <th className="px-2 py-2 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {places.map((place) => {
                        const active = selectedPlace === place.place_id;
                        const assigned = hasAssignedProcesses(place.place_id);
                        return (
                          <tr key={place.place_id}>
                            <td colSpan={3} style={{ padding: 0, border: 0 }}>
                              <div
                                style={
                                  active
                                    ? {
                                        backgroundColor:
                                          colors.accentGreen[100],
                                        color: colors.contentAccentGreen[100],
                                        borderRadius: 12,
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0.5rem 0.75rem",
                                        transition: "all 0.2s",
                                      }
                                    : {
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0.5rem 0.75rem",
                                      }
                                }
                              >
                                {/* Plaza + icono */}
                                <div className="flex-1 flex items-center gap-2">
                                  {place.name}
                                  {assigned ? (
                                    <CheckCircleIcon
                                      sx={{
                                        color: colors.green[700],
                                        fontSize: 22,
                                      }}
                                    />
                                  ) : (
                                    <CancelIcon
                                      sx={{
                                        color: colors.redAccent[500],
                                        fontSize: 22,
                                      }}
                                    />
                                  )}
                                </div>
                                {/* Selección */}
                                <div>
                                  <Tooltip title="Ver servicios">
                                    <span>
                                      <IconButton
                                        color={active ? "primary" : "default"}
                                        onClick={() =>
                                          handleSelectPlace(place.place_id)
                                        }
                                        sx={{
                                          backgroundColor:
                                            colors.tealAccent[400],
                                          "&:hover": {
                                            backgroundColor:
                                              colors.tealAccent[500],
                                          },
                                          borderRadius: 15,
                                        }}
                                      >
                                        <SkipNextIcon
                                          sx={{
                                            color:
                                              colors.contentSearchButton[100],
                                          }}
                                        />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableContainer>
              </div>
            </div>

            <div className="flex-1">
              <div className="overflow-x-auto">
                {/* Servicios */}
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    mb: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    background: "rgba(128, 128, 128, 0.1)",
                    boxShadow: 3,
                  }}
                >
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left">Servicio</th>
                        <th className="px-2 py-2 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => {
                        const active = selectedService === service.service_id;
                        const assigned = hasAssignedProcessesService(
                          selectedPlace,
                          service.service_id
                        );
                        return (
                          <tr key={service.service_id}>
                            <td colSpan={3} style={{ padding: 0, border: 0 }}>
                              <div
                                style={
                                  active
                                    ? {
                                        backgroundColor:
                                          colors.accentGreen[100],
                                        color: colors.contentAccentGreen[100],
                                        borderRadius: 12,
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0.5rem 0.75rem",
                                        transition: "all 0.2s",
                                      }
                                    : {
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0.5rem 0.75rem",
                                      }
                                }
                              >
                                {/* Servicio + icono */}
                                <div className="flex-1 flex items-center gap-2">
                                  {service.name}
                                  {assigned ? (
                                    <CheckCircleIcon
                                      sx={{
                                        color: colors.green[700],
                                        fontSize: 22,
                                      }}
                                    />
                                  ) : (
                                    <CancelIcon
                                      sx={{
                                        color: colors.redAccent[500],
                                        fontSize: 22,
                                      }}
                                    />
                                  )}
                                </div>
                                {/* Selección */}
                                <div>
                                  <Tooltip title="Ver procesos">
                                    <span>
                                      <IconButton
                                        color={active ? "primary" : "default"}
                                        onClick={() =>
                                          handleSelectService(
                                            service.service_id
                                          )
                                        }
                                        disabled={!selectedPlace}
                                        sx={{
                                          backgroundColor:
                                            colors.tealAccent[400],
                                          "&:hover": {
                                            backgroundColor:
                                              colors.tealAccent[500],
                                          },
                                          borderRadius: 15,
                                        }}
                                      >
                                        <SkipNextIcon
                                          sx={{
                                            color:
                                              colors.contentSearchButton[100],
                                          }}
                                        />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableContainer>
              </div>
            </div>

            <div className="flex-1">
              <div className="overflow-x-auto">
                {/* Procesos */}
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    mb: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    background: "rgba(128, 128, 128, 0.1)",
                    boxShadow: 3,
                  }}
                >
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 text-left">Proceso</th>
                        <th className="px-2 py-2 text-right">Selección</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processes.map((process) => {
                        const checked = isProcessActive(
                          selectedPlace,
                          selectedService,
                          process.process_id
                        );
                        return (
                          <tr key={process.process_id}>
                            <td colSpan={2} style={{ padding: 0, border: 0 }}>
                              <div
                                style={
                                  checked
                                    ? {
                                        backgroundColor:
                                          colors.accentGreen[100],
                                        color: colors.contentAccentGreen[100],
                                        borderRadius: 12,
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0.5rem 0.75rem",
                                        transition: "all 0.2s",
                                      }
                                    : {
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0.5rem 0.75rem",
                                      }
                                }
                              >
                                {/* Proceso + icono */}
                                <div className="flex-1 flex items-center gap-2">
                                  {process.name}
                                  {checked ? (
                                    <CheckCircleIcon
                                      sx={{
                                        color: colors.green[700],
                                        fontSize: 22,
                                      }}
                                    />
                                  ) : (
                                    <CancelIcon
                                      sx={{
                                        color: colors.redAccent[500],
                                        fontSize: 22,
                                      }}
                                    />
                                  )}
                                </div>
                                {/* Selección */}
                                <div>
                                  <Checkbox
                                    checked={checked}
                                    onChange={() =>
                                      handleProcessCheckbox(process.process_id)
                                    }
                                    color="success"
                                    disabled={!selectedService}
                                    icon={
                                      <CheckBoxOutlineBlank
                                        sx={{ fontSize: 28 }}
                                      />
                                    }
                                    checkedIcon={
                                      <CheckBox
                                        sx={{
                                          fontSize: 28,
                                          color: colors.green[700],
                                        }}
                                      />
                                    }
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableContainer>
              </div>
            </div>
          </div>

          <Box mt={2} textAlign="right">
            <Button
              type="submit"
              variant="contained"
              color="info"
              endIcon={<SaveIcon />}
            >
              Guardar cambios
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignedPlacesModal;
