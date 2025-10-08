// src/components/HomeCoordination/PerformanceIndicators.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Box, Card, Typography, Avatar, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const PerformanceIndicators = ({ data = [], prevData = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 🔹 Calculamos top/bottom 3
  const { topGestores, bottomGestores } = useMemo(() => {
    const groupedCurrent = {};
    const groupedPrev = {};

    data.forEach((item) => {
      const key = item.person_who_capture;
      if (!groupedCurrent[key]) {
        groupedCurrent[key] = { person: key, photo: item.photo_person_who_capture, total: 0 };
      }
      groupedCurrent[key].total += 1;
    });

    prevData.forEach((item) => {
      const key = item.person_who_capture;
      if (!groupedPrev[key]) {
        groupedPrev[key] = { total: 0 };
      }
      groupedPrev[key].total += 1;
    });

    const sorted = Object.values(groupedCurrent).sort((a, b) => b.total - a.total);

    return {
      topGestores: sorted.slice(0, 3),
      bottomGestores: sorted.slice(-3).reverse(),
    };
  }, [data, prevData]);

  // 🔹 Estado para resaltar cambios
  const [highlightMap, setHighlightMap] = useState({});

  useEffect(() => {
    const newHighlight = {};

    const groupedPrev = {};
    prevData.forEach((item) => {
      const key = item.person_who_capture;
      if (!groupedPrev[key]) groupedPrev[key] = { total: 0 };
      groupedPrev[key].total += 1;
    });

    [...topGestores, ...bottomGestores].forEach((gestor) => {
      const prevTotal = groupedPrev[gestor.person]?.total || 0;
      if (gestor.total > prevTotal) newHighlight[gestor.person] = "up";
      else if (gestor.total < prevTotal) newHighlight[gestor.person] = "down";
    });

    setHighlightMap(newHighlight);

    const timeout = setTimeout(() => setHighlightMap({}), 1000);
    return () => clearTimeout(timeout);
  }, [topGestores, bottomGestores, prevData]);

  const renderCard = (gestor, type, index) => {
    const highlight = highlightMap[gestor.person];
    const bgColor =
      highlight === "up"
        ? "rgba(74, 222, 128, 0.15)" // verde suave
        : highlight === "down"
        ? "rgba(255, 99, 72, 0.15)" // rojo suave
        : colors.bgContainerSecondary;

    return (
      <Card
        key={gestor.person}
        sx={{
          flex: "1 1 280px",
          minWidth: "260px",
          maxWidth: "100%",
          margin: 1,
          padding: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: bgColor,
          boxShadow: highlight ? "0 4px 12px rgba(0,0,0,0.12)" : "0 1px 4px rgba(0,0,0,0.08)",
          borderRadius: 2,
          transition: "all 0.3s ease-in-out",
          transform: highlight ? "scale(1.03)" : "scale(1)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            width: 16,
            textAlign: "center",
            color: colors.grey[400],
          }}
        >
          {index + 1}
        </Typography>

        {type === "top" ? (
          <ArrowUpwardIcon
            sx={{
              fontSize: index === 0 ? 28 : 24,
              color: colors.accentGreen[200],
            }}
          />
        ) : (
          <ArrowDownwardIcon
            sx={{
              fontSize: index === 0 ? 28 : 24,
              color: colors.redAccent[500],
            }}
          />
        )}

        <Avatar src={gestor.photo} alt={gestor.person} sx={{ width: 44, height: 44 }} />

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
            {gestor.person}
          </Typography>
          <Typography variant="body2" color={colors.grey[400]}>
            {gestor.total} gestiones
          </Typography>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5, mt: 4 }}>
      <Box>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600, fontSize: "1.05rem", color: colors.grey[100] }}
        >
          Top 3 gestores con más gestiones
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            gap: 2,
            [theme.breakpoints.down("sm")]: { justifyContent: "center" },
          }}
        >
          {topGestores.map((g, i) => renderCard(g, "top", i))}
        </Box>
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600, fontSize: "1.05rem", color: colors.grey[100] }}
        >
          Top 3 gestores con menos gestiones
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            gap: 2,
            [theme.breakpoints.down("sm")]: { justifyContent: "center" },
          }}
        >
          {bottomGestores.map((g, i) => renderCard(g, "bottom", i))}
        </Box>
      </Box>
    </Box>
  );
};

export default PerformanceIndicators;
