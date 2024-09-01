import React from 'react'
import { Box, useTheme, Typography } from "@mui/material"
import { tokens } from "../../../theme.js"
import ResponsiveBarChart from '../../../components/Charts/NivoCharts/ResponsiveBarChart.jsx'

function ReportedPaymentsAndValidPaymentsChart({ data }) {

  if (!data) {
		return null
}  
  const theme = useTheme()
  const colors = tokens(theme.palette.mode) 

  const formatData = (data) => {    
    const uniqueMonths = new Set();
    
    const filteredData = data.filter((item) => {
      const isDuplicate = uniqueMonths.has(item.name_month);
      uniqueMonths.add(item.name_month);
      return !isDuplicate;
    });
    
    return filteredData.map((item) => ({
      month: item.name_month.slice(0, 3),
      payments: item.number_payments,
      paymentsColor: colors.greenAccent[500],
      paymentsValid: item.number_payments_valid,
      paymentsValidColor: colors.blueAccent[500]
    }));
  };
  
  const formattedData = formatData(data);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '300px',
        p: 1,
        borderRadius: '10px',
        gridColumn: 'span 6'      
      }}
    >
       <Typography 
        variant="h6" 
        sx={{           
          color: "#5EBFFF",
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        PAGOS REGISTRADOS Y PAGOS VALIDOS
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
        overflow: 'hidden'        
      }}
    >
    {formattedData.length > 0 && (
        <ResponsiveBarChart 
            data={ formattedData }
            barColor={({ id, data }) => data[`${id}Color`]}
            showLegend={ true }
            tooltipFormat={value => `${value.toLocaleString()}`}
            margin = {{ top: 30, right: 130, bottom: 50, left: 75 }}
            backgroundColor="paper"    
            keys={['payments', 'paymentsValid']}
            indexBy="month"
            axisBottomLegend="Mes"
            axisLeftLegend="Pagos"
            axisLeftLegendOffset={ -60 }
            showBarValues={ false }
            groupMode="grouped"            
          />
        )}

        </Box>

    </Box>
  )
}

export default ReportedPaymentsAndValidPaymentsChart