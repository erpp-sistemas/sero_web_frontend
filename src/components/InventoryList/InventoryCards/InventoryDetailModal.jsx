import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
  ImageList,
  ImageListItem,
  Divider,
  Avatar,
  useTheme,
  Grow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import { tokens } from "../../../theme";

const InventoryDetailModal = ({ open, onClose, item }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (open) {
      setShowContent(true);
    } else {
      // Espera la duración del Grow antes de desmontar
      const timeout = setTimeout(() => setShowContent(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!item && !showContent) return null;

  const { usuario, imagen_usuario, fotos, ...rest } = item || {};

  const filteredEntries = Object.entries(rest || {}).filter(
    ([key, value]) =>
      !key.toLowerCase().includes("id") &&
      key !== "imagen_usuario" &&
      key !== "usuario" &&
      value !== null &&
      value !== undefined &&
      value !== ""
  );

  const formatCurrency = (value) => {
    if (typeof value !== "number") return value;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Grow in={open} timeout={300}>
        <Box
          sx={{
            bgcolor: colors.primary[400],
            color: colors.grey[100],
            width: "90%",
            maxWidth: 700,
            maxHeight: "90vh",
            overflowY: "auto",
            p: 3,
            borderRadius: 3,
            boxShadow: 24,
            mx: "auto",
            my: "5vh",
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 12, right: 12 }}
          >
            <CloseIcon sx={{ color: colors.grey[100] }} />
          </IconButton>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            {item?.nombre_articulo || "Detalles del artículo"}
          </Typography>

          {fotos?.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 2 }}>
    {fotos.map((foto, idx) => (
      <Grid item xs={6} sm={4} md={3} key={idx}>
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1", // Cuadrado
            backgroundColor: "#f6f6f6",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={foto.url_imagen}
            alt={`Foto ${idx + 1}`}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      </Grid>
    ))}
  </Grid>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                border: `1px dashed ${colors.grey[700]}`,
                borderRadius: 2,
                height: 150,
                mb: 3,
              }}
            >
              <NoPhotographyOutlinedIcon
                sx={{ fontSize: 40, color: colors.grey[500], mb: 1 }}
              />
              <Typography
                variant="body2"
                color={colors.grey[400]}
                fontWeight={400}
                textAlign="center"
              >
                No hay fotos disponibles
              </Typography>
            </Box>
          )}

          {usuario && (
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={imagen_usuario}
                alt={usuario}
                sx={{ width: 48, height: 48, mr: 2 }}
              />
              <Box>
                <Typography
                  variant="body2"
                  color={colors.grey[300]}
                  fontWeight={500}
                >
                  Usuario asignado:
                </Typography>
                <Typography variant="body1" fontWeight={400}>
                  {usuario}
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 2, bgcolor: colors.grey[700] }} />

          <Grid container spacing={2}>
            {filteredEntries.map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Typography
                  variant="body2"
                  color={colors.grey[300]}
                  fontWeight={500}
                >
                  {key.replace(/_/g, " ")}:
                </Typography>
                <Typography variant="body1" fontWeight={400}>
                  {key === "activo"
                    ? value
                      ? "Activo"
                      : "Inactivo"
                    : key === "precio_articulo"
                    ? formatCurrency(value)
                    : value || "N/A"}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grow>
    </Modal>
  );
};

export default InventoryDetailModal;
