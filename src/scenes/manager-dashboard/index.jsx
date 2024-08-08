import React, { useState, useEffect } from "react";
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelect'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ManageSearch, Newspaper } from "@mui/icons-material";
import {coordinationDashboardRequest} from '../../api/coordination.js'
import MonthlyPayments from '../../components/ManagerDashboard/MonthlyPayments.jsx'
import { monthlyPaymentsData} from '../../data/manager-dashboard.js'

function index() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedProcess, setSelectedProcess] = useState('');
    const [selectedStartDate, setSelectedStartDate] = React.useState('');
    const [selectedFinishDate, setSelectedFinishDate] = React.useState('');
    const [typeMonthlyPaymentsData, setTypeMonthlyPaymentsData] = useState('month');    

    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");

    const handlePlaceChange = (event) => {
      setSelectedPlace(event.target.value);  
      setSelectedService('')
    };

    const handleServiceChange = (event) => {
      setSelectedService(event.target.value);
      setSelectedProcess('')
    };

    const handleProcessChange = (event) => {        
      setSelectedProcess(event.target.value)
    };

    const handleStartDateChange = (event) => {
      setSelectedStartDate(event.target.value);
    };

    const handleFinishDateChange = (event) => {
      setSelectedFinishDate(event.target.value);
    };

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
        setTypeMonthlyPaymentsData(typeConcept);

        setIsLoading(true)

        
        
        setIsLoading(false)

        setAlertOpen(true)
        setAlertType("success")
        setAlertMessage("¡Felicidades! Se genero el proceso correctamente")
        
      } catch (error) {
        setIsLoading(false)        
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
              <Grid item xs={4}>
                <PlaceSelect                
                  selectedPlace={selectedPlace}
                  handlePlaceChange={handlePlaceChange}
                />
              </Grid>
              <Grid item xs={4}>
                <ServiceSelect
                  selectedPlace={selectedPlace}                  
                  selectedService={selectedService}
                  handleServiceChange={handleServiceChange}
                />
              </Grid>
              <Grid item xs={4}>
                <ProcessSelect
                  selectedPlace={selectedPlace}
                  selectedService={selectedService}
                  selectedProcess={selectedProcess}
                  handleProcessChange={handleProcessChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
              <Grid item xs={4}>
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
              <Grid item xs={4}>
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
              <Grid item xs={4}>
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
              {/* {result.length > 0 && ( */}
              <>
                <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                  <Grid item xs={12}>
                    <MonthlyPayments data={ monthlyPaymentsData } typeConcept={ typeMonthlyPaymentsData }/>
                  </Grid>
                </Grid>
                
              </>
            {/* )} */}
          </Box>
    </Box>
  )
}

export default index