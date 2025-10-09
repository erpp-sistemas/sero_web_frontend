// src/pages/HomeCoordination/Index.jsx
import React, { useState, useEffect, useRef } from "react";
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

  console.log(user)

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

  // 🔹 Referencia a datos previos para animaciones
  const prevDashboardData = useRef([]);

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
        prevDashboardData.current = dashboardData; // Guardamos el anterior
        setDashboardData([]);
        setError("No se encontraron datos para los filtros seleccionados.");
      } else {
        prevDashboardData.current = dashboardData; // Guardamos el anterior
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

  const latestMessage = messages.find(
    (msg) => msg.type === "on-register-form-dynamic-changed"
  );
  if (!latestMessage) return;

  const payload = latestMessage.payload || {};
  const innerData = payload.data || {};

  const cuenta = innerData.cuenta || innerData.account || null;
  const fecha = innerData.data?.fecha || innerData.fecha || null;

  const { plazaId, servicioId, procesoId } = filters;
  if (!cuenta || !fecha || !plazaId || !servicioId || !procesoId) return;

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

        // 🔹 Evitar duplicados por "cuenta" + "date_capture"
        setDashboardData((prev) => {
          const existingKeys = new Set(prev.map((d) => d.cuenta + d.date_capture));
          const newUnique = formattedData.filter(
            (item) => !existingKeys.has(item.cuenta + item.date_capture)
          );
          // 🔹 Actualizamos prevDashboardData antes de setear el nuevo estado
          prevDashboardData.current = prev;
          return [...newUnique, ...prev];
        });

        console.log(`✅ ${formattedData.length} nuevos registros procesados`);
      }
    } catch (err) {
      console.error("❌ Error al traer datos desde WS:", err);
    }
  };

  fetchWSData();
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
          <KpiCards data={dashboardData} prevData={prevDashboardData.current} />
          <GestoresTable data={dashboardData} prevData={prevDashboardData.current} />
          <DashboardMapLayout data={dashboardData} prevData={prevDashboardData.current} />
          <PerformanceIndicators data={dashboardData} prevData={prevDashboardData.current} />
          <QuickAlerts data={dashboardData} prevData={prevDashboardData.current} />
        </>
      )}
    </Box>
  );
}

export default Index;
