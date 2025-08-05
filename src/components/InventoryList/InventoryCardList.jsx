import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";

const ITEMS_PER_PAGE = 6;

const InventoryCardList = ({ data }) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (!data || data.length === 0) return <Typography>No hay resultados</Typography>;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const totalItems = data.length;
  const displayedItems = Math.min(visibleCount, totalItems);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1">
          Articulos encontrados {totalItems} 
        </Typography>
        
      </Box>

      <Grid container spacing={2}>
        {data.slice(0, visibleCount).map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ display: "flex", height: 200 }}>
              <CardMedia
                component="img"
                sx={{ width: 200 }}
                image={item.url_imagen || "/placeholder.png"}
                alt={item.nombre_articulo}
              />
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <CardContent>
                  <Typography variant="h6">{item.nombre_articulo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categoría: {item.categoria}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subcategoría: {item.subcategoria}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usuario: {item.usuario}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {visibleCount < totalItems && (
        <Box mt={3} textAlign="center">
          <Typography variant="body2" mb={1}>
            Mostrando {displayedItems} de {totalItems} artículos
          </Typography>
          <Button
            onClick={handleShowMore}
            variant="outlined"
            color="info"
          >
            Mostrar más
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default InventoryCardList;
