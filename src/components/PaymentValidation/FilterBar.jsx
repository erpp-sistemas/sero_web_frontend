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
  const [selectedProcesos, setSelectedProcesos] = useState([]);
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
      const procesosIniciales =
        firstServicio?.procesos?.map((p) => p.id_proceso) || [];

      setSelectedPlaza(firstPlaza);
      setSelectedServicio(firstServicio);
      setSelectedProcesos(procesosIniciales);
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
    const procesosIniciales =
      firstServicio?.procesos?.map((p) => p.id_proceso) || [];

    setSelectedPlaza(plaza);
    setSelectedServicio(firstServicio);
    setSelectedProcesos(procesosIniciales);
  };

  const handleServicioChange = (event) => {
    const servicio = selectedPlaza?.servicios.find(
      (s) => s.id_servicio === event.target.value
    );
    const procesosIniciales =
      servicio?.procesos?.map((p) => p.id_proceso) || [];

    setSelectedServicio(servicio);
    setSelectedProcesos(procesosIniciales);
  };

  const handleProcesosChange = (event) => {
    const value = event.target.value;
    setSelectedProcesos(typeof value === "string" ? value.split(",") : value);
  };

  const handleRangoDiasChange = (event) => {
    setRangoDias(parseInt(event.target.value));
  };

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  const handleBuscar = () => {
    if (!selectedPlaza || !selectedServicio || selectedProcesos.length === 0)
      return;

    const procesoIdString = selectedProcesos.join(",");

    onChange({
      plazaId: selectedPlaza.id_plaza,
      servicioId: selectedServicio.id_servicio,
      procesoId: procesoIdString,
      diasRango: rangoDias,
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

        {/* Proceso (multi-select) */}
        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: colors.grey[600], fontSize: "0.875rem" }}>
            Procesos
          </InputLabel>
          <Select
            multiple
            value={selectedProcesos}
            onChange={handleProcesosChange}
            label="Procesos"
            sx={selectStyles}
            renderValue={(selected) => {
              const names = selectedServicio?.procesos
                ?.filter((p) => selected.includes(p.id_proceso))
                ?.map((p) => p.nombre_proceso)
                ?.join(", ");
              return names || "Selecciona procesos";
            }}
            IconComponent={(props) => (
              <KeyboardArrowDownOutlined
                {...props}
                sx={{ color: colors.grey[300], fontSize: 20 }}
              />
            )}
          >
            {selectedServicio?.procesos?.map((proceso) => (
              <MenuItem key={proceso.id_proceso} value={proceso.id_proceso}>
                <Checkbox
                  checked={selectedProcesos.includes(proceso.id_proceso)}
                  size="small"
                  sx={{
                    color: colors.grey[400],
                    "&.Mui-checked": { color: colors.accentGreen[200] },
                  }}
                />
                <ListItemText
                  primary={proceso.nombre_proceso}
                  sx={{ fontSize: "0.875rem" }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Fila 2: Rango de días, Fechas y Botón */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 items-end">
        {/* Rango de Días (ahora como Select) */}
        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: colors.grey[600], fontSize: "0.875rem" }}>
            Días válidos
          </InputLabel>
          <Select
            value={rangoDias}
            onChange={handleRangoDiasChange}
            label="Días válidos"
            sx={selectStyles}
            IconComponent={(props) => (
              <KeyboardArrowDownOutlined
                {...props}
                sx={{ color: colors.grey[300], fontSize: 20 }}
              />
            )}
          >
            {opcionesDias.map((dias) => (
              <MenuItem key={dias} value={dias}>
                {dias} días
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          disabled={
            selectedProcesos.length === 0 ||
            isLoading ||
            !fechaInicio ||
            !fechaFin
          }
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
