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
import AssignmentIcon from "@mui/icons-material/Assignment";
import { tokens } from "../../../theme";
import { AssignmentOutlined, InfoOutlined } from "@mui/icons-material";
import PlaceSelectArray from "../../../components/select/placeSelectArray.jsx";
import ActiveUsersSelect from "../../../components/inventory/select/activeUsersSelect";
import { useNavigate } from "react-router-dom";

function InventoryReassignmentModal({
  open,
  onClose,
  item,
  onConfirmReassignment,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [itemCopy, setItemCopy] = useState(null);
  const [filteredItem, setFilteredItem] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (open && item) {
      const copy = JSON.parse(JSON.stringify(item));
      setItemCopy(copy);

      // Filtrar el item inmediatamente para mostrarlo en los detalles
      const filtered = filterItemForReassignment(copy);
      setFilteredItem(filtered);

      // Incrementar resetKey para reiniciar los componentes de selección
      setResetKey((prevKey) => prevKey + 1);

      // Resetear las selecciones
      setSelectedPlace(null);
      setSelectedUser(null);

      setShowContent(true);
    } else {
      const timeout = setTimeout(() => {
        setShowContent(false);
        setItemCopy(null);
        setFilteredItem(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open, item]);

  const handleUserChange = (userData) => {
    setSelectedUser(userData);
  };

  const handlePlaceChange = useCallback((placeData) => {
    setSelectedPlace(placeData);
  }, []);

  // Función para filtrar el item eliminando campos no deseados
  const filterItemForReassignment = (item) => {
    if (!item) return null;

    // Crear una copia del item
    const filteredItem = { ...item };

    // Eliminar campos que contengan "id_" o "_id", excepto "id_articulo"
    Object.keys(filteredItem).forEach((key) => {
      if (
        (key.includes("id_") || key.includes("_id")) &&
        key !== "id_articulo"
      ) {
        delete filteredItem[key];
      }
    });

    // Eliminar campos específicos adicionales
    delete filteredItem.usuario;
    delete filteredItem.plaza;
    delete filteredItem.imagen_usuario;
    delete filteredItem.fotos; // Eliminamos fotos ya que es un array de objetos

    return filteredItem;
  };

  const generateReassignmentData = () => {
    if (!itemCopy || !selectedUser || !selectedPlace) return null;

    console.log(filteredItem);
    // Crear el objeto campos con los datos filtrados
    let campos = {};
    if (filteredItem) {
      campos = { ...filteredItem }; // Hacer una copia del objeto filteredItem
    }
    // if (filteredItem) {
    //   Object.entries(filteredItem).forEach(([key, value]) => {
    //     // Excluimos campos que no deben ir en "campos"
    //     if (
    //       key !== "id_articulo" &&
    //       key !== "folio" &&
    //       key !== "nombre_articulo"
    //     ) {
    //       campos[key] = value;
    //     }
    //   });
    // }

    // Extraer información de categoría y subcategoría del artículo original
    const categoria = itemCopy.id_categoria || null;
    const subcategoria = itemCopy.id_subcategoria || null;

    // Estructurar el objeto de plaza
    const plazaData = selectedPlace
      ? {
          id_plaza: selectedPlace.id_plaza,
          nombre_plaza: selectedPlace.nombre_plaza,
        }
      : null;

    // Estructurar el objeto de usuario
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

    // Obtener las fotos del artículo (si existen)
    const fotos =
      itemCopy.fotos && Array.isArray(itemCopy.fotos)
        ? itemCopy.fotos.map((foto) => ({
            id_foto_articulo: foto.id_foto_articulo,
            url_imagen: foto.url_imagen,
          }))
        : [];

    // Construir el objeto final
    const reassignmentData = {
      categoria,
      subcategoria,
      plaza: plazaData,
      usuarioAsignado,
      campos,
      fotos,
      id_articulo: itemCopy.id_articulo,
      folio: itemCopy.folio || null,
      nombre_articulo: itemCopy.nombre_articulo || null,
    };

    return reassignmentData;
  };

  const handleConfirmReassignment = () => {
    // if (!item) return;

    // const filteredItem = filterItemForReassignment(item);
    // console.log("Item filtrado para reasignación:", filteredItem);

    if (!itemCopy || !selectedUser || !selectedPlace) return;

    // Generar el objeto de reasignación
    const nuevoArticuloCompleto = generateReassignmentData();

    console.log("Datos de reasignación:", nuevoArticuloCompleto);

    // Redirigir a la página de generación de responsiva
    navigate("/responsive-generator", {
      state: {
        nuevoArticulo: nuevoArticuloCompleto, // ← Usar el objeto actualizado
        articuloId: itemCopy.id_articulo,
        tipo_responsiva: "reasignacion",
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

  const {
    usuario,
    imagen_usuario,
    fotos = [],
    id_articulo,
    plaza,
  } = itemCopy || {};

  // Crear entries del item filtrado para mostrar en los detalles
  // Excluimos valores que son objetos, arrays o funciones
  const filteredEntries = filteredItem
    ? Object.entries(filteredItem).filter(
        ([key, value]) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          typeof value !== "object" && // Excluir objetos
          !Array.isArray(value) && // Excluir arrays
          typeof value !== "function" // Excluir funciones
      )
    : [];

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
            <CloseIcon />
          </IconButton>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AssignmentOutlined color="info" />
            <Typography variant="h5" fontWeight={600}>
              Reasignación de Artículo
            </Typography>
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight={500}
            color="textSecondary"
            mb={3}
          >
            <InfoOutlined sx={{ color: colors.yellowAccent[300], mr: 1 }} />
            Revise la información del artículo antes de proceder con la
            reasignación
          </Typography>

          <Typography variant="h6" fontWeight={600} gutterBottom>
            {itemCopy?.nombre_articulo || "Artículo sin nombre"}
          </Typography>

          {/* Fotos del artículo (solo lectura) */}
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={500} mb={1}>
              Fotografías del artículo:
            </Typography>
            <Grid container spacing={2}>
              {fotos.length > 0 ? (
                fotos.map((foto, idx) => (
                  <Grid item xs={6} sm={4} md={3} key={idx}>
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "1",
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
                    <Typography
                      variant="body2"
                      color={colors.grey[500]}
                      textAlign="center"
                    >
                      No hay fotos disponibles
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>

          <Divider sx={{ mb: 3, bgcolor: colors.grey[300] }} />

          {/* Información actual de asignación */}
          <Box mb={3}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              mb={2}
              color="textSecondary"
            >
              Información actual de asignación:
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={imagen_usuario}
                    alt={usuario}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      fontWeight={500}
                    >
                      Usuario actual:
                    </Typography>
                    <Typography variant="body1" fontWeight={400}>
                      {usuario || "No asignado"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    fontWeight={500}
                  >
                    Plaza actual:
                  </Typography>
                  <Typography variant="body1" fontWeight={400}>
                    {plaza || "No asignada"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3, bgcolor: colors.grey[300] }} />

          {/* NUEVA SECCIÓN: Asignación futura */}
          <Box
            mb={3}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: colors.primary[700],
              border: `1px dashed ${colors.grey[300]}`,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={600}
              mb={2}
              color={colors.grey[100]}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AssignmentOutlined
                sx={{ fontSize: 18, color: colors.accentGreen[100] }}
              />
              NUEVA ASIGNACIÓN:
            </Typography>

            <Typography variant="body1" color="textSecondary" mb={2}>
              Seleccione el nuevo usuario y plaza para este artículo:
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ActiveUsersSelect
                  key={`user-${resetKey}`}
                  selectedUser={selectedUser}
                  handleUserChange={handleUserChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PlaceSelectArray
                  key={`place-${resetKey}`}
                  selectedPlace={selectedPlace}
                  handlePlaceChange={handlePlaceChange}
                  setSelectedPlace={setSelectedPlace}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3, bgcolor: colors.grey[300] }} />

          {/* Detalles del artículo FILTRADO (solo lectura) */}
          <Box mb={4}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Información del artículo (para reasignación):
            </Typography>

            {filteredEntries.length > 0 ? (
              <Grid container spacing={2}>
                {filteredEntries.map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      fontWeight={500}
                    >
                      {key.replace(/_/g, " ").toUpperCase()}:
                    </Typography>
                    <Typography variant="body1" fontWeight={400}>
                      {key === "activo"
                        ? value
                          ? "Activo"
                          : "Inactivo"
                        : key === "precio_articulo" || key.includes("precio")
                        ? formatCurrency(value)
                        : value || "N/A"}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No hay información disponible para mostrar.
              </Typography>
            )}
          </Box>

          <Divider sx={{ mb: 3, bgcolor: colors.grey[300] }} />

          {/* Mensaje de confirmación */}
          <Box mb={4}>
            <Typography
              variant="body1"
              fontWeight={500}
              color="textSecondary"
              mb={2}
            >
              ¿Está seguro que desea proceder con la reasignación de este
              artículo?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Esta acción permitirá cambiar la asignación actual del artículo a
              un nuevo usuario y/o ubicación.
            </Typography>
          </Box>

          {/* Acciones */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              onClick={onClose}
              variant="contained"
              color="inherit"
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 500,
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReassignment}
              variant="contained"
              color="info"
              startIcon={<AssignmentIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 500,
              }}
            >
              Confirmar Reasignación
            </Button>
          </Box>
        </Box>
      </Grow>
    </Modal>
  );
}

export default InventoryReassignmentModal;
