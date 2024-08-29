import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useTheme, CardMedia, CardHeader, Badge } from '@mui/material';
import Box from '@mui/material/Box';
import { tokens } from '../../theme';
import Grid from '@mui/material/Grid';
import { viewPositionVerifiedAddressRequest } from '../../api/coordination.js'
import MapboxMap from '../../components/CoordinationDashboard/MapBoxComponent.jsx'
import DownloadIcon from '@mui/icons-material/Download';
import LoadingModal from '../../components/LoadingModal.jsx';
import * as ExcelJS from "exceljs";

function PopupViewPositionVerifiedAddress({ open, onClose, userId, dateCapture, placeId, serviceId, proccessId }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [positionsData, setPositionsData] = useState([]);  
  const [selectedPhotos, setSelectedPhotos] = useState([]);  
  const [isLoading, setIsLoading] = useState(false);

  const ViewPositionVerifiedAddress = async () => {
    try {
      setIsLoading(true);

      const response = await viewPositionVerifiedAddressRequest(placeId, serviceId, proccessId, userId, dateCapture);
      setPositionsData(JSON.parse(response.data[0].Positions))      
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setPositionsData([]);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedPhotos([]);
      setPositionsData([]);       
      ViewPositionVerifiedAddress();
    }
  }, [open, userId, dateCapture, placeId, serviceId, proccessId]);

  const downloadExcel = async (data, filename) => {
    try {
      setIsLoading(true);
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");  
  
      const columnHeaders = {
        account: "CUENTA",
        street: "CALLE",
        latitude: "LATITUD",
        longitude: "LONGITUD",
        task: "TAREA GESTIONADA",
        property_status: "ESTATUS DEL PREDIO",
        date_capture: "FECHA DE CAPTURA",
      };
  
      const addRowsToWorksheet = (data) => {
        const headers = Object.keys(columnHeaders);
        const headerRow = headers.map(header => columnHeaders[header]);
        worksheet.addRow(headerRow);
  
        data.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
      };
  
      addRowsToWorksheet(data);      
  
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =  `${filename}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
    // const filteredData = data.map(item => {
    //   // Remover el campo 'photo'
    //   const { photo, ...newItem } = item;
    //   return newItem;
    // });

    // const translatedData = filteredData.map(item => {
    //   // Traducir los nombres de los campos al español
    //   return {
    //     Cuenta: item.account,
    //     Tarea_realizada: item.task,
    //     Fecha_gestion: item.date_capture,
    //     Estatus_predio: item.property_status,
    //     Latitud: item.latitude,
    //     Longitud: item.longitude,        
    //   };
    // });

    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const handleGestionesDownload = () => {
    downloadExcel(positionsData, 'Gestiones');
  }; 

  const handleMarkerClick = ({ account, dateCapture, latitude, longitude }) => {    
  };

  const gestionesCount = positionsData.length;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg' >
      <DialogTitle>Ubicaciones</DialogTitle>
      <DialogContent>
        <Box display='flex' justifyContent='space-between' m={2}>
          <Badge badgeContent={gestionesCount} color="primary" overlap="rectangular">          
            <Button 
              color="info" 
              variant="contained" 
              startIcon={<DownloadIcon />} 
              onClick={handleGestionesDownload}
              sx={{ minWidth: '120px' }}
              disabled={gestionesCount === 0}
            >
              Gestiones
            </Button>
          </Badge>          
        </Box>        
        {isLoading && <LoadingModal open={isLoading} />}
      <Box            
            display='flex'
            justifyContent='space-evenly'
            flexWrap='wrap'
            gap='20px'
            sx={{ backgroundColor: colors.primary[400], width: '100%' }}
            padding='5px 10px'
            borderRadius='10px'
        >
          <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={12}>              
              {positionsData.length > 0 && <MapboxMap positions={positionsData} onClickMarker={handleMarkerClick} setIsLoading={setIsLoading}/>}
            </Grid>
          </Grid>          
        </Box>
       
      </DialogContent>
      <DialogActions>
        <Button 
        onClick={onClose} 
        color="info"
        variant="contained"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopupViewPositionVerifiedAddress;
