import React, { useEffect, useState } from 'react';
import { 
          Box, 
          Grid, 
          Typography, 
          useTheme, 
          Chip, 
          TableContainer, 
          Table, 
          Paper, 
          TableHead,
          TableRow,
          TableCell,
          TableBody          
         } 
from '@mui/material';
import buildColumns from '../../components/DirectionDashboard/PaymentsDebtMonthPlace/buildColumns.jsx'
import { tokens } from "../../theme"
import AmountDebitChart from '../../components/DirectionDashboard/PaymentsDebtMonthPlace/AmountDebitChart.jsx'
import AccountsWithDebtChart from '../../components/DirectionDashboard/PaymentsDebtMonthPlace/AccountsWithDebt.jsx'                                         
import { CalendarMonth, DesignServices, Public } from '@mui/icons-material';

function PaymentsDebtMonthPlace({ data }) {
   if (!data || data.length === 0) {
    return (
      <Typography variant="h6" color="textSecondary">
        No data available
      </Typography>
    );
  }

  const theme = useTheme()
	const colors = tokens(theme.palette.mode)

  const [filteredData, setFilteredData] = useState(data);
  const [uniquePlaces, setUniquePlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [uniqueServices, setUniqueServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const useBuildColumns = buildColumns();   

    useEffect(() => {    
      const places = [...new Set(data.map(item => item.name_place))];
      places.sort();
      setUniquePlaces(places);
      if (places.length > 0) {
        setSelectedPlace(places[0]);
      }
    }, [data]);  
    
    useEffect(() => {
      if (selectedPlace) {
        const years = [...new Set(data.filter(item => item.name_place === selectedPlace).map(item => item.year_number))];
        years.sort((a, b) => a - b);
        setUniqueYears(years);
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      }
    }, [selectedPlace, data]);  
    
    useEffect(() => {
      if (selectedPlace && selectedYear) {
        const services = [...new Set(data.filter(item => item.name_place === selectedPlace && item.year_number === selectedYear).map(item => item.name_service))];
        services.sort();
        setUniqueServices(services);
        if (services.length > 0) {
          setSelectedService(services[0]);
        }
      }
    }, [selectedPlace, selectedYear, data]);  
    
    useEffect(() => {
      if (selectedPlace && selectedYear && selectedService) {
        const filtered = data.filter(item => 
          item.name_place === selectedPlace &&
          item.year_number === selectedYear &&
          item.name_service === selectedService
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(data);
      }
    }, [selectedPlace, selectedYear, selectedService, data]);
  
    const handlePlaceChange = (place) => {
      setSelectedPlace(place);
      setSelectedService(null);
      setSelectedYear(null);
    };
  
    const handleYearChange = (year) => {
      setSelectedYear(year);
      setSelectedService(null);
    };
  
    const handleServiceChange = (service) => {
      setSelectedService(service);
    };

    const totals = filteredData.reduce((acc, item) => {
      acc.account_debt += item.account_debt || 0;
      acc.amount_debt += item.amount_debt || 0;
      acc.number_payments += item.number_payments || 0;
      acc.account_payments += item.account_payments || 0;
      acc.amount_paid += item.amount_paid || 0;
      return acc;
    }, {
      account_debt: 0,
      amount_debt: 0,
      number_payments: 0,
      account_payments: 0,
      amount_paid: 0
    });
  

  return (
    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="auto"
      gap="15px"
    >
      
      <Box
        sx={{ 
          cursor: 'pointer',
          gridColumn:'span 12',
          backgroundColor:'rgba(128, 128, 128, 0.1)',
          borderRadius:"10px",				
			  }}
      >         
        <Grid container justifyContent="space-between" alignItems="stretch">
          <Grid item>
            {uniquePlaces.map(place => (
              <Chip
                key={place}
                label={place}
                onClick={() => handlePlaceChange(place)}
                color={place === selectedPlace ? 'secondary' : 'default'}
                sx={{ margin: 1 }}
                icon={<Public/>}
              />
            ))}
          </Grid>
        </Grid>
        
        <Grid container justifyContent="space-between" alignItems="stretch">
          <Grid item>
            {uniqueServices.map(service => (
              <Chip
                key={service}
                label={service}
                onClick={() => handleServiceChange(service)}
                color={service === selectedService ? 'secondary' : 'default'}
                sx={{ margin: 1 }}
                icon={<DesignServices/>}
              />
            ))}
          </Grid>
        </Grid>

        <Grid container justifyContent="space-between" alignItems="stretch">
          <Grid item>
            {uniqueYears.map(year => (
              <Chip
                key={year}
                label={year}
                onClick={() => handleYearChange(year)}
                color={year === selectedYear ? 'secondary' : 'default'}
                sx={{ margin: 1 }}
                icon={<CalendarMonth/>}
              />
            ))}
          </Grid>
        </Grid>

        <Typography
         variant="h4" 
         align="center" 
         sx={{ 
          color: "#5EBFFF",
          fontWeight: 'bold',
          textAlign: 'center'
        }}
         >
          ADEUDOS Y PAGOS
        </Typography>

      {filteredData.length > 0 && (
        <>
          <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" sx={{ padding: 1 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {useBuildColumns.map((column) => (
                      <TableCell 
                        key={column.field} 
                        style={{ minWidth: column.minWidth }}
                        align={column.headerAlign || 'left'}
                      >
                        {column.renderHeader ? column.renderHeader() : column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, index) => (
                    <TableRow key={index}>
                      {useBuildColumns.map((column) => (
                        <TableCell key={column.field}>
                         {column.renderCell ? column.renderCell(row[column.field]) : row[column.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
                <TableBody>
                  <TableRow 
                    sx={{
                      borderTop: `4px solid ${colors.greenAccent[500]}`, 
                      fontWeight: 'bold',
                      backgroundColor: colors.primary[400]                      
                    }}
                  >
                    <TableCell 
                      colSpan={3}
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Totales
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {totals.account_debt.toLocaleString('es-MX')}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {totals.amount_debt.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {totals.number_payments.toLocaleString('es-MX')}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {totals.account_payments.toLocaleString('es-MX')}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {totals.amount_paid.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid container justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={12} md={6}>
              <AccountsWithDebtChart data={ filteredData } />
            </Grid>
            <Grid item xs={12} md={6}>
              <AmountDebitChart data={ filteredData } />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  </Box>
  );
}

export default PaymentsDebtMonthPlace;
