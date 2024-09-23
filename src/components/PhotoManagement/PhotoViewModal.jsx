import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Avatar, Typography, Box, useTheme, IconButton, TextField,Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { tokens } from "../../theme";
import LoadingModal from '../../components/LoadingModal.jsx';
import CustomAlert from '../../components/CustomAlert.jsx';
import { Dialog, DialogContent } from '@mui/material';
import { Cancel, CloudUpload, Delete, SaveAs } from '@mui/icons-material';
import { savePhotoRequest } from '../../api/photo.js';

const PhotoViewModal = ({ open, onClose, selectedPlace, selectedService, data, onImageUrlUpdate }) => {
  if (!data) return null;

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
  
  const handleSave = async () => {    
    if (formData.url_image === 'https://ser0.mx/ser0/image/sin_foto.jpg') {
      setAlertOpen(true);
      setAlertType("warning");
      setAlertMessage("¡Atencion! Debe elegir una imagen");
      return;
    }

    const photo_data = {      
      place_id: selectedPlace,
      service_id: selectedService,
      account: data.cuenta,
      record_id: data.id_registro,
      photo_record_id: data.id_registro_foto,
      task: data.tarea_gestionada,
      manager: data.nombre_gestor,
      date_capture: data.fecha_gestion,
      process: data.proceso,
      type: data.tipo,
      num_photo: data.num_foto,
      cell: data.celda,      
      url_image: formData.url_image,
      user_session: user.name
    };  
    
    try {
      setIsLoading(true);
      const response = await savePhotoRequest( photo_data );
      const updatedImageUrl = response.data.image_url;
      const updatedPhotoRecordId = response.data.photo_record_id;      
      // const updatedImageUrl = response.data.message;
      // console.log(updatedImageUrl)
      // setFormData(prevState => ({
      //   ...prevState,
      //   url_image: updatedImageUrl
      // }));

      setAlertOpen(true);
      setAlertType("success");
      setAlertMessage("¡Foto guardada exitosamente!");

      if (onImageUrlUpdate) {
        const response_photo = {
          image_url: updatedImageUrl,
          celda: data.celda,
          photo_record_id: updatedPhotoRecordId
        };

        data.foto = updatedImageUrl;        
        onImageUrlUpdate(response_photo);
        //onImageUrlUpdate(updatedImageUrl);
      }

    } catch (error) {
      console.error('Error al guardar la foto:', error);
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage("Hubo un error al guardar la foto. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
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
              key={formData.url_image}
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
                  value={date}
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
                sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              >
                <SaveAs fontSize="large"/>
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
