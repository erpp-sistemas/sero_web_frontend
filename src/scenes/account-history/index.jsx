import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, InputAdornment } from '@mui/material'
import { tokens } from '../../theme';
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import PlaceSelect from '../../components/PlaceSelect'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import TextField from '@mui/material/TextField';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { AccountHistoryRequest } from '../../api/account.js'
import AccountDetails from '../../components/account-history/account-details.jsx'
import Payments from '../../components/account-history/payments.jsx'
import Debit from '../../components/account-history/debit.jsx'
import Actions from '../../components/account-history/actions.jsx'
import Photos from '../../components/account-history/photos.jsx'
import PDFGenerator from '../../components/account-history/pdf-generator.jsx'

import Header from '../../components/Header';
import AccountHistoryModule from '../../components/AccountHistoryModule';

const Index = () => {
  const user = useSelector(state => state.user)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  
    
    const [informationUser, setInformationUser] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState('');
    const [account, setAccount] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");

    const handlePlaceChange = (event) => {      
      setSelectedPlace(event.target.value);
    };  

    const handleChange  = (event) => {
      setAccount(event.target.value);
    };

    const handleGetAccount = async () =>{
      try {
        if(!selectedPlace){
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Debes seleccionar una plaza")
          return
        }
        else if(!account){
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Debes ingresar una cuenta")
          return
        }

        setIsLoading(true)

        const response = await AccountHistoryRequest(selectedPlace, account);
        
        console.log(response.data)

        setInformationUser(response.data)
        setIsLoading(false)

      } catch (error) {
        setIsLoading(false)

          if(error.response.status === 400){
            console.log(error.response.status)
            console.log('estamos en el error 400')
            setAlertOpen(true)
            setAlertType("warning")
            setAlertMessage("¡Atencion! La cuenta no existe")
            setInformationUser([]);
          }
        console.log([error.response.data.message])        
        setInformationUser([]);
      }
    }

    const handleGeneratePDF = () => {
      
      console.log("Generando PDF...", informationUser);
      
      <PDFGenerator informationUser={informationUser} />
    };

    console.log(selectedPlace)
    console.log(account)

  return (
    <>
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
            padding='15px 10px'
            borderRadius='10px'
        >
          <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={4}> 
              <PlaceSelect                
                selectedPlace={selectedPlace}
                handlePlaceChange={handlePlaceChange}
              /> 
            </Grid>
            <Grid item xs={4}> 
              <TextField
                fullWidth
                label="Ingresa una cuenta"  
                value={account}              
                onChange={handleChange}              
                color='info'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3}> 
              <Button 
                variant="contained" 
                sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                style={{ width: '100%', height: '100%' }}
                onClick={() => {
                  handleGetAccount();                    
                }}
                >
                <ManageSearchIcon fontSize="large"/>
                Buscar
              </Button>
            </Grid>
            <Grid item xs={1}> 
              <Button 
                variant="contained" 
                sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                style={{ width: '100%', height: '100%' }}
                onClick={handleGeneratePDF}
                >
                  Genera Pdf
                <ManageSearchIcon fontSize="large"/>                
              </Button>
            </Grid>
          </Grid> 
          <Grid item xs={12}>
          {informationUser.map((data, index) => (
            <div key={index}>
              <AccountDetails accountDetails={data} />
              <Payments payments={data.payments} />
              <Debit debit={data.debit} />
              <Actions action={data.action} />
              <Photos photo={data.photo} />
            </div>
          ))}
          </Grid>
        </Box>
    </>
  )
}

export default Index