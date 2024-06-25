import React from 'react';
import { Card, CardContent, Typography, useTheme, InputAdornment, Divider, CardMedia } from '@mui/material';
import Box from '@mui/material/Box';
import { tokens } from '../../theme';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import MapboxMap from '../../components/account-history/google-map.jsx'
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import { LocationOff } from '@mui/icons-material';

const AccountDetails = ({ accountDetails }) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (accountDetails.length === 0) {
    return (
      <Grid item container xs={12}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', color: 'secondary'}}>
            <Divider>No se encontraron detalle de la cuenta</Divider>
          </Typography>
        </Grid>            
      </Grid>
      
    );
  }

  // const mapComponent = accountDetails.latitude > 0 ? (
  //   <GoogleMaps latitude={accountDetails.latitude} longitude={accountDetails.longitude}/>              
  // ) : (
  //   <Grid item container xs={12}>
  //     <Grid item xs={12}>
  //       <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', color: 'secondary'}}>
  //         <Divider><span><LocationOff sx={{ fontSize: '42px', color: 'orange' }}/></span>Sin geolocalizacion</Divider>
  //       </Typography>
  //     </Grid>            
  //   </Grid>    
  // );

  return (
    <div>       
       <Box
            m='20px 0'
            display='flex'
            justifyContent='space-evenly'
            flexWrap='wrap'
            gap='20px'
            sx={{ backgroundColor: colors.primary[400], width: '100%' }}
            padding='5px 10px'
            borderRadius='10px'
        >
          <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                disabled
                label="Cuenta"              
                value={accountDetails.account}              
                color='info'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon  sx={{ color: 'info.main' }}/>
                    </InputAdornment>
                  ),                  
                }}         
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                disabled
                label="Propietario"
                value={accountDetails.owner_name}              
                color='info'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon  sx={{ color: 'info.main' }}/>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>                       
          </Grid>
          <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                disabled
                label="Tipo de servicio"
                value={accountDetails.type_service ? accountDetails.type_service : "- - - - - - - - - -"}              
                color='info'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RoomPreferencesIcon  sx={{ color: 'secondary.main' }}/>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid> 
            <Grid item xs={3}>
            <TextField
                fullWidth
                disabled
                label="Tipo de tarifa"              
                value={accountDetails.rate_type ? accountDetails.rate_type : "- - - - - - - - - -"}
                color='info'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RoomPreferencesIcon  sx={{ color: 'secondary.main' }}/>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3}>
            <TextField
                fullWidth
                disabled
                label="Giro"              
                value={accountDetails.turn ? accountDetails.turn : "- - - - - - - - - -"}
                color='info'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RoomPreferencesIcon  sx={{ color: 'secondary.main' }}/>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                disabled
                label="Seria del medidor"
                value={accountDetails.meter_series ? accountDetails.meter_series : "- - - - - - - - - -"}                
                color='info'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RoomPreferencesIcon  sx={{ color: 'secondary.main' }}/>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid item container xs={12}>
            <Grid item xs={12}>
              <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold', fontSize: '2rem'}}>
                <Divider>Direccion</Divider>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={8}>
              <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    disabled
                    label="Direccion"
                    value={accountDetails.street ? accountDetails.street : "- - - - - - - - - -"}              
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>                 
              </Grid>
              <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} paddingTop={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="Numero exterior"
                    value={accountDetails.outdoor_number ? accountDetails.outdoor_number : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid> 
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="Numero interior"
                    value={accountDetails.interior_number ? accountDetails.interior_number : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} paddingTop={2}>
                <Grid item xs={6}>
                <TextField
                    fullWidth
                    disabled
                    label="Colonia"
                    value={accountDetails.cologne ? accountDetails.cologne : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="Manzana"
                    value={accountDetails.square ? accountDetails.square : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} paddingTop={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="Lote"
                    value={accountDetails.allotment ? accountDetails.allotment : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="Entre calle 1"
                    value={accountDetails.between_street_1 ? accountDetails.between_street_1 : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} paddingTop={2}>                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="Entre calle 2"
                    value={accountDetails.between_street_2 ? accountDetails.between_street_2 : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="Referencia"
                    value={accountDetails.reference ? accountDetails.reference : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} paddingTop={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="poblacion"
                    value={accountDetails.town ? accountDetails.town : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="Codigo postal"
                    value={accountDetails.postal_code ? accountDetails.postal_code : "- - - - - - - - - -"}
                    color='info'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapsHomeWorkIcon sx={{ color: 'warning.main' }}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>                
              </Grid>
            </Grid>
            <Grid item xs={4}>              
                <MapboxMap latitude={accountDetails.latitude} longitude={accountDetails.longitude}/>                 
            </Grid>
          </Grid>          
        </Box>      
    </div>
  );
}

export default AccountDetails;
