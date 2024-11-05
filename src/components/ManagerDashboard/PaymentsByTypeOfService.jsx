import React, { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import GetAppIcon from '@mui/icons-material/GetApp';
import * as ExcelJS from 'exceljs';
import TopColoniasChart from './PaymentsByTypeOfService/TopColoniasChart.jsx';
import { BarChart } from '@mui/icons-material';

function PaymentsByTypeOfService({ data }) {
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [topColoniasByType, setTopColoniasByType] = useState({});
  const [view, setView] = useState('list');

  useEffect(() => {
    if (data) {
      const types = [...new Set(data.map(item => item.tipo_servicio))].sort();
      setUniqueTypes(types);
    }
  }, [data]);

  const handleChipClick = (type) => {
    setSelectedTypes((prevSelected) =>
      prevSelected.includes(type)
        ? prevSelected.filter((t) => t !== type)
        : [...prevSelected, type]
    );

    setTopColoniasByType((prevTopColonias) => {
      if (prevTopColonias[type]) {
        const { [type]: _, ...rest } = prevTopColonias;
        return rest;
      } else {
        const coloniasSumadas = data
          .filter(item => item.tipo_servicio === type)
          .reduce((acc, item) => {
            if (!acc[item.colonia]) {
              acc[item.colonia] = { total: 0, count: 0 };
            }
            acc[item.colonia].total += item.total;
            acc[item.colonia].count += 1;
            return acc;
          }, {});

        const topColonias = Object.entries(coloniasSumadas)
          .map(([colonia, { total, count }]) => ({ colonia, total, count }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);

        return { ...prevTopColonias, [type]: topColonias };
      }
    });
  };

  const formatNumber = (num) => `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  const exportToExcel = async () => {
    if (selectedTypes.length === 0) {      
      return;
    }
  
    const workbook = new ExcelJS.Workbook();
  
    selectedTypes.forEach((type) => {
      const worksheet = workbook.addWorksheet(type);
  
      worksheet.columns = [
        { header: 'Colonia', key: 'colonia', width: 25 },
        { header: 'Cuentas', key: 'count', width: 10 },
        { header: 'Total', key: 'total', width: 15, style: { numFmt: '"$"#,##0.00_);("$"#,##0.00)' } },
      ];
  
      // Aplicar estilo a las cabeceras
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4F81BD' }, // Fondo azul para cabeceras
        };
      });
  
      // Obtener y ordenar todas las colonias por total de mayor a menor
      const allColonias = data
        .filter(item => item.tipo_servicio === type)
        .reduce((acc, item) => {
          if (!acc[item.colonia]) {
            acc[item.colonia] = { total: 0, count: 0 };
          }
          acc[item.colonia].total += item.total;
          acc[item.colonia].count += 1;
          return acc;
        }, {});
  
      const coloniaArray = Object.entries(allColonias)
        .map(([colonia, { total, count }]) => ({ colonia, total, count }))
        .sort((a, b) => b.total - a.total); // Ordenar por total de mayor a menor
  
      // Identificar las top 10 colonias para aplicar estilo de resaltado
      const top10Colonias = coloniaArray.slice(0, 10).map(colonia => colonia.colonia);
  
      // Agregar las colonias ordenadas al worksheet
      coloniaArray.forEach((colonia) => {
        const row = worksheet.addRow({
          colonia: colonia.colonia || 'Sin nombre',
          count: colonia.count,
          total: colonia.total,
        });
  
        // Aplicar color si es una de las top 10
        if (top10Colonias.includes(colonia.colonia)) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFD966' }, // Fondo amarillo para destacar top 10
            };
          });
        }
      });
    });
  
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PaymentsByTypeOfService.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };  

  return (
    <div>
      <h2>Payments By Type Of Service</h2>
      <Stack direction="row" spacing={1}>
        {uniqueTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            clickable
            color={selectedTypes.includes(type) ? 'primary' : 'default'}
            onClick={() => handleChipClick(type)}
          />
        ))}
      </Stack>

      <Box mt={2} mb={2} display="flex" justifyContent="space-between">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(event, newView) => setView(newView)}
          aria-label="view selection"
        >
          <ToggleButton value="list" aria-label="list view">
            <FormatListBulletedIcon style={{ marginRight: '8px' }} />
            Ver en Listado
          </ToggleButton>
          <ToggleButton value="chart" aria-label="chart view">
            <BarChart style={{ marginRight: '8px' }} />
            Ver en Gráfica
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcel}
          style={{ marginLeft: '16px' }}
          startIcon={<GetAppIcon />}
        >
          Exportar en Excel
        </Button>
      </Box>

      {selectedTypes.length > 0 && (
        <div>
          <h3>Top 10 Colonias for Each Selected Service Type</h3>
          {view === 'list' ? (
            <Grid container spacing={2}>
              {selectedTypes.map((type) => (
                <Grid item xs={12} sm={4} key={type}>
                  <Card variant="outlined" style={{ padding: '10px' }}>
                    <CardContent>
                      <Typography variant="h6" style={{ marginBottom: '8px' }}>
                        Tipo de Servicio: {type}
                      </Typography>
                      <List dense>
                        {topColoniasByType[type] && topColoniasByType[type].length > 0 ? (
                          topColoniasByType[type].map((colonia, index) => (
                            <ListItem key={colonia.colonia} style={{ padding: '4px 0' }}>
                              <ListItemText
                                primary={`${index + 1}. ${colonia.colonia || 'Sin nombre'}`}
                                secondary={
                                  <>
                                    <div>Cuentas: {colonia.count}</div>
                                    <div>Total: {formatNumber(colonia.total)}</div>
                                  </>
                                }
                              />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText primary="No hay colonias disponibles" />
                          </ListItem>
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {selectedTypes.map((type) => {
                const seriesData = topColoniasByType[type]?.map(colonia => ({
                  x: colonia.colonia || 'Sin nombre',
                  y: colonia.total,
                })) || [];

                return (
                  <Grid item xs={12} sm={6} key={type}>
                    <TopColoniasChart data={[{ id: type, data: seriesData }]} title={`Tipo de Servicio: ${type}`} />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentsByTypeOfService;
