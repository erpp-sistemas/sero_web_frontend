import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import { KeyboardArrowDownOutlined, SearchOutlined } from "@mui/icons-material";

const FilterBar = ({ plazas = [], onChange, isLoading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedPlaza, setSelectedPlaza] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [selectedProceso, setSelectedProceso] = useState(null);

  // 🎨 Estilos comunes
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

  // 🧠 Cargar valores iniciales
  useEffect(() => {
    if (plazas.length > 0) {
      const firstPlaza = plazas[0];
      const firstServicio = firstPlaza.servicios?.[0] || null;
      const firstProceso = firstServicio?.procesos?.[0] || null;

      setSelectedPlaza(firstPlaza);
      setSelectedServicio(firstServicio);
      setSelectedProceso(firstProceso);
    }
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
      (s) => s.id_servicio === event.target.value
    );
    const firstProceso = servicio?.procesos?.[0] || null;
    setSelectedServicio(servicio);
    setSelectedProceso(firstProceso);
  };

  const handleProcesoChange = (event) => {
    const proceso = selectedServicio?.procesos.find(
      (p) => p.id_proceso === event.target.value
    );
    setSelectedProceso(proceso);
  };

  const handleBuscar = () => {
    if (!selectedPlaza || !selectedServicio || !selectedProceso) return;
    onChange({
      plazaId: selectedPlaza.id_plaza,
      servicioId: selectedServicio.id_servicio,
      procesoId: selectedProceso.id_proceso,
    });
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 items-end">
      {/* Plaza */}
      <FormControl fullWidth size="small">
        <InputLabel sx={{ color: colors.grey[600] }}>Plaza</InputLabel>
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
        <InputLabel sx={{ color: colors.grey[600] }}>Servicio</InputLabel>
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

      {/* Botón Buscar */}
      <Button
        variant="contained"
        onClick={handleBuscar}
        disabled={!selectedProceso || isLoading}
        endIcon={<SearchOutlined  sx={{ fontSize: 18, color: colors.textAccent }}/>}
        sx={{
                textTransform: "none", // minimalista, sin mayúsculas forzadas
                borderRadius: "10px", // bordes redondeados suaves
                fontWeight: 500,
                fontSize: "0.875rem", // tamaño legible, consistente
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px", // espacio limpio entre texto e icono
                backgroundColor: colors.accentGreen[100], // color normal
                color: colors.textAccent, // contraste legible
                border: "none",
                cursor: "pointer",

                "&:hover": {
                  backgroundColor: colors.accentGreen[200], // hover sutil
                },
                "&:active": {
                  backgroundColor: colors.accentGreen[300], // feedback presionado
                },
                "& .MuiButton-endIcon": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
                transition: "background-color 0.3s ease, box-shadow 0.2s ease",
                boxShadow: "none", // minimalismo: sin sombra por defecto
                "&:hover, &:active": {
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
                },
              }}
      >
        {isLoading ? "Buscando..." : "Buscar"}
      </Button>
    </div>
  );
};

export default FilterBar;
