// TopColoniasChart.jsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../../theme.js';
import ResponsiveLineChart from '../../../components/Charts/NivoCharts/ResponsiveLineChart.jsx'

function TopColoniasChart({ data, title }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) {
    return null;
  }

  const chartColor = title.includes('Total') ? colors.greenAccent[500] : colors.blueAccent[500];
  const formatTooltip = title.includes('Total') ? "$,.2f" : "#,.0f";
  const axisLeftLegendTitle = title.includes('Total') ? "Total" : "Cuentas"
  const axisLeftFormat = title.includes('Total')
    ? (value) => `$${value.toLocaleString()}`  // Formato con signo de pesos y comas
    : (value) => value.toString();

  const formattedData = data.map((item) => ({
    ...item,
    color: chartColor,
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '400px',
        p: 2,
        borderRadius: '10px',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: chartColor,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(128, 128, 128, 0.1)',
          borderRadius: '10px',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {data.length > 0 && (
        <ResponsiveLineChart 
            data={ formattedData }
            lineColor={ colors.greenAccent[500] }
            showLegend={ false }
            tooltipFormat= {formatTooltip}
            margin = {{ top: 30, right: 120, bottom: 150, left: 100 }}
            axisBottomLegend=""
            axisLeftLegend= {axisLeftLegendTitle}
            axisLeftLegendOffset={ -85 }
            backgroundColor="paper"
            enableArea = { true }
            areaOpacity = { 0.3 }
            areaBaselineValue = { 0 }
            tickRotation = { 45 }
            axisLeftFormat = {axisLeftFormat}
          />
        )}
      </Box>
    </Box>
  );
}

export default TopColoniasChart;
