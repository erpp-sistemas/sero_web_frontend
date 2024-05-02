import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import {workAttendanceRequest} from '../../api/attendance.js'
import { Box, useTheme, Button, Avatar} from "@mui/material";
import Viewer from 'react-viewer';
import TextField from '@mui/material/TextField';
import Header from '../../components/Header';
import { DataGrid,
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
import CustomAlert from '../../components/CustomAlert.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PreviewIcon from '@mui/icons-material/Preview';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Divider from '@mui/material/Divider';
import ModalTable from '../../components/work-attendance/ModalTable.jsx'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

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
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);
    const [resultCountsEntry, setResultCountsEntry] = useState({});    
    const [resultCountsExit, setResultCountsExit] = useState({});   
    
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState([]);

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
          else if(!selectedEndDate){
            setAlertOpen(true)
            setAlertType("error")
            setAlertMessage("¡Error! Debes seleccionar una fecha final")
            return
          }

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

      useEffect(() => {
        const countsE = users.reduce((acce, row) => {
            const resultE = row.entry_status;
            
            acce[resultE] = (acce[resultE] || 0) + 1;
  
            return acce;
        }, {});

        const countsS = users.reduce((accs, row) => {
          const resultS = row.exit_status;
          
          accs[resultS] = (accs[resultS] || 0) + 1;

          return accs;
      }, {});
  
        setTotalRecords(users.length);
        setResultCountsEntry(countsE);
        setResultCountsExit(countsS);        
        console.log(countsE)
        console.log(countsS)
  
      }, [users])
  
    const resultIcons = {
        "Asistencia correcta": <CheckCircleIcon color="secondary"/>,
        "Retardo": <WarningIcon color="warning"/>,
        "Falta": <ErrorIcon color="error"/>,
        "Dia incompleto": <WarningIcon color="warning"/>,
    };

    const handleDownloadExcel = async (type, result) => {
      try {
        setIsLoading(true);

        let filteredData

        if (type === 1){
          filteredData = users.filter(row => row.entry_status === result);
        }
        else if (type === 2){
          filteredData = users.filter(row => row.exit_status === result);
        }
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Registros Encontrados");
    
        const headers = Object.keys(filteredData[0]);
        worksheet.addRow(headers);
    
        filteredData.forEach(row => {
          const values = headers.map(header => row[header]);
          worksheet.addRow(values);
        });
    
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${result}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    const handleOpenModal = (type, result) => {

      let filteredData

      if(type === 1){
        filteredData = users.filter(row => row.entry_status === result);
      }
      else if(type === 2){
        filteredData = users.filter(row => row.exit_status === result);
      }
      
      setModalData(filteredData);
      setOpenModal(true);
    };
  
    const handleCloseModal = () => {
      setOpenModal(false);
    };

      console.log('place_id', selectedPlace)      
      console.log('start_date', selectedStartDate)
      console.log('finish_date', selectedEndDate)
      console.log('isLoading', isLoading)

    return (
        <>
        <LoadingModal open={isLoading}/>
        <CustomAlert
          alertOpen={alertOpen}
          type={alertType}
          message={alertMessage}
          onClose={setAlertOpen}
        />
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
                  <ManageSearchIcon fontSize="large"/>
                  Buscar
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={8}>
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

                </Grid>
                <Grid item xs={4}>
                <Box
                    m='5px 0'
                    display='flex'
                    flexDirection='column'
                    justifyContent='space-evenly'
                    gap='10px'
                    sx={{
                        backgroundColor: colors.primary[400],
                        padding: '5px 5px',
                        borderRadius: '10px',
                        width: '100%',
                    }}
                  >
                    <List
                      sx={{
                        width: '100%',
                        maxWidth: 360,                        
                        bgcolor: {backgroundColor: colors.primary[400]},
                      }}
                    >
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <DoneAllIcon color="secondary"/>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={`Registros encontrados: ${totalRecords}`} />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem sx={{backgroundColor: theme.palette.info.main}}>
                        <ListItemIcon>
                            <SubdirectoryArrowRightIcon />
                        </ListItemIcon>
                        <ListItemText primary={`Entrada`} />                        
                      </ListItem>                      
                      <Divider variant="inset" component="li" />
                      {Object.entries(resultCountsEntry).map(([result, count]) => (
                        <React.Fragment key={result}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        {resultIcons[result]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={`${result}: ${count}`} />
                                <ListItemSecondaryAction>
                                  <Tooltip title="Descargar" arrow>
                                    <IconButton onClick={() => handleDownloadExcel(1, result)}>
                                      <CloudDownloadIcon  style={{ color: theme.palette.secondary.main }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Ver Registros" arrow>
                                    <IconButton  onClick={() => handleOpenModal(1, result)}>
                                      <PreviewIcon  style={{ color: theme.palette.info.main }} />
                                    </IconButton>
                                  </Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                      <ListItem sx={{backgroundColor: theme.palette.info.main}}>
                        <ListItemIcon>
                            <SubdirectoryArrowLeftIcon />
                        </ListItemIcon>
                        <ListItemText primary={`Salida`} />                        
                      </ListItem>                      
                      <Divider variant="inset" component="li" />
                        {Object.entries(resultCountsExit).map(([results, counts]) => (
                          <React.Fragment key={results}>
                              <ListItem>
                                  <ListItemAvatar>
                                      <Avatar>
                                          {resultIcons[results]}
                                      </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText primary={`${results}: ${counts}`} />
                                  <ListItemSecondaryAction>
                                    <Tooltip title="Descargar" arrow>
                                      <IconButton onClick={() => handleDownloadExcel(2, results)}>
                                        <CloudDownloadIcon  style={{ color: theme.palette.secondary.main }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Ver Registros" arrow>
                                      <IconButton  onClick={() => handleOpenModal(2, results)}>
                                        <PreviewIcon  style={{ color: theme.palette.info.main }} />
                                      </IconButton>
                                    </Tooltip>
                                  </ListItemSecondaryAction>
                              </ListItem>
                              <Divider variant="inset" component="li" />
                          </React.Fragment>
                        ))}
                    </List>
                  </Box>
                </Grid>
              </Grid>

              <ModalTable open={openModal} onClose={handleCloseModal} data={modalData} />
          </Box>
          
          

        </>

    );
};
export default Index;