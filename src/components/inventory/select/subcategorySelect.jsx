import React, { useEffect } from "react";
import { MenuItem, TextField, Typography } from "@mui/material";

const SubcategorySelect = ({
  subcategories,
  selectedSubcategory,
  handleSubcategoryChange,
  loading,
}) => {
  useEffect(() => {
    if (
      !loading &&
      subcategories.length > 0 &&
      !selectedSubcategory
    ) {
      handleSubcategoryChange({
        target: {
          value: subcategories[0].id_subcategoria_inventario,
        },
      });
    }
  }, [loading, subcategories, selectedSubcategory]);

  return (
    <TextField
      fullWidth
      select
      label="Selecciona Subcategoría"
      value={selectedSubcategory || ""}
      onChange={handleSubcategoryChange}
      variant="outlined"
      disabled={loading}
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
    </TextField>
  );
};

export default SubcategorySelect;
