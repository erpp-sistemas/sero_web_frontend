import React from 'react'
import { Box, useTheme, Typography } from "@mui/material"
import { tokens } from "../../../theme.js"
import ResponsiveLineChart from '../../../components/Charts/NivoCharts/ResponsiveLineChart.jsx'

function AmountDebitChart({ data }) {

  if (!data) {
		return null
	}

  const transformData = (data) => {    
    const groupedData = data.reduce((acc, curr) => {
      const { name_place, name_month, amount_debt } = curr;

      const truncatedMonth = name_month.slice(0, 3);
  
      if (!acc[name_place]) {
        acc[name_place] = [];
      }
  
      acc[name_place].push({
        x: truncatedMonth,
        y: amount_debt,
      });
  
      return acc;
    }, {});
  
    
    const transformedData = Object.keys(groupedData).map((key) => ({
      id: key,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
      data: groupedData[key],
    }));
  
    return transformedData;
  };  
  
  const formattedData = transformData(data);

  const theme = useTheme()
  const colors = tokens(theme.palette.mode) 

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
        MONTO DE ADEUDO
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
            lineColor={ colors.greenAccent[500] }
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

export default AmountDebitChart