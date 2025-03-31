import React, { useMemo } from "react";
import {
  AccessTime,
  AccessTimeRounded,
  Apartment,
  AttachMoney,
  BeachAccess,
  Business,
  CalendarMonth,
  Cancel,
  CheckCircle,
  Dangerous,
  Done,
  EditRoad,
  InsertEmoticon,
  LocalHospital,
  MoneyOff,
  PersonPinCircle,
  Public,
  RunningWithErrors,
  SentimentVeryDissatisfied,
  SentimentVeryDissatisfiedOutlined,
  Smartphone,
  WarningAmber,
} from "@mui/icons-material";
import Viewer from "react-viewer";
import {
  useTheme,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../../theme";

function buildColumns() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const AvatarImage = ({ data }) => {
    const [visibleAvatar, setVisibleAvatar] = React.useState(false);

    return (
      <>
        <Avatar
          onClick={() => {
            setVisibleAvatar(true);
          }}
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

  return useMemo(
    () => [
      {
        field: "usuario",
        headerName: "NOMBRE",
        width: 280,
        editable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", p: "12px" }}>
            <AvatarImage data={params.row.imagen_url} />
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: "plaza",
        headerName: "PLAZA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"PLAZA"}</strong>
        ),
        renderCell: (params) => (
          <Chip
            icon={<Public />}
            label={
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "1.2em" }}
              >
                {params.value}
              </Typography>
            }
            variant="contained"
            sx={{
              background: colors.tealAccent[400],
              color: "black",
              "& .MuiChip-icon": {
                color: theme.palette.info.main,
              },
            }}
          />
        ),
        width: 200,
      },
      {
        field: "fecha_captura",
        headerName: "FECHA DE CAPTURA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FECHA DE CAPTURA"}</strong>
        ),
        width: 160,
        renderCell: (params) => (
          <Chip
            icon={<CalendarMonth />}
            label={
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "1.2em" }}
              >
                {params.value}
              </Typography>
            }
            variant="contained"
            sx={{
              background: colors.blueAccent[500],
              "& .MuiChip-icon": {
                color: theme.palette.info.main,
              },
            }}
          />
        ),
      },
      {
        field: "tipo_checada",
        headerName: "MEDIO DE CHECADA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"MEDIO DE CHECADA"}</strong>
        ),
        width: 200,
        renderCell: (params) => {
          let icon = null;
          let chipColor = colors.greenAccent[400];
          let chipLabel = "";
      
          switch (params.value) {
            case 1:
              icon = <Smartphone />;
              chipColor = colors.tealAccent[400];
              chipLabel = "App Móvil";
              break;
            case 2:
              icon = <Business />;
              chipColor = colors.blueAccent[400];
              chipLabel = "Oficina";
              break;
            default:
              icon = <Dangerous />;
              chipColor = colors.redAccent[400];
              chipLabel = "Desconocido";
          }
      
          return (
            <Chip
              icon={icon}
              label={chipLabel}
              variant="outlined"
              sx={{
                background: chipColor,
                fontWeight: "bold",
                fontSize: "1.2em",
                color: "black",
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },
      {
        field: "hora_entrada_sistema",
        headerName: "HORA DE ENTRADA SISTEMA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"HORA DE ENTRADA SISTEMA"}
          </strong>
        ),
        width: 210,
        renderCell: (params) => {
          // Determinar el color basado en el valor de la celda
          const chipColor =
            params.value === "09:00:00"
              ? colors.blueAccent[400]
              : params.value === "08:00:00"
              ? colors.tealAccent[400]
              : "default"; // Color por defecto

          return (
            <Chip
              icon={<AccessTime />}
              label={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                  {params.value}
                </Typography>
              }
              variant="contained"
              sx={{
                background: chipColor,
                color: "black",
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },

      {
        field: "hora_entrada",
        headerName: "HORA DE ENTRADA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"HORA DE ENTRADA"}</strong>
        ),
        width: 160,
        renderCell: (params) => {
          // Determinar el color basado en el valor de la celda
          let icon = null;
          let chipColor = colors.greenAccent[400];

          switch (params.row.estatus_entrada) {
            case "Asistencia correcta":
              icon = <InsertEmoticon />;
              chipColor = colors.accentGreen[100];
              break;
            case "Vacaciones":
              icon = <BeachAccess />;
              chipColor = colors.greenAccent[400];
              break;
            case "Permiso con goce de sueldo":
              icon = <AttachMoney />;
              chipColor = colors.greenAccent[400];
              break;
            case "Permiso sin goce de sueldo":
              icon = <MoneyOff />;
              chipColor = colors.yellowAccent[300];
              break;
            case "Incapacidad":
              icon = <LocalHospital />;
              chipColor = colors.greenAccent[400];
              break;
            case "Retardo":
              icon = <WarningAmber />;
              chipColor = colors.yellowAccent[300];
              break;
            case "Falta":
              icon = <Dangerous />;
              chipColor = colors.redAccent[400];
              break;
            case "Dia incompleto":
              icon = <SentimentVeryDissatisfied />;
              chipColor = colors.redAccent[400];
              break;
            default:
              icon = null;
              chipColor = colors.greenAccent[400];
          }

          return (
            <Chip
              icon={icon}
              label={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                  {params.value}
                </Typography>
              }
              variant="contained"
              sx={{
                background: chipColor,
                color: "black",
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },
      {
        field: "estatus_entrada",
        headerName: "ESTATUS DE ENTRADA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE ENTRADA"}</strong>
        ),
        width: 280,
        renderCell: (params) => {
          let icon = null;
          let chipColor = colors.greenAccent[400];
          let chipLabel = "";
          switch (params.row.estatus_entrada) {
            case "Asistencia correcta":
              icon = <InsertEmoticon />;
              chipColor = colors.accentGreen[100];
              chipLabel = "Asistencia correcta";
              break;
            case "Vacaciones":
              icon = <BeachAccess />;
              chipColor = colors.greenAccent[400];
              chipLabel = "Vacaciones";
              break;
            case "Permiso con goce de sueldo":
              icon = <AttachMoney />;
              chipColor = colors.greenAccent[400];
              chipLabel = "Permiso con goce de sueldo";
              break;
            case "Permiso sin goce de sueldo":
              icon = <MoneyOff />;
              chipColor = colors.yellowAccent[300];
              chipLabel = "Permiso sin goce de sueldo";
              break;
            case "Incapacidad":
              icon = <LocalHospital />;
              chipColor = colors.greenAccent[400];
              chipLabel = "Incapacidad";
              break;
            case "Retardo":
              icon = <WarningAmber />;
              chipColor = colors.yellowAccent[300];
              chipLabel = "Retardo";
              break;
            case "Falta":
              icon = <Dangerous />;
              chipColor = colors.redAccent[400];
              chipLabel = "Falta";
              break;
            case "Dia incompleto":
              icon = <SentimentVeryDissatisfied />;
              chipColor = colors.redAccent[400];
              chipLabel = "Día incompleto";
              break;
            default:
              icon = null;
              chipColor = colors.greenAccent[400];
          }
          return (
            <>
              <Chip
                icon={icon}
                label={chipLabel}
                variant="contained"
                sx={{
                  background: chipColor,
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  color: "black",
                  "& .MuiChip-icon": {
                    color: theme.palette.info.main,
                  },
                }}
              />
            </>
          );
        },
      },
      {
        field: "estatus_punto_entrada",
        headerName: "ESTATUS DE PUNTO DE ENTRADA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"ESTATUS DE PUNTO DE ENTRADA"}
          </strong>
        ),
        width: 250,
        renderCell: (params) => {
          let icon = null;
          let chipColor = colors.greenAccent[400];
          let chipLabel = "";
          switch (params.row.estatus_punto_entrada) {
            case "Fuera del rango":
              icon = <EditRoad />;
              chipColor = colors.redAccent[400];
              chipLabel = "Fuera del rango";
              break;
            case "Dentro del rango":
              icon = <Apartment />;
              chipColor = colors.tealAccent[400];
              chipLabel = "Dentro del rango";
              break;
            default:
              icon = <Dangerous />;
              chipColor = colors.redAccent[400];
              chipLabel = "Sin especificar";
          }
          return (
            <>
              <Chip
                icon={icon}
                label={chipLabel}
                variant="outlined"
                sx={{
                  background: chipColor,
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  color: "black",
                  "& .MuiChip-icon": {
                    color: theme.palette.info.main,
                  },
                }}
              />
            </>
          );
        },
      },
      {
        field: "lugar_entrada",
        headerName: "LUGAR DE ENTRADA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE ENTRADA"}</strong>
        ),
        width: 200,
        renderCell: (params) => {
          const { lugar_entrada, estatus_punto_entrada } = params.row;
          const isDisabled =
            estatus_punto_entrada !== "Fuera del rango" &&
            estatus_punto_entrada !== "Dentro del rango";

          return (
            <Tooltip title="Abrir en Google Maps">
              <span>
                {" "}
                {/* Necesario para que el Tooltip funcione en botones deshabilitados */}
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<PersonPinCircle />}
                  onClick={() => window.open(lugar_entrada, "_blank")}
                  disabled={isDisabled}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    backgroundColor: isDisabled
                      ? colors.grey
                      : colors.tealAccent[400],
                    color: isDisabled ? "white" : "black",
                    "&:hover": {
                      backgroundColor: isDisabled
                        ? colors.grey
                        : colors.tealAccent[600],
                    },
                  }}
                >
                  Ver ubicación
                </Button>
              </span>
            </Tooltip>
          );
        },
      },      
      {
        field: "lugar_entrada_primer_gestion",
        headerName: "LUGAR DE ENTRADA PRIMERA GESTIÓN",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"LUGAR DE ENTRADA PRIMERA GESTIÓN"}
          </strong>
        ),
        width:300,
        renderCell: (params) => {
          const isDisabled = params.value === "Sin lugar";
      
          return (
            <Tooltip title={isDisabled ? "Sin ubicación disponible" : "Abrir en Google Maps"}>
              <span>
                {/* Necesario para que el Tooltip funcione en botones deshabilitados */}
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<PersonPinCircle />}
                  onClick={() => window.open(params.value, "_blank")}
                  disabled={isDisabled}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    backgroundColor: isDisabled ? colors.grey : colors.tealAccent[400],
                    color: isDisabled ? "white" : "black",
                    "&:hover": {
                      backgroundColor: isDisabled ? colors.grey : colors.tealAccent[600],
                    },
                  }}
                >
                  Ver ubicación
                </Button>
              </span>
            </Tooltip>
          );
        },
      },      
      {
        field: "distancia_entrada",
        headerName: "DISTANCIA DE PUNTOS DE ENTRADA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"DISTANCIA DE PUNTOS DE ENTRADA"}
          </strong>
        ),
        width: 280,
        renderCell: (params) => {
          let icon = null;
          let chipColor = colors.greenAccent[400];
          let chipLabel = params.value;
      
          if (params.value === 0) {
            icon = <WarningAmber />;
            chipColor = colors.yellowAccent[400];
            chipLabel = "Sin distancia";
          } else if (params.value <= 500) {
            icon = <CheckCircle />;
            chipColor = colors.tealAccent[400];
            chipLabel = `${params.value} m`;
          } else {
            icon = <Cancel />;
            chipColor = colors.redAccent[400];
            chipLabel = `${params.value} m`;
          }
      
          return (
            <Chip
              icon={icon}
              label={chipLabel}
              variant="outlined"
              sx={{
                background: chipColor,
                fontWeight: "bold",
                fontSize: "1.2em",
                color: "black",
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },
      {
        field: "hora_salida_sistema",
        headerName: "HORA DE SALIDA SISTEMA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"HORA DE SALIDA SISTEMA"}
          </strong>
        ),
        width: 200,
        renderCell: (params) => {
          // Determinar el color basado en el valor de la celda
          const chipColor =
            params.value === "18:00:00"
              ? colors.blueAccent[400]
              : params.value === "17:00:00"
              ? colors.tealAccent[400]
              : params.value === "13:00:00"
              ? colors.greenAccent[400]
              : "default"; // Color por defecto

          return (
            <Chip
              icon={<AccessTime />}
              label={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                  {params.value}
                </Typography>
              }
              variant="contained"
              sx={{
                background: chipColor,
                color: "black",
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },
      {
        field: "hora_salida",
        headerName: "HORA DE SALIDA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"HORA DE SALIDA"}</strong>
        ),
        width: 140,
        renderCell: (params) => {
          // Asignar un valor por defecto si params.value está vacío
          const horaSalida =
            params.value && params.value.trim() !== ""
              ? params.value
              : "--:--:--";

          // Determinar el color basado en el estatus de salida
          let icon = <RunningWithErrors />;
          let chipColor = colors.greenAccent[400];

          switch (params.row.estatus_salida) {
            case "Asistencia correcta":
              icon = <InsertEmoticon />;
              chipColor = colors.accentGreen[100];
              break;
            case "Vacaciones":
              icon = <BeachAccess />;
              chipColor = colors.greenAccent[400];
              break;
            case "Permiso con goce de sueldo":
              icon = <AttachMoney />;
              chipColor = colors.greenAccent[400];
              break;
            case "Permiso sin goce de sueldo":
              icon = <MoneyOff />;
              chipColor = colors.yellowAccent[300];
              break;
            case "Incapacidad":
              icon = <LocalHospital />;
              chipColor = colors.greenAccent[400];
              break;
            case "Retardo":
              icon = <WarningAmber />;
              chipColor = colors.yellowAccent[300];
              break;
            case "Falta":
              icon = <Dangerous />;
              chipColor = colors.redAccent[400];
              break;
            case "Dia incompleto":
              icon = <SentimentVeryDissatisfied />;
              chipColor = colors.redAccent[400];
              break;
            case "Registro incompleto":
              icon = <RunningWithErrors />;
              chipColor = colors.redAccent[400];
              break;
            default:
              icon = <RunningWithErrors />;
              chipColor = colors.greenAccent[400];
          }

          return (
            <Chip
              icon={icon}
              label={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                  {horaSalida}
                </Typography>
              }
              variant="contained"
              sx={{
                background: chipColor,
                color: "black",
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },
      {
        field: "estatus_salida",
        headerName: "ESTATUS DE SALIDA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE SALIDA"}</strong>
        ),
        width: 280,
        renderCell: (params) => {
          let icon = null;
          let chipColor = colors.accentGreen[100];
          let chipLabel = "";
          switch (params.row.estatus_salida) {
            case "Asistencia correcta":
              icon = <InsertEmoticon />;
              chipColor = chipColor = colors.accentGreen[100];
              chipLabel = "Asistencia correcta";
              break;
            case "Vacaciones":
              icon = <BeachAccess />;
              chipColor = colors.greenAccent[400];
              chipLabel = "Vacaciones";
              break;
            case "Permiso con goce de sueldo":
              icon = <AttachMoney />;
              chipColor = colors.greenAccent[400];
              chipLabel = "Permiso con goce de sueldo";
              break;
            case "Permiso sin goce de sueldo":
              icon = <MoneyOff />;
              chipColor = colors.yellowAccent[300];
              chipLabel = "Permiso sin goce de sueldo";
              break;
            case "Incapacidad":
              icon = <LocalHospital />;
              chipColor = colors.greenAccent[400];
              chipLabel = "Incapacidad";
              break;
            case "Retardo":
              icon = <WarningAmber />;
              chipColor = colors.yellowAccent[300];
              chipLabel = "Retardo";
              break;
            case "Falta":
              icon = <Dangerous />;
              chipColor = colors.redAccent[400];
              chipLabel = "Falta";
              break;
            case "Dia incompleto":
              icon = <SentimentVeryDissatisfiedOutlined />;
              chipColor = colors.redAccent[400];
              chipLabel = "Dia incompleto";
              break;
            case "Registro incompleto":
              icon = <RunningWithErrors />;
              chipColor = colors.redAccent[400];
              chipLabel = "Registro incompleto";
              break;
            default:
              icon = null;
              chipColor = colors.greenAccent[400];
          }
          return (
            <>
              <Chip
                icon={icon}
                label={chipLabel}
                variant="outlined"
                style={{ marginLeft: "5px" }}
                sx={{
                  background: chipColor,
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  color: "black",
                  "& .MuiChip-icon": {
                    color: theme.palette.info.main,
                  },
                }}
              />
            </>
          );
        },
      },
      {
        field: "estatus_punto_salida",
        headerName: "ESTATUS DE PUNTO DE SALIDA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"ESTATUS DE PUNTO DE SALIDA"}
          </strong>
        ),
        width: 230,
        renderCell: (params) => {
          let icon = null;
          let chipColor = colors.greenAccent[400];
          let chipLabel = "";
          switch (params.row.estatus_punto_salida) {
            case "Fuera del rango":
              icon = <EditRoad />;
              chipColor = colors.redAccent[400];
              chipLabel = "Fuera del rango";
              break;
            case "Dentro del rango":
              icon = <Apartment />;
              chipColor = colors.tealAccent[400];
              chipLabel = "Dentro del rango";
              break;
            default:
              icon = <Dangerous />;
              chipColor = colors.redAccent[400];
              chipLabel = "Sin especificar";
          }
          return (
            <>
              <Chip
                icon={icon}
                label={chipLabel}
                variant="outlined"
                style={{ marginLeft: "5px" }}
                sx={{
                  background: chipColor,
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  color: "black",
                  "& .MuiChip-icon": {
                    color: theme.palette.info.main,
                  },
                }}
              />
            </>
          );
        },
      },
      {
        field: "lugar_salida",
        headerName: "LUGAR DE SALIDA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE SALIDA"}</strong>
        ),
        width: 180,
        renderCell: (params) => {
          const { lugar_salida, estatus_punto_salida } = params.row;
          const isDisabled =
            estatus_punto_salida !== "Fuera del rango" &&
            estatus_punto_salida !== "Dentro del rango";

          return (
            <Tooltip title="Abrir en Google Maps">
              <span>
                {" "}
                {/* Necesario para que el Tooltip funcione en botones deshabilitados */}
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<PersonPinCircle />}
                  onClick={() => window.open(lugar_salida, "_blank")}
                  disabled={isDisabled}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    backgroundColor: isDisabled
                      ? colors.grey
                      : colors.tealAccent[400],
                    color: isDisabled ? "white" : "black",
                    "&:hover": {
                      backgroundColor: isDisabled
                        ? colors.grey
                        : colors.tealAccent[600],
                    },
                  }}
                >
                  Ver ubicación
                </Button>
              </span>
            </Tooltip>
          );
        },
      },
      {
        field: "hora_entrada_comida",
        headerName: "HORA DE SALIDA DE COMIDA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"HORA DE ENTRADA DE COMIDA"}
          </strong>
        ),
        width: 220,
        renderCell: (params) => {
          const horaSalidaComida =
            params.value && params.value.trim() !== ""
              ? params.value
              : "--:--:--";
          // Determinar el color basado en el valor de la celda
          const chipColor =
            params.value && params.value.trim() !== ""
              ? colors.blueAccent[400]
              : colors.redAccent[400];

          return (
            <Chip
              icon={<AccessTime />}
              label={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                  {horaSalidaComida}
                </Typography>
              }
              variant="contained"
              sx={{
                background: chipColor,
                color: "black",
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },
      {
        field: "lugar_entrada_comida",
        headerName: "LUGAR DE SALIDA DE COMIDA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"LUGAR DE ENTRADA DE COMIDA"}
          </strong>
        ),
        width: 230,
        renderCell: (params) => {
          const { lugar_entrada, lugar_entrada_comida } = params.row;
          const isDisabled = lugar_entrada_comida.trim() === "";

          return (
            <Tooltip title="Abrir en Google Maps">
              <span>
                {" "}
                {/* Necesario para que el Tooltip funcione en botones deshabilitados */}
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<PersonPinCircle />}
                  onClick={() => window.open(lugar_entrada, "_blank")}
                  disabled={isDisabled}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    backgroundColor: isDisabled
                      ? colors.grey
                      : colors.tealAccent[400],
                    color: isDisabled ? "white" : "black",
                    "&:hover": {
                      backgroundColor: isDisabled
                        ? colors.grey
                        : colors.tealAccent[600],
                    },
                  }}
                >
                  Ver ubicación
                </Button>
              </span>
            </Tooltip>
          );
        },
      },
      {
        field: "hora_salida_comida",
        headerName: "HORA DE ENTRADA DE COMIDA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"HORA DE SALIDA DE COMIDA"}
          </strong>
        ),
        width: 240,
        renderCell: (params) => {
          const horaEntradaComida =
            params.value && params.value.trim() !== ""
              ? params.value
              : "--:--:--";
          // Determinar el color basado en el valor de la celda
          const chipColor =
            params.value && params.value.trim() !== ""
              ? colors.blueAccent[400]
              : colors.redAccent[400];

          return (
            <Chip
              icon={<AccessTime />}
              label={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                  {horaEntradaComida}
                </Typography>
              }
              variant="contained"
              sx={{
                background: chipColor,
                color: "black",
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },
      {
        field: "lugar_salida_comida",
        headerName: "LUGAR DE ENTRADA DE COMIDA",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"LUGAR DE SALIDA DE COMIDA"}
          </strong>
        ),
        width: 240,
        renderCell: (params) => {
          const { lugar_salida, lugar_salida_comida } = params.row;
          const isDisabled = lugar_salida_comida.trim() === "";

          return (
            <Tooltip title="Abrir en Google Maps">
              <span>
                {" "}
                {/* Necesario para que el Tooltip funcione en botones deshabilitados */}
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<PersonPinCircle />}
                  onClick={() => window.open(lugar_salida, "_blank")}
                  disabled={isDisabled}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    backgroundColor: isDisabled
                      ? colors.grey
                      : colors.tealAccent[400],
                    color: isDisabled ? "white" : "black",
                    "&:hover": {
                      backgroundColor: isDisabled
                        ? colors.grey
                        : colors.tealAccent[600],
                    },
                  }}
                >
                  Ver ubicación
                </Button>
              </span>
            </Tooltip>
          );
        },
      },
    ],
    []
  );
}

export default buildColumns;
