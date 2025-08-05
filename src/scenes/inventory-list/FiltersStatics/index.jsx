import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { getAllInventory } from "../../api/inventory";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [allInventory, setAllInventory] = useState([]);
  const [filteredObjects, setFilteredObjects] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    usuario: "",
    subcategoria: "",
    categoria: "",
    plaza: "",
    activo: "",
  });

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
      } catch (error) {
        console.error("Error al obtener inventario:", error);
      }
    };
    fetchData();
  }, []);

  const applyFilter = (filterName, filterValue) => {
    const filterOrder = [
      "usuario",
      "subcategoria",
      "categoria",
      "plaza",
      "activo",
    ];
    const changedIndex = filterOrder.indexOf(filterName);

    // Limpiar filtros posteriores
    const newSelectedFilters = { ...selectedFilters };
    for (let i = changedIndex; i < filterOrder.length; i++) {
      newSelectedFilters[filterOrder[i]] = "";
    }
    // Establecer nuevo valor para el filtro actual
    newSelectedFilters[filterName] = filterValue;
    setSelectedFilters(newSelectedFilters);

    let newAppliedFilters = [...appliedFilters];
    let newFilteredObjects = [...filteredObjects];

    const filterIndex = newAppliedFilters.indexOf(filterName);

    // Si es un filtro vacío ("Todos"), eliminar filtros posteriores y no aplicar nada nuevo
    if (!filterValue) {
      if (filterIndex !== -1) {
        newAppliedFilters = newAppliedFilters.slice(0, filterIndex);
        newFilteredObjects = newFilteredObjects.slice(0, filterIndex + 1);
      }
      setAppliedFilters(newAppliedFilters);
      setFilteredObjects(newFilteredObjects);
      return;
    }

    // Si es un nuevo filtro, lo agregamos
    if (filterIndex === -1) {
      newAppliedFilters.push(filterName);
    } else {
      newAppliedFilters = newAppliedFilters.slice(0, filterIndex + 1);
      newFilteredObjects = newFilteredObjects.slice(0, filterIndex + 1);
    }

    const baseObject = newFilteredObjects[newFilteredObjects.length - 1];
    const filtered = baseObject.filter((item) => {
      switch (filterName) {
        case "usuario":
          return item.usuario === filterValue;
        case "subcategoria":
          return item.subcategoria === filterValue;
        case "categoria":
          return item.categoria === filterValue;
        case "plaza":
          return item.plaza === filterValue;
        case "activo":
          return item.activo === (filterValue === "true");
        default:
          return true;
      }
    });

    newFilteredObjects.push(filtered);
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

  return (
    <div className="p-4 space-y-6">
      <div className="max-w-full mx-auto rounded font-[sans-serif]">
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

        <div className="grid grid-cols-3 gap-4 mt-4">
          {Object.keys(selectedFilters).map((filterKey) => (
            <div key={filterKey} className="flex flex-col text-sm">
              <label className="text-gray-700 font-medium capitalize">
                {filterKey}
              </label>
              <select
                className="border border-gray-300 rounded px-2 py-1 mt-1"
                value={selectedFilters[filterKey]}
                onChange={(e) => applyFilter(filterKey, e.target.value)}
              >
                <option value="">Todos</option>
                {getOptions(filterKey).map((option, idx) => (
                  <option key={idx} value={String(option)}>
                    {String(option)}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            className="col-span-3 mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setSelectedFilters({
                usuario: "",
                subcategoria: "",
                categoria: "",
                plaza: "",
                activo: "",
              });
              setAppliedFilters([]);
              setFilteredObjects([allInventory]);
            }}
          >
            Limpiar filtros
          </button>
        </div>

        <div className="mt-6">
          <strong>Filtros aplicados:</strong> {appliedFilters.join(", ")}
        </div>

        <div className="mt-2">
          <strong>Artículos filtrados:</strong>{" "}
          {filteredObjects.length > 0
            ? filteredObjects[filteredObjects.length - 1].length
            : 0}
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-bold">Detalle de objetos filtrados:</h4>
          {filteredObjects.map((obj, index) => (
            <div
              key={index}
              className="p-2 mt-2 border border-gray-400 rounded bg-gray-50"
            >
              <p className="font-semibold text-sm mb-1">
                Objeto {index} (Filtro{" "}
                {index === 0 ? "original" : appliedFilters[index - 1]})
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Total de artículos: {obj.length}
              </p>
              <pre className="max-h-40 overflow-y-auto text-xs bg-white p-2 rounded border border-gray-200">
                {JSON.stringify(obj, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Index;
