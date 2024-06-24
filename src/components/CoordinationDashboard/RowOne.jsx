import React, { useState, useEffect } from "react";
import { Box, Button, useTheme } from '@mui/material'
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
import { CloudDownload, Download, NoPhotography, Preview, Visibility } from "@mui/icons-material";
import ButtonGroup from '@mui/material/ButtonGroup';
import { managementByRangeDateAndIndicatorTypeRequest } from '../../api/management.js'
import LoadingModal from '../../components/LoadingModal.jsx'
import * as ExcelJS from "exceljs";

function RowOne({data, placeId, serviceId, proccessId, startDate, finishDate}) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [countRecords, setCountRecords] = useState(0);
    const [countLocated, setCountLocated] = useState(0);
    const [countNotLocated, setCountNotLocated] = useState(0);
    const [countManagers, setCountManagers] = useState(0);
    const [countNotPhoto, setCountNotPhoto] = useState(0);
    const [placeIdData, setPlaceIdData] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
      if(data.length > 0) {
        setCountRecords(data[0].count_records)
        setCountLocated(data[0].count_located)
        setCountNotLocated(data[0].count_not_located)
        setCountManagers(data[0].count_managers)
        setCountNotPhoto(data[0].count_not_photo)        
      }      
    }, [data]);

    const handleGetManagements = async () => {
      try {

        setIsLoading(true)        

        const response = await managementByRangeDateAndIndicatorTypeRequest(placeId, serviceId, proccessId, startDate, finishDate, 'management');
        console.log(response)  
        
        handleExportToExcelFull(response.data, 'gestiones')

        setIsLoading(false)
        
      } catch (error) {

        if(error.response.status === 400){
          console.log(error.response.status)
          console.log('estamos en el error 400')
          setIsLoading(false)
          
        }
      console.log([error.response.data.message])
      setIsLoading(false)
        
      }        
    };

    const handleExportToExcelFull = async (result, name) => {
      try {
        setIsLoading(true)

        console.log(result[0])
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Registros Encontrados");
                      
          const headers = Object.keys(result[0]);
          worksheet.addRow(headers);              
          
          result.forEach(row => {
              const values = headers.map(header => row[header]);
              worksheet.addRow(values);
          });

          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = name + ".xlsx";
          a.click();
          window.URL.revokeObjectURL(url);
          setIsLoading(false)
      } catch (error) {
          console.error("Error:", error);
          return null;
      }
  };
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
      <LoadingModal open={isLoading}/>
      {data.length > 0 && (
        <>
        <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
          <Grid item xs={2.4}>
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
                <Box sx={{ position: 'absolute', bottom: 2, left: 8, display: 'flex', gap: 1 }}>
                  <ButtonGroup variant="text" aria-label="Basic button group" size="small">
                    <Tooltip title="Descargar" arrow>
                      <IconButton>
                          <CloudDownload  style={{ color: theme.palette.secondary.main }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Registros" arrow>
                      <IconButton
                         onClick={() => handleGetManagements()}
                      >
                        <Preview  style={{ color: theme.palette.info.main }} />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </Box>
              </Box>                  
            </Card>
          </Grid>
          <Grid item xs={2.4}>
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
          <Grid item xs={2.4}>
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
          <Grid item xs={2.4}>
            <Card variant="outlined" sx={{ maxWidth: 400, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
              <Box sx={{ p: 2, textAlign: 'right', position: 'relative' }}>
                <Typography variant="h2" component="div">
                {countNotLocated}
                </Typography>
                <Typography color="text.secondary" variant="h5">
                  Predios no localizados
                </Typography>
                <Box sx={{ position: 'absolute', top: 8, left: 8, background: countNotLocated === 0 ? 'linear-gradient(to right, #a7eb9b, #00A71B)' : 'linear-gradient(to right, #eb9b9b, #A71B1B)', width: 48, height: 48, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <DoNotDisturbAltIcon sx={{ fontSize: 30, color: '#FFFFFF' }} />                  
                </Box>
              </Box>                  
            </Card>
          </Grid>
          <Grid item xs={2.4}>
            <Card variant="outlined" sx={{ maxWidth: 400, backgroundColor: 'rgba(128, 128, 128, 0.1)', borderLeft: '5px solid #00ff00'  }}>
              <Box sx={{ p: 2, textAlign: 'right', position: 'relative' }}>
                <Typography variant="h2" component="div">
                {countNotPhoto}
                </Typography>
                <Typography color="text.secondary" variant="h5">
                  Gestiones sin foto
                </Typography>
                <Box sx={{ position: 'absolute', top: 8, left: 8, background: countNotLocated === 0 ? 'linear-gradient(to right, #a7eb9b, #00A71B)' : 'linear-gradient(to right, #eb9b9b, #A71B1B)', width: 48, height: 48, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <NoPhotography sx={{ fontSize: 30, color: '#FFFFFF' }} />                  
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