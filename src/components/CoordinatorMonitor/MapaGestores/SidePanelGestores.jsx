// src/components/CoordinatorMonitor/MapaGestores/SidePanelGestores.jsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  Person,
  CheckCircle,
  Warning,
  Error,
} from "@mui/icons-material";

const SidePanelGestores = ({
  data,
  selectedGestor,
  onSelectGestor,
  colors,
  COLOR_TEXTO,
  COLOR_FONDO,
  COLOR_BORDE
}) => {
  // ============================================
  // Procesar datos de gestores
  // ============================================
  const gestores = useMemo(() => {
    if (!data.length) return [];

    const gestoresMap = new Map();

    data.forEach((registro) => {
      const userId = registro.id_usuario;
      const nombre = registro.nombre_usuario;
      
      // Solo considerar registros con coordenadas válidas (para el mapa)
      if (!registro.latitud || !registro.longitud) return;
      
      if (!gestoresMap.has(userId)) {
        gestoresMap.set(userId, {
          id: userId,
          nombre: nombre,
          totalGestiones: 0,
          localizados: 0,
          noLocalizados: 0,
          ultimaGestion: registro.fecha,
          latitud: registro.latitud,
          longitud: registro.longitud,
          foto_usuario: null, // Campo preparado
        });
      }

      const gestor = gestoresMap.get(userId);
      gestor.totalGestiones++;
      
      // ✅ CLASIFICACIÓN EXACTA: "Predio localizado" con P mayúscula
      if (registro.estatus_predio === "Predio localizado") {
        gestor.localizados++;
      } else {
        gestor.noLocalizados++;
      }
      
      // Actualizar si este registro es más reciente (para la ubicación)
      if (new Date(registro.fecha) > new Date(gestor.ultimaGestion)) {
        gestor.ultimaGestion = registro.fecha;
        gestor.latitud = registro.latitud;
        gestor.longitud = registro.longitud;
      }
    });

    // ✅ ORDENAR POR TOTAL DE GESTIONES (descendente)
    return Array.from(gestoresMap.values())
      .sort((a, b) => b.totalGestiones - a.totalGestiones);
  }, [data]);

  // ============================================
  // Determinar color y estado según efectividad
  // ============================================
  const getEfectividadInfo = (gestor) => {
    if (gestor.totalGestiones === 0) {
      return {
        color: colors.grey[500],
        icono: null,
        label: "Sin datos",
        porcentaje: 0,
      };
    }
    
    const porcentaje = (gestor.localizados / gestor.totalGestiones) * 100;
    
    if (porcentaje >= 80) {
      return {
        color: colors.accentGreen[100],
        icono: <CheckCircle sx={{ fontSize: 12 }} />,
        label: "Alta efectividad",
        porcentaje,
      };
    } else if (porcentaje >= 50) {
      return {
        color: colors.yellowAccent[400],
        icono: <Warning sx={{ fontSize: 12 }} />,
        label: "Efectividad media",
        porcentaje,
      };
    } else {
      return {
        color: colors.redAccent[400],
        icono: <Error sx={{ fontSize: 12 }} />,
        label: "Baja efectividad",
        porcentaje,
      };
    }
  };

  return (
    <Box
      sx={{
        width: "300px",
        height: "100%",
        borderRadius: "12px",
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: COLOR_FONDO,
        border: `1px solid ${COLOR_BORDE}`,
        display: "flex",
        flexDirection: "column",
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }
      }}
    >
      {/* 🔹 Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${COLOR_BORDE}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: colors.grey[400],
            fontSize: "0.875rem",
          }}
        >
          Gestores en campo
        </Typography>
        {selectedGestor && (
          <Button
            size="small"
            variant="text"
            onClick={() => onSelectGestor(null)}
            sx={{
              fontSize: "0.7rem",
              textTransform: "none",
              color: colors.grey[400],
              minWidth: 'auto',
              p: '4px 8px',
              '&:hover': {
                backgroundColor: colors.primary[400] + '20',
              }
            }}
          >
            Ver todos
          </Button>
        )}
      </Box>

      {/* 🔹 Listado de gestores */}
      <List sx={{ flex: 1, p: 1 }}>
        {gestores.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: colors.grey[500] }}>
              No hay gestores con ubicación
            </Typography>
          </Box>
        ) : (
          gestores.map((gestor) => {
            const selected = selectedGestor === gestor.id;
            const efectividad = getEfectividadInfo(gestor);
            const porcentajeLocalizados = gestor.totalGestiones > 0 
              ? Math.round((gestor.localizados / gestor.totalGestiones) * 100) 
              : 0;

            return (
              <ListItemButton
                key={gestor.id}
                selected={selected}
                onClick={() => onSelectGestor(selected ? null : gestor.id)}
                sx={{
                  mb: 1,
                  borderRadius: '8px',
                  transition: "all 0.2s ease",
                  backgroundColor: selected ? colors.primary[400] + '20' : "transparent",
                  "&:hover": {
                    backgroundColor: selected
                      ? colors.primary[400] + '30'
                      : colors.primary[400] + '10',
                  },
                  border: selected ? `2px solid ${colors.primary[200]}` : 'none',
                }}
              >
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar
                    src={gestor.foto_usuario}
                    alt={gestor.nombre}
                    sx={{
                      border: `2px solid ${efectividad.color}`,
                      width: 40,
                      height: 40,
                      bgcolor: colors.primary[600],
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    {!gestor.foto_usuario && (
                      <Person sx={{ fontSize: 20 }} />
                    )}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        sx={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: COLOR_TEXTO,
                        }}
                        noWrap
                      >
                        {gestor.nombre}
                      </Typography>
                      {efectividad.icono}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ width: '100%', mt: 0.5 }}>
                      {/* Barra de progreso */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={porcentajeLocalizados}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: colors.primary[600],
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: efectividad.color,
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: '0.65rem', color: efectividad.color, fontWeight: 600 }}>
                          {porcentajeLocalizados}%
                        </Typography>
                      </Box>

                      {/* FILA 1: Localizados y No localizados (sin cambios) */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 0.5, 
                        alignItems: 'center',
                        mt: 0.5,
                        mb: 0.5, // Añadido margen inferior para separar de la nueva fila
                      }}>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: '0.6rem',
                            color: colors.accentGreen[100],
                            bgcolor: colors.accentGreen[100] + '15',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: '4px',
                            fontWeight: 500,
                            lineHeight: 1.2,
                          }}
                        >
                          {gestor.localizados} localizados
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: '0.6rem',
                            color: colors.redAccent[400],
                            bgcolor: colors.redAccent[400] + '15',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: '4px',
                            fontWeight: 500,
                            lineHeight: 1.2,
                          }}
                        >
                          {gestor.noLocalizados} no localizados
                        </Typography>
                      </Box>

                      {/* FILA 2: Total de registros (NUEVA) */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                      }}>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: '0.6rem',
                            color: colors.grey[400],
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Box component="span" sx={{ fontWeight: 600, color: colors.grey[200] }}>
                            {gestor.totalGestiones}
                          </Box>
                          registros totales
                        </Typography>
                      </Box>
                    </Box>
                  }
                  primaryTypographyProps={{ component: 'div' }}
                  secondaryTypographyProps={{ component: 'div', sx: { mt: 0 } }}
                />
              </ListItemButton>
            );
          })
        )}
      </List>

      {/* 🔹 Footer */}
      <Box
        sx={{
          p: 1.5,
          borderTop: `1px solid ${COLOR_BORDE}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            Gestores en mapa:
          </Typography>
          <Typography variant="caption" sx={{ color: COLOR_TEXTO, fontWeight: 600 }}>
            {gestores.length}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
            Total predios:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: colors.accentGreen[100], fontWeight: 500 }}>
              {gestores.reduce((acc, g) => acc + g.localizados, 0)} loc.
            </Typography>
            <Typography variant="caption" sx={{ color: colors.redAccent[400], fontWeight: 500 }}>
              {gestores.reduce((acc, g) => acc + g.noLocalizados, 0)} no loc.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SidePanelGestores;