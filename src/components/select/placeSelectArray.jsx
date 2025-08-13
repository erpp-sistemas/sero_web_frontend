import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Lottie from "lottie-react";
import loadingAnimation from "../../../public/loading-8.json";

const PlaceSelectArray = ({
  selectedPlace,
  handlePlaceChange,
  setSelectedPlace,
}) => {
  const user = useSelector((state) => state.user);
  const placeServiceProcess = user.place_service_process || [];
  const [loading, setLoading] = useState(true);

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
        size="small"
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
            <KeyboardArrowDown {...props} sx={{ fontSize: 18 }} />
          )}
          sx={{
            backgroundColor: "transparent",
            borderRadius: "8px",
            fontSize: "0.875rem",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(128,128,128,0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0,120,212,0.6)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0,120,212,1)",
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
