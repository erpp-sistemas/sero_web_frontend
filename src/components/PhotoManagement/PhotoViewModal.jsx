import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Avatar, Typography, Box, useTheme, IconButton, TextField,Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { tokens } from "../../theme";
import LoadingModal from '../../components/LoadingModal.jsx';
import CustomAlert from '../../components/CustomAlert.jsx';
import { Dialog, DialogContent } from '@mui/material';
import { Cancel, CloudUpload, Delete, Save } from '@mui/icons-material';
import { updateAssignedPlacesRequest } from '../../api/auth';

const PhotoViewModal = ({ open, onClose, data }) => {
  if (!data) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const datePart = date.toISOString().split('T')[0];
    const timePart = date.toISOString().split('T')[1].split('.')[0];
    return `${datePart} ${timePart}`;
  };

  console.log('data inicial: ', data);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const defaultImage = 'https://ser0.mx/ser0/image/sin_foto.jpg';

  const [task, setTask] = useState(data.tarea_gestionada || '');
  const [manager, setManager] = useState('');
  const [date, setDate] = useState(formatDate(data.fecha_gestion) || '');
  const [photoType, setPhotoType] = useState(data.tipo || '');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (data) {
      setTask(data.tarea_gestionada || '');
      setManager(data.foto === defaultImage ? user.name : data.nombre_gestor)
      setDate(data.fecha_gestion ? formatDate(data.fecha_gestion) : '');
      setPhotoType(data.tipo || '');
    }
  }, [data]);

  const [formData, setFormData] = useState({
    url_image: defaultImage
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prevState => ({
        ...prevState,
        url_image: reader.result
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setFormData(prevState => ({
      ...prevState,
      url_image: defaultImage
    }));
  };
  
  const handleSave = () => {    
    if (formData.url_image === 'https://ser0.mx/ser0/image/sin_foto.jpg') {
      setAlertOpen(true);
      setAlertType("warning");
      setAlertMessage("¡Atencion! Debe elegir una imagen");
      return;
    }

    console.log('Datos guardados:', { task, manager, date, photoType, url_image: formData.url_image });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{
        '& .MuiDialog-paper': {
          boxShadow: '0px 5px 15px rgba(0,0,0,0.5)',
          borderRadius: '8px', 
        },
        bgcolor: 'background.paper'
      }}>
        <LoadingModal open={isLoading}/>
        <CustomAlert
          alertOpen={alertOpen}
          type={alertType}
          message={alertMessage}
          onClose={setAlertOpen}
        />
       <Box 
          sx={{ 
            display: 'flex', 
            width: '100%', 
            maxWidth: 1200, 
            bgcolor: 'background.paper',
            borderRadius: 2
          }}
        >
          <Card
            sx={{
              display: 'flex',
              width: '100%',
              maxWidth: 1200,
              border: '2px solid #5EBFFF',
              overflow: 'hidden'
            }}
          >
            <CardMedia
              component="img"
              sx={{ 
                width: 500, 
                height: 500, 
                objectFit: 'cover' 
              }}
              image={data.foto}
              alt="Foto"
            />
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              p: 2,
              width: '100%',
              maxWidth: 'calc(100% - 500px)'
            }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                  label="Tarea gestionada"
                  value={task}
                  fullWidth
                  margin="normal"
                  variant="outlined"                
                  InputProps={{ 
                    readOnly: true
                  }}
                />
                <TextField
                  label="Nombre del gestor"
                  value={manager}
                  fullWidth
                  margin="normal"
                  variant="outlined"                
                  InputProps={{ 
                    readOnly: true
                  }}
                />
                <TextField
                  label="Fecha de gestión"
                  value={formatDate(date)}
                  fullWidth
                  margin="normal"
                  variant="outlined"                
                  InputProps={{ 
                    readOnly: true
                  }}
                />
                <TextField
                  label="Tipo de foto"
                  value={photoType}
                  fullWidth
                  margin="normal"
                  variant="outlined"                
                  InputProps={{ 
                    readOnly: true
                  }}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <input
                      key={Date.now()}
                      accept="image/*"
                      id="photo-upload"
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="photo-upload" style={{ textAlign: 'center' }}>
                      <Typography variant="body1" gutterBottom>Sube tu foto</Typography>
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <CloudUpload color="info" fontSize="large" />
                        <Avatar
                          alt="Foto"
                          src={formData.url_image}
                          sx={{ width: 200, height: 200, borderRadius: '8px', ml: 1 }}
                        />
                      </Box>
                    </label>
                    {formData.url_image !== defaultImage && (
                      <Box position="absolute" top={0} right={0}>
                        <IconButton onClick={handleDeletePhoto} size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
              
              <Button 
                onClick={handleSave}
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
              >
                Guardar
              </Button>
            </CardContent>
          </Card>
            <Button 
                onClick={onClose} 
                variant="contained" 
                color="info" 
                sx={{ 
                position: 'absolute', 
                bottom: 16, 
                right: 16 
                }}
            >
            <Cancel/>
            Cerrar
          </Button>            
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoViewModal;
