import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Skeleton,
  useTheme,
  Grow,
  Box,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { tokens } from "../../theme";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useSpring, animated } from "@react-spring/web";
import {
  DeleteOutline,
  KeyboardArrowDown,
  PublishedWithChangesOutlined,
  Search,
  SearchOff,
  VisibilityOutlined,
} from "@mui/icons-material";
import InventoryDetailModal from "./InventoryCards/InventoryDetailModal";
import InventoryReassignmentModal from "./InventoryCards/InventoryReassignmentModal";
import InventoryReturnModal from "./InventoryCards/InventoryReturnModal";
import ExportToExcelButton from "./InventoryCards/ExportToExcelButton";
import ExportPDFButton from "./InventoryCards/ExportPDFButton";

function InventoryCards({ inventoryCopy, loading, onSaveItem }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [localInventory, setLocalInventory] = useState(inventoryCopy || []);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  console.log(inventoryCopy);

  useEffect(() => {
    setLocalInventory(inventoryCopy || []);
  }, [inventoryCopy]);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleReassign = (item) => {
    setSelectedItem(item);
    setReassignModalOpen(true);
  };

  const handleReturn = (item) => {
    setSelectedItem(item);
    setReturnModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleCloseReassignModal = () => {
    setReassignModalOpen(false);
    setSelectedItem(null);
  };

  const handleCloseReturnModal = () => {
    setReturnModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveItem = (id_articulo, changes) => {
    console.log("Guardar cambios para artículo", id_articulo, changes);
    if (onSaveItem) {
      onSaveItem(id_articulo, changes);
    }
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                height: 150,
                borderRadius: 2,
              }}
            >
              <Skeleton
                variant="rectangular"
                width={150}
                height={150}
                sx={{ borderRadius: 2 }}
              />
              <CardContent
                sx={{
                  flex: "1 0 auto",
                  paddingLeft: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="30%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!localInventory || localInventory.length === 0) {
    return (
      <Box className="text-center py-10" sx={{ color: colors.redAccent[300] }}>
        <SearchOff sx={{ fontSize: 40 }} />
        <Typography variant="body1">No hay artículos para mostrar.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {localInventory.map((item, index) => {
          const imageUrl =
            item.fotos && item.fotos.length > 0
              ? item.fotos[0].url_imagen
              : "https://fotos-usuarios-sero.s3.amazonaws.com/user-images/PhotoNotAvailable.jpeg";

          return (
            <Grow in={true} timeout={400 + index * 100} key={item.id_articulo}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    borderRadius: 3,
                    border: `1px solid ${colors.borderContainer}`,
                    backgroundColor: colors.bgContainer,
                    overflow: "hidden",
                    transition:
                      "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                      transform: "translateY(-2px)",
                      backgroundColor: colors.bgContainerSecondary,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 140,
                      objectFit: "cover",
                      borderRadius: 2,
                      height: 200,
                      flexShrink: 0,
                    }}
                    image={imageUrl}
                    alt={item.nombre || "Imagen del artículo"}
                  />
                  <CardContent
                    sx={{
                      flex: "1 0 auto",
                      px: 2,
                      py: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      maxWidth: "calc(100% - 140px)",
                      gap: 1.2,
                    }}
                  >
                    <Box>
                      <Tooltip title={item.nombre_articulo}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          noWrap
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100%",
                          }}
                        >
                          {item.nombre_articulo || "Sin nombre"}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2">
                        <strong>Categoría:</strong> {item.categoria || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Subcategoría:</strong>{" "}
                        {item.subcategoria || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Usuario:</strong> {item.usuario || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Plaza:</strong> {item.plaza || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <strong>Estado de asignación:</strong>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor:
                              item.estado === "disponible"
                                ? colors.greenAccent[400]
                                : item.estado === "asignado"
                                ? colors.blueAccent[400]
                                : item.estado ===
                                  "asignado-sin responsiva digital"
                                ? colors.tealAccent[400]
                                : item.estado === "mantenimiento"
                                ? colors.orangeAccent[400]
                                : item.estado === "en_revision"
                                ? colors.yellowAccent[400]
                                : item.estado === "baja"
                                ? colors.redAccent[300]
                                : colors.grey[400],
                          }}
                        ></span>
                        {item.estado === "disponible"
                          ? "Disponible"
                          : item.estado === "asignado"
                          ? "Asignado"
                          : item.estado === "asignado-sin responsiva digital"
                          ? "Asignado (Sin Responsiva Digital)"
                          : item.estado === "mantenimiento"
                          ? "En Mantenimiento"
                          : item.estado === "en_revision"
                          ? "En Revisión"
                          : item.estado === "baja"
                          ? "Dado de Baja"
                          : item.estado}
                      </Typography>
                    </Box>

                    <Box
                      mt={1.5}
                      display="flex"
                      justifyContent="flex-end"
                      gap={1}
                    >
                      {/* Botón de Reasignación */}
                      <Tooltip title="Reasignacionar artículo">
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            textTransform: "none", // minimalista, sin mayúsculas forzadas
                            borderRadius: "10px", // bordes redondeados suaves
                            fontWeight: 500,
                            fontSize: "0.875rem", // tamaño legible, consistente
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px", // espacio limpio entre texto e icono
                            backgroundColor: colors.accentGreen[100], // color normal
                            color: colors.textAccent, // contraste legible
                            border: "none",
                            cursor: "pointer",

                            "&:hover": {
                              backgroundColor: colors.accentGreen[200], // hover sutil
                            },
                            "&:active": {
                              backgroundColor: colors.accentGreen[300], // feedback presionado
                            },
                            "& .MuiButton-endIcon": {
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            },
                            transition:
                              "background-color 0.3s ease, box-shadow 0.2s ease",
                            boxShadow: "none", // minimalismo: sin sombra por defecto
                            "&:hover, &:active": {
                              boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
                            },
                          }}
                          onClick={() => handleReassign(item)}
                        >
                          <PublishedWithChangesOutlined
                            sx={{ fontSize: 18, color: colors.textAccent }}
                          />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        title={
                          item.estado === "disponible"
                            ? "No se puede devolver un artículo disponible"
                            : "Devolución o baja del artículo"
                        }
                      >
                        <Button
                          variant="contained"
                          size="small"
                          disabled={item.estado === "disponible"}
                          sx={{
                            textTransform: "none", // minimalista, sin mayúsculas forzadas
                            borderRadius: "10px", // bordes redondeados suaves
                            fontWeight: 500,
                            fontSize: "0.875rem", // tamaño legible, consistente
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px", // espacio limpio entre texto e icono
                            backgroundColor: colors.accentGreen[100], // color normal
                            color: colors.textAccent, // contraste legible
                            border: "none",
                            cursor: "pointer",

                            "&:hover": {
                              backgroundColor: colors.accentGreen[200], // hover sutil
                            },
                            "&:active": {
                              backgroundColor: colors.accentGreen[300], // feedback presionado
                            },
                            "& .MuiButton-endIcon": {
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            },
                            transition:
                              "background-color 0.3s ease, box-shadow 0.2s ease",
                            boxShadow: "none", // minimalismo: sin sombra por defecto
                            "&:hover, &:active": {
                              boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
                            },
                          }}
                          onClick={() => handleReturn(item)}
                        >
                          <DeleteOutline
                            sx={{ fontSize: 18, color: colors.textAccent }}
                          />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Ver detalles del artículo">
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            textTransform: "none", // minimalista, sin mayúsculas forzadas
                            borderRadius: "10px", // bordes redondeados suaves
                            fontWeight: 500,
                            fontSize: "0.875rem", // tamaño legible, consistente
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px", // espacio limpio entre texto e icono
                            backgroundColor: colors.accentGreenSecondary[100], // color normal
                            color: colors.textAccentSecondary, // contraste legible
                            border: "none",
                            cursor: "pointer",

                            "&:hover": {
                              backgroundColor: colors.accentGreenSecondary[200], // hover sutil
                            },
                            "&:active": {
                              backgroundColor: colors.accentGreenSecondary[300], // feedback presionado
                            },
                            "& .MuiButton-endIcon": {
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            },
                            transition:
                              "background-color 0.3s ease, box-shadow 0.2s ease",
                            boxShadow: "none", // minimalismo: sin sombra por defecto
                            "&:hover, &:active": {
                              boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
                            },
                          }}
                          onClick={() => handleViewDetails(item)}
                        >
                          <VisibilityOutlined
                            sx={{
                              fontSize: 18,
                              color: colors.textAccentSecondary,
                            }}
                          />
                        </Button>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grow>
          );
        })}
      </Grid>
      {/* Modal de detalles */}
      <InventoryDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        onSave={handleSaveItem}
      />
      <InventoryReassignmentModal
        open={reassignModalOpen}
        onClose={handleCloseReassignModal}
        item={selectedItem}
      />

      <InventoryReturnModal
        open={returnModalOpen}
        onClose={handleCloseReturnModal}
        item={selectedItem}
      />
    </>
  );
}

function InventoryViewer({ inventory, loading, onSaveItem }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [itemsToShow, setItemsToShow] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);
  const prevCount = useRef(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [inventoryCopy, setInventoryCopy] = useState([]);

  // Copiar inventario cuando cambia inventory prop
  useEffect(() => {
    if (inventory && inventory.length > 0) {
      setInventoryCopy([...inventory]);
    } else {
      setInventoryCopy([]);
    }
  }, [inventory]);

  useEffect(() => {
    if (!searchTerm) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delay = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const filteredInventory = React.useMemo(() => {
    if (!searchTerm) return inventoryCopy;
    const lowerSearch = searchTerm.toLowerCase();

    return inventoryCopy.filter((item) => {
      return Object.values(item).some((value) => {
        if (!value) return false;
        return String(value).toLowerCase().includes(lowerSearch);
      });
    });
  }, [searchTerm, inventoryCopy]);

  const totalItems = filteredInventory.length;
  const visibleItems = filteredInventory.slice(0, itemsToShow);

  const { number } = useSpring({
    from: { number: prevCount.current },
    to: { number: totalItems },
    config: { tension: 120, friction: 20 },
    onRest: () => {
      prevCount.current = totalItems;
    },
  });

  useEffect(() => {
    setItemsToShow(20);
  }, [filteredInventory]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setItemsToShow((prev) => Math.min(prev + 20, totalItems));
      setLoadingMore(false);
    }, 500);
  };

  // Función para manejar las actualizaciones del componente hijo
  const handleSaveItem = (id_articulo, changes) => {
    console.log("📥 Recibiendo cambios del hijo:", { id_articulo, changes });

    setInventoryCopy((currentInventory) => {
      const updatedInventory = currentInventory.map((item) => {
        if (item.id_articulo !== id_articulo) return item;

        // Si viene un artículo completo actualizado (caso de información)
        if (changes.updatedItem) {
          console.log(
            "🔄 Actualizando artículo completo:",
            changes.updatedItem
          );
          return changes.updatedItem;
        }

        // Si son cambios específicos de fotos
        if (changes.type === "photos") {
          let updatedPhotos = item.fotos ? [...item.fotos] : [];

          // Eliminar fotos marcadas para borrar
          if (changes.deletedPhotoIds && changes.deletedPhotoIds.length > 0) {
            updatedPhotos = updatedPhotos.filter(
              (photo) =>
                !changes.deletedPhotoIds.includes(photo.id_foto_articulo)
            );
          }

          // Agregar nuevas fotos
          if (changes.newPhotos && changes.newPhotos.length > 0) {
            const newPhotosCleaned = changes.newPhotos.map(
              ({ file, imagen64, ...rest }) => rest
            );
            updatedPhotos = [...updatedPhotos, ...newPhotosCleaned];
          }

          console.log("🖼️ Fotos actualizadas:", updatedPhotos);
          return {
            ...item,
            fotos: updatedPhotos,
          };
        }

        // Si son cambios específicos de información (campos modificados)
        if (changes.type === "info" && changes.modifiedFields) {
          console.log(
            "📝 Actualizando campos modificados:",
            changes.modifiedFields
          );
          return {
            ...item,
            ...changes.modifiedFields,
          };
        }

        return item;
      });

      // Propagar hacia el padre el inventario completo actualizado
      if (onSaveItem) {
        console.log("⬆️ Propagando cambios al padre:", updatedInventory);
        onSaveItem(updatedInventory);
      }

      return updatedInventory;
    });
  };

  return (
    <Box>
      {/* Encabezado animado con fondo elegante */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={3}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: colors.bgContainer, // fondo sutil según modo
          border: `1px solid ${colors.borderContainer}`, // borde punteado suave
          transition:
            "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // sombra ligera
          },
        }}
        elevation={12}
      >
        <Tooltip
          title="Cantidad total de artículos encontrados"
          placement="top-start"
        >
          <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
        </Tooltip>

        {loading ? (
          <Skeleton variant="text" width={180} height={28} />
        ) : (
          <Typography
            variant="h6"
            color={colors.tealAccent}
            fontWeight="medium"
          >
            <Typography
              component="span"
              variant="h4"
              fontWeight="bold"
              color="action"
              sx={{ mr: 0.5 }}
            >
              <animated.span>{number.to((n) => Math.floor(n))}</animated.span>
            </Typography>
            artículos encontrados
          </Typography>
        )}
      </Box>

      {/* TextField para búsqueda global */}
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} md={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={40} />
          ) : (
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Buscar en todos los campos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              error={searchTerm !== "" && totalItems === 0}
              helperText={
                searchTerm !== "" && totalItems === 0
                  ? "No se encontraron resultados para tu búsqueda."
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isSearching ? (
                      <CircularProgress
                        size={16}
                        thickness={4}
                        sx={{
                          color: colors.grey[300],
                        }}
                      />
                    ) : (
                      <Search sx={{ color: colors.grey[300], fontSize: 20 }} />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  backgroundColor: colors.bgContainer, // mismo fondo que usamos en contenedores
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.borderContainer,
                  },

                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.accentGreen[100], // hover sutil
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.accentGreen[200],
                    boxShadow: "0 0 0 3px rgba(34,197,94,0.15)", // realce minimalista accesible
                  },

                  "& input::placeholder": {
                    color: colors.grey[400],
                    opacity: 1,
                  },
                },

                "& .MuiInputAdornment-root": {
                  marginRight: "8px",
                },

                "& .MuiFormHelperText-root": {
                  marginLeft: 1,
                  fontSize: "0.75rem",
                  color: theme.palette.error.main,
                },
              }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={2}>
          <ExportToExcelButton data={filteredInventory} loading={loading} />
        </Grid>
        <Grid item xs={12} md={2}>
          <ExportPDFButton data={filteredInventory} loading={loading} />
        </Grid>

        <Grid item xs={12} md={4} />
      </Grid>

      {/* Cards */}
      <InventoryCards
        inventoryCopy={visibleItems}
        loading={loading}
        onSaveItem={handleSaveItem}
      />

      {/* Indicador inferior */}
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ mt: 2, mb: 1, textAlign: "center" }}
      >
        Mostrando {visibleItems.length} de {totalItems} artículos
      </Typography>

      {/* Botón Mostrar más */}
      {!loading && itemsToShow < totalItems && (
        <Box display="flex" justifyContent="center" mb={3}>
          <Button
            variant="contained"
            color="info"
            onClick={handleLoadMore}
            disabled={loadingMore}
            endIcon={<KeyboardArrowDown />}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              borderColor: colors.grey[300],
              color: colors.grey[800],
              fontWeight: 500,
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: colors.grey[100],
                borderColor: colors.primary[300],
              },
            }}
          >
            {loadingMore ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Cargando...
              </>
            ) : (
              "Mostrar más"
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default InventoryViewer;
