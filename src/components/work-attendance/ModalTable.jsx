import React from 'react';
import { Modal, Box, Typography, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import DangerousIcon from '@mui/icons-material/Dangerous';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import Viewer from 'react-viewer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import IconButton from '@mui/material/IconButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PreviewIcon from '@mui/icons-material/Preview';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Divider from '@mui/material/Divider';
import ImageViewerModal from '../../components/ImageViewerModal.jsx'

const ModalTable = ({ open, onClose, data }) => {
    const columns = [
        { 
          field: 'user',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
          ),
          width: 210,
          editable: false,
        },
        { 
          field: 'url_image',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"FOTO"}</strong>
          ),
          width: 70,
          renderCell: (params) => <AvatarImage data={params.row.url_image} />,
        },
        { 
          field: 'place', 
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"PLAZA"}</strong>
          ),
          width: 120,
        },
        { 
          field: 'date_capture', 
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
          field: 'entry_time',
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
          field: 'entry_status',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE ENTRADA"}</strong>
          ),
          width: 200,
          renderCell: (params) => {
            let icon = null;
            let chipColor = 'primary';
            let chipLabel = '';
            switch (params.row.entry_status) {
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
          field: 'entry_point_status',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE PUNTO DE ENTRADA"}</strong>
          ),
          width: 200,
          renderCell: (params) => {
            let icon = null;
            let chipColor = 'primary';
            let chipLabel = '';
            switch (params.row.entry_point_status) {
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
          field: 'entry_attendance_place',
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
          field: 'exit_time',
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
          field: 'exit_status',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE SALIDA"}</strong>
          ),
          width: 150,
          renderCell: (params) => {
            let icon = null;
            let chipColor = 'primary';
            let chipLabel = '';
            switch (params.row.exit_status) {
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
          field: 'exit_point_status',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE PUNTO DE SALIDA"}</strong>
          ),
          width: 180,
          renderCell: (params) => {
            let icon = null;
            let chipColor = 'primary';
            let chipLabel = '';
            switch (params.row.exit_point_status) {
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
          field: 'exit_attendance_place',
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
            getRowId={(row) => row.user_id}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default ModalTable;