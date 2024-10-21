import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, TextField, InputAdornment } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

function PaymentsPerColony({ data }) {
  const [expandedColonia, setExpandedColonia] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!data) {
    return null;
  }

  const coloniasAgrupadas = data.reduce((acc, item) => {
    const { colonia, cuenta, total } = item;
    if (!acc[colonia]) {
      acc[colonia] = { colonia, cuentas: 0, total: 0, detalles: [] };
    }
    acc[colonia].cuentas += 1;
    acc[colonia].total += total;
    acc[colonia].detalles.push(item);
    return acc;
  }, {});

  const coloniasArray = Object.values(coloniasAgrupadas);

  const filteredColonias = coloniasArray.filter((colonia) =>
    colonia.colonia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rangosAgrupados = filteredColonias.reduce((acc, colonia) => {
    let rango;

    if (colonia.total <= 0) {
      rango = 'Corriente';
    } else if (colonia.total < 0) {
      rango = 'Saldo A Favor';
    } else if (colonia.total <= 1000) {
      rango = 'De 1 a 1 mil';
    } else if (colonia.total <= 5000) {
      rango = 'De 1 a 5 mil';
    } else if (colonia.total <= 10000) {
      rango = 'De 5 a 10 mil';
    } else if (colonia.total <= 25000) {
      rango = 'De 10 a 25 mil';
    } else if (colonia.total <= 50000) {
      rango = 'De 25 a 50 mil';
    } else if (colonia.total <= 100000) {
      rango = 'De 50 a 100 mil';
    } else if (colonia.total <= 500000) {
      rango = 'De 100 a 500 mil';
    } else {
      rango = 'Mayor a 500 mil';
    }

    if (!acc[rango]) {
      acc[rango] = { rango, count: 0, colonias: [] };
    }
    acc[rango].count += 1;
    acc[rango].colonias.push(colonia);
    return acc;
  }, {});

  const rangosArray = Object.values(rangosAgrupados);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
        Resumen de Colonias por Rango
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            placeholder="Escribe la colonia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small" // Tamaño pequeño
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            helperText={
              filteredColonias.length === 0 && searchTerm.length > 0
                ? 'No se encontraron coincidencias.'
                : ''
            }
            error={filteredColonias.length === 0 && searchTerm.length > 0}
          />
        </Grid>

        {/* Contador de Colonias con Typography */}
        <Grid item xs={12} sm={6} display="flex" alignItems="center">
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Total de Colonias Encontradas: <strong>{filteredColonias.length}</strong>
          </Typography>
        </Grid>
      </Grid>

      {rangosArray.map((rango) => (
        <Accordion key={rango.rango}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {rango.rango} - {rango.count} Colonias
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {rango.colonias
                .sort((a, b) => b.total - a.total)
                .map((colonia, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: 1,
                        backgroundColor: 'rgba(128, 128, 128, 0.1)',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {colonia.colonia}
                      </Typography>
                      <Typography variant="body2">Cuentas: {colonia.cuentas}</Typography>
                      <Typography variant="body2">
                        Total: {colonia.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                      </Typography>
                      <Accordion
                        expanded={expandedColonia === colonia.colonia}
                        onChange={() => setExpandedColonia(expandedColonia === colonia.colonia ? null : colonia.colonia)}
                        sx={{ mt: 1 }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Detalles de Cuentas
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            {colonia.detalles
                              .sort((a, b) => b.total - a.total)
                              .map((detalle, idx) => (
                                <Grid item xs={12} key={idx}>
                                  <Box
                                    sx={{
                                      p: 1,
                                      border: '1px solid rgba(0, 0, 0, 0.1)',
                                      borderRadius: 1,
                                      backgroundColor: 'rgba(200, 200, 200, 0.1)',
                                    }}
                                  >
                                    <Typography variant="body2">Cuenta: {detalle.cuenta}</Typography>
                                    <Typography variant="body2">
                                      Total: {detalle.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default PaymentsPerColony;
