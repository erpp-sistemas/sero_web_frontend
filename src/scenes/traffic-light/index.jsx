import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelectMultipleChip'
import { trafficLightRequest, trafficLightByTypeRequest } from '../../api/trafficlight.js'
import { Box, useTheme, Button, Tooltip, IconButton} from "@mui/material";
import TextField from '@mui/material/TextField';
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import TrafficLightCountingProcedures from '../../components/TrafficLight/TrafficLightCountingProcedures.jsx'
import TrafficLightDebitProcedures from '../../components/TrafficLight/TrafficLightDebitProcedures.jsx'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import DownloadIcon from '@mui/icons-material/Download';
import * as ExcelJS from "exceljs";

const Index = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);    
    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedProcess, setSelectedProcess] = useState([]);    
    const [selectedDate, setSelectedDate] = useState('');    
    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");    
    const [result, setResult] = useState([]);
    const [trafficLightCountingProceduresData, setTrafficLightCountingProceduresData] = useState([]);
    const [trafficLightDebitProceduresData, setTrafficLightDebitProceduresData] = useState([]);
    const [countingData, setCountingData] = useState({
      thirtyDays: {},
      twentyOneDays: {},
      currentManagement: {},
      expired: {},
      sevenDays: {},
      noManagement: {},
      inProcess: {},
      fourteenDays: {}
  });

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

      const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
      };

      const handleGetTrafficLight = async () => {
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
          else if(!selectedDate){
            setAlertOpen(true)
            setAlertType("error")
            setAlertMessage("¡Error! Debes seleccionar una fecha")
            return
          }          

          setIsLoading(true)

          const response = await trafficLightRequest(selectedPlace, selectedService, selectedProcess, selectedDate);

          const countingDataArray = JSON.parse(response.data[0].TrafficLightCountingProcedures);
            
          const newCountingData = {
              thirtyDays: countingDataArray.find(data => data.color_meaning === "30 dias") || {},
              twentyOneDays: countingDataArray.find(data => data.color_meaning === "21 dias") || {},
              currentManagement: countingDataArray.find(data => data.color_meaning === "gestion actual") || {},
              expired: countingDataArray.find(data => data.color_meaning === "vencidas") || {},
              sevenDays: countingDataArray.find(data => data.color_meaning === "7 dias") || {},
              noManagement: countingDataArray.find(data => data.color_meaning === "sin gestion") || {},
              inProcess: countingDataArray.find(data => data.color_meaning === "en proceso") || {},
              fourteenDays: countingDataArray.find(data => data.color_meaning === "14 dias") || {}
          };

          setCountingData(newCountingData);
          
          setTrafficLightCountingProceduresData(countingDataArray);
          setTrafficLightDebitProceduresData(JSON.parse(response.data[0].TrafficLightDebitProcedures));
          setResult(response.data)          

          setIsLoading(false)

          setAlertOpen(true)
          setAlertType("success")
          setAlertMessage("¡Felicidades! Se genero el proceso correctamente")
          
        } catch (error) {
          setIsLoading(false)

          if(error.response.status === 400){
            setAlertOpen(true)
            setAlertType("warning")
            setAlertMessage("¡Atencion! No se encontraron cuentas")
            setResult([]);
          }    
        setResult([]);
          
        }        
      };

      const formatNumber = (number) => {
        return number.toLocaleString();
    };

    const handleDownload = async (type, concept) => {
      
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
        else if(!selectedDate){
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Debes seleccionar una fecha")
          return
        }          

        setIsLoading(true)

        const response = await trafficLightByTypeRequest(selectedPlace, selectedService, selectedProcess, selectedDate, type);        
        
        exportToExcel(response.data, concept)

        setIsLoading(false)        
        
      } catch (error) {
        setIsLoading(false)

        if(error.response.status === 400){
          setAlertOpen(true)
          setAlertType("warning")
          setAlertMessage("¡Atencion! No se encontraron cuentas")
          setResult([]);
        }    
      setResult([]);
        
      }
    };

    const exportToExcel = async (data, concept) => {
      try {
        
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Registros Encontrados");
                      
          const headers = Object.keys(data[0]);
          worksheet.addRow(headers);              
          
          data.forEach(row => {
              const values = headers.map(header => row[header]);
              worksheet.addRow(values);
          });
  
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${concept}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          
      } catch (error) {
          console.error("Error:", error);
          return null;
      }
    };


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
              <Grid item xs={12} sm={4}>
                <PlaceSelect                
                  selectedPlace={selectedPlace}
                  handlePlaceChange={handlePlaceChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ServiceSelect
                  selectedPlace={selectedPlace}                  
                  selectedService={selectedService}
                  handleServiceChange={handleServiceChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <ProcessSelect
                  selectedPlace={selectedPlace}
                  selectedService={selectedService}
                  selectedProcess={selectedProcess}
                  handleProcessChange={handleProcessChange}
                />
              </Grid>
            </Grid>
            
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
              <Grid item xs={12} sm={4}>
                <TextField
                  id="date"
                  label="Fecha"
                  type="date"
                  sx={{ width: '100%' }}
                  value={selectedDate}
                  onChange={handleDateChange}                  
                  InputLabelProps={{
                    shrink: true,
                  }}                  
                />
              </Grid>              
              <Grid item xs={12} sm={4}>
                <Button 
                  variant="contained"                   
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => {
                    handleGetTrafficLight();                    
                  }}                  
                  sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                  >
                    <ManageSearchIcon fontSize="large"/>
                    Buscar                  
                </Button>
              </Grid>
              <Grid item xs={4}>

              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Badge
                   badgeContent={formatNumber(countingData.noManagement.count || 0)}
                  color="info"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  max={999999999}
                  variant="standard"
                >
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'rgba(0, 0, 0, 0.8)' }}>
                    <ListItem alignItems="flex-start">                      
                        <ListItemText
                          primary={
                            <Typography
                              component="span"
                              variant="body1"
                              color={theme.palette.common.white}
                              >
                                Color Negro
                              </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color={theme.palette.common.white}
                              >
                                Sin gestion
                              </Typography>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color={theme.palette.common.white}
                              >
                                {" — Son cuentas a las cuales no se les ha realizado ninguna accion nunca"}
                              </Typography>                          
                            </React.Fragment>
                          }
                        />                      
                    </ListItem>                  
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() => handleDownload('noManagement', 'Sin_Gestion')}
                            sx={{
                              color: theme.palette.info.main,
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                  </List>
                </Badge>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Badge
                   badgeContent={formatNumber(countingData.expired.count || 0)}
                  color="info"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  max={999999999}
                  variant="standard"
                >
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'rgba(179, 179, 179, 0.8)' }}>
                    <ListItem alignItems="flex-start">                    
                      <ListItemText
                        primary="Color Gris"
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Vencidas
                            </Typography>
                            {" — son aquellas cuentas que ya superaron los 120 dias y por lo tanto ya no son validas para considerar en algun proceso"}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() => handleDownload('expired', 'Vencidas')}
                            sx={{
                              color: theme.palette.info.main,
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                  </List>
                </Badge>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Badge
                   badgeContent={formatNumber(countingData.sevenDays.count || 0)}
                  color="info"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  max={999999999}
                  variant="standard"
                >
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'rgba(255, 0, 0, 0.8)' }}>
                    <ListItem alignItems="flex-start">                    
                      <ListItemText
                        primary="Color Rojo"
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              7 dias
                            </Typography>
                            {" — Se incluyen aquellas cuentas que les quedan 7 dias para que la gestion que se les ha realizado aun sea valida"}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() => handleDownload('sevenDays', '7_Dias')}
                            sx={{
                              color: theme.palette.info.main,
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                  </List>
                </Badge>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Badge
                   badgeContent={formatNumber(countingData.fourteenDays.count || 0)}
                  color="info"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  max={999999999}
                  variant="standard"
                >
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'rgba(255, 120, 0, 0.8)' }}>
                    <ListItem alignItems="flex-start">                    
                      <ListItemText
                        primary="Color Naranja"
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              14 dias
                            </Typography>
                            {" — Se incluyen aquellas cuentas que les quedan 14 dias para que la gestion que se les ha realizado aun sea valida"}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() => handleDownload('fourteenDays', '14_Dias')}
                            sx={{
                              color: theme.palette.info.main,
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                  </List>
                </Badge>
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Badge
                   badgeContent={formatNumber(countingData.twentyOneDays.count || 0)}
                  color="info"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  max={999999999}
                  variant="standard"
                >
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'rgba(255, 242, 0, 0.8)' }}>
                    <ListItem alignItems="flex-start">                    
                      <ListItemText
                        primary="Color Amarillo"
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              21 dias
                            </Typography>
                            {" — Se incluyen aquellas cuentas que les quedan 21 dias para que la gestion que se les ha realizado aun sean validas"}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() => handleDownload('twentyOneDays', '21_Dias')}
                            sx={{
                              color: theme.palette.info.main,
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                  </List>
                </Badge>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Badge
                   badgeContent={formatNumber(countingData.thirtyDays.count || 0)}
                  color="info"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  max={999999999}
                  variant="standard"
                >
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'rgba(29, 255, 0, 0.8)' }}>
                    <ListItem alignItems="flex-start">                    
                      <ListItemText
                        primary="Color Verde"
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              30 dias
                            </Typography>
                            {" — Se incluyen aquellas cuentas que les quedan 30 dias para que la gestion que se les ha realizado aun sea valida"}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() => handleDownload('thirtyDays', '30_Dias')}
                            sx={{
                              color: theme.palette.info.main,
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                  </List>
                </Badge>                
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Badge
                   badgeContent={formatNumber(countingData.inProcess.count || 0)}
                  color="info"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  max={999999999}
                  variant="standard"
                >
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'rgba(0, 199, 255, 0.8)' }}>
                    <ListItem alignItems="flex-start">                    
                      <ListItemText
                        primary="Color Azul"
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              En proceso
                            </Typography>
                            {" — Se incluyen aquellas cuentas que les quedan 90 dias para que la gestion que se les ha realizado aun sea valida"}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() => handleDownload('inProcess', 'En_Proceso')}
                            sx={{
                              color: theme.palette.info.main,
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                  </List>
                </Badge>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Badge
                   badgeContent={formatNumber(countingData.currentManagement.count || 0)}
                  color="info"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  max={999999999}
                  variant="standard"
                >
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'rgba(255,255,255,1)' }}>
                    <ListItem alignItems="flex-start">                    
                      <ListItemText
                        primary={
                          <Typography
                            component="span"
                            variant="body1"
                            color={colors.grey[500]}
                          >
                            Color Blanco
                          </Typography> 
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color={colors.grey[500]}
                            >
                              Gestion actual
                            </Typography>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color={colors.grey[500]}
                            >
                              {" — Son gestiones que se realizaron en el dia en que se selecciono la fecha de este reporte y empieza su proceso de validez"}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() => handleDownload('currentManagement', 'Gestion_Actual')}
                            sx={{
                              color: theme.palette.info.main,
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                  </List>
                </Badge>
              </Grid>
            </Grid>

            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={12} sm={12} md={12}>    
                <TrafficLightCountingProcedures data={ trafficLightCountingProceduresData} />
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
              <Grid item xs={12} sm={12} md={12}>    
                <TrafficLightDebitProcedures data={ trafficLightDebitProceduresData} />
              </Grid>
            </Grid>
          </Box>                 
          
        </>

    );
};
export default Index;