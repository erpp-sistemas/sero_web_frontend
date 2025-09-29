import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

function InventoryReturnModal({
  open,
  onClose,
  item,
  onConfirmReturn,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [itemCopy, setItemCopy] = useState(null);
  const [filteredItem, setFilteredItem] = useState(null);

  console.log(item);

  useEffect(() => {
  if (open && item) {
    const copy = JSON.parse(JSON.stringify(item));

    // --- Ajuste: convertir 'datos_usuario_asignado' de string a array ---
    if (typeof copy.datos_usuario_asignado === "string") {
      try {
        copy.datos_usuario_asignado = JSON.parse(copy.datos_usuario_asignado);
      } catch (error) {
        console.error("Error parseando datos_usuario_asignado:", error);
        copy.datos_usuario_asignado = [];
      }
    }

    // --- Reformatear subcampos que vienen como string JSON ---
    copy.datos_usuario_asignado = copy.datos_usuario_asignado.map((u) => {
      const reformatted = { ...u };

      // area_usuario_asignado
      if (typeof reformatted.area_usuario_asignado === "string") {
        try {
          const area = JSON.parse(reformatted.area_usuario_asignado);
          reformatted.area_usuario_asignado = {
            id_area: area.id_area || null,
            nombre: area.nombre || "",
          };
        } catch {
          reformatted.area_usuario_asignado = { id_area: null, nombre_area: "" };
        }
      }

      // puesto_usuario_asignado
      if (typeof reformatted.puesto_usuario_asignado === "string") {
        try {
          const puesto = JSON.parse(reformatted.puesto_usuario_asignado);
          reformatted.puesto_usuario_asignado = {
            id_puesto: puesto.id_puesto || null,
            nombre: puesto.nombre || "",
          };
        } catch {
          reformatted.puesto_usuario_asignado = { id_puesto: null, nombre_puesto: "" };
        }
      }

      // plaza_usuario_asignado (opcional si quieres mantenerla como objeto)
      if (typeof reformatted.plaza_usuario_asignado === "string") {
        try {
          reformatted.plaza_usuario_asignado = JSON.parse(reformatted.plaza_usuario_asignado);
        } catch {
          reformatted.plaza_usuario_asignado = null;
        }
      }

      return reformatted;
    });

    setItemCopy(copy);
    console.log(copy)

    // Filtrar el item inmediatamente para mostrarlo en los detalles
    const filtered = filterItemForReturn(copy);
    setFilteredItem(filtered);

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



  // Función para parsear datos_usuario_asignado
  const parseDatosUsuario = (datosUsuario) => {
    if (!datosUsuario) return {};
    
    try {
      // Si es un string, intentar parsearlo como JSON
      if (typeof datosUsuario === 'string') {
        const parsed = JSON.parse(datosUsuario);
        // Si es un array, tomar el primer elemento
        return Array.isArray(parsed) ? parsed[0] || {} : parsed;
      }
      // Si es un array, tomar el primer elemento
      if (Array.isArray(datosUsuario)) {
        return datosUsuario[0] || {};
      }
      // Si ya es un objeto, devolverlo directamente
      return datosUsuario;
    } catch (error) {
      console.error('Error al parsear datos_usuario_asignado:', error);
      return {};
    }
  };

  // Función para filtrar el item eliminando campos no deseados
  const filterItemForReturn = (item) => {
    if (!item) return null;

    // Crear una copia del item
    const filteredItem = { ...item };

    // Eliminar campos que contengan "id_" o "_id", excepto "id_articulo"
    Object.keys(filteredItem).forEach((key) => {
      if (
        (key.includes("id_") || key.includes("_id")) || 
        key === "datos_usuario_asignado" &&
        key !== "id_articulo"
      ) {
        delete filteredItem[key];
      }
    });

    // Eliminar campos específicos adicionales
    delete filteredItem.usuario;
    delete filteredItem.plaza;
    delete filteredItem.imagen_usuario;
    delete filteredItem.fotos;

    return filteredItem;
  };

  const generateReturnData = () => {
    if (!itemCopy) return null;

    // Crear el objeto campos con los datos filtrados
    let campos = {};
    if (filteredItem) {
      campos = { ...filteredItem };
    }

    // Extraer información de categoría y subcategoría del artículo original
    const categoria = itemCopy.id_categoria || null;
    const subcategoria = itemCopy.id_subcategoria || null;

    // Obtener y parsear datos del usuario asignado
    const datosUsuario = parseDatosUsuario(itemCopy.datos_usuario_asignado);
    console.log("Datos usuario parseados:", datosUsuario);

    // Estructurar el objeto de plaza usando los datos del usuario asignado
    const plazaData = itemCopy.id_usuario ? {
      id_plaza: datosUsuario.plaza_usuario_asignado?.id_plaza,
      nombre_plaza: datosUsuario.plaza_usuario_asignado?.nombre,
    } : null;

    // Estructurar el objeto de usuario usando los datos del usuario asignado
    const usuarioAsignado = datosUsuario.id_usuario ? {
      id_usuario: datosUsuario.id_usuario || null,
      url_image: datosUsuario.imagen_usuario || null,
      email: datosUsuario.email_usuario_asignado || null,
      curp: datosUsuario.curp_usuario_asignado || null,
      area: datosUsuario.area_usuario_asignado || null,
      puesto: datosUsuario.puesto_usuario_asignado || null,
      nombre: datosUsuario.usuario || null,
    } : null;

    console.log(usuarioAsignado)

    // Obtener las fotos del artículo (si existen)
    const fotos =
      itemCopy.fotos && Array.isArray(itemCopy.fotos)
        ? itemCopy.fotos.map((foto) => ({
            id_foto_articulo: foto.id_foto_articulo,
            url_imagen: foto.url_imagen,
          }))
        : [];

    // Construir el objeto final
    const returnData = {
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

    return returnData;
  };

  const handleConfirmReturn = () => {
    if (!itemCopy) return;

    // Generar el objeto de devolución
    const articuloCompleto = generateReturnData();

    console.log("Datos de devolución:", articuloCompleto);

    // Redirigir a la página de generación de responsiva
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

  const {
    usuario,
    imagen_usuario,
    fotos = [],
    plaza,
    datos_usuario_asignado,
  } = itemCopy || {};

  // Parsear los datos del usuario asignado para la UI
  const datosUsuarioParsed = parseDatosUsuario(datos_usuario_asignado);
  console.log("Datos usuario para UI:", datosUsuarioParsed);

  // Crear entries del item filtrado para mostrar en los detalles
  const filteredEntries = filteredItem
    ? Object.entries(filteredItem).filter(
        ([key, value]) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          typeof value !== "object" &&
          !Array.isArray(value) &&
          typeof value !== "function"
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
          >
            <InfoOutlined sx={{ color: colors.yellowAccent[300], mr: 1 }} />
            Revise la información del artículo antes de proceder con la devolución
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
                      USUARIO ACTUAL:
                    </Typography>
                    <Typography variant="body1" fontWeight={400}>
                      {itemCopy?.datos_usuario_asignado?.[0]?.usuario || "No disponible"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {itemCopy.datos_usuario_asignado?.[0]?.area_usuario_asignado?.nombre || ""}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {itemCopy.datos_usuario_asignado?.[0]?.puesto_usuario_asignado?.nombre || ""}
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
                    PLAZA ACTUAL:
                  </Typography>
                  <Typography variant="body1" fontWeight={400}>
                    {itemCopy.datos_usuario_asignado?.[0]?.plaza_usuario_asignado?.nombre || ""}
                  </Typography>  
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3, bgcolor: colors.grey[300] }} />

          {/* Detalles del artículo FILTRADO (solo lectura) */}
          <Box mb={4}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Información del artículo (para devolución):
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

          {/* Mensaje de confirmación */}
          <Box
            sx={{
              p: 2,
              position: "sticky",
              bottom: 0,
              borderRadius: 2,
              bgcolor: colors.bgContainerSecondary,
              border: `1.5px dashed ${colors.accentGreen[300]}`,
              boxShadow: `
                0 -2px 4px rgba(0,0,0,0.06),
                0 -6px 12px rgba(0,0,0,0.10)
              `,
              backdropFilter: "blur(12px)",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: `
                0 -4px 8px rgba(0,0,0,0.08),
                0 -8px 16px rgba(0,0,0,0.12)
              `,
              },
              zIndex: 10,
            }}
          >
            <Box mb={4}>
              <Typography
                variant="body1"
                fontWeight={500}
                color="textSecondary"
                mb={2}
              >
                ¿Está seguro que desea proceder con la devolución de este artículo?
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Esta acción registrará la devolución del artículo con la información del usuario asignado mostrada.
              </Typography>
            </Box>

            {/* Acciones */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={onClose}
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: colors.accentGreenSecondary[100],
                  color: colors.textAccentSecondary,
                  border: "none",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: colors.accentGreenSecondary[200],
                  },
                  "&:active": {
                    backgroundColor: colors.accentGreenSecondary[300],
                  },
                  transition: "background-color 0.3s ease, box-shadow 0.2s ease",
                  boxShadow: "none",
                  "&:hover, &:active": {
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  },
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmReturn}
                variant="contained"
                endIcon={
                  <AssignmentReturnIcon
                    sx={{ fontSize: 18, color: colors.textAccent }}
                  />
                }
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: colors.accentGreen[100],
                  color: colors.textAccent,
                  border: "none",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: colors.accentGreen[200],
                  },
                  "&:active": {
                    backgroundColor: colors.accentGreen[300],
                  },
                  transition: "background-color 0.3s ease, box-shadow 0.2s ease",
                  boxShadow: "none",
                  "&:hover, &:active": {
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  },
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