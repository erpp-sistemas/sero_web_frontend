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
  KeyboardArrowDown,
  OpenInNewOutlined,
  Search,
  SearchOff,
} from "@mui/icons-material";
import InventoryDetailModal from "./InventoryCards/InventoryDetailModal";
import ExportToExcelButton from "./InventoryCards/ExportToExcelButton";
import ExportPDFButton from "./InventoryCards/ExportPDFButton";

function InventoryCards({ inventoryCopy, loading, onSaveItem }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [localInventory, setLocalInventory] = useState(inventoryCopy || []);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLocalInventory(inventoryCopy || []);
  }, [inventoryCopy]);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
                  elevation={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    borderRadius: 3,
                    border: `1px solid ${colors.grey[200]}`,
                    backgroundColor: colors.grey[900],
                    overflow: "hidden",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px)",
                      backgroundColor: colors.grey[800],
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
                        <strong>Estatus:</strong>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: item.activo
                              ? colors.greenAccent[400]
                              : colors.redAccent[300],
                          }}
                        ></span>
                        {item.activo ? "Activo" : "Inactivo"}
                      </Typography>
                    </Box>

                    <Box mt={1.5} display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<OpenInNewOutlined />}
                        sx={{
                          textTransform: "none",
                          borderRadius: "10px",
                          borderColor: colors.grey[300],
                          backgroundColor: colors.grey[200],
                          color: colors.grey[800],
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          "&:hover": {
                            backgroundColor: colors.grey[400],
                            borderColor: colors.primary[300],
                          },
                        }}
                        onClick={() => handleViewDetails(item)}
                      >
                        Ver detalles
                      </Button>
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
    </>
  );
}

function InventoryViewer({ inventory, loading, onSaveItem  }) {
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

  // Función para actualizar inventoryCopy con cambios de fotos
  // const handleSaveItem = (id_articulo, changes) => {
  //   setInventoryCopy((currentInventory) => {
  //     return currentInventory.map((item) => {
  //       if (item.id_articulo !== id_articulo) return item;

  //       let updatedPhotos = item.fotos ? [...item.fotos] : [];

  //       if (changes.deletedPhotoIds && changes.deletedPhotoIds.length > 0) {
  //         updatedPhotos = updatedPhotos.filter(
  //           (photo) => !changes.deletedPhotoIds.includes(photo.id_foto_articulo)
  //         );
  //       }

  //       if (changes.newPhotos && changes.newPhotos.length > 0) {
  //         // Limpiamos properties para evitar objetos pesados
  //         const newPhotosCleaned = changes.newPhotos.map(
  //           ({ file, imagen64, ...rest }) => rest
  //         );
  //         updatedPhotos = [...updatedPhotos, ...newPhotosCleaned];
  //       }

  //       return {
  //         ...item,
  //         fotos: updatedPhotos,
  //       };
  //     });
  //   });    
  // };

  const handleSaveItem = (id_articulo, changes) => {
    setInventoryCopy((currentInventory) => {
      const updatedInventory = currentInventory.map((item) => {
        if (item.id_articulo !== id_articulo) return item;

        let updatedPhotos = item.fotos ? [...item.fotos] : [];

        if (changes.deletedPhotoIds && changes.deletedPhotoIds.length > 0) {
          updatedPhotos = updatedPhotos.filter(
            (photo) => !changes.deletedPhotoIds.includes(photo.id_foto_articulo)
          );
        }

        if (changes.newPhotos && changes.newPhotos.length > 0) {
          const newPhotosCleaned = changes.newPhotos.map(
            ({ file, imagen64, ...rest }) => rest
          );
          updatedPhotos = [...updatedPhotos, ...newPhotosCleaned];
        }

        return { ...item, fotos: updatedPhotos };
      });

      // Propagar hacia el padre el inventario completo actualizado
      if (onSaveItem) {
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
        mb={2}
        p={2}
        bgcolor={colors.accentGreen[100]}
        borderRadius={2}
        boxShadow={3}
        elevation={12}
      >
        <Tooltip
          title="Cantidad total de artículos encontrados"
          placement="top-start"
        >
          <Inventory2OutlinedIcon color="primary" />
        </Tooltip>

        {loading ? (
          <Skeleton variant="text" width={180} height={28} />
        ) : (
          <Typography
            variant="h6"
            color={colors.contentAccentGreen[100]}
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
                          color: colors.grey[100],
                        }}
                      />
                    ) : (
                      <Search sx={{ color: colors.grey[100], fontSize: 20 }} />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  backgroundColor: "transparent",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.grey[300],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary[300],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary[500],
                  },
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: 1,
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
