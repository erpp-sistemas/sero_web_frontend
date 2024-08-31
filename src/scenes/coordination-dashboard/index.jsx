import React, { useState } from "react"
import { tokens } from "../../theme"
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelect'
import { Box, useTheme, Button } from "@mui/material"
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { ManageSearch } from "@mui/icons-material"
import {coordinationDashboardRequest} from '../../api/coordination.js'
import RowOne from '../../components/CoordinationDashboard/RowOne.jsx'
import DataGridManagementByManager from '../../components/CoordinationDashboard/DataGridManagementByManager.jsx'
import ManagedTask from '../../components/CoordinationDashboard/ManagedTask.jsx'
import LocationStatus from '../../components/CoordinationDashboard/LocationStatus.jsx'
import TypeService from '../../components/CoordinationDashboard/TypeService.jsx'
import TypeProperty from '../../components/CoordinationDashboard/TypeProperty.jsx'
import DailyManagement from '../../components/CoordinationDashboard/DailyManagement.jsx'
import DailyWorkSummary from '../../components/CoordinationDashboard/DailyWorkSummary.jsx'
import PaymentsProcedures from '../../components/CoordinationDashboard/PaymentsProcedures.jsx'
import PaymentsProceduresByTypeService from '../../components/CoordinationDashboard/PaymentsProceduresByTypeService.jsx'
import PaymentsProceduresByManager from '../../components/CoordinationDashboard/PaymentsProceduresByManager.jsx'
import DailyManagementNotPhoto from '../../components/CoordinationDashboard/DailyManagementNotPhoto.jsx'
import BatteryMeter from '../../components/CoordinationDashboard/BatteryMeter.jsx'
import VerifiedAddress from '../../components/CoordinationDashboard/VerifiedAddress.jsx'

function Index() {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [selectedPlace, setSelectedPlace] = useState('')
    const [selectedService, setSelectedService] = useState('')
    const [selectedProcess, setSelectedProcess] = useState('')
    const [selectedStartDate, setSelectedStartDate] = React.useState('')
    const [selectedFinishDate, setSelectedFinishDate] = React.useState('')
    const [result, setResult] = useState([])
    const [rowOneData, setRowOneData] = useState([]) 
    const [lineMonthData, setLineMonthData] = useState([])
    const [lineWeekData, setLineWeekData] = useState([])
    const [lineDayData, setLineDayData] = useState([])
    const [dataGridData, setDataGridData] = useState([])
    const [pieManagementByTypeData, setPieManagementByTypeData] = useState([])
    const [pieManagementByLocationData, setPieManagementByLocationData] = useState([])
    const [barStackData , setBarStackData] = useState([])
    const [managedTaskData , setManagedTaskData] = useState([])
    const [locationStatusData , setLocationStatusData] = useState([])
    const [typeServiceData , setTypeServiceData] = useState([])
    const [typePropertyData , setTypePropertyData] = useState([])
    const [dailyManagementData , setDailyManagementData] = useState([])
    const [dailyWorkSummaryData , setDailyWorkSummaryData] = useState([])
    const [typeDailyManagementData , setTypeDailyManagementData] = useState('month')
    const [paymentsProceduresData , setPaymentsProceduresData] = useState([])
    const [paymentsProceduresByTypeServiceData , setPaymentsProceduresByTypeServiceData] = useState([])
    const [paymentsProceduresByManagerData , setPaymentsProceduresByManagerData] = useState([])
    const [dailyManagementNotPhotoData , setDailyManagementNotPhotoData] = useState([])
	const [batteryMeterData , setBatteryMeterData] = useState([])  
	const [verifiedAddressData , setVerifiedAddressData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState("info")
    const [alertMessage, setAlertMessage] = useState("")

    const handlePlaceChange = (event) => {
		setSelectedPlace(event.target.value)
		setSelectedService('')
    }

    const handleServiceChange = (event) => {
		setSelectedService(event.target.value)
		setSelectedProcess('')
    }

    const handleProcessChange = (event) => {        
		setSelectedProcess(event.target.value)
    }

    const handleStartDateChange = (event) => {
		setSelectedStartDate(event.target.value)
    }

    const handleFinishDateChange = (event) => {
		setSelectedFinishDate(event.target.value)
    }

    const handleGetCoordinationDashboard = async () => {

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

			const typeConcept = selectedStartDate === selectedFinishDate ? 'hour' : 'month';
			setTypeDailyManagementData(typeConcept)
			setIsLoading(true)       
			const response = await coordinationDashboardRequest(selectedPlace, selectedService, selectedProcess, selectedStartDate, selectedFinishDate)
			setRowOneData(JSON.parse(response.data[0].row_one))
			setLineMonthData(JSON.parse(response.data[0].LineMonthNumberOFTotalProcedures))
			setLineWeekData(JSON.parse(response.data[0].LineWeekNumberOFTotalProcedures))
			setLineDayData(JSON.parse(response.data[0].LineDayNumberOFTotalProcedures))
			setDataGridData(JSON.parse(response.data[0].DataGridManagementByManager))
			setPieManagementByTypeData(JSON.parse(response.data[0].PieManagementByTypeOfService))
			setPieManagementByLocationData(JSON.parse(response.data[0].PieManagementByLocationStatus))
			setBarStackData(JSON.parse(response.data[0].BarStackManagementsByManagerAndLocationStatus))
			setManagedTaskData(JSON.parse(response.data[0].ManagedTask))
			setLocationStatusData(JSON.parse(response.data[0].LocationStatus))
			setTypeServiceData(JSON.parse(response.data[0].TypeService))
			setTypePropertyData(JSON.parse(response.data[0].TypeProperty))
			setDailyManagementData(JSON.parse(response.data[0].DailyManagement))
			setDailyWorkSummaryData(JSON.parse(response.data[0].DailyWorkSummary))
			setPaymentsProceduresData(JSON.parse(response.data[0].PaymentsProcedures))
			setPaymentsProceduresByTypeServiceData(JSON.parse(response.data[0].PaymentsProceduresByTypeService))
			setPaymentsProceduresByManagerData(JSON.parse(response.data[0].PaymentsProceduresByManager))
			setDailyManagementNotPhotoData(JSON.parse(response.data[0].DailyManagementNotPhoto))
			setBatteryMeterData(JSON.parse(response.data[0].BatteryMeter))
			setVerifiedAddressData(JSON.parse(response.data[0].VerifiedAddress))			
			setResult(response.data)
			setIsLoading(false)
			setAlertOpen(true)
			setAlertType("success")
			setAlertMessage("¡Felicidades! Se genero el proceso correctamente")
			
		} catch (error) {
			setIsLoading(false)
			if(error.response.status === 400){
				setAlertOpen(true)
				setAlertType("warning")
				setAlertMessage("¡Atencion! No se encontraron pagos")
				setResult([])
			}      
			setResult([])
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

				<Grid container xs={12} md={12} spacing={2}>

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

				<Grid xs={12} md={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>     
         
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

				{result.length > 0 && (

					<>
						<Grid container justifyContent="space-between" alignItems="stretch" spacing={2}>
							<RowOne 
								data={rowOneData}
								placeId={ selectedPlace } 
								serviceId={ selectedService }
								proccessId={ selectedProcess }
								startDate={ selectedStartDate }
								finishDate={ selectedFinishDate }
							/>
						</Grid>

						<Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
							<Grid item xs={12}>
								<DailyManagement data={ dailyManagementData } typeConcept={ typeDailyManagementData }/>
							</Grid>
						</Grid>

						<Grid item xs={12} md={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>

							<Grid item xs={12} md={6}>
								<DailyManagementNotPhoto data={ dailyManagementNotPhotoData } typeConcept={ typeDailyManagementData }/>
							</Grid>

							<Grid item xs={12} md={6}>
								<DataGridManagementByManager data={ dataGridData }/>
							</Grid>

						</Grid>

						<Grid  container justifyContent="space-between" alignItems="stretch" spacing={2}>

							<Grid item xs={12} md={6}>
								<ManagedTask data= {managedTaskData} />
							</Grid>

							<Grid item xs={12} md={6}>
								<LocationStatus data={ locationStatusData }/>
							</Grid>

						</Grid>

						<Grid container justifyContent="space-between" alignItems="stretch" spacing={2}>

							<Grid item xs={12} md={6}>
								<TypeService data={ typeServiceData } />
							</Grid>

							<Grid item xs={12} md={6}>
								<TypeProperty data={ typePropertyData } />
							</Grid>

						</Grid>

						<Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>

							<Grid item xs={12}>
								<DailyWorkSummary 
									data={ dailyWorkSummaryData } 
									placeId={ selectedPlace } 
									serviceId={ selectedService }
									proccessId={ selectedProcess }
								/>
							</Grid>

						</Grid>

						<Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>

							<Grid item xs={12}>    
								<PaymentsProcedures data={ paymentsProceduresData} />
							</Grid>

						</Grid>

						<Grid item xs={12} md={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>

							<Grid item xs={12} md={6}>    
								<PaymentsProceduresByTypeService data={ paymentsProceduresByTypeServiceData } />
							</Grid>

							<Grid item xs={12} md={6}>
								<PaymentsProceduresByManager data={ paymentsProceduresByManagerData }/>
							</Grid>

						</Grid>

						<Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
							<Grid item xs={12}>
								<BatteryMeter data={ batteryMeterData}/>
							</Grid>
						</Grid>
						
						<Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
							<Grid item xs={12}>
								<VerifiedAddress 
									data={ verifiedAddressData }
									placeId={ selectedPlace } 
									serviceId={ selectedService }
									proccessId={ selectedProcess }
                  />
							</Grid>
						</Grid>					

					</>

				)}

			</Box>

		</Box>

	)

}

export default Index