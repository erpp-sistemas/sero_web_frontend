import { AccountCircle, AttachMoney, CloudDownload, DateRange, Folder, Preview } from '@mui/icons-material'
import { Avatar, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Tooltip, Typography, useTheme } from '@mui/material'
import React from 'react'
import { tokens } from "../../theme";

function FirstSection({ countResult, countUniqueAccount, totalAmount, paymentDateRange, handleExportToExcel, handleFilteredRows, typeFilter }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'rgba(128, 128, 128, 0.1)', borderRadius: '8px', boxShadow: 3 }}>
        <ListItem 
          alignItems="flex-start"
          sx={{  
            borderRadius: '12px',          
            border: typeFilter === 1 ? '3px solid #F4D03F' : '3px solid transparent',
            animation: typeFilter === 1 ? 'borderAnimation 2s infinite' : 'none',
            '@keyframes borderAnimation': {
              '0%': { borderColor: 'transparent' },
              '50%': { borderColor: '#00ff00' },
              '100%': { borderColor: 'transparent' },
            },
          }}  
        >
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
            <Folder style={{ color: '#fff' }}/>
          </Avatar>
          <ListItemText
              primary={
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold'}}>
                Registros encontrados
              </Typography>
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                {countResult}
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title="Descargar" arrow>
              <IconButton onClick={() => handleExportToExcel(1)}>
                <CloudDownload/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Registros" arrow>
              <IconButton 
                onClick={() => handleFilteredRows(1)}                
              >
                <Preview/>
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem sx={{ py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
            <AccountCircle style={{ color: '#fff' }} />
          </Avatar>
          <ListItemText                    
            primary={
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold'}}>
                Cuentas únicas
              </Typography>
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                {countUniqueAccount}
              </Typography>
            }                    
          />                  
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem sx={{ py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
            <AttachMoney style={{ color: '#fff' }} />
          </Avatar>
          <ListItemText                    
            primary={
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold'}}>
                Monto Ingresado
              </Typography>
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                $ {totalAmount}
              </Typography>
            }                    
          />                  
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem sx={{ py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
            <DateRange style={{ color: '#fff' }} />
          </Avatar>
          <ListItemText                    
            primary={
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold'}}>
                Rango de fechas de pagos
              </Typography>
            }
            secondary={
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mt: 1 }}>
                {paymentDateRange}
              </Typography>
            }                    
          />                  
        </ListItem>
      </List>
    </>
  )
}

export default FirstSection