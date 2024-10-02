import React from 'react'
import { tokens } from "../../theme";
import { Box, Divider, IconButton, LinearProgress, List, ListItem, ListItemSecondaryAction, ListItemText, Tooltip, Typography, useTheme } from '@mui/material';
import { CloudDownload, Preview } from '@mui/icons-material';

function ThirdSection({ countNoPosition, percentageCountNoPosition, countWithoutPropertyPhoto, percentageCountWithoutPropertyPhoto, countWithoutEvidencePhoto, percentageCountWithoutEvidencePhoto, countPropertyNotLocated, percentageCountPropertyNotLocated, handleExportToExcel, handleFilteredRows, typeFilter }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'rgba(128, 128, 128, 0.1)', borderRadius: '8px', boxShadow: 3, padding: 0 }}>
        <ListItem 
          alignItems="flex-start" 
          sx={{
             paddingBottom: 0,
             borderRadius: '12px',          
             border: typeFilter === 4 ? '3px solid #F4D03F' : '3px solid transparent',
             animation: typeFilter === 4 ? 'borderAnimation 2s infinite' : 'none',
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
                Registros sin posicion                        
              </Typography>
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                {countNoPosition}
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title="Descargar" arrow>
              <IconButton onClick={() => handleExportToExcel(4)}>
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Registros" arrow>
              <IconButton onClick={() => handleFilteredRows(4)}>
                <Preview />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem sx={{ paddingTop: 0, paddingBottom: 1 }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: 0 }}>
            <LinearProgress variant="determinate" color="error" value={percentageCountNoPosition} sx={{ height: 8, borderRadius: 4, flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`${percentageCountNoPosition}%`}
            </Typography>
          </Box>
        </ListItem>
        <Divider variant="inset" component="li" />
        
        <ListItem 
          alignItems="flex-start" 
          sx={{ 
            paddingTop: 0, 
            paddingBottom: 0,
            borderRadius: '12px',          
            border: typeFilter === 5 ? '3px solid #F4D03F' : '3px solid transparent',
            animation: typeFilter === 5 ? 'borderAnimation 2s infinite' : 'none',
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
                Registros sin foto de fachada                          
              </Typography>                        
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                {countWithoutPropertyPhoto}
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title="Descargar" arrow>
              <IconButton onClick={() => handleExportToExcel(5)}>
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Registros" arrow>
              <IconButton onClick={() => handleFilteredRows(5)}>
                <Preview />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem sx={{ paddingTop: 0, paddingBottom: 1 }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: 0 }}>
            <LinearProgress variant="determinate" color="error" value={percentageCountWithoutPropertyPhoto} sx={{ height: 8, borderRadius: 4, flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`${percentageCountWithoutPropertyPhoto}%`}
            </Typography>
          </Box>
        </ListItem>
        <Divider variant="inset" component="li" />
      
        <ListItem 
          alignItems="flex-start" 
          sx={{ 
            paddingTop: 0, 
            paddingBottom: 0,
            borderRadius: '12px',          
            border: typeFilter === 6 ? '3px solid #F4D03F' : '3px solid transparent',
            animation: typeFilter === 6 ? 'borderAnimation 2s infinite' : 'none',
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
                Registros sin foto de evidencia                      
              </Typography>
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1.5 }}>
                {countWithoutEvidencePhoto}
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title="Descargar" arrow>
              <IconButton onClick={() => handleExportToExcel(6)}>
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Registros" arrow>
              <IconButton onClick={() => handleFilteredRows(6)}>
                <Preview />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>                  
        
        <ListItem sx={{ paddingTop: 0, paddingBottom: 1 }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: 0 }}>
            <LinearProgress variant="determinate" color="error" value={percentageCountWithoutEvidencePhoto} sx={{ height: 8, borderRadius: 4, flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`${percentageCountWithoutEvidencePhoto}%`}
            </Typography>
          </Box>
        </ListItem>
        <Divider variant="inset" component="li" />
        
        <ListItem 
          alignItems="flex-start" 
          sx={{ 
            paddingTop: 0, 
            paddingBottom: 0,
            borderRadius: '12px',          
            border: typeFilter === 7 ? '3px solid #F4D03F' : '3px solid transparent',
            animation: typeFilter === 7 ? 'borderAnimation 2s infinite' : 'none',
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
                Registros de predios no localizados                        
              </Typography>                        
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 2 }}>
                {countPropertyNotLocated}
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title="Descargar" arrow>
              <IconButton onClick={() => handleExportToExcel(7)}>
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Registros" arrow>
              <IconButton onClick={() => handleFilteredRows(7)}>
                <Preview />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>                  
        <ListItem sx={{ paddingTop: 0, paddingBottom: 1 }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: 0 }}>
            <LinearProgress variant="determinate" color="error" value={percentageCountPropertyNotLocated} sx={{ height: 8, borderRadius: 4, flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`${percentageCountPropertyNotLocated}%`}
            </Typography>
          </Box>
        </ListItem>
      </List>
    </>
  )
}

export default ThirdSection