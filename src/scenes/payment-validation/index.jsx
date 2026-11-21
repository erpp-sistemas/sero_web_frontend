// src/scenes/payment-validation/index.jsx
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import FilterBar from "../../components/PaymentValidation/FilterBar";
import DashboardSkeleton from "../../components/PaymentValidation/DashboardSkeleton";
import ResumenGeneral from "../../components/PaymentValidation/ResumenGeneral";
import IndicadoresGestion from "../../components/PaymentValidation/IndicadoresGestion";
import ResumenEstatusGestion from "../../components/PaymentValidation/ResumenEstatusGestion";
import DistribucionMontosPorEstatus from "../../components/PaymentValidation/DistribucionMontosPorEstatus";
import { aplicarCambioFoto } from "../../components/PaymentValidation/Shared/fotoRules";
import { paymentValidationResultsRequest } from "../../api/payment";
import { Box, Typography, Alert, Snackbar, useTheme } from "@mui/material";
import { tokens } from "../../theme";

function Index() {
  const user = useSelector((state) => state.user);
  const colors = tokens(useTheme().palette.mode);

  const [filters, setFilters] = useState({
    plazaId: null,
    servicioId: null,
    procesoId: null,
    diasRango: 60,
    fechaInicio: new Date().toISOString().split("T")[0],
    fechaFin: new Date().toISOString().split("T")[0],
  });

  // Ambos formatos se actualizan juntos después de una operación de fotos.
  const [{ pagosValidos, pagosFormateados }, setDatosPagos] = useState({
    pagosValidos: [],
    pagosFormateados: [],
  });
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
      setDatosPagos({ pagosValidos: [], pagosFormateados: [] });

      const response = await paymentValidationResultsRequest(
        values.plazaId,
        values.servicioId,
        values.procesoId,
        values.diasRango,
        values.fechaInicio,
        values.fechaFin,
      );

      if (response.data) {
        const pagosValidosData = response.data[0].pagos_validos || [];
        const pagosFormateadosData =
          response.data[0].pagos_validos_formated || [];

        const detalle = JSON.parse(pagosValidosData);
        const resumen = JSON.parse(pagosFormateadosData);

        if (import.meta.env.DEV) {
          console.groupCollapsed("[Pagos válidos] Diagnóstico de datos y fotografías");
          console.log("Filtros de la consulta:", values);
          console.log("Campos de la respuesta:", Object.keys(response.data[0]));
          console.log("Detalle completo (incluye el campo fotos):", detalle);
          console.log("Resumen completo:", resumen);
          console.log("Campos del detalle:", [
            ...new Set(detalle.flatMap((registro) => Object.keys(registro))),
          ]);
          const registrosValidos = detalle.filter(
            (registro) =>
              registro["estatus de gestion valida"] === "Gestión válida" &&
              registro.evaluacion_periodos === "PERIODO_VALIDO",
          );
          const gruposFotos = new Map();
          const gestiones = new Set();
          registrosValidos.forEach((registro) => {
            const clave = JSON.stringify([
              registro["foto fachada predio"],
              registro["foto evidencia predio"],
            ]);
            const grupo = gruposFotos.get(clave) || {
              fachada: registro["foto fachada predio"],
              evidencia: registro["foto evidencia predio"],
              registros: 0,
              ejemplo: registro,
            };
            grupo.registros++;
            gruposFotos.set(clave, grupo);
            gestiones.add(JSON.stringify([
              registro.cuenta,
              registro.fecha_de_gestion,
            ]));
          });
          console.table(
            [...gruposFotos.values()].map((grupo) => ({ fachada: grupo.fachada, evidencia: grupo.evidencia, registros: grupo.registros })),
          );
          console.log("Muestra para revisión:", JSON.stringify({
            totalDetalle: detalle.length,
            registrosValidos: registrosValidos.length,
            combinacionesCuentaFecha: gestiones.size,
            // Una muestra por combinación de banderas, sin descartar campos.
            muestrasDetalle: [...gruposFotos.values()].map((grupo) => grupo.ejemplo),
            muestrasResumen: resumen.slice(0, 2),
          }, null, 2));
          console.groupEnd();
        }

        setDatosPagos({ pagosValidos: detalle, pagosFormateados: resumen });

        const totalPagos = detalle.length;
        const totalResumen = resumen.length;

        setSnackbar({
          open: true,
          message: `Datos cargados: ${totalPagos} pagos detallados y ${totalResumen} registros resumidos`,
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
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Una operación confirmada actualiza ambos formatos con las mismas reglas de fotos.
  // Los importes, períodos, fechas de gestión y estatus se conservan íntegros.
  const onUpdatePago = useCallback((cambio) => {
    setDatosPagos((prev) => ({
      pagosValidos: aplicarCambioFoto(prev.pagosValidos, cambio),
      pagosFormateados: aplicarCambioFoto(prev.pagosFormateados, cambio),
    }));
  }, []);

  return (
    <Box className="p-4">
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
      {(pagosValidos.length > 0 || pagosFormateados.length > 0) && !loading && (
        <Box sx={{ mt: 4 }}>
          <ResumenGeneral
            pagosValidos={pagosValidos}
            pagosFormateados={pagosFormateados}
          />
          <IndicadoresGestion
            pagosValidos={pagosValidos}
            placeId={filters.plazaId}
            servicioId={filters.servicioId}
            userIdSession={user?.user_id || null}
            onUpdatePago={onUpdatePago}
          />
          <ResumenEstatusGestion pagosValidos={pagosValidos} />
          <DistribucionMontosPorEstatus pagosValidos={pagosValidos} />
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
