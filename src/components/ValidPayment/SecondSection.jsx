import { CloudDownload, PieChart, Preview } from '@mui/icons-material'
import { Box, IconButton, LinearProgress, List, ListItem, ListItemSecondaryAction, ListItemText, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { tokens } from "../../theme";
import ModalChart from './SecondSection/ModalChart';

function SecondSection({ countValidProcedures, countInvalidProcedures, percentageValidProcedures, percentageInvalidProcedures, amountValidProcedures, percentageAmountValidProcedures, amountInvalidProcedures, percentageAmountInvalidProcedures, handleExportToExcel, handleFilteredRows, typeFilter }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    
    setOpenModal(true);       
 }

 const handleCloseModal = () => {
   setOpenModal(false);
 }

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'rgba(128, 128, 128, 0.1)', borderRadius: '8px', boxShadow: 3, padding: 0 }}>
        <ListItem 
          alignItems="flex-start" 
          sx={{ 
            paddingBottom: 0,
            borderRadius: '12px',          
            border: typeFilter === 2 ? '3px solid #F4D03F' : '3px solid transparent',
            animation: typeFilter === 2 ? 'borderAnimation 2s infinite' : 'none',
            '@keyframes borderAnimation': {
              '0%': { borderColor: 'transparent' },
              '50%': { borderColor: '#00ff00' },
              '100%': { borderColor: 'transparent' },
            }, 
          }}
          >
          <ListItemText
            primary={
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Gestiones Validas                        
              </Typography>
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                {countValidProcedures}
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title="Descargar" arrow>
              <IconButton onClick={() => handleExportToExcel(2)}>
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Registros" arrow>
              <IconButton onClick={() => handleFilteredRows(2)}>
                <Preview />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem sx={{ paddingTop: 0, paddingBottom: 0.5 }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: 0 }}>
            <LinearProgress variant="determinate" color="secondary" value={percentageValidProcedures} sx={{ height: 8, borderRadius: 4, flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`${percentageValidProcedures}%`}
            </Typography>
          </Box>
        </ListItem>
        
        <ListItem 
          alignItems="flex-start" 
          sx={{ 
            paddingTop: 0, 
            paddingBottom: 0,
            borderRadius: '12px',          
            border: typeFilter === 3 ? '3px solid #F4D03F' : '3px solid transparent',
            animation: typeFilter === 3 ? 'borderAnimation 2s infinite' : 'none',
            '@keyframes borderAnimation': {
              '0%': { borderColor: 'transparent' },
              '50%': { borderColor: '#00ff00' },
              '100%': { borderColor: 'transparent' },
            }, 
          }}
        >
          <ListItemText
            primary={
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Gestiones no validas                          
              </Typography>                        
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                {countInvalidProcedures}
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title="Descargar" arrow>
              <IconButton onClick={() => handleExportToExcel(3)}>
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Registros" arrow>
              <IconButton onClick={() => handleFilteredRows(3)}>
                <Preview />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem sx={{ paddingTop: 0, paddingBottom: 0.5 }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: 0 }}>
            <LinearProgress variant="determinate" color="warning" value={percentageInvalidProcedures} sx={{ height: 8, borderRadius: 4, flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`${percentageInvalidProcedures}%`}
            </Typography>
          </Box>
        </ListItem>                  
      </List>

      <List sx={{ width: '100%', bgcolor: 'rgba(128, 128, 128, 0.1)', borderRadius: '8px', boxShadow: 3, mt: 2 }}>
        <ListItem alignItems="flex-start" sx={{ paddingBottom: 0 }}>
          <ListItemText
            primary={
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Monto de gestiones validas                          
              </Typography>
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                {amountValidProcedures}
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title="Ver grafica" arrow>
              <IconButton 
                onClick={() => handleOpenModal()}
              >
                <PieChart />
              </IconButton>
            </Tooltip>            
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem sx={{ paddingTop: 0, paddingBottom: 0.5 }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: 0 }}>
            <LinearProgress variant="determinate" color="secondary" value={percentageAmountValidProcedures} sx={{ height: 8, borderRadius: 4, flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`${percentageAmountValidProcedures}%`}
            </Typography>
          </Box>
        </ListItem>
        
        <ListItem alignItems="flex-start" sx={{ paddingTop: 0, paddingBottom: 0 }}>
          <ListItemText
            primary={
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Monto de gestiones no validas                          
              </Typography>                        
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                {amountInvalidProcedures}
              </Typography>
            }
          />                  
        </ListItem>
        
        <ListItem sx={{ paddingTop: 0, paddingBottom: 0.5 }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: 0 }}>
            <LinearProgress variant="determinate" color="warning" value={percentageAmountInvalidProcedures} sx={{ height: 8, borderRadius: 4, flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`${percentageAmountInvalidProcedures}%`}
            </Typography>
          </Box>
        </ListItem>
      </List>
      <ModalChart 
        open={openModal} 
        onClose={handleCloseModal} 
        amountValidProcedures ={amountValidProcedures} 
        amountInvalidProcedures={amountInvalidProcedures}
      />
    </>
  )
}

export default SecondSection