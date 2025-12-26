// src/components/PaymentValidation/modals/ModalTodasLasFotos.jsx

import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";

import CloseIcon from "@mui/icons-material/Close";
import PhotoIcon from "@mui/icons-material/Photo";

const ModalTodasLasFotos = ({ open, onClose, fotos }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ---------------------------------------------------------------------
  // Transformación de datos:
  // Cada registro ya trae: cuenta, tarea_gestionada, fecha_de_gestion, gestor, proceso
  // Y `fotos` viene como STRING → Lo convertimos a array JSON
  // ---------------------------------------------------------------------

  const rows = useMemo(() => {
    return fotos.map((item, index) => {
      let fotosArray = [];

      try {
        fotosArray = JSON.parse(item.fotos || "[]");
      } catch (e) {
        fotosArray = [];
      }

      return {
        id: index,
        cuenta: item.cuenta,
        tarea: item.tarea_gestionada,
        fecha: item.fecha_de_gestion,
        gestor: item.gestor,
        proceso: item.proceso,
        fotos: fotosArray, // Array con objetos que contienen urlImagen
      };
    });
  }, [fotos]);

  // -------------------------------
  // Columnas DataGrid estilo Notion
  // -------------------------------
  const columns = [
    {
      field: "cuenta",
      headerName: "Cuenta",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 500 }}>{params.row.cuenta}</Typography>
      ),
    },
    {
      field: "tarea",
      headerName: "Tarea",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "fecha",
      headerName: "Fecha gestión",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "gestor",
      headerName: "Gestor",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 500 }}>{params.row.gestor}</Typography>
      ),
    },
    {
      field: "proceso",
      headerName: "Proceso",
      flex: 1,
      minWidth: 140,
    },
    {
  field: "fotos",
  headerName: "Fotos",
  flex: 2,
  minWidth: 300,
  sortable: false,
  renderCell: (params) => {
    const array = params.row.fotos || [];

    if (array.length === 0)
      return (
        <Typography sx={{ fontSize: 13, opacity: 0.5 }}>
          Sin fotos
        </Typography>
      );

    return (
      <Box
        sx={{
          display: "flex",
          gap: 1.2,
          overflowX: "auto",
          py: 1,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            background: "#444",
            borderRadius: 4,
          },
        }}
      >
        {array.map((f, idx) => (
          <Box
            key={idx}
            component="img"
            src={f.urlImagen}
            alt="foto"
            sx={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: "10px",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",   // sombra minimalista
              transition: "0.25s ease",
              flexShrink: 0,

              "&:hover": {
                transform: "scale(1.06)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                filter: "brightness(1.1)",
              },
            }}
          />
        ))}
      </Box>
    );
  },
},

  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.bgContainer,
          backgroundImage: "none",
          borderRadius: "12px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhotoIcon sx={{ color: colors.blueAccent[400] }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Galería de Fotografías
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{
              color: colors.grey[400],
              "&:hover": {
                color: colors.grey[300],
                backgroundColor: `${colors.grey[700]}25`,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ color: colors.grey[400], mt: 1 }}>
          {fotos.length} registro{fotos.length !== 1 ? "s" : ""} con fotografías
        </Typography>
      </DialogTitle>

      {/* BODY TABLE */}
      <DialogContent sx={{ p: 0, flexGrow: 1 }}>
        {rows.length > 0 ? (
          <Box
            sx={{
              height: "100%",
              "& .MuiDataGrid-root": {
                border: "none",
                color: colors.grey[300],
                backgroundColor: colors.bgContainer,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${colors.borderContainer}`,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.bgContainer,
                borderBottom: `1px solid ${colors.borderContainer}`,
                fontWeight: 600,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: colors.hoverRow,
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `1px solid ${colors.borderContainer}`,
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={20}
              rowsPerPageOptions={[20]}
              disableSelectionOnClick
            />
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: colors.grey[500],
            }}
          >
            <PhotoIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">No hay fotografías para mostrar</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Ningún registro contiene imágenes actualmente.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalTodasLasFotos;
