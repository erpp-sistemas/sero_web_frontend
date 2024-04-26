import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import Chip from '@mui/material/Chip';

const ModalTable = ({ open, onClose, data }) => {
  const columns = [
    { 
        field: 'account',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"CUENTA"}</strong>
        ),
        width: 100,
        editable: false,
      },
      { 
        field: 'task_assigned',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"TAREA ASIGNADA"}</strong>
        ),
        width: 150,
        editable: false,
      },
      { 
        field: 'person_assigned',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"PERSONA ASIGNADA"}</strong>
        ),
        width: 210,
        editable: false,
      },
      { 
        field: 'assignment_result',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"RESULTADO DE LA ASIGNACION"}</strong>
        ),
        width: 210,
        editable: false,
        renderCell: (params) => {
          const result = params.row.assignment_result;
          let chipColor = 'default';
          let icon = ''
          switch (result) {
            case 'asignacion correcta':
              icon = <DoneAllIcon/>;
              chipColor = 'success';
              break;
            case 'no existe la cuenta':
              icon = <ErrorIcon/>
              chipColor="error"
              break
            case 'cuenta duplicada':
              icon = <WarningIcon/>;
              chipColor = 'warning'
              break
            case 'no existe la tarea':
              icon = <CancelIcon/>
              chipColor="error"
              break
            case 'no existe el usuario':
              icon = <PersonOutlineIcon/>
              chipColor="error"
              break
            case 'no tiene deuda en el mes actual':
              icon = <WarningIcon/>;
              chipColor = 'warning';
              break;
            default:
              icon = <NotInterestedIcon/>;
              chipColor = 'default';
              break;
          }
          return (
          <>
            <Chip 
            label={result} 
            color={chipColor}
            variant="outlined" 
            icon={icon}
            style={{ marginLeft: '5px' }}
            />
          </>
          )
        },
      }
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: '80%', maxHeight: 500, overflow: 'auto', bgcolor: 'background.paper', mx: 'auto', my: 4, p: 2, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom component="div">
          Registros
        </Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={data} columns={columns} />
        </div>
      </Box>
    </Modal>
  );
};

export default ModalTable;