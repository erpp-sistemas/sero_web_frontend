import * as React from 'react';
import { useState } from "react"
import { tokens } from "../../theme"
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelectMultipleChip'
import { Box, useTheme, Button } from "@mui/material"
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { CurrencyExchange, ManageSearch } from "@mui/icons-material"
import {managerDashboardRequest} from '../../api/manager.js'
import PaymentsPerColony from '../../components/ManagerDashboard/PaymentsPerColony.jsx'
import PaymentsByTypeOfService from '../../components/ManagerDashboard/PaymentsByTypeOfService.jsx'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';

function Index() {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [selectedPlace, setSelectedPlace] = useState('')
    const [selectedService, setSelectedService] = useState('')
    const [selectedProcess, setSelectedProcess] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState('')
    const [selectedFinishDate, setSelectedFinishDate] = useState('')
    const [paymentsPerColonyData, setPaymentsPerColonyData] = useState([])    
    const [paymentsByTypeOfServiceData, setPaymentsByTypeOfServiceData] = useState([]) 
    const [managerEfficiencyData, setManagerEfficiencyData] = useState([]) 
    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState("info")
    const [alertMessage, setAlertMessage] = useState("")
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

    const handlePlaceChange = (event) => {
		setSelectedPlace(event.target.value)
		setSelectedService('')
    }

    const handleServiceChange = (event) => {
		setSelectedService(event.target.value)
		setSelectedProcess([])
    }

    const handleProcessChange = (event) => {        
		setSelectedProcess(Array.isArray(event.target.value) ? event.target.value : [event.target.value]);
	}; 

    const handleStartDateChange = (event) => {
		setSelectedStartDate(event.target.value)
    }

    const handleFinishDateChange = (event) => {
		setSelectedFinishDate(event.target.value)
    }

    const handleGetCoordinationDashboard = async () => {

		setPaymentsByTypeOfServiceData([]);
		setManagerEfficiencyData([]);
      
      try {

        if(!selectedPlace){
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Debes seleccionar una plaza")
          return
        }
        else if(!selectedService){
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Debes seleccionar un servicio")
          return
        }
        else if(selectedProcess.length===0){
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Debes seleccionar un proceso")
          return
        }        
        else if(!selectedStartDate){
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Debes seleccionar una fecha de inicio")
          return
        }
        else if(!selectedFinishDate){
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Debes seleccionar una fecha final")
          return
        }

		setIsLoading(true)

        const response = await managerDashboardRequest(selectedPlace, selectedService, selectedProcess, selectedStartDate, selectedFinishDate)
        setPaymentsByTypeOfServiceData(JSON.parse(response.data[0].paymentsByTypeOfService))
        console.log(JSON.parse(response.data[0].managerEfficiency))
        
        setIsLoading(false)
        setAlertOpen(true)
        setAlertType("success")
        setAlertMessage("¡Felicidades! Se genero el proceso correctamente")
        
      } catch (error) {
        setIsLoading(false)        
      } 
       
    }    

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
				
				<LoadingModal open={isLoading}/>

				<CustomAlert
					alertOpen={alertOpen}
					type={alertType}
					message={alertMessage}
					onClose={setAlertOpen}
				/>

				<Grid container md={12} xs={12} spacing={2}>
					
					<Grid item xs={12} md={4}>
						<PlaceSelect                
							selectedPlace={selectedPlace}
							handlePlaceChange={handlePlaceChange}
						/>
					</Grid>

					<Grid item xs={12} md={4}>
						<ServiceSelect
							selectedPlace={selectedPlace}                  
							selectedService={selectedService}
							handleServiceChange={handleServiceChange}
						/>
					</Grid>

					<Grid item xs={12} md={4}>
						<ProcessSelect
							selectedPlace={selectedPlace}
							selectedService={selectedService}
							selectedProcess={selectedProcess}
							handleProcessChange={handleProcessChange}
             			 />
					</Grid>

				</Grid>

				<Grid xs={12} md={12} container  spacing={2}>
              
					<Grid item xs={12} md={4}>

						<TextField
							id="start-date"
							label="Fecha de inicio"
							type="date"
							sx={{ width: '100%' }}
							value={selectedStartDate}
							onChange={handleStartDateChange}                  
							InputLabelProps={{
								shrink: true,
							}}                  
						/>
					</Grid>

					<Grid item xs={12} md={4}>

						<TextField
							id="finish-date"
							label="Fecha final"
							type="date"
							sx={{ width: '100%' }}
							value={selectedFinishDate}
							onChange={handleFinishDateChange}                  
							InputLabelProps={{
								shrink: true,
							}}
						/>

					</Grid>

					<Grid item xs={12} md={4}>

						<Button 
							variant="contained"                   
							style={{ width: '100%', height: '100%' }}
							onClick={() => {
								handleGetCoordinationDashboard();                    
							}}                  
							sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
						>
							<ManageSearch fontSize="large"/>
							Buscar                  
						</Button>

					</Grid>
				
				</Grid>

				<Grid container spacing={2}>
          <Grid item xs={12}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="icon label tabs example"
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
            >
              <Tab icon={<CurrencyExchange />} label="PAGOS POR TIPO DE SERVICIO" />
              <Tab icon={<FavoriteIcon />} label="FAVORITES" />
              <Tab icon={<PersonPinIcon />} label="NEARBY" />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            {value === 0 && (
              <PaymentsByTypeOfService data={paymentsByTypeOfServiceData} />
            )}
            {/* Aquí puedes condicionalmente renderizar otros componentes si es necesario */}
          </Grid>
        </Grid>
			</Box>

		</Box>

	)

}

export default Index