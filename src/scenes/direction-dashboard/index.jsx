import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { directionDashboardRequest } from '../../api/direction.js';
import { DataGrid } from '@mui/x-data-grid'
import { Box, Grid, Typography } from '@mui/material'

function index() {

  const user = useSelector((state) => state.user);
  const [paymentsDebtMonthPlaceData, setPaymentsDebtMonthPlaceData] = useState([]);

  useEffect(() => {
    async function loadDirectionDashboard() {
      const response = await directionDashboardRequest(user.user_id);
      setPaymentsDebtMonthPlaceData(JSON.parse(response.data[0].payments_debt_month_place));
      console.log(JSON.parse(response.data[0].payments_debt_month_place))
    }

    loadDirectionDashboard();
  }, []);

  const buildColumns = () => {   
		const columns = [
			{ 
				field: 'name_place',
				renderHeader: () => (
					<strong style={{ color: "#5EBFFF" }}>{"Plaza"}</strong>
				),
				width: 270,
				editable: false,
				
			}, 
			{ 
				field: 'name_service',
				renderHeader: () => (
					<strong style={{ color: "#5EBFFF" }}>{"Servicio"}</strong>
				),
				width: 80,
				editable: false,				
			}, 
			{ 
				field: 'name_month',
				renderHeader: () => (
					<strong style={{ color: "#5EBFFF" }}>{"Mes"}</strong>
				),
				width: 100,
				editable: false,				
			}, 
			{ 
				field: 'year_number',
				renderHeader: () => (
					<strong style={{ color: "#5EBFFF" }}>{"Año"}</strong>
				),
				width: 120,
				editable: false,				
			},      
		]
		return columns
	}

  return (
    <Box
			id="grid-1"
			display="grid"
			gridTemplateColumns="repeat(12, 1fr)"
			gridAutoRows="480px"
			gap="15px"
		>   

			<Box
				gridColumn='span 12'
				backgroundColor='rgba(128, 128, 128, 0.1)'
				borderRadius="10px"
				sx={{ cursor: 'pointer' }}
			>
				{paymentsDebtMonthPlaceData.length > 0 && (
				<>
					<Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} >
						<Grid item xs={12}>
						<Typography 
              variant="h4" 
              align="center" 
              sx={{ fontWeight: 'bold', paddingTop: 1 }}
            >
							Adeudo y Pagos
						</Typography>
						</Grid>					
					</Grid>
					<Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
					<Grid item xs={12} style={{ height: 400, width: '100%' }}>         
						<DataGrid
							rows={ paymentsDebtMonthPlaceData }
							columns={buildColumns()}
							getRowId={(row) => `${row.name_db}-${row.month_number}-${row.year_number}-${row.name_service}`}
							editable={false}                 
							autoPageSize
						/>
					</Grid>
					</Grid>
				</>
				)}  
			</Box>

		</Box>
  )
}

export default index