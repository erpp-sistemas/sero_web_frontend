import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Lottie from "lottie-react";
import loadingAnimation from "../../../../public/loading-8.json";

const SubcategorySelect = ({
  subcategories,
  selectedSubcategory,
  handleSubcategoryChange,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!subcategories) return;

  setLoading(true);

  const timer = setTimeout(() => {
    if (subcategories.length > 0 && !selectedSubcategory) {
      handleSubcategoryChange({
        target: { value: subcategories[0].id_subcategoria_inventario },
      });
    }
    setLoading(false);
  }, 300); // 300ms de “loading simulado”

  return () => clearTimeout(timer);
}, [subcategories, selectedSubcategory, handleSubcategoryChange]);


  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <FormControl fullWidth size="small" variant="outlined" disabled={loading}>
        <InputLabel id="subcategory-select-label">
          Selecciona Subcategoría
        </InputLabel>
        <Select
          labelId="subcategory-select-label"
          value={selectedSubcategory || ""}
          label="Selecciona Subcategoría"
          onChange={handleSubcategoryChange}
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
          {loading ? (
            <MenuItem disabled>
              <Typography variant="body2" color="textSecondary">
                Cargando...
              </Typography>
            </MenuItem>
          ) : subcategories.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="textSecondary">
                Sin subcategorías disponibles
              </Typography>
            </MenuItem>
          ) : (
            subcategories.map((sub) => (
              <MenuItem
                key={sub.id_subcategoria_inventario}
                value={sub.id_subcategoria_inventario}
              >
                {sub.nombre_subcategoria}
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

export default SubcategorySelect;
