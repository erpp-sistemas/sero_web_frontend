import React, { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import AlertMessage from "../../components/AlertMessage";
import { useSelector } from 'react-redux'
import { Box, useTheme, Button} from "@mui/material";
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import { read, utils } from 'xlsx';
import {workAssignmentRequest} from '../../api/assignment.js'
import CustomAlert from '../../components/CustomAlert.jsx'
import LoadingModal from '../../components/LoadingModal.jsx'
import Header from '../../components/Header.jsx';
import { DataGrid, GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import * as ExcelJS from "exceljs";
import Chip from '@mui/material/Chip';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const Index = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = useSelector(state => state.user)    
    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [fileKey, setFileKey] = useState(0);
    const [resultAssignment, setResultAssignment] = useState([])
    const [resultCounts, setResultCounts] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(false)

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

      const handlePlaceChange = (event) => {
        setSelectedPlace(event.target.value);  
        setSelectedService('');      
      };

      const handleServiceChange = (event) => {
        setSelectedService(event.target.value);        
      };  

      const handleFileChange = (e) => {

        const file = e.target.files[0];

        setSelectedFile(null);    
        setError(null);
        setIsLoading(false)

        if (file) {
          const allowedExtensions = ['.xlsx', '.xls'];
          const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      
          if (allowedExtensions.includes(fileExtension)) {
            setSelectedFile(file);            
            setError(null);            
          } else {        
            setError('El archivo seleccionado no es un archivo Excel válido (.xlsx o .xls).');            
            e.target.value = '';
            setAlertOpen(true)
            setAlertType("error")
            setAlertMessage("¡Error! el archivo seleccionado no es un archivo Excel valido (.xlsx o .xls)")
          }
        }
        else{
          setError("¡Error! Debes seleccionar un archivo Excel.");
        }        
        setFileKey(prevKey => prevKey + 1);
      };

      const handleConvertExcelToArray = async () => {
        try {
          setIsLoading(true);
      
          if(!selectedPlace){
            setIsLoading(false);
            setError("¡Error! Debes seleccionar una plaza");
            setAlertOpen(true)
            setAlertType("error")
            setAlertMessage("¡Error! Debes seleccionar una plaza")            
            return;
          }
          else if (!selectedService){
            setIsLoading(false);
            setError("¡Error! Debes seleccionar un servicio");
            setAlertOpen(true)
            setAlertType("error")
            setAlertMessage("¡Error! Debes seleccionar un servicio")
            return;
          }
          else if (!selectedFile) {
            setIsLoading(false);
            setError("¡Error! Debes seleccionar un archivo Excel.");
            setAlertOpen(true)
            setAlertType("error")
            setAlertMessage("¡Error! Debes seleccionar un archivo Excel.")
            return;
          }
      
          const reader = new FileReader();
      
          reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = read(data, { type: "array" });
                  
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelData = utils.sheet_to_json(sheet);      
            
            const requiredColumns = ["cuenta", "usuario", "tarea"];
            const missingColumns = requiredColumns.filter(col => !Object.keys(excelData[0]).includes(col));
      
            if (missingColumns.length > 0) {
              setIsLoading(false);
              setError(`El archivo Excel no contiene las columnas requeridas: ${missingColumns.join(", ")}.`);
              setAlertOpen(true)
              setAlertType("error")
              setAlertMessage(`El archivo Excel no contiene las columnas requeridas: ${missingColumns.join(", ")}.`)
              return;
            }

            const mappedData = excelData.map(row => ({
              cuenta: row.cuenta,
              usuario: row.usuario,
              tarea: row.tarea
            }));     
            
            console.log("Datos del archivo Excel mapeados a objetos:", mappedData);

            const result = await workAssignmentRequest(selectedPlace, selectedService, mappedData);

            console.log('Respuesta del backend:', result.data);

            setResultAssignment(result.data)
      
            setIsLoading(false);
            setError(null);
            setAlertOpen(true)
            setAlertType("success")
            setAlertMessage("¡Felicidades! Se cargaron con exito sus asignaciones")
          };
      
          reader.onerror = (error) => {
            setIsLoading(false);
            console.error("Error al leer el archivo Excel:", error);
            setError("¡Error al leer el archivo Excel!");
            setAlertOpen(true)
            setAlertType("error")
            setAlertMessage("¡Error! Error al leer el archivo Excel")
          };
      
          reader.readAsArrayBuffer(selectedFile);
        } catch (error) {
          setIsLoading(false);
          console.error("Error general al convertir Excel a Array:", error);
          setError("¡Error al convertir Excel a Array!");
          setAlertOpen(true)
          setAlertType("error")
          setAlertMessage("¡Error! Error al convertir Excel a Array!")
        }
      };

  useEffect(() => {      
      const counts = resultAssignment.reduce((acc, row) => {
          const result = row.assignment_result;
          
          acc[result] = (acc[result] || 0) + 1;

          return acc;
      }, {});

      setResultCounts(counts);      
      setTotalRecords(resultAssignment.length);
      console.log(counts)

  }, [resultAssignment])

  const resultIcons = {
    "asignacion correcta": <CheckCircleIcon />,
    "no existe la cuenta": <ErrorIcon />,
    "cuenta duplicada": <WarningIcon />,
    "no existe la tarea": <CancelIcon />,
    "no existe el usuario": <PersonOutlineIcon />,
    "no tiene deuda en el mes actual": <AttachMoneyIcon />,
};

const buildColumns = () => {   
  const columns = [
    { 
      field: 'account',
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"CUENTA"}</strong>
      ),
      width: 100,
      editable: false,
    },
    { 
      field: 'task_assigned',
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"TAREA ASIGNADA"}</strong>
      ),
      width: 150,
      editable: false,
    },
    { 
      field: 'person_assigned',
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"PERSONA ASIGNADA"}</strong>
      ),
      width: 210,
      editable: false,
    },
    { 
      field: 'assignment_result',
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"RESULTADO DE LA ASIGNACION"}</strong>
      ),
      width: 210,
      editable: false,
      renderCell: (params) => {
        const result = params.row.assignment_result;
        let chipColor = 'default';
        let icon = ''
        switch (result) {
          case 'asignacion correcta':
            icon = <DoneAllIcon/>;
            chipColor = 'success';
            break;
          case 'no existe la cuenta':
            icon = <ErrorIcon/>
            chipColor="error"
            break
          case 'cuenta duplicada':
            icon = <WarningIcon/>;
            chipColor = 'warning'
            break
          case 'no existe la tarea':
            icon = <CancelIcon/>
            chipColor="error"
            break
          case 'no existe el usuario':
            icon = <PersonOutlineIcon/>
            chipColor="error"
            break
          case 'no tiene deuda en el mes actual':
            icon = <WarningIcon/>;
            chipColor = 'warning';
            break;
          default:
            icon = <NotInterestedIcon/>;
            chipColor = 'default';
            break;
        }
        return (
        <>
          <Chip 
          label={result} 
          color={chipColor}
          variant="outlined" 
          icon={icon}
          style={{ marginLeft: '5px' }}
          />
        </>
        )
      },
    }
  ]
  return columns;
}

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

const handleExportToExcel = async () => {
  try {
    setIsLoading(true)
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");
                  
      const headers = Object.keys(resultAssignment[0]);
      worksheet.addRow(headers);          
      
      resultAssignment.forEach(row => {
          const values = headers.map(header => row[header]);
          worksheet.addRow(values);
      });
      

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "assignment.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false)
  } catch (error) {
      console.error("Error:", error);
      return null;
  }
};

const handleDownloadExcel = async (result) => {
  try {
    setIsLoading(true);

    const filteredData = resultAssignment.filter(row => row.assignment_result === result);
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

      console.log('place_id', selectedPlace)
      console.log('service_id',selectedService)
      console.log('file', selectedFile)
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
               <CustomAlert
                alertOpen={alertOpen}
                type={alertType}
                message={alertMessage}
                onClose={setAlertOpen}
              />
            <LoadingModal open={isLoading}/>
              <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={6}>
                  <PlaceSelect                
                  selectedPlace={selectedPlace}
                  handlePlaceChange={handlePlaceChange}
                />
                </Grid>
                <Grid item xs={6}>
                  <ServiceSelect
                    selectedPlace={selectedPlace}                  
                    selectedService={selectedService}
                    handleServiceChange={handleServiceChange}
                  />
                </Grid>
              </Grid>
              <Box>
                <label htmlFor="file-upload-excel">
                  <Typography variant="body1" gutterBottom>
                    Cargar archivo Excel
                  </Typography>
                  <Input
                  key={fileKey}
                    accept=".xlsx, .xls"
                    id="file-upload-excel"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />                
                  <Typography variant="body2">
                    Archivo seleccionado: {selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}
                  </Typography>
                </label>
              </Box>

              {error && <AlertMessage message={error} type="error" />}

              <Button
                variant="contained"
                color="primary"
                sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                onClick={() => {
                  handleConvertExcelToArray();
                  
                }}                
              >
                Carga Asignaciones
              </Button>             

            </Box>

                
            <Box m="20px">            
            <Header title="Asignacion manual"/>            
            <Box
              sx={{
                height: 400,
                width: '100%',
                '.css-196n7va-MuiSvgIcon-root': {
                  fill: 'white',
                },
              }}
            >
              <Grid container spacing={2}>                   
                  <Grid item xs={8}>
                  {resultAssignment.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>No row</div>
                    ) : (
                      <DataGrid
                        rows={resultAssignment}
                        columns={buildColumns()}
                        getRowId={(row) => row.id}
                        editable={false} 
                        slots={{ toolbar: CustomToolbar}}                
                      />
                    )}
                  </Grid>
                  <Grid item xs={4}>
                  <Box
                    m='10px 0'
                    display='flex'
                    flexDirection='column'
                    justifyContent='space-evenly'
                    gap='20px'
                    sx={{
                        backgroundColor: colors.primary[400],
                        padding: '15px 10px',
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
                            <DoneAllIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={`Registros Cargados: ${totalRecords}`} />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      {Object.entries(resultCounts).map(([result, count]) => (
                        <React.Fragment key={result}>
                            <ListItem button onClick={() => handleDownloadExcel(result)}>
                                <ListItemAvatar>
                                    <Avatar>
                                        {resultIcons[result]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={`${result}: ${count}`} />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                    </Box>
                  </Grid>
              </Grid>              
            </Box>
          </Box>
        </>

    );
};
export default Index;