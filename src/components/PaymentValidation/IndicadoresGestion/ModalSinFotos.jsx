// src/components/PaymentValidation/modals/ModalSinFotos.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SendIcon from '@mui/icons-material/Send';

const ModalSinFotos = ({ open, onClose, registros, tipoFoto, onEnviarFoto }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fotosSeleccionadas, setFotosSeleccionadas] = useState({});

  const handleFileSelect = (cuenta, event) => {
    const file = event.target.files[0];
    if (file) {
      setFotosSeleccionadas(prev => ({
        ...prev,
        [cuenta]: file
      }));
    }
  };

  const handleEnviarFoto = async (registro) => {
    const archivo = fotosSeleccionadas[registro.cuenta];
    if (!archivo) {
      alert('Por favor selecciona una foto primero');
      return;
    }

    const resultado = await onEnviarFoto(registro, archivo, tipoFoto);
    if (resultado) {
      setFotosSeleccionadas(prev => {
        const nuevas = { ...prev };
        delete nuevas[registro.cuenta];
        return nuevas;
      });
    }
  };

  const columns = [
    {
      field: 'cuenta',
      headerName: 'Cuenta',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'referencia',
      headerName: 'Referencia',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'total_pagado',
      headerName: 'Monto',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          ${parseFloat(params.value || 0).toLocaleString('es-MX')}
        </Typography>
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => {
        const registro = params.row;
        const tieneArchivo = !!fotosSeleccionadas[registro.cuenta];
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Botón para seleccionar archivo */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              size="small"
              sx={{
                borderColor: colors.blueAccent[400],
                color: colors.blueAccent[400],
                '&:hover': {
                  borderColor: colors.blueAccent[300],
                  backgroundColor: `${colors.blueAccent[400]}15`,
                },
              }}
            >
              Seleccionar
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFileSelect(registro.cuenta, e)}
              />
            </Button>
            
            {/* Botón para enviar (solo visible cuando hay archivo) */}
            {tieneArchivo && (
              <Tooltip title={`Enviar ${fotosSeleccionadas[registro.cuenta]?.name}`}>
                <IconButton
                  size="small"
                  onClick={() => handleEnviarFoto(registro)}
                  sx={{
                    color: colors.accentGreen[200],
                    backgroundColor: `${colors.accentGreen[200]}15`,
                    '&:hover': {
                      backgroundColor: `${colors.accentGreen[200]}25`,
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {/* Nombre del archivo seleccionado */}
            {tieneArchivo && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: colors.grey[400],
                  maxWidth: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {fotosSeleccionadas[registro.cuenta]?.name}
              </Typography>
            )}
          </Box>
        );
      },
    },
  ];

  const rows = registros.map((registro, index) => ({
    id: registro.id || index,
    cuenta: registro.cuenta,
    referencia: registro.referencia,
    total_pagado: registro.total_pagado,
  }));

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
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {tipoFoto === 'fachada' ? '📷 Fotografías de Fachada Faltantes' : '📸 Fotografías de Evidencia Faltantes'}
          </Typography>
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
          {registros.length} registro{registros.length !== 1 ? 's' : ''} sin {tipoFoto === 'fachada' ? 'foto de fachada' : 'foto de evidencia'}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            sx={{
              border: 'none',
              color: colors.grey[300],
              backgroundColor: colors.bgContainer,
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${colors.borderContainer}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: colors.bgContainer,
                borderBottom: `1px solid ${colors.borderContainer}`,
                fontWeight: 600,
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${colors.borderContainer}`,
              },
              '& .MuiDataGrid-row:hover': { 
                backgroundColor: colors.hoverRow || `${colors.blueAccent[400]}08`,
              },
            }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.borderContainer}` }}>
        <Button 
          onClick={onClose}
          sx={{
            color: colors.grey[400],
            '&:hover': {
              color: colors.grey[300],
              backgroundColor: `${colors.grey[700]}15`,
            }
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalSinFotos;