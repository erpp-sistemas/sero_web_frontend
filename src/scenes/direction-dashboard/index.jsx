import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { directionDashboardRequest } from '../../api/direction.js';
import { DataGrid } from '@mui/x-data-grid'
import { Box, Grid, useTheme } from '@mui/material'
import { tokens } from "../../theme"
import PaymentsDebtMonthPlace from '../../components/DirectionDashboard/paymentsDebtMonthPlace.jsx'
import LoadingModal from '../../components/LoadingModal.jsx'


function index() {

  const theme = useTheme()
	const colors = tokens(theme.palette.mode)
  const [isLoading, setIsLoading] = useState(false)

  const user = useSelector((state) => state.user);
  const [paymentsDebtMonthPlaceData, setPaymentsDebtMonthPlaceData] = useState([]);
  const [managementsPlaceServiceProccessData, setManagementsPlaceServiceProccessData] = useState([]);

  useEffect(() => {
    async function loadDirectionDashboard() {
      setIsLoading(true)   
      const response = await directionDashboardRequest(user.user_id);
      setPaymentsDebtMonthPlaceData(JSON.parse(response.data[0].payments_debt_month_place));
      setManagementsPlaceServiceProccessData(JSON.parse(response.data[0].managements_place_service_proccess))
      console.log(JSON.parse(response.data[0].managements_place_service_proccess))
      setIsLoading(false)   
    }

    loadDirectionDashboard();
  }, []); 

  return (
    <Box sx={{ margin:'20px' }}>

			<Box
				m='20px 0'
				display='flex'
				justifyContent='space-evenly'
				flexWrap='wrap'
				gap='20px'
				sx={{ backgroundColor: colors.primary[400], width: '100%' }}
				padding='15px'
				borderRadius='10px'
			>
      <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} >
        <Grid item xs={12}>
          <PaymentsDebtMonthPlace 
            paymentsDebtMonthPlaceData={paymentsDebtMonthPlaceData} 
            managementsPlaceServiceProccessData={managementsPlaceServiceProccessData} 
          /> 
        </Grid>        
      </Grid>				 
			</Box>
      <LoadingModal open={isLoading}/>
		</Box>    
  )
}

export default index