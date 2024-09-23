import React, { useState, useEffect, useMemo } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme.js";
import PlaceSelect from '../../components/PlaceSelect.jsx'
import ServiceSelect from '../../components/ServiceSelect.jsx'
import ProcessSelect from '../../components/ProcessSelectMultipleChip.jsx'
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
import Header from '../../components/Header.jsx';
import { DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import { Balance, CalendarToday, DoneAll, LocationOff, MarkEmailRead, NotListedLocation, ReceiptLong, Search, WaterDrop, WrongLocation } from "@mui/icons-material";
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
    const [newImageUrl, setNewImageUrl] = useState([]);
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);

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
          setPage(0);

          const response = await photoManagementRequest(selectedPlace, selectedService, selectedProcess, selectedStartDate, selectedFinishDate);

          setResult(response.data)
          // setRows(response.data)

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

          if (error.response) {
            
            if (error.response.status === 400) {
                setAlertOpen(true);
                setAlertType("warning");
                setAlertMessage("¡Atención! No se encontraron gestiones");
                setResult([]);
                setGestores([])
            } else {
                
                setAlertOpen(true);
                setAlertType("error");
                setAlertMessage(`¡Error! ${error.response.status}: ${error.response.statusText}`);
                setResult([]);
                setGestores([])
            }
        } else if (error.request) {
            
            setAlertOpen(true);
            setAlertType("error");
            setAlertMessage("¡Error! No se pudo contactar con el servidor");
            setResult([]);
            setGestores([])
        } else {
            
            setAlertOpen(true);
            setAlertType("error");
            setAlertMessage(`¡Error! ${error.message}`);
            setResult([]);
            setGestores([])
        }
          
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
              Object.values(item).some(value => value != null && value.toString().toLowerCase().includes(filterText.toLowerCase()))
          );
      }

      setFilteredResult(filtered);
      setShowNoResultsMessage(filtered.length === 0 && filterText.length > 0);
    }, [selectedGestores, result, filterText]);

    const handleExportToExcel = async () => {
      try {
        setIsLoading(true);
    
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Registros Encontrados");  
    
        const columnHeaders = {
          id_registro: "id_registro",
          cuenta: "cuenta",
          propietario: "propietario",
          calle: "calle",
          num_ext: "num_ext",
          num_int: "num_int",
          colonia: "colonia",
          codigo_postal: "codigo_postal",
          tarea_gestionada: "tarea_gestionada",          
          nombre_gestor: "nombre_gestor",
          fecha_gestion: "fecha_gestion",
          estatus_predio: "estatus_predio",
          proceso: "proceso",          
          foto_fachada_1:"foto_fachada_1",
          tipo_foto_fachada_1: "tipo_foto_fachada_1",          
          foto_fachada_2: "foto_fachada_2",
          tipo_foto_fachada_2: "tipo_foto_fachada_2",          
          foto_evidencia_1: "foto_evidencia_1",
          tipo_foto_evidencia_1: "tipo_foto_evidencia_1",          
          foto_evidencia_2: "foto_evidencia_2",
          tipo_foto_evidencia_2: "tipo_foto_evidencia_2",          
        };
    
        const addRowsToWorksheet = (data) => {
          const headers = Object.keys(columnHeaders);
          const headerRow = headers.map(header => columnHeaders[header]);
          worksheet.addRow(headerRow);
    
          data.forEach((row) => {
            const values = headers.map((header) => row[header]);
            worksheet.addRow(values);
          });
        };
    
        if (filteredUsers.length > 0) {
          addRowsToWorksheet(filteredUsers);
        } else {
          addRowsToWorksheet(data);
        }
    
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Registros_Medidor_Pila.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
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
          field: 'estatus_predio',
          renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DEL PREDIO"}</strong>
          ),
          width: 200,
          editable: false,
          renderCell: (params) => {
            let color;
            let icon;
    
            if (params.value === 'Predio localizado') {
              color = 'secondary';
              icon = <DoneAll sx={{ color: 'secondary' }} />;
            } else if (params.value === 'Predio baldío') {
              color = 'info';
              icon = <WrongLocation sx={{ color: 'info' }} />;
            } else if (params.value === 'Predio abandonado') {
              color = 'warning';
              icon = <NotListedLocation sx={{ color: 'warning' }} />;            
            } else if (params.value === 'Predio no localizado') {
              color = 'error';
              icon = <LocationOff sx={{ color: 'error' }} />;
            } else {
              color = 'success';
              icon = <ReceiptLong sx={{ color: 'success' }} />;
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
                  cuenta: params.row.cuenta,
                  id_registro: params.row.id_registro,
                  id_registro_foto: params.row.id_foto_fachada_1,
                  foto: params.row.foto_fachada_1,
                  tarea_gestionada: params.row.tarea_gestionada,
                  nombre_gestor: params.row.nombre_gestor,
                  fecha_gestion: params.row.fecha_gestion,
                  proceso: params.row.proceso,
                  tipo: params.row.tipo_foto_fachada_1,
                  num_foto: 1,
                  celda: 'foto_fachada_1'
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
                    cuenta: params.row.cuenta,
                    id_registro: params.row.id_registro,
                    id_registro_foto: params.row.id_foto_fachada_2,
                    foto: params.row.foto_fachada_2,
                    tarea_gestionada: params.row.tarea_gestionada,
                    nombre_gestor: params.row.nombre_gestor,
                    fecha_gestion: params.row.fecha_gestion,
                    proceso: params.row.proceso,
                    tipo: params.row.tipo_foto_fachada_2,
                    num_foto: 2,
                    celda: 'foto_fachada_2'
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
                    cuenta: params.row.cuenta,
                    id_registro: params.row.id_registro,
                    id_registro_foto: params.row.id_foto_evidencia_1,
                    foto: params.row.foto_evidencia_1,
                    tarea_gestionada: params.row.tarea_gestionada,
                    nombre_gestor: params.row.nombre_gestor,
                    fecha_gestion: params.row.fecha_gestion,
                    proceso: params.row.proceso,
                    tipo: params.row.tipo_foto_evidencia_1,
                    num_foto: 1,
                    celda: 'foto_evidencia_1'
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
                    cuenta: params.row.cuenta,
                    id_registro: params.row.id_registro,
                    id_registro_foto: params.row.id_foto_evidencia_2,
                    foto: params.row.foto_evidencia_2,
                    tarea_gestionada: params.row.tarea_gestionada,
                    nombre_gestor: params.row.nombre_gestor,
                    fecha_gestion: params.row.fecha_gestion,
                    proceso: params.row.proceso,
                    tipo: params.row.tipo_foto_evidencia_2,
                    num_foto: 2,
                    celda: 'foto_evidencia_2'
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
  
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
      };      
    
      const handleImageUrlUpdate = (response_photo) => {        

         setNewImageUrl(response_photo);
         const photo_field = response_photo.celda
        
        setFilteredResult(prev =>
            prev.map(row => row.id_registro === selectedRow.id_registro
                ? { 
                    ...row, 
                    [photo_field]: response_photo.image_url,
                    [`id_${photo_field}`]: response_photo.photo_record_id
                  }
                : row
            )
        );

        setResult(prev =>
          prev.map(row => row.id_registro === selectedRow.id_registro
              ? { 
                  ...row, 
                  [photo_field]: response_photo.image_url,
                  [`id_${photo_field}`]: response_photo.photo_record_id
                }
              : row
          )
      );
      };

      useEffect(() => {
        if (newImageUrl && selectedRow) {
          const photo_image_url = newImageUrl.image_url
          const photo_field = newImageUrl.celda
          const photo_record_id = newImageUrl.photo_record_id;          

          setFilteredResult(prev =>
              prev.map(row => row.id_registro === selectedRow.id_registro
                  ? { 
                      ...row, 
                      [photo_field]: photo_image_url,
                      [`id_${photo_field}`]: photo_record_id
                    }
                  : row
              )
          );

          setResult(prev =>
            prev.map(row => row.id_registro === selectedRow.id_registro
                ? { 
                    ...row, 
                    [photo_field]: photo_image_url,
                    [`id_${photo_field}`]: photo_record_id
                  }
                : row
            )
        );
        }
    }, [newImageUrl]);
      

    return (
        <Box 
			sx={{
				padding:'20px'
			}}
		>

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
            
            <Grid item xs={12} md={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
                        pagination
                        page={page}
                        onPageChange={(newPage) => setPage(newPage)}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>              
            </Grid>

            <PhotoViewModal 
				open={openModal} 
				onClose={handleCloseModal} 
				selectedPlace={selectedPlace} 
				selectedService={selectedService} 
				data={selectedRow} 
				onImageUrlUpdate={handleImageUrlUpdate}
            />

          </Box>                 
          
        </Box>

    )

}

export default Index