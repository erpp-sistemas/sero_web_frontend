// src/components/Inventory/InventoryDisposalDialog.jsx
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
  Delete,
  Inventory,
  Warning,
  Description,
  PhotoCamera,
} from "@mui/icons-material";
import { tokens } from "../../../theme";

const InventoryDisposalDialog = ({ open, onClose, articulo, onDispose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);

  if (!articulo) return null;

  // ============================================
  // COLORES
  // ============================================
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainer;
  const COLOR_BORDE = colors.primary[500];

  // Verificar si ya está dado de baja
  const isAlreadyDisposed = articulo.activo === false;

  const handleDispose = () => {
    if (!motivo) return;
    setLoading(true);
    // Simular proceso
    setTimeout(() => {
      onDispose?.(articulo.id_articulo, { motivo, observaciones });
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
          <Avatar sx={{ bgcolor: colors.redAccent[400], width: 40, height: 40 }}>
            <Delete />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Dar de baja
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
        {isAlreadyDisposed ? (
          <Alert severity="error" sx={{ bgcolor: colors.redAccent[400] + "20" }}>
            Este artículo ya está dado de baja.
          </Alert>
        ) : (
          <>
            {/* Advertencia */}
            <Alert severity="warning" sx={{ mb: 3, bgcolor: colors.yellowAccent[400] + "20" }}>
              Esta acción es irreversible. El artículo pasará a estado "Dado de baja" y no podrá ser asignado nuevamente.
            </Alert>

            {/* Información del artículo */}
            <Paper sx={{ p: 2, bgcolor: colors.primary[900], borderRadius: "8px", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Inventory sx={{ color: colors.grey[400] }} />
                <Box>
                  <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                    Artículo a dar de baja
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
                    {articulo.nombre_articulo}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                    {articulo.marca} {articulo.modelo} • S/N: {articulo.numero_serie || "—"}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Motivo de baja */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: colors.grey[400] }}>Motivo de baja *</InputLabel>
              <Select
                value={motivo}
                label="Motivo de baja *"
                onChange={(e) => setMotivo(e.target.value)}
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="obsolescencia">Obsolescencia</MenuItem>
                <MenuItem value="daño_irreparable">Daño irreparable</MenuItem>
                <MenuItem value="extravío">Extravío / Robo</MenuItem>
                <MenuItem value="venta">Venta / Donación</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </Select>
            </FormControl>

            {/* Observaciones */}
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Observaciones"
              placeholder="Detalles adicionales sobre la baja..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Campo para foto (simulado) */}
            <Paper
              sx={{
                p: 2,
                border: `1px dashed ${COLOR_BORDE}`,
                borderRadius: "8px",
                textAlign: "center",
                bgcolor: colors.primary[900],
              }}
            >
              <PhotoCamera sx={{ fontSize: 32, color: colors.grey[500], mb: 1 }} />
              <Typography variant="caption" sx={{ color: colors.grey[400], display: "block" }}>
                Hacer clic para agregar foto de evidencia
              </Typography>
              <Typography variant="caption" sx={{ color: colors.grey[500], fontSize: "0.6rem" }}>
                (opcional)
              </Typography>
            </Paper>
          </>
        )}
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
        {!isAlreadyDisposed && (
          <Button
            variant="text"
            onClick={handleDispose}
            disabled={!motivo || loading}
            sx={{
              color: colors.redAccent[400],
              "&:hover": { bgcolor: colors.redAccent[400] + "20" },
            }}
          >
            {loading ? "Procesando..." : "Confirmar baja"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InventoryDisposalDialog;