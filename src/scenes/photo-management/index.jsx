import React, { useState, useEffect, useMemo } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import ProcessSelect from '../../components/ProcessSelectMultipleChip'
import { photoManagementRequest } from '../../api/management.js'
import { useSelector } from 'react-redux'
import { Box, useTheme, Button, Avatar, Card, CardMedia, InputAdornment} from "@mui/material";
import Viewer from 'react-viewer';
import TextField from '@mui/material/TextField';
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
import { Balance, CalendarToday, MarkEmailRead, ReceiptLong, Search, WaterDrop } from "@mui/icons-material";
import PhotoViewModal from '../../components/PhotoManagement/PhotoViewModal.jsx'

const esES = {
  toolbarColumns: "Columnas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Densidad",
  toolbarExport: "Exportar",
  columnsPanelTextFieldLabel: "Buscar columna",
  columnsPanelTextFieldPlaceholder: "Buscar columna",
  columnsPanelDragIconLabel: "Arrastrar",
  filterPanelTitle: "Filtros",
  filterPanelSearchPlaceholder: "Buscar",
  filterOperatorContains: "Contiene",
  filterOperatorEquals: "Es igual a",
  filterOperatorStartsWith: "Empieza con",
  filterOperatorEndsWith: "Termina con",
  filterOperatorIs: "Es",
  filterOperatorNot: "No es",
  filterOperatorIsEmpty: "Está vacío",
  filterOperatorIsNotEmpty: "No está vacío",
  filterOperatorBefore: "Antes",
  filterOperatorAfter: "Después",
  filterOperatorOnOrBefore: "El o antes",
  filterOperatorOnOrAfter: "El o después",
  filterOperatorIsNull: "Es nulo",
  filterOperatorIsNotNull: "No es nulo",
  columnMenuUnsort: "Desordenar",
  columnMenuSortAsc: "Ordenar ascendente",
  columnMenuSortDesc: "Ordenar descendente",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar columna",
  columnMenuShowColumns: "Mostrar columnas",
  columnMenuPinLeft: "Fijar a la izquierda",
  columnMenuPinRight: "Fijar a la derecha",
  columnMenuReset: "Restablecer",
  columnMenuSort: "Ordenar",
  columnMenuFilterMenu: "Menú de filtros",
  columnMenuToggleFilter: "Alternar filtro",
  columnMenuHide: "Ocultar",
  columnMenuShow: "Mostrar",
  columnMenuGroup: "Agrupar",
  columnMenuUnGroup: "Desagrupar",
  columnMenuExpandAll: "Expandir todo",
  columnMenuCollapseAll: "Colapsar todo",
  columnMenuRename: "Renombrar",
};

const Index = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = useSelector(state => state.user)    
    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedProcess, setSelectedProcess] = useState([]);    
    const [selectedStartDate, setSelectedStartDate] = React.useState('');
    const [selectedFinishDate, setSelectedFinishDate] = React.useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const [alertMessage, setAlertMessage] = useState("");

    const [openModal, setOpenModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null);

    const [result, setResult] = useState([]);
    const [gestores, setGestores] = useState([]);
    const [selectedGestores, setSelectedGestores] = useState([]);
    const [filteredResult, setFilteredResult] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [showNoResultsMessage, setShowNoResultsMessage] = useState(false)
    

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

      const handleStartDateChange = (event) => {
        setSelectedStartDate(event.target.value);
      };

      const handleFinishDateChange = (event) => {
        setSelectedFinishDate(event.target.value);
      };

      const handleFilterChange = (event) => {
        setFilterText(event.target.value);
      } 

      const handleOpenModal = (rowData) => {
        setSelectedRow(rowData);
        setOpenModal(true)
      }
    
      const handleCloseModal = () => {
        setSelectedRow(null);
        setOpenModal(false)
      }

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

          const response = await photoManagementRequest(selectedPlace, selectedService, selectedProcess, selectedStartDate, selectedFinishDate);

          setResult(response.data)

          console.log(response.data)

          const groupedGestores = response.data.reduce((acc, item) => {
            if (!acc[item.nombre_gestor]) {
                acc[item.nombre_gestor] = {
                    nombre_gestor: item.nombre_gestor,
                    foto: item.foto,
                    registros: 0,
                };
            }
            acc[item.nombre_gestor].registros += 1;
            return acc;
        }, {});

        setGestores(Object.values(groupedGestores));
        setFilteredResult(response.data);

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

      const handleChipToggle = (gestor) => {
        setSelectedGestores(prev =>
            prev.includes(gestor)
                ? prev.filter(item => item !== gestor)
                : [...prev, gestor]
        );
    };

    useEffect(() => {
      let filtered = result;

      if (selectedGestores.length > 0) {
          filtered = filtered.filter(item => selectedGestores.includes(item.nombre_gestor));
      }

      if (filterText) {
          filtered = filtered.filter(item =>
              Object.values(item).some(value => value.toString().toLowerCase().includes(filterText.toLowerCase()))
          );
      }

      setFilteredResult(filtered);
      setShowNoResultsMessage(filtered.length === 0 && filterText.length > 0);
    }, [selectedGestores, result, filterText]);

    const handleExportToExcel = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Datos');
    
      // Agregar encabezados de columna
      worksheet.columns = [
        { header: 'CUENTA', key: 'cuenta', width: 15 },
        { header: 'GESTOR', key: 'nombre_gestor', width: 20 },
        { header: 'SERVICIO', key: 'nombre_servicio', width: 20 },
        { header: 'PROCESO', key: 'nombre_proceso', width: 20 },
        { header: 'FECHA CAPTURA', key: 'fechaCaptura', width: 15 },
        { header: 'FOTO FACHADA', key: 'foto_fachada_1', width: 30 },
      ];
    
      // Agregar datos
      filteredResult.forEach(row => {
        worksheet.addRow({
          cuenta: row.cuenta,
          nombre_gestor: row.nombre_gestor,
          nombre_servicio: row.nombre_servicio,
          nombre_proceso: row.nombre_proceso,
          fechaCaptura: row.fechaCaptura,
          foto_fachada_1: '', // Inicialmente vacío, se actualizará más tarde con la imagen
        });
      });
    
      // Función para convertir una URL de imagen a base64
      const urlToBase64 = async (url) => {
        console.log('url', url)
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
    
      // Agregar imágenes
      for (let i = 0; i < filteredResult.length; i++) {
        const row = filteredResult[i];
        if (row.foto_fachada_1) {
          const base64Image = await urlToBase64(row.foto_fachada_1);
          const imageId = workbook.addImage({
            base64: base64Image,
            extension: 'jpeg', // Ajusta la extensión según el formato de tu imagen
          });
    
          // Ajustar tamaño de la celda
          worksheet.getCell(i + 2, 6).alignment = { vertical: 'middle', horizontal: 'center' };
          worksheet.getCell(i + 2, 6).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' } // Fondo blanco para la celda
          };
    
          // Agregar la imagen a la celda específica
          worksheet.addImage(imageId, {
            tl: { col: 5, row: i + 1 }, // Columna y fila donde se añadirá la imagen
            ext: { width: 30, height: 30 }, // Ajusta el tamaño de la imagen si es necesario
            editAs: 'oneCell', // Asegura que la imagen esté contenida en una celda
          });
    
          // Ajustar el tamaño de la columna
          worksheet.getColumn(6).width = 30;
        }
      }
    
      // Guardar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = 'datos.xlsx'; // Puedes ajustar el nombre del archivo aquí
      a.click();
      window.URL.revokeObjectURL(url);
    };
    
  
  
  
  
  
  
  

      const CustomToolbar = () => (
        <GridToolbarContainer>
            <GridToolbarColumnsButton color="secondary">
                Columnas
            </GridToolbarColumnsButton>
            <GridToolbarFilterButton color="secondary" />
            <GridToolbarDensitySelector color="secondary" />
            <Button variant="contained" color="primary" onClick={handleExportToExcel}>
                Exportar a Excel
            </Button>
        </GridToolbarContainer>
    );

      const buildColumns = useMemo(() => {
        return [
        { 
          field: 'cuenta',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"CUENTA"}</strong>
          ),
          width: 150,
          editable: false,
        },
        { 
          field: 'propietario',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"PROPIETARIO"}</strong>
          ),
          width: 300,
          editable: false,
        },
        { 
          field: 'calle',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"CALLE"}</strong>
          ),
          width: 300,
          editable: false,
        },
        { 
          field: 'num_ext',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"NUM EXT"}</strong>
          ),
          width: 150,
          editable: false,
        },
        { 
          field: 'num_int',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"NUM INT"}</strong>
          ),
          width: 150,
          editable: false,
        },
        { 
          field: 'colonia',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"COLONIA"}</strong>
          ),
          width: 150,
          editable: false,
        },
        { 
          field: 'codigo_postal',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"CODIGO POSTAL"}</strong>
          ),
          width: 150,
          editable: false,
        },
        { 
          field: 'tarea_gestionada',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"TAREA GESTIONADA"}</strong>
          ),
          width: 200,
          editable: false,
          renderCell: (params) => {
            let color;
            let icon;
    
            if (params.value === '1ra Carta Invitación') {
              color = 'secondary';
              icon = <MarkEmailRead sx={{ color: 'secondary' }} />;
            } else if (params.value === '2da Carta Invitación') {
              color = 'warning';
              icon = <MarkEmailRead sx={{ color: 'warning' }} />;
            } else if (params.value === '3ra Carta Invitación') {
              color = 'warning';
              icon = <MarkEmailRead sx={{ color: 'warning' }} />;
            } else if (params.value === '4ta Carta Invitación') {
              color = 'error';
              icon = <MarkEmailRead sx={{ color: 'error' }} />;
            } else {
              color = 'info';
              icon = <ReceiptLong sx={{ color: 'info' }} />;
            }
    
            return (
              <Chip
                icon={icon}
                label={
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                    {params.value}
                  </Typography>
                }
                variant="outlined"
                color={color}
              />
            );
          },
        },        
        { 
          field: 'nombre_gestor',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"NOMBRE DE GESTOR"}</strong>
          ),
          width: 290,
          renderCell: (params) => (
            <Box sx={{ display: 'flex', alignItems: 'center', p: '2px' }}>
              <AvatarImage data={params.row.foto} />
              <Typography variant="h6" sx={{ marginLeft: 1 }}>{params.value}</Typography>
            </Box>
          )
        },
        { 
          field: 'fecha_gestion',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"FECHA DE GESTION"}</strong>
          ),
          width: 210,
          editable: false,
          renderCell: (params) => (
            <Chip
              icon={<CalendarToday />}
              label={
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  {formatDate(params.value)}
                </Typography>
              }
              variant="outlined"
              sx={{
                borderColor: theme.palette.info.main,
                color: theme.palette.info.main,
                '& .MuiChip-icon': {
                  color: theme.palette.info.main
                }
              }}
            />
          )
        },
        { 
          field: 'proceso',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"PROCESO"}</strong>
          ),
          width: 200,
          editable: false,
          renderCell: (params) => {
            let color;
            let icon;
    
            if (params.value === 'carta_invitacion') {
              color = 'secondary';
              icon = <MarkEmailRead sx={{ color: 'secondary' }} />;
            } else if (params.value === 'cortes') {
              color = 'info';
              icon = <WaterDrop sx={{ color: 'info' }} />;
            } else if (params.value === 'ejecucion_fiscal') {
              color = 'warning';
              icon = <Balance sx={{ color: 'warning' }} />;            
            } else {
              color = 'info';
              icon = <ReceiptLong sx={{ color: 'info' }} />;
            }
    
            return (
              <Chip
                icon={icon}
                label={
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                    {params.value}
                  </Typography>
                }
                variant="outlined"
                color={color}
              />
            );
          },
        }, 
        { 
          field: 'foto_fachada_1',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"FOTO FACHADA 1"}</strong>
          ),
          width: 150,
          renderCell: (params) => (
            params.row.foto_fachada_1 ? (
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
                 image={params.row.foto_fachada_1}
                 alt="Foto fachada 1"
                 sx={{ 
                   objectFit: 'cover'
                 }}
                 onClick={() => handleOpenModal({
                  id_registro: params.row.id_registro,
                  foto: params.row.foto_fachada_1,
                  tarea_gestionada: params.row.tarea_gestionada,
                  nombre_gestor: params.row.nombre_gestor,
                  fecha_gestion: params.row.fecha_gestion,
                  proceso: params.row.proceso,
                  tipo: params.row.tipo_foto_fachada_1
                })}
                />                
              </Card>
            ) : (
              <Typography>No disponible</Typography>
            )
          )
        },
        { 
          field: 'foto_fachada_2',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"FOTO FACHADA 2"}</strong>
          ),
          width: 150,
          renderCell: (params) => (
            params.row.foto_fachada_2 ? (
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
                  image={params.row.foto_fachada_2}
                  alt="Foto fachada 2"
                  sx={{ 
                    objectFit: 'cover'
                  }}
                  onClick={() => handleOpenModal({
                    id_registro: params.row.id_registro,
                    foto: params.row.foto_fachada_2,
                    tarea_gestionada: params.row.tarea_gestionada,
                    nombre_gestor: params.row.nombre_gestor,
                    fecha_gestion: params.row.fecha_gestion,
                    proceso: params.row.proceso,
                    tipo: params.row.tipo_foto_fachada_2
                  })}
                />                
              </Card>
            ) : (
              <Typography>No disponible</Typography>
            )
          )
        },
        { 
          field: 'foto_evidencia_1',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"FOTO EVIDENCIA 1"}</strong>
          ),
          width: 150,
          renderCell: (params) => (
            params.row.foto_evidencia_1 ? (
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
                  image={params.row.foto_evidencia_1}
                  alt="Foto evidencia 1"
                  sx={{ 
                    objectFit: 'cover'
                  }}
                  onClick={() => handleOpenModal({
                    id_registro: params.row.id_registro,
                    foto: params.row.foto_evidencia_1,
                    tarea_gestionada: params.row.tarea_gestionada,
                    nombre_gestor: params.row.nombre_gestor,
                    fecha_gestion: params.row.fecha_gestion,
                    proceso: params.row.proceso,
                    tipo: params.row.tipo_foto_evidencia_1
                  })}
                />                
              </Card>
            ) : (
              <Typography>No disponible</Typography>
            )
          )
        },
        { 
          field: 'foto_evidencia_2',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"FOTO EVIDENCIA 2"}</strong>
          ),
          width: 150,
          renderCell: (params) => (
            params.row.foto_evidencia_2 ? (
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
                  image={params.row.foto_evidencia_2}
                  alt="Foto evidencia 2"
                  sx={{ 
                    objectFit: 'cover'
                  }}
                  onClick={() => handleOpenModal({
                    id_registro: params.row.id_registro,
                    foto: params.row.foto_evidencia_2,
                    tarea_gestionada: params.row.tarea_gestionada,
                    nombre_gestor: params.row.nombre_gestor,
                    fecha_gestion: params.row.fecha_gestion,
                    proceso: params.row.proceso,
                    tipo: params.row.tipo_foto_evidencia_2
                  })}
                />                
              </Card>
            ) : (
              <Typography>No disponible</Typography>
            )
          )
        },
        ];
      }, []);

      const AvatarImage = ({ data }) => {
        const [visibleAvatar, setVisibleAvatar] = React.useState(false)
        return (
        <>
          <Avatar
          onClick={() => {
            setVisibleAvatar(true)
          }}
          alt="Remy Sharp"
          src={data}
          />
      
          <Viewer
          visible={visibleAvatar}
          onClose={() => {
            setVisibleAvatar(false)
          }}
          images={[{ src: data, alt: 'avatar' }]}          
          />
        </>
        )
      }

      const formatDate = (dateString) => {
        const date = new Date(dateString);
  
        const datePart = date.toISOString().split('T')[0];
        const timePart = date.toISOString().split('T')[1].split('.')[0];
        return `${datePart} ${timePart}`;
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
              <Grid item xs={4}>
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
              <Grid item xs={4}>
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
              <Grid item xs={4}>
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

            <Box
                display='flex'
                flexWrap='wrap'
                gap='10px'
                my='20px'
            >
                {gestores.map((gestor) => (
                    <Chip
                        key={gestor.nombre_gestor}
                        avatar={<Avatar src={gestor.foto} />}
                        label={`${gestor.nombre_gestor} (${gestor.registros})`}
                        onClick={() => handleChipToggle(gestor.nombre_gestor)}
                        color={selectedGestores.includes(gestor.nombre_gestor) ? "secondary" : "default"}
                    />
                ))}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
            </Grid>

            <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
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
                    {/* {result.length === 0 ? ( */}
                    {showNoResultsMessage ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>No row</div>
                    ) : (
                      <DataGrid
                        rows={filteredResult.length > 0 ? filteredResult : result}
                        columns={ buildColumns }
                        getRowId={(row) => row.id}
                        editable={false}                         
                        slots={{ toolbar: CustomToolbar}}
                        rowHeight={130}
                        localeText={esES}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>              
            </Grid>

            <PhotoViewModal open={openModal} onClose={handleCloseModal} data={selectedRow} />
          </Box>                 
          
        </>

    );
};
export default Index;