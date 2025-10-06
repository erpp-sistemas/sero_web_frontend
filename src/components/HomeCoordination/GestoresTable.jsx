import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme, Box, Avatar, Typography, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const GestoresTable = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const processedData = useMemo(() => {
    const grouped = {};

    data.forEach((item) => {
      const key = item.person_who_capture;
      if (!grouped[key]) {
        grouped[key] = {
          person_who_capture: item.person_who_capture,
          photo_person_who_capture: item.photo_person_who_capture,
          total_gestiones: 0,
          gestiones_con_foto: 0,
          gestiones_sin_foto: 0,
          predios_localizados: 0,
          predios_no_localizados: 0,
          date_captures: [],
        };
      }

      grouped[key].total_gestiones += 1;
      grouped[key].gestiones_con_foto += item.total_photos > 0 ? 1 : 0;
      grouped[key].gestiones_sin_foto += item.total_photos === 0 ? 1 : 0;
      grouped[key].predios_localizados +=
        item.property_status === "Predio localizado" ? 1 : 0;
      grouped[key].predios_no_localizados +=
        item.property_status !== "Predio localizado" ? 1 : 0;
      grouped[key].date_captures.push(new Date(item.date_capture));
    });

    // Convertir y ordenar
    const result = Object.values(grouped).map((g) => {
      const sortedDates = g.date_captures.sort((a, b) => a - b);
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

      return {
        ...g,
        first_gestion: sortedDates[0]
          ? sortedDates[0].toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
        last_gestion: sortedDates[sortedDates.length - 1]
          ? sortedDates[sortedDates.length - 1].toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
        avg_time_between: avgDiff ? `${Math.round(avgDiff)}m` : "-",
        max_diff: maxDiff ? `${Math.round(maxDiff)}m` : "-",
        min_diff:
          minDiff && minDiff !== Infinity ? `${Math.round(minDiff)}m` : "-",
      };
    });

    // 👉 Ordenar por total_gestiones de mayor a menor
    return result.sort((a, b) => b.total_gestiones - a.total_gestiones);
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
              <Typography variant="body2">{gestiones_con_foto}</Typography>
            </Tooltip>
            <span>/</span>
            <Tooltip title={`${gestiones_sin_foto} gestiones sin foto`}>
              <Typography variant="body2">{gestiones_sin_foto}</Typography>
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
              <Typography variant="body2">{predios_localizados}</Typography>
            </Tooltip>
            <span>/</span>
            <Tooltip title={`${predios_no_localizados} predios no localizados`}>
              <Typography variant="body2">{predios_no_localizados}</Typography>
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
      <Tooltip title={`Mayor diferencia entre gestiones: ${params.row.max_diff}`}>
        <Typography variant="body2">{params.row.max_diff}</Typography>
      </Tooltip>
      <span>/</span>
      <Tooltip title={`Menor diferencia entre gestiones: ${params.row.min_diff}`}>
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
          rows={processedData}
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
