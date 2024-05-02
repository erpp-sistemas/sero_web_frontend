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
              <Card variant='outlined' sx={{ bgcolor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[50]}}>
                <CardContent>                
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Monto de deuda</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(debt.debt_amount)}
                  </Typography>                   
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Fecha de actualizacion</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {debt.update_date ? new Date(debt.update_date).toLocaleDateString() : 'No disponible'}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Fecha de corte</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {debt.cutoff_date ? new Date(debt.cutoff_date).toLocaleDateString() : 'No disponible'}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Ultimo bimestre de pago</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {debt.last_two_month_payment ? debt.last_two_month_payment : 'No disponible'}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Ultima fecha de pago</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
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