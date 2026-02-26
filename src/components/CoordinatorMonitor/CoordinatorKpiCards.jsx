// src/components/HomeCoordination/CoordinatorKpiCards.jsx
import React from "react";
import { Box, Typography, useTheme, IconButton, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import * as ExcelJS from "exceljs";

const CoordinatorKpiCards = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* ======================================================
     KPIs CALCULADOS DESDE EL DATASET
  ====================================================== */

  const gestoresActivos = new Set(data.map((d) => d.id_usuario)).size;

  const prediosLocalizados = data.filter(
    (d) => d.estatus_predio === "Predio localizado",
  ).length;

  const prediosNoLocalizados = data.length - prediosLocalizados;

  const gestionesConFoto = data.filter((d) => d.total_fotos > 0).length;
  const gestionesSinFoto = data.length - gestionesConFoto;

  const totalGestiones = data.length;

  const gestionesCompletas = data.filter(
    (d) => d.estatus_gestion === "COMPLETA",
  ).length;

  const gestionesIncompletas = data.filter(
    (d) => d.estatus_gestion === "INCOMPLETA",
  ).length;

  /* ======================================================
     DESCARGA A EXCEL - 100% DINÁMICA (EXCLUYE ID Y FOTOS)
  ====================================================== */
  const handleDownloadExcel = async () => {
    if (!data.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Gestiones", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
    });

    // 🔥 Obtener TODOS los campos del primer objeto
    const allFields = Object.keys(data[0]);

    // 🔥 Filtrar campos que NO contengan "id" NI "fotos" (insensible)
    const fieldsToExport = allFields.filter(
      (field) =>
        !field.toLowerCase().includes("id") &&
        !field.toLowerCase().includes("foto"),
    );

    // 📌 Crear encabezados formateados (reemplazar _ por espacio)
    const headers = fieldsToExport.map((field) =>
      field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    );

    // 📌 Encabezados con estilo minimalista
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FF374151" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      };
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });

    // 📌 Agregar datos dinámicamente
    data.forEach((item) => {
      const rowData = fieldsToExport.map((field) => {
        const value = item[field];

        // Formatear fechas si parecen serlo
        if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
          return new Date(value).toLocaleDateString("es-MX");
        }

        // Si es objeto o array, convertir a JSON string (para no perder info)
        if (typeof value === "object" && value !== null) {
          return JSON.stringify(value);
        }

        return value ?? "";
      });

      const row = worksheet.addRow(rowData);

      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.font = { color: { argb: "FF1F2937" } };
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFF9FAFB" } },
        };
      });
    });

    // 📌 Ajustar ancho de columnas
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 10;
        maxLength = Math.max(maxLength, length);
      });
      column.width = Math.min(maxLength + 2, 40);
    });

    // 📌 Generar y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `gestiones_${new Date().toISOString().split("T")[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  /* ======================================================
     CARD BASE
  ====================================================== */

  const Card = ({ icon, title, children, onDownload }) => (
    <Box
      className="p-4 rounded-xl shadow-sm"
      sx={{
        backgroundColor: colors.bgContainer,
        display: "flex",
        alignItems: "center",
        gap: 2,
        position: "relative",
      }}
    >
      <Box sx={{ color: colors.grey[500], fontSize: 28 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>{children}</Box>

      {/* Botón de descarga SIEMPRE VISIBLE */}
      {onDownload && (
        <Tooltip title="Descargar Excel" arrow placement="top">
          <IconButton
            size="small"
            onClick={onDownload}
            sx={{
              color: colors.grey[400],
              backgroundColor: colors.bgContainer,
              "&:hover": {
                backgroundColor: colors.primary[100] + "20",
                color: colors.primary[300],
              },
            }}
          >
            <DownloadOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
      {/* ================== Total gestiones (CON DESCARGA) ================== */}
      <Card icon={<AssignmentOutlinedIcon />} onDownload={handleDownloadExcel}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {totalGestiones}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Total de gestiones
        </Typography>
      </Card>

      {/* ================== Gestores activos ================== */}
      <Card icon={<GroupsOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {gestoresActivos}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Gestores activos
        </Typography>
      </Card>

      {/* ================== Gestiones ================== */}
      <Card icon={<CheckCircleOutlineIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {gestionesCompletas}
          <Typography
            component="span"
            sx={{ color: colors.redAccent[400], fontWeight: 500 }}
          >
            {" "}
            / {gestionesIncompletas}
          </Typography>
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Completas / Incompletas
        </Typography>
      </Card>

      {/* ================== Predios ================== */}
      <Card icon={<LocationOnOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {prediosLocalizados}
          <Typography
            component="span"
            sx={{ color: colors.redAccent[400], fontWeight: 500 }}
          >
            {" "}
            / {prediosNoLocalizados}
          </Typography>
        </Typography>
        <Typography variant="caption" sx={{ color: colors.grey[400] }}>
          Localizados / No localizados
        </Typography>
      </Card>

      {/* ================== Evidencia fotográfica ================== */}
      <Card icon={<PhotoCameraOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {gestionesConFoto}
          <Typography
            component="span"
            sx={{ color: colors.redAccent[400], fontWeight: 500 }}
          >
            {" "}
            / {gestionesSinFoto}
          </Typography>
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Con foto / Sin foto
        </Typography>
      </Card>
    </Box>
  );
};

export default CoordinatorKpiCards;
