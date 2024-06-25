import React, { useState, useEffect } from "react";
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelect'
import { Box, useTheme, Button, Avatar, Typography} from "@mui/material";
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ManageSearch, Newspaper } from "@mui/icons-material";
import {surveyReportRequest} from '../../api/survey.js'
import RowOne from '../../components/CoordinationDashboard/RowOne.jsx'
import DataGridManagementByManager from '../../components/CoordinationDashboard/DataGridManagementByManager.jsx'
import PieManagementByTypeOfServiceAndLocationStatus from '../../components/CoordinationDashboard/PieManagementByTypeOfServiceAndLocationStatus.jsx'
import BarStackManagementsByManagerAndLocationStatus from "../../components/CoordinationDashboard/BarStackManagementsByManagerAndLocationStatus.jsx";
import ProgressCircle from "../../components/ProgressCircle";
import LineNumberOFTotalProcedures from '../../components/CoordinationDashboard/LineNumberOFTotalProcedures.jsx'
import Legend from '../../components/LightweightCharts/Legend'
import Card from '@mui/material/Card';
import ManagedTask from '../../components/CoordinationDashboard/ManagedTask.jsx'
import LocationStatus from '../../components/CoordinationDashboard/LocationStatus.jsx'
import TypeService from '../../components/CoordinationDashboard/TypeService.jsx'
import TypeProperty from '../../components/CoordinationDashboard/TypeProperty.jsx'
import Header from '../../components/Header';
import { DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,  
  GridToolbarDensitySelector,
  GridToolbarExport,  
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import Question from '../../components/CoordinationDashboard/Question.jsx'
import ChartComponent from '../../components/CoordinationDashboard/ChartComponent.jsx'


function index() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [selectedPlace, setSelectedPlace] = useState('');    
    const [selectedStartDate, setSelectedStartDate] = React.useState('');
    const [selectedFinishDate, setSelectedFinishDate] = React.useState('');
    const [result, setResult] = useState([]);
    const [surveyReport, setSurveyReport] = useState([]);
    const [columns, setColumns] = useState([]);

    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");

    const handlePlaceChange = (event) => {
      setSelectedPlace(event.target.value);
    };

    const handleStartDateChange = (event) => {
      setSelectedStartDate(event.target.value);
    };

    const handleFinishDateChange = (event) => {
      setSelectedFinishDate(event.target.value);
    };

    const handleGetSurveyReport = async () => {
      try {

        if(!selectedPlace){
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Debes seleccionar una plaza")
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
        

        const response = await surveyReportRequest(selectedPlace, selectedStartDate, selectedFinishDate);

        const transformedData = response.data.reduce((acc, item) => {
          const { field, answer, count, color } = item;
          if (!acc[field]) {
              acc[field] = [];
          }          
          acc[field].push({ answer, count, color });
          return acc;
      }, {});  
      
      for (const field in transformedData) {
        transformedData[field].sort((a, b) => b.count - a.count);
    }

    const generateRandomColorHSL = () => {
      const h = Math.floor(Math.random() * 360);
      const s = Math.floor(Math.random() * 30 + 70);
      const l = Math.floor(Math.random() * 30 + 50);
      return `hsl(${h}, ${s}%, ${l}%)`;
    };
      
      setResult(transformedData)
        
        // const jsonString = response.data[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'];
        // const parsedData = JSON.parse(jsonString);
        // const formattedData = parsedData.map(item => {
        //   return { ...item, data_json: JSON.parse(item.data_json) };
        // });
  

        

        // setSurveyReport(JSON.parse(response.data[0].survey_report))

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

    const buildColumns = () => {   
        if (result.length > 0) {
            const firstRow = surveyReport[0];
            const dynamicColumns = Object.keys(firstRow).map((key) => {
              
              if (key === 'id') {
                return null;
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
              <Grid item xs={3}>
                <PlaceSelect                
                  selectedPlace={selectedPlace}
                  handlePlaceChange={handlePlaceChange}
                />
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
                    handleGetSurveyReport();                    
                  }}                  
                  sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                  >
                    <ManageSearch fontSize="large"/>
                    Buscar                  
                </Button>
              </Grid>
            </Grid>

            <Box
              width='100%'
            >
              
                {Object.keys(result).map(field => (
                    <ChartComponent 
                        key={field} 
                        data={result[field]} 
                        field={field} 
                        title={`Gráfico para el campo ${field}`} 
                    />
                ))}
                
              </Box>

            <Box>
                
            </Box>
            
            {/* <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={12}>
                    <Question data={surveyReport} campo={1} question ={'Si la elección a la Presidencia municipal fuera hoy, ¿Por cuál partido votaría?'}/>
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={12}>
                <Question data={surveyReport} campo={2} question ={'Si la elección a la Presidencia municipal fuera hoy, ¿Por cuál coalición o partido votaría?'}/>
                </Grid>                
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={12}>
                <Question data={surveyReport} campo={3} question ={'Si la elección para la próxima Presidenta o Presidente municipal fuera hoy, ¿Por cuál candidata o candidato votaría?'}/>
                </Grid>                
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={12}>
                    <Question data={surveyReport} campo={4} question ={'Independientemente de su intención de voto, ¿Quién cree que será la próxima o el próximo Presidente municipal?'}/>
                </Grid>                
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={12}>
                    <Question data={surveyReport} campo={5} question ={'En las próximas elecciones en México, usted ¿Votará por el mismo partido para la Presidencia municipal o votará diferente?'}/>
                </Grid>                
            </Grid> */}
              
            {/* <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
            {(result.length === 0 ) ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>No se encontraron resultados</div>
            ) : (
                <DataGrid
                    rows={surveyReport}
                    columns={columns}
                    getRowId={(row) => row.id}
                    editable={false} 
                    // slots={{ toolbar: CustomToolbar}}                          
                />
            )}
            </Grid>             */}
          </Box>
    </>
  )
}

export default index