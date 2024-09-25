import React, { useState, useEffect, useMemo, useRef } from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme.js";
import PlaceSelect from '../../components/PlaceSelect.jsx'
import ServiceSelect from '../../components/ServiceSelect.jsx'
import ProcessSelect from '../../components/ProcessSelectMultipleChip.jsx'
import { photoManagementRequest } from '../../api/management.js'
import { useSelector } from 'react-redux'
import { Box, useTheme, Button, Avatar, Card, CardMedia, InputAdornment, Tooltip, Modal, Badge} from "@mui/material";
import Viewer from 'react-viewer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as ExcelJS from "exceljs";
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import { Balance, CalendarToday, DoneAll, Download, LocationOff, MarkEmailRead, NotListedLocation, Photo, PhotoLibrary, ReceiptLong, Search, WaterDrop, WrongLocation } from "@mui/icons-material";
import PhotoViewModal from '../../components/PhotoManagement/PhotoViewModal.jsx'
import buildColumns2 from '../../components/PhotoManagement/buildColumns.jsx'

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

    const [totalFotoFachadaUno, setTotalFotoFachadaUno] = useState(0);
    const [totalFotoFachadaDos, setTotalFotoFachadaDos] = useState(0);
    const [totalFotoEvidenciaUno, setTotalFotoEvidenciaUno] = useState(0);
    const [totalFotoEvidenciaDos, setTotalFotoEvidenciaDos] = useState(0);

    const [totalResultados, setTotalResultados] = useState(0);

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
        //setFilteredResult(response.data);

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

    useEffect(() => {      
      const countValidFotoFachadaUno = (rows) => {
        return rows.filter(row => row.foto_fachada_1 && row.foto_fachada_1 !== 'https://ser0.mx/ser0/image/sin_foto.jpg').length;
      };

      const countValidFotoFachadaDos = (rows) => {
        return rows.filter(row => row.foto_fachada_2 && row.foto_fachada_2 !== 'https://ser0.mx/ser0/image/sin_foto.jpg').length;
      };
      
      const countValidFotoEvidenciaUno = (rows) => {
        return rows.filter(row => row.foto_evidencia_1 && row.foto_evidencia_1 !== 'https://ser0.mx/ser0/image/sin_foto.jpg').length;
      };

      const countValidFotoEvidenciaDos = (rows) => {
        return rows.filter(row => row.foto_evidencia_2 && row.foto_evidencia_2 !== 'https://ser0.mx/ser0/image/sin_foto.jpg').length;
      };
      
      const rows = filteredResult.length > 0 ? filteredResult : result;
      setTotalResultados(rows.length);
      setTotalFotoFachadaUno(countValidFotoFachadaUno(rows));
      setTotalFotoFachadaDos(countValidFotoFachadaDos(rows));
      setTotalFotoEvidenciaUno(countValidFotoEvidenciaUno(rows));
      setTotalFotoEvidenciaDos(countValidFotoEvidenciaDos(rows));
  
    }, [result, filteredResult]);

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

    const columns = buildColumns2({
      handleOpenModal,
      handleImageUrlUpdate,
    });

    const [openModalDownload, setOpenModalDownload] = useState(false);
    const [modalTitleDownload, setModalTitleDownload] = useState('');
    const [modalContentDownload, setModalContentDownload] = useState('');
    const abortControllerRef = useRef(null);

    const handleOpenModalDownload = (title, content, tipoFoto) => {      
      setModalTitleDownload(title);
      setModalContentDownload(content);
      setTipoFotoSeleccionada(tipoFoto);
      setOpenModalDownload(true);
    };

    const handleCloseModalDownload = () => {
      setOpenModalDownload(false);
    };

    const [fotosDescargadas, setFotosDescargadas] = useState(0);
    const [totalFotos, setTotalFotos] = useState(0);
    const [tipoFotoSeleccionada, setTipoFotoSeleccionada] = useState('');
    const [descargaCancelada, setDescargaCancelada] = useState(false);
    const [fotosSinFoto, setFotosSinFoto] = useState(0);

    const getFotosParaDescargar = () => {
      const data = filteredResult.length > 0 ? filteredResult : result;      
      const fotosParaDescargar = [];
    
      data.forEach(row => {
        let fotoUrl = '';
    
        switch (tipoFotoSeleccionada) {
          case 'Fachada 1':
            fotoUrl = row.foto_fachada_1;
            break;
          case 'Fachada 2':
            fotoUrl = row.foto_fachada_2;
            break;
          case 'Evidencia 1':
            fotoUrl = row.foto_evidencia_1;
            break;
          case 'Evidencia 2':
            fotoUrl = row.foto_evidencia_2;
            break;
          default:
            break;
        }    
        
        fotosParaDescargar.push({
          url: fotoUrl,
          cuenta: row.cuenta,
          fecha_gestion: row.fecha_gestion,
          isSinFoto: fotoUrl === 'https://ser0.mx/ser0/image/sin_foto.jpg'
        });
      });
    
      return fotosParaDescargar;
    };
    
    const handleDescargarFotos = async () => {
      setDescargaCancelada(false);
      const fotos = getFotosParaDescargar(tipoFotoSeleccionada);
    
      const totalFotos = fotos.length;        
      setTotalFotos(totalFotos);              
      setFotosDescargadas(0);                
      setFotosSinFoto(0);

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
    
      for (const foto of fotos) {
        
        if (descargaCancelada) {
          console.log('Descarga cancelada');
          alert('La descarga ha sido cancelada.');
          return;
        }
            
        if (foto.isSinFoto) {
          setFotosSinFoto(prev => prev + 1);
          continue;
        }        
    
        try {
          const response = await fetch(foto.url, { signal });          
          
          if (!response.ok) {
            //console.error(`Error descargando la imagen: ${foto.url}`);
            continue;
          }

          const contentType = response.headers.get('Content-Type');

          let extension = '';
          if (contentType.includes('jpeg')) {
            extension = 'jpg';
          } else if (contentType.includes('png')) {
            extension = 'png';
          } else if (contentType.includes('gif')) {
            extension = 'gif';
          } else if (contentType.includes('bmp')) {
            extension = 'bmp';
          } else {
            extension = 'jpg';
          }
    
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          //const nombreArchivo = `${foto.cuenta}_${foto.fecha_gestion}.jpg`;
          const nombreArchivo = `${foto.cuenta}_${foto.fecha_gestion}.${extension}`;
    
          const a = document.createElement('a');
          a.href = url;
          a.download = nombreArchivo;
          a.click();
          window.URL.revokeObjectURL(url);
    
          setFotosDescargadas(prev => prev + 1);
    
        } catch (error) {
          if (descargaCancelada) {
            console.log('Descarga cancelada');
            alert('La descarga ha sido cancelada.');
            return;
          }
          console.error('Error al descargar la foto:', foto.url);
        }    
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };        
    
    useEffect(() => {
      if (descargaCancelada && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, [descargaCancelada]);

    const handleCancelarDescarga = () => {
      setDescargaCancelada(true);
    };

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
            
            <Grid xs={12} md={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
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
              <Grid item xs={12} md={2}>
                <Badge 
                  badgeContent={totalFotoFachadaUno}
                  color={totalFotoFachadaUno === totalResultados ? 'secondary' : 'error'}
                  max={9999}                  
                >
                  <Tooltip title="Descargar foto fachada 1">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<PhotoLibrary />} 
                      endIcon={<Download /> }
                      onClick={() => handleOpenModalDownload('Fachada 1', 'Aquí vas a poder descargar las foto de la fachada 1.', 'Fachada 1')}
                    >
                      Fachada 1
                    </Button>
                  </Tooltip>
                </Badge>
              </Grid>
              <Grid item xs={12} md={2}>
                <Badge 
                  badgeContent={totalFotoFachadaDos} 
                  color={totalFotoFachadaDos === totalResultados ? 'secondary' : 'error'}
                  max={9999}
                >
                  <Tooltip title="Descargar foto fachada 2">
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<PhotoLibrary />} 
                      endIcon={<Download /> }
                      onClick={() => handleOpenModalDownload('Fachada 2', 'Aquí vas a poder descargar las foto de la fachada 2.', 'Fachada 2')}
                    >
                      Fachada 2
                    </Button>
                  </Tooltip>
                </Badge>
              </Grid>
              <Grid item xs={12} md={2}>
                <Badge 
                  badgeContent={totalFotoEvidenciaUno} 
                  color={totalFotoEvidenciaUno === totalResultados ? 'secondary' : 'error'}
                  max={9999}
                >
                  <Tooltip title="Descargar foto evidencia 1">
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<PhotoLibrary />} 
                      endIcon={<Download /> }  
                      onClick={() => handleOpenModalDownload('Evidencia 1', 'Aquí vas a poder descargar las evidencia 1.', 'Evidencia 1')}
                    >
                      Evidencia 1
                    </Button>
                  </Tooltip>
                </Badge>
              </Grid>
              <Grid item xs={12} md={2}>
                <Badge 
                  badgeContent={totalFotoEvidenciaDos} 
                  color={totalFotoEvidenciaDos === totalResultados ? 'secondary' : 'error'}
                  max={9999}
                >
                  <Tooltip title="Descargar foto evidencia 2">
                    <Button
                      variant="contained" 
                      color="primary"
                      startIcon={<PhotoLibrary />} 
                      endIcon={<Download /> }  
                      onClick={() => handleOpenModalDownload('Evidencia 2', 'Aquí vas a poder descargar las evidencia 2.', 'Evidencia 2')}
                    >
                      Evidencia 2
                    </Button>
                  </Tooltip>
                </Badge>
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
                    {/* {result.length === 0 ? ( */}
                    {showNoResultsMessage ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>No row</div>
                    ) : (
                      <DataGrid
                        rows={filteredResult.length > 0 ? filteredResult : result}
                        columns={ columns }
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

            <Modal
              open={openModalDownload}
              onClose={handleCloseModalDownload}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box sx={{ 
                bgcolor: 'background.paper', 
                boxShadow: 24, 
                p: 4, 
                width: 400, 
                margin: 'auto', 
                borderRadius: 2 
              }}>
                <h2 id="modal-title">{modalTitleDownload}</h2>
                <p id="modal-description">{modalContentDownload}</p>

                <p>Total fotos: {totalFotos}</p>
                <p>Fotos descargadas: {fotosDescargadas}/{totalFotos}</p>
                <p>Sin foto: {fotosSinFoto}</p>

                <Button variant="contained" color="primary" onClick={handleDescargarFotos}>
                  Iniciar Descarga
                </Button>

                <Button variant="contained" color="warning" onClick={handleCancelarDescarga} disabled={descargaCancelada}>
                  Cancelar Descarga
                </Button>

                <Button variant="contained" color="secondary" onClick={handleCloseModalDownload}>
                  Cerrar
                </Button>
              </Box>
            </Modal>

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