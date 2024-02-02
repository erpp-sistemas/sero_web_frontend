import React, { useState } from "react";
import {
  Box,
  useTheme,
  Typography,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";

import VerifiedIcon from "@mui/icons-material/Verified";

import { tokens } from "../theme";

import {
  plazas,
  procesosByIdPlazaServicio,
  serviciosByPlaza,
} from "../data/plazas";
import {
  getAllPlaces,
  getPlaceServiceByUserId,
  getProcessesByUserPlaceAndServiceId,
  placeById,
  placeByUserIdRequest,
} from "../api/place";
import { getAllRoles } from "../api/rol";
import { getAllProcesses } from "../api/process";
import { getAllServices } from "../api/service";
import { set } from "react-hook-form";
// validar con el useEffect si el usuario logueado es administrador entonces podra asignarle al usuario que se creara todas las plazas
// si el usuario logueado tiene una plaza entonces solo podra asignarle esa plaza al usuario creada

// obtener las plazas por el id_usuario_logueado

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SelectPlazaCreateUser = ({ setPlazasServiciosProcesos }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [idPlazaSeleccionada, setIdPlazaSeleccionada] = useState(0);
  const [showServicios, setShowServicios] = useState(false);
  const [showProcesosAgua, setShowProcesosAgua] = useState(false);
  const [showProcesosPredio, setShowProcesosPredio] = useState(false);
  const [services, setServices] = React.useState([]);
  const [processes, setProcesses] = React.useState([]);
  const [places, setPlaces] = React.useState([]);
  const [placeServiceData, setPlaceServiceData] = React.useState([]);
  const [getPlace, setPlace] = React.useState([]);
  const [getProcces, setProcces] = React.useState([]);
  const [square, setSquare] = React.useState([]);
  const [getService, setService] = React.useState([]);
  const [getProcess, setProcess] = React.useState([]);
  

  const handleSelectionPlaza = (id_plaza, plaza) => {
   
    if (
      document.getElementById(id_plaza.toString()).style.backgroundColor ===
      "rgba(46, 124, 103, 0.3)"
    ) {
      document.getElementById(id_plaza.toString()).style.backgroundColor = null;
      setShowServicios(false);
    } else {
      document.getElementById(id_plaza.toString()).style.backgroundColor =
        "rgba(46, 124, 103, 0.3)";
      setShowServicios(true);
    }

    // llamar a los procesos de la plaza seleccionada y mostrarlos
    setSquare(plaza);
    setIdPlazaSeleccionada(id_plaza);
    getServiciosByIdPlaza(id_plaza, plaza);
    getPlaza(id_plaza);
  };

  const getPlaza = async (id_plaza) => {
    const response = await placeById(id_plaza);
    setPlace(response);
  };




  React.useEffect(() => {
    // Solo ejecutar el efecto si idPlazaSeleccionada está definido y no es nulo y getService no es null
    if (
        idPlazaSeleccionada &&
        getService !== null &&
        getService !== undefined &&
        getService.length !== 0 &&
        getProcess.length !== 0 // Corregido a getProcess
    ) {

        setPlazasServiciosProcesos((prevState) => ({
            ...prevState,
            plazas: [
                ...prevState.plazas,
                {
                    ...square,
                    relacion_servicio: {
                        ...getService,
                        relacion_proceso: getProcess, // Corregido a getProcess
                    },
                },
            ],
        }));
    }
}, [idPlazaSeleccionada, getService, getProcess]);

  const getServiciosByIdPlaza = async (id_plaza, plaza) => {
    const userId = 0;
    const response = await getPlaceServiceByUserId(userId, id_plaza);
    setPlaceServiceData(response);
  };

  const handleSwitch = async (e, service_id, service) => {
    let checked = e.target.checked;
    if (checked) {
      // llamar a los procesos de la plaza y el servicio seleccionado y mostrarlos

      await getProcesosByIdPlazaServicio(idPlazaSeleccionada, service_id);
      /* setPlazasServiciosProcesos() */
      console.log(service);
      setService(service);

      service_id === 1
        ? setShowProcesosAgua(true)
        : setShowProcesosPredio(true);
    } else {
      service_id === 1
        ? setShowProcesosAgua(false)
        : setShowProcesosPredio(false);
    }
  };

  const getProcesosByIdPlazaServicio = async (id_plaza, id_servicio) => {
    try {
      const userId = 0;
      const response = await getProcessesByUserPlaceAndServiceId(
        userId,
        id_plaza,
        id_servicio
      );
    
      setProcces(response);
    } catch (error) {
      console.error("Error in getProcesosByIdPlazaServicio:", error);
    }
  };

  const handleSwitchProceso = (e, id_proceso, proceso) => {
    let checked = e.target.checked;
    if (checked) {
      setProcess(proceso);
    }
  };

  /**
   * Función asíncrona para obtener los datos de los servicios y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
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

  /**
   * Función asíncrona para obtener los datos de los servicios y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
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

  /**
   * Función asíncrona para obtener los datos de los roles y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
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

  /**
   * Función asíncrona para obtener los datos de los roles y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchRoles = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllRoles();

      // Agrega el campo 'id_rol' a cada fila usando el índice como valor único si no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_rol || index.toString(),
      }));

      setRoles(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchPlaces();
    fetchProcesses();
    fetchServices();
  }, []);



  return (
    <>
      <Box
        m="20px 0"
        sx={{ backgroundColor: colors.primary[400], marginBottom: "20px" }}
        padding="30px 10px"
        borderRadius="7px"
      >
        <Box display="flex" justifyContent="space-evenly" alignItems="center">
          {places &&
            places?.map((plaza) => (
              <Box
                sx={{ padding: "20px", borderRadius: "7px" }}
                id={plaza.id_plaza.toString()}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "inline-block",
                    fontSize: "14px",
                    color: colors.greenAccent[400],
                  }}
                >
                  {plaza?.nombre}
                </Typography>
                <img
                  src={plaza?.imagen}
                  alt="logo imagen"
                  style={{
                    width: "120px",
                    height: "120px",
                    marginBottom: "10px",
                  }}
                />
                <Button
                  sx={{ width: "100%", color: colors.grey[200] }}
                  onClick={() => handleSelectionPlaza(plaza?.id_plaza, plaza)}
                >
                  <VerifiedIcon
                    sx={{
                      fontSize: "36px",
                      color: showServicios ? "#00FF00" : "gray",
                    }}
                  />
                </Button>
              </Box>
            ))}
        </Box>
      </Box>

      {showServicios && (
        <Box
          m="20px 0"
          sx={{ backgroundColor: colors.primary[400], textAlign: "center" }}
          padding="20px 10px"
          borderRadius="7px"
        >
          <Typography
            variant="caption"
            sx={{ fontSize: "16px", color: colors.grey[200] }}
          >
            {`Servicios activos de la plaza ${
              getPlace?.data?.[0]?.name || "Not Available"
            }`}
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            gap="20px"
            sx={{ marginTop: "20px" }}
          >
            {placeServiceData &&
              placeServiceData?.map((service) => (
                <FormGroup sx={{ width: "31%" }}>
                  <FormControlLabel
                    control={<Switch color="info" sx={{ width: "70px" }} />}
                    label={service.name}
                    onChange={(e) =>
                      handleSwitch(e, service.service_id, service)
                    }
                  />
                </FormGroup>
              ))}
          </Box>
        </Box>
      )}

      {showProcesosAgua && (
        <Box
          m="20px 0"
          sx={{ backgroundColor: colors.primary[400], textAlign: "center" }}
          padding="20px 10px"
          borderRadius="7px"
        >
          <Typography
            variant="caption"
            sx={{ fontSize: "16px", color: colors.grey[200] }}
          >
            {` Procesos activos de Regularización de agua la plaza ${
              getPlace?.data?.[0]?.name || "Not Available"
            }`}
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            gap="20px"
            flexWrap="wrap"
            sx={{ marginTop: "20px" }}
          >
            {getProcces &&
              getProcces?.map((proceso) => (
                <FormGroup>
                  <FormControlLabel
                    control={<Switch color="success" sx={{ width: "70px" }} />}
                    label={proceso.name}
                    onChange={(e) =>
                      handleSwitchProceso(e, proceso.id_proceso, proceso)
                    }
                  />
                </FormGroup>
              ))}
          </Box>
        </Box>
      )}

      {showProcesosPredio && (
        <Box
          m="20px 0"
          sx={{ backgroundColor: colors.primary[400], textAlign: "center" }}
          padding="20px 10px"
          borderRadius="7px"
        >
          <Typography
            variant="caption"
            sx={{ fontSize: "16px", color: colors.grey[200] }}
          >
            {` Procesos activos de Regularización de predio de la plaza ${
              getPlace?.data?.[0]?.name || "Not Available"
            }`}
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            gap="20px"
            flexWrap="wrap"
            sx={{ marginTop: "20px" }}
          >
            {getProcces &&
              getProcces?.map((proceso) => (
                <FormGroup>
                  <FormControlLabel
                    control={<Switch color="success" sx={{ width: "70px" }} />}
                    label={proceso.name}
                    onChange={(e) =>
                      handleSwitchProceso(e, proceso.id_proceso, proceso)
                    }
                  />
                </FormGroup>
              ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default SelectPlazaCreateUser;
