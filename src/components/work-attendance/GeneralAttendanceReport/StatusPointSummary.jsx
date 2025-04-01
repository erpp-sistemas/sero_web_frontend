import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

const StatusPointSummary = ({ statusCountsEntry, statusCountsExit, handleFilter }) => {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: "10px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Resumen de Estatus
      </Typography>

      <Grid container spacing={2}>
        {/* Estatus Punto de Entrada */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Estatus Punto de Entrada
          </Typography>
          {Object.entries(statusCountsEntry).map(([status, count]) => (
            <Box
              key={status}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                padding: 1,
                borderRadius: "5px",
                
                marginBottom: 1,
              }}
            >
              <Typography variant="body1">{status}</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {count}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleFilter("estatus_punto_entrada", status)}
              >
                Filtrar
              </Button>
            </Box>
          ))}
        </Grid>

        {/* Estatus Punto de Salida */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Estatus Punto de Salida
          </Typography>
          {Object.entries(statusCountsExit).map(([status, count]) => (
            <Box
              key={status}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                padding: 1,
                borderRadius: "5px",
                
                marginBottom: 1,
              }}
            >
              <Typography variant="body1">{status}</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {count}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleFilter("estatus_punto_salida", status)}
              >
                Filtrar
              </Button>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatusPointSummary;