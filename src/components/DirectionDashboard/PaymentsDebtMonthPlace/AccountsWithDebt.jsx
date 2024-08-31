import React from 'react'
import { Box, useTheme, Typography } from "@mui/material"
import { tokens } from "../../../theme.js"
import ResponsiveBarChart from '../../../components/Charts/NivoCharts/ResponsiveBarChart.jsx'

function AccountsWithDebtChart({ data }) {

  if (!data) {
		return null
	}  

  const theme = useTheme()
  const colors = tokens(theme.palette.mode) 

  const transformData = (data) => {
    return data.map((item) => ({
        month: item.name_month.slice(0, 3),
        account: item.account_debt,
        accountColor: colors.greenAccent[500]
    }));
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
        CUENTAS CON ADEUDO
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
            barColor={ colors.greenAccent[500] }
            showLegend={ false }
            tooltipFormat={value => `${value.toLocaleString()}`}
            margin = {{ top: 30, right: 30, bottom: 50, left: 75 }}
            backgroundColor="paper"    
            keys={['account']}
            indexBy="month"
            axisBottomLegend="Mes"
            axisLeftLegend="Cuentas"
            axisLeftLegendOffset={ -60 }
            showBarValues={ false }
          />
				)}

			</Box>

		</Box>
  )
}

export default AccountsWithDebtChart