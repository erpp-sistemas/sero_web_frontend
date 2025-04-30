import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Stack, useTheme } from '@mui/material';
import { tokens } from "../../theme";

const AppointmentSummaryCards = ({ data, onFilterChange }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedOption, setSelectedOption] = useState(null);

  // Agrupar citas por opcion_regularizacion
  const citasPorOpcion = data.reduce((acc, item) => {
    acc[item.opcion_regularizacion] = (acc[item.opcion_regularizacion] || 0) + 1;
    return acc;
  }, {});

  const handleChipClick = (opcion) => {
    const newSelection = selectedOption === opcion ? null : opcion;
    setSelectedOption(newSelection);
    onFilterChange(newSelection); // Enviar al padre la opción seleccionada o null para reset
  };

  // Fechas
  const fechas = data.map(item => new Date(item.fecha_cita));
  const fechaMasAntigua = fechas.length ? new Date(Math.min(...fechas)) : null;
  const fechaMasReciente = fechas.length ? new Date(Math.max(...fechas)) : null;

  const formatFecha = (fecha) => fecha?.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard title="Total de citas" value={data.length} color={colors.accentGreen[500]} />
      <Card sx={{ backgroundColor: colors.blueAccent[500], color: 'white', borderRadius: '16px', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Citas por opción
          </Typography>
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            <Chip
              label="Mostrar todo"
              clickable
              onClick={() => handleChipClick(null)}
              color={selectedOption === null ? "secondary" : "default"}
              variant={selectedOption === null ? "filled" : "outlined"}
            />
            {Object.entries(citasPorOpcion).map(([opcion, count]) => (
              <Chip
                key={opcion}
                label={`${opcion} (${count})`}
                clickable
                onClick={() => handleChipClick(opcion)}
                color={selectedOption === opcion ? "secondary" : "default"}
                variant={selectedOption === opcion ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
      <StatCard title="Rango de fechas" value={`${formatFecha(fechaMasAntigua)} - ${formatFecha(fechaMasReciente)}`} color={colors.accentOrange[500]} isStatic />
    </div>
  );
};

const StatCard = ({ title, value, color, isStatic = false }) => {
  return (
    <Card sx={{ backgroundColor: color, color: 'white', borderRadius: '16px', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AppointmentSummaryCards;
