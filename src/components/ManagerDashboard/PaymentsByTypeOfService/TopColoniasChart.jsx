// TopColoniasChart.jsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { tokens } from '../../../theme.js';
import ResponsiveLineChart from '../../../components/Charts/NivoCharts/ResponsiveLineChart.jsx'

function TopColoniasChart({ data, title }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) {
    return null;
  }

  const formattedData = data.map((item) => ({
    ...item,
    color: colors.greenAccent[500],
  }));

  console.log(data)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '400px',
        p: 1,
        borderRadius: '10px',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: colors.greenAccent[500],
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
            tooltipFormat="$,.2f"
            margin = {{ top: 30, right: 120, bottom: 150, left: 100 }}
            axisBottomLegend="colonia"
            axisLeftLegend="total"
            axisLeftLegendOffset={ -85 }
            backgroundColor="paper"
            enableArea = { true }
            areaOpacity = { 0.3 }
            areaBaselineValue = { 0 }
            tickRotation = { 45 }
          />
        )}
      </Box>
    </Box>
  );
}

export default TopColoniasChart;
