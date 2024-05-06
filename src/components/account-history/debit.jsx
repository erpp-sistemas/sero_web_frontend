import React from 'react';
import { Card, CardContent, Typography, useTheme, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import { tokens } from '../../theme';
import Grid from '@mui/material/Grid'

const Debit = ({ debit }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const parsedDebit = Array.isArray(debit) ? debit : JSON.parse(debit);

    if (parsedDebit === null) {
      return (
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold'}}>
              <Divider>No se encontraron adeudos</Divider>
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
                <Divider>Adeudo</Divider>
              </Typography>
            </Grid>            
          </Grid>
          <Grid container spacing={2} >            
            {parsedDebit.map((debt, index) => (
              <Grid key={index} item xs={12} md={4}>
              <Card variant='outlined' sx={{ backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00' }}>
                <CardContent>                
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Monto de deuda
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(debt.debt_amount)}
                  </Typography>                   
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                    Fecha de actualizacion
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {debt.update_date ? new Date(debt.update_date).toLocaleDateString() : 'No disponible'}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                    Fecha de corte
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {debt.cutoff_date ? new Date(debt.cutoff_date).toLocaleDateString() : 'No disponible'}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                    Ultimo bimestre de pago
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {debt.last_two_month_payment ? debt.last_two_month_payment : 'No disponible'}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                    Ultima fecha de pago
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {debt.last_payment_date ? new Date(debt.last_payment_date).toLocaleDateString() : 'No disponible'}
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

export default Debit;