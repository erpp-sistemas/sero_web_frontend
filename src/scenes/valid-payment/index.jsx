import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelectMultipleChip'
import { validPaymentRequest } from '../../api/payment.js'
import { useSelector } from 'react-redux'
import { Box, useTheme, Button, Avatar} from "@mui/material";
import Viewer from 'react-viewer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import * as ExcelJS from "exceljs";
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Header from '../../components/Header';
import { DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PreviewIcon from '@mui/icons-material/Preview';
import ModalTable from '../../components/ValidPayment/ModalTable.jsx'

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
    const [alertType, setAlertType] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");
    const [columns, setColumns] = useState([]);

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

    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState('');

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
            totalSum += (selectedPlace === 2 && selectedService === 2) ? item.gran_total : item.total_pagado;
            uniqueAccounts.add(item.cuenta);

            if (item['estatus de gestion valida'] === 'valida') {
              validaCount++;
              validaTotal += (selectedPlace === 2 && selectedService === 2) ? item.gran_total : item.total_pagado;

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
                noValidaTotal += (selectedPlace === 2 && selectedService === 2) ? item.gran_total : item.total_pagado;
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

          if(error.response.status === 400){
            console.log(error.response.status)
            console.log('estamos en el error 400')
            setAlertOpen(true)
            setAlertType("warning")
            setAlertMessage("¡Atencion! No se encontraron pagos")
            setResult([]);
          }
        console.log([error.response.data.message])        
        setResult([]);
          
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

    const handleExportToExcelFull = async () => {
      try {
        setIsLoading(true)
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Registros Encontrados");
                      
          const headers = Object.keys(result[0]);
          worksheet.addRow(headers);              
          
          result.forEach(row => {
              const values = headers.map(header => row[header]);
              worksheet.addRow(values);
          });

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

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarColumnsButton color="secondary" >
            Columnas
          </GridToolbarColumnsButton>
          
          <GridToolbarFilterButton color="secondary" />
          <GridToolbarDensitySelector color="secondary" />
  
          <Button
              color="secondary"
              onClick={handleExportToExcelFull}
          >
              Exportar a Excel
          </Button>    
          
        </GridToolbarContainer>
      );
    }

    const buildColumns = () => {      
      if (result.length > 0) {
        const firstRow = result[0];
        const dynamicColumns = Object.keys(firstRow).map((key) => {
          
          if (key === 'id') {
            return null;
          }

          if (key === 'urlImagenFachada' || key === 'urlImagenEvidencia') {
            return {
              field: key,
              headerName: key.toUpperCase(),
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
              ),
              renderCell: (params) => <AvatarImage data={params.value} />,              
              width: 150,
              sortable: false,
              filterable: false,
            };
          }

          if (key === 'foto fachada predio') {
            return {
              field: key,
              headerName: key.toUpperCase(),
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
              ),
              renderCell: (params) => (
                <Chip
                  icon={params.value === 'si' ? <CheckCircleIcon style={{ color: 'green' }} /> : <ErrorIcon style={{ color: 'red' }} />}
                  label={params.value}
                  color={params.value === 'si' ? 'secondary' : 'error'}
                  variant="outlined"
                />
              ),
              width: 150,
              sortable: false,
              filterable: false,
            };
          }

          if (key === 'foto evidencia predio') {
            return {
              field: key,
              headerName: key.toUpperCase(),
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
              ),
              renderCell: (params) => (
                <Chip
                  icon={params.value === 'si' ? <CheckCircleIcon style={{ color: 'green' }} /> : <ErrorIcon style={{ color: 'red' }} />}
                  label={params.value}
                  color={params.value === 'si' ? 'secondary' : 'error'}
                  variant="outlined"
                />
              ),
              width: 150,
              sortable: false,
              filterable: false,
            };
          }

          if (key === 'estatus de gestion valida') {
            return {
              field: key,
              headerName: key.toUpperCase(),
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
              ),
              renderCell: (params) => (
                <Chip
                  icon={params.value === 'valida' ? <CheckCircleIcon style={{ color: 'green' }} /> : <ErrorIcon style={{ color: 'red' }} />}
                  label={params.value}
                  color={params.value === 'valida' ? 'secondary' : 'error'}
                  variant="outlined"
                />
              ),
              width: 150,
              sortable: false,
              filterable: false,
            };
          }
  
          return {
            field: key,
            headerName: key.toUpperCase(),
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
            ),
            width: 210,
            editable: false,
          };
        }).filter((column) => column !== null);
  
        setColumns(dynamicColumns);
      }
    };  
    
    useEffect(() => {
      buildColumns();
    }, [result]);  

    const AvatarImage = ({ data }) => {
      const [visibleAvatar, setVisibleAvatar] = React.useState(false);
      return (
        <>
          <Avatar
            onClick={() => {
              setVisibleAvatar(true);
            }}
            alt="Remy Sharp"
            src={data}
          />
    
          <Viewer
            visible={visibleAvatar}
            onClose={() => {
              setVisibleAvatar(false);
            }}
            images={[{ src: data, alt: 'avatar' }]}          
          />
        </>
      );
    };

    const handleOpenModal = (type) => {

       let filteredData       

       if(type === 1){
         filteredData = result         
       }
       else if(type === 2){
         filteredData = result.filter(row => row['estatus de gestion valida'] === 'valida');
       }
       else if(type === 3){
        filteredData = result.filter(row => row['estatus de gestion valida'] === 'no valida');
      }
      else if (type === 4) {
        filteredData = result.filter(row => row['estatus de gestion valida'] === 'valida' && row.latitud === 0);
      }
      else if (type === 5) {
        filteredData = result.filter(row => row['estatus de gestion valida'] === 'valida' && row['foto fachada predio'] === 'no');
      }
      else if (type === 6) {
        filteredData = result.filter(row => row['estatus de gestion valida'] === 'valida' && row['foto evidencia predio'] === 'no');
      }
      else if (type === 7) {
        filteredData = result.filter(row => row['estatus de gestion valida'] === 'valida' && row['estatus_predio'] !== 'Predio localizado');
      }

       console.log(filteredData)
      
       setModalData(filteredData);
       setOpenModal(true);       
    };
  
    const handleCloseModal = () => {
      setOpenModal(false);
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
                  InputLabelProps={{
                    shrink: true,
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
                    <ManageSearchIcon fontSize="large"/>
                    Buscar                  
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>                    
                    <Typography variant="h2" component="div">
                    {countResult}
                    </Typography>
                    <Typography color="text.secondary" variant="h5">
                      Registros encontrados
                      <Tooltip title="Descargar" arrow>
                        <IconButton onClick={() => {
                          if (result.length > 0) {
                              handleExportToExcel(1);                    
                          } else {                        
                              console.log("No hay datos para exportar");
                          }
                        }}
                        >
                          <CloudDownloadIcon  style={{ color: theme.palette.secondary.main }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver Registros" arrow>
                        <IconButton
                        onClick={() => handleOpenModal(1)}
                        >
                          <PreviewIcon  style={{ color: theme.palette.info.main }} />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </Box>                  
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 3, textAlign: 'center' }}>                    
                    <Typography variant="h2" component="div">
                    {countUniqueAccount}
                    </Typography>
                    <Typography color="text.secondary" variant="h5">
                      Cuentas unicas                      
                    </Typography>
                  </Box>                  
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 3, textAlign: 'center' }}>                    
                    <Typography variant="h2" component="div">
                    $ {totalAmount}
                    </Typography>
                    <Typography color="text.secondary" variant="h5">
                      Monto ingresado                      
                    </Typography>
                  </Box>                  
                </Card>
              </Grid>
            </Grid>

            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={3}>
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>                    
                    <Typography variant="h3" component="div">
                    {countValidProcedures}
                    </Typography>
                    <Typography color="text.secondary" variant="h6">
                      Gestiones validas                      
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
                  <Box sx={{ display: 'flex', textAlign: 'left' }}>                  
                    <Tooltip title="Descargar" arrow>
                      <IconButton onClick={() => {
                        if (result.length > 0) {
                            handleExportToExcel(2);                    
                        } else {                        
                            console.log("No hay datos para exportar");
                        }
                      }}
                      >
                        <CloudDownloadIcon  style={{ color: theme.palette.secondary.main }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Registros" arrow>
                      <IconButton
                       onClick={() => handleOpenModal(2)}
                      >
                        <PreviewIcon  style={{ color: theme.palette.info.main }} />
                      </IconButton>
                    </Tooltip>                  
                  </Box>                  
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>                    
                    <Typography variant="h3" component="div">
                    {countInvalidProcedures}
                    </Typography>
                    <Typography color="text.secondary" variant="h6">
                      Gestiones no validas                      
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
                  <Box sx={{ textAlign: 'left' }}>
                    <Tooltip title="Descargar" arrow>
                      <IconButton onClick={() => {
                        if (result.length > 0) {
                            handleExportToExcel(3);                    
                        } else {                        
                            console.log("No hay datos para exportar");
                        }
                      }}
                      >
                        <CloudDownloadIcon  style={{ color: theme.palette.secondary.main }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Registros" arrow>
                      <IconButton
                       onClick={() => handleOpenModal(3)}
                      >
                        <PreviewIcon  style={{ color: theme.palette.info.main }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 3, textAlign: 'center' }}>                    
                    <Typography variant="h3" component="div">
                    {amountValidProcedures}
                    </Typography>
                    <Typography color="text.secondary" variant="h6">
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
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 3, textAlign: 'center' }}>                    
                    <Typography variant="h3" component="div">
                    {amountInvalidProcedures}
                    </Typography>
                    <Typography color="text.secondary" variant="h6">
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
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>                    
                    <Typography variant="h3" component="div">
                    {countNoPosition}
                    </Typography>
                    <Typography color="text.secondary" variant="h6">
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
                  <Box sx={{ textAlign: 'left' }}>
                    <Tooltip title="Descargar" arrow>
                      <IconButton onClick={() => {
                        if (result.length > 0) {
                            handleExportToExcel(4);                    
                        } else {                        
                            console.log("No hay datos para exportar");
                        }
                      }}
                      >
                        <CloudDownloadIcon  style={{ color: theme.palette.secondary.main }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Registros" arrow>
                      <IconButton
                       onClick={() => handleOpenModal(4)}
                      >
                        <PreviewIcon  style={{ color: theme.palette.info.main }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>                    
                    <Typography variant="h3" component="div">
                    {countWithoutPropertyPhoto}
                    </Typography>
                    <Typography color="text.secondary" variant="h6">
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
                  <Box sx={{ textAlign: 'left' }}>
                    <Tooltip title="Descargar" arrow>
                      <IconButton onClick={() => {
                        if (result.length > 0) {
                            handleExportToExcel(5);                    
                        } else {                        
                            console.log("No hay datos para exportar");
                        }
                      }}
                      >
                        <CloudDownloadIcon  style={{ color: theme.palette.secondary.main }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Registros" arrow>
                      <IconButton
                       onClick={() => handleOpenModal(5)}
                      >
                        <PreviewIcon  style={{ color: theme.palette.info.main }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>                    
                    <Typography variant="h3" component="div">
                    {countWithoutEvidencePhoto}
                    </Typography>
                    <Typography color="text.secondary" variant="h6">
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
                  <Box sx={{ textAlign: 'left' }}>
                    <Tooltip title="Descargar" arrow>
                      <IconButton onClick={() => {
                        if (result.length > 0) {
                            handleExportToExcel(6);                    
                        } else {                        
                            console.log("No hay datos para exportar");
                        }
                      }}
                      >
                        <CloudDownloadIcon  style={{ color: theme.palette.secondary.main }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Registros" arrow>
                      <IconButton
                       onClick={() => handleOpenModal(6)}
                      >
                        <PreviewIcon  style={{ color: theme.palette.info.main }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
                  <Box sx={{ p: 2, textAlign: 'center' }}>                    
                    <Typography variant="h3" component="div">
                    {countPropertyNotLocated}
                    </Typography>
                    <Typography color="text.secondary" variant="h6">
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
                  <Box sx={{ textAlign: 'left' }}>
                    <Tooltip title="Descargar" arrow>
                      <IconButton onClick={() => {
                        if (result.length > 0) {
                            handleExportToExcel(7);                    
                        } else {                        
                            console.log("No hay datos para exportar");
                        }
                      }}
                      >
                        <CloudDownloadIcon  style={{ color: theme.palette.secondary.main }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Registros" arrow>
                      <IconButton
                       onClick={() => handleOpenModal(7)}
                      >
                        <PreviewIcon  style={{ color: theme.palette.info.main }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={12}>
                <Box m="20px">
                  <Header title="Listado de pagos validos" />
                  <Box
                    sx={{
                      height: 400,
                      width: '100%',
                      '.css-196n7va-MuiSvgIcon-root': {
                        fill: 'white',
                      },
                    }}
                  >
                    {result.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>No row</div>
                    ) : (
                      <DataGrid
                        rows={result}
                        columns={columns}
                        getRowId={(row) => row.id}
                        editable={false}                         
                        slots={{ toolbar: CustomToolbar}}                        
                      />
                    )}
                  </Box>
                </Box>
              </Grid>              
            </Grid>
            <ModalTable open={openModal} onClose={handleCloseModal} data={modalData} />
          </Box>                 
          
        </>

    );
};
export default Index;