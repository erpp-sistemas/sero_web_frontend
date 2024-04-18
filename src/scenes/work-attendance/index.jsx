import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import {workAttendanceRequest} from '../../api/attendance.js'
import { Box, useTheme, Button, Avatar} from "@mui/material";
import Viewer from 'react-viewer';
import TextField from '@mui/material/TextField';
import Header from '../../components/Header';
import { DataGrid, GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Chip from '@mui/material/Chip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import * as ExcelJS from "exceljs";
import LoadingModal from '../../components/LoadingModal.jsx'

const Index = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [users, setUsers] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [noData, setNoData] = useState('');
    const [messageError, setMessageError] = useState('');
    const [isLoading, setIsLoading] = useState(false)

      const handlePlaceChange = (event) => {
        setNoData('')
        setSelectedPlace(event.target.value);
      };     

      const handleStartDateChange = (event) => {
        setNoData('')
        setSelectedStartDate(event.target.value);
      };

      const handleEndDateChange = (event) => {
        setNoData('')
        setSelectedEndDate(event.target.value);
      };

      const handleGetWorkAttendance = async () => {
        try {
          setIsLoading(true)

          const response = await workAttendanceRequest(selectedPlace, selectedStartDate, selectedEndDate);
          
          console.log('response', response)
          setNoData('')
          setUsers(response.data);
          setIsLoading(false)
          
        } catch (error) {
          setIsLoading(false)

          if(error.response.status === 400){
            console.log(error.response.status)
            setUsers([]);
          }
          
          setMessageError([error.response.data.message])
          console.log([error.response.data.message])
          
        }        
      };

      const buildColumns = () => {   
        const columns = [
          { 
            field: 'user',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
            ),
            width: 210,
            editable: false,
          },
          { 
            field: 'url_image',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"FOTO"}</strong>
            ),
            width: 70,
            renderCell: (params) => <AvatarImage data={params.row.url_image} />,
          },
          { 
            field: 'place', 
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"PLAZA"}</strong>
            ),
            width: 120,
          },
          { 
            field: 'date_capture', 
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"FECHA DE CAPTURA"}</strong>
            ),
            width: 120,
            renderCell: (params) => (
              <>
                {params.value}
                <CalendarMonthIcon style={{ marginLeft: '5px' }} />
              </>
            ),
          },
          { 
            field: 'entry_time',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"HORA DE ENTRADA"}</strong>
            ),
            width: 120,
            renderCell: (params) => (
              <>
                {params.value}
                <AccessTimeIcon style={{ marginLeft: '5px' }} />
              </>
            ),
          },
          { 
            field: 'entry_status',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE ENTRADA"}</strong>
            ),
            width: 200,
            renderCell: (params) => {
              let icon = null;
              let chipColor = 'primary';
              let chipLabel = '';
              switch (params.row.entry_status) {
                case 'Asistencia correcta':
                  icon = <InsertEmoticonIcon/>;
                  chipColor = 'success';
                  chipLabel = 'Asistencia correcta';
                  break;
                case 'Retardo':
                  icon = <WarningAmberIcon/>;
                  chipColor = 'warning';
                  chipLabel = 'Retardo';
                  break;
                case 'Falta':
                  icon = <DangerousIcon/>;
                  chipColor = 'error';
                  chipLabel = 'Falta';
                  break;
                case 'Dia incompleto':
                  icon = <SentimentVeryDissatisfiedIcon/>;
                  chipColor = 'error';
                  chipLabel = 'Día incompleto';
                  break;
                default:
                  icon = null;
                  chipColor = 'primary';
              }
              return (
                <>                  
                  <Chip
                    icon={icon}
                    label={chipLabel}
                    color={chipColor}
                    variant="outlined"
                    style={{ marginLeft: '5px' }}
                  />
                </>
              );
            },
          },
          { 
            field: 'entry_point_status',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE PUNTO DE ENTRADA"}</strong>
            ),
            width: 200,
            renderCell: (params) => {
              let icon = null;
              let chipColor = 'primary';
              let chipLabel = '';
              switch (params.row.entry_point_status) {
                case 'Campo':
                  icon = <EditRoadIcon/>;
                  chipColor = 'warning';
                  chipLabel = 'Campo';
                  break;
                case 'Corporativo':
                  icon = <ApartmentIcon/>;
                  chipColor = 'info';
                  chipLabel = 'Corporativo';
                  break;                
                default:
                  icon = null;
                  chipColor = 'primary';
              }
              return (
                <>                  
                  <Chip
                    icon={icon}
                    label={chipLabel}
                    color={chipColor}
                    variant="outlined"
                    style={{ marginLeft: '5px' }}
                  />
                </>
              );
            },
          },
          { 
            field: 'entry_attendance_place',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE ENTRADA"}</strong>
            ),
            width: 120,
            renderCell: (params) => (
              <PersonPinCircleIcon 
                style={{ cursor: 'pointer', color: 'lightblue', fontSize: 40 }} 
                onClick={() => {
                  window.open(params.value, '_blank');
                }}
              />
            ),
          },
          { 
            field: 'exit_time',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"HORA DE SALIDA"}</strong>
            ),
            width: 100,
            renderCell: (params) => (
              <>
                {params.value}
                <AccessTimeIcon style={{ marginLeft: '5px' }} />
              </>
            ),
          },
          { 
            field: 'exit_status',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE SALIDA"}</strong>
            ),
            width: 150,
            renderCell: (params) => {
              let icon = null;
              let chipColor = 'primary';
              let chipLabel = '';
              switch (params.row.exit_status) {
                case 'Asistencia correcta':
                  icon = <InsertEmoticonIcon/>;
                  chipColor = 'success';
                  chipLabel = 'Asistencia correcta';
                  break;
                case 'Retardo':
                  icon = <WarningAmberIcon/>;
                  chipColor = 'warning';
                  chipLabel = 'Retardo';
                  break;
                case 'Falta':
                  icon = <DangerousIcon/>;
                  chipColor = 'error';
                  chipLabel = 'Falta';
                  break;
                case 'Dia incompleto':
                  icon = <SentimentVeryDissatisfiedIcon/>;
                  chipColor = 'error';
                  chipLabel = 'Dia incompleto';
                  break;
                default:
                  icon = null;
                  chipColor = 'primary';
              }
              return (
                <>                  
                  <Chip
                    icon={icon}
                    label={chipLabel}
                    color={chipColor}
                    variant="outlined"
                    style={{ marginLeft: '5px' }}
                  />
                </>
              );
            },            
          },
          { 
            field: 'exit_point_status',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE PUNTO DE SALIDA"}</strong>
            ),
            width: 180,
            renderCell: (params) => {
              let icon = null;
              let chipColor = 'primary';
              let chipLabel = '';
              switch (params.row.exit_point_status) {
                case 'Campo':
                  icon = <EditRoadIcon/>;
                  chipColor = 'warning';
                  chipLabel = 'Campo';
                  break;
                case 'Corporativo':
                  icon = <ApartmentIcon/>;
                  chipColor = 'info';
                  chipLabel = 'Corporativo';
                  break;                
                default:
                  icon = null;
                  chipColor = 'primary';
              }
              return (
                <>                  
                  <Chip
                    icon={icon}
                    label={chipLabel}
                    color={chipColor}
                    variant="outlined"
                    style={{ marginLeft: '5px' }}
                  />
                </>
              );
            },
          },
          { 
            field: 'exit_attendance_place',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE SALIDA"}</strong>
            ),
            width: 120,
            renderCell: (params) => (
              <PersonPinCircleIcon 
                style={{ cursor: 'pointer', color: 'lightblue', fontSize: 40 }} 
                onClick={() => {
                  window.open(params.value, '_blank');
                }}
              />
            ),
          },
        ];
      
        return columns;
      };

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

      const handleExportToExcel = async () => {
        try {
            setIsLoading(true)
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Usuarios");
            
            worksheet.columns = [
                { header: "Nombre", key: "user", width: 30 },                
                { header: "Plaza", key: "place", width: 20 },
                { header: "Fecha de Captura", key: "date_capture", width: 20 },
                { header: "Hora de Entrada", key: "entry_time", width: 20 },
                { header: "Estatus de Entrada", key: "entry_status", width: 20 },
                { header: "Estatus de Punto de Entrada", key: "entry_point_status", width: 25 },                
                { header: "Hora de Salida", key: "exit_time", width: 20 },
                { header: "Estatus de Salida", key: "exit_status", width: 20 },
                { header: "Estatus de Punto de Salida", key: "exit_point_status", width: 25 },                
            ];

            users.forEach((user) => {
                worksheet.addRow({
                    user: user.user,                    
                    place: user.place,
                    date_capture: user.date_capture,
                    entry_time: user.entry_time,
                    entry_status: user.entry_status,
                    entry_point_status: user.entry_point_status,                    
                    exit_time: user.exit_time,
                    exit_status: user.exit_status,
                    exit_point_status: user.exit_point_status,                    
                });
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
            setIsLoading(false)
        }
    };    

      function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton color="secondary" />
            <GridToolbarFilterButton color="secondary" />
            <GridToolbarDensitySelector color="secondary" />
    
            <Button
                color="secondary"
                onClick={handleExportToExcel}
            >
                Exportar a Excel
            </Button>    
            
          </GridToolbarContainer>
        );
      }

      console.log('place_id', selectedPlace)      
      console.log('start_date', selectedStartDate)
      console.log('finish_date', selectedEndDate)
      console.log('isLoading', isLoading)

    return (
        <>
        <LoadingModal open={isLoading}/>
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
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
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
                  defaultValue="2023-01-01"                 
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
                  value={selectedEndDate}
                  onChange={handleEndDateChange}
                  defaultValue="2023-01-01"                 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                  style={{ width: '100%', height: '100%' }}
                  onClick={() => {
                    handleGetWorkAttendance();                    
                  }}
                  >
                  Generar
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <Box m="20px">
            <Header title="Listado de asistencia" />
            <Box
              sx={{
                height: 400,
                width: '100%',
                '.css-196n7va-MuiSvgIcon-root': {
                  fill: 'white',
                },
              }}
            >
              {users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>No row</div>
              ) : (
                <DataGrid
                  rows={users}
                  columns={buildColumns()}
                  getRowId={(row) => row.user_id}
                  editable={false} 
                  slots={{ toolbar: CustomToolbar}}                
                />
              )}
            </Box>
          </Box>

        </>

    );
};
export default Index;