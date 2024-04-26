import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelectMultipleChip'
import { validPaymentRequest } from '../../api/payment.js'
import { useSelector } from 'react-redux'
import { Box, useTheme, Button} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import EventIcon from '@mui/icons-material/Event';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import * as ExcelJS from "exceljs";
import LoadingModal from '../../components/LoadingModal.jsx'
import { CardActionArea } from '@mui/material';
import CustomAlert from '../../components/CustomAlert.jsx'

const Index = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = useSelector(state => state.user)    
    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedProcess, setSelectedProcess] = useState([]);
    const [selectedValidDays, setSelectedValidDays] = React.useState('');
    const [selectedStartDate, setSelectedStartDate] = React.useState('');
    const [selectedFinishDate, setSelectedFinishDate] = React.useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const [result, setResult] = useState([]);
    const [countResult, setCountResult] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [countUniqueAccount, setCountUniqueAccount] = useState(0);
    const [countValidProcedures, setCountValidProcedures] = useState(0);
    const [countInvalidProcedures, setCountInvalidProcedures] = useState(0);
    const [percentageValidProcedures, setPercentageValidProcedures] = useState(0);
    const [percentageInvalidProcedures, setPercentageInvalidProcedures] = useState(0);
    const [amountValidProcedures, setAmountValidProcedures] = useState(0);
    const [amountInvalidProcedures, setAmountInvalidProcedures] = useState(0);
    const [percentageAmountValidProcedures, setPercentageAmountValidProcedures] = useState(0);
    const [percentageAmountInvalidProcedures, setPercentageAmountInvalidProcedures] = useState(0);
    const [countNoPosition, setCountNoPosition] = useState(0);
    const [percentageCountNoPosition, setPercentageCountNoPosition] = useState(0);
    const [countWithoutPropertyPhoto, setCountWithoutPropertyPhoto] = useState(0);
    const [countWithoutEvidencePhoto, setCountWithoutEvidencePhoto] = useState(0);
    const [countPropertyNotLocated, setCountPropertyNotLocated] = useState(0);
    const [percentageCountWithoutPropertyPhoto, setPercentageCountWithoutPropertyPhoto] = useState(0);
    const [percentageCountWithoutEvidencePhoto, setPercentageCountWithoutEvidencePhoto] = useState(0);
    const [percentageCountPropertyNotLocated, setPercentageCountPropertyNotLocated] = useState(0);

      const handlePlaceChange = (event) => {
        setSelectedPlace(event.target.value);  
        setSelectedService('');      
      };

      const handleServiceChange = (event) => {
        setSelectedService(event.target.value);
        setSelectedProcess([])
      };

      const handleProcessChange = (event) => {        
        setSelectedProcess(Array.isArray(event.target.value) ? event.target.value : [event.target.value]);
      };      

      const handleValidDaysChange = (event) => {
        setSelectedValidDays(event.target.value);
      };

      const handleStartDateChange = (event) => {
        setSelectedStartDate(event.target.value);
      };

      const handleFinishDateChange = (event) => {
        setSelectedFinishDate(event.target.value);
      };

      const handleGetValidPayment = async () => {
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
          else if(!selectedValidDays){
            setAlertOpen(true)
            setAlertType("error")
            setAlertMessage("¡Error! Debes seleccionar un rango de dias")
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

          setIsLoading(true)
          
          const concatenatedValues = selectedProcess.join(', ');
          
          console.log('proceso concatenado', concatenatedValues);
          const type = 1

          const response = await validPaymentRequest(selectedPlace, selectedService, selectedProcess,selectedValidDays, selectedStartDate, selectedFinishDate, type);
          console.log(response)

          setResult(response.data)

          let countPayments = 0

          let totalSum = 0;
          const uniqueAccounts = new Set();
          
          let validaCount = 0;
          let noValidaCount = 0;

          let validaTotal = 0;
          let noValidaTotal = 0;

          let countLatitudCeroAndValid = 0;

          let countFotoFachadaNoAndValid = 0;
          let countFotoEvidenciaNoAndValid = 0;
          let countEstatusPredioNoLocalizadoAndValid = 0;
          
          response.data.forEach(item => {
            totalSum += item.gran_total;
            uniqueAccounts.add(item.cuenta);

            if (item['estatus de gestion valida'] === 'valida') {
              validaCount++;
              validaTotal += item.gran_total

              if (item.latitud === 0) {
                countLatitudCeroAndValid++;
              }

              if (item['foto fachada predio'] === 'no') {
                countFotoFachadaNoAndValid++;
              }
              
              if (item['foto evidencia predio'] === 'no') {
                  countFotoEvidenciaNoAndValid++;
              }

              if (item['estatus_predio'] !== 'Predio localizado') {
                  countEstatusPredioNoLocalizadoAndValid++;
              }

            } else {
                noValidaCount++;
                noValidaTotal += item.gran_total
            }
          });

          countPayments = response.data.length          
          totalSum = Number(totalSum.toFixed(2));          

          const uniqueCount = uniqueAccounts.size;

          const validaPercentage = (validaCount / countPayments) * 100;
          const noValidaPercentage = (noValidaCount / countPayments) * 100;          

          const totalValidaPercentage = (validaTotal / totalSum) * 100;
          const totalNoValidaPercentage = (noValidaTotal / totalSum) * 100;
          
          const noPositionPercentage = (countLatitudCeroAndValid / countPayments) * 100

          const fotoFachadaNoAndValidPercentage = (countFotoFachadaNoAndValid / countPayments) * 100
          const fotoEvidenciaNoAndValidPercentage = (countFotoEvidenciaNoAndValid / countPayments) * 100
          const estatusPredioNoLocalizadoAndValidPercentage = (countEstatusPredioNoLocalizadoAndValid / countPayments) * 100

          setCountResult(countPayments.toLocaleString())
          setTotalAmount(totalSum.toLocaleString())
          setCountUniqueAccount(uniqueCount.toLocaleString())
          setCountValidProcedures(validaCount.toLocaleString())
          setCountInvalidProcedures(noValidaCount.toLocaleString())
          setPercentageValidProcedures(validaPercentage.toFixed(2))
          setPercentageInvalidProcedures(noValidaPercentage.toFixed(2))
          setAmountValidProcedures(validaTotal.toLocaleString())
          setAmountInvalidProcedures(noValidaTotal.toLocaleString())
          setPercentageAmountValidProcedures(totalValidaPercentage.toFixed(2))
          setPercentageAmountInvalidProcedures(totalNoValidaPercentage.toFixed(2))
          setCountNoPosition(countLatitudCeroAndValid.toLocaleString())
          setPercentageCountNoPosition(noPositionPercentage.toFixed(2))
          setCountWithoutPropertyPhoto(countFotoFachadaNoAndValid.toLocaleString())
          setCountWithoutEvidencePhoto(countFotoEvidenciaNoAndValid.toLocaleString())
          setCountPropertyNotLocated(countEstatusPredioNoLocalizadoAndValid.toLocaleString())
          setPercentageCountWithoutPropertyPhoto(fotoFachadaNoAndValidPercentage.toFixed(2))
          setPercentageCountWithoutEvidencePhoto(fotoEvidenciaNoAndValidPercentage.toFixed(2))
          setPercentageCountPropertyNotLocated(estatusPredioNoLocalizadoAndValidPercentage.toFixed(2))

          setIsLoading(false)

          setAlertOpen(true)
          setAlertType("success")
          setAlertMessage("¡Felicidades! Se genero el proceso correctamente")
          
        } catch (error) {
          setIsLoading(false)
          console.error("Error:", error);
          
        }        
      };

      const handleExportToExcel = async (filter) => {
        try {
          setIsLoading(true)
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Registros Encontrados");
                        
            const headers = Object.keys(result[0]);
            worksheet.addRow(headers);
                
            if(filter === 1)
            {
              result.forEach(row => {
                  const values = headers.map(header => row[header]);
                  worksheet.addRow(values);
              });
            }
            else if(filter === 2)
            {
              result.forEach(row => {
                if (row['estatus de gestion valida'] === 'valida')
                {
                  const values = headers.map(header => row[header]);
                  worksheet.addRow(values);
                }                
              });
            }
            else if(filter === 3)
            {
              result.forEach(row => {
                if (row['estatus de gestion valida'] !== 'valida')
                {
                  const values = headers.map(header => row[header]);
                  worksheet.addRow(values);
                }                
              });
            }
            else if(filter === 4)
            {
              result.forEach(row => {
                if (row['estatus de gestion valida'] === 'valida')
                {
                  if (row.latitud === 0)
                  {
                    const values = headers.map(header => row[header]);
                    worksheet.addRow(values);
                  }
                }                
              });
            }
            else if(filter === 5)
            {
              result.forEach(row => {
                if (row['estatus de gestion valida'] === 'valida')
                {
                  if (row['foto fachada predio'] === 'no')
                  {
                    const values = headers.map(header => row[header]);
                    worksheet.addRow(values);
                  }
                }                
              });
            }
            else if(filter === 6)
            {
              result.forEach(row => {
                if (row['estatus de gestion valida'] === 'valida')
                {
                  if (row['foto evidencia predio'] === 'no')
                  {
                    const values = headers.map(header => row[header]);
                    worksheet.addRow(values);
                  }
                }                
              });
            }
            else if(filter === 7)
            {
              result.forEach(row => {
                if (row['estatus de gestion valida'] === 'valida')
                {
                  if (row['estatus_predio'] !== 'Predio localizado')
                  {
                    const values = headers.map(header => row[header]);
                    worksheet.addRow(values);
                  }
                }                
              });
            }
    
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "users.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
            setIsLoading(false)
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };


      console.log('place_id', selectedPlace)
      console.log('service_id',selectedService)      
      console.log('process_id', selectedProcess)
      console.log('days', selectedValidDays)
      console.log('start_date', selectedStartDate)
      console.log('finish_date', selectedFinishDate)
      console.log('isLoading', isLoading)



    return (
        <>
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
              <Grid item xs={3}>
                <FormControl variant="filled" sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-standard-label">Numero de dias antes del pago:</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedValidDays}
                    onChange={handleValidDaysChange}
                    label="Days"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={30}>30 dias</MenuItem>
                    <MenuItem value={60}>60 dias</MenuItem>
                    <MenuItem value={90}>90 dias</MenuItem>
                    <MenuItem value={120}>120 dias</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="start-date"
                  label="Fecha de inicio"
                  type="date"
                  sx={{ width: '100%' }}
                  value={selectedStartDate}
                  onChange={handleStartDateChange}
                  defaultValue="2023-01-01"                 
                  InputLabelProps={{
                    shrink: true,
                  }}
                  IInputProps={{
                    endAdornment: (
                      <InputAdornment position="end"  style={{ color: 'green' }} >
                        <EventIcon/>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="finish-date"
                  label="Fecha final"
                  type="date"
                  sx={{ width: '100%' }}
                  value={selectedFinishDate}
                  onChange={handleFinishDateChange}
                  defaultValue="2023-01-01"                 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button 
                  variant="contained"                   
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => {
                    handleGetValidPayment();                    
                  }}                  
                  sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                  >
                  Generar
                </Button>
              </Grid>
            </Grid>            
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={4}>
                <Card 
                  variant="outlined" 
                  sx={{ maxWidth: 360 }} 
                  onClick={() => {
                    if (result.length > 0) {
                        handleExportToExcel(1);                    
                    } else {                        
                        console.log("No hay datos para exportar");
                    }
                  }}
                >
                <CardActionArea>
                  <Box sx={{ p: 2, textAlign: 'center' }}>                    
                    <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                        {countResult}
                    </Typography>
                    <Typography variant="h5" component="div" color={'secondary'}>
                        Registros Encontrados
                    </Typography>
                  </Box>
                  </CardActionArea>
                </Card>                
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ maxWidth: 360 }}>
                  <Box sx={{ p: 2, textAlign: 'center'  }}>
                    <Typography  variant="h2" component="div" sx={{ textAlign: 'center' }}>
                      {countUniqueAccount}
                    </Typography>
                    <Typography variant="h5" component="div" color={'secondary'}>
                      Cuentas Unicas
                    </Typography>
                  </Box>
                  <Divider />                  
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ maxWidth: 360 }}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>                    
                    <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                      $ {totalAmount}
                    </Typography>
                    <Typography variant="h5" component="div" color={'secondary'}>
                      Monto ingresado
                    </Typography>                    
                  </Box>
                  <Divider />                  
                </Card>
              </Grid>              
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={3}>
                <Card 
                  variant="outlined" 
                  sx={{ maxWidth: 360 }}
                  onClick={() => {
                    if (result.length > 0) {
                        handleExportToExcel(2);                    
                    } else {                        
                        console.log("No hay datos para exportar");
                    }
                  }}
                  >
                  <CardActionArea>
                  <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                      {countValidProcedures}
                    </Typography>
                    <Typography variant="h5" component="div" color={'secondary'}>
                      Gestiones Validas
                    </Typography>                    
                  </Box>                  
                  <Box sx={{ display: 'flex', alignItems: 'center', p : 1 }}>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress color="secondary" variant="determinate" value={percentageValidProcedures} sx={{ height: 12}} />
                    </Box>
                    <Box sx={{ minWidth: 35, pl: 1, pr: 1 }}>
                      <Typography variant="body2" color="text.secondary">{`${percentageValidProcedures}%`}</Typography>
                    </Box>
                  </Box>
                </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card 
                  variant="outlined" 
                  sx={{ maxWidth: 360 }}
                  onClick={() => {
                    if (result.length > 0) {
                        handleExportToExcel(3);
                    } else {                        
                        console.log("No hay datos para exportar");
                    }
                  }}
                  >
                  <CardActionArea>
                    <Box sx={{ p: 1, textAlign: 'center' }}>                    
                      <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                        {countInvalidProcedures}
                      </Typography>
                      <Typography variant="h5" component="div" color={'secondary'}>
                        Gestiones No Validas
                      </Typography>                    
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', p : 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress color="warning" variant="determinate" value={percentageInvalidProcedures} sx={{ height: 12}} />
                      </Box>
                      <Box sx={{ minWidth: 35, pl: 1, pr: 1 }}>
                        <Typography variant="body2" color="text.secondary">{`${percentageInvalidProcedures}%`}</Typography>
                      </Box>
                    </Box>
                  </CardActionArea>                 
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card variant="outlined" sx={{ maxWidth: 360 }}>
                  <Box sx={{ p: 1, textAlign: 'center' }}>                    
                    <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                      $ {amountValidProcedures}
                    </Typography>
                    <Typography variant="h5" component="div" color={'secondary'}>
                      Monto de gestiones validas
                    </Typography>                    
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', p : 1 }}>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress color="secondary" variant="determinate" value={percentageAmountValidProcedures} sx={{ height: 12}} />
                    </Box>
                    <Box sx={{ minWidth: 35, pl: 1, pr: 1 }}>
                      <Typography variant="body2" color="text.secondary">{`${percentageAmountValidProcedures}%`}</Typography>
                    </Box>
                  </Box>                 
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card variant="outlined" sx={{ maxWidth: 360 }}>
                  <Box sx={{ p: 1, textAlign: 'center' }}>                    
                    <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                      $ {amountInvalidProcedures}
                    </Typography>
                    <Typography variant="h5" component="div" color={'secondary'}>
                      Monto de gestiones no validas
                    </Typography>                    
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', p : 1 }}>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress color="warning" variant="determinate" value={percentageAmountInvalidProcedures} sx={{ height: 12}} />
                    </Box>
                    <Box sx={{ minWidth: 35, pl: 1, pr: 1 }}>
                      <Typography variant="body2" color="text.secondary">{`${percentageAmountInvalidProcedures}%`}</Typography>
                    </Box>
                  </Box>                 
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={3}>
                  <Card 
                    variant="outlined" 
                    sx={{ maxWidth: 360 }}
                    onClick={() => {
                      if (result.length > 0) {
                          handleExportToExcel(4);
                      } else {                        
                          console.log("No hay datos para exportar");
                      }
                    }}
                    >
                    <CardActionArea>
                      <Box sx={{ p: 1, textAlign: 'center' }}>                    
                        <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                          {countNoPosition}
                        </Typography>
                        <Typography variant="h5" component="div" color={'secondary'}>
                          Registros sin posicion
                        </Typography>                    
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', p : 1 }}>
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress color="error" variant="determinate" value={percentageCountNoPosition} sx={{ height: 12}} />
                        </Box>
                        <Box sx={{ minWidth: 35, pl: 1, pr: 1 }}>
                          <Typography variant="body2" color="text.secondary">{`${percentageCountNoPosition}%`}</Typography>
                        </Box>
                      </Box>
                    </CardActionArea>
                  </Card>
              </Grid>
              <Grid item xs={3}>
                <Card 
                  variant="outlined" 
                  sx={{ maxWidth: 360 }}
                  onClick={() => {
                    if (result.length > 0) {
                        handleExportToExcel(5);
                    } else {                        
                        console.log("No hay datos para exportar");
                    }
                  }}
                >
                  <CardActionArea>
                    <Box sx={{ p: 1, textAlign: 'center' }}>                    
                      <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                        {countWithoutPropertyPhoto}
                      </Typography>
                      <Typography variant="h5" component="div" color={'secondary'}>
                        Registros sin foto de fachada
                      </Typography>                    
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', p : 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress color="error" variant="determinate" value={percentageCountWithoutPropertyPhoto} sx={{ height: 12}} />
                      </Box>
                      <Box sx={{ minWidth: 35, pl: 1, pr: 1 }}>
                        <Typography variant="body2" color="text.secondary">{`${percentageCountWithoutPropertyPhoto}%`}</Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card 
                  variant="outlined" 
                  sx={{ maxWidth: 360 }}
                  onClick={() => {
                    if (result.length > 0) {
                        handleExportToExcel(6);
                    } else {                        
                        console.log("No hay datos para exportar");
                    }
                  }}
                  >
                  <CardActionArea>
                    <Box sx={{ p: 1, textAlign: 'center' }}>                    
                      <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                        {countWithoutEvidencePhoto}
                      </Typography>
                      <Typography variant="h5" component="div" color={'secondary'}>
                        Registros sin foto de evidencia
                      </Typography>                    
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', p : 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress color="error" variant="determinate" value={percentageCountWithoutEvidencePhoto} sx={{ height: 12}} />
                      </Box>
                      <Box sx={{ minWidth: 35, pl: 1, pr: 1 }}>
                        <Typography variant="body2" color="text.secondary">{`${percentageCountWithoutEvidencePhoto}%`}</Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card 
                  variant="outlined" 
                  sx={{ maxWidth: 360 }}
                  onClick={() => {
                    if (result.length > 0) {
                        handleExportToExcel(7);
                    } else {                        
                        console.log("No hay datos para exportar");
                    }
                  }}
                  >
                    <CardActionArea>
                    <Box sx={{ p: 1, textAlign: 'center' }}>                    
                      <Typography variant="h2" component="div" sx={{ textAlign: 'center' }}>
                        {countPropertyNotLocated}
                      </Typography>
                      <Typography variant="h6" component="div" color={'secondary'}>
                        Registros de predios no localizados
                      </Typography>                    
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', p : 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress color="error" variant="determinate" value={percentageCountPropertyNotLocated} sx={{ height: 12}} />
                      </Box>
                      <Box sx={{ minWidth: 35, pl: 1, pr: 1 }}>
                        <Typography variant="body2" color="text.secondary">{`${percentageCountPropertyNotLocated}%`}</Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>       
            </Grid>

          </Box>                 

        </>

    );
};
export default Index;