import React, { useState, useMemo } from "react";
import { tokens } from "../../theme";
import {
  Typography,
  useTheme,
  Tooltip,
  TextField,
  InputAdornment,
  FormHelperText,  
} from "@mui/material";
import LoadingModal from "../../components/LoadingModal.jsx";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import RegularizationChips from "./RegularizationChips";
import StatCards from "./StatCard.jsx";
import DataGridAppointments from "./DataGridAppointments.jsx";
import DayEventsDrawer from "./DayEventsDrawer";

import * as ExcelJS from "exceljs";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Search } from "@mui/icons-material";

const FullCalendarAppointments = ({ data }) => {
  console.log(data);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showModalLoading, setShowModalLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDrawerFilter, setSelectedDrawerFilter] = useState(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const events = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      id: item.id,
      folio: item.folio,
      propietario: item.propietario,
      cuenta: item.cuenta,
      fecha_cita: item.fecha_cita,
      opcion_regularizacion: item.opcion_regularizacion,
      title: item.folio,
      start: item.fecha_cita,
    }));
  }, [data]);

  const groupedEvents = useMemo(() => {
    if (!data) return [];
    const grouped = data.reduce((acc, item) => {
      const date = item.fecha_cita.split("T")[0]; // Agrupamos por fecha (YYYY-MM-DD)
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).flatMap(([date, events]) => {
      if (events.length === 1) {
        const event = events[0];
        return {
          id: event.id,
          title: event.folio,
          start: event.fecha_cita,
          extendedProps: event,
        };
      } else {
        return {
          id: date,
          title: `${events.length} citas`,
          start: date,
          extendedProps: { events },
        };
      }
    });
  }, [data]);

  const getColorFromString = (str) => {
    if (!str) return "hsl(0, 0%, 70%)"; // gris para opción vacía
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const regularizationOptions = useMemo(() => {
    if (!data) return {};
    return data.reduce((acc, item) => {
      const key = item.opcion_regularizacion || "Sin opción";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  const handleFilterClick = (option) => {
    setSelectedFilters((prev) =>
      prev.includes(option)
        ? prev.filter((f) => f !== option)
        : [...prev, option]
    );
  };

  const renderEventContent = (eventInfo) => {
    const { events } = eventInfo.event.extendedProps;

    if (events) {
      // Renderiza el contador de citas
      return (
        <div className="text-center font-bold text-2xl text-gray-100">
          {eventInfo.event.title}
        </div>
      );
    }

    // Renderiza el contenido del evento individual
    const extendedProps = eventInfo.event.extendedProps;
    const { opcion_regularizacion, fecha_cita } = extendedProps;
    const date = new Date(fecha_cita);

    const formattedTime = date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Mexico_City",
    });

    const bulletColor = getColorFromString(opcion_regularizacion || "");

    return (
      <Tooltip
        title={
          <div className="flex flex-col text-sm">
            {Object.entries(extendedProps).map(([key, value]) => (
              <div key={key} className="capitalize">
                <span className="font-semibold">{key.replace(/_/g, " ")}:</span>{" "}
                {value}
              </div>
            ))}
            <div>
              <span className="font-semibold">Hora:</span> {formattedTime}
            </div>
          </div>
        }
        arrow
        placement="top"
      >
        <div className="flex items-start gap-1 w-full overflow-hidden">
          <div
            className="w-2 h-2 mt-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: bulletColor }}
          ></div>
          <div className="flex flex-col text-[10px] leading-tight w-full overflow-hidden">
            <div className="font-bold truncate">{extendedProps.folio}</div>
            <div className="truncate">{formattedTime}</div>
            <div className="text-gray-600 truncate">
              {opcion_regularizacion}
            </div>
          </div>
        </div>
      </Tooltip>
    );
  };

  const filteredEvents = useMemo(() => {
    return data.filter((e) => {
      const term = searchTerm.toLowerCase();
      const matchChip =
        selectedFilters.length === 0 ||
        selectedFilters.includes(e.opcion_regularizacion);

      const fecha = new Date(e.fecha_cita);
      const dia = diasSemana[fecha.getDay()];
      const mes = meses[fecha.getMonth()];

      const matchSearch =
        e.folio?.toLowerCase().includes(term) ||
        e.propietario?.toLowerCase().includes(term) ||
        e.cuenta?.toLowerCase().includes(term) ||
        e.opcion_regularizacion?.toLowerCase().includes(term) ||
        dia.includes(term) ||
        mes.includes(term);

      return matchChip && matchSearch;
    });
  }, [data, selectedFilters, searchTerm]);

  const filteredGroupedEvents = useMemo(() => {
    const grouped = filteredEvents.reduce((acc, item) => {
      const dateTime = item.fecha_cita; // Agrupamos por fecha y hora exacta
      if (!acc[dateTime]) acc[dateTime] = [];
      acc[dateTime].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).flatMap(([dateTime, events]) => {
      if (events.length === 1) {
        const event = events[0];
        return {
          id: event.id,
          title: event.folio,
          start: event.fecha_cita,
          extendedProps: event,
        };
      } else {
        return {
          id: dateTime,
          title: `${events.length} citas`,
          start: dateTime,
          extendedProps: { events },
        };
      }
    });
  }, [filteredEvents]);

  const getEventsForView = useMemo(() => {
    // Usamos la misma lógica para todas las vistas
    return filteredGroupedEvents;
  }, [filteredGroupedEvents]);

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Citas");

    // Define headers con estilos
    const columns = [
      { header: "Folio", key: "folio" },
      { header: "Propietario", key: "propietario" },
      { header: "Cuenta", key: "cuenta" },
      { header: "Fecha Visita", key: "fecha_visita" },
      { header: "Fecha Cita", key: "fecha_cita" },
      { header: "Opción Regularización", key: "opcion_regularizacion" },
    ];

    worksheet.columns = columns;

    // Agrega los datos
    filteredEvents.forEach((event) => {
      worksheet.addRow({
        folio: event.folio,
        propietario: event.propietario,
        cuenta: event.cuenta,
        fecha_visita: event.fecha_visita,
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
    link.download = "citas.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDatesSet = (dateInfo) => {
    setCurrentView(dateInfo.view.type);
  };

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    const dayGroup = filteredGroupedEvents.find(
      (group) => group.start.split("T")[0] === clickedDate
    );

    if (dayGroup) {
      if (dayGroup.extendedProps.events) {
        setSelectedDayEvents(dayGroup.extendedProps.events);
      } else {
        setSelectedDayEvents([dayGroup.extendedProps]);
      }
      setDrawerOpen(true);
    }
  };

  const handleEventClick = (info) => {
    const clickedDateTime = info.event.start.toISOString();
    const eventGroup = filteredGroupedEvents.find((group) =>
      group.start === clickedDateTime
    );

    if (eventGroup) {
      if (eventGroup.extendedProps.events) {
        setSelectedDayEvents(eventGroup.extendedProps.events);
      } else {
        setSelectedDayEvents([eventGroup.extendedProps]);
      }
      setDrawerOpen(true);
    }
  };

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }

  return (
    <div className="w-full ">
      <LoadingModal open={showModalLoading} />

      <div className="w-full p-4 rounded-lg shadow-md mb-4">
        <div className="grid grid-cols-12 items-center gap-4">
          {/* Columna vacía (6 columnas) */}
          <div className="col-span-6 hidden" />

          {/* TextField (4 columnas) */}
          <div className="col-span-12 md:col-span-4">
            <TextField
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              color="secondary"
              size="small"
              placeholder="Ingresa tu búsqueda"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="secondary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px", // Bordes redondeados
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.accentGreen[100], // Color predeterminado del borde
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "accent.light", // Color al pasar el mouse
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "accent.dark", // Color al enfocar
                  },
                },
              }}
            />
            {filteredEvents.length === 0 && (
              <FormHelperText style={{ color: "red" }}>
                No se encontraron resultados
              </FormHelperText>
            )}
          </div>

          {/* Botón (2 columnas) */}
          <div className="col-span-12 md:col-span-2">
            <Button
              variant="contained"
              color="info"
              endIcon={<FileDownloadIcon />}
              onClick={handleExportToExcel}
              fullWidth
              disabled={filteredEvents.length === 0}
              sx={{
                borderRadius: "35px",
                color: "white",
              }}
            >
              Exportar
            </Button>
          </div>
        </div>

        <StatCards data={filteredEvents} />

        <div className="flex flex-wrap gap-2 mb-4">
          <RegularizationChips
            options={regularizationOptions}
            selectedFilters={selectedFilters}
            onFilterClick={handleFilterClick}
          />
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4 shadow-lg">
          <div className="col-span-12">
            <div className="rounded-lg p-2 ">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={getEventsForView} // Usamos la misma lógica para todas las vistas
                eventContent={renderEventContent} // Renderiza eventos individuales y contadores
                locale={esLocale}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                height="auto"
                nowIndicator={true}
                selectable={true}
                dayHeaderClassNames={() => ["text-black", "font-semibold"]}
                contentHeight="auto"
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                datesSet={handleDatesSet}
              />
              <DayEventsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                events={selectedDayEvents}
                selectedFilter={selectedDrawerFilter}
                setSelectedFilter={setSelectedDrawerFilter}
                getColorFromString={getColorFromString}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-4 shadow-lg">
          <div className="col-span-12">
            <div className="rounded-lg p-2 ">
              <DataGridAppointments data={filteredEvents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullCalendarAppointments;
