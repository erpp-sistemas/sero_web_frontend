import React, { useState, useEffect, memo } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getAllInventoryCategory } from "../../../api/inventory";
import Lottie from "lottie-react";
import loadingAnimation from "../../../../public/loading-8.json";

function CategorySelect({ selectedCategory, handleCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <TextField
        id="select-category"
        select
        label="Selecciona Categoría"
        variant="outlined"
        sx={{ width: "100%" }}
        value={selectedCategory || ""}
        onChange={handleCategoryChange}
        disabled={loading || categories.length === 0}
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
      </TextField>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
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
            style={{ width: 60, height: 60 }}
          />
        </Box>
      )}
    </Box>
  );
}

export default memo(CategorySelect);
