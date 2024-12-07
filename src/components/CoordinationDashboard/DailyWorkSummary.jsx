import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  useTheme,
  Button,
  Avatar,
  Typography,
  Chip,
  InputAdornment,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Viewer from "react-viewer";
import {
  AccessTime,
  CalendarToday,
  Download,
  Flag,
  NotListedLocation,
  Photo,
  Preview,
  Search,
  TaskAlt,
  ViewAgenda,
} from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import PopupViewPositionDailyWorkSummary from "../../components/CoordinationDashboard/PopupViewDailyWorkSummary.jsx";
import LoadingModal from "../../components/LoadingModal.jsx";
import * as ExcelJS from "exceljs";

function DataGridManagementByManager({ data, placeId, serviceId, proccessId }) {
  if (!data) {
    return null;
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({
    userId: null,
    dateCapture: null,
  });
  const [searchTerm, setSearchTerm] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [matching, setMatching] = useState(-1);

  const [noResults, setNoResults] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPopup = (userId, dateCapture) => {
    setPopupData({ userId, dateCapture });
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setPopupData({ userId: null, dateCapture: null });
  };

  const buildColumns = useMemo(() => {
    return [
      {
        field: "name",
        headerName: "NOMBRE",
        width: 280,
        editable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", p: "12px" }}>
            <AvatarImage data={params.row.photo} />
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: "date_capture",
        headerName: "FECHA",
        width: 150,
        editable: false,
        renderCell: (params) => (
          <Chip
            icon={<CalendarToday />}
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
        field: "first_and_last_management",
        headerName: "PRIMER Y ULTIMA GESTION",
        width: 230,
        editable: false,
        renderCell: (params) => {
          const hoursWorked = params.row.hours_worked;
          let color;

          if (hoursWorked === 0) {
            color = theme.palette.error.main;
          } else if (hoursWorked === 1) {
            color = theme.palette.warning.main;
          } else {
            color = theme.palette.secondary.main;
          }

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
              variant="outlined"
              sx={{
                background: colors.tealAccent[400],
                color: colors.contentAccentGreen[100],
                "& .MuiChip-icon": {
                  color: color,
                },
              }}
            />
          );
        },
      },
      {
        field: "hours_worked",
        headerName: "HORAS TRABAJADAS",
        width: 160,
        editable: false,
        renderCell: (params) => {
          let backgroundColor;
          let textColor;
          let iconColor;

          if (params.value === 0) {
            backgroundColor = colors.redAccent[400];
            textColor = colors.contentAccentGreen[100];
            iconColor = colors.redAccent[400];
          } else if (params.value === 1) {
            backgroundColor = colors.yellowAccent[400];
            textColor = colors.contentAccentGreen[100];
            iconColor = colors.yellowAccent[400];
          } else {
            backgroundColor = colors.accentGreen[100];
            textColor = colors.contentAccentGreen[100];
            iconColor = colors.accentGreen[100];
          }

          return (
            <Chip
              icon={<Flag sx={{ color: iconColor }} />}
              label={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                  {params.value}
                </Typography>
              }
              sx={{
                backgroundColor,
                color: textColor,
                borderColor: backgroundColor,
                borderWidth: 2,
              }}
              variant="outlined"
            />
          );
        },
      },
      {
        field: "total_procedures",
        headerName: "GESTIONES",
        width: 100,
        editable: false,
        renderCell: (params) => {
          const hoursWorked = params.row.hours_worked;
          let color;

          if (hoursWorked === 0) {
            color = theme.palette.error.main;
          } else if (hoursWorked === 1) {
            color = theme.palette.warning.main;
          } else {
            color = colors.accentGreen[100];
          }

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "1.2em" }}
              >
                {params.value}
              </Typography>
              <TaskAlt sx={{ color: color }} />
            </div>
          );
        },
      },
      {
        field: "located",
        headerName: "LOCALIZADAS",
        width: 120,
        editable: false,
        renderCell: (params) => {
          const percentage =
            (params.row.located / params.row.total_procedures) * 100 || 0;

          let progressColor;
          if (percentage <= 33) {
            progressColor = "error";
          } else if (percentage <= 66) {
            progressColor = "warning";
          } else {
            progressColor = "secondary";
          }

          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* Valor principal */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1em",
                }}
              >
                {params.value}
              </Typography>

              {/* Barra de progreso */}
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  width: "100%",
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                color={
                  progressColor === "error"
                    ? "red"
                    : progressColor === "warning"
                    ? "orange"
                    : "secondary"
                }
              />

              {/* Porcentaje */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.75em",
                }}
              >
                {`${Math.round(percentage)}%`}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "vacant_lot",
        headerName: "PREDIO BALDIO",
        width: 120,
        editable: false,
        renderCell: (params) => {
          const percentage = Math.min(
            Math.max(
              (params.row.vacant_lot / params.row.total_procedures) * 100,
              0
            ),
            100
          );

          let progressColor;
          if (percentage <= 33) {
            progressColor = "error";
          } else if (percentage <= 66) {
            progressColor = "warning";
          } else {
            progressColor = "success";
          }

          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* Valor principal */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1em",
                }}
              >
                {params.value}
              </Typography>

              {/* Barra de progreso */}
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  width: "100%",
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                color={progressColor}
              />

              {/* Porcentaje */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.75em",
                }}
              >
                {`${Math.round(percentage)}%`}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "abandoned_property",
        headerName: "PREDIO ABANDONADO",
        width: 180,
        editable: false,
        renderCell: (params) => {
          const percentage = Math.min(
            Math.max(
              (params.row.abandoned_property / params.row.total_procedures) *
                100,
              0
            ),
            100
          );

          let progressColor;
          if (percentage <= 33) {
            progressColor = "error";
          } else if (percentage <= 66) {
            progressColor = "warning";
          } else {
            progressColor = "success";
          }

          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* Valor principal */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1em",
                }}
              >
                {params.value}
              </Typography>

              {/* Barra de progreso */}
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  width: "100%",
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                color={progressColor}
              />

              {/* Porcentaje */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.75em",
                }}
              >
                {`${Math.round(percentage)}%`}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "not_located",
        headerName: "NO LOCALIZADAS",
        width: 150,
        editable: false,
        renderCell: (params) => {
          const percentage = Math.min(
            Math.max(
              (params.row.not_located / params.row.total_procedures) * 100,
              0
            ),
            100
          );

          let progressColor;
          if (percentage <= 33) {
            progressColor = "error";
          } else if (percentage <= 66) {
            progressColor = "warning";
          } else {
            progressColor = "success";
          }

          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* Valor principal */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1em",
                }}
              >
                {params.value}
              </Typography>

              {/* Barra de progreso */}
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  width: "100%",
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                color={progressColor}
              />

              {/* Porcentaje */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.75em",
                }}
              >
                {`${Math.round(percentage)}%`}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "not_position",
        headerName: "CUENTAS SIN POSICION",
        width: 180,
        editable: false,
        renderCell: (params) => {
          let color;

          if (params.value > 0) {
            color = theme.palette.error.main;
          } else {
            color = theme.palette.secondary.main;
          }

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "1.2em" }}
              >
                {params.value}
              </Typography>
              <NotListedLocation sx={{ color: color }} />
            </div>
          );
        },
      },
      {
        field: "total_photos",
        headerName: "FOTOS TOMADAS",
        width: 150,
        editable: false,
        renderCell: (params) => {
          let color;

          if (params.value === 0) {
            color = theme.palette.error.main;
          } else {
            color = theme.palette.secondary.main;
          }

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "1.2em" }}
              >
                {params.value}
              </Typography>
              <Photo sx={{ color: color }} />
            </div>
          );
        },
      },
      {
        field: "total_not_photos",
        headerName: "CUENTAS SIN FOTOS",
        width: 170,
        editable: false,
        renderCell: (params) => {
          let color;

          if (params.value > 0) {
            color = theme.palette.error.main;
          } else {
            color = theme.palette.secondary.main;
          }

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "1.2em" }}
              >
                {params.value}
              </Typography>
              <Photo sx={{ color: color }} />
            </div>
          );
        },
      },
      {
        field: "actions",
        headerName: "ACCION",
        width: 150,
        renderCell: (params) => (
          <Button
            variant="contained"
            color="info"
            endIcon={<Preview />}
            onClick={() =>
              handleOpenPopup(params.row.user_id, params.row.date_capture)
            }
            sx={{
              color: "white",
              borderRadius: "35px",
            }}
          >
            Ver
          </Button>
        ),
      },
    ];
  }, []);

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

  useEffect(() => {
    setSearchPerformed(true);

    if (!searchTerm) {
      setFilteredUsers([]);
      setNoResults(false);
      setMatching(-1);
      return;
    }

    const matchingUsers = data.filter((user) => {
      return Object.values(user).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (matchingUsers.length === 0) {
      setFilteredUsers([]);
      setNoResults(true);
      setMatching(0);
    } else {
      setFilteredUsers(matchingUsers);
      setNoResults(false);
      setMatching(matchingUsers.length);
    }
  }, [searchTerm]);

  useEffect(() => {
    setNoResults(false);
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleDownloadExcelDataGrid = async () => {
    try {
      setIsLoading(true);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");

      const columnHeaders = {
        name: "NOMBRE",
        date_capture: "FECHA",
        first_and_last_management: "PRIMERA Y ULTIMA GESTION",
        hours_worked: "HORAS TRABAJADAS",
        total_procedures: "GESTIONES REALIZADAS",
        located: "PREDIO LOCALIZADO",
        vacant_lot: "PREDIO BALDIO",
        abandoned_property: "PREDIO ABANDONADO",
        not_located: "PREDIO NO LOCALIZADO",
        not_position: "GESTIONES SIN POSICION",
        total_not_photos: "GESTIONES SIN FOTO",
        total_photos: "FOTOS TOMADAS",
      };

      const addRowsToWorksheet = (data) => {
        const headers = Object.keys(columnHeaders);
        const headerRow = headers.map((header) => columnHeaders[header]);
        worksheet.addRow(headerRow);

        data.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
      };

      if (filteredUsers.length > 0) {
        addRowsToWorksheet(filteredUsers);
      } else {
        addRowsToWorksheet(data);
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Registros_Asistencia.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="500px"
      gap="15px"
    >
      <LoadingModal open={isLoading} />
      <Box
        sx={{
          cursor: "pointer",
          gridColumn: "span 12",
          backgroundColor: "rgba(128, 128, 128, 0.1)",
          borderRadius: "10px",
          overflowY: "hidden",
          overflowX: "scroll",
        }}
      >
        {data.length > 0 && (
          <>
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{
                justifyContent: {
                  xs: "flex-start",
                  md: "space-between",
                },
              }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    paddingTop: 1,
                    color: colors.accentGreen[100],
                  }}
                >
                  RESUMEN DE ACTIVIDADES
                </Typography>
              </Grid>

              <Grid container item xs={12} spacing={2} alignItems="center" paddingBottom= "10px">
                {/* Campo de búsqueda */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField
                    label="Busqueda"
                      value={searchTerm}
                      onChange={handleChange}
                      color="secondary"
                      size="small"
                      placeholder="Ingresa tu búsqueda"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Search sx={{ color: colors.accentGreen[100] }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px", // Bordes redondeados
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.accentGreen[100], // Color predeterminado del borde
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "accent.light", // Color al pasar el mouse
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "accent.dark", // Color al enfocar
                          },
                        },                        
                      }}
                    />
                    {noResults && (
                      <FormHelperText style={{ color: "red" }}>
                        No se encontraron resultados
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Botón de exportar */}
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleDownloadExcelDataGrid}                    
                    endIcon={<Download />}
                    fullWidth
                    sx={{
                      borderRadius: "35px",
                      color: "white",
                    }}
                  >
                    Exportar
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={filteredUsers.length > 0 ? filteredUsers : data}
                  columns={buildColumns.map((column) => ({
                    ...column,
                    renderHeader: () => (
                      <Typography
                        sx={{
                          color: colors.contentSearchButton[100],
                          fontWeight: "bold",
                        }}
                      >
                        {column.headerName}
                      </Typography>
                    ),
                  }))}
                  getRowId={(row) => row.id}
                  editable={false}
                  autoPageSize
                  sx={{
                    borderRadius: "8px",
                    boxShadow: 3,
                    padding: 0,
                    background: "rgba(128, 128, 128, 0.1)",
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: colors.accentGreen[100], // Color de fondo deseado
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderBottomLeftRadius: "8px",
                      borderBottomRightRadius: "8px",
                      backgroundColor: colors.accentGreen[100], // Fondo del footer (paginador)
                      color: colors.contentSearchButton[100], // Color de texto dentro del footer
                    },
                    "& .MuiTablePagination-root": {
                      color: colors.contentSearchButton[100], // Color del texto del paginador
                    },
                    // Estilos específicos para los íconos en el encabezado y pie de página
                    "& .MuiDataGrid-columnHeaders .MuiSvgIcon-root, .MuiDataGrid-footerContainer .MuiSvgIcon-root":
                      {
                        color: colors.contentSearchButton[100], // Color de los íconos (flechas)
                      },
                    // Evitar que los íconos en las celdas se vean afectados
                    "& .MuiDataGrid-cell .MuiSvgIcon-root": {
                      color: "inherit", // No afectar el color de los íconos en las celdas
                    },
                  }}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Box>
      <PopupViewPositionDailyWorkSummary
        open={popupOpen}
        onClose={handleClosePopup}
        userId={popupData.userId}
        dateCapture={popupData.dateCapture}
        placeId={placeId}
        serviceId={serviceId}
        proccessId={proccessId}
      />
    </Box>
  );
}
export default DataGridManagementByManager;
