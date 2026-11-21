// src/components/PaymentValidation/Shared/FotoAmpliadaDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Zoom,
  useTheme,
} from "@mui/material";
import {
  Close,
  ArrowBack,
  ArrowForward,
  Edit,
  Delete,
  Download as DownloadIcon,
  Verified,
  House as HouseIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import { esTipoFoto } from "./fotoRules";

/**
 * FotoAmpliadaDialog
 * ------------------------------------------------------------------
 * Visor modal ampliado de una fotografía, con navegación entre fotos
 * y acciones (editar, eliminar, descargar).
 *
 * Props:
 *  - open        (bool)      Controla la visibilidad
 *  - foto        (obj|null)  Foto a mostrar. Debe incluir al menos:
 *                            { urlImagen | url, tipo, cuenta, nombreFoto,
 *                              fechaCaptura | fecha, verificada }
 *  - onClose     (fn)        Callback al cerrar
 *  - onDownload  (fn)        Callback al descargar (recibe foto)
 *  - onNext      (fn)        Callback para ir a la siguiente foto
 *  - onPrev      (fn)        Callback para ir a la anterior
 *  - onEdit      (fn)        Callback para editar (recibe foto)
 *  - onDelete    (fn)        Callback para eliminar (recibe foto)
 *  - totalFotos  (num)       Total de fotos en la galería
 *  - index       (num)       Índice actual (0-based)
 */
const FotoAmpliadaDialog = ({
  open,
  foto,
  onClose,
  onDownload,
  onNext,
  onPrev,
  onEdit,
  onDelete,
  totalFotos,
  index,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!foto) return null;

  const esFachada = esTipoFoto(foto, "fachada");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "min(90vw, 900px)",
          maxHeight: "min(90vh, 700px)",
          margin: "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2.5,
          borderBottom: `1px solid ${colors.primary[700]}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              backgroundColor: esFachada
                ? colors.greenAccent[900]
                : colors.blueAccent[900],
              borderRadius: "8px",
              p: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {esFachada ? (
              <HouseIcon
                sx={{ color: colors.greenAccent[300], fontSize: 20 }}
              />
            ) : (
              <DescriptionIcon
                sx={{ color: colors.blueAccent[300], fontSize: 20 }}
              />
            )}
            <Typography
              variant="subtitle2"
              sx={{ color: colors.grey[100], fontWeight: 600 }}
            >
              {esFachada ? "Fachada" : "Evidencia"}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {foto.cuenta}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: colors.grey[400],
              display: "flex",
              alignItems: "center",
              mr: 1,
            }}
          >
            {index + 1} / {totalFotos}
          </Typography>
          <Tooltip title="Anterior">
            <span>
              <IconButton
                onClick={onPrev}
                disabled={index === 0}
                sx={{
                  color: colors.grey[100],
                  "&:disabled": { color: colors.grey[700] },
                }}
              >
                <ArrowBack />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Siguiente">
            <span>
              <IconButton
                onClick={onNext}
                disabled={index === totalFotos - 1}
                sx={{
                  color: colors.grey[100],
                  "&:disabled": { color: colors.grey[700] },
                }}
              >
                <ArrowForward />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Editar foto">
            <IconButton
              onClick={() => onEdit(foto)}
              sx={{ color: colors.grey[100] }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar foto">
            <IconButton
              onClick={() => onDelete(foto)}
              sx={{ color: colors.grey[100] }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar">
            <IconButton
              onClick={() => onDownload(foto)}
              sx={{ color: colors.grey[100] }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} sx={{ color: colors.grey[100] }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <img
            src={foto.urlImagen || foto.url}
            alt={foto.nombreFoto || foto.descripcion}
            style={{
              maxWidth: "100%",
              maxHeight: "calc(90vh - 180px)",
              borderRadius: "12px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              objectFit: "contain",
              backgroundColor: colors.primary[900],
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.75)",
              borderRadius: "24px",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              backdropFilter: "blur(8px)",
            }}
          >
            {foto.verificada && (
              <Tooltip title="Verificada">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    backgroundColor: colors.greenAccent[800],
                    borderRadius: "12px",
                    p: "4px 8px",
                  }}
                >
                  <Verified
                    sx={{ fontSize: 16, color: colors.greenAccent[300] }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: colors.grey[100], fontWeight: 500 }}
                  >
                    Verificada
                  </Typography>
                </Box>
              </Tooltip>
            )}
            <Typography variant="caption" sx={{ color: colors.grey[300] }}>
              {foto.nombreFoto || "Sin nombre"}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.grey[500] }}>
              {new Date(foto.fechaCaptura || foto.fecha).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FotoAmpliadaDialog;
