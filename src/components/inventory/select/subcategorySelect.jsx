import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

const SubcategorySelect = ({
  subcategories,
  selectedSubcategory,
  handleSubcategoryChange,
  loading,
}) => {
  useEffect(() => {
    if (!loading && subcategories.length > 0 && !selectedSubcategory) {
      handleSubcategoryChange({
        target: {
          value: subcategories[0].id_subcategoria_inventario,
        },
      });
    }
  }, [loading, subcategories, selectedSubcategory]);

  return (
    <FormControl fullWidth size="small" variant="outlined" disabled={loading}>
      <InputLabel id="subcategory-select-label">Selecciona Subcategoría</InputLabel>
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
            <MenuItem key={sub.id_subcategoria_inventario} value={sub.id_subcategoria_inventario}>
              {sub.nombre_subcategoria}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default SubcategorySelect;
