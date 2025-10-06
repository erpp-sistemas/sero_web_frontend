import React, { useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  useTheme,
  Stack,
} from "@mui/material";
import { tokens } from "../../theme";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import { NoPhotographyOutlined, PhotoCameraOutlined } from "@mui/icons-material";

const QuickAlerts = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const alerts = useMemo(() => {
    if (!data.length)
      return {
        gestionesSinFoto: [],
        prediosNoLocalizados: [],
        promedioTiempoAlto: [],
        maxDiferencia: [],
      };

    const grouped = {};

    data.forEach((item) => {
      const key = item.person_who_capture;
      if (!grouped[key]) {
        grouped[key] = {
          person: key,
          photo: item.photo_person_who_capture,
          total: 0,
          gestiones_sin_foto: 0,
          predios_no_localizados: 0,
          date_captures: [],
        };
      }
      grouped[key].total += 1;
      grouped[key].gestiones_sin_foto += item.total_photos === 0 ? 1 : 0;
      grouped[key].predios_no_localizados +=
        item.property_status !== "Predio localizado" ? 1 : 0;
      grouped[key].date_captures.push(new Date(item.date_capture));
    });

    const processed = Object.values(grouped).map((g) => {
      const sortedDates = g.date_captures.sort((a, b) => a - b);
      let totalDiff = 0;
      let maxDiff = 0;

      for (let i = 1; i < sortedDates.length; i++) {
        const diff = (sortedDates[i] - sortedDates[i - 1]) / 60000; // minutos
        totalDiff += diff;
        maxDiff = Math.max(maxDiff, diff);
      }

      const avgDiff =
        sortedDates.length > 1 ? totalDiff / (sortedDates.length - 1) : 0;

      return { ...g, avgDiff, maxDiff };
    });

    const getMaxGestores = (key) => {
      const valores = processed.map((g) => g[key]);
      const maxValue = Math.max(...valores);
      return maxValue > 0
        ? processed.filter((g) => g[key] === maxValue)
        : [];
    };

    return {
      gestionesSinFoto: getMaxGestores("gestiones_sin_foto"),
      prediosNoLocalizados: getMaxGestores("predios_no_localizados"),
      promedioTiempoAlto: getMaxGestores("avgDiff"),
      maxDiferencia: getMaxGestores("maxDiff"),
    };
  }, [data]);

  const renderCard = (icon, title, gestores, valueKey) => {
    if (!gestores?.length) return null;

    return (
      <Card
        sx={{
          flex: "1 1 300px",
          minWidth: "260px",
          maxWidth: "100%",
          padding: 2,
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          backgroundColor: colors.bgContainerSecondary,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          
          borderRadius: 2,
          transition: "transform 0.2s ease",
          "&:hover": { transform: "translateY(-4px)" },
        }}
      >
        <Box
          sx={{
            mt: 0.5,
            color: colors.grey[300],
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography
            variant="caption"
            color={colors.grey[400]}
            sx={{ mb: 0.5, fontWeight: 600 }}
          >
            {title}
          </Typography>

          <Stack direction="column" spacing={0.5}>
            {gestores.map((g) => (
              <Stack
                key={g.person}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Avatar
                  src={g.photo}
                  alt={g.person}
                  sx={{ width: 28, height: 28 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 0.3,
                  }}
                >
                  {g.person}
                  <Typography
                    component="span"
                    variant="caption"
                    color={colors.grey[400]}
                  >
                    (
                    {valueKey === "avgDiff" || valueKey === "maxDiff"
                      ? `${Math.round(g[valueKey])}m`
                      : g[valueKey]}
                    )
                  </Typography>
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Card>
    );
  };

  if (!data.length) return null;

  return (
    <Box sx={{ width: "100%", marginTop: 3 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          fontSize: "1.05rem",
          color: colors.grey[100],
        }}
      >
        Alertas rápidas
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          width: "100%",
          justifyContent: "flex-start",
          [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
          },
        }}
      >
        {renderCard(
          <NoPhotographyOutlined />,
          "Gestores con más gestiones sin foto",
          alerts.gestionesSinFoto,
          "gestiones_sin_foto"
        )}
        {renderCard(
          <LocationOffIcon />,
          "Gestores con más predios no localizados",
          alerts.prediosNoLocalizados,
          "predios_no_localizados"
        )}
        {renderCard(
          <AccessTimeIcon />,
          "Gestores con mayor tiempo promedio entre gestiones",
          alerts.promedioTiempoAlto,
          "avgDiff"
        )}
        {renderCard(
          <TimerOffIcon />,
          "Gestores con mayor diferencia entre gestiones",
          alerts.maxDiferencia,
          "maxDiff"
        )}
      </Box>
    </Box>
  );
};

export default QuickAlerts;
