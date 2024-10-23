import React from 'react';
import { Modal, Box, Typography, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import DangerousIcon from '@mui/icons-material/Dangerous';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ImageViewerModal from '../../components/ImageViewerModal.jsx'
import { RunningWithErrors } from '@mui/icons-material';

const ModalTable = ({ open, onClose, data }) => {
    const columns = [
      { 
        field: 'usuario',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
        ),
        width: 210,
        editable: false,
      },
      { 
        field: 'imagen_url',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FOTO"}</strong>
        ),
        width: 70,
        renderCell: (params) => <AvatarImage data={params.row.imagen_url} />,
      },
      { 
        field: 'plaza', 
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"PLAZA"}</strong>
        ),
        width: 120,
      },
      { 
        field: 'fecha_captura', 
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FECHA DE CAPTURA"}</strong>
        ),
        width: 120,
        renderCell: (params) => (
          <>
            {params.value}
            <CalendarMonthIcon style={{ marginLeft: '5px' }} />
          </>
        ),
      },
      { 
        field: 'hora_entrada',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"HORA DE ENTRADA"}</strong>
        ),
        width: 120,
        renderCell: (params) => (
          <>
            {params.value}
            <AccessTimeIcon style={{ marginLeft: '5px' }} />
          </>
        ),
      },
      { 
        field: 'estatus_entrada',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE ENTRADA"}</strong>
        ),
        width: 200,
        renderCell: (params) => {
          let icon = null;
          let chipColor = 'primary';
          let chipLabel = '';
          switch (params.row.estatus_entrada) {
            case 'Asistencia correcta':
              icon = <InsertEmoticonIcon/>;
              chipColor = 'success';
              chipLabel = 'Asistencia correcta';
              break;
            case 'Retardo':
              icon = <WarningAmberIcon/>;
              chipColor = 'warning';
              chipLabel = 'Retardo';
              break;
            case 'Falta':
              icon = <DangerousIcon/>;
              chipColor = 'error';
              chipLabel = 'Falta';
              break;
            case 'Dia incompleto':
              icon = <SentimentVeryDissatisfiedIcon/>;
              chipColor = 'error';
              chipLabel = 'Día incompleto';
              break;            
            default:
              icon = null;
              chipColor = 'primary';
          }
          return (
            <>                  
              <Chip
                icon={icon}
                label={chipLabel}
                color={chipColor}
                variant="outlined"
                style={{ marginLeft: '5px' }}
              />
            </>
          );
        },
      },
      { 
        field: 'estatus_punto_entrada',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE PUNTO DE ENTRADA"}</strong>
        ),
        width: 200,
        renderCell: (params) => {
          let icon = null;
          let chipColor = 'primary';
          let chipLabel = '';
          switch (params.row.estatus_punto_entrada) {
            case 'Campo':
              icon = <EditRoadIcon/>;
              chipColor = 'warning';
              chipLabel = 'Campo';
              break;
            case 'Corporativo':
              icon = <ApartmentIcon/>;
              chipColor = 'info';
              chipLabel = 'Corporativo';
              break;                
            default:
              icon = null;
              chipColor = 'primary';
          }
          return (
            <>                  
              <Chip
                icon={icon}
                label={chipLabel}
                color={chipColor}
                variant="outlined"
                style={{ marginLeft: '5px' }}
              />
            </>
          );
        },
      },
      { 
        field: 'lugar_entrada',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE ENTRADA"}</strong>
        ),
        width: 120,
        renderCell: (params) => (
          <PersonPinCircleIcon 
            style={{ cursor: 'pointer', color: 'lightblue', fontSize: 40 }} 
            onClick={() => {
              window.open(params.value, '_blank');
            }}
          />
        ),
      },
      { 
        field: 'hora_salida',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"HORA DE SALIDA"}</strong>
        ),
        width: 100,
        renderCell: (params) => (
          <>
            {params.value}
            <AccessTimeIcon style={{ marginLeft: '5px' }} />
          </>
        ),
      },
      { 
        field: 'estatus_salida',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE SALIDA"}</strong>
        ),
        width: 150,
        renderCell: (params) => {
          let icon = null;
          let chipColor = 'primary';
          let chipLabel = '';
          switch (params.row.estatus_salida) {
            case 'Asistencia correcta':
              icon = <InsertEmoticonIcon/>;
              chipColor = 'success';
              chipLabel = 'Asistencia correcta';
              break;
            case 'Retardo':
              icon = <WarningAmberIcon/>;
              chipColor = 'warning';
              chipLabel = 'Retardo';
              break;
            case 'Falta':
              icon = <DangerousIcon/>;
              chipColor = 'error';
              chipLabel = 'Falta';
              break;
            case 'Dia incompleto':
              icon = <SentimentVeryDissatisfiedIcon/>;
              chipColor = 'error';
              chipLabel = 'Dia incompleto';
              break;
            case 'Registro incompleto':
              icon = <RunningWithErrors/>;
              chipColor = 'error';
              chipLabel = 'Registro incompleto';
              break;
            default:
              icon = null;
              chipColor = 'primary';
          }
          return (
            <>                  
              <Chip
                icon={icon}
                label={chipLabel}
                color={chipColor}
                variant="outlined"
                style={{ marginLeft: '5px' }}
              />
            </>
          );
        },            
      },
      { 
        field: 'estatus_punto_salida',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE PUNTO DE SALIDA"}</strong>
        ),
        width: 180,
        renderCell: (params) => {
          let icon = null;
          let chipColor = 'primary';
          let chipLabel = '';
          switch (params.row.estatus_punto_salida) {
            case 'Campo':
              icon = <EditRoadIcon/>;
              chipColor = 'warning';
              chipLabel = 'Campo';
              break;
            case 'Corporativo':
              icon = <ApartmentIcon/>;
              chipColor = 'info';
              chipLabel = 'Corporativo';
              break;                
            default:
              icon = null;
              chipColor = 'primary';
          }
          return (
            <>                  
              <Chip
                icon={icon}
                label={chipLabel}
                color={chipColor}
                variant="outlined"
                style={{ marginLeft: '5px' }}
              />
            </>
          );
        },
      },
      { 
        field: 'lugar_salida',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE SALIDA"}</strong>
        ),
        width: 120,
        renderCell: (params) => (
          <PersonPinCircleIcon 
            style={{ cursor: 'pointer', color: 'lightblue', fontSize: 40 }} 
            onClick={() => {
              window.open(params.value, '_blank');
            }}
          />
        ),
      },
      { 
        field: 'hora_entrada_comida',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"HORA DE ENTRADA DE COMIDA"}</strong>
        ),
        width: 200,
        renderCell: (params) => (
          <>
            {params.value}
            <AccessTimeIcon style={{ marginLeft: '5px' }} />
          </>
        ),
      },
      { 
        field: 'lugar_entrada_comida',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE ENTRADA DE COMIDA"}</strong>
        ),
        width: 200,
        renderCell: (params) => (
          <PersonPinCircleIcon 
            style={{ cursor: 'pointer', color: 'lightblue', fontSize: 40 }} 
            onClick={() => {
              window.open(params.value, '_blank');
            }}
          />
        ),
      },
      { 
        field: 'hora_salida_comida',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"HORA DE SALIDA DE COMIDA"}</strong>
        ),
        width: 200,
        renderCell: (params) => (
          <>
            {params.value}
            <AccessTimeIcon style={{ marginLeft: '5px' }} />
          </>
        ),
      },
      { 
        field: 'lugar_salida_comida',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE SALIDA DE COMIDA"}</strong>
        ),
        width: 200,
        renderCell: (params) => (
          <PersonPinCircleIcon 
            style={{ cursor: 'pointer', color: 'lightblue', fontSize: 40 }} 
            onClick={() => {
              window.open(params.value, '_blank');
            }}
          />
        ),
      },
      ];

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
      
            {visibleAvatar && (
              <ImageViewerModal
                open={true}
                onClose={() => setVisibleAvatar(false)}
                imageUrl={data}
              />
            )}
          </>
        );
      };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: '80%', maxHeight: 500, overflow: 'auto', bgcolor: 'background.paper', mx: 'auto', my: 4, p: 2, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom component="div">
          Registros
        </Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid 
            rows={data} 
            columns={columns} 
            getRowId={(row) => row.usuario_id}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default ModalTable;