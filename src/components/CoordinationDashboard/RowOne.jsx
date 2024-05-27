import React, { useState, useEffect } from "react";
import { Box, useTheme } from '@mui/material'
import { tokens } from "../../theme";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PushPinIcon from '@mui/icons-material/PushPin';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

function RowOne({data}) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [countRecords, setCountRecords] = useState(0);
    const [countLocated, setCountLocated] = useState(0);
    const [countNotLocated, setCountNotLocated] = useState(0);
    const [countManagers, setCountManagers] = useState(0);
    const [countNotPhoto, setCountNotPhoto] = useState(0);
    const [countPostPayment, setCountPostPayment] = useState(0);


    console.log(data)
    
    useEffect(() => {
      if(data.length > 0) {
        setCountRecords(data[0].count_records)
        setCountLocated(data[0].count_located)
        setCountNotLocated(data[0].count_not_located)
        setCountManagers(data[0].count_managers)
        setCountNotPhoto(data[0].not_photo)
        setCountPostPayment(data[0].count_post_payment)
      }      
    }, [data]);
    // useEffect(() => {

    //   setCountResult(data.length)

    //   let located = 0;
    //   let noLocated  = 0;
    //   const uniqueIds = new Set();

    //     data.forEach(item => {
    //         if (item.estatus_predio === 'Predio localizado') {
    //             located++;
    //         } else {
    //             noLocated++;
    //         }
    //         uniqueIds.add(item.gestor);
    //     });

    //     setCountLocatedProperty(located);
    //     setCountNoLocatedProperty(noLocated);
    //     setUniqueUserIds(uniqueIds.size);

    // }, [data]);

    // console.log(data)
    // console.log(countResult)
    // console.log(uniqueUserIds)

  return (
    <Box      
      display='flex'
      justifyContent='space-evenly'
      flexWrap='wrap'
      gap='20px'
      sx={{ backgroundColor: colors.primary[400], width: '100%' }}
      padding='10px 10px'
      borderRadius='10px'
    >
      {data.length > 0 && (
        <>
        <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
          <Grid item xs={3}>
            <Card variant="outlined" sx={{ maxWidth: 400, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
              <Box sx={{ p: 2, textAlign: 'right', position: 'relative' }}>                    
                <Typography variant="h2" component="div">
                {countRecords}
                </Typography>
                <Typography color="text.secondary" variant="h5">
                  Gestiones
                </Typography>
                <Box sx={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(to right, #a7eb9b, #00A71B)', width: 48, height: 48, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <NewspaperIcon sx={{ fontSize: 30, color: '#FFFFFF' }} />                  
                </Box>
              </Box>                  
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card variant="outlined" sx={{ maxWidth: 360, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
              <Box sx={{ p: 2, textAlign: 'right', position: 'relative' }}>                    
                <Typography variant="h2" component="div">
                {countManagers}
                </Typography>
                <Typography color="text.secondary" variant="h5">
                  Gestores
                </Typography>
                <Box sx={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(to right, #a7eb9b, #00A71B)', width: 48, height: 48, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <AssignmentIndIcon sx={{ fontSize: 30, color: '#FFFFFF' }} />                  
                </Box>
              </Box>                  
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card variant="outlined" sx={{ maxWidth: 400, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
              <Box sx={{ p: 2, textAlign: 'right', position: 'relative' }}>                    
                <Typography variant="h2" component="div">
                {countLocated}
                </Typography>
                <Typography color="text.secondary" variant="h5">
                  Predios Localizados
                </Typography>
                <Box sx={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(to right, #a7eb9b, #00A71B)', width: 48, height: 48, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PushPinIcon sx={{ fontSize: 30, color: '#FFFFFF' }} />                  
                </Box>
              </Box>                  
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card variant="outlined" sx={{ maxWidth: 400, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
              <Box sx={{ p: 2, textAlign: 'right', position: 'relative' }}>
                <Typography variant="h2" component="div">
                {countNotLocated}
                </Typography>
                <Typography color="text.secondary" variant="h5">
                  Predios no localizados
                </Typography>
                <Box sx={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(to right, #a7eb9b, #00A71B)', width: 48, height: 48, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <DoNotDisturbAltIcon sx={{ fontSize: 30, color: '#FFFFFF' }} />                  
                </Box>
              </Box>                  
            </Card>
          </Grid>          
        </Grid>        
        </>
      )}
    </Box>
  )
}

export default RowOne