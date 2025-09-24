import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
  Avatar,
  Divider,
  Button,
  useTheme,
  Grow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { tokens } from "../../../theme";
import { AssignmentReturnedOutlined, InfoOutlined } from "@mui/icons-material";
import PlaceSelectArray from "../../../components/select/placeSelectArray.jsx";
import ActiveUsersSelect from "../../../components/inventory/select/activeUsersSelect";
import { useNavigate } from "react-router-dom";

function InventoryReturnModal({ open, onClose, item, onConfirmReturn }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [itemCopy, setItemCopy] = useState(null);
  const [filteredItem, setFilteredItem] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  console.log(item)

  useEffect(() => {
    if (open && item) {
      const copy = JSON.parse(JSON.stringify(item));
      setItemCopy(copy);

      const filtered = filterItemForReturn(copy);
      setFilteredItem(filtered);

      setResetKey((prevKey) => prevKey + 1);

      const currentUserData = {
        id_usuario: copy.id_usuario,
        nombre: copy.usuario,
        url_image: copy.imagen_usuario,
        email: copy.email_usuario || null,
        curp: copy.curp_usuario || null,
        area: copy.area_usuario || null,
        puesto: copy.puesto_usuario || null,
      };

      const currentPlaceData = {
        id_plaza: copy.id_plaza,
        nombre_plaza: copy.plaza || copy.nombre_plaza,
        nombre: copy.plaza || copy.nombre_plaza,
        descripcion: copy.descripcion_plaza || null,
      };

      setSelectedUser(currentUserData);
      setSelectedPlace(currentPlaceData);

      setShowContent(true);
    } else {
      const timeout = setTimeout(() => {
        setShowContent(false);
        setItemCopy(null);
        setFilteredItem(null);
        setSelectedPlace(null);
        setSelectedUser(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open, item]);

  const handleUserChange = () => {
    console.log("Intento de cambio de usuario bloqueado");
  };

  const handlePlaceChange = useCallback(() => {
    console.log("Intento de cambio de plaza bloqueado");
  }, []);

  const filterItemForReturn = (item) => {
    if (!item) return null;
    const filteredItem = { ...item };

    Object.keys(filteredItem).forEach((key) => {
      if ((key.includes("id_") || key.includes("_id")) && key !== "id_articulo") {
        delete filteredItem[key];
      }
    });

    delete filteredItem.usuario;
    delete filteredItem.plaza;
    delete filteredItem.imagen_usuario;
    delete filteredItem.fotos;

    return filteredItem;
  };

  const generateReturnData = () => {
    if (!itemCopy || !selectedUser || !selectedPlace) return null;

    let campos = filteredItem ? { ...filteredItem } : {};
    const categoria = itemCopy.id_categoria || null;
    const subcategoria = itemCopy.id_subcategoria || null;

    const plazaData = selectedPlace
      ? {
          id_plaza: selectedPlace.id_plaza,
          nombre_plaza: selectedPlace.nombre_plaza || selectedPlace.nombre,
        }
      : null;

    const usuarioAsignado = selectedUser
      ? {
          id_usuario: selectedUser.id_usuario,
          url_image: selectedUser.url_image || null,
          email: selectedUser.email || null,
          curp: selectedUser.curp || null,
          area: selectedUser.area || null,
          puesto: selectedUser.puesto || null,
          nombre: selectedUser.nombre || null,
        }
      : null;

    const fotos =
      itemCopy.fotos && Array.isArray(itemCopy.fotos)
        ? itemCopy.fotos.map((foto) => ({
            id_foto_articulo: foto.id_foto_articulo,
            url_imagen: foto.url_imagen,
          }))
        : [];

    return {
      categoria,
      subcategoria,
      plaza: plazaData,
      usuarioAsignado,
      campos,
      fotos,
      id_articulo: itemCopy.id_articulo,
      folio: itemCopy.folio || null,
      nombre_articulo: itemCopy.nombre_articulo || null,
      tipo_devolucion: "devolucion",
    };
  };

  const handleConfirmReturn = () => {
    if (!itemCopy || !selectedUser || !selectedPlace) {
      console.error("Faltan datos necesarios para devolución");
      return;
    }

    const articuloCompleto = generateReturnData();
    console.log("Datos de devolución:", articuloCompleto);

    navigate("/return-generator", {
      state: {
        nuevoArticulo: articuloCompleto,
        articuloId: itemCopy.id_articulo,
        tipo_responsiva: "devolucion",
      },
    });

    onClose();
  };

  const formatCurrency = (value) => {
    if (typeof value !== "number") return value;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  if (!itemCopy && !showContent) return null;

  const { usuario, imagen_usuario, fotos = [], plaza } = itemCopy || {};

  const filteredEntries = filteredItem
    ? Object.entries(filteredItem).filter(
        ([, value]) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          typeof value !== "object" &&
          !Array.isArray(value)
      )
    : [];

  return (
    <Modal open={open} onClose={onClose}>
      <Grow in={open} timeout={300}>
        <Box
          sx={{
            bgcolor: colors.bgContainer,
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
            <CloseIcon />
          </IconButton>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AssignmentReturnedOutlined color="info" />
            <Typography variant="h5" fontWeight={600}>
              Devolución de Artículo
            </Typography>
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight={500}
            color="textSecondary"
            mb={3}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <InfoOutlined sx={{ color: colors.yellowAccent[300] }} />
            Revise la información antes de proceder
          </Typography>

          {/* --- Artículo --- */}
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {itemCopy?.nombre_articulo || "Artículo sin nombre"}
          </Typography>

          {/* Fotos */}
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={500} mb={1}>
              Fotografías:
            </Typography>
            <Grid container spacing={2}>
              {fotos.length > 0 ? (
                fotos.map((foto, idx) => (
                  <Grid item xs={6} sm={4} md={3} key={idx}>
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "1",
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
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      border: `1px dashed ${colors.grey[400]}`,
                      borderRadius: 2,
                      height: 120,
                      p: 2,
                    }}
                  >
                    <NoPhotographyOutlinedIcon
                      sx={{ fontSize: 32, color: colors.grey[500], mb: 1 }}
                    />
                    <Typography variant="body2" color={colors.grey[500]}>
                      No hay fotos disponibles
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* --- Asignación --- */}
          <Box mb={3}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              mb={2}
              color="textSecondary"
            >
              Asignación actual:
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={imagen_usuario} alt={usuario} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="body2" color="textSecondary" fontWeight={500}>
                      Usuario:
                    </Typography>
                    <Typography variant="body1">
                      {usuario || "No asignado"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="textSecondary" fontWeight={500}>
                    Plaza:
                  </Typography>
                  <Typography variant="body1">
                    {plaza || "No asignada"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* --- Información para devolución --- */}
          <Box
            mb={3}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: colors.bgContainerSecondary,
              border: `1px solid ${colors.borderContainer}`,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={600}
              mb={2}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AssignmentReturnedOutlined sx={{ fontSize: 18, color: colors.accentGreen[100] }} />
              Información para devolución:
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ActiveUsersSelect
                  key={`user-${resetKey}`}
                  selectedUser={selectedUser}
                  handleUserChange={handleUserChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PlaceSelectArray
                  key={`place-${resetKey}`}
                  selectedPlace={selectedPlace}
                  handlePlaceChange={handlePlaceChange}
                  setSelectedPlace={setSelectedPlace}
                  disabled
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* --- Detalles del artículo --- */}
          <Box mb={4}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Detalles del artículo:
            </Typography>
            {filteredEntries.length > 0 ? (
              <Grid container spacing={2}>
                {filteredEntries.map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography variant="body2" color="textSecondary" fontWeight={500}>
                      {key.replace(/_/g, " ").toUpperCase()}:
                    </Typography>
                    <Typography variant="body1">
                      {key === "activo"
                        ? value ? "Activo" : "Inactivo"
                        : key.includes("precio")
                        ? formatCurrency(value)
                        : value || "N/A"}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No hay información disponible
              </Typography>
            )}
          </Box>

          {/* --- Confirmación --- */}
          <Box
            sx={{
              p: 2,
              position: "sticky",
              bottom: 0,
              borderRadius: 2,
              bgcolor: colors.bgContainerSecondary,
              border: `1.5px dashed ${colors.accentGreen[300]}`,
              boxShadow: `0 -2px 4px rgba(0,0,0,0.06), 0 -6px 12px rgba(0,0,0,0.10)`,
              backdropFilter: "blur(12px)",
            }}
          >
            <Typography variant="body1" fontWeight={500} color="textSecondary" mb={1}>
              ¿Está seguro que desea proceder con la devolución?
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Se registrará la devolución con la información mostrada.
            </Typography>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={onClose}
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  backgroundColor: colors.accentGreenSecondary[100],
                  color: colors.textAccentSecondary,
                  "&:hover": { backgroundColor: colors.accentGreenSecondary[200] },
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmReturn}
                variant="contained"
                endIcon={<AssignmentReturnIcon sx={{ fontSize: 18 }} />}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  backgroundColor: colors.accentGreen[100],
                  color: colors.textAccent,
                  "&:hover": { backgroundColor: colors.accentGreen[200] },
                }}
              >
                Confirmar Devolución
              </Button>
            </Box>
          </Box>
        </Box>
      </Grow>
    </Modal>
  );
}

export default InventoryReturnModal;
