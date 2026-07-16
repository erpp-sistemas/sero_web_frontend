import React from "react";

import { Box, Typography, Avatar, Tooltip, IconButton } from "@mui/material";

import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

import Visibility from "@mui/icons-material/Visibility";

const buildColumns = ({ colors, onManagerSelected }) => [
  {
    field: "imagen_usuario",
    headerName: "",
    sortable: false,
    filterable: false,
    width: 80,

    renderCell: (params) => (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          src={params.value}
          alt={params.row.gestor}
          sx={{
            width: 40,
            height: 40,
            fontSize: 14,
            fontWeight: 600,
          }}
        />
      </Box>
    ),
  },

  {
    field: "gestor",
    headerName: "Gestor",
    flex: 2,
    minWidth: 220,

    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
        }}
      >
        {params.value}
      </Typography>
    ),
  },

  {
    field: "asignaciones_activas",
    headerName: "Asignaciones",
    flex: 1,
    minWidth: 140,
    type: "number",

    renderCell: (params) => (
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: colors.accentGreen[100],
          width: "100%",
          textAlign: "center",
        }}
      >
        {params.value.toLocaleString()}
      </Typography>
    ),
  },

  {
    field: "ultima_asignacion",
    headerName: "Última asignación",
    flex: 1.4,
    minWidth: 170,

    renderCell: (params) => {
      const fecha = new Date(params.value);

      return (
        <Typography variant="body2">
          {fecha.toLocaleDateString("es-MX")}
        </Typography>
      );
    },
  },

  {
    field: "dias_desde_ultima_asignacion",
    headerName: "Días",
    flex: 0.7,
    minWidth: 90,
    type: "number",

    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
        }}
      >
        {params.value}
      </Typography>
    ),
  },

  {
    field: "acciones",
    headerName: "",
    sortable: false,
    filterable: false,
    width: 180,

    renderCell: (params) => (
      <Tooltip title="Administrar asignaciones">
        <IconButton
          size="small"
          onClick={() => onManagerSelected(params.row)}
          sx={{
            color: colors.grey[400],

            "&:hover": {
              color: colors.accentGreen[100],
              backgroundColor: colors.accentGreen[100] + "20",
            },
          }}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
  },
];

export default buildColumns;
