// src/components/CoordinatorMonitor/GestorDetallesDialog.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  useTheme,
  Collapse,
  Card,
  CardMedia,
  Tooltip,
  Badge,
  Zoom,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import {
  Close,
  Download,
  Person,
  AssignmentOutlined,
  CheckCircle,
  Warning,
  Error,
  Apps,
  PhotoCamera,
  PhotoLibrary,
  Home,
  CameraAlt,
  Verified,
  Check,
  Download as DownloadIcon,
  ExpandMore,
  ExpandLess,
  Visibility,
  ArrowForward,
  ArrowBack,
  Place as GpsIcon,
  Image as ImageIcon,
  House as HouseIcon,
  Description as DescriptionIcon,
  Photo as PhotoIcon,
  Camera as CameraIcon,
  HomeWork as HomeWorkIcon,
  ReceiptLong as ReceiptLongIcon,
  Collections as CollectionsIcon,
} from "@mui/icons-material";
import { tokens } from "../../../theme";

// 🔹 Componente para vista modal ampliada de foto
const FotoAmpliadaDialog = ({ open, foto, onClose, onDownload, onNext, onPrev, totalFotos, index }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!foto) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          overflow: 'hidden',
          maxWidth: '95vw',
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2.5,
        borderBottom: `1px solid ${colors.primary[700]}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            backgroundColor: foto.tipo === 'FACHADA' ? colors.greenAccent[900] : colors.blueAccent[900],
            borderRadius: '8px',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            {foto.tipo === 'FACHADA' ? (
              <HouseIcon sx={{ color: colors.greenAccent[300], fontSize: 20 }} />
            ) : (
              <DescriptionIcon sx={{ color: colors.blueAccent[300], fontSize: 20 }} />
            )}
            <Typography variant="subtitle2" sx={{ color: colors.grey[100], fontWeight: 600 }}>
              {foto.tipo === 'FACHADA' ? 'Fachada' : 'Evidencia'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: colors.grey[100] }}>
            {foto.cuenta}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography variant="caption" sx={{ 
            color: colors.grey[400],
            display: 'flex',
            alignItems: 'center',
            mr: 1
          }}>
            {index + 1} / {totalFotos}
          </Typography>
          <Tooltip title="Anterior">
            <span>
              <IconButton 
                onClick={onPrev} 
                disabled={index === 0}
                sx={{ 
                  color: colors.grey[100],
                  '&:disabled': { color: colors.grey[700] }
                }}
              >
                <ArrowBack />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Siguiente">
            <span>
              <IconButton 
                onClick={onNext} 
                disabled={index === totalFotos - 1}
                sx={{ 
                  color: colors.grey[100],
                  '&:disabled': { color: colors.grey[700] }
                }}
              >
                <ArrowForward />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Descargar">
            <IconButton onClick={() => onDownload(foto)} sx={{ color: colors.grey[100] }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} sx={{ color: colors.grey[100] }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ 
        p: 0, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh',
        position: 'relative'
      }}>
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3
        }}>
          <img
            src={foto.urlImagen || foto.url}
            alt={foto.nombreFoto || foto.descripcion}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              borderRadius: '12px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
              objectFit: 'contain',
              backgroundColor: colors.primary[900]
            }}
          />
          <Box sx={{ 
            position: 'absolute', 
            bottom: 32, 
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.75)',
            borderRadius: '24px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backdropFilter: 'blur(8px)'
          }}>
            {foto.verificada && (
              <Tooltip title="Verificada">
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: colors.greenAccent[800],
                  borderRadius: '12px',
                  p: '4px 8px'
                }}>
                  <Verified sx={{ fontSize: 16, color: colors.greenAccent[300] }} />
                  <Typography variant="caption" sx={{ color: colors.grey[100], fontWeight: 500 }}>
                    Verificada
                  </Typography>
                </Box>
              </Tooltip>
            )}
            <Typography variant="caption" sx={{ color: colors.grey[300] }}>
              {foto.nombreFoto || 'Sin nombre'}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.grey[500] }}>
              {new Date(foto.fechaCaptura || foto.fecha).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// 🔹 Componente ChipContadorFoto - ESTILO ESPECÍFICO DEL COMPONENTE ANTIGUO CON ICONO
const ChipContadorFoto = ({ tipo, cantidad, COLOR_EFICIENTE, COLOR_REGULAR, icono, tooltipTitle }) => {
  const tieneFotos = cantidad > 0;
  
  return (
    <Tooltip title={tooltipTitle || `${cantidad} ${tipo === 'FACHADA' ? 'fachada' : 'evidencia'}${cantidad !== 1 ? 's' : ''}`}>
      <Chip
        label={cantidad}
        size="small"
        icon={icono}
        sx={{
          backgroundColor: tieneFotos
            ? COLOR_EFICIENTE + "20"
            : COLOR_REGULAR + "20",
          color: tieneFotos ? COLOR_EFICIENTE : COLOR_REGULAR,
          fontSize: "0.7rem",
          minWidth: 40,
          height: 22,
          '& .MuiChip-icon': {
            fontSize: '0.8rem',
            marginLeft: '4px',
            marginRight: '2px',
          },
          '& .MuiChip-label': {
            px: 0.5,
          }
        }}
      />
    </Tooltip>
  );
};

// 🔹 Componente para mini galería inline - CON EL NUEVO ESTILO
const MiniGaleria = ({ fotos, cuenta, onImageClick, startingIndex = 0, COLOR_EFICIENTE, COLOR_REGULAR }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // 🔹 Separar fotos por tipo
  const fotosFachada = fotos.filter(f => f.tipo === 'FACHADA');
  const fotosEvidencia = fotos.filter(f => f.tipo === 'EVIDENCIA');
  const todasLasFotos = [...fotosFachada, ...fotosEvidencia];
  
  // 🔹 Mostrar máximo 4 fotos en vista previa
  const fotosParaMostrar = todasLasFotos.slice(0, 4);
  const fotosRestantes = todasLasFotos.length - 4;

  if (todasLasFotos.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: 80,
        backgroundColor: colors.primary[900],
        borderRadius: '8px',
        border: `1px dashed ${colors.primary[700]}`,
        color: colors.grey[600]
      }}>
        <ImageIcon sx={{ mr: 1, color: colors.grey[500] }} />
        <Typography variant="caption">Sin fotos</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* 🔹 Contadores de fotos - CON EL ESTILO ESPECÍFICO */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 2,
        justifyContent: 'center'
      }}>
        <ChipContadorFoto
          tipo="FACHADA"
          cantidad={fotosFachada.length}
          COLOR_EFICIENTE={COLOR_EFICIENTE}
          COLOR_REGULAR={COLOR_REGULAR}
          icono={<HouseIcon sx={{ fontSize: 12 }} />}
        />
        
        <ChipContadorFoto
          tipo="EVIDENCIA"
          cantidad={fotosEvidencia.length}
          COLOR_EFICIENTE={COLOR_EFICIENTE}
          COLOR_REGULAR={COLOR_REGULAR}
          icono={<DescriptionIcon sx={{ fontSize: 12 }} />}
        />
      </Box>

      {/* 🔹 Galería de miniaturas - SIMPLIFICADA */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        backgroundColor: colors.primary[900],
        borderRadius: '8px',
        border: `1px solid ${colors.primary[700]}`,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          height: 4,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: colors.primary[600],
          borderRadius: 2,
        }
      }}>
        {fotosParaMostrar.map((foto, index) => {
          const imagenUrl = foto.urlImagen || foto.url;
          const esFachada = foto.tipo === 'FACHADA';
          
          return (
            <Tooltip 
              key={foto.id} 
              title={`${esFachada ? 'Fachada' : 'Evidencia'} - ${foto.nombreFoto || 'Sin nombre'}`}
            >
              <Card
                sx={{
                  position: 'relative',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  flexShrink: 0,
                  width: 80,
                  height: 80,
                  border: `2px solid ${esFachada ? colors.greenAccent[700] : colors.blueAccent[700]}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }
                }}
                onClick={() => onImageClick(startingIndex + index)}
              >
                <CardMedia
                  component="img"
                  height="80"
                  image={imagenUrl}
                  alt={foto.nombreFoto || `Foto ${index + 1}`}
                  sx={{
                    objectFit: 'cover',
                    width: '100%',
                    backgroundColor: colors.primary[900]
                  }}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/80/${esFachada ? '1b5e20' : '0d47a1'}/ffffff?text=${esFachada ? 'F' : 'E'}`;
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                }}>
                  {foto.verificada && (
                    <Tooltip title="Verificada">
                      <Verified sx={{ 
                        fontSize: 14, 
                        color: colors.greenAccent[500],
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                      }} />
                    </Tooltip>
                  )}
                </Box>
                {/* Indicador de tipo en miniatura - SOLO ICONO */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 4,
                  left: 4,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: '4px',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)'
                }}>
                  {esFachada ? (
                    <HouseIcon sx={{ fontSize: 12, color: colors.greenAccent[300] }} />
                  ) : (
                    <DescriptionIcon sx={{ fontSize: 12, color: colors.blueAccent[300] }} />
                  )}
                </Box>
              </Card>
            </Tooltip>
          );
        })}
        
        {fotosRestantes > 0 && (
          <Tooltip title={`${fotosRestantes} fotos más`}>
            <Box sx={{
              width: 80,
              height: 80,
              backgroundColor: colors.primary[800],
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px dashed ${colors.primary[600]}`,
              cursor: 'pointer',
              flexDirection: 'column',
              gap: 0.5,
              '&:hover': {
                backgroundColor: colors.primary[700],
              }
            }}
            onClick={() => onImageClick(startingIndex + 4)}
            >
              <PhotoIcon sx={{ fontSize: 24, color: colors.grey[400] }} />
              <Typography variant="h6" sx={{ 
                color: colors.grey[400],
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                +{fotosRestantes}
              </Typography>
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

// 🔹 Componente CardResumenDialog
const CardResumenDialog = ({
  titulo,
  valor,
  color,
  icono,
  colors,
  COLOR_TEXTO,
  COLOR_FONDO,
  COLOR_BORDE,
}) => (
  <Box
    className="p-4 rounded-xl shadow-sm"
    sx={{
      backgroundColor: COLOR_FONDO,
      display: "flex",
      alignItems: "center",
      gap: 2,
      border: `1px solid ${COLOR_BORDE}`,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      },
    }}
  >
    <Box sx={{ color: icono.props?.sx?.color || color, fontSize: 28 }}>
      {icono}
    </Box>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
        {valor}
      </Typography>
      <Typography variant="body2" sx={{ color: colors.grey[400] }}>
        {titulo}
      </Typography>
    </Box>
  </Box>
);

const GestorDetallesDialog = ({
  open,
  onClose,
  usuario,
  colors: colorsProp,
  COLOR_TEXTO: COLOR_TEXTO_PROPS,
  COLOR_FONDO: COLOR_FONDO_PROPS,
  COLOR_BORDE: COLOR_BORDE_PROPS,
  COLOR_EFICIENTE: COLOR_EFICIENTE_PROPS,
  COLOR_REGULAR: COLOR_REGULAR_PROPS,
  COLOR_ATENCION: COLOR_ATENCION_PROPS,
}) => {
  const theme = useTheme();
  const colors = colorsProp || tokens(theme.palette.mode);
  
  // Usar props o valores por defecto
  const COLOR_TEXTO = COLOR_TEXTO_PROPS || colors.grey[100];
  const COLOR_FONDO = COLOR_FONDO_PROPS || colors.bgContainer;
  const COLOR_BORDE = COLOR_BORDE_PROPS || colors.primary[500];
  const COLOR_EFICIENTE = COLOR_EFICIENTE_PROPS || colors.accentGreen[100];
  const COLOR_REGULAR = COLOR_REGULAR_PROPS || colors.yellowAccent[400];
  const COLOR_ATENCION = COLOR_ATENCION_PROPS || colors.redAccent[400];
  const COLOR_TODOS_ACTIVE = colors.blueAccent[600];
  const COLOR_TODOS_INACTIVE = colors.primary[400];

  // 🔹 Estados principales
  const [filtroMotivo, setFiltroMotivo] = useState("TODOS");
  const [paginaGestiones, setPaginaGestiones] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [gestionExpandida, setGestionExpandida] = useState(null);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [fotoAmpliadaIndex, setFotoAmpliadaIndex] = useState(0);
  
  // 🔹 Ref para seguimiento
  const usuarioAnteriorRef = useRef(null);

  // 🔹 FUNCIONES AUXILIARES
  const normalizarMotivo = (motivo) => {
    if (!motivo || motivo === "COMPLETA" || motivo === "null") {
      return "COMPLETA";
    }
    return motivo;
  };

  const formatMotivoGestion = (motivo) => {
    if (motivo === "TODOS") return "Todos";
    
    const motivoNormalizado = normalizarMotivo(motivo);
    
    if (motivoNormalizado === "COMPLETA") return "Completa";

    const formatos = {
      SIN_GPS_Y_SIN_FOTOS: "Sin GPS y sin fotos",
      SIN_GPS_Y_FALTA_FOTO_FACHADA: "Sin GPS y falta foto fachada",
      SIN_GPS_Y_FALTA_FOTO_EVIDENCIA: "Sin GPS y falta foto evidencia",
      SIN_GPS: "Sin GPS",
      FALTAN_AMBAS_FOTOS: "Faltan ambas fotos",
      FALTA_FOTO_FACHADA: "Falta foto fachada",
      FALTA_FOTO_EVIDENCIA: "Falta foto evidencia",
    };

    return formatos[motivoNormalizado] || motivoNormalizado.replace(/_/g, " ").toLowerCase();
  };

  const getColorMotivo = (motivo) => {
    if (motivo === "TODOS") {
      return filtroMotivo === "TODOS" ? COLOR_TODOS_ACTIVE : COLOR_TODOS_INACTIVE;
    }
    
    const motivoNormalizado = normalizarMotivo(motivo);
    
    if (motivoNormalizado === "COMPLETA") return COLOR_EFICIENTE;
    if (motivoNormalizado.includes("GPS")) return COLOR_ATENCION;
    if (motivoNormalizado.includes("FOTO")) return COLOR_REGULAR;
    return COLOR_REGULAR;
  };

  const getIconoMotivo = (motivo) => {
    if (motivo === "TODOS") {
      const color = filtroMotivo === "TODOS" ? COLOR_TODOS_ACTIVE : COLOR_TODOS_INACTIVE;
      return <Apps sx={{ color }} />;
    }
    
    const motivoNormalizado = normalizarMotivo(motivo);
    
    if (motivoNormalizado === "COMPLETA")
      return <CheckCircle sx={{ color: COLOR_EFICIENTE }} />;

    if (motivoNormalizado.includes("GPS")) 
      return <Error sx={{ color: COLOR_ATENCION }} />;
    if (motivoNormalizado.includes("FOTO"))
      return <Warning sx={{ color: COLOR_REGULAR }} />;

    return <Warning sx={{ color: COLOR_REGULAR }} />;
  };

  const getColorEstado = (estado) => {
    if (estado === "COMPLETA") return COLOR_EFICIENTE;
    if (estado === "INCOMPLETA") return COLOR_REGULAR;
    return COLOR_ATENCION;
  };

  // 🔹 Calcular gestiones filtradas
  const gestionesFiltradas = useMemo(() => {
    if (!usuario?.registros) return [];
    
    const registros = usuario.registros || [];
    
    if (filtroMotivo && filtroMotivo !== "TODOS") {
      const motivoFiltroNormalizado = normalizarMotivo(filtroMotivo);
      
      return registros.filter(registro => 
        normalizarMotivo(registro.motivo_gestion) === motivoFiltroNormalizado
      );
    }
    
    return registros;
  }, [usuario, filtroMotivo]);

  // 🔹 Calcular páginas
  const paginatedGestiones = useMemo(() => {
    const startIndex = paginaGestiones * pageSize;
    return gestionesFiltradas.slice(startIndex, startIndex + pageSize);
  }, [gestionesFiltradas, paginaGestiones, pageSize]);

  // 🔹 Extraer todas las fotos de todas las gestiones filtradas (REACTIVO AL FILTRO)
  const fotosFiltradas = useMemo(() => {
    const fotos = [];
    
    gestionesFiltradas.forEach((gestion) => {
      if (Array.isArray(gestion.fotos)) {
        gestion.fotos.forEach((foto) => {
          if (foto && typeof foto === 'object' && foto.urlImagen) {
            const tipoFoto = (foto.tipo || '').toUpperCase();
            const esFachada = tipoFoto.includes('FACHADA') || tipoFoto.includes('PREDIO');
            
            fotos.push({
              id: `${gestion.cuenta}-${foto.idRegistroFoto || Date.now()}`,
              urlImagen: foto.urlImagen,
              url: foto.urlImagen,
              tipo: esFachada ? 'FACHADA' : 'EVIDENCIA',
              cuenta: gestion.cuenta,
              fecha: gestion.fecha,
              fechaCaptura: foto.fechaCaptura,
              nombreFoto: foto.nombreFoto,
              descripcion: foto.tipo || (esFachada ? 'Fachada' : 'Evidencia'),
              verificada: foto.verificada || false,
              gestionId: gestion.id || gestion.cuenta,
              metadata: foto
            });
          }
        });
      }
    });
    
    return fotos;
  }, [gestionesFiltradas]); // Solo depende de gestionesFiltradas

  // 🔹 Extraer todas las fotos de todas las gestiones (para el total)
  const todasLasFotos = useMemo(() => {
    const fotos = [];
    
    (usuario?.registros || []).forEach((gestion) => {
      if (Array.isArray(gestion.fotos)) {
        gestion.fotos.forEach((foto) => {
          if (foto && typeof foto === 'object' && foto.urlImagen) {
            const tipoFoto = (foto.tipo || '').toUpperCase();
            const esFachada = tipoFoto.includes('FACHADA') || tipoFoto.includes('PREDIO');
            
            fotos.push({
              id: `${gestion.cuenta}-${foto.idRegistroFoto || Date.now()}`,
              urlImagen: foto.urlImagen,
              url: foto.urlImagen,
              tipo: esFachada ? 'FACHADA' : 'EVIDENCIA',
              cuenta: gestion.cuenta,
              fecha: gestion.fecha,
              fechaCaptura: foto.fechaCaptura,
              nombreFoto: foto.nombreFoto,
              descripcion: foto.tipo || (esFachada ? 'Fachada' : 'Evidencia'),
              verificada: foto.verificada || false,
              gestionId: gestion.id || gestion.cuenta,
              metadata: foto
            });
          }
        });
      }
    });
    
    return fotos;
  }, [usuario]);

  // 🔹 Obtener todas las fotos de una gestión específica
  const getFotosDeGestion = (gestion) => {
    if (!gestion || !Array.isArray(gestion.fotos)) return [];
    
    return gestion.fotos.map((foto, index) => {
      const tipoFoto = (foto.tipo || '').toUpperCase();
      const esFachada = tipoFoto.includes('FACHADA') || tipoFoto.includes('PREDIO');
      
      return {
        id: `${gestion.cuenta}-${foto.idRegistroFoto || index}`,
        urlImagen: foto.urlImagen,
        url: foto.urlImagen,
        tipo: esFachada ? 'FACHADA' : 'EVIDENCIA',
        cuenta: gestion.cuenta,
        fecha: gestion.fecha,
        fechaCaptura: foto.fechaCaptura,
        nombreFoto: foto.nombreFoto,
        descripcion: foto.tipo || (esFachada ? 'Fachada' : 'Evidencia'),
        verificada: foto.verificada || false,
        metadata: foto
      };
    }).filter(foto => foto.urlImagen);
  };

  // 🔹 Función para encontrar el índice global de una foto
  const findFotoGlobalIndex = (fotoLocal, gestion) => {
    if (!fotoLocal || !gestion) return 0;
    
    const gestionIndex = gestionesFiltradas.findIndex(g => g.cuenta === gestion.cuenta);
    let fotoIndex = 0;
    
    // Sumar fotos de todas las gestiones anteriores
    for (let i = 0; i < gestionIndex; i++) {
      fotoIndex += getFotosDeGestion(gestionesFiltradas[i]).length;
    }
    
    // Encontrar el índice de la foto en la gestión actual
    const fotosDeGestion = getFotosDeGestion(gestion);
    const localIndex = fotosDeGestion.findIndex(f => f.id === fotoLocal.id);
    
    return fotoIndex + localIndex;
  };

  // 🔹 Calcular motivos
  const motivosArray = useMemo(() => {
    if (!usuario?.motivos && !usuario?.registros) return [];
    
    const motivosContados = {};
    
    (usuario.registros || []).forEach(registro => {
      const motivo = normalizarMotivo(registro.motivo_gestion);
      motivosContados[motivo] = (motivosContados[motivo] || 0) + 1;
    });
    
    return Object.entries(motivosContados).sort((a, b) => b[1] - a[1]);
  }, [usuario]);

  // 🔹 Obtener todos los motivos incluyendo "TODOS"
  const todosMotivosArray = useMemo(() => {
    const totalRegistros = usuario?.registros?.length || 0;
    const motivos = [["TODOS", totalRegistros]];
    return [...motivos, ...motivosArray];
  }, [usuario, motivosArray]);

  // 🔹 Manejar clic en foto
  const handleFotoClick = (foto, gestion) => {
    const globalIndex = findFotoGlobalIndex(foto, gestion);
    setFotoAmpliadaIndex(globalIndex);
    setFotoAmpliada(foto);
  };

  // 🔹 Navegar entre fotos ampliadas
  const handleNextFoto = () => {
    if (fotoAmpliadaIndex < fotosFiltradas.length - 1) {
      setFotoAmpliadaIndex(fotoAmpliadaIndex + 1);
      setFotoAmpliada(fotosFiltradas[fotoAmpliadaIndex + 1]);
    }
  };

  const handlePrevFoto = () => {
    if (fotoAmpliadaIndex > 0) {
      setFotoAmpliadaIndex(fotoAmpliadaIndex - 1);
      setFotoAmpliada(fotosFiltradas[fotoAmpliadaIndex - 1]);
    }
  };

  // 🔹 Función para manejar clic en chip
  const manejarClicChip = (motivo) => {
    setFiltroMotivo(motivo);
    setPaginaGestiones(0);
    setGestionExpandida(null);
  };

  // 🔹 Función para descargar foto individual
  const descargarFoto = (foto) => {
    const url = foto.urlImagen || foto.url;
    if (!url) return;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${foto.tipo}_${foto.cuenta}_${foto.nombreFoto || new Date(foto.fecha).toISOString().split('T')[0]}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔹 Reset al cambiar usuario
  useEffect(() => {
    if (open && usuario && usuario.id !== usuarioAnteriorRef.current) {
      setPaginaGestiones(0);
      setPageSize(10);
      setFiltroMotivo("TODOS");
      setGestionExpandida(null);
      setFotoAmpliada(null);
      usuarioAnteriorRef.current = usuario.id;
    }
  }, [open, usuario]);

  if (!usuario) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: COLOR_FONDO,
            color: COLOR_TEXTO,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            borderBottom: `1px solid ${COLOR_BORDE}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Person sx={{ color: COLOR_TEXTO, fontSize: 28 }} />
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: COLOR_TEXTO }}
              >
                {usuario.nombre}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                ID: {usuario.id} • {usuario.diasTrabajados || 0} días trabajados
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: colors.grey[400] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ 
          backgroundColor: COLOR_FONDO, 
          p: 3,
          overflow: 'auto'
        }}>
          {/* 🔹 4 CARDS DE RESUMEN */}
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <CardResumenDialog
              titulo="Total gestiones"
              valor={usuario.total || 0}
              color={COLOR_TEXTO}
              icono={<AssignmentOutlined sx={{ color: colors.grey[400] }} />}
              colors={colors}
              COLOR_TEXTO={COLOR_TEXTO}
              COLOR_FONDO={COLOR_FONDO}
              COLOR_BORDE={colors.borderContainer}
            />
            <CardResumenDialog
              titulo="Completas"
              valor={usuario.completas || 0}
              color={COLOR_EFICIENTE}
              icono={<CheckCircle sx={{ color: COLOR_EFICIENTE }} />}
              colors={colors}
              COLOR_TEXTO={COLOR_TEXTO}
              COLOR_FONDO={COLOR_FONDO}
              COLOR_BORDE={colors.borderContainer}
            />
            <CardResumenDialog
              titulo="Con problemas"
              valor={usuario.incompletas || 0}
              color={COLOR_REGULAR}
              icono={<Warning sx={{ color: COLOR_REGULAR }} />}
              colors={colors}
              COLOR_TEXTO={COLOR_TEXTO}
              COLOR_FONDO={COLOR_FONDO}
              COLOR_BORDE={colors.borderContainer}
            />
            <CardResumenDialog
              titulo="Inválidas"
              valor={usuario.invalidas || 0}
              color={COLOR_ATENCION}
              icono={<Error sx={{ color: COLOR_ATENCION }} />}
              colors={colors}
              COLOR_TEXTO={COLOR_TEXTO}
              COLOR_FONDO={COLOR_FONDO}
              COLOR_BORDE={colors.borderContainer}
            />
          </Box>

          {/* Distribución por tipo de gestión */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ 
                fontWeight: 600, 
                color: COLOR_TEXTO,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              📊 Distribución por tipo de gestión
              <Typography 
                component="span" 
                variant="caption" 
                sx={{ 
                  color: colors.grey[500],
                  fontWeight: 400,
                  ml: 1
                }}
              >
                (Haz clic para filtrar)
              </Typography>
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {todosMotivosArray.map(([motivo, cantidad]) => {
                const color = getColorMotivo(motivo);
                const estaActivo = filtroMotivo === motivo;

                return (
                  <Chip
                    key={motivo}
                    icon={getIconoMotivo(motivo)}
                    label={`${formatMotivoGestion(motivo)} (${cantidad})`}
                    onClick={() => manejarClicChip(motivo)}
                    sx={{
                      backgroundColor: estaActivo ? color + "30" : color + "10",
                      color: estaActivo ? color : COLOR_TEXTO,
                      border: `1px solid ${estaActivo ? color : "transparent"}`,
                      "&:hover": {
                        backgroundColor: color + "20",
                        transform: "translateY(-1px)",
                      },
                      fontSize: "0.75rem",
                      height: 28,
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* 🔹 TABLA DE GESTIONES CON EXPANSIÓN */}
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: COLOR_TEXTO }}
              >
                📝 Gestiones registradas
                <Typography 
                  component="span" 
                  variant="caption" 
                  sx={{ 
                    color: colors.grey[500],
                    fontWeight: 400,
                    ml: 1
                  }}
                >
                  (Haz clic en ▶ para ver fotos)
                </Typography>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: colors.grey[400], fontSize: "0.875rem" }}
              >
                {filtroMotivo === "TODOS" ? (
                  <>Mostrando {gestionesFiltradas.length} registros</>
                ) : (
                  <>
                    Filtrado: <strong>{formatMotivoGestion(filtroMotivo)}</strong> • 
                    {gestionesFiltradas.length} de {usuario.total || 0} registros
                  </>
                )}
              </Typography>
            </Box>

            {paginatedGestiones.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                backgroundColor: colors.primary[900],
                borderRadius: '8px',
                border: `1px solid ${COLOR_BORDE}`
              }}>
                <AssignmentOutlined sx={{ fontSize: 48, color: colors.grey[600], mb: 2 }} />
                <Typography variant="h6" sx={{ color: COLOR_TEXTO, mb: 1 }}>
                  No hay gestiones para mostrar
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                  {filtroMotivo !== "TODOS" 
                    ? `No hay gestiones con el filtro "${formatMotivoGestion(filtroMotivo)}"`
                    : "Este usuario no tiene gestiones registradas"}
                </Typography>
              </Box>
            ) : (
              <TableContainer 
                component={Paper} 
                sx={{ 
                  backgroundColor: COLOR_FONDO,
                  border: `1px solid ${COLOR_BORDE}`,
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 50, color: COLOR_TEXTO, fontWeight: 600, borderBottom: `1px solid ${COLOR_BORDE}` }}></TableCell>
                      <TableCell sx={{ color: COLOR_TEXTO, fontWeight: 600, borderBottom: `1px solid ${COLOR_BORDE}` }}>Cuenta</TableCell>
                      <TableCell sx={{ color: COLOR_TEXTO, fontWeight: 600, borderBottom: `1px solid ${COLOR_BORDE}` }}>Fecha</TableCell>
                      <TableCell sx={{ color: COLOR_TEXTO, fontWeight: 600, borderBottom: `1px solid ${COLOR_BORDE}` }}>Estado</TableCell>
                      <TableCell sx={{ color: COLOR_TEXTO, fontWeight: 600, borderBottom: `1px solid ${COLOR_BORDE}` }}>Motivo</TableCell>
                      <TableCell sx={{ color: COLOR_TEXTO, fontWeight: 600, borderBottom: `1px solid ${COLOR_BORDE}` }} align="center">GPS</TableCell>
                      <TableCell sx={{ color: COLOR_TEXTO, fontWeight: 600, borderBottom: `1px solid ${COLOR_BORDE}` }} align="center">Fotos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedGestiones.map((gestion) => {
                      const fotos = getFotosDeGestion(gestion);
                      const tieneFotos = fotos.length > 0;
                      const isExpanded = gestionExpandida === gestion.cuenta;
                      const fotosFachada = fotos.filter(f => f.tipo === 'FACHADA').length;
                      const fotosEvidencia = fotos.filter(f => f.tipo === 'EVIDENCIA').length;
                      
                      return (
                        <React.Fragment key={gestion.cuenta || gestion.id}>
                          <TableRow 
                            sx={{ 
                              '&:hover': { backgroundColor: colors.primary[400] },
                              borderBottom: isExpanded ? 'none' : `1px solid ${colors.primary[700]}`
                            }}
                          >
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setGestionExpandida(isExpanded ? null : gestion.cuenta);
                                }}
                                sx={{
                                  color: tieneFotos ? colors.grey[300] : colors.grey[600],
                                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                                  transition: 'transform 0.2s ease',
                                  '&:hover': {
                                    color: tieneFotos ? COLOR_TEXTO : colors.grey[600],
                                  }
                                }}
                                disabled={!tieneFotos}
                              >
                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: COLOR_TEXTO }}>
                                {gestion.cuenta}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                                {new Date(gestion.fecha).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={gestion.estatus_gestion}
                                size="small"
                                sx={{
                                  backgroundColor: getColorEstado(gestion.estatus_gestion) + "20",
                                  color: getColorEstado(gestion.estatus_gestion),
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  minWidth: 90
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: getColorMotivo(gestion.motivo_gestion),
                                  fontStyle: gestion.motivo_gestion === "COMPLETA" || !gestion.motivo_gestion ? "normal" : "italic",
                                }}
                              >
                                {formatMotivoGestion(gestion.motivo_gestion)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {gestion.tieneGPS ? (
                                <CheckCircle sx={{ color: COLOR_EFICIENTE, fontSize: 20 }} />
                              ) : (
                                <Error sx={{ color: COLOR_ATENCION, fontSize: 20 }} />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {/* 🔹 ESTILO EXACTO DEL COMPONENTE ANTERIOR CON ICONOS - VERSIÓN SIMPLIFICADA */}
                              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                <Chip
                                  label={fotosFachada}
                                  size="small"
                                  icon={<HouseIcon sx={{ fontSize: 12 }} />}
                                  sx={{
                                    backgroundColor:
                                      fotosFachada > 0
                                        ? COLOR_EFICIENTE + "20"
                                        : COLOR_REGULAR + "20",
                                    color:
                                      fotosFachada > 0 ? COLOR_EFICIENTE : COLOR_REGULAR,
                                    fontSize: "0.7rem",
                                    minWidth: 40,
                                    height: 22,
                                    '& .MuiChip-icon': {
                                      fontSize: '0.8rem',
                                      marginLeft: '4px',
                                      marginRight: '2px',
                                    },
                                    '& .MuiChip-label': {
                                      px: 0.5,
                                    }
                                  }}
                                />
                                <Chip
                                  label={fotosEvidencia}
                                  size="small"
                                  icon={<DescriptionIcon sx={{ fontSize: 12 }} />}
                                  sx={{
                                    backgroundColor:
                                      fotosEvidencia > 0
                                        ? COLOR_EFICIENTE + "20"
                                        : COLOR_REGULAR + "20",
                                    color:
                                      fotosEvidencia > 0
                                        ? COLOR_EFICIENTE
                                        : COLOR_REGULAR,
                                    fontSize: "0.7rem",
                                    minWidth: 40,
                                    height: 22,
                                    '& .MuiChip-icon': {
                                      fontSize: '0.8rem',
                                      marginLeft: '4px',
                                      marginRight: '2px',
                                    },
                                    '& .MuiChip-label': {
                                      px: 0.5,
                                    }
                                  }}
                                />
                              </Box>
                            </TableCell>
                          </TableRow>
                          
                          {/* Fila expandida con galería */}
                          {isExpanded && (
                            <TableRow>
                              <TableCell colSpan={7} sx={{ 
                                p: 0,
                                borderBottom: `1px solid ${colors.primary[700]}`,
                                backgroundColor: colors.primary[900]
                              }}>
                                <Collapse in={isExpanded} timeout="auto">
                                  <Box sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PhotoLibrary sx={{ color: COLOR_TEXTO }} />
                                        <Typography variant="subtitle2" sx={{ color: COLOR_TEXTO, fontWeight: 600 }}>
                                          Galería de fotos
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                                          {fotos.length} foto{fotos.length !== 1 ? 's' : ''}
                                        </Typography>
                                        {fotos.length > 0 && (
                                          <Button
                                            size="small"
                                            startIcon={<Visibility />}
                                            onClick={() => {
                                              if (fotos.length > 0) {
                                                setFotoAmpliadaIndex(0);
                                                setFotoAmpliada(fotos[0]);
                                              }
                                            }}
                                            sx={{
                                              color: colors.blueAccent[400],
                                              fontSize: '0.75rem'
                                            }}
                                          >
                                            Ver todas
                                          </Button>
                                        )}
                                      </Box>
                                    </Box>
                                    
                                    {/* 🔹 MINIGALERÍA CON EL MISMO ESTILO */}
                                    <MiniGaleria 
                                      fotos={fotos}
                                      cuenta={gestion.cuenta}
                                      onImageClick={(index) => {
                                        const foto = fotos[index];
                                        if (foto) {
                                          const globalIndex = findFotoGlobalIndex(foto, gestion);
                                          setFotoAmpliadaIndex(globalIndex);
                                          setFotoAmpliada(foto);
                                        }
                                      }}
                                      COLOR_EFICIENTE={COLOR_EFICIENTE}
                                      COLOR_REGULAR={COLOR_REGULAR}
                                    />
                                    
                                    {gestion.coordenadas && (
                                      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <GpsIcon sx={{ color: colors.grey[500], fontSize: 16 }} />
                                        <Typography variant="caption" sx={{ color: colors.grey[500] }}>
                                          GPS: {gestion.coordenadas.latitud?.toFixed(6)}, {gestion.coordenadas.longitud?.toFixed(6)}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {/* Paginación */}
                <TablePagination
                  component="div"
                  count={gestionesFiltradas.length}
                  page={paginaGestiones}
                  onPageChange={(event, newPage) => setPaginaGestiones(newPage)}
                  rowsPerPage={pageSize}
                  onRowsPerPageChange={(event) => {
                    setPageSize(parseInt(event.target.value, 10));
                    setPaginaGestiones(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{
                    color: COLOR_TEXTO,
                    borderTop: `1px solid ${COLOR_BORDE}`,
                    '& .MuiTablePagination-selectIcon': {
                      color: COLOR_TEXTO,
                    }
                  }}
                />
              </TableContainer>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: COLOR_FONDO,
            p: 2,
            borderTop: `1px solid ${COLOR_BORDE}`,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={onClose}
            sx={{ color: colors.grey[400] }}
          >
            Cerrar
          </Button>
          
          {/* 🔹 CONTADORES DE FOTOS CON EL MISMO ESTILO DE CHIPS */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            justifyContent: 'center'
          }}>
            <ChipContadorFoto
              tipo="FACHADA"
              cantidad={fotosFiltradas.filter(f => f.tipo === 'FACHADA').length}
              COLOR_EFICIENTE={COLOR_EFICIENTE}
              COLOR_REGULAR={COLOR_REGULAR}
              icono={<HouseIcon sx={{ fontSize: 12 }} />}
              tooltipTitle={`${fotosFiltradas.filter(f => f.tipo === 'FACHADA').length} fachada${fotosFiltradas.filter(f => f.tipo === 'FACHADA').length !== 1 ? 's' : ''} en gestiones filtradas`}
            />
            
            <ChipContadorFoto
              tipo="EVIDENCIA"
              cantidad={fotosFiltradas.filter(f => f.tipo === 'EVIDENCIA').length}
              COLOR_EFICIENTE={COLOR_EFICIENTE}
              COLOR_REGULAR={COLOR_REGULAR}
              icono={<DescriptionIcon sx={{ fontSize: 12 }} />}
              tooltipTitle={`${fotosFiltradas.filter(f => f.tipo === 'EVIDENCIA').length} evidencia${fotosFiltradas.filter(f => f.tipo === 'EVIDENCIA').length !== 1 ? 's' : ''} en gestiones filtradas`}
            />
            
            {/* Chip para el total */}
            <Tooltip title={`Total de fotos en gestiones filtradas`}>
              <Chip
                label={`📸 ${fotosFiltradas.length}`}
                size="small"
                sx={{
                  backgroundColor: colors.primary[800],
                  color: colors.grey[300],
                  fontSize: "0.7rem",
                  minWidth: 50,
                  height: 22,
                  '& .MuiChip-label': {
                    px: 0.5,
                  }
                }}
              />
            </Tooltip>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              if (!usuario) return;

              const reporte = {
                usuario: usuario.nombre,
                id: usuario.id,
                estadisticas: {
                  total: usuario.total,
                  completas: usuario.completas,
                  incompletas: usuario.incompletas,
                  invalidas: usuario.invalidas,
                  porcentajeExito: usuario.porcentajeExito?.toFixed(1) + "%",
                  fotosTotales: todasLasFotos.length,
                  fotosFachada: todasLasFotos.filter(f => f.tipo === 'FACHADA').length,
                  fotosEvidencia: todasLasFotos.filter(f => f.tipo === 'EVIDENCIA').length,
                },
                motivos: usuario.motivos,
              };

              const dataStr = JSON.stringify(reporte, null, 2);
              const dataUri =
                "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
              const exportFileDefaultName = `reporte_${usuario.nombre.replace(/\s+/g, "_")}_${usuario.id}.json`;

              const linkElement = document.createElement("a");
              linkElement.setAttribute("href", dataUri);
              linkElement.setAttribute("download", exportFileDefaultName);
              linkElement.click();
            }}
            sx={{
              backgroundColor: COLOR_EFICIENTE,
              color: colors.grey[900],
              fontWeight: 600,
              "&:hover": { backgroundColor: COLOR_EFICIENTE + "CC" },
            }}
          >
            Descargar reporte
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 DIALOG PARA FOTO AMPLIADA */}
      <FotoAmpliadaDialog
        open={Boolean(fotoAmpliada)}
        foto={fotoAmpliada}
        onClose={() => setFotoAmpliada(null)}
        onDownload={descargarFoto}
        onNext={handleNextFoto}
        onPrev={handlePrevFoto}
        totalFotos={fotosFiltradas.length}
        index={fotoAmpliadaIndex}
      />
    </>
  );
};

export default GestorDetallesDialog;