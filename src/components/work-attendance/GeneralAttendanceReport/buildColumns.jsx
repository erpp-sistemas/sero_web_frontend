import React, { useMemo } from 'react';
import { AccessTime, AccessTimeRounded, Apartment, CalendarMonth, Dangerous, EditRoad, InsertEmoticon, Padding, PersonPinCircle, SentimentVeryDissatisfied, SentimentVeryDissatisfiedOutlined, WarningAmber } from "@mui/icons-material";
import Viewer from "react-viewer";
import { useTheme, Box, Grid, Typography, Avatar, Chip } from "@mui/material";

function buildColumns() {

  const AvatarImage = ({ data }) => {
    const [visibleAvatar, setVisibleAvatar] = React.useState(false)

    return (
      <>
        <Avatar
          onClick={() => {
          setVisibleAvatar(true)
          }}
          alt="Remy Sharp"
          src={data}
        />
      
        <Viewer
          visible={visibleAvatar}
          onClose={() => {
          setVisibleAvatar(false)
          }}
          images={[{ src: data, alt: 'avatar' }]}          
        />
      </>
    )

  }
  
  return useMemo(() => [   
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
      width: 140,
      renderCell: (params) => (
      <>
        {params.value}
        <CalendarMonth style={{ marginLeft: '5px' }} />
      </>
      ),
    },
    { 
      field: 'hora_entrada_sistema',
      renderHeader: () => (
      <strong style={{ color: "#5EBFFF" }}>{"HORA DE ENTRADA SISTEMA"}</strong>
      ),
      width: 190,
      renderCell: (params) => (
      <>
        {params.value}
        <AccessTime style={{ marginLeft: '5px' }} />
      </>
      ),
    },
    { 
      field: 'hora_entrada',
      renderHeader: () => (
      <strong style={{ color: "#5EBFFF" }}>{"HORA DE ENTRADA"}</strong>
      ),
      width: 140,
      renderCell: (params) => (
      <>
        {params.value}
        <AccessTime style={{ marginLeft: '5px' }} />
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
        icon = <InsertEmoticon/>;
        chipColor = 'success';
        chipLabel = 'Asistencia correcta';
        break;
        case 'Retardo':
        icon = <WarningAmber/>;
        chipColor = 'warning';
        chipLabel = 'Retardo';
        break;
        case 'Falta':
        icon = <Dangerous/>;
        chipColor = 'error';
        chipLabel = 'Falta';
        break;
        case 'Dia incompleto':
        icon = <SentimentVeryDissatisfied/>;
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
        icon = <EditRoad/>;
        chipColor = 'warning';
        chipLabel = 'Campo';
        break;
        case 'Corporativo':
        icon = <Apartment/>;
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
      <PersonPinCircle 
        style={{ cursor: 'pointer', color: 'lightblue', fontSize: 40 }} 
        onClick={() => {
        window.open(params.value, '_blank');
        }}
      />
      ),
    },
    { 
      field: 'hora_salida_sistema',
      renderHeader: () => (
      <strong style={{ color: "#5EBFFF" }}>{"HORA DE SALIDA SISTEMA"}</strong>
      ),
      width: 190,
      renderCell: (params) => (
      <>
        {params.value}
        <AccessTimeRounded style={{ marginLeft: '5px' }} />
      </>
      ),
    },
    { 
      field: 'hora_salida',
      renderHeader: () => (
      <strong style={{ color: "#5EBFFF" }}>{"HORA DE SALIDA"}</strong>
      ),
      width: 120,
      renderCell: (params) => (
      <>
        {params.value}
        <AccessTimeRounded style={{ marginLeft: '5px' }} />
      </>
      ),
    },
    { 
      field: 'estatus_salida',
      renderHeader: () => (
      <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE SALIDA"}</strong>
      ),
      width: 160,
      renderCell: (params) => {
      let icon = null;
      let chipColor = 'primary';
      let chipLabel = '';
      switch (params.row.estatus_salida) {
        case 'Asistencia correcta':
        icon = <InsertEmoticon/>;
        chipColor = 'success';
        chipLabel = 'Asistencia correcta';
        break;
        case 'Retardo':
        icon = <WarningAmber/>;
        chipColor = 'warning';
        chipLabel = 'Retardo';
        break;
        case 'Falta':
        icon = <Dangerous/>;
        chipColor = 'error';
        chipLabel = 'Falta';
        break;
        case 'Dia incompleto':
        icon = <SentimentVeryDissatisfiedOutlined/>;
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
      field: 'estatus_punto_salida',
      renderHeader: () => (
      <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DE PUNTO DE SALIDA"}</strong>
      ),
      width: 200,
      renderCell: (params) => {
      let icon = null;
      let chipColor = 'primary';
      let chipLabel = '';
      switch (params.row.estatus_punto_salida) {
        case 'Campo':
        icon = <EditRoad/>;
        chipColor = 'warning';
        chipLabel = 'Campo';
        break;
        case 'Corporativo':
        icon = <Apartment/>;
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
      <PersonPinCircle 
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
        <AccessTime style={{ marginLeft: '5px' }} />
      </>
      ),
    },
    { 
      field: 'lugar_entrada_comida',
      renderHeader: () => (
      <strong style={{ color: "#5EBFFF" }}>{"LUGAR DE ENTRADA DE COMIDA"}</strong>
      ),
      width: 210,
      renderCell: (params) => (
      <PersonPinCircle 
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
        <AccessTime style={{ marginLeft: '5px' }} />
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
      <PersonPinCircle 
        style={{ cursor: 'pointer', color: 'lightblue', fontSize: 40 }} 
        onClick={() => {
        window.open(params.value, '_blank');
        }}
      />
      ),
    },
  ], []);
}

export default buildColumns;