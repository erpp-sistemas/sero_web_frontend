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
     FUNCIÓN PARA FORMATEAR FECHAS Y HORAS
  ====================================================== */
  
  // Formatear datetime completo (fecha + hora)
  const formatDateTime = (value) => {
    if (!value) return "";
    
    if (value instanceof Date) {
      return value.toLocaleString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }
    
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      const date = new Date(value);
      return date.toLocaleString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }
    
    return value;
  };

  // Formatear solo hora (para hora_entrada y hora_salida)
  const formatTimeOnly = (value) => {
    if (!value) return "";
    
    if (value instanceof Date) {
      return value.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }
    
    if (typeof value === "string") {
      // Si es datetime string ISO
      if (value.match(/^\d{4}-\d{2}-\d{2}T/)) {
        const date = new Date(value);
        return date.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      }
      
      // Si ya es solo hora (HH:MM:SS)
      if (value.match(/^\d{2}:\d{2}:\d{2}/)) {
        return value;
      }
    }
    
    return value;
  };

  /* ======================================================
     DESCARGA A EXCEL - INCLUYE TODOS LOS CAMPOS NECESARIOS
  ====================================================== */
  const handleDownloadExcel = async () => {
    if (!data.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Gestiones", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
    });

    // 🔥 Obtener TODOS los campos del primer objeto
    const allFields = Object.keys(data[0]);
    
    // 🔥 Definir campos que queremos EXCLUIR explícitamente (IDs y fotos)
    const excludeFields = [
      'id', 'id_tarea', 'id_usuario', 'id_servicio', 'id_proceso',  // IDs
      'fotos'  // JSON de fotos
    ];
    
    // 🔥 Filtrar campos (solo excluir los explícitamente definidos)
    const fieldsToExport = allFields.filter(
      (field) => !excludeFields.includes(field.toLowerCase())
    );

    // 📌 Crear encabezados formateados (reemplazar _ por espacio)
    const headers = fieldsToExport.map((field) =>
      field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
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
        let value = item[field];

        // 🔥 TRATAMIENTO ESPECIAL PARA CAMPOS DE FECHA/HORA
        if (field === 'fecha') {
          return formatDateTime(value);
        }
        
        // Para hora_entrada y hora_salida - SOLO LA HORA
        if (field === 'hora_entrada' || field === 'hora_salida') {
          return formatTimeOnly(value);
        }
        
        // Para campos de fecha captura (si existen)
        if (field === 'fechaCaptura' || field === 'fecha_captura') {
          return formatDateTime(value);
        }

        // Para otros campos que sean fechas ISO
        if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
          return formatDateTime(value);
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
      column.width = Math.min(maxLength + 2, 50); // Aumentado a 50 para URLs largas
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