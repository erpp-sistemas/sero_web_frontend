import React, { useEffect, useState, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme, Box, Avatar, Typography, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const GestoresTable = ({ data = [], prevData = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [highlightMap, setHighlightMap] = useState({});
  const prevRowsRef = useRef([]);

  // 🔹 Calcula métricas de un solo gestor
  const calculateGestorMetrics = (gestorData) => {
    const sortedDates = gestorData
      .map((item) => new Date(item.date_capture))
      .sort((a, b) => a - b);

    let totalDiff = 0;
    let maxDiff = 0;
    let minDiff = sortedDates.length > 1 ? Infinity : 0;

    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (sortedDates[i] - sortedDates[i - 1]) / 60000;
      totalDiff += diff;
      maxDiff = Math.max(maxDiff, diff);
      minDiff = Math.min(minDiff, diff);
    }

    const avgDiff =
      sortedDates.length > 1 ? totalDiff / (sortedDates.length - 1) : 0;

    const firstGestion = sortedDates[0]
      ? sortedDates[0].toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

    const lastGestion = sortedDates[sortedDates.length - 1]
      ? sortedDates[sortedDates.length - 1].toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

    const gestiones_con_foto = gestorData.filter(
      (i) => i.total_photos > 0
    ).length;
    const gestiones_sin_foto = gestorData.length - gestiones_con_foto;
    const predios_localizados = gestorData.filter(
      (i) => i.property_status === "Predio localizado"
    ).length;
    const predios_no_localizados = gestorData.length - predios_localizados;

    return {
      person_who_capture: gestorData[0].person_who_capture,
      photo_person_who_capture: gestorData[0].photo_person_who_capture,
      total_gestiones: gestorData.length,
      gestiones_con_foto,
      gestiones_sin_foto,
      predios_localizados,
      predios_no_localizados,
      first_gestion: firstGestion,
      last_gestion: lastGestion,
      avg_time_between: avgDiff ? `${Math.round(avgDiff)}m` : "-",
      max_diff: maxDiff ? `${Math.round(maxDiff)}m` : "-",
      min_diff:
        minDiff && minDiff !== Infinity ? `${Math.round(minDiff)}m` : "-",
    };
  };

  // 🔹 Actualiza solo gestor afectado y lo mueve arriba
  useEffect(() => {
    if (!data || data.length === 0) return;

    const groupedData = {};
    data.forEach((item) => {
      if (!groupedData[item.person_who_capture])
        groupedData[item.person_who_capture] = [];
      groupedData[item.person_who_capture].push(item);
    });

    // Si no hay filas previas, calculamos todo
    if (rows.length === 0) {
      const allRows = Object.values(groupedData).map(calculateGestorMetrics);
      setRows(allRows);
      prevRowsRef.current = allRows;
      return;
    }

    const updatedRows = [...rows];
    const newHighlight = {};
    let lastUpdatedGestor = null;

    // Detectar cuál gestor cambió (comparando con prevData)
    Object.keys(groupedData).forEach((gestor) => {
      const newMetrics = calculateGestorMetrics(groupedData[gestor]);
      const prevRow = prevRowsRef.current.find(
        (r) => r.person_who_capture === gestor
      );

      const changed =
        !prevRow ||
        prevRow.total_gestiones !== newMetrics.total_gestiones ||
        prevRow.gestiones_con_foto !== newMetrics.gestiones_con_foto ||
        prevRow.gestiones_sin_foto !== newMetrics.gestiones_sin_foto ||
        prevRow.predios_localizados !== newMetrics.predios_localizados ||
        prevRow.predios_no_localizados !== newMetrics.predios_no_localizados ||
        prevRow.last_gestion !== newMetrics.last_gestion;

      if (changed) {
        newHighlight[gestor] = true;
        lastUpdatedGestor = gestor;
        const index = updatedRows.findIndex(
          (r) => r.person_who_capture === gestor
        );
        if (index !== -1) updatedRows[index] = newMetrics;
      }
    });

    // 🔹 Mover fila actualizada arriba
    if (lastUpdatedGestor) {
      const index = updatedRows.findIndex(
        (r) => r.person_who_capture === lastUpdatedGestor
      );
      const [movedRow] = updatedRows.splice(index, 1);
      updatedRows.unshift(movedRow);
    }

    setRows(updatedRows);
    setHighlightMap(newHighlight);
    prevRowsRef.current = updatedRows;

    const timeout = setTimeout(() => setHighlightMap({}), 2000);
    return () => clearTimeout(timeout);
  }, [data]);

  const columns = [
    {
      field: "person_who_capture",
      headerName: "Gestor",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={params.row.photo_person_who_capture}
            alt={params.row.person_who_capture}
            sx={{ width: 32, height: 32 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.row.person_who_capture}
          </Typography>
        </Box>
      ),
    },
    {
      field: "total_gestiones",
      headerName: "Total gestiones",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Typography
          sx={{
            color: highlightMap[params.row.person_who_capture]
              ? "#4ade80"
              : "inherit",
            transition: "color 0.5s ease",
            fontWeight: highlightMap[params.row.person_who_capture]
              ? 600
              : "normal",
          }}
        >
          {params.row.total_gestiones}
        </Typography>
      ),
    },
    {
      field: "gestiones_foto",
      headerName: "Con / Sin foto",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const { gestiones_con_foto, gestiones_sin_foto } = params.row;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title={`${gestiones_con_foto} gestiones con foto`}>
              <Typography
                variant="body2"
                sx={{
                  color: highlightMap[params.row.person_who_capture]
                    ? "#4ade80"
                    : "inherit",
                  fontWeight: highlightMap[params.row.person_who_capture]
                    ? 600
                    : "normal",
                }}
              >
                {gestiones_con_foto}
              </Typography>
            </Tooltip>
            <span>/</span>
            <Tooltip title={`${gestiones_sin_foto} gestiones sin foto`}>
              <Typography
                variant="body2"
                sx={{
                  color: highlightMap[params.row.person_who_capture]
                    ? "#4ade80"
                    : "inherit",
                  fontWeight: highlightMap[params.row.person_who_capture]
                    ? 600
                    : "normal",
                }}
              >
                {gestiones_sin_foto}
              </Typography>
            </Tooltip>
            {gestiones_sin_foto > 0 && (
              <WarningAmberOutlinedIcon
                sx={{ fontSize: 18, color: colors.yellowAccent[500] }}
              />
            )}
            {gestiones_con_foto > 0 && gestiones_sin_foto === 0 && (
              <CheckCircleOutlineIcon
                sx={{ fontSize: 18, color: colors.accentGreen[200] }}
              />
            )}
          </Box>
        );
      },
    },
    {
      field: "predios",
      headerName: "Localizados / No localizados",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const { predios_localizados, predios_no_localizados } = params.row;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title={`${predios_localizados} predios localizados`}>
              <Typography
                variant="body2"
                sx={{
                  color: highlightMap[params.row.person_who_capture]
                    ? "#4ade80"
                    : "inherit",
                  fontWeight: highlightMap[params.row.person_who_capture]
                    ? 600
                    : "normal",
                }}
              >
                {predios_localizados}
              </Typography>
            </Tooltip>
            <span>/</span>
            <Tooltip title={`${predios_no_localizados} predios no localizados`}>
              <Typography
                variant="body2"
                sx={{
                  color: highlightMap[params.row.person_who_capture]
                    ? "#4ade80"
                    : "inherit",
                  fontWeight: highlightMap[params.row.person_who_capture]
                    ? 600
                    : "normal",
                }}
              >
                {predios_no_localizados}
              </Typography>
            </Tooltip>
            {predios_no_localizados > 0 && (
              <WarningAmberOutlinedIcon
                sx={{ fontSize: 18, color: colors.yellowAccent[500] }}
              />
            )}
            {predios_localizados > 0 && predios_no_localizados === 0 && (
              <CheckCircleOutlineIcon
                sx={{ fontSize: 18, color: colors.accentGreen[200] }}
              />
            )}
          </Box>
        );
      },
    },
    {
      field: "first_gestion",
      headerName: "Primera gestión",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "last_gestion",
      headerName: "Última gestión",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            color: highlightMap[params.row.person_who_capture]
              ? "#4ade80"
              : "inherit",
            fontWeight: highlightMap[params.row.person_who_capture]
              ? 500
              : "normal",
          }}
        >
          {params.row.last_gestion}
        </Typography>
      ),
    },
    {
      field: "avg_time_between",
      headerName: "Prom. tiempo entre gestiones",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "max_min_diff",
      headerName: "Máx / Mín diferencia",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip
            title={`Mayor diferencia entre gestiones: ${params.row.max_diff}`}
          >
            <Typography variant="body2">{params.row.max_diff}</Typography>
          </Tooltip>
          <span>/</span>
          <Tooltip
            title={`Menor diferencia entre gestiones: ${params.row.min_diff}`}
          >
            <Typography variant="body2">{params.row.min_diff}</Typography>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
        }}
      >
        Resumen de actividad del día
      </Typography>

      <Box
        sx={{
          height: 500,
          width: "100%",
          "& .MuiDataGrid-root": {
            border: "none",
            color: colors.grey[300],
            backgroundColor: colors.bgContainer,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${colors.borderContainer}`,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.bgContainer,
            borderBottom: `1px solid ${colors.borderContainer}`,
            fontWeight: 600,
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${colors.borderContainer}`,
          },
          "& .MuiDataGrid-row:hover": { backgroundColor: colors.hoverRow },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={30}
          rowsPerPageOptions={[30]}
          getRowId={(row) => row.person_who_capture}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default GestoresTable;
