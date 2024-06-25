import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import {workAttendanceRequest} from '../../api/attendance.js'
import { Box, useTheme, Button, Avatar, InputAdornment, FormControl, FormHelperText} from "@mui/material";
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
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Download, Search } from "@mui/icons-material";

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

    const [searchTerm, setSearchTerm] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [matching, setMatching] = useState(-1);

    const [noResults, setNoResults] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    

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
        
          setNoData('')
          setUsers(response.data);          
          setIsLoading(false)
          setNoResults(false)
          
        } catch (error) {
          setIsLoading(false)

          if(error.response.status === 400){
            setAlertOpen(true)
            setAlertType("warning")
            setAlertMessage("¡Atencion! No se encontraron asistencias")
            setUsers([]);
          }   
        setUsers([]);
          
        }        
      };

      const buildColumns = () => {   
        const columns = [
          { 
            field: 'usuario',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
            ),
            width: 210,
            editable: false,
          },
          { 
            field: 'imagen_url',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"FOTO"}</strong>
            ),
            width: 70,
            renderCell: (params) => <AvatarImage data={params.row.imagen_url} />,
          },
          { 
            field: 'plaza', 
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"PLAZA"}</strong>
            ),
            width: 120,
          },
          { 
            field: 'fecha_captura', 
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
            field: 'hora_entrada',
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
            field: 'estatus_entrada',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE ENTRADA"}</strong>
            ),
            width: 200,
            renderCell: (params) => {
              let icon = null;
              let chipColor = 'primary';
              let chipLabel = '';
              switch (params.row.estatus_entrada) {
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
            field: 'estatus_punto_entrada',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE PUNTO DE ENTRADA"}</strong>
            ),
            width: 200,
            renderCell: (params) => {
              let icon = null;
              let chipColor = 'primary';
              let chipLabel = '';
              switch (params.row.estatus_punto_entrada) {
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
            field: 'lugar_entrada',
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
            field: 'hora_salida',
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
            field: 'estatus_salida',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE SALIDA"}</strong>
            ),
            width: 150,
            renderCell: (params) => {
              let icon = null;
              let chipColor = 'primary';
              let chipLabel = '';
              switch (params.row.estatus_salida) {
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
            field: 'estatus_punto_salida',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE PUNTO DE SALIDA"}</strong>
            ),
            width: 180,
            renderCell: (params) => {
              let icon = null;
              let chipColor = 'primary';
              let chipLabel = '';
              switch (params.row.estatus_punto_salida) {
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
            field: 'lugar_salida',
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
          { 
            field: 'hora_entrada_comida',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"HORA DE ENTRADA DE COMIDA"}</strong>
            ),
            width: 200,
            renderCell: (params) => (
              <>
                {params.value}
                <AccessTimeIcon style={{ marginLeft: '5px' }} />
              </>
            ),
          },
          { 
            field: 'lugar_entrada_comida',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE ENTRADA DE COMIDA"}</strong>
            ),
            width: 200,
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
            field: 'hora_salida_comida',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"HORA DE SALIDA DE COMIDA"}</strong>
            ),
            width: 200,
            renderCell: (params) => (
              <>
                {params.value}
                <AccessTimeIcon style={{ marginLeft: '5px' }} />
              </>
            ),
          },
          { 
            field: 'lugar_salida_comida',
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE SALIDA DE COMIDA"}</strong>
            ),
            width: 200,
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


      const CustomToolbar = () => (
        <GridToolbarContainer >
         
          <GridToolbarDensitySelector color="secondary" />
          <GridToolbarFilterButton color="secondary"/>
          <GridToolbarColumnsButton color="secondary" />
          <GridToolbarExport
          csvOptions={{            
            fileName: 'Registro Asistencia',
            delimiter: ';',
            utf8WithBom: true,
          }}
          printOptions={{ disableToolbarButton: true }}
          color="secondary"          
          />                    
        </GridToolbarContainer>
      );      

      useEffect(() => {        
        const countsE = users.reduce((acce, row) => {
            const resultE = row.estatus_entrada;
            
            acce[resultE] = (acce[resultE] || 0) + 1;
  
            return acce;
        }, {});

        const countsS = users.reduce((accs, row) => {
          const resultS = row.estatus_salida;
          
          accs[resultS] = (accs[resultS] || 0) + 1;

          return accs;
      }, {});
  
        setTotalRecords(users.length);
        setResultCountsEntry(countsE);
        setResultCountsExit(countsS);
  
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
          filteredData = users.filter(row => row.estatus_entrada === result);
        }
        else if (type === 2){
          filteredData = users.filter(row => row.estatus_salida === result);
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
        filteredData = users.filter(row => row.estatus_entrada === result);
      }
      else if(type === 2){
        filteredData = users.filter(row => row.estatus_salida === result);
      }
      
      setModalData(filteredData);
      setOpenModal(true);
    };    
    
    const handleCloseModal = () => {
      setOpenModal(false);
    };    

  useEffect(() => {

    setSearchPerformed(true);

    const matchingUsers = users.filter(user => {
      return Object.values(user).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm)
      );
    });
    
    if (searchTerm === '') {
      setFilteredUsers([]);
      setNoResults(false); 
      setMatching(-1)
    } else {
      if (matchingUsers.length === 0) {
        setFilteredUsers([]);
        setNoResults(true);
        setMatching(0)
      } else {
        setFilteredUsers(matchingUsers);
        setNoResults(false);
        setMatching(matchingUsers.length)
      }
    }

  }, [searchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

    const handleDownloadExcelDataGrid = async () => {
      try {
        setIsLoading(true);        
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Registros Encontrados");

        if (filteredUsers.length > 0){
          const headers = Object.keys(filteredUsers[0]);
          worksheet.addRow(headers);

          filteredUsers.forEach((row) => {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
          });
        }
        else {
          const headers = Object.keys(users[0]);
          worksheet.addRow(headers);

          users.forEach((row) => {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
          });
        }        

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Registros_Asistencia.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        setIsLoading(false);
      } catch (error) {
          console.error("Error:", error);
          setIsLoading(false);
      }
    };

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
                      <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} >
                        <Grid item xs={6}>
                          <FormControl>
                            <TextField                              
                              fullWidth                            
                              value={searchTerm}              
                              onChange={handleChange}              
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
                            
                            {( noResults ) && (
                              <FormHelperText  style={{ color: 'red' }}>
                                No se encontraron resultados
                              </FormHelperText>
                            )}
                            
                          </FormControl>                          
                        </Grid>
                        <Grid item xs={2}>
                          <Button 
                            variant="outlined"                             
                            color="secondary"                            
                            onClick={() => {
                              handleDownloadExcelDataGrid();                    
                            }}
                            size="small"
                            startIcon={<Download/>}
                            >                                                        
                            Exportar
                          </Button>
                        </Grid>
                      </Grid>

                      {(users.length === 0 ) ? (
                          <div style={{ textAlign: 'center', padding: '20px' }}>No se encontraron resultados</div>
                      ) : (
                          <DataGrid
                              rows={filteredUsers.length > 0 ? filteredUsers : users}
                              columns={buildColumns()}
                              getRowId={(row) => row.usuario_id}
                              editable={false} 
                              // slots={{ toolbar: CustomToolbar}}                          
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