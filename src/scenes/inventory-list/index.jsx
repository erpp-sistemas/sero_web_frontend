import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  useTheme,
  Skeleton,
  Grow,
} from "@mui/material";
import { tokens } from "../../theme";
import { getAllInventory } from "../../api/inventory";
import {
  DeleteSweep,
  DeleteSweepOutlined,
  KeyboardArrowDown,
  KeyboardArrowDownOutlined,
  NavigateNext,
  PlaylistAdd,
  PlaylistAddOutlined,
} from "@mui/icons-material";
import { Breadcrumbs, Chip } from "@mui/material";
import InventoryCards from "../../components/InventoryList/InventoryCards";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [allInventory, setAllInventory] = useState([]);
  const [filteredObjects, setFilteredObjects] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [availableFilters, setAvailableFilters] = useState([]);
  const [addingFilter, setAddingFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllInventory();
        const processedInventory = response
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            ...item,
            fotos:
              typeof item.fotos === "string"
                ? item.fotos
                    .split(",")
                    .map((url) => ({ url_imagen: url.trim() }))
                : Array.isArray(item.fotos)
                ? item.fotos
                : [],
          }));

        setAllInventory(processedInventory);
        setFilteredObjects([processedInventory]);

        const fixedFilters = [
          "usuario",
          "subcategoria",
          "categoria",
          "plaza",
          "estado",
        ];
        const dynamicKeys = Object.keys(processedInventory[0] || {}).filter(
          (key) =>
            !fixedFilters.includes(key) &&
            typeof processedInventory[0][key] !== "object" &&
            !key.toLowerCase().includes("id") &&
            !key.toLowerCase().includes("imagen")
        );
        setAvailableFilters(dynamicKeys);

        const initialSelected = {};
        fixedFilters.forEach((f) => (initialSelected[f] = ""));
        setSelectedFilters(initialSelected);
      } catch (error) {
        console.error("Error al obtener inventario:", error);
      } finally {
        setLoading(false); // 👈 terminado
      }
    };
    fetchData();
  }, []);

  const applyFilter = (filterName, filterValue) => {
    const allFilterKeys = Object.keys(selectedFilters);
    const filterIndex = appliedFilters.indexOf(filterName);

    let newAppliedFilters = [...appliedFilters];
    let newFilteredObjects = [...filteredObjects];

    if (!filterValue) {
      // Si limpias un filtro, truncar la lista hasta ese filtro
      if (filterIndex !== -1) {
        newAppliedFilters = newAppliedFilters.slice(0, filterIndex);
        newFilteredObjects = newFilteredObjects.slice(0, filterIndex + 1);
      }
    } else {
      if (filterIndex === -1) {
        newAppliedFilters.push(filterName);
      } else {
        newAppliedFilters = newAppliedFilters.slice(0, filterIndex + 1);
        newFilteredObjects = newFilteredObjects.slice(0, filterIndex + 1);
      }
    }

    // Aplica el filtro solo si tiene valor
    if (filterValue) {
      const baseObject = newFilteredObjects[newFilteredObjects.length - 1];
      const filtered = baseObject.filter((item) => {
        const value = item[filterName];
        // if (filterName === "activo") {
        //   return value === (filterValue === "true");
        // }
        return value === filterValue;
      });
      newFilteredObjects.push(filtered);
    }

    // Actualiza selectedFilters: limpiamos filtros que ya no están en appliedFilters
    const newSelectedFilters = {
      ...selectedFilters,
      [filterName]: filterValue,
    };
    // Limpia filtros que quedaron fuera de appliedFilters
    newAppliedFilters.forEach((f) => {
      // Ya están bien
    });
    allFilterKeys.forEach((key) => {
      if (!newAppliedFilters.includes(key) && key !== filterName) {
        newSelectedFilters[key] = "";
      }
    });

    setSelectedFilters(newSelectedFilters);
    setAppliedFilters(newAppliedFilters);
    setFilteredObjects(newFilteredObjects);
  };

  const getOptions = (filterName) => {
    const index = appliedFilters.indexOf(filterName);
    const sourceIndex = index === -1 ? appliedFilters.length : index;
    const sourceData = filteredObjects[sourceIndex] || [];
    const values = [...new Set(sourceData.map((item) => item[filterName]))];
    return values.filter((v) => v !== undefined && v !== null);
  };

  const handleAddFilter = () => {
    if (!addingFilter || selectedFilters.hasOwnProperty(addingFilter)) return;
    setSelectedFilters((prev) => ({ ...prev, [addingFilter]: "" }));
    setAddingFilter("");
  };

  const handleSaveItem = (updatedInventory) => {
    setAllInventory(updatedInventory);

    setFilteredObjects((prev) => {
      // Actualizamos el último filtro con el inventario actualizado,
      // manteniendo la estructura de los filtros previos
      const lastFiltered = prev.length > 0 ? prev[prev.length - 1] : [];
      const newFiltered = lastFiltered.map((item) => {
        return (
          updatedInventory.find(
            (inv) => inv.id_articulo === item.id_articulo
          ) || item
        );
      });

      return [...prev.slice(0, -1), newFiltered];
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="max-w-full mx-auto font-[sans-serif]">
        <div
          className="flex items-center gap-4 border-b border-gray-300 pb-1"
          style={{ borderBottom: `2px solid ${colors.accentGreen[100]}` }}
        >
          <h3
            className="text-2xl font-extrabold"
            style={{ color: colors.accentGreen[100] }}
          >
            Listado de Inventario
          </h3>
          <p className="text-gray-400 leading-relaxed text-base">
            Consulta y gestiona la información de todos los artículos de
            inventario existente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
          {loading
            ? // Mostrar 3 Skeletons mientras carga
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center">
                  <Skeleton variant="rounded" height={40} width="100%" />
                </div>
              ))
            : Object.keys(selectedFilters).map((filterKey) => (
                <Grow key={filterKey} in={true} timeout={300}>
                  <div key={filterKey} className="flex items-center">
                    <FormControl fullWidth size="small">
                      <InputLabel>{filterKey}</InputLabel>
                      <Select
                        value={selectedFilters[filterKey]}
                        label={filterKey}
                        onChange={(e) => applyFilter(filterKey, e.target.value)}
                        sx={{
                          borderRadius: "10px",
                          fontSize: "0.875rem",
                          marginBottom: 1,
                          backgroundColor: colors.bgContainer, // mismo fondo que usamos en contenedores
                          transition:
                            "border-color 0.2s ease, box-shadow 0.2s ease",

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
                          "& .MuiInputAdornment-root": {
                            marginRight: "8px",
                          },

                          "& .MuiFormHelperText-root": {
                            marginLeft: 1,
                            fontSize: "0.75rem",
                            color: theme.palette.error.main,
                          },
                        }}
                        IconComponent={(props) => (
                          <KeyboardArrowDownOutlined
                            {...props}
                            sx={{ color: colors.grey[300], fontSize: 20 }}
                          />
                        )}
                      >
                        <MenuItem value="">Todos</MenuItem>
                        {getOptions(filterKey).map((option, idx) => (
                          <MenuItem key={idx} value={String(option)}>
                            {String(option)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Grow>
              ))}
        </div>

        <div className="grid grid-cols-12 items-center gap-2 mt-2">
          <FormControl size="small" className="col-span-4">
            <InputLabel>Agregar filtro</InputLabel>
            {loading ? (
              <Skeleton variant="rounded" height={40} width="100%" />
            ) : (
              <Select
                value={addingFilter}
                label="Agregar filtro"
                onChange={(e) => setAddingFilter(e.target.value)}
                sx={{
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
                  "& .MuiInputAdornment-root": {
                    marginRight: "8px",
                  },

                  "& .MuiFormHelperText-root": {
                    marginLeft: 1,
                    fontSize: "0.75rem",
                    color: theme.palette.error.main,
                  },
                }}
                IconComponent={(props) => (
                  <KeyboardArrowDownOutlined
                    {...props}
                    sx={{ color: colors.grey[300], fontSize: 20 }}
                  />
                )}
              >
                {availableFilters
                  .filter((f) => !selectedFilters.hasOwnProperty(f))
                  .map((field) => (
                    <MenuItem key={field} value={field}>
                      {field}
                    </MenuItem>
                  ))}
              </Select>
            )}
          </FormControl>
          <div className="col-span-2">
            <Button
              onClick={handleAddFilter}
              variant="contained"
              color="info"
              fullWidth
              endIcon={
                <PlaylistAddOutlined
                  sx={{ fontSize: 18, color: colors.textAccent }}
                />
              }
              disabled={loading}
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
                transition: "background-color 0.3s ease, box-shadow 0.2s ease",
                boxShadow: "none", // minimalismo: sin sombra por defecto
                "&:hover, &:active": {
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
                },
              }}
            >
              Agregar filtro
            </Button>
          </div>
          <div className="col-span-2">
            <Button
              onClick={() => {
                const fixed = [
                  "usuario",
                  "subcategoria",
                  "categoria",
                  "plaza",
                  "estado",
                ];
                const reset = {};
                fixed.forEach((f) => (reset[f] = ""));
                setSelectedFilters(reset);
                setAppliedFilters([]);
                setFilteredObjects([allInventory]);
              }}
              variant="contained"
              color="error"
              fullWidth
              endIcon={
                <DeleteSweepOutlined
                  sx={{ fontSize: 18, color: colors.textAccentSecondary }}
                />
              }
              disabled={loading}
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
                transition: "background-color 0.3s ease, box-shadow 0.2s ease",
                boxShadow: "none", // minimalismo: sin sombra por defecto
                "&:hover, &:active": {
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
                },
              }}
            >
              Limpiar filtros
            </Button>
          </div>
          <div className="col-span-4"></div>
        </div>

        <div className="pt-4">
          {appliedFilters.length > 0 && (
            <Breadcrumbs separator={<NavigateNext fontSize="large" />}>
              {appliedFilters.map((filterKey, index) => {
                const filterLabel = `${filterKey}: ${selectedFilters[filterKey]}`;
                return (
                  <Grow key={filterKey} in={true} timeout={300}>
                    <Chip
                      key={filterKey}
                      label={filterLabel}
                      onDelete={() => {
                        // Al eliminar, reinicia desde ese filtro
                        const newSelectedFilters = { ...selectedFilters };
                        const allFilterKeys = Object.keys(selectedFilters);
                        const startIndex = allFilterKeys.indexOf(filterKey);

                        for (
                          let i = startIndex;
                          i < allFilterKeys.length;
                          i++
                        ) {
                          newSelectedFilters[allFilterKeys[i]] = "";
                        }

                        setSelectedFilters(newSelectedFilters);
                        setAppliedFilters((prev) => prev.slice(0, index));
                        setFilteredObjects((prev) => prev.slice(0, index + 1));
                      }}
                      color="info"
                      variant="outlined"
                      size="small"
                    />
                  </Grow>
                );
              })}
            </Breadcrumbs>
          )}
        </div>
        <div className="pt-4">
          {(loading ||
            (filteredObjects.length > 0 &&
              filteredObjects[filteredObjects.length - 1])) && (
            <InventoryCards
              inventory={
                filteredObjects.length > 0
                  ? filteredObjects[filteredObjects.length - 1]
                  : []
              }
              loading={loading}
              onSaveItem={handleSaveItem}
            />
          )}
        </div>

        {/* <div className="mt-8">
          <h4 className="text-lg font-bold">Detalle de objetos filtrados:</h4>
          {filteredObjects.map((obj, index) => (
            <div
              key={index}
              className="p-2 mt-2 border border-gray-400 rounded bg-gray-50 dark:bg-neutral-800"
            >
              <p className="font-semibold text-sm mb-1">
                Objeto {index} (Filtro{" "}
                {index === 0 ? "original" : appliedFilters[index - 1]})
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Total de artículos: {obj.length}
              </p>
              <pre className="max-h-40 overflow-y-auto text-xs bg-white p-2 rounded border border-gray-200 dark:bg-neutral-900">
                {JSON.stringify(obj, null, 2)}
              </pre>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default Index;
