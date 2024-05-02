import React from "react";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import { Box, useTheme, Avatar, Card, CardContent, Typography, Divider } from "@mui/material";
import Viewer from 'react-viewer';
import Chip from '@mui/material/Chip';
import { DirectionsRun, MarkEmailRead } from "@mui/icons-material";

const Actions = ({ action }) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const parsedActions = Array.isArray(action) ? action : JSON.parse(action);
  
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

  if (parsedActions === null) {
    return (
      <Grid item container xs={12}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold'}}>
            <Divider>No se encontraron acciones</Divider>
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
                <Divider>Acciones</Divider>
              </Typography>
            </Grid>            
          </Grid>
          <Grid container spacing={2} >            
            {parsedActions.map((actions, index) => (
              <Grid key={index} item xs={12} md={4}>
              <Card variant='outlined' sx={{ bgcolor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[50]}}>
                <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <AvatarImage data={actions.photo_person_who_capture} />
                    </Grid>
                    <Grid item xs={9}>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        <Divider textAlign='left'>Persona que gestionó</Divider>
                      </Typography>
                      <Typography variant="h5" component="div">
                        {actions.person_who_capture}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Tarea gestionada</Divider>
                  </Typography>
                  <Typography>
                    <Box display="flex" alignItems="center" >
                      <Chip
                        icon={actions.task_done.includes('Carta Invitación') ? <MarkEmailRead /> : <DirectionsRun />} 
                        label={actions.task_done} 
                        variant="outlined" 
                        color={
                          actions.task_done === '1ra Carta Invitación' ? 'secondary' :
                          actions.task_done === '2da Carta Invitación' ? 'warning' :
                          actions.task_done === '3ra Carta Invitación' ? 'warning' : 
                          actions.task_done === '4ta Carta Invitación' ? 'error' : 'info'
                        }
                      />
                    </Box>
                  </Typography> 
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    <Divider textAlign='left'>Fecha de gestion</Divider>
                  </Typography>
                  <Typography variant="h5" component="div">
                    {actions.date_capture}
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

export default Actions;
