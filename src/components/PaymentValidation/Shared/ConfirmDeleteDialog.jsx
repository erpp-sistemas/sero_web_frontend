// src/components/PaymentValidation/Shared/ConfirmDeleteDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tokens } from "../../../theme";

/**
 * ConfirmDeleteDialog
 * ------------------------------------------------------------------
 * Dialog de confirmación para eliminar una fotografía.
 *
 * Props:
 *  - open        (bool)      Controla la visibilidad
 *  - onClose     (fn)        Callback al cerrar (sin confirmar)
 *  - onConfirm   (fn)        Callback al confirmar la eliminación
 *  - foto        (obj|null)  Foto a eliminar. Se muestran:
 *                            { nombreFoto, tipo, cuenta }
 *  - loading     (bool)      Si true, deshabilita los botones y muestra
 *                            estado de "Eliminando..." (opcional)
 *  - colors      (obj)       Tokens de color (opcional)
 *  - COLOR_FONDO (str)       Color de fondo (opcional)
 *  - COLOR_BORDE (str)       Color de borde (opcional)
 */
const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  foto,
  loading = false,
  colors: colorsProp,
  COLOR_FONDO: COLOR_FONDO_PROPS,
  COLOR_BORDE: COLOR_BORDE_PROPS,
}) => {
  const theme = useTheme();
  const colors = colorsProp || tokens(theme.palette.mode);

  const COLOR_FONDO = COLOR_FONDO_PROPS || colors.bgContainer;
  const COLOR_BORDE = COLOR_BORDE_PROPS || colors.primary[500];

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: COLOR_FONDO,
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${COLOR_BORDE}`,
          p: 2.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: colors.redAccent[400], fontWeight: 600 }}
        >
          Confirmar eliminación
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ color: colors.grey[300] }}>
            ¿Estás seguro de que deseas eliminar esta foto?
          </Typography>
          {foto && (
            <Box
              sx={{
                p: 2,
                backgroundColor: colors.bgContainerSecondary,
                borderRadius: "8px",
                border: `1px solid ${COLOR_BORDE}`,
              }}
            >
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                <strong>Nombre:</strong> {foto.nombreFoto || "Sin nombre"}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                <strong>Tipo:</strong>{" "}
                {foto.tipo === "FACHADA" ? "Fachada predio" : "Evidencia"}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                <strong>Cuenta:</strong> {foto.cuenta}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${COLOR_BORDE}`,
          p: 2.5,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: colors.grey[400],
            textTransform: "none",
            "&:hover": {
              backgroundColor: colors.primary[400] + "20",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          startIcon={<Delete />}
          sx={{
            backgroundColor: colors.redAccent[600],
            color: colors.grey[100],
            textTransform: "none",
            "&:hover": {
              backgroundColor: colors.redAccent[700],
            },
            "&.Mui-disabled": {
              backgroundColor: colors.primary[600],
              color: colors.grey[500],
            },
          }}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
