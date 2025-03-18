import { useState, useEffect, useMemo } from "react";
import {
  Box,
  useTheme,
  Avatar,
  Typography,
  LinearProgress,
  InputAdornment,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import Viewer from "react-viewer";
import { TaskAlt, Search } from "@mui/icons-material";
import { tokens } from "../../theme";

function DataGridAssignmentAll({ data }) {
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
        field: "gestor",
        headerName: "NOMBRE",
        flex: 2,
        editable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", p: "12px" }}>
            <AvatarImage data={params.row.imagen_usuario} />
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: "cuentas_asignada",
        headerName: "GESTIONES",
        flex: 1,
        editable: false,
        renderCell: (params) => {
          let color = colors.accentGreen[100];
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
              {/* <TaskAlt sx={{ color: color }} /> */}
            </div>
          );
        },
      },      
      {
        field: "cuentas_activas",
        headerName: "cuentas activas",
        flex: 1,
        editable: false,
        renderCell: (params) => {
          let color = colors.accentGreen[100];
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
              {/* <TaskAlt sx={{ color: color }} /> */}
            </div>
          );
        },
      },
      {
        field: "cuentas_inactivas",
        headerName: "cuentas inactivas",
        flex: 1,
        editable: false,
        renderCell: (params) => {
          let color = colors.accentGreen[100];
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
              {/* <TaskAlt sx={{ color: color }} /> */}
            </div>
          );
        },
      },
    ];
  }, []);

  const AvatarImage = ({ data }) => {
    const [visibleAvatar, setVisibleAvatar] = useState(false);
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
  }, [data, searchTerm]);

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
                  sx={{
                    fontWeight: "bold",
                    paddingTop: 1,
                    color: colors.accentGreen[100],
                  }}
                >
                  Listado de gestores
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ paddingBottom: 1 }}>
                <FormControl>
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
                  getRowId={(row) => row.gestor}
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

export default DataGridAssignmentAll;
