import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Avatar, Typography, Chip } from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import { DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,  
  GridToolbarDensitySelector,
  GridToolbarExport,  
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import Viewer from 'react-viewer';
import { AccessTime, CalendarToday, Flag, ModeOfTravel, NotListedLocation, Photo, PhotoAlbum, PhotoAlbumOutlined, PhotoCamera, Spellcheck, TaskAlt, ViewAgenda } from "@mui/icons-material";
import { LinearProgress } from '@mui/material';
import PopupViewPositionDailyWorkSummary from '../../components/CoordinationDashboard/PopupViewDailyWorkSummary.jsx'

function DataGridManagementByManager({data, placeId, serviceId, proccessId}) {

  console.log(data)

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({ userId: null, dateCapture: null });

  const handleOpenPopup = (userId, dateCapture) => {
    setPopupData({ userId, dateCapture });
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setPopupData({ userId: null, dateCapture: null });
  };

  const buildColumns = () => {   
    const columns = [
      { 
        field: 'name',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
        ),
        width: 270,
        editable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', p: '12px' }}>
            <AvatarImage data={params.row.photo} />
            <Typography variant="h6" sx={{ marginLeft: 1 }}>{params.value}</Typography>
          </Box>
        )
      }, 
      { 
        field: 'date_capture',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FECHA"}</strong>
        ),
        width: 130,
        editable: false,
        renderCell: (params) => (
          <Chip
            icon={<CalendarToday />}
            label={
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                {params.value}
              </Typography>
            }
            variant="outlined"
            sx={{
              borderColor: theme.palette.info.main,
              color: theme.palette.info.main,
              '& .MuiChip-icon': {
                color: theme.palette.info.main
              }
            }}
          />
        )
      }, 
      { 
        field: 'first_and_last_management',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"PRIMER Y ULTIMA GESTION"}</strong>
        ),
        width: 200,
        editable: false,
        renderCell: (params) => {
          const hoursWorked = params.row.hours_worked;
          let color;
  
          if (hoursWorked === 0) {
            color = theme.palette.error.main;
          } else if (hoursWorked === 1 ) {
            color = theme.palette.warning.main;
          } else {
            color = theme.palette.secondary.main;
          }
  
          return (
            <Chip
              icon={<AccessTime />}
              label={
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  {params.value}
                </Typography>
              }
              variant="outlined"
              sx={{
                borderColor: color,
                color: color,
                '& .MuiChip-icon': {
                  color: color
                }
              }}
            />
          );
        }
      }, 
      { 
        field: 'hours_worked',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"HORAS TRABAJADAS"}</strong>
        ),
        width: 140,
        editable: false,
        renderCell: (params) => {
          let color;
          let iconColor;
  
          if (params.value === 0) {
            color = 'error';
            iconColor = 'error';
          } else if (params.value === 1) {
            color = 'warning';
            iconColor = 'warning'
          } else {
            color = 'secondary';
            iconColor = 'secondary';
          }
  
          return (
            <Chip
              icon={<Flag sx={{ color: iconColor }} />}
              label={
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                  {params.value}
                </Typography>
              }
              variant="outlined"
              color={color}
            />
          );
        },
      },
      { 
        field: 'total_procedures',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"GESTIONES"}</strong>
        ),
        width: 100,
        editable: false,
        renderCell: (params) => {
          const hoursWorked = params.row.hours_worked;
          let color;
  
          if (hoursWorked === 0) {
            color = theme.palette.error.main;
          } else if (hoursWorked === 1 ) {
            color = theme.palette.warning.main;
          } else {
            color = theme.palette.secondary.main;
          }
          
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>            
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                {params.value}
              </Typography>
              <TaskAlt sx={{ color: color }} />
            </div>
          )          
        }
      },
      { 
        field: 'located',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"LOCALIZADAS"}</strong>
        ),
        width: 100,
        editable: false,
        renderCell: (params) => {
          
          const percentage = (params.row.located / params.row.total_procedures) * 100 || 0;
          
          let progressColor;
          if (percentage <= 33) {
            progressColor = 'error';
          } else if (percentage <= 66) {
            progressColor = 'warning';
          } else {
            progressColor = 'secondary';
          }
          return (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90px' }}>
             <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                {params.value}
              </Typography>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ width: '60%', height: '8px' }}
              style={{ marginTop: '5px' }}
              color={progressColor}
            />
             <Typography variant="body1" sx={{ fontSize: '0.8em' }}>
             {`${Math.round(percentage)}%`}
            </Typography>
          </div>
          );
        }
      },
      { 
        field: 'not_located',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"NO LOCALIZADAS"}</strong>
        ),
        width: 120,
        editable: false,
        renderCell: (params) => {
          
          const percentage = (params.row.not_located / params.row.total_procedures) * 100 || 0;
          
          let progressColor;
          if (percentage <= 33) {
            progressColor = 'error';
          } else if (percentage <= 66) {
            progressColor = 'warning';
          } else {
            progressColor = 'secondary';
          }
          return (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90px' }}>
             <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                {params.value}
              </Typography>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ width: '60%', height: '8px' }}
              style={{ marginTop: '5px' }}
              color={progressColor}
            />
             <Typography variant="body1" sx={{ fontSize: '0.8em' }}>
             {`${Math.round(percentage)}%`}
            </Typography>
          </div>
          );
        }
      },
      { 
        field: 'not_position',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"CUENTAS SIN POSICION"}</strong>
        ),
        width: 160,
        editable: false,
        renderCell: (params) => {
          let color;
  
          if (params.value > 0) {
            color = theme.palette.error.main;
          } else {
            color = theme.palette.secondary.main;
          }
          
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>            
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                {params.value}
              </Typography>
              <NotListedLocation sx={{ color: color }} />
            </div>
          )          
        }        
      },
      { 
        field: 'total_photos',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FOTOS TOMADAS"}</strong>
        ),
        width: 120,
        editable: false,
        renderCell: (params) => {
          let color;
  
          if (params.value === 0) {
            color = theme.palette.error.main;
          } else {
            color = theme.palette.secondary.main;
          }
          
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>            
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                {params.value}
              </Typography>
              <Photo sx={{ color: color }} />
            </div>
          )          
        }        
      },
      { 
        field: 'total_not_photos',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"CUENTAS SIN FOTOS"}</strong>
        ),
        width: 140,
        editable: false,
        renderCell: (params) => {
          let color;
  
          if (params.value > 0) {
            color = theme.palette.error.main;
          } else {
            color = theme.palette.secondary.main;
          }
          
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>            
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                {params.value}
              </Typography>
              <Photo sx={{ color: color }} />
            </div>
          )          
        }        
      },
      { 
        field: 'actions',
        headerName: 'Acción',
        width: 150,
        renderCell: (params) => (
          <Button
            variant="contained"
            color="primary"
            startIcon={<ViewAgenda />}
            onClick={() => handleOpenPopup(params.row.user_id, params.row.date_capture)}
          >
            Ver
          </Button>
        )
      }
    ];
  
    return columns;
  };

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

  return (
    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="390px"
      gap="15px"
    >   
      <Box
        gridColumn='span 12'
        backgroundColor='rgba(128, 128, 128, 0.1)'
        borderRadius="10px"
        sx={{ cursor: 'pointer' }}
      >
        {data.length > 0 && (
          <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
            <Grid item xs={12} style={{ height: 400, width: '100%' }}>         
              <DataGrid
                  rows={data}
                  columns={buildColumns()}
                  getRowId={(row) => row.id}
                  editable={false}                 
                  autoPageSize
              />
            </Grid>
          </Grid>
        )}  
      </Box>
      <PopupViewPositionDailyWorkSummary 
        open={popupOpen} 
        onClose={handleClosePopup} 
        userId={popupData.userId} 
        dateCapture={popupData.dateCapture}
        placeId={placeId} 
        serviceId={serviceId} 
        proccessId={proccessId} 
      />
  </Box>   
  )
}
export default DataGridManagementByManager