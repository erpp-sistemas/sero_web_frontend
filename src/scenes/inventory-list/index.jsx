import React, { useEffect, useState } from "react";
import {
  Chip,
  Button,
  Drawer,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  InputAdornment,
  FormHelperText,
  Paper,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { getAllInventory } from "../../api/inventory";
import InventoryExportExcel from "../../components/InventoryList/InventoryExportExcel";
import InventoryExportPDF from "../../components/InventoryList/InventoryExportPDF";
import { tokens } from "../../theme";
import { Search } from "@mui/icons-material";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [allInventory, setAllInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeSubcategory, setActiveSubcategory] = useState("Todos");
  const [activeActivo, setActiveActivo] = useState("Todos");
  const [activeUsuario, setActiveUsuario] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceOrder, setPriceOrder] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Cargar inventario y categorías únicas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllInventory();
        const processedInventory = response.map((item) => ({
          ...item,
          fotos:
            typeof item.fotos === "string"
              ? item.fotos.split(",").map((url) => ({ url_imagen: url.trim() }))
              : Array.isArray(item.fotos)
              ? item.fotos
              : [],
        }));

        setAllInventory(processedInventory);

        // Categorías únicas
        const uniqueCategories = [
          ...new Set(processedInventory.map((item) => item.categoria)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error al obtener inventario:", error);
      }
    };

    fetchData();
  }, []);

  // --- NUEVO: Cálculo dinámico de opciones y contadores de filtros hijos ---

  // 1. Filtrado parcial para cada filtro hijo
  const filteredForSubcategory = allInventory.filter(
    (item) =>
      (activeCategory === "Todos" || item.categoria === activeCategory) &&
      (activeActivo === "Todos" ||
        (activeActivo === "Activo"
          ? item.activo === true || item.activo === 1
          : item.activo === false || item.activo === 0)) &&
      (activeUsuario === "Todos" ||
        (item.usuario || "Sin usuario") === activeUsuario)
  );
  const filteredForActivo = allInventory.filter(
    (item) =>
      (activeCategory === "Todos" || item.categoria === activeCategory) &&
      (activeSubcategory === "Todos" ||
        item.subcategoria === activeSubcategory) &&
      (activeUsuario === "Todos" ||
        (item.usuario || "Sin usuario") === activeUsuario)
  );
  const filteredForUsuario = allInventory.filter(
    (item) =>
      (activeCategory === "Todos" || item.categoria === activeCategory) &&
      (activeSubcategory === "Todos" ||
        item.subcategoria === activeSubcategory) &&
      (activeActivo === "Todos" ||
        (activeActivo === "Activo"
          ? item.activo === true || item.activo === 1
          : item.activo === false || item.activo === 0))
  );

  // 2. Opciones únicas y contadores para cada filtro hijo
  const subcategories = [
    ...new Set(filteredForSubcategory.map((item) => item.subcategoria)),
  ];
  const subcategoryCounts = filteredForSubcategory.reduce((acc, item) => {
    acc[item.subcategoria] = (acc[item.subcategoria] || 0) + 1;
    return acc;
  }, {});

  const activoCounts = { Activo: 0, Baja: 0 };
  filteredForActivo.forEach((item) => {
    if (item.activo === true || item.activo === 1) activoCounts.Activo++;
    else activoCounts.Baja++;
  });

  const usuarios = [
    ...new Set(filteredForUsuario.map((item) => item.usuario || "Sin usuario")),
  ];
  const usuarioCounts = {};
  filteredForUsuario.forEach((item) => {
    const usuario = item.usuario || "Sin usuario";
    usuarioCounts[usuario] = (usuarioCounts[usuario] || 0) + 1;
  });

  // 3. Categoría (padre) sigue igual
  const categoryCounts = allInventory.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + 1;
    return acc;
  }, {});

  // --- FIN NUEVO ---

  // Filtrado principal
  const handleFilter = () => {
    let filtered = allInventory;

    if (activeCategory !== "Todos") {
      filtered = filtered.filter((item) => item.categoria === activeCategory);
    }
    if (activeSubcategory !== "Todos") {
      filtered = filtered.filter(
        (item) => item.subcategoria === activeSubcategory
      );
    }
    if (activeActivo !== "Todos") {
      filtered = filtered.filter((item) =>
        activeActivo === "Activo"
          ? item.activo === true || item.activo === 1
          : item.activo === false || item.activo === 0
      );
    }
    if (activeUsuario !== "Todos") {
      filtered = filtered.filter(
        (item) => (item.usuario || "Sin usuario") === activeUsuario
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (priceOrder === "asc") {
      filtered = [...filtered].sort(
        (a, b) => a.precio_articulo - b.precio_articulo
      );
    } else if (priceOrder === "desc") {
      filtered = [...filtered].sort(
        (a, b) => b.precio_articulo - a.precio_articulo
      );
    }

    setFilteredInventory(filtered);
  };

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line
  }, [
    activeCategory,
    activeSubcategory,
    activeActivo,
    activeUsuario,
    searchTerm,
    priceOrder,
    allInventory,
  ]);

  const handleResetFilters = () => {
    setActiveCategory("Todos");
    setActiveSubcategory("Todos");
    setActiveActivo("Todos");
    setActiveUsuario("Todos");
    setSearchTerm("");
    setPriceOrder("");
  };

  const handleOpenDrawer = (item) => {
    setSelectedItem(item);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedItem(null);
  };

  const renderFotos = (fotos) => {
    if (!fotos || fotos.length === 0) {
      return (
        <div className="flex justify-center p-4">
          <Avatar sx={{ width: 100, height: 100 }}>
            <ImageIcon fontSize="large" />
          </Avatar>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {fotos.map((fotoObj, index) => (
          <Card key={index} className="flex flex-col shadow">
            <CardMedia
              component="img"
              height="160"
              image={fotoObj.url_imagen || ""}
              alt={`Foto ${index + 1}`}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Imagen {index + 1}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Calcula si no hay resultados
  const noResults = searchTerm.length > 0 && filteredInventory.length === 0;

  return (
    <div className="p-4 space-y-6">
      <div class="max-w-full mx-auto rounded font-[sans-serif]">
        <div
          class="flex items-center gap-4 border-b border-g ray-300 pb-1"
          style={{ borderBottom: `2px solid ${colors.accentGreen[100]}` }}
        >
          <h3
            class="text-2xl font-extrabold text-green-300"
            style={{ color: colors.accentGreen[100] }}
          >
            Listado de Inventario
          </h3>
          <p class="text-gray-400 leading-relaxed text-base">
            Consulta y gestiona la información de todos los artículos de
            inventario disponibles en la plataforma.
          </p>
        </div>
      </div>
      {/* Filtros de categoría */}
      <Typography
        variant="h6"
        style={{ color: colors.accentGreen[100], fontWeight: "bold" }}
      >
        Categoría
      </Typography>
      <div className="flex flex-wrap gap-2 items-center">
        <Chip
          label={`Todos (${allInventory.length})`}
          clickable
          onClick={() => {
            setActiveCategory("Todos");
            setActiveSubcategory("Todos");
            setActiveActivo("Todos");
            setActiveUsuario("Todos");
          }}
          sx={{
            backgroundColor:
              activeCategory === "Todos" ? colors.accentGreen[100] : undefined,
            color:
              activeCategory === "Todos"
                ? colors.contentAccentGreen[100]
                : undefined,
            fontWeight: "bold",
            "&:hover": {
              backgroundColor:
                activeCategory === "Todos"
                  ? colors.accentGreen[200]
                  : undefined,
            },
          }}
          variant={activeCategory === "Todos" ? "filled" : "outlined"}
        />
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={`${cat} (${categoryCounts[cat] || 0})`}
            clickable
            onClick={() => {
              setActiveCategory(cat);
              setActiveSubcategory("Todos");
              setActiveActivo("Todos");
              setActiveUsuario("Todos");
            }}
            sx={{
              backgroundColor:
                activeCategory === cat ? colors.accentGreen[100] : undefined,
              color:
                activeCategory === cat
                  ? colors.contentAccentGreen[100]
                  : undefined,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor:
                  activeCategory === cat ? colors.accentGreen[200] : undefined,
              },
            }}
            variant={activeCategory === cat ? "filled" : "outlined"}
          />
        ))}
      </div>
      {/* Filtros de subcategoría */}
      <Typography
        variant="h6"
        style={{ color: colors.accentGreen[100], fontWeight: "bold" }}
      >
        Subcategoría
      </Typography>
      <div className="flex flex-wrap gap-2 items-center">
        <Chip
          label={`Todos (${filteredForSubcategory.length})`}
          clickable
          onClick={() => setActiveSubcategory("Todos")}
          sx={{
            backgroundColor:
              activeSubcategory === "Todos"
                ? colors.accentGreen[100]
                : undefined,
            color:
              activeSubcategory === "Todos"
                ? colors.contentAccentGreen[100]
                : undefined,
            fontWeight: "bold",
            "&:hover": {
              backgroundColor:
                activeSubcategory === "Todos"
                  ? colors.accentGreen[200]
                  : undefined,
            },
          }}
          variant={activeSubcategory === "Todos" ? "filled" : "outlined"}
        />
        {subcategories.map((sub) => (
          <Chip
            key={sub}
            label={`${sub} (${subcategoryCounts[sub] || 0})`}
            clickable
            onClick={() => setActiveSubcategory(sub)}
            sx={{
              backgroundColor:
                activeSubcategory === sub ? colors.accentGreen[100] : undefined,
              color:
                activeSubcategory === sub
                  ? colors.contentAccentGreen[100]
                  : undefined,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor:
                  activeSubcategory === sub
                    ? colors.accentGreen[200]
                    : undefined,
              },
            }}
            variant={activeSubcategory === sub ? "filled" : "outlined"}
          />
        ))}
      </div>

      {/* Filtros de activo */}
      <Typography
        variant="h6"
        style={{ color: colors.accentGreen[100], fontWeight: "bold" }}
      >
        Estado
      </Typography>
      <div className="flex flex-wrap gap-2 items-center">
        <Chip
          label={`Todos (${activoCounts.Activo + activoCounts.Baja})`}
          clickable
          onClick={() => setActiveActivo("Todos")}
          sx={{
            backgroundColor:
              activeActivo === "Todos" ? colors.accentGreen[100] : undefined,
            color:
              activeActivo === "Todos"
                ? colors.contentAccentGreen[100]
                : undefined,
            fontWeight: "bold",
            "&:hover": {
              backgroundColor:
                activeActivo === "Todos" ? colors.accentGreen[200] : undefined,
            },
          }}
          variant={activeActivo === "Todos" ? "filled" : "outlined"}
        />
        <Chip
          label={`Activo (${activoCounts.Activo})`}
          clickable
          onClick={() => setActiveActivo("Activo")}
          sx={{
            backgroundColor:
              activeActivo === "Activo" ? colors.accentGreen[100] : undefined,
            color:
              activeActivo === "Activo"
                ? colors.contentAccentGreen[100]
                : undefined,
            fontWeight: "bold",
            "&:hover": {
              backgroundColor:
                activeActivo === "Activo" ? colors.accentGreen[200] : undefined,
            },
          }}
          variant={activeActivo === "Activo" ? "filled" : "outlined"}
        />
        <Chip
          label={`Baja (${activoCounts.Baja})`}
          clickable
          onClick={() => setActiveActivo("Baja")}
          sx={{
            backgroundColor:
              activeActivo === "Baja" ? colors.accentGreen[100] : undefined,
            color:
              activeActivo === "Baja"
                ? colors.contentAccentGreen[100]
                : undefined,
            fontWeight: "bold",
            "&:hover": {
              backgroundColor:
                activeActivo === "Baja" ? colors.accentGreen[200] : undefined,
            },
          }}
          variant={activeActivo === "Baja" ? "filled" : "outlined"}
        />
      </div>

      {/* Filtros de usuario */}
      <Typography
        variant="h6"
        style={{ color: colors.accentGreen[100], fontWeight: "bold" }}
      >
        Usuario
      </Typography>
      <div className="flex flex-wrap gap-2 items-center">
        <Chip
          label={`Todos (${filteredForUsuario.length})`}
          clickable
          onClick={() => setActiveUsuario("Todos")}
          sx={{
            backgroundColor:
              activeUsuario === "Todos" ? colors.accentGreen[100] : undefined,
            color:
              activeUsuario === "Todos"
                ? colors.contentAccentGreen[100]
                : undefined,
            fontWeight: "bold",
            "&:hover": {
              backgroundColor:
                activeUsuario === "Todos" ? colors.accentGreen[200] : undefined,
            },
          }}
          variant={activeUsuario === "Todos" ? "filled" : "outlined"}
        />
        {usuarios.map((usuario) => {
          const userItem = filteredForUsuario.find(
            (item) => (item.usuario || "Sin usuario") === usuario
          );
          const avatarUrl =
            userItem && userItem.imagen_usuario
              ? userItem.imagen_usuario
              : undefined;

          return (
            <Chip
              key={usuario}
              label={`${usuario} (${usuarioCounts[usuario] || 0})`}
              clickable
              onClick={() => setActiveUsuario(usuario)}
              avatar={
                avatarUrl ? (
                  <Avatar src={avatarUrl} alt={usuario} />
                ) : (
                  <Avatar>
                    <ImageIcon fontSize="small" />
                  </Avatar>
                )
              }
              sx={{
                backgroundColor:
                  activeUsuario === usuario
                    ? colors.accentGreen[100]
                    : undefined,
                color:
                  activeUsuario === usuario
                    ? colors.contentAccentGreen[100]
                    : undefined,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor:
                    activeUsuario === usuario
                      ? colors.accentGreen[200]
                      : undefined,
                },
              }}
              variant={activeUsuario === usuario ? "filled" : "outlined"}
            />
          );
        })}
      </div>

      {/* Buscador, orden y exportaciones */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 sm:col-span-4">
          <FormControl fullWidth>
            <TextField
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              color="secondary"
              size="small"
              placeholder="Ingresa tu búsqueda"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search sx={{ color: colors.accentGreen[100] }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accentGreen[100],
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "accent.light",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "accent.dark",
                },
              }}
            />
            {noResults && (
              <FormHelperText style={{ color: "red" }}>
                No se encontraron resultados
              </FormHelperText>
            )}
          </FormControl>
        </div>
        <div className="col-span-6 sm:col-span-2">
          <FormControl fullWidth size="small">
            <InputLabel sx={{ top: "0px", color: colors.accentGreen[100] }}>
              Ordenar por precio
            </InputLabel>
            <Select
              value={priceOrder}
              label="Ordenar por precio"
              onChange={(e) => setPriceOrder(e.target.value)}
              color="secondary"
              inputProps={{
                sx: {
                  borderRadius: "20px",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accentGreen[100],
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "accent.light",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "accent.dark",
                },
              }}
            >
              <MenuItem value="asc">Menor a mayor</MenuItem>
              <MenuItem value="desc">Mayor a menor</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="col-span-6 sm:col-span-2">
          <InventoryExportExcel filteredInventory={filteredInventory} />
        </div>
        <div className="col-span-6 sm:col-span-2">
          <InventoryExportPDF filteredInventory={filteredInventory} />
        </div>
      </div>

      {/* Tarjetas de inventario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => (
          <Paper
            key={item.id_articulo}
            elevation={2}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: theme.palette.background.paper,
              display: "flex",
              flexDirection: "row",
              boxShadow: "0 2px 8px 0 rgba(60,60,60,0.06)",
            }}
            className="flex bg-white shadow rounded-lg overflow-hidden border"
          >
            <div className="w-48 h-48 flex-shrink-0 flex items-center justify-center bg-gray-100">
              {Array.isArray(item.fotos) &&
              item.fotos.length > 0 &&
              item.fotos[0].url_imagen ? (
                <img
                  src={item.fotos[0].url_imagen}
                  alt={item.nombre_articulo}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Avatar sx={{ width: 100, height: 100 }}>
                  <ImageIcon fontSize="large" />
                </Avatar>
              )}
            </div>
            <div className="flex flex-col justify-between p-4 w-full">
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: colors.grey[100] }}
                >
                  {item.nombre_articulo}
                </h2>
                <p className="text-sm" style={{ color: colors.grey[100] }}>
                  Categoría: {item.categoria}
                </p>
                <p className="text-sm" style={{ color: colors.grey[100] }}>
                  Área: {item.area}
                </p>
                <p className="text-sm" style={{ color: colors.grey[100] }}>
                  Cantidad: {item.cantidad_articulo} ({item.unidad})
                </p>
                <p className="text-sm" style={{ color: colors.grey[100] }}>
                  Precio: ${item.precio_articulo}
                </p>
              </div>
              <div className="mt-2 text-right">
                <Button
                  variant="contained"
                  size="small"
                  color="info"
                  onClick={() => handleOpenDrawer(item)}
                >
                  Ver detalle
                </Button>
              </div>
            </div>
          </Paper>
        ))}
      </div>

      <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
        <div className="w-[400px] max-w-full p-4">
          {selectedItem && (
            <>
              <Typography variant="h6" className="mb-2">
                {selectedItem.nombre_articulo}
              </Typography>
              {renderFotos(selectedItem.fotos)}
              <div className="space-y-2 px-2">
                {Object.entries(selectedItem)
                  .filter(
                    ([key, value]) =>
                      value !== null &&
                      value !== "" &&
                      !key.toLowerCase().includes("id") &&
                      key !== "fotos" &&
                      key !== "nombre_articulo" &&
                      key !== "imagen_usuario"
                  )
                  .map(([key, value]) => {
                    const formattedKey = key.replace(/_/g, " ").toUpperCase();
                    const isDate =
                      typeof value === "string" &&
                      /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value);
                    const isBooleanLike =
                      typeof value === "boolean" || value === 1 || value === 0;
                    const isPrice =
                      key.toLowerCase().includes("precio") && !isNaN(value);

                    let displayValue = value;
                    if (isDate) {
                      displayValue = new Date(value).toLocaleDateString();
                    } else if (
                      isBooleanLike &&
                      key.toLowerCase().includes("activo")
                    ) {
                      displayValue =
                        value === 1 || value === true ? "Activo" : "Baja";
                    } else if (isPrice) {
                      displayValue = `$${parseFloat(value).toFixed(2)}`;
                    }

                    return (
                      <Typography key={key} variant="body2">
                        <strong>{formattedKey}:</strong> {displayValue}
                      </Typography>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default Index;
