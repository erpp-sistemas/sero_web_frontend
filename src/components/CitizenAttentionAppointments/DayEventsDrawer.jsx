import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as ExcelJS from "exceljs";

const DayEventsDrawer = ({
  open,
  onClose,
  events,
  selectedFilter,
  setSelectedFilter,
  getColorFromString,
}) => {
  console.log(events);
  const [searchTerm, setSearchTerm] = useState("");

  const opcionCounts = events.reduce((acc, curr) => {
    const opcion = curr.opcion_regularizacion || "Sin opción";
    acc[opcion] = (acc[opcion] || 0) + 1;
    return acc;
  }, {});

  const filteredEvents = events.filter((event) => {
    const matchesFilter =
      !selectedFilter || event.opcion_regularizacion === selectedFilter;
    const matchesSearch =
      event.folio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.propietario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.cuenta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.opcion_regularizacion
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  function parseHourFromFecha(fechaCita) {
    const dateParts = fechaCita.split("T");
    if (dateParts.length < 2) return "";

    const timePart = dateParts[1];
    const [hourStr, minuteStr] = timePart.split(":");
    let hours = parseInt(hourStr, 10);
    const minutes = minuteStr;

    const ampm = hours >= 12 ? "PM" : "AM";

    // Convertir a formato 12 horas
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Si es 0, en 12 horas es 12

    return `${hours}:${minutes} ${ampm}`;
  }

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Citas Filtradas");

    // Define headers
    const columns = [
      { header: "Folio", key: "folio" },
      { header: "Propietario", key: "propietario" },
      { header: "Cuenta", key: "cuenta" },
      { header: "Fecha Cita", key: "fecha_cita" },
      { header: "Opción Regularización", key: "opcion_regularizacion" },
    ];
    worksheet.columns = columns;

    // Agrega los datos filtrados
    filteredEvents.forEach((event) => {
      worksheet.addRow({
        folio: event.folio,
        propietario: event.propietario,
        cuenta: event.cuenta,
        fecha_cita: event.fecha_cita,
        opcion_regularizacion: event.opcion_regularizacion,
      });
    });

    // Aplica estilo a los headers
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1E88E5" }, // azul
      };
    });

    // Ajuste automático de ancho de columnas
    worksheet.columns.forEach((column) => {
      let maxLength = column.header.length;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const val = cell.value ? cell.value.toString() : "";
        if (val.length > maxLength) maxLength = val.length;
      });
      column.width = maxLength + 2; // un poco de padding
    });

    // Exportar
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "citas_filtradas.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Obtener la fecha de los eventos (asumiendo que todos los eventos tienen la misma fecha)
  const drawerDate =
    events.length > 0
      ? new Date(events[0].fecha_cita).toLocaleDateString("es-MX", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Sin fecha";

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, padding: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Citas del día ({events.length}) - {drawerDate}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Campo de búsqueda */}
        <Box mt={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        </Box>

        {/* Botón de exportar */}
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            color="info"
            endIcon={<FileDownloadIcon />}
            onClick={handleExportToExcel}
            disabled={filteredEvents.length === 0}
            sx={{
              color: "white",
            }}
          >
            Exportar a Excel
          </Button>
        </Box>

        {/* Chips para filtrar dentro del Drawer */}
        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
          {[
            ...new Set(
              events.map((e) => e.opcion_regularizacion || "Sin opción")
            ),
          ].map((option) => {
            const isSelected = selectedFilter === option;
            const bulletColor = getColorFromString(option);
            const count = opcionCounts[option] || 0;

            return (
              <Chip
                key={option}
                label={`${option} (${count})`}
                clickable
                onClick={() => setSelectedFilter(isSelected ? null : option)}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  borderColor: bulletColor,
                  color: isSelected ? "white" : bulletColor,
                  backgroundColor: isSelected ? bulletColor : "transparent",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? bulletColor
                      : bulletColor + "33",
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Citas filtradas */}
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {filteredEvents.map((event) => {
            const bulletColor = getColorFromString(
              event.opcion_regularizacion || "Sin opción"
            );

            return (
              <Card
                key={event.id}
                variant="outlined"
                sx={{
                  borderColor: bulletColor,
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: bulletColor + "11",
                  },
                  borderWidth: 2,
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ paddingBottom: "8px !important" }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ mb: 2 }}
                  >
                    {parseHourFromFecha(event.fecha_cita)}
                  </Typography>
                  <Typography fontWeight="bold">{event.folio}</Typography>
                  <Typography variant="body2">{event.propietario}</Typography>
                  <Typography variant="body2">{event.cuenta}</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: bulletColor,
                      fontWeight: "bold",
                    }}
                  >
                    {event.opcion_regularizacion || "Sin opción"}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Drawer>
  );
};

export default DayEventsDrawer;
