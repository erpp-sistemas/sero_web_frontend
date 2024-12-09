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
  PersonPinCircle,
  TaskAlt,
  AddBusiness,
  ViewAgenda,
  Preview,
} from "@mui/icons-material";
import LoadingModal from "../../components/LoadingModal.jsx";
import * as ExcelJS from "exceljs";
import PopupViewPositionVerifiedAddress from "../../components/CoordinationDashboard/PopupViewPositionVerifiedAddress.jsx";

function VerifiedAddress({ data, placeId, serviceId, proccessId }) {
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

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({
    userId: null,
    dateCapture: null,
  });

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
        field: "user",
        headerName:"NOMBRE",
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
        field: "date_capture",
        headerName:"FECHA",
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
        field: "count",
        headerName:"GESTIONES",
        width: 100,
        editable: false,
        renderCell: (params) => {
          let color = theme.palette.secondary.main;
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
        field: "verified_address",
        headerName:"DOMICILIOS VERIFICADOS",
        width: 190,
        editable: false,
        renderCell: (params) => {
          let color = theme.palette.secondary.main;
          if (params.value == "0") {
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
                sx={{ fontWeight: "bold", fontSize: "1.2em", padding: 1 }}
              >
                {params.value}
              </Typography>
              <AddBusiness sx={{ color: color }} />
            </div>
          );
        },
      },
      {
        field: "actions",
        headerName:"ACCION",
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
              fontWeight: "bold"
            }}
            disabled={params.row.verified_address == 0}
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
        account: "Cuenta",
        street: "Direccion",
        latitude: "Latitud",
        longitude: "Longitud",
        position: "Posicion",
        manager: "Gestor que Gestiono",
        date_capture: "Fecha de Captura",
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
      a.download = `Registros_Domicilio_verificado.xlsx`;
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
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="stretch"
              spacing={2}
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
                  DOMICILIOS VERIFICADOS
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
                      label="Busqueda"
                      fullWidth
                      value={searchTerm}
                      onChange={handleChange}
                      color="secondary"
                      size="small"
                      placeholder="Ingresa tu búsqueda"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Search sx={{ color:colors.accentGreen[100]}} />
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
      <PopupViewPositionVerifiedAddress
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
export default VerifiedAddress;
