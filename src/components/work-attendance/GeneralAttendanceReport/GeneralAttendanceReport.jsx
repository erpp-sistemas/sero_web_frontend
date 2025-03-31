import React, { useState, useEffect } from "react";
import {
  useTheme,
  Box,
  Grid,
  Typography,
  FormControl,
  TextField,
  InputAdornment,
  FormHelperText,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import { tokens } from "../../../theme";
import { DataGrid } from "@mui/x-data-grid";
import buildColumns from "../GeneralAttendanceReport/buildColumns.jsx";
import { AlarmOff, Download, Public, Search } from "@mui/icons-material";
import * as ExcelJS from "exceljs";
import ModalTable from "../ModalTable.jsx";
import FilteredList from "./FilteredList/FilteredList.jsx";
import Viewer from "react-viewer";
import IndividualAttendanceReportButton from "./IndividualAttendanceReportButton.jsx";

function GeneralAttendanceReport({ data, reportWorkHoursData }) {
  if (!data) {
    return null;
  }

  console.log(data)

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const useBuildColumns = buildColumns();

  const [columns, setColumns] = useState([]);

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
    if (reportWorkHoursData && reportWorkHoursData.length > 0) {
      const columnSet = new Set();

      reportWorkHoursData.forEach((item) => {
        Object.keys(item).forEach((key) => columnSet.add(key));
      });

      const filteredColumns = Array.from(columnSet).filter(
        (key) => key !== "id_usuario"
      );

      const dynamicColumns = filteredColumns.map((key) => {
        if (key === "usuario") {
          return {
            field: key,
            headerName: "NOMBRE",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
            ),
            width: 210,
            editable: false,
          };
        }
        if (key === "imagen_url") {
          return {
            field: key,
            headerName: "FOTO",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"FOTO"}</strong>
            ),
            width: 70,
            renderCell: (params) => (
              <AvatarImage data={params.row.imagen_url} />
            ),
          };
        }
        if (key === "plaza") {
          return {
            field: key,
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
          };
        }
        return {
          field: key,
          headerName: key,
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{key}</strong>
          ),
          width: 110,
          renderCell: (params) => {
            const value_p = params.value;

            if (!value_p) {
              return <AlarmOff color="info" />;
            }

            const value = parseInt(value_p, 10);

            let color = colors.accentGreen[100]; // Valor por defecto
            if (value === 8) {
              color = colors.yellowAccent[400];
            } else if (value <= 7) {
              color = colors.redAccent[400];
            } // Los valores >= 9 ya están en colors.accentGreen[100] por defecto

            return (
              <Avatar
                sx={{
                  bgcolor: color, // Color de fondo dinámico
                  color: colors.contentSearchButton[100], // Texto en blanco
                  fontWeight: "bold", // Negrita
                  fontSize: "1.1rem", // Tamaño de fuente
                  width: 30, // Tamaño del avatar
                  height: 30, // Tamaño del avatar
                }}
              >
                {value}
              </Avatar>
            );
          },
        };
      });

      setColumns(dynamicColumns);
      setRows(reportWorkHoursData);
    }
  }, [reportWorkHoursData]);

  const [rows, setRows] = useState([]);

  const [searchTerm, setSearchTerm] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredHours, setFilteredHours] = useState([]);
  const [matching, setMatching] = useState(-1);
  const [matchingHours, setMatchingHours] = useState(-1);

  const [noResults, setNoResults] = useState(false);
  const [noResultsHours, setNoResultsHours] = useState(false);

  const [totalRecords, setTotalRecords] = useState(0);
  const [resultCountsEntry, setResultCountsEntry] = useState({});
  const [resultCountsExit, setResultCountsExit] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers([]);
      setFilteredHours([]);
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

    const matchingHours = reportWorkHoursData.filter((hour) => {
      return Object.values(hour).some(
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

    if (matchingHours.length === 0) {
      setFilteredHours([]);
      setNoResultsHours(true);
      setMatchingHours(0);
    } else {
      setFilteredHours(matchingHours);
      setNoResultsHours(false);
      setMatchingHours(matchingHours.length);
    }
  }, [searchTerm]);

  useEffect(() => {
    setNoResults(false);
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  useEffect(() => {
    const usersToCount = filteredUsers.length > 0 ? filteredUsers : data;

    const countsE = usersToCount.reduce((acce, row) => {
      const resultE = row.estatus_entrada;
      acce[resultE] = (acce[resultE] || 0) + 1;
      return acce;
    }, {});

    const countsS = usersToCount.reduce((accs, row) => {
      const resultS = row.estatus_salida;
      accs[resultS] = (accs[resultS] || 0) + 1;
      return accs;
    }, {});

    setTotalRecords(usersToCount.length);
    setResultCountsEntry(countsE);
    setResultCountsExit(countsS);
  }, [data, filteredUsers]);

  const handleDownloadExcel = async (type, result) => {
    try {
      setIsLoading(true);

      const filteredData =
        filteredUsers.length > 0
          ? type === 1
            ? filteredUsers.filter((row) => row.estatus_entrada === result)
            : filteredUsers.filter((row) => row.estatus_salida === result)
          : type === 1
          ? data.filter((row) => row.estatus_entrada === result)
          : data.filter((row) => row.estatus_salida === result);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");

      if (filteredData.length === 0) {
        console.error("No hay datos para descargar.");
        setIsLoading(false);
        return;
      }

      const headers = Object.keys(filteredData[0]);
      worksheet.addRow(headers);

      filteredData.forEach((row) => {
        const values = headers.map((header) => row[header]);
        worksheet.addRow(values);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const handleOpenModal = (type, result) => {
    const usersToFilter = filteredUsers.length > 0 ? filteredUsers : data;

    let filteredData;

    if (type === 1) {
      filteredData = usersToFilter.filter(
        (row) => row.estatus_entrada === result
      );
    } else if (type === 2) {
      filteredData = usersToFilter.filter(
        (row) => row.estatus_salida === result
      );
    }

    setModalData(filteredData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDownloadExcelDataGrid = async () => {
    try {
      setIsLoading(true);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");

      if (filteredUsers.length > 0) {
        const headers = Object.keys(filteredUsers[0]);
        worksheet.addRow(headers);

        filteredUsers.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
      } else {
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        data.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
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

  const handleDownloadExcelDataGridHours = async () => {
    try {
      setIsLoading(true);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");

      if (filteredHours.length > 0) {
        const headers = Object.keys(filteredHours[0]);
        worksheet.addRow(headers);

        filteredHours.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
      } else {
        const headers = Object.keys(reportWorkHoursData[0]);
        worksheet.addRow(headers);

        reportWorkHoursData.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
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
      gridAutoRows="1300px"
      gap="15px"
    >
      <Box
        gridColumn="span 12"
        backgroundColor="paper"
        borderRadius="10px"
        sx={{ cursor: "pointer" }}
      >
        {data.length > 0 && (
          <>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ paddingBottom: 1 }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  
                  sx={{
                    fontWeight: "bold",
                    paddingTop: 1,
                    paddingBottom: 2,
                    color: colors.accentGreen[100],
                  }}
                >
                  LISTADO GENERAL DE ASISTENCIA
                </Typography>
              </Grid>

              <Grid
                xs={12}
                container
                alignItems="center"
                spacing={2}
                sx={{ paddingBottom: 1 }}
              >
                <Grid item xs={4}>
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

                <Grid item xs={2} sx={{ marginLeft: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="info"
                    onClick={handleDownloadExcelDataGrid}
                    
                    startIcon={<Download />}
                    sx={{
                      borderRadius: "35px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    Exportar
                  </Button>
                </Grid>
                <Grid item xs={2} sx={{ marginLeft: 1 }}>
                  <IndividualAttendanceReportButton
                    data={filteredUsers.length > 0 ? filteredUsers : data}
                  />
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
              <Grid item xs={12} md={8} style={{ height: 560, width: "100%" }}>
                <DataGrid
                  rows={filteredUsers.length > 0 ? filteredUsers : data}
                  columns={useBuildColumns.map((column) => ({
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
                  getRowId={(row) => row.usuario_id}
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
              <Grid item xs={12} md={4}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-evenly"
                  gap="10px"
                  sx={{
                    backgroundColor: colors.primary[400],
                    padding: "5px 5px",
                    borderRadius: "10px",
                    width: "100%",
                  }}
                >
                  <FilteredList
                    resultCountsEntry={resultCountsEntry}
                    resultCountsExit={resultCountsExit}
                    handleDownloadExcel={handleDownloadExcel}
                    handleOpenModal={handleOpenModal}
                    totalRecords={totalRecords}
                    colors={colors}
                    theme={theme}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ height: 560, width: "100%", marginTop: "20px" }}
              >
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ paddingBottom: 1 }}
                >
                  <Grid item xs={12}>
                    <Typography
                      variant="h4"
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        paddingTop: 1,
                        paddingBottom: 2,
                        color: colors.accentGreen[100],
                      }}
                    >
                      HORAS TRABAJADAS
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ p: 1 }}>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={handleDownloadExcelDataGridHours}
                      size="small"
                      startIcon={<Download />}
                      sx={{
                        borderRadius: "35px",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      Exportar
                    </Button>
                  </Grid>
                </Grid>

                <DataGrid
                  rows={filteredHours.length > 0 ? filteredHours : rows}
                  columns={columns.map((column) => ({
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
                  getRowId={(row) => row.id_usuario}
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

        <ModalTable
          open={openModal}
          onClose={handleCloseModal}
          data={modalData}
        />
      </Box>
    </Box>
  );
}

export default GeneralAttendanceReport;
