import React, { useState, useEffect, memo } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Lottie from "lottie-react";
import loadingAnimation from "../../../../public/loading-8.json";
import { getAllInventoryCategory } from "../../../api/inventory";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

function CategorySelect({ selectedCategory, handleCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const res = await getAllInventoryCategory();
        setCategories(res);

        if (!selectedCategory && res.length > 0) {
          handleCategoryChange({
            target: { value: res[0].id_categoria_inventario },
          });
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel id="category-select-label">Selecciona Categoría</InputLabel>
        <Select
          labelId="category-select-label"
          id="select-category"
          value={selectedCategory || ""}
          label="Selecciona Categoría"
          onChange={handleCategoryChange}
          disabled={loading || categories.length === 0}
          IconComponent={(props) => (
            <KeyboardArrowDown {...props} sx={{ fontSize: 18 }} />
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
          {categories.length > 0 ? (
            categories.map((category) => (
              <MenuItem
                key={category.id_categoria_inventario}
                value={category.id_categoria_inventario}
              >
                {category.nombre_categoria}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value="">
              Sin categorías disponibles
            </MenuItem>
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
}

export default memo(CategorySelect);
