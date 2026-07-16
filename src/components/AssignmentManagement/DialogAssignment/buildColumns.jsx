import React from "react";

import { Box, Typography } from "@mui/material";

const buildColumns = ({ colors }) => [
  /*
  |--------------------------------------------------------------------------
  | Cuenta
  |--------------------------------------------------------------------------
  */

  {
    field: "cuenta",
    headerName: "Cuenta",
    flex: 1.2,
    minWidth: 150,

    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: colors.grey[100],
        }}
      >
        {params.value}
      </Typography>
    ),
  },

  /*
  |--------------------------------------------------------------------------
  | Tarea
  |--------------------------------------------------------------------------
  */

  {
    field: "tarea",
    headerName: "Tarea",
    flex: 1.8,
    minWidth: 220,

    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          color: colors.grey[200],
        }}
      >
        {params.value}
      </Typography>
    ),
  },

  /*
  |--------------------------------------------------------------------------
  | Fecha de asignación
  |--------------------------------------------------------------------------
  */

  {
    field: "fecha_asignacion",
    headerName: "Fecha asignación",
    flex: 1.1,
    minWidth: 160,

    renderCell: (params) => {
      const fecha = new Date(params.value);

      const fechaFormateada = fecha.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return (
        <Typography
          variant="body2"
          sx={{
            color: colors.grey[300],
          }}
        >
          {fechaFormateada}
        </Typography>
      );
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Días asignado
  |--------------------------------------------------------------------------
  */

  {
    field: "dias_asignado",
    headerName: "Días",
    type: "number",
    flex: 0.8,
    minWidth: 100,
    align: "center",
    headerAlign: "center",

    renderCell: (params) => {
      const dias = Number(params.value);

      let color = colors.accentGreen[100];

      if (dias >= 30) {
        color = colors.redAccent[400];
      } else if (dias >= 15) {
        color = colors.orangeAccent?.[400] || colors.grey[100];
      }

      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: color,
          }}
        >
          {dias} días
        </Typography>
      );
    },
  },
];

export default buildColumns;
