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

const Index = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ============================================
  // ESTADOS
  // ============================================
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [dashboardData, setDashboardData] = useState([]); // Datos para el dashboard (con filtros)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabActiva, setTabActiva] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Estados para filtros
  const [filters, setFilters] = useState({
    busqueda: "",
    categoria: "todos",
    plaza: "todos",
  });

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
          .filter(item => item && typeof item === "object")
          .map(item => ({
            ...item,
            estado_calculado: !item.id_usuario && item.activo !== false ? "disponible" :
                              item.activo === false ? "baja" :
                              item.condicion_actual === "malo" ? "mantenimiento" :
                              "asignado",
            fotos: Array.isArray(item.fotos) ? item.fotos : [],
          }));

        setInventory(processedData);
        setFilteredInventory(processedData);
        setDashboardData(processedData); // Inicialmente todos los datos

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
    const unique = new Set(inventory.map(item => item.categoria).filter(Boolean));
    return ["todos", ...Array.from(unique).sort()];
  }, [inventory]);

  const plazas = useMemo(() => {
    const unique = new Set(inventory.map(item => item.plaza).filter(Boolean));
    return ["todos", ...Array.from(unique).sort()];
  }, [inventory]);

  // ============================================
  // ESTADOS DINÁMICOS
  // ============================================
  const estadosDisponibles = useMemo(() => {
    const estados = new Set();
    inventory.forEach(item => {
      if (item.activo === false) estados.add("baja");
      else if (item.condicion_actual === "malo") estados.add("mantenimiento");
      else if (item.id_usuario) estados.add("asignado");
      else estados.add("disponible");
    });
    return Array.from(estados).sort();
  }, [inventory]);

  // ============================================
  // CONFIGURACIÓN DE TABS
  // ============================================
  const tabsConfig = useMemo(() => {
    const config = [
      {
        key: "todos",
        label: "Todos",
        color: COLOR_TAB_ACTIVA,
        filter: () => true
      }
    ];

    if (estadosDisponibles.includes("disponible")) {
      config.push({
        key: "disponible",
        label: "Disponibles",
        color: colors.accentGreen[100],
        filter: (item) => !item.id_usuario && item.activo !== false
      });
    }
    if (estadosDisponibles.includes("asignado")) {
      config.push({
        key: "asignado",
        label: "Asignados",
        color: colors.blueAccent[400],
        filter: (item) => item.id_usuario && item.activo !== false && item.condicion_actual !== "malo"
      });
    }
    if (estadosDisponibles.includes("mantenimiento")) {
      config.push({
        key: "mantenimiento",
        label: "Mantenimiento",
        color: colors.yellowAccent[400],
        filter: (item) => item.condicion_actual === "malo" && item.activo !== false
      });
    }
    if (estadosDisponibles.includes("baja")) {
      config.push({
        key: "baja",
        label: "Dados de baja",
        color: colors.redAccent[400],
        filter: (item) => item.activo === false
      });
    }

    return config;
  }, [estadosDisponibles, colors, COLOR_TAB_ACTIVA]);

  // ============================================
  // CONTEO POR ESTADO
  // ============================================
  const counts = useMemo(() => {
    const result = { todos: inventory.length };
    tabsConfig.forEach(tab => {
      if (tab.key !== "todos") {
        result[tab.key] = inventory.filter(tab.filter).length;
      }
    });
    return result;
  }, [inventory, tabsConfig]);

  // ============================================
  // FUNCIONES DE FILTRADO (AHORA ACTUALIZAN DASHBOARD)
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
    
    // Aplicar todos los filtros para la lista
    if (currentFilters.busqueda) {
      const busquedaLower = currentFilters.busqueda.toLowerCase();
      filtered = filtered.filter(item =>
        item.nombre_articulo?.toLowerCase().includes(busquedaLower) ||
        item.folio?.toLowerCase().includes(busquedaLower) ||
        item.numero_serie?.toLowerCase().includes(busquedaLower) ||
        item.marca?.toLowerCase().includes(busquedaLower)
      );
    }
    
    if (currentFilters.categoria !== "todos") {
      filtered = filtered.filter(item => item.categoria === currentFilters.categoria);
    }
    
    if (currentFilters.plaza !== "todos") {
      filtered = filtered.filter(item => item.plaza === currentFilters.plaza);
    }
    
    if (currentTab > 0) {
      const tabConfig = tabsConfig[currentTab];
      if (tabConfig) {
        filtered = filtered.filter(tabConfig.filter);
      }
    }
    
    // Actualizar lista filtrada
    setFilteredInventory(filtered);

    // Para el dashboard, aplicamos SOLO los filtros de búsqueda, categoría y plaza
    // (NO el filtro de tab, para que el dashboard muestre el panorama general)
    let dashboardFiltered = [...inventory];
    
    if (currentFilters.busqueda) {
      const busquedaLower = currentFilters.busqueda.toLowerCase();
      dashboardFiltered = dashboardFiltered.filter(item =>
        item.nombre_articulo?.toLowerCase().includes(busquedaLower) ||
        item.folio?.toLowerCase().includes(busquedaLower) ||
        item.numero_serie?.toLowerCase().includes(busquedaLower) ||
        item.marca?.toLowerCase().includes(busquedaLower)
      );
    }
    
    if (currentFilters.categoria !== "todos") {
      dashboardFiltered = dashboardFiltered.filter(item => item.categoria === currentFilters.categoria);
    }
    
    if (currentFilters.plaza !== "todos") {
      dashboardFiltered = dashboardFiltered.filter(item => item.plaza === currentFilters.plaza);
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
  // MANEJADORES DE ACCIONES
  // ============================================
  const handleVerDetalle = (articulo) => {
    console.log("Ver detalle:", articulo);
  };

  const handleAsignar = (articulo) => {
    console.log("Asignar:", articulo);
  };

  const handleEditar = (articulo) => {
    console.log("Editar:", articulo);
  };

  const handleBaja = (articulo) => {
    console.log("Dar de baja:", articulo);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden", mt: 6, px: 2 }}>
      {/* Título - mismo estilo que PerformanceMonitor */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: COLOR_TEXTO, fontWeight: 600, fontSize: "1.125rem", mb: 0.5 }}>
          Gestión de Inventario
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400], fontSize: "0.875rem" }}>
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

      {/* DASHBOARD - Reactivo a filtros */}
      {!loading && !error && dashboardData.length > 0 && (
        <InventoryDashboard data={dashboardData} />
      )}

      {/* TABS DINÁMICOS */}
      <Box sx={{ borderBottom: 1, borderColor: colors.borderContainer, mb: 3 }}>
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
                    label={counts[tab.key] || 0}
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

      {/* CONTENIDO PRINCIPAL */}
      {loading ? (
        <InventorySkeleton />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2, bgcolor: colors.redAccent[400] + "20", color: colors.redAccent[400] }}>
          {error}
        </Alert>
      ) : (
        <Grow in={true} timeout={400}>
          <Box>
            <InventoryList
              data={filteredInventory}
              onVerDetalle={handleVerDetalle}
              onAsignar={handleAsignar}
              onEditar={handleEditar}
              onBaja={handleBaja}
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Index;