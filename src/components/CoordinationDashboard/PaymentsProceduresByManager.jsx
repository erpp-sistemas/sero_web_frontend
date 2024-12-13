import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  useTheme,
  Button,
  Avatar,
  Typography,
  LinearProgress,
  InputAdornment,
  FormControl,
  FormHelperText,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { tokens } from "../../theme";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Viewer from "react-viewer";
import { TaskAlt, Search } from "@mui/icons-material";

function PaymentsProceduresByManager({ data }) {
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
        field: "count",
        headerName: "GESTIONES",
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
        field: "procedures_with_payment",
        headerName: "CON PAGO",
        width: 150,
        editable: false,
        renderCell: (params) => {
          try {
            // Validar valores nulos o no definidos
            const proceduresWithPayment = params.row.procedures_with_payment ?? 0;
            const count = params.row.count ?? 0;
      
            // Manejar el caso donde count es 0 para evitar divisiones inválidas
            const percentage =
              count > 0
                ? Math.min(Math.max((proceduresWithPayment / count) * 100, 0), 100)
                : 0;
      
            // Determinar el color del progreso según el porcentaje
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
                  width: "100%", // Utilizamos todo el ancho disponible
                }}
              >
                {/* Valor principal */}
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                  {proceduresWithPayment}
                </Typography>
      
                {/* Barra de progreso */}
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    width: "80%",
                    height: 10,
                    borderRadius: 5, // Borde redondeado
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo suave de la barra
                  }}
                  color={progressColor}
                />
      
                {/* Porcentaje */}
                <Typography
                  variant="body1"
                  sx={{ fontSize: "0.8em" }}
                >
                  {`${Math.round(percentage)}%`}
                </Typography>
              </Box>
            );
          } catch (error) {
            console.error("Error en renderCell de CON PAGO:", error);
      
            return (
              <Typography color="error" variant="body2">
                Error
              </Typography>
            );
          }
        },
      },
      
      {
        field: "procedures_without_payment",
        headerName: "SIN PAGO",
        width: 150,
        editable: false,
        renderCell: (params) => {
          try {
            // Validar valores nulos o no definidos
            const proceduresWithoutPayment = params.row.procedures_without_payment ?? 0;
            const count = params.row.count ?? 0;
      
            // Manejar el caso donde count es 0 para evitar divisiones inválidas
            const percentage =
              count > 0
                ? Math.min(Math.max((proceduresWithoutPayment / count) * 100, 0), 100)
                : 0;
      
            // Determinar el color del progreso según el porcentaje
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
                  width: "100%", // Utilizamos todo el ancho disponible
                }}
              >
                {/* Valor principal */}
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                  {proceduresWithoutPayment}
                </Typography>
      
                {/* Barra de progreso */}
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    width: "80%",
                    height: 10,
                    borderRadius: 5, // Borde redondeado
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo suave de la barra
                  }}
                  color={progressColor}
                />
      
                {/* Porcentaje */}
                <Typography
                  variant="body1"
                  sx={{ fontSize: "0.8em" }}
                >
                  {`${Math.round(percentage)}%`}
                </Typography>
              </Box>
            );
          } catch (error) {
            console.error("Error en renderCell de SIN PAGO:", error);
      
            return (
              <Typography color="error" variant="body2">
                Error
              </Typography>
            );
          }
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
                  GESTIONES PAGADAS
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ paddingBottom: 1 }}>
                <FormControl>
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
    </Box>
  );
}
export default PaymentsProceduresByManager;
