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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { AddAPhoto, ContactEmergency, CreditScore, DirectionsBike, Savings } from "@mui/icons-material";


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
        
        //const parsedPayments = Array.isArray(response.data[0].payments) ? response.data[0].payments : JSON.parse(response.data[0].payments);

        setInformationUser(response.data)
        
        //const parsedPayments = Array.isArray(response.data.payments) ? response.data.payments : JSON.parse(response.data.payments);

        setIsLoading(false)

      } catch (error) {
        setIsLoading(false)

          if(error.response.status === 400){
            setAlertOpen(true)
            setAlertType("warning")
            setAlertMessage("¡Atencion! La cuenta no existe")
            setInformationUser([]);
          }
          else{
            return
          }
        
        setInformationUser([]);
      }
    }

    const handleGeneratePDF = () => {
		<PDFGenerator informationUser={informationUser} />
    }

    const [value, setValue] = React.useState(0);

    const handleChangeTab = (event, newValue) => {
      setValue(newValue);
    };

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
          </Grid>

          <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} >
            <Grid item xs={12}>
              <Tabs 
              value={value}
              onChange={handleChangeTab}
              aria-label="icon label tabs example"
              textColor="secondary"
              indicatorColor="secondary"
              variant="fullWidth"
              sx={{ backgroundColor: 'rgba(128, 128, 128, 0.1)'}}
              >
                <Tab icon={<ContactEmergency />} label="Informacion General"/>
                <Tab icon={<CreditScore />} label="Pagos"/>
                <Tab icon={<Savings />} label="Deuda" />
                <Tab icon={<DirectionsBike />} label="Acciones"/>
                <Tab icon={<AddAPhoto />} label="Fotografias"/>
              </Tabs>
            </Grid> 
            
            <Grid item xs={12}>            
              {value === 0 && (
                <Box>
                  {informationUser.map((data, index) => (
                    <div key={index}>
                      <AccountDetails accountDetails={data} />                
                    </div>
                  ))}                  
                </Box>
              )}
              {value === 1 && (
                <Box>                
                  {informationUser.map((data, index) => (
                    <div key={index}>                     
                      <Payments payments={data.payments} />                      
                    </div>
                  ))}
                </Box>
              )}              
              {value === 2 && (
                <Box>                
                  {informationUser.map((data, index) => (
                    <div key={index}>                      
                      <Debit debit={data.debit} />                      
                    </div>
                  ))}
                </Box>
              )}
               {value === 3 && (
                <Box>                
                  {informationUser.map((data, index) => (
                    <div key={index}>                      
                      <Actions action={data.action} />                      
                    </div>
                  ))}
                </Box>
              )}
               {value === 4 && (
                <Box>                
                  {informationUser.map((data, index) => (
                    <div key={index}>                     
                      <Photos photo={data.photo} />
                    </div>
                  ))}
                </Box>
              )}              
            </Grid>           
          </Grid>           
          
        </Box>
    </>
  )
}

export default Index