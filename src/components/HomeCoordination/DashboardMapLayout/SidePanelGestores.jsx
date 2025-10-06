// SidePanelGestores.jsx
import React from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Button,
} from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material/styles";

const SidePanelGestores = ({ data, selectedGestor, onSelectGestor }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 🔹 Agrupar la última gestión de cada gestor
  const gestores = React.useMemo(() => {
    const grouped = {};
    data.forEach((item) => {
      if (!item.latitude || !item.longitude) return;
      const key = item.person_who_capture;
      const date = new Date(item.date_capture);
      if (!grouped[key] || date > new Date(grouped[key].date_capture)) {
        grouped[key] = { ...item, count: 0 };
      }
    });

    // 🔹 Contar total de gestiones por gestor
    data.forEach((item) => {
      const key = item.person_who_capture;
      if (grouped[key]) grouped[key].count += 1;
    });

    return Object.values(grouped);
  }, [data]);

  // 🔹 Contador de gestores visibles (solo en modo "última gestión")
  const visibleCount = !selectedGestor ? gestores.length : null;

  return (
    <Box
      sx={{
        width: "25%",
        height: "700px",
        borderRadius: "12px",
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: colors.bgContainer,
        border: `1px solid ${colors.borderContainer}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 🔹 Header con título, indicador de modo y contador */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${colors.borderContainer}`,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: 15, fontWeight: 600, color: colors.grey[100] }}
        >
          Gestores Activos
        </Typography>

        {/* 🔹 Indicador de modo */}
        <Typography sx={{ fontSize: 12, color: colors.grey[400] }}>
          {selectedGestor
            ? `Mostrando todas las gestiones de ${selectedGestor}`
            : "Mostrando la última gestión de cada gestor"}
        </Typography>

        {/* 🔹 Contador de gestores visibles */}
        {!selectedGestor && (
          <Typography sx={{ fontSize: 12, color: colors.grey[400] }}>
            {`Gestores en mapa: ${visibleCount}`}
          </Typography>
        )}

        {/* 🔹 Botón de limpiar selección */}
        {selectedGestor && (
          <Button
            size="small"
            variant="contained"
            onClick={() => onSelectGestor(null)}
            sx={{ fontSize: 12, textTransform: "none", mt: 1 }}
          >
            Volver a todas las últimas gestiones
          </Button>
        )}
      </Box>

      {/* 🔹 Listado de gestores */}
      <List sx={{ flex: 1, p: 1 }}>
        {gestores.map((gestor) => {
          const selected = selectedGestor === gestor.person_who_capture;
          const borderColor = gestor.property_status
            ?.toLowerCase()
            .includes("no localizado")
            ? colors.redAccent[500]
            : colors.greenAccent[400];

          return (
            <ListItemButton
              key={gestor.person_who_capture}
              selected={selected}
              onClick={() =>
                onSelectGestor(selected ? null : gestor.person_who_capture)
              }
              sx={{
                mb: 1,
                borderRadius: 2,
                transition: "all 0.3s ease",
                backgroundColor: selected
                  ? theme.palette.mode === "dark"
                    ? colors.primary[800]
                    : colors.primary[400]
                  : "transparent",
                boxShadow: selected
                  ? theme.palette.mode === "dark"
                    ? "0 0 0 2px rgba(255,255,255,0.3)"
                    : "0 0 0 2px rgba(0,0,0,0.2)"
                  : "none",
                "&:hover": {
                  backgroundColor: selected
                    ? theme.palette.mode === "dark"
                      ? colors.primary[700]
                      : colors.primary[500]
                    : theme.palette.mode === "dark"
                    ? colors.primary[900]
                    : colors.primary[300],
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={gestor.photo_person_who_capture}
                  alt={gestor.person_who_capture}
                  sx={{
                    border: `2px solid ${borderColor}`,
                    width: 40,
                    height: 40,
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.grey[100],
                    }}
                    noWrap
                  >
                    {gestor.person_who_capture}
                  </Typography>
                }
                secondary={
                  <Typography
                    sx={{ fontSize: 11, color: colors.grey[300] }}
                    noWrap
                  >
                    {gestor.count} gestiones
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default SidePanelGestores;
