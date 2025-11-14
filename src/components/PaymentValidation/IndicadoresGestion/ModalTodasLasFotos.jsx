// src/components/PaymentValidation/modals/ModalTodasLasFotos.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';
import { tokens } from '../../../theme';
import CloseIcon from '@mui/icons-material/Close';
import PhotoIcon from '@mui/icons-material/Photo';

const ModalTodasLasFotos = ({ open, onClose, fotos }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  console.log(fotos)

  const getTipoLabel = (tipo) => {
    const tipos = {
      'fachada': 'Fachada',
      'evidencia': 'Evidencia',
      'FACHADA': 'Fachada',
      'EVIDENCIA': 'Evidencia'
    };
    return tipos[tipo] || tipo;
  };

  const getTipoColor = (tipo) => {
    const tipoLower = tipo?.toLowerCase();
    if (tipoLower?.includes('fachada')) return colors.blueAccent[400];
    if (tipoLower?.includes('evidencia')) return colors.greenAccent[400];
    return colors.grey[400];
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.bgContainer,
          backgroundImage: 'none',
          borderRadius: '12px',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoIcon sx={{ color: colors.blueAccent[400] }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Galería de Fotografías
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose}
            sx={{
              color: colors.grey[400],
              '&:hover': {
                color: colors.grey[300],
                backgroundColor: `${colors.grey[700]}25`,
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Typography variant="body2" sx={{ color: colors.grey[400], mt: 1 }}>
          {fotos.length} foto{fotos.length !== 1 ? 's' : ''} en pagos válidos
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {fotos.length > 0 ? (
          <Grid container spacing={2}>
            {fotos.map((foto, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: colors.bgContainer,
                    backgroundImage: 'none',
                    border: `1px solid ${colors.borderContainer}`,
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${colors.grey[900]}20`,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={foto.urlImagen}
                    alt={`${foto.tipo} - ${foto.cuenta}`}
                    sx={{ 
                      objectFit: 'cover',
                      borderBottom: `1px solid ${colors.borderContainer}`,
                    }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 1 
                      }}
                    >
                      Cuenta: {foto.cuenta}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={getTipoLabel(foto.tipo)} 
                        size="small" 
                        sx={{
                          backgroundColor: `${getTipoColor(foto.tipo)}15`,
                          color: getTipoColor(foto.tipo),
                          fontWeight: 500,
                          border: `1px solid ${getTipoColor(foto.tipo)}30`,
                        }}
                      />
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: colors.grey[500],
                        }}
                      >
                        {foto.fechaCaptura ? new Date(foto.fechaCaptura).toLocaleDateString('es-MX') : 'N/A'}
                      </Typography>
                    </Box>
                    
                    {foto.referencia && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: colors.grey[400],
                          display: 'block',
                          mt: 1
                        }}
                      >
                        Ref: {foto.referencia}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              color: colors.grey[500]
            }}
          >
            <PhotoIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">
              No hay fotografías para mostrar
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Los pagos válidos no contienen fotografías en este momento
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalTodasLasFotos;