import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Button,
  Checkbox,
  ListItemText,
  TextField,
  Box,
} from "@mui/material";
import { tokens } from "../../theme";
import { KeyboardArrowDownOutlined, SearchOutlined } from "@mui/icons-material";

const FilterBar = ({ plazas = [], onChange, isLoading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedPlaza, setSelectedPlaza] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [rangoDias, setRangoDias] = useState(60); // Valor por defecto 60
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Opciones predefinidas para días válidos
  const opcionesDias = [30, 60, 90, 120, 150];

  const selectStyles = {
    borderRadius: "10px",
    fontSize: "0.875rem",
    backgroundColor: colors.bgContainer,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.borderContainer,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.accentGreen[100],
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.accentGreen[200],
      boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
    },
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontSize: "0.875rem",
      backgroundColor: colors.bgContainer,
      "& fieldset": {
        borderColor: colors.borderContainer,
      },
      "&:hover fieldset": {
        borderColor: colors.accentGreen[100],
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.accentGreen[200],
        boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
      },
    },
    "& .MuiInputLabel-root": {
      color: colors.grey[600],
      fontSize: "0.875rem",
    },
  };

  // Cargar valores iniciales y fechas por defecto
  useEffect(() => {
    if (plazas.length > 0) {
      const firstPlaza = plazas[0];
      const firstServicio = firstPlaza.servicios?.[0] || null;
      const firstProceso = firstServicio?.procesos?.[0] || null;

      setSelectedPlaza(firstPlaza);
      setSelectedServicio(firstServicio);
      setSelectedProceso(firstProceso);
    }

    // Establecer fechas por defecto (fecha actual para ambos)
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    setFechaInicio(todayString);
    setFechaFin(todayString);
  }, [plazas]);

  const handlePlazaChange = (event) => {
    const plaza = plazas.find((p) => p.id_plaza === event.target.value);
    const firstServicio = plaza.servicios?.[0] || null;
    const firstProceso = firstServicio?.procesos?.[0] || null;

    setSelectedPlaza(plaza);
    setSelectedServicio(firstServicio);
    setSelectedProceso(firstProceso);
  };

  const handleServicioChange = (event) => {
    const servicio = selectedPlaza?.servicios.find(
      (s) => s.id_servicio === event.target.value,
    );
    const firstProceso = servicio?.procesos?.[0] || null;

    setSelectedServicio(servicio);
    setSelectedProceso(firstProceso);
  };

  const handleProcesoChange = (event) => {
    const proceso = selectedServicio?.procesos.find(
      (p) => p.id_proceso === event.target.value,
    );
    setSelectedProceso(proceso);
  };

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  const handleBuscar = () => {
    if (!selectedPlaza || !selectedServicio || !selectedProceso) return;

    onChange({
      plazaId: selectedPlaza.id_plaza,
      servicioId: selectedServicio.id_servicio,
      procesoId: selectedProceso.id_proceso,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    });
  };

  return (
    <Box className="w-full space-y-4">
      {/* Fila 1: Plaza, Servicio, Proceso */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-end">
        {/* Plaza */}
        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: colors.grey[600], fontSize: "0.875rem" }}>
            Plaza
          </InputLabel>
          <Select
            value={selectedPlaza?.id_plaza || ""}
            onChange={handlePlazaChange}
            label="Plaza"
            sx={selectStyles}
            IconComponent={(props) => (
              <KeyboardArrowDownOutlined
                {...props}
                sx={{ color: colors.grey[300], fontSize: 20 }}
              />
            )}
          >
            {plazas.map((plaza) => (
              <MenuItem key={plaza.id_plaza} value={plaza.id_plaza}>
                {plaza.nombre_plaza}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Servicio */}
        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: colors.grey[600], fontSize: "0.875rem" }}>
            Servicio
          </InputLabel>
          <Select
            value={selectedServicio?.id_servicio || ""}
            onChange={handleServicioChange}
            label="Servicio"
            sx={selectStyles}
            IconComponent={(props) => (
              <KeyboardArrowDownOutlined
                {...props}
                sx={{ color: colors.grey[300], fontSize: 20 }}
              />
            )}
          >
            {selectedPlaza?.servicios?.map((servicio) => (
              <MenuItem key={servicio.id_servicio} value={servicio.id_servicio}>
                {servicio.nombre_servicio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Proceso */}
        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: colors.grey[600] }}>Proceso</InputLabel>
          <Select
            value={selectedProceso?.id_proceso || ""}
            onChange={handleProcesoChange}
            label="Proceso"
            sx={selectStyles}
            IconComponent={(props) => (
              <KeyboardArrowDownOutlined
                {...props}
                sx={{ color: colors.grey[300], fontSize: 20 }}
              />
            )}
          >
            {selectedServicio?.procesos?.map((proceso) => (
              <MenuItem key={proceso.id_proceso} value={proceso.id_proceso}>
                {proceso.nombre_proceso}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Fila 2: Rango de días, Fechas y Botón */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-end">
        {/* Fecha Inicio */}
        <TextField
          label="Fecha inicio"
          type="date"
          value={fechaInicio}
          onChange={handleFechaInicioChange}
          size="small"
          sx={textFieldStyles}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            style: { fontSize: "0.875rem" },
          }}
        />

        {/* Fecha Fin */}
        <TextField
          label="Fecha fin"
          type="date"
          value={fechaFin}
          onChange={handleFechaFinChange}
          size="small"
          sx={textFieldStyles}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            style: { fontSize: "0.875rem" },
          }}
        />

        {/* Botón Buscar */}
        <Button
          variant="contained"
          onClick={handleBuscar}
          disabled={!selectedProceso || isLoading || !fechaInicio || !fechaFin}
          endIcon={
            <SearchOutlined sx={{ fontSize: 18, color: colors.textAccent }} />
          }
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: 500,
            fontSize: "0.875rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            backgroundColor: colors.accentGreen[100],
            color: colors.textAccent,
            border: "none",
            cursor: "pointer",
            height: "40px",
            "&:hover": {
              backgroundColor: colors.accentGreen[200],
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            },
            "&:active": { backgroundColor: colors.accentGreen[300] },
            transition: "all 0.3s ease",
            boxShadow: "none",
            "&.Mui-disabled": {
              backgroundColor: colors.grey[300],
              color: colors.grey[500],
            },
          }}
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </Box>
  );
};

export default FilterBar;
