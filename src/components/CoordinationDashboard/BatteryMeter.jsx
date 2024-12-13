import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  useTheme,
  Avatar,
  Typography,
  LinearProgress,
  InputAdornment,
  FormControl,
  FormHelperText,
  Chip,
  Button,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Viewer from "react-viewer";
import {
  Search,
  CalendarToday,
  AccessTime,
  Download,
} from "@mui/icons-material";
import LoadingModal from "../../components/LoadingModal.jsx";
import * as ExcelJS from "exceljs";

function BatteryMeter({ data }) {

  console.log(data)
  if (!data) {
    return null;
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [matching, setMatching] = useState(-1);

  const [noResults, setNoResults] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const buildColumns = useMemo(() => {
    return [
      {
        field: "user",
        headerName: "NOMBRE",
        width: 270,
        editable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", p: "12px" }}>
            <AvatarImage data={params.row.image_user} />
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: "date",
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
            variant="outlined"
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
        field: "first_hour_percentage",
        headerName: "PRIMER HORA",
        width: 150,
        editable: false,
        renderCell: (params) => {
          let color;
          color = theme.palette.secondary.main;

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
                background: colors.tealAccent[500],
                color: colors.contentAccentGreen[100],
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },
      {
        field: "first_percentage",
        headerName: "PRIMER PORCENTAGE",
        width: 180,
        editable: false,
        renderCell: (params) => {
          const percentage = params.value;
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
              <LinearProgress
                variant="determinate"
                value={params.value}
                sx={{
                  width: "100%",
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                color={progressColor}
              />
              <Typography variant="body1" sx={{ fontSize: "1.2em" }}>
                {`${Math.round(params.value)}%`}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "last_hour_percentage",
        headerName: "ULTIMA HORA",
        width: 150,
        editable: false,
        renderCell: (params) => {
          let color;
          color = theme.palette.warning.main;

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
                background: colors.yellowAccent[400],
                color: colors.contentAccentGreen[100],
                "& .MuiChip-icon": {
                  color: theme.palette.info.main,
                },
              }}
            />
          );
        },
      },
      {
        field: "last_percentage",
        headerName: "ULTIMO PORCENTAGE",
        width: 170,
        editable: false,
        renderCell: (params) => {
          const percentage = params.value;
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
              <LinearProgress
                variant="determinate"
                value={params.value}
                sx={{
                  width: "100%",
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                color={progressColor}
              />
              <Typography variant="body1" sx={{ fontSize: "1.2em" }}>
                {`${Math.round(params.value)}%`}
              </Typography>
            </Box>
          );
        },
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
        user: "GESTOR",
        date: "FECHA",
        first_hour_percentage: "PRIMER HORA ",
        first_percentage: "PRIMER PORCENTAGE",
        last_hour_percentage: "ULTIMA HORA",
        last_percentage: "ULTIMO PORCENTAGE",
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
      a.download = `Registros_Medidor_Pila.xlsx`;
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
      gridAutoRows="480px"
      gap="15px"
    >
      <Box
        gridColumn="span 12"
        backgroundColor="rgba(128, 128, 128, 0.1)"
        borderRadius="10px"
        sx={{ cursor: "pointer" }}
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
                  MEDIDOR DE BATERIA
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                spacing={2}
                alignItems="center"
                paddingBottom="10px"
              >
                {/* Campo de búsqueda */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      value={searchTerm}
                      onChange={handleChange}
                      color="secondary"
                      size="small"
                      placeholder="Ingresa tu búsqueda"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Search color="secondary" />
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
                    onClick={() => {
                      handleDownloadExcelDataGrid();
                    }}
                    endIcon={<Download />}
                    sx={{
                      borderRadius: "35px",
                      color: "white",
                      fontWeight: "bold"
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
              alignItems="stretch"
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
      <LoadingModal open={isLoading} />
    </Box>
  );
}
export default BatteryMeter;
