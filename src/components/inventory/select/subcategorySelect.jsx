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
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const SubcategorySelect = ({
  subcategories,
  selectedSubcategory,
  handleSubcategoryChange,
}) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
  }, [subcategories, selectedSubcategory]);

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
