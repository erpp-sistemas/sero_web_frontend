import React from 'react';
import { Card, CardContent, CardHeader, Typography, useTheme, Avatar, CardMedia, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import { tokens } from '../../theme';
import Grid from '@mui/material/Grid'
import Viewer from 'react-viewer';


const Photos = ({ photo }) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const parsedPhotos = Array.isArray(photo) ? photo : JSON.parse(photo);

  const [visibleImage, setVisibleImage] = React.useState(null);

  const AvatarImage = ({ data }) => {
    const [visibleAvatar, setVisibleAvatar] = React.useState(false);
    return (
      <>
        <Avatar
          onClick={() => {
            setVisibleAvatar(true);
          }}
          alt="Remy Sharp"
          src={data}
        />
  
        <Viewer
          visible={visibleAvatar}
          onClose={() => {
            setVisibleAvatar(false);
          }}
          images={[{ src: data, alt: 'avatar' }]}          
        />
      </>
    );
  };

  if (parsedPhotos === null) {
    return (
      <Grid item container xs={12}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', color: 'secondary'}}>
            <Divider>No se encontraron fotografias</Divider>
          </Typography>
        </Grid>            
      </Grid>
      
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const formattedHours = String(hours).padStart(2, '0');
        
    return `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  const handleImageClick = (image) => {
    setVisibleImage(image); 
  };

  return (
    <div>
      <Box          
          display='flex'
          justifyContent='space-evenly'
          flexWrap='wrap'
          gap='20px'          
          padding='15px 10px'
          borderRadius='10px'
        >
          <Grid container spacing={2} >            
            {parsedPhotos.map((ph, index) => (
              <Grid key={index} item xs={12} md={4}>
              <Card variant='outlined' sx={{ backgroundColor: 'rgba(128, 128, 128, 0.1)'}}>
                <CardHeader 
                  avatar={<AvatarImage data={ph.photo_person_who_capture} />}
                  title={ph.person_who_capture}
                  subheader='Persona que capturo'
                  sx={{ borderLeft: '5px solid #00ff00' }}
                />
                <CardMedia
                  component='img'                  
                  image={ph.image_url}
                  alt={ph.image_url}
                  sx={{ 
                    height: '200px',                     
                  }}
                  onClick={() => handleImageClick({ src: ph.image_url, alt: 'image' })}
                />
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Tipo de foto
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {ph.image_type}
                  </Typography>                  
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Tarea gestionada
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {ph.task_done}
                  </Typography>                  
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Fecha de captura
                  </Typography>
                  <Typography variant="h4" component="div" gutterBottom>
                    {formatDate(ph.date_capture)}
                  </Typography>
                </CardContent>                 
              </Card>
            </Grid>
            ))}
          </Grid>           
        </Box>
        {visibleImage && (
        <Viewer
          visible={true}
          onClose={() => setVisibleImage(null)}
          images={[visibleImage]}
          scalable={true}
          rotatable={true}
        />
      )}
    </div>
  );
};

export default Photos;
