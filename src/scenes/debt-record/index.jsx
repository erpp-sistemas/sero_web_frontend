import React, { useState } from "react"
import Grid from '@mui/material/Grid'
import { tokens } from "../../theme"
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelectMultipleChip'
import MonthsOfDebtSelect from "../../components/MonthsOfDebtSelect.jsx"
import { trafficLightRequest, trafficLightByTypeRequest } from '../../api/trafficlight.js'
import { Box, useTheme, Button, Tooltip, IconButton} from "@mui/material"
import TextField from '@mui/material/TextField'
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import TrafficLightCountingProcedures from '../../components/TrafficLight/TrafficLightCountingProcedures.jsx'
import TrafficLightDebitProcedures from '../../components/TrafficLight/TrafficLightDebitProcedures.jsx'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'
import DownloadIcon from '@mui/icons-material/Download'
import * as ExcelJS from "exceljs"

const Index = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const [selectedPlace, setSelectedPlace] = useState('')
    const [selectedService, setSelectedService] = useState('')
    const [selectedProcess, setSelectedProcess] = useState([])  
    const [selectedDate, setSelectedDate] = useState('')  
    const [selectedMonth, setSelectedMonth] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertType, setAlertType] = useState("info")
    const [alertMessage, setAlertMessage] = useState("")
    const [result, setResult] = useState([])    

	const handlePlaceChange = (event) => {
		setSelectedPlace(event.target.value)
		setSelectedService('')  
        setSelectedProcess([])
        setSelectedMonth('')
	}

	const handleServiceChange = (event) => {
		setSelectedService(event.target.value)
		setSelectedProcess([])
        setSelectedMonth('')
	}

	const handleProcessChange = (event) => {        
		setSelectedProcess(Array.isArray(event.target.value) ? event.target.value : [event.target.value])
	}

	const handleDateChange = (event) => {
		setSelectedDate(event.target.value)
	}

    const handleMonthsChange = (event) => {
		setSelectedMonth(event.target.value)		
	}


	const handleGetTrafficLight = async () => {
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
				setAlertMessage("¡Error! Debes seleccionar uno o mas procesos")
				return
			}          
			else if(!selectedDate){
				setAlertOpen(true)
				setAlertType("error")
				setAlertMessage("¡Error! Debes seleccionar una fecha")
				return
			} 
            else if(!selectedMonth){
				setAlertOpen(true)
				setAlertType("error")
				setAlertMessage("¡Error! Debes seleccionar un mes")
				return
			}

            console.log(selectedMonth)

			setIsLoading(true)

			// const response = await trafficLightRequest(selectedPlace, selectedService, selectedProcess, selectedDate)

			
			// setResult(response.data)          
			setIsLoading(false)
			setAlertOpen(true)
			setAlertType("success")
			setAlertMessage("¡Felicidades! Se genero el proceso correctamente")
			
		} catch (error) {
			setIsLoading(false)
			if(error.response.status === 400){
				setAlertOpen(true)
				setAlertType("warning")
				setAlertMessage("¡Atencion! No se encontraron cuentas")
				setResult([])
			}    
			setResult([])
		}        
	}

	const formatNumber = (number) => {
		return number.toLocaleString()
    }

    const handleDownload = async (type, concept) => {
      
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
				setAlertMessage("¡Error! Debes seleccionar uno o mas procesos")
				return
			}          
			else if(!selectedDate){
				setAlertOpen(true)
				setAlertType("error")
				setAlertMessage("¡Error! Debes seleccionar una fecha")
				return
			}          
			setIsLoading(true)
			const response = await trafficLightByTypeRequest(selectedPlace, selectedService, selectedProcess, selectedDate, type);        
			exportToExcel(response.data, concept)
			setIsLoading(false)        
		} catch (error) {
			setIsLoading(false)
			if(error.response.status === 400){
				setAlertOpen(true)
				setAlertType("warning")
				setAlertMessage("¡Atencion! No se encontraron cuentas")
				setResult([])
			}    
			setResult([])
		}
    }

    const exportToExcel = async (data, concept) => {
      try {
        
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Registros Encontrados");
                      
          const headers = Object.keys(data[0]);
          worksheet.addRow(headers);              
          
          data.forEach(row => {
              const values = headers.map(header => row[header]);
              worksheet.addRow(values);
          });
  
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${concept}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          
      } catch (error) {
          console.error("Error:", error);
          return null;
      }
    };


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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <PlaceSelect                
                  selectedPlace={selectedPlace}
                  handlePlaceChange={handlePlaceChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ServiceSelect
                  selectedPlace={selectedPlace}                  
                  selectedService={selectedService}
                  handleServiceChange={handleServiceChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ProcessSelect
                  selectedPlace={selectedPlace}
                  selectedService={selectedService}
                  selectedProcess={selectedProcess}
                  handleProcessChange={handleProcessChange}
                />
              </Grid>
            </Grid>
            
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
              <Grid item xs={12} sm={4}>
                <TextField
                  id="date"
                  label="Fecha"
                  type="date"
                  sx={{ width: '100%' }}
                  value={selectedDate}
                  onChange={handleDateChange}                  
                  InputLabelProps={{
                    shrink: true,
                  }}                  
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MonthsOfDebtSelect
                  selectedPlace={selectedPlace}
                  selectedService={selectedService}
                  selectedMonth={selectedMonth}
                  handleMonthsChange={handleMonthsChange}
                />
              </Grid>              
              <Grid item xs={12} sm={4}>
                <Button 
                  variant="contained"                   
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => {
                    handleGetTrafficLight();                    
                  }}                  
                  sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                  >
                    <ManageSearchIcon fontSize="large"/>
                    Buscar                  
                </Button>
              </Grid>
              <Grid item xs={4}>

              </Grid>
            </Grid>         
            
          </Box>                 
          
        </Box>

    )

}

export default Index