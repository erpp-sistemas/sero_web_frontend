// src/components/Inventory/InventoryIndex.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  useTheme,
  Grow,
  Paper,
  Alert,
  Snackbar,
  Chip,
} from "@mui/material";
import { tokens } from "../../theme";
import { getAllInventory } from "../../api/inventory";

// Componentes hijos
import InventoryDashboard from "../../components/InventoryMonitor/InventoryDashboard";
import InventoryList from "../../components/InventoryMonitor/InventoryList";
import InventoryFilters from "../../components/InventoryMonitor/InventoryFilters";
import InventorySkeleton from "../../components/InventoryMonitor/InventorySkeleton";

// Modales
import InventoryDetailDialog from "../../components/InventoryMonitor/InventoryList/InventoryDetailDialog";
import InventoryManageDialog from "../../components/InventoryMonitor/InventoryList/InventoryManageDialog";

const Index = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ============================================
  // ESTADOS
  // ============================================
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabActiva, setTabActiva] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Estados para filtros
  const [filters, setFilters] = useState({
    busqueda: "",
    categoria: "todos",
    plaza: "todos",
  });

  // Estados para modales
  const [detailOpen, setDetailOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState(null);

  // ============================================
  // COLORES
  // ============================================
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainer;
  const COLOR_BORDE = colors.primary[500];
  const COLOR_TAB_ACTIVA = colors.blueAccent[600];

  // ============================================
  // CARGA DE DATOS
  // ============================================
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllInventory();

        const processedData = response
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            ...item,
            estado_calculado:
              !item.id_usuario && item.activo !== false
                ? "disponible"
                : item.activo === false
                  ? "baja"
                  : item.condicion_actual === "malo"
                    ? "mantenimiento"
                    : "asignado",
            fotos: Array.isArray(item.fotos) ? item.fotos : [],
          }));

        setInventory(processedData);
        setFilteredInventory(processedData);
        setDashboardData(processedData);

        setSnackbar({
          open: true,
          message: `${processedData.length} artículos cargados`,
          severity: "success",
        });
      } catch (err) {
        console.error("Error al cargar inventario:", err);
        setError("Error al cargar los datos del inventario");
        setSnackbar({
          open: true,
          message: "Error al cargar los datos",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // ============================================
  // OPCIONES DINÁMICAS
  // ============================================
  const categorias = useMemo(() => {
    const unique = new Set(
      inventory.map((item) => item.categoria).filter(Boolean),
    );
    return ["todos", ...Array.from(unique).sort()];
  }, [inventory]);

  const plazas = useMemo(() => {
    const unique = new Set(inventory.map((item) => item.plaza).filter(Boolean));
    return ["todos", ...Array.from(unique).sort()];
  }, [inventory]);

  // ============================================
  // CONFIGURACIÓN DE TABS - SOLO CON DATOS
  // ============================================
  const tabsConfig = useMemo(() => {
    // Primero calculamos los datos base con los filtros actuales
    let baseData = [...inventory];

    if (filters.busqueda) {
      const busquedaLower = filters.busqueda.toLowerCase();
      baseData = baseData.filter(
        (item) =>
          item.nombre_articulo?.toLowerCase().includes(busquedaLower) ||
          item.folio?.toLowerCase().includes(busquedaLower) ||
          item.numero_serie?.toLowerCase().includes(busquedaLower) ||
          item.marca?.toLowerCase().includes(busquedaLower),
      );
    }

    if (filters.categoria !== "todos") {
      baseData = baseData.filter(
        (item) => item.categoria === filters.categoria,
      );
    }

    if (filters.plaza !== "todos") {
      baseData = baseData.filter((item) => item.plaza === filters.plaza);
    }

    // Configuración base con "Todos" siempre presente
    const config = [
      {
        key: "todos",
        label: "Todos",
        color: COLOR_TAB_ACTIVA,
        filter: () => true,
        count: baseData.length,
      },
    ];

    // Función para contar elementos de un tipo específico
    const contar = (filterFn) => baseData.filter(filterFn).length;

    // Agregar "Disponibles" solo si hay al menos 1
    const disponibles = contar(
      (item) => !item.id_usuario && item.activo !== false,
    );
    if (disponibles > 0) {
      config.push({
        key: "disponible",
        label: "Disponibles",
        color: colors.accentGreen[100],
        filter: (item) => !item.id_usuario && item.activo !== false,
        count: disponibles,
      });
    }

    // Agregar "Asignados" solo si hay al menos 1
    const asignados = contar(
      (item) =>
        item.id_usuario &&
        item.activo !== false &&
        item.condicion_actual !== "malo",
    );
    if (asignados > 0) {
      config.push({
        key: "asignado",
        label: "Asignados",
        color: colors.blueAccent[400],
        filter: (item) =>
          item.id_usuario &&
          item.activo !== false &&
          item.condicion_actual !== "malo",
        count: asignados,
      });
    }

    // Agregar "Mantenimiento" solo si hay al menos 1
    const mantenimiento = contar(
      (item) => item.condicion_actual === "malo" && item.activo !== false,
    );
    if (mantenimiento > 0) {
      config.push({
        key: "mantenimiento",
        label: "Mantenimiento",
        color: colors.yellowAccent[400],
        filter: (item) =>
          item.condicion_actual === "malo" && item.activo !== false,
        count: mantenimiento,
      });
    }

    // Agregar "Dados de baja" solo si hay al menos 1
    const baja = contar((item) => item.activo === false);
    if (baja > 0) {
      config.push({
        key: "baja",
        label: "Dados de baja",
        color: colors.redAccent[400],
        filter: (item) => item.activo === false,
        count: baja,
      });
    }

    return config;
  }, [inventory, filters, colors, COLOR_TAB_ACTIVA]);

  // ============================================
  // FUNCIONES DE FILTRADO
  // ============================================
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyAllFilters(newFilters, tabActiva);
  };

  const handleTabChange = (event, newValue) => {
    setTabActiva(newValue);
    applyAllFilters(filters, newValue);
  };

  const applyAllFilters = (currentFilters, currentTab) => {
    let filtered = [...inventory];

    // Aplicar filtros de búsqueda, categoría y plaza
    if (currentFilters.busqueda) {
      const busquedaLower = currentFilters.busqueda.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          // Búsqueda en campos del artículo
          item.nombre_articulo?.toLowerCase().includes(busquedaLower) ||
          item.folio?.toLowerCase().includes(busquedaLower) ||
          item.numero_serie?.toLowerCase().includes(busquedaLower) ||
          item.marca?.toLowerCase().includes(busquedaLower) ||
          item.modelo?.toLowerCase().includes(busquedaLower) ||
          // Búsqueda por nombre de usuario asignado
          item.usuario?.toLowerCase().includes(busquedaLower),
      );
    }

    if (currentFilters.categoria !== "todos") {
      filtered = filtered.filter(
        (item) => item.categoria === currentFilters.categoria,
      );
    }

    if (currentFilters.plaza !== "todos") {
      filtered = filtered.filter((item) => item.plaza === currentFilters.plaza);
    }

    // Aplicar filtro de tab (estado)
    if (currentTab > 0) {
      const tabConfig = tabsConfig[currentTab];
      if (tabConfig) {
        filtered = filtered.filter(tabConfig.filter);
      }
    }

    setFilteredInventory(filtered);

    // Para el dashboard, aplicamos SOLO los filtros de búsqueda, categoría y plaza
    let dashboardFiltered = [...inventory];

    if (currentFilters.busqueda) {
      const busquedaLower = currentFilters.busqueda.toLowerCase();
      dashboardFiltered = dashboardFiltered.filter(
        (item) =>
          item.nombre_articulo?.toLowerCase().includes(busquedaLower) ||
          item.folio?.toLowerCase().includes(busquedaLower) ||
          item.numero_serie?.toLowerCase().includes(busquedaLower) ||
          item.marca?.toLowerCase().includes(busquedaLower),
      );
    }

    if (currentFilters.categoria !== "todos") {
      dashboardFiltered = dashboardFiltered.filter(
        (item) => item.categoria === currentFilters.categoria,
      );
    }

    if (currentFilters.plaza !== "todos") {
      dashboardFiltered = dashboardFiltered.filter(
        (item) => item.plaza === currentFilters.plaza,
      );
    }

    setDashboardData(dashboardFiltered);
  };

  const handleResetFilters = () => {
    setFilters({
      busqueda: "",
      categoria: "todos",
      plaza: "todos",
    });
    setTabActiva(0);
    setFilteredInventory(inventory);
    setDashboardData(inventory);
  };

  // ============================================
  // COLOR PARA TAB ACTIVA
  // ============================================
  const getColorTabActiva = () => {
    if (tabActiva === 0) return COLOR_TAB_ACTIVA;
    return tabsConfig[tabActiva]?.color || COLOR_TAB_ACTIVA;
  };

  // ============================================
  // MANEJADORES DE ACCIONES - ACTUALIZADOS
  // ============================================
  const handleVerDetalle = (articulo) => {
    setSelectedArticulo(articulo);
    setDetailOpen(true);
  };

  const handleGestionar = (articulo) => {
    setSelectedArticulo(articulo);
    setManageOpen(true);
  };

  const handleEditar = (articulo) => {
    console.log("Editar:", articulo);
    // Implementar después
  };

  const handleDevolver = (idArticulo, data) => {
    console.log("Devolver:", idArticulo, data);
    // Aquí iría la llamada a la API
    // Actualizar el artículo en el estado local
    setSnackbar({
      open: true,
      message: "Artículo devuelto correctamente",
      severity: "success",
    });
  };

  const handleBaja = (idArticulo, data) => {
    console.log("Dar de baja:", idArticulo, data);
    // Aquí iría la llamada a la API
    // Actualizar el artículo en el estado local
    setSnackbar({
      open: true,
      message: "Artículo dado de baja correctamente",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        mt: 6,
        px: 2,
      }}
    >
      {/* Título */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: COLOR_TEXTO,
            fontWeight: 600,
            fontSize: "1.125rem",
            mb: 0.5,
          }}
        >
          Gestión de Inventario
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: colors.grey[400], fontSize: "0.875rem" }}
        >
          Control y administración de activos de la empresa
        </Typography>
      </Box>

      {/* FILTROS */}
      <InventoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categorias={categorias}
        plazas={plazas}
        totalItems={inventory.length}
        filteredCount={filteredInventory.length}
        loading={loading}
      />

      {/* DASHBOARD */}
      {!loading && !error && dashboardData.length > 0 && (
        <InventoryDashboard data={dashboardData} />
      )}

      {/* TABS DINÁMICOS - SOLO CON DATOS */}
      {tabsConfig.length > 1 && (
        <Box
          sx={{ borderBottom: 1, borderColor: colors.borderContainer, mb: 3 }}
        >
          <Tabs
            value={tabActiva}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                color: COLOR_TEXTO,
                fontWeight: 500,
                fontSize: "0.875rem",
                textTransform: "none",
                minHeight: 48,
              },
              "& .Mui-selected": {
                color: `${getColorTabActiva()} !important`,
                fontWeight: 600,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: getColorTabActiva(),
              },
            }}
          >
            {tabsConfig.map((tab, index) => (
              <Tab
                key={tab.key}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography component="span">{tab.label}</Typography>
                    <Chip
                      label={tab.count}
                      size="small"
                      sx={{
                        backgroundColor: colors.bgContainerSticky,
                        color: tabActiva === index ? tab.color : COLOR_TEXTO,
                        fontSize: "0.7rem",
                        height: 20,
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>
      )}

      {/* CONTENIDO PRINCIPAL */}
      {loading ? (
        <InventorySkeleton />
      ) : error ? (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            bgcolor: colors.redAccent[400] + "20",
            color: colors.redAccent[400],
          }}
        >
          {error}
        </Alert>
      ) : (
        <Grow in={true} timeout={400}>
          <Box>
            <InventoryList
              data={filteredInventory}
              onVerDetalle={handleVerDetalle}
              onGestionar={handleGestionar}  
              onEditar={handleEditar}
              // onBaja ya no se necesita, se maneja en onGestionar
            />
          </Box>
        </Grow>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Modales */}
      <InventoryDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        articulo={selectedArticulo}
      />

      <InventoryManageDialog
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        articulo={selectedArticulo}
        onDevolver={handleDevolver}
        onBaja={handleBaja}
        // Las funciones de reasignación se manejarán internamente
      />
    </Box>
  );
};

export default Index;