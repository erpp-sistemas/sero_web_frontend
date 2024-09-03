import React from 'react'
import { Box, useTheme, Typography } from "@mui/material"
import { tokens } from "../../../theme.js"
import ResponsiveLineChart from '../../../components/Charts/NivoCharts/ResponsiveLineChart.jsx'

function AmountPaidChart({ data }) {

  if (!data) {
		return null
	}

  const theme = useTheme()
  const colors = tokens(theme.palette.mode) 

  const transformData = (data) => {
    const groupedData = data.reduce((acc, curr) => {
      const { name_place, name_month, amount_paid, amount_paid_valid } = curr;

      const truncatedMonth = name_month.slice(0, 3);

      if (!acc[name_place]) {
        acc[name_place] = {
          paid: [],
          paid_valid: []
        };
      }

      // Agregar amount_paid a la serie 'paid'
      if (amount_paid !== null && amount_paid !== undefined) {
        acc[name_place].paid.push({
          x: truncatedMonth,
          y: amount_paid,
        });
      }

      // Agregar amount_paid_valid a la serie 'paid_valid'
      if (amount_paid_valid !== null && amount_paid_valid !== undefined) {
        acc[name_place].paid_valid.push({
          x: truncatedMonth,
          y: amount_paid_valid,
        });
      }

      return acc;
    }, {});

    // Unificar las series en un formato similar a AmountDebitChart
    const transformedData = Object.keys(groupedData).flatMap((key) => [
      {
        id: `${key} - Pagado`,
        color: colors.greenAccent[500],
        data: groupedData[key].paid,
      },
      {
        id: `${key} - Pagado Válido`,
        color: colors.blueAccent[500],
        data: groupedData[key].paid_valid,
      },
    ]);

    return transformedData;
  };
  
  const formattedData = transformData(data);

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
        MONTO PAGADO
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
        <ResponsiveLineChart 
            data={ formattedData }            
            showLegend={ false }
            tooltipFormat="$,.2f"
            margin = {{ top: 30, right: 30, bottom: 50, left: 100 }}
            axisBottomLegend="Mes"
            axisLeftLegend="Monto"
            axisLeftLegendOffset={ -85 }
            backgroundColor="paper"
            enableArea = { true }
            areaOpacity = { 0.3 }
            areaBaselineValue = { 0 }
          />
				)}

			</Box>

		</Box>
  )
}

export default AmountPaidChart