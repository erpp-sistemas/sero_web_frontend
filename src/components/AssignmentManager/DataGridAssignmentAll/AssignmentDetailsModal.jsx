import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  useTheme,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Switch,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { Cancel, CheckCircle, Search } from "@mui/icons-material";

function AssignmentDetailsModal({
  isModalOpen,
  setIsModalOpen,
  selectedGestor,
  setSelectedGestor,
  filteredGestor,
}) {
  if (!filteredGestor || filteredGestor.length === 0) {
    return;
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedChip, setSelectedChip] = useState("asignadas");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [individualChanges, setIndividualChanges] = useState({});

  // Resetear filtro cuando el modal se abre
  useEffect(() => {
    if (isModalOpen) {
      setSelectedChip("asignadas");
      setSelectedDate("");
      setSearchQuery("");
      setSelectAll(false);
      setIndividualChanges({});
    }
  }, [isModalOpen]);

  // Limpiar selección al cambiar de chip
  useEffect(() => {
    setSelectAll(false);
    setIndividualChanges({});
  }, [selectedChip]);

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    const newChanges = {};
    filteredData.forEach((row) => {
      newChanges[row.id_asignacion] = event.target.checked ? 1 : 0;
    });
    setIndividualChanges(newChanges);
  };

  const handleIndividualChange = (id, value) => {
    setIndividualChanges((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const columns = useMemo(
    () => [
      { field: "cuenta", headerName: "Cuenta", flex: 1 },
      {
        field: "fecha_asignacion",
        headerName: "Fecha de Asignación",
        flex: 1,
        valueFormatter: (params) =>
          params.value ? params.value.split(".")[0].replace("T", " ") : "",
      },
      {
        field: "switchStatus",
        headerName: (
          <FormControlLabel
            control={
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAllChange}
                color="default"
              />
            }
            label="CAMBIAR ESTATUS"
          />
        ),
        flex: 1,
        renderCell: (params) => {
          const isChecked =
            individualChanges[params.row.id_asignacion] !== undefined
              ? individualChanges[params.row.id_asignacion] === 1
              : params.row.id_estatus_asignacion === 1;

          const handleSwitchChange = (event) => {
            handleIndividualChange(
              params.row.id_asignacion,
              event.target.checked ? 1 : 0
            );
          };

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Switch
                checked={isChecked}
                onChange={handleSwitchChange}
                color="default"
                checkedIcon={
                  <CheckCircle sx={{ color: colors.greenAccent[800] }} />
                }
                icon={<Cancel sx={{ color: colors.redAccent[400] }} />}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: colors.greenAccent[400],
                    "&:hover": {
                      backgroundColor: colors.greenAccent[400] + "20",
                    },
                  },
                  "& .MuiSwitch-switchBase": {
                    color: colors.redAccent[400],
                    "&:hover": {
                      backgroundColor: colors.redAccent[400] + "20",
                    },
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: isChecked
                      ? colors.greenAccent[400]
                      : colors.redAccent[400],
                  },
                  transform: "scale(1.5)", // Tamaño del Switch
                }}
                inputProps={{
                  "aria-label": "controlled",
                }}
              />
              <Typography
                variant="body1"
                sx={{ marginLeft: 1, fontWeight: "bold" }}
              >
                {isChecked ? "Activo" : "Inactivo"}
              </Typography>
            </Box>
          );
        },
      },
    ],
    [selectAll, individualChanges]
  );

  const filteredData = useMemo(() => {
    let data = filteredGestor;

    // Filtrar según chip seleccionado
    switch (selectedChip) {
      case "activas":
        data = data.filter((item) => item.id_estatus_asignacion === 1);
        break;
      case "inactivas":
        data = data.filter((item) => item.id_estatus_asignacion !== 1);
        break;
      default:
        break;
    }

    // Aplicar filtro por fecha solo si no se ha seleccionado "Todas las Fechas"
    if (selectedDate) {
      data = data.filter((item) => item.fecha_asignacion === selectedDate);
    }

    // Aplicar filtro de búsqueda por cuenta
    if (searchQuery) {
      data = data.filter((item) =>
        item.cuenta.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data;
  }, [selectedChip, selectedDate, searchQuery, filteredGestor]);

  // Obtener fechas únicas con contadores
  const uniqueDatesWithCount = useMemo(() => {
    let data;
    switch (selectedChip) {
      case "activas":
        data = filteredGestor.filter(
          (item) => item.id_estatus_asignacion === 1
        );
        break;
      case "inactivas":
        data = filteredGestor.filter(
          (item) => item.id_estatus_asignacion !== 1
        );
        break;
      default:
        data = filteredGestor;
    }

    // Contar registros por fecha
    const dateCounts = data.reduce((acc, item) => {
      acc[item.fecha_asignacion] = (acc[item.fecha_asignacion] || 0) + 1;
      return acc;
    }, {});

    // Convertir a un array con formato [{ fecha, count }]
    return Object.entries(dateCounts).map(([fecha, count]) => ({
      fecha,
      count,
    }));
  }, [selectedChip, filteredGestor]);

  return (
    <Dialog
      open={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedGestor(null);
      }}
      maxWidth="lg"
      fullWidth
    >
      <DialogContent
        sx={{
          backgroundColor: "background.paper",
          border: `2px solid ${colors.accentGreen[100]}`,
        }}
      >
        {selectedGestor && (
          <>
            <div className="w-full text-white">
              <div className="w-full p-4 rounded-lg shadow-md mb-4">
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.accentGreen[100],
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Listado de Asignaciones - {selectedGestor.gestor}
                </Typography>
                {/* Contenedor de los Chips */}
                <div className="w-full pb-3 rounded-lg shadow-md">
                  <div className="flex justify-around my-4">
                    {["asignadas", "activas", "inactivas"].map(
                      (type, index) => (
                        <Chip
                          key={index}
                          label={
                            <Typography fontWeight="bold">
                              {type === "asignadas" && "Cuentas Asignadas: "}
                              {type === "activas" && "Cuentas Activas: "}
                              {type === "inactivas" && "Cuentas Inactivas: "}
                              <Typography
                                component="span"
                                variant="h5"
                                fontWeight="bold"
                              >
                                {type === "asignadas"
                                  ? selectedGestor.total_cuentas
                                  : type === "activas"
                                  ? selectedGestor.total_cuentas_activas
                                  : selectedGestor.total_cuentas_inactivas}
                              </Typography>
                            </Typography>
                          }
                          clickable
                          onClick={() => {
                            setSelectedChip(type);
                            setSelectedDate(""); // Resetear la fecha al cambiar de chip
                            setSearchQuery(""); // Limpiar el campo de búsqueda al cambiar de chip
                          }}
                          sx={{
                            backgroundColor:
                              selectedChip === type
                                ? colors.accentGreen[100]
                                : "default",
                            color:
                              selectedChip === type
                                ? colors.contentAccentGreen[100]
                                : "inherit",
                            "&:hover": {
                              backgroundColor:
                                selectedChip === type
                                  ? colors.accentGreen[200]
                                  : "default",
                            },
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="w-full p-3 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Selector de Fechas */}
                    <FormControl fullWidth>
                      <InputLabel id="place-select-label" shrink>
                        Selecciona una fecha de asignacion
                      </InputLabel>
                      <Select
                        size="small"
                        labelId="place-select-label"
                        id="place-select"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        displayEmpty
                        label="Selecciona una fecha de asignacion"
                        sx={{
                          borderRadius: "20px", // Bordes redondeados
                          fontSize: "14px", // Tamaño de fuente
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                            backgroundColor: "white", // Fondo blanco
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.accentGreen[100], // Borde inicial
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.accentGreen[200], // Borde al hacer hover
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.accentGreen[300], // Borde cuando está enfocado
                            },
                          },
                        }}
                      >
                        {/* Opción por defecto: "Todas las Fechas" */}
                        <MenuItem value="">
                          <em>Todas las Fechas</em>
                        </MenuItem>

                        {/* Listado de fechas con contadores */}
                        {uniqueDatesWithCount.map(({ fecha, count }) => (
                          <MenuItem key={fecha} value={fecha}>
                            {fecha} ({count})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                    </FormControl>
                  </div>
                </div>

                {/* Campo de búsqueda de cuentas */}
                <div className="w-full p-3 rounded-lg shadow-md"></div>

                <div className="w-full pb-3 rounded-lg shadow-md flex flex-col max-h-[600px] overflow-auto">
                  {filteredData.length === 0 ? (
                    <Typography variant="h6" align="center">
                      No se encontraron resultados.
                    </Typography>
                  ) : (
                    <DataGrid
                      rows={filteredData}
                      columns={columns.map((column) => ({
                        ...column,
                        renderHeader: () => (
                          <Typography
                            sx={{
                              color: colors.contentSearchButton[100],
                              fontWeight: "bold",
                              textTransform: "uppercase",
                            }}
                          >
                            {column.headerName}
                          </Typography>
                        ),
                      }))}
                      disableSelectionOnClick
                      sx={{
                        borderRadius: "8px",
                        boxShadow: 3,
                        padding: 0,
                        background: "rgba(128, 128, 128, 0.1)",
                        "& .MuiDataGrid-cell": {
                          fontSize: "14px",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: colors.accentGreen[100],
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        },
                        "& .MuiDataGrid-footerContainer": {
                          borderBottomLeftRadius: "8px",
                          borderBottomRightRadius: "8px",
                          backgroundColor: colors.accentGreen[100],
                          color: colors.contentSearchButton[100],
                        },
                        "& .MuiTablePagination-root": {
                          color: colors.contentSearchButton[100],
                        },
                        "& .MuiDataGrid-columnHeaders .MuiSvgIcon-root, .MuiDataGrid-footerContainer .MuiSvgIcon-root":
                          {
                            color: colors.contentSearchButton[100],
                          },
                        "& .MuiDataGrid-cell .MuiSvgIcon-root": {
                          color: "inherit",
                        },
                      }}
                      getRowId={(row) => row.id_asignacion || Math.random()}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setIsModalOpen(false);
            setSelectedGestor(null);
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssignmentDetailsModal;
