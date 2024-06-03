import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Avatar, Typography, LinearProgress} from "@mui/material";
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import { DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,  
  GridToolbarDensitySelector,
  GridToolbarExport,  
  GridToolbarFilterButton, } from '@mui/x-data-grid';
import Viewer from 'react-viewer';
import { TaskAlt } from "@mui/icons-material";

function PaymentsProceduresByManager({data}) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const buildColumns = () => {   
    const columns = [
      { 
        field: 'user',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
        ),
        width: 270,
        editable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', p: '12px' }}>
            <AvatarImage data={params.row.image_user} />
            <Typography variant="h6" sx={{ marginLeft: 1 }}>{params.value}</Typography>
          </Box>
        )
      }, 
      { 
        field: 'count',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"GESTIONES"}</strong>
        ),
        width: 80,
        editable: false,
        renderCell: (params) => {          
          let color = theme.palette.secondary.main;

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
        field: 'procedures_with_payment',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"GESTIONES CON PAGO"}</strong>
        ),
        width: 150,
        editable: false,
        renderCell: (params) => {
          
          const percentage = (params.row.procedures_with_payment / params.row.count) * 100 || 0;
          
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
        field: 'procedures_without_payment',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"GESTIONES SIN PAGO"}</strong>
        ),
        width: 150,
        editable: false,
        renderCell: (params) => {
          
          const percentage = (params.row.procedures_without_payment / params.row.count) * 100 || 0;
          
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
      // { 
      //   field: 'amount_paid',
      //   renderHeader: () => (
      //     <strong style={{ color: "#5EBFFF" }}>{"MONTO PAGADO"}</strong>
      //   ),
      //   width: 120,
      //   editable: false,        
      // },      
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
  </Box>   
  )
}
export default PaymentsProceduresByManager