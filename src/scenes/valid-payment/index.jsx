import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelectMultipleChip'
import { validPaymentRequest } from '../../api/payment.js'
import { useSelector } from 'react-redux'
import { Box, useTheme, Button, Avatar, InputAdornment, Divider, Typography, Card, CardMedia } from "@mui/material";
import Viewer from 'react-viewer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as ExcelJS from "exceljs";
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,  
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import FirstSection from '../../components/ValidPayment/FirstSection.jsx'
import SecondSection from "../../components/ValidPayment/SecondSection.jsx";
import ThirdSection from "../../components/ValidPayment/ThirdSection.jsx";
import { Download, Search } from "@mui/icons-material";


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
    
    const [resultOriginal, setResultOriginal] = useState([]);
    const [result, setResult] = useState([]);
    const [filteredResult, setFilteredResult] = useState([]);    
    const [filterText, setFilterText] = useState('');
    const [typeFilter, setTypeFilter] = useState(0);
    const [titleFilter, setTitleFilter] = useState('');
    const [showNoResultsMessage, setShowNoResultsMessage] = useState(false)
    const [countResult, setCountResult] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [countUniqueAccount, setCountUniqueAccount] = useState(0);
    const [paymentDateRange, setPaymentDateRange] = useState('1999-09-09');
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
          
          const type = 1

          const response = await validPaymentRequest(selectedPlace, selectedService, selectedProcess,selectedValidDays, selectedStartDate, selectedFinishDate, type);

          setResultOriginal(response.data)
          setTypeFilter(1)
          setTitleFilter('Registros Encontrados')          

          const fechas = response.data.map(item => new Date(item["fecha de pago"]));
          
          const fechaMasGrande = new Date(Math.max(...fechas));
          const fechaMasChica = new Date(Math.min(...fechas));          
          
          const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
          const fechaMayorFormateada = fechaMasGrande.toLocaleDateString('es-ES', opciones);
          const fechaMenorFormateada = fechaMasChica.toLocaleDateString('es-ES', opciones);
          
          setPaymentDateRange(`${fechaMenorFormateada} - ${fechaMayorFormateada}`)

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
            totalSum += (selectedPlace === 2 && selectedService === 2) ? item.total_pagado : item.total_pagado;
            uniqueAccounts.add(item.cuenta);

            if (item['estatus de gestion valida'] === 'valida') {
              validaCount++;
              validaTotal += (selectedPlace === 2 && selectedService === 2) ? item.total_pagado : item.total_pagado;

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
                noValidaTotal += (selectedPlace === 2 && selectedService === 2) ? item.total_pagado : item.total_pagado;
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
            setAlertOpen(true)
            setAlertType("warning")
            setAlertMessage("¡Atencion! No se encontraron pagos")
            setResult([]);
          }       
        setResult([]);
          
        }        
      };

      const handleExportToExcel = async (filter) => {
        try {
          setIsLoading(true)
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Registros Encontrados");
                        
            const headers = Object.keys(resultOriginal[0]);
            worksheet.addRow(headers);        
                
            if(filter === 1)
            {
              resultOriginal.forEach(row => {
                  const values = headers.map(header => row[header]);
                  worksheet.addRow(values);
              });
            }
            else if(filter === 2)
            {
              resultOriginal.forEach(row => {
                if (row['estatus de gestion valida'] === 'valida')
                {
                  const values = headers.map(header => row[header]);
                  worksheet.addRow(values);
                }                
              });
            }
            else if(filter === 3)
            {
              resultOriginal.forEach(row => {
                if (row['estatus de gestion valida'] !== 'valida')
                {
                  const values = headers.map(header => row[header]);
                  worksheet.addRow(values);
                }                
              });
            }
            else if(filter === 4)
            {
              resultOriginal.forEach(row => {
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
              resultOriginal.forEach(row => {
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
              resultOriginal.forEach(row => {
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
              resultOriginal.forEach(row => {
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
            a.download = "Pagos validos.xlsx";
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
                      
          const headers = Object.keys(resultOriginal[0]);
          worksheet.addRow(headers);          

          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Pagos validos.xlsx";
          a.click();
          window.URL.revokeObjectURL(url);
          setIsLoading(false)
      } catch (error) {
          console.error("Error:", error);
          return null;
      }
  };
  
    const handleExportToExcelDataGrid = async () => {
      try {
        setIsLoading(true)
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Registros Encontrados");
                      
          //const headers = Object.keys(resultOriginal[0]);
          //worksheet.addRow(headers);

          if (filteredResult.length > 0){
            const headers = Object.keys(filteredResult[0]);
            worksheet.addRow(headers);
  
            filteredResult.forEach((row) => {
                const values = headers.map((header) => row[header]);
                worksheet.addRow(values);
            });
          }
          else {
            const headers = Object.keys(result[0]);
            worksheet.addRow(headers);
  
            result.forEach((row) => {
                const values = headers.map((header) => row[header]);
                worksheet.addRow(values);
            });
          } 

          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Pagos_Validos.xlsx";
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
            };
          }

          if (key === 'urlImagenFachada') {
            return {
              field: key,
              headerName: key.toUpperCase(),
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
              ),
              renderCell: (params) => (
                params.row.urlImagenFachada ? (
                  <Card
                    sx={{ 
                      maxWidth: 150,
                      height: '100%', 
                      display: 'flex',
                      alignItems: 'center',
                      border: '2px solid #5EBFFF',
                      overflow: 'hidden'
                    }}
                  >
                    <CardMedia
                     component="img"
                      height="100%"
                     image={params.row.urlImagenFachada}
                     alt="Foto fachada 1"
                     sx={{                       
                       objectFit: 'cover'
                     }}
                    />                
                  </Card>
                ) : (
                  <Typography>No disponible</Typography>
                )
              ),
              width: 150,              
            };
          }

          if (key === 'urlImagenEvidencia') {
            return {
              field: key,
              headerName: key.toUpperCase(),
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
              ),
              renderCell: (params) => (
                params.row.urlImagenEvidencia ? (
                  <Card
                    sx={{ 
                      maxWidth: 150,
                      height: '100%', 
                      display: 'flex',
                      alignItems: 'center',
                      border: '2px solid #5EBFFF',
                      overflow: 'hidden'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                     image={params.row.urlImagenEvidencia}
                     alt="Foto evidencia 1"
                     sx={{
                       objectFit: 'cover'
                     }}
                    />                
                  </Card>
                ) : (
                  <Typography>No disponible</Typography>
                )
              ),
              width: 150,              
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
  
    const handleCloseModal = () => {
      setOpenModal(false);
    }

    const handleFilteredRows = (type) => {

      if(type === 1){
        setResult(resultOriginal)
        setTypeFilter(1)
        setTitleFilter('Registros Encontrados')
      }
      else if(type === 2){
        setResult(resultOriginal.filter(row => row['estatus de gestion valida'] === 'valida'))
        setTypeFilter(2)
        setTitleFilter('Gestiones Validas')
      }
      else if(type === 3){
        setResult(resultOriginal.filter(row => row['estatus de gestion valida'] === 'no valida'))
        setTypeFilter(3)
        setTitleFilter('Gestiones no validas')
     }
     else if (type === 4) {
      setResult(resultOriginal.filter(row => row['estatus de gestion valida'] === 'valida' && row.latitud === 0))
      setTypeFilter(4)
      setTitleFilter('Registros sin posicion')
     }
     else if (type === 5) {
      setResult(resultOriginal.filter(row => row['estatus de gestion valida'] === 'valida' && row['foto fachada predio'] === 'no'))
      setTypeFilter(5)
      setTitleFilter('Registros sin foto de fachada')
     }
     else if (type === 6) {
      setResult(resultOriginal.filter(row => row['estatus de gestion valida'] === 'valida' && row['foto evidencia predio'] === 'no'))
      setTypeFilter(6)
      setTitleFilter('Registros sin foto de evidencia')
     }
     else if (type === 7) {
      setResult(resultOriginal.filter(row => row['estatus de gestion valida'] === 'valida' && row['estatus_predio'] !== 'Predio localizado'))
      setTypeFilter(7)
      setTitleFilter('Registro de predios no localizados')
     }
   }

   const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  }

  useEffect(() => {
    setResult(resultOriginal)  
  }, [resultOriginal]);

  useEffect(() => {
    let filtered = result;

      if (filterText) {
          filtered = filtered.filter(item =>
              Object.values(item).some(value => value != null && value.toString().toLowerCase().includes(filterText.toLowerCase()))
          );
      }

      setFilteredResult(filtered);
      setShowNoResultsMessage(filtered.length === 0 && filterText.length > 0);      

  }, [result, filterText]);


    return (
      <Box 
        sx={{
          padding:'10px'
        }}
      >   

        <Box
            m='0 0'
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
          <Grid container xs={12} md={12} spacing={2}>
            <Grid item xs={12} md={4}>
              <PlaceSelect                
                selectedPlace={selectedPlace}
                handlePlaceChange={handlePlaceChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ServiceSelect
                selectedPlace={selectedPlace}                  
                selectedService={selectedService}
                handleServiceChange={handleServiceChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProcessSelect
                selectedPlace={selectedPlace}
                selectedService={selectedService}
                selectedProcess={selectedProcess}
                handleProcessChange={handleProcessChange}
              />
            </Grid>
          </Grid>
          <Grid xs={12} md={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <Button 
                variant="contained"                   
                style={{ width: '100%', height: '100%' }}
                onClick={() => {
                  handleGetValidPayment();                    
                }}                  
                sx={{ 
                  bgcolor: 'secondary.main', 
                  '&:hover': { bgcolor: 'secondary.dark' },
                  maxHeight: '56px'
                }}
                >
                  <ManageSearchIcon fontSize="large"/>
                  Buscar                  
              </Button>
            </Grid>
          </Grid>
          <Grid xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={12} md={4}>
              <FirstSection                
                countResult={countResult}
                countUniqueAccount={countUniqueAccount}
                totalAmount={totalAmount}
                paymentDateRange={paymentDateRange}
                handleExportToExcel={handleExportToExcel}
                handleFilteredRows={handleFilteredRows}
                typeFilter={typeFilter}
              />
            </Grid>

            <Grid item xs={12} md={ 4 }>
              <SecondSection
                countValidProcedures={countValidProcedures}
                countInvalidProcedures={countInvalidProcedures}
                percentageValidProcedures={percentageValidProcedures}
                percentageInvalidProcedures={percentageInvalidProcedures}
                amountValidProcedures={amountValidProcedures}
                percentageAmountValidProcedures={percentageAmountValidProcedures}
                amountInvalidProcedures={amountInvalidProcedures}
                percentageAmountInvalidProcedures={percentageAmountInvalidProcedures}
                handleExportToExcel={handleExportToExcel}
                handleFilteredRows={handleFilteredRows}
                typeFilter={typeFilter}
              />
            </Grid>

            <Grid item xs={12} md={ 4 } >
              <ThirdSection
                countNoPosition={ countNoPosition } 
                percentageCountNoPosition={ percentageCountNoPosition }
                countWithoutPropertyPhoto={ countWithoutPropertyPhoto }
                percentageCountWithoutPropertyPhoto={ percentageCountWithoutPropertyPhoto }
                countWithoutEvidencePhoto={ countWithoutEvidencePhoto }
                percentageCountWithoutEvidencePhoto={ percentageCountWithoutEvidencePhoto }
                countPropertyNotLocated={ countPropertyNotLocated }
                percentageCountPropertyNotLocated={ percentageCountPropertyNotLocated }
                handleExportToExcel={handleExportToExcel}
                handleFilteredRows={handleFilteredRows}
                typeFilter={typeFilter}
              />
            </Grid>
          </Grid>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ marginBottom: '0px' }}
          >
            <Typography 
              variant="h4"
              component="h1" 
              align="center"
              sx={{
                fontWeight: 'bold',
                color: colors.grey[100],
              }}
            >
              {titleFilter}
            </Typography>
          </Box>
          
          <Grid container alignItems="stretch" spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Ingresa tu busqueda"
                value={filterText}
                onChange={handleFilterChange}
                fullWidth
                helperText={showNoResultsMessage ? 'No se encontraron resultados' : ''}
                FormHelperTextProps={{ style: { color: 'red' } }}
                color='secondary'
                size="small"
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                          <Search color="secondary"/>
                      </InputAdornment>
                  ),                            
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                variant="outlined" 
                color="secondary"
                startIcon={<Download />}
                onClick={handleExportToExcelDataGrid}
              >
                  Exportar a Excel
              </Button>
            </Grid>
          </Grid>
          <Grid xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={12}>
              <Box >                  
                <Box
                  sx={{
                    height: 800,
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
                        rows={filteredResult.length > 0 ? filteredResult : result}
                        columns={columns}
                        getRowId={(row) => row.id}
                        rowHeight={130}
                        editable={false}                         
                        slots={{ toolbar: CustomToolbar}}                        
                      />
                    )}
                </Box>
              </Box>
            </Grid>
          </Grid>          
        </Box>        
      </Box>

    );
};
export default Index;