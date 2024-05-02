import React from 'react';
import { Card, CardContent, Typography, useTheme, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import { tokens } from '../../theme';
import Grid from '@mui/material/Grid'

const Payments = ({ payments }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const parsedPayments = Array.isArray(payments) ? payments : JSON.parse(payments);

    if (parsedPayments === null) {
      return (
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold'}}>
              <Divider>No se encontraron pagos</Divider>
            </Typography>
          </Grid>            
        </Grid>
        
      );
    }

  return (
    <div>
        <Box
          m='20px 0'
          display='flex'
          justifyContent='space-evenly'
          flexWrap='wrap'
          gap='20px'          
          padding='15px 10px'
          borderRadius='10px'
        >
          <Grid item container xs={12}>
            <Grid item xs={12}>
              <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold', fontSize: '2rem'}}>
                <Divider>Pagos</Divider>
              </Typography>
            </Grid>            
          </Grid>
          <Grid container spacing={2} >            
            {parsedPayments.map((payment, index) => (
              <Grid key={index} item xs={12} md={4}>
              <Card variant='outlined' sx={{ bgcolor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[50]}}>
                <CardContent>                
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Monto pagado</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(payment.amount_paid)}
                  </Typography>                   
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Fecha de pago</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'No disponible'}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Referencia</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {payment.reference ? payment.reference : "No disponible"}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Descripcion</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {payment.description ? payment.description : "No disponible"}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Periodo</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {payment.payment_period ? payment.payment_period : "no disponible"}
                  </Typography>
                </CardContent>                 
              </Card>
            </Grid>
            ))}
          </Grid>           
        </Box>
    </div>
  );
};

export default Payments;
