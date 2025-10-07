// src/pages/HomeCoordination/Index.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WelcomeHeader from "../../components/HomeCoordination/WelcomeHeader";
import FilterBar from "../../components/HomeCoordination/FilterBar";
import {
  homeCoordinationRequest,
  homeCoordinationWSRequest,
} from "../../api/coordination";
import { Box, Typography, Skeleton, Grid, Card, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import KpiCards from "../../components/HomeCoordination/KpiCards";
import GestoresTable from "../../components/HomeCoordination/GestoresTable";
import PerformanceIndicators from "../../components/HomeCoordination/PerformanceIndicators";
import QuickAlerts from "../../components/HomeCoordination/QuickAlerts";
import DashboardMapLayout from "../../components/HomeCoordination/DashboardMapLayout";
import { cleanMessages } from "../../redux/socketSlice";

function Index() {
  const user = useSelector((state) => state.user);
  const messages = useSelector((state) => state.webSocket.messages);
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [filters, setFilters] = useState({
    plazaId: null,
    servicioId: null,
    procesoId: null,
  });

  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Manejo de filtros
  const handleFilterChange = async (values) => {
    setFilters(values);

    if (!values.plazaId || !values.servicioId || !values.procesoId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await homeCoordinationRequest(
        values.plazaId,
        values.servicioId,
        values.procesoId
      );

      if (!response.data || response.data.length === 0) {
        setDashboardData([]);
        setError("No se encontraron datos para los filtros seleccionados.");
      } else {
        const formattedData = response.data.map((item) => ({
          ...item,
          date_capture: item.date_capture
            ? item.date_capture.replace("T", " ").substring(0, 19)
            : null,
        }));
        setDashboardData(formattedData);
        setError(null);
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message || "Error en la solicitud al servidor."
        );
      } else if (err.request) {
        setError("No hubo respuesta del servidor. Intenta de nuevo.");
      } else {
        setError("Error al realizar la solicitud.");
      }
      console.error("AxiosError:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Skeleton Loader
  const DashboardSkeleton = () => (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: "none" }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={60}
                sx={{ mt: 1, borderRadius: 2 }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ mb: 1, borderRadius: 1 }}
          />
        ))}
      </Box>
    </Box>
  );

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    // Filtramos solo los mensajes de registro dinámico
    const latestMessage = messages.find(
      (msg) => msg.type === "on-register-form-dynamic-changed"
    );

    if (!latestMessage) return;

    console.log("📡 WS recibido:", latestMessage);

    const payload = latestMessage.payload || {};
    const innerData = payload.data || {};

    const cuenta = innerData.cuenta || innerData.account || null;
    const fecha = innerData.data?.fecha || innerData.fecha || null;

    const { plazaId, servicioId, procesoId } = filters;

    if (!cuenta || !fecha) return;
    if (!plazaId || !servicioId || !procesoId) return;

    const fetchWSData = async () => {
      try {
        const response = await homeCoordinationWSRequest(
          plazaId,
          servicioId,
          procesoId,
          cuenta,
          fecha
        );

        if (response.data && response.data.length > 0) {
          const formattedData = response.data.map((item) => ({
            ...item,
            date_capture: item.date_capture
              ? item.date_capture.replace("T", " ").substring(0, 19)
              : null,
          }));

          setDashboardData((prev) => [...formattedData, ...prev]);
          console.log(`✅ ${formattedData.length} nuevos registros agregados`);
        }
      } catch (err) {
        console.error("❌ Error al traer datos desde WS:", err);
      }
    };

    fetchWSData();

    // Limpiar solo los mensajes que ya procesamos
    dispatch(cleanMessages());
  }, [messages, filters, dispatch]);

  return (
    <Box className="p-4">
      <WelcomeHeader userName={user.name} role={user.profile} />
      <FilterBar
        plazas={user.place_service_process}
        onChange={handleFilterChange}
      />

      {loading && <DashboardSkeleton />}

      {!loading && error && (
        <Typography
          sx={{
            mt: 4,
            textAlign: "center",
            color: colors.grey[200],
          }}
        >
          {error}
        </Typography>
      )}

      {!loading && !error && dashboardData.length > 0 && (
        <>
          <KpiCards data={dashboardData} />
          <GestoresTable data={dashboardData} />
          <DashboardMapLayout data={dashboardData} />
          <PerformanceIndicators data={dashboardData} />
          <QuickAlerts data={dashboardData} />
        </>
      )}
    </Box>
  );
}

export default Index;
