import React from 'react'
import { Box, useTheme, Typography } from "@mui/material"
import { tokens } from "../../../theme.js"
import ResponsiveBarChart from '../../../components/Charts/NivoCharts/ResponsiveBarChart.jsx'

function RecordsAndAccountsWithPayment({ data }) {

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
      account: item.account_payments,
      accountColor: colors.greenAccent[500],
      records: item.number_payments,
      recordsColor: colors.blueAccent[500]
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
        REGISTROS Y CUENTAS CON PAGO
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
            margin = {{ top: 30, right: 100, bottom: 50, left: 75 }}
            backgroundColor="paper"    
            keys={['account', 'records']}
            indexBy="month"
            axisBottomLegend="Mes"
            axisLeftLegend="Cuentas"
            axisLeftLegendOffset={ -60 }
            showBarValues={ false }
            groupMode="grouped"            
          />
        )}

        </Box>

    </Box>
  )
}

export default RecordsAndAccountsWithPayment