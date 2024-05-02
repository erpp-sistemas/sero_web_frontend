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

  return (
    <div>
      <Box
          m='20px 0'
          display='flex'
          justifyContent='space-evenly'
          flexWrap='wrap'
          gap='20px'          
          padding='15px 10px'
          borderRadius='10px'
        >
          <Grid item container xs={12}>
            <Grid item xs={12}>
              <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold', fontSize: '2rem'}}>
                <Divider>Fotografias</Divider>
              </Typography>
            </Grid>            
          </Grid>
          <Grid container spacing={2} >            
            {parsedPhotos.map((ph, index) => (
              <Grid key={index} item xs={12} md={4}>
              <Card variant='outlined' sx={{ bgcolor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[50]}}>
                <CardHeader 
                  avatar={<AvatarImage data={ph.photo_person_who_capture} />}
                  title={ph.person_who_capture}
                  subheader={ph.date_capture}
                />
                <CardMedia
                  component='img'
                  style={{ height: '200px' }}
                  image={ph.image_url}
                  alt={ph.image_url}
                />
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Tipo de foto</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {ph.image_type}
                  </Typography>                  
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Tarea gestionada</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {ph.task_done}
                  </Typography>                  
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Fecha en que ingreso en sistema</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {ph.synchronization_date}
                  </Typography>
                </CardContent>                 
              </Card>
            </Grid>
            ))}
          </Grid>           
        </Box>
    </div>
  );
};

export default Photos;
