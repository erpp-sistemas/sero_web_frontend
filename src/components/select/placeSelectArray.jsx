import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Lottie from "lottie-react";
import loadingAnimation from "../../../public/loading-8.json";
import { tokens } from "../../theme";

const PlaceSelectArray = ({
  selectedPlace,
  handlePlaceChange,
  setSelectedPlace,
}) => {
  const user = useSelector((state) => state.user);
  const placeServiceProcess = user.place_service_process || [];
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (placeServiceProcess.length > 0 && !selectedPlace) {
        const defaultPlace = {
          id_plaza: placeServiceProcess[0].id_plaza,
          nombre_plaza: placeServiceProcess[0].nombre_plaza,
        };
        setSelectedPlace(defaultPlace);
      }
      setLoading(false);
    }, 300); // delay para mostrar animación
    return () => clearTimeout(timer);
  }, [placeServiceProcess, selectedPlace, setSelectedPlace]);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedObj = placeServiceProcess.find(
      (p) => p.id_plaza === selectedId
    );
    if (selectedObj) {
      const placeData = {
        id_plaza: selectedObj.id_plaza,
        nombre_plaza: selectedObj.nombre_plaza,
      };
      setSelectedPlace(placeData);
      handlePlaceChange(placeData); // envía objeto
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <FormControl
        fullWidth
        
        variant="outlined"
        disabled={loading || placeServiceProcess.length === 0}
      >
        <InputLabel id="place-select-label">Selecciona Plaza</InputLabel>
        <Select
          labelId="place-select-label"
          id="place-select"
          value={selectedPlace?.id_plaza || ""}
          onChange={handleChange}
          label="Selecciona Plaza"
          IconComponent={(props) => (
            <KeyboardArrowDown
              {...props}
              sx={{ color: colors.grey[300], fontSize: 20 }}
            />
          )}
          sx={{
            borderRadius: "10px",
            fontSize: "0.875rem",
            backgroundColor: colors.bgContainer, // mismo fondo que usamos en contenedores
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.borderContainer,
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.accentGreen[100], // hover sutil
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.accentGreen[200],
              boxShadow: "0 0 0 3px rgba(34,197,94,0.15)", // realce minimalista accesible
            },

            "& input::placeholder": {
              color: colors.grey[400],
              opacity: 1,
            },
            "& .MuiInputAdornment-root": {
              marginRight: "8px",
            },

            "& .MuiFormHelperText-root": {
              marginLeft: 1,
              fontSize: "0.75rem",
              color: theme.palette.error.main,
            },
          }}
        >
          {placeServiceProcess.length === 0 ? (
            <MenuItem disabled>No hay plazas disponibles</MenuItem>
          ) : (
            placeServiceProcess.map((plaza) => (
              <MenuItem key={plaza.id_plaza} value={plaza.id_plaza}>
                {plaza.nombre_plaza}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            right: 0,
            display: "flex",
            alignItems: "center",
            transform: "translateY(-50%)",
            zIndex: 1,
            pointerEvents: "none",
            pr: 2,
          }}
        >
          <Typography variant="body2" sx={{ mr: 1, color: "gray" }}>
            Cargando...
          </Typography>
          <Lottie
            animationData={loadingAnimation}
            style={{ width: 40, height: 40 }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PlaceSelectArray;
