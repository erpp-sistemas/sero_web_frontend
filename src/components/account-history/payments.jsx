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
          display='flex'
          justifyContent='space-evenly'
          flexWrap='wrap'
          gap='20px'          
          padding='15px 10px'
          borderRadius='10px'
        >          
          <Grid container spacing={2} >            
            {parsedPayments.map((payment, index) => (
              <Grid key={index} item xs={12} md={4}>
              <Card variant='outlined' sx={{ backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00' }}>
                <CardContent>                
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Monto pagado
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(payment.amount_paid)}
                  </Typography>                   
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Fecha de pago
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'No disponible'}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Referencia
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {payment.reference ? payment.reference : "No disponible"}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Descripcion
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {payment.description ? payment.description : "No disponible"}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Periodo
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
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
