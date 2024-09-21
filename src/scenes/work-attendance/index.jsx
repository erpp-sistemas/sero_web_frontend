import React, { useState } from "react"
import Grid from '@mui/material/Grid'
import { tokens } from "../../theme"
import PlaceSelect from '../../components/PlaceSelect'
import {workAttendanceRequest} from '../../api/attendance.js'
import { Box, useTheme, Button } from "@mui/material"

import TextField from '@mui/material/TextField'
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import GeneralAttendanceReport from '../../components/work-attendance/GeneralAttendanceReport/GeneralAttendanceReport.jsx'

const Index = () => {
    
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [users, setUsers] = useState([])
	const [generalAttendanceReportData, setGeneralAttendanceReportData] = useState([])	
	const [reportWorkHoursData, setReportWorkHoursData] = useState([])	
    const [selectedPlace, setSelectedPlace] = useState('')
    const [selectedStartDate, setSelectedStartDate] = useState('')
    const [selectedEndDate, setSelectedEndDate] = useState('')
    const [noData, setNoData] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState("info")
    const [alertMessage, setAlertMessage] = useState("")    
    
    

	const handlePlaceChange = (event) => {
		setNoData('')
		setSelectedPlace(event.target.value)
	}

	const handleStartDateChange = (event) => {
		setNoData('')
		setSelectedStartDate(event.target.value)
	}

	const handleEndDateChange = (event) => {
		setNoData('')
		setSelectedEndDate(event.target.value)
	}

	const handleGetWorkAttendance = async () => {
		try {

			if(!selectedPlace){
			setAlertOpen(true)
			setAlertType("error")
			setAlertMessage("¡Error! Debes seleccionar una plaza")
			return
			}
			else if(!selectedStartDate){
			setAlertOpen(true)
			setAlertType("error")
			setAlertMessage("¡Error! Debes seleccionar una fecha de inicio")
			return
			}
			else if(!selectedEndDate){
			setAlertOpen(true)
			setAlertType("error")
			setAlertMessage("¡Error! Debes seleccionar una fecha final")
			return
			}

			setIsLoading(true)

			const response = await workAttendanceRequest(selectedPlace, selectedStartDate, selectedEndDate);
		
			setNoData('')
			setUsers(JSON.parse(response.data[0].GeneralAttendanceReport));
			setGeneralAttendanceReportData(JSON.parse(response.data[0].GeneralAttendanceReport))
			setReportWorkHoursData(JSON.parse(response.data[0].ReportWorkHours))
			
			setIsLoading(false)

      const responseData = response.data[0].GeneralAttendanceReport;

      if (responseData === null) {
        setAlertOpen(true)
        setAlertType("warning")
        setAlertMessage("¡Lo sentimos! No se encontraron resultados")
      } else {
          try {
            setAlertOpen(true)
            setAlertType("success")
            setAlertMessage("¡Felicidades! Se genero el proceso correctamente")
          } catch (error) {
              console.error('Error al parsear JSON:', error);
          }
      }      
			
		} catch (error) {
			setIsLoading(false)

      console.log(error)

			if(error.response.status === 400){
			setAlertOpen(true)
			setAlertType("warning")
			setAlertMessage("¡Atencion! No se encontraron asistencias")
			setUsers([]);
			}   
		setUsers([]);
			
		}        
	}

    return (
        <Box sx={{ margin:'20px' }}>
        <LoadingModal open={isLoading}/>
        <CustomAlert
          alertOpen={alertOpen}
          type={alertType}
          message={alertMessage}
          onClose={setAlertOpen}
        />
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

            <Grid item xs={12} md={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={12} md={3}>              
                <PlaceSelect                
                  selectedPlace={selectedPlace}
                  handlePlaceChange={handlePlaceChange}
                />              
              </Grid>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <TextField
                  id="finish-date"
                  label="Fecha final"
                  type="date"
                  sx={{ width: '100%' }}
                  value={selectedEndDate}
                  onChange={handleEndDateChange}                  
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => {
                    handleGetWorkAttendance();                    
                  }}
                  >
                  <ManageSearchIcon fontSize="large"/>
                  Buscar
                </Button>
              </Grid>
            </Grid>

              <Grid item xs={12} md={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={12} md={12}>
                  <GeneralAttendanceReport data={ generalAttendanceReportData } reportWorkHoursData= { reportWorkHoursData } />
                </Grid>
              </Grid>
              
          </Box>
        </Box>

    );
};
export default Index;