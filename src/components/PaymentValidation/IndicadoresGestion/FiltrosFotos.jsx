// src/components/PaymentValidation/IndicadoresGestion/FiltrosFotos.jsx
import React from "react";
import { Box, Chip, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

/**
 * FiltrosFotos
 * ------------------------------------------------------------------
 * Chips de filtro para el GestionFotosDialog.
 * Diseño idéntico a los chips de "Distribución por tipo de gestión"
 * del GestorDetallesDialog.
 *
 * Muestra Todas y cuatro categorías excluyentes, incluso con conteo cero.
 *
 * Props:
 *  - filtroActivo   (str)  Filtro seleccionado actualmente
 *  - onChange       (fn)   Callback al cambiar de filtro. Recibe el nuevo filtro.
 *  - counts         (obj)  Conteos por filtro
 *  - COLOR_EFICIENTE (str) Color para estados positivos
 *  - COLOR_REGULAR   (str) Color para estados regulares
 *  - COLOR_ATENCION  (str) Color para estados de atención (rojo)
 */
const FiltrosFotos = ({
  filtroActivo,
  onChange,
  counts = {},
  COLOR_EFICIENTE,
  COLOR_REGULAR,
  COLOR_ATENCION,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_TODOS_ACTIVE = colors.blueAccent[600];
  const COLOR_TODOS_INACTIVE = colors.primary[400];

  // ----------------------------------------------------------------
  // Definición de filtros (con conteo)
  // ----------------------------------------------------------------
  const filtros = [
    {
      key: "todas",
      label: "Todas",
      count: counts.todas ?? 0,
      color:
        filtroActivo === "todas" ? COLOR_TODOS_ACTIVE : COLOR_TODOS_INACTIVE,
    },
    {
      key: "sin_fotos",
      label: "Sin fotografías",
      count: counts.sin_fotos ?? 0,
      color: COLOR_ATENCION,
    },
    {
      key: "solo_fachada",
      label: "Solo fachada",
      count: counts.solo_fachada ?? 0,
      color: COLOR_REGULAR,
    },
    {
      key: "solo_evidencia",
      label: "Solo evidencia",
      count: counts.solo_evidencia ?? 0,
      color: COLOR_REGULAR,
    },
    {
      key: "con_ambas",
      label: "Con ambas",
      count: counts.con_ambas ?? 0,
      color: COLOR_EFICIENTE,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {filtros.map((filtro) => {
        const estaActivo = filtroActivo === filtro.key;

        return (
          <Chip
            key={filtro.key}
            label={`${filtro.label} (${filtro.count})`}
            onClick={() => onChange(filtro.key)}
            aria-pressed={estaActivo}
            sx={{
              backgroundColor: estaActivo
                ? filtro.color + "30"
                : filtro.color + "10",
              color: estaActivo ? filtro.color : COLOR_TEXTO,
              border: `1px solid ${estaActivo ? filtro.color : "transparent"}`,
              "&:hover": {
                backgroundColor: filtro.color + "20",
                transform: "translateY(-1px)",
              },
              fontSize: "0.75rem",
              height: 28,
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
          />
        );
      })}
    </Box>
  );
};

export default FiltrosFotos;
