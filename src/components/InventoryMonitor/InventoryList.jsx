// src/components/Inventory/InventoryList.jsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Paper,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Download,
  Visibility,
  Edit,
  Person,
  Delete,
  CheckCircle,
  Warning,
  Error,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import * as ExcelJS from "exceljs";

// ============================================
// COMPONENTE STATUS BADGE
// ============================================
const StatusBadge = ({ estado, activo, id_usuario, condicion }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  let estadoReal = "disponible";
  let color = colors.accentGreen[100];
  let icono = <CheckCircle sx={{ fontSize: 16 }} />;
  let label = "Disponible";

  if (activo === false) {
    estadoReal = "baja";
    color = colors.redAccent[400];
    icono = <Error sx={{ fontSize: 16 }} />;
    label = "Dado de baja";
  } else if (condicion === "malo") {
    estadoReal = "mantenimiento";
    color = colors.yellowAccent[400];
    icono = <Warning sx={{ fontSize: 16 }} />;
    label = "Mantenimiento";
  } else if (id_usuario) {
    estadoReal = "asignado";
    color = colors.blueAccent[400];
    icono = <Person sx={{ fontSize: 16 }} />;
    label = "Asignado";
  }

  return (
    <Chip
      icon={icono}
      label={label}
      size="small"
      sx={{
        backgroundColor: color + "20",
        color: color,
        fontWeight: 600,
        fontSize: "0.7rem",
        minWidth: 90,
        "& .MuiChip-icon": { color: color },
      }}
    />
  );
};

const InventoryList = ({ data = [], onVerDetalle, onAsignar, onEditar, onBaja }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ============================================
  // COLORES
  // ============================================
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainer;
  const COLOR_BORDE = colors.primary[500];
  const COLOR_PRIMARIO = colors.primary[400];

  // ============================================
  // COLUMNAS DEL DATAGRID
  // ============================================
  const columns = [
    {
      field: "folio",
      headerName: "Folio",
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: COLOR_TEXTO }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "nombre_articulo",
      headerName: "Artículo",
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
            {params.value}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            {params.row.marca} {params.row.modelo && `• ${params.row.modelo}`}
            {params.row.numero_serie && ` • S/N: ${params.row.numero_serie}`}
          </Typography>
        </Box>
      ),
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      renderCell: (params) => (
        <StatusBadge
          estado={params.row.estado}
          activo={params.row.activo}
          id_usuario={params.row.id_usuario}
          condicion={params.row.condicion_actual}
        />
      ),
    },
    {
      field: "categoria",
      headerName: "Categoría",
      width: 120,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ color: colors.grey[300] }}>
            {params.row.categoria}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.grey[500] }}>
            {params.row.subcategoria}
          </Typography>
        </Box>
      ),
    },
    {
      field: "usuario",
      headerName: "Asignado a",
      width: 180,
      renderCell: (params) => (
        <Box>
          {params.row.usuario ? (
            <>
              <Typography variant="body2" sx={{ color: COLOR_TEXTO }}>
                {params.row.usuario}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                ID: {params.row.id_usuario}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" sx={{ color: colors.grey[500], fontStyle: "italic" }}>
              Sin asignar
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "plaza",
      headerName: "Plaza",
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: colors.grey[300] }}>
          {params.value || "—"}
        </Typography>
      ),
    },
    {
      field: "condicion_actual",
      headerName: "Condición",
      width: 100,
      renderCell: (params) => {
        const color = params.value === "excelente" ? colors.accentGreen[100] :
                     params.value === "bueno" ? colors.blueAccent[400] :
                     colors.redAccent[400];
        return (
          <Typography variant="body2" sx={{ color, fontWeight: 500, textTransform: "capitalize" }}>
            {params.value || "—"}
          </Typography>
        );
      },
    },
    {
      field: "acciones",
      headerName: "",
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Ver detalle">
            <IconButton size="small" onClick={() => onVerDetalle?.(params.row)} sx={{ color: colors.grey[400] }}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => onEditar?.(params.row)} sx={{ color: colors.grey[400] }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Asignar">
            <span>
              <IconButton
                size="small"
                disabled={params.row.activo === false}
                onClick={() => onAsignar?.(params.row)}
                sx={{ color: params.row.activo === false ? colors.grey[600] : colors.grey[400] }}
              >
                <Person fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Dar de baja">
            <span>
              <IconButton
                size="small"
                disabled={params.row.activo === false}
                onClick={() => onBaja?.(params.row)}
                sx={{ color: params.row.activo === false ? colors.grey[600] : colors.grey[400] }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // ============================================
  // EXPORTACIÓN A EXCEL
  // ============================================
  const handleDownloadExcel = async () => {
    if (!data.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventario", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
    });

    const exportColumns = columns.filter(col => col.field !== "acciones");
    const headers = exportColumns.map(col => col.headerName);

    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FF374151" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = { bottom: { style: "thin", color: { argb: "FFE5E7EB" } } };
    });

    data.forEach((item) => {
      const rowData = exportColumns.map(col => {
        if (col.field === "estado") {
          if (item.activo === false) return "Dado de baja";
          if (item.condicion_actual === "malo") return "Mantenimiento";
          if (item.id_usuario) return "Asignado";
          return "Disponible";
        }
        return item[col.field] ?? "";
      });
      worksheet.addRow(rowData);
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 10;
        maxLength = Math.max(maxLength, length);
      });
      column.width = Math.min(maxLength + 2, 40);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `inventario_${new Date().toISOString().split("T")[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Altura dinámica (mismo que PerformanceMonitor)
  const alturaTabla = useMemo(() => {
    const alturaHeader = 56;
    const alturaFila = 68;
    const margenExtra = 16;
    return data.length <= 8 ? alturaHeader + (data.length * alturaFila) + margenExtra : 550;
  }, [data.length]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header con contador y exportación - mismo estilo */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Mostrando {data.length} artículos
        </Typography>
        <Button
          startIcon={<Download />}
          size="small"
          onClick={handleDownloadExcel}
          sx={{
            color: COLOR_TEXTO,
            textTransform: "none",
            "&:hover": { bgcolor: colors.primary[400] + "20" }
          }}
        >
          Exportar a Excel
        </Button>
      </Box>

      {/* DataGrid - mismo estilo que PerformanceMonitor */}
      <Paper sx={{ bgcolor: COLOR_FONDO, borderRadius: "16px", overflow: "hidden" }}>
        <Box sx={{ height: alturaTabla, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id_articulo}
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            hideFooter
            sortingMode="client"
            initialState={{ sorting: { sortModel: [{ field: "folio", sort: "asc" }] } }}
            sx={{
              border: "none",
              color: COLOR_TEXTO,
              bgcolor: COLOR_FONDO,
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${COLOR_BORDE}`,
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: COLOR_FONDO,
                borderBottom: `1px solid ${COLOR_BORDE}`,
                fontWeight: 600,
              },
              "& .MuiDataGrid-footerContainer": { display: "none" },
              "& .MuiDataGrid-row:hover": { bgcolor: colors.primary[400] + "20" },
              "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox": { display: "none" },
              "& .MuiDataGrid-columnSeparator": { display: "none" },
              "& .MuiDataGrid-virtualScroller": { bgcolor: COLOR_FONDO },
              "& .MuiDataGrid-columnHeaders": { position: "sticky", top: 0, zIndex: 1 },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default InventoryList;