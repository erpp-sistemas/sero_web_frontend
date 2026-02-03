// src/pages/HomeCoordination/Index.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import WelcomeHeader from "../../components/CoordinatorMonitor/WelcomeHeader";
import FilterBar from "../../components/CoordinatorMonitor/FilterBar";
import DashboardSkeleton from "../../components/PaymentValidation/DashboardSkeleton";

import CoordinatorKpiCards from "../../components/CoordinatorMonitor/CoordinatorKpiCards";
import CriticalAlerts from "../../components/CoordinatorMonitor/CriticalAlerts";
import PerformanceMonitor from "../../components/CoordinatorMonitor/PerformanceMonitor";

import { coordinatorMonitorResultsRequest } from "../../api/coordination";
import { Box, Typography, Alert, Snackbar, useTheme } from "@mui/material";
import { tokens } from "../../theme";

function Index() {
  const user = useSelector((state) => state.user);
  const colors = tokens(useTheme().palette.mode);

  const [filters, setFilters] = useState({
    plazaId: null,
    servicioId: null,
    procesoId: null,
    fechaInicio: new Date().toISOString().split("T")[0],
    fechaFin: new Date().toISOString().split("T")[0],
  });

  // 🔹 Separamos los dos arrays en estados diferentes
  const [registerResult, setRegisterResult] = useState([]); // Array detallado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 🔹 Manejo de filtros y petición al backend
  const handleFilterChange = async (values) => {
    setFilters(values);

    if (!values.plazaId || !values.servicioId || !values.procesoId) return;

    try {
      setLoading(true);
      setError(null);
      setRegisterResult([]);

      const response = await coordinatorMonitorResultsRequest(
        values.plazaId,
        values.servicioId,
        values.procesoId,
        values.fechaInicio,
        values.fechaFin,
      );

      if (response.data) {
        // 🔹 Separamos los dos arrays de la respuesta
        const registerResultData = response.data || [];

        setRegisterResult(registerResultData);
        const totalRegister = registerResultData.length;

        setSnackbar({
          open: true,
          message: `Datos cargados: ${totalRegister} registros`,
          severity: "success",
        });
      } else {
        setError("No se recibieron datos del servidor");
        setSnackbar({
          open: true,
          message: "No se encontraron datos para los filtros seleccionados",
          severity: "warning",
        });
      }
    } catch (err) {
      console.error("Error en la petición:", err);

      let errorMessage = "Error al cargar los datos";

      if (err.response) {
        errorMessage =
          err.response.data?.message ||
          `Error ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "No se pudo conectar con el servidor";
      } else {
        errorMessage = err.message || "Error desconocido";
      }

      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // ⏱️ desaparece a los 5 segundos

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return; // evita cierre por click fuera
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className="p-4">
      <WelcomeHeader />
      <FilterBar
        plazas={user.place_service_process}
        onChange={handleFilterChange}
        isLoading={loading}
      />

      {loading && <DashboardSkeleton />}

      {/* Estado de carga */}
      {loading && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: colors.grey[200] }}>
            Cargando datos...
          </Typography>
        </Box>
      )}

      {/* Estado de error */}
      {error && !loading && (
        <Alert severity="error" sx={{ mt: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Área para componentes del dashboard */}
      {registerResult.length > 0 && !loading && (
        <Box sx={{ mt: 4 }}>
          
          <CoordinatorKpiCards data={registerResult} />          
          <PerformanceMonitor data={registerResult} />
          {/* Aquí irán los componentes que vamos a agregar: */}
          {/* - KPI Cards */}
          {/* - Tablas de datos */}
          {/* - Gráficos */}
          {/* - Mapas */}
          {/* - etc. */}

          {/* <Box sx={{ p: 3, textAlign: 'center', backgroundColor: colors.primary[400], borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: colors.grey[200], mb: 2 }}>
              Dashboard de Validación de Pagos
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              Listo para agregar componentes con {pagosValidos.length} pagos detallados y {pagosFormateados.length} registros resumidos
            </Typography>
          </Box> */}
        </Box>
      )}

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
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
    </Box>
  );
}

export default Index;
