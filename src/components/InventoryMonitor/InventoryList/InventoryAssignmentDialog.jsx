// src/components/Inventory/InventoryAssignmentDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  useTheme,
  Alert,
} from "@mui/material";
import {
  Close,
  Person,
  Inventory,
  Search,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { tokens } from "../../../theme";

const InventoryAssignmentDialog = ({ open, onClose, articulo, onAssign }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!articulo) return null;

  // ============================================
  // COLORES
  // ============================================
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainer;
  const COLOR_BORDE = colors.primary[500];

  // Determinar si el artículo está disponible para asignar
  const isAvailable = articulo.activo !== false && !articulo.id_usuario;

  // Mock de usuarios (esto vendría de una API real)
  const usuariosMock = [
    { id: 1, nombre: "Juan Pérez", area: "Ventas", plaza: "Cuautitlán" },
    { id: 2, nombre: "María García", area: "Administración", plaza: "Centro" },
    { id: 3, nombre: "Carlos López", area: "Sistemas", plaza: "Cuautitlán" },
    { id: 4, nombre: "Ana Martínez", area: "RH", plaza: "Centro" },
  ];

  const usuariosFiltrados = usuariosMock.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedUserId) return;
    setLoading(true);
    // Simular asignación
    setTimeout(() => {
      onAssign?.(articulo.id_articulo, selectedUserId);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: COLOR_FONDO,
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          bgcolor: COLOR_FONDO,
          color: COLOR_TEXTO,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: `1px solid ${COLOR_BORDE}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: colors.primary[500], width: 40, height: 40 }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Asignar Artículo
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              {articulo.nombre_articulo} • {articulo.folio}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: colors.grey[400] }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {!isAvailable && articulo.id_usuario && (
          <Alert severity="warning" sx={{ mb: 3, bgcolor: colors.yellowAccent[400] + "20" }}>
            Este artículo ya está asignado a {articulo.usuario}. Para reasignarlo, primero debe ser devuelto.
          </Alert>
        )}

        {!isAvailable && articulo.activo === false && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: colors.redAccent[400] + "20" }}>
            Este artículo está dado de baja y no puede ser asignado.
          </Alert>
        )}

        {/* Información del artículo */}
        <Paper sx={{ p: 2, bgcolor: colors.primary[900], borderRadius: "8px", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Inventory sx={{ color: colors.grey[400] }} />
            <Box>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                Estado actual
              </Typography>
              <Chip
                label={articulo.id_usuario ? "Asignado" : "Disponible"}
                size="small"
                sx={{
                  bgcolor: articulo.id_usuario ? colors.blueAccent[400] + "20" : colors.accentGreen[100] + "20",
                  color: articulo.id_usuario ? colors.blueAccent[400] : colors.accentGreen[100],
                  mt: 0.5,
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Búsqueda de usuarios */}
        <Typography variant="subtitle2" sx={{ color: colors.grey[300], mb: 1, fontWeight: 500 }}>
          Buscar usuario
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Nombre o área..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={!isAvailable}
          InputProps={{
            startAdornment: <Search sx={{ fontSize: 18, color: colors.grey[400], mr: 1 }} />,
          }}
          sx={{ mb: 2 }}
        />

        {/* Lista de usuarios */}
        <Box sx={{ maxHeight: 250, overflowY: "auto", pr: 1 }}>
          {usuariosFiltrados.map((usuario) => (
            <Paper
              key={usuario.id}
              sx={{
                p: 1.5,
                mb: 1,
                bgcolor: colors.primary[900],
                borderRadius: "8px",
                border: `1px solid ${selectedUserId === usuario.id ? colors.blueAccent[400] : "transparent"}`,
                cursor: isAvailable ? "pointer" : "not-allowed",
                opacity: isAvailable ? 1 : 0.5,
                transition: "all 0.2s ease",
                "&:hover": isAvailable ? {
                  borderColor: colors.blueAccent[400],
                  bgcolor: colors.primary[800],
                } : {},
              }}
              onClick={() => isAvailable && setSelectedUserId(usuario.id)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary[600] }}>
                  {usuario.nombre.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: COLOR_TEXTO }}>
                    {usuario.nombre}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                    {usuario.area} • {usuario.plaza}
                  </Typography>
                </Box>
                {selectedUserId === usuario.id && (
                  <CheckCircle sx={{ color: colors.blueAccent[400], fontSize: 20 }} />
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          bgcolor: COLOR_FONDO,
          p: 2,
          borderTop: `1px solid ${COLOR_BORDE}`,
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} sx={{ color: colors.grey[400] }}>
          Cancelar
        </Button>
        <Button
          variant="text"
          onClick={handleAssign}
          disabled={!selectedUserId || !isAvailable || loading}
          sx={{
            color: colors.blueAccent[400],
            "&:hover": { bgcolor: colors.blueAccent[400] + "20" },
          }}
        >
          {loading ? "Asignando..." : "Asignar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryAssignmentDialog;