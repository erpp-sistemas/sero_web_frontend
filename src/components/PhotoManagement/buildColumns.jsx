import React, { useMemo } from 'react';
import { AccessTime, AccessTimeRounded, Apartment, CalendarMonth, CalendarToday, Dangerous, DoneAll, EditRoad, InsertEmoticon, LocationOff, MarkEmailRead, NotListedLocation, PersonPinCircle, ReceiptLong, SentimentVeryDissatisfied, SentimentVeryDissatisfiedOutlined, WarningAmber, WrongLocation } from "@mui/icons-material";
import Viewer from "react-viewer";
import { Avatar, Box, Chip, Typography, useTheme, Card, CardMedia } from "@mui/material";
import { tokens } from "../../theme";

function buildColumns({ handleOpenModal }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
  
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
      };      

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
        field: 'cuenta',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"CUENTA"}</strong>
        ),
        width: 150,
        editable: false,
      },
      { 
        field: 'propietario',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"PROPIETARIO"}</strong>
        ),
        width: 300,
        editable: false,
      },
      { 
        field: 'calle',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"CALLE"}</strong>
        ),
        width: 300,
        editable: false,
      },
      { 
        field: 'num_ext',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"NUM EXT"}</strong>
        ),
        width: 150,
        editable: false,
      },
      { 
        field: 'num_int',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"NUM INT"}</strong>
        ),
        width: 150,
        editable: false,
      },
      { 
        field: 'colonia',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"COLONIA"}</strong>
        ),
        width: 150,
        editable: false,
      },
      { 
        field: 'codigo_postal',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"CODIGO POSTAL"}</strong>
        ),
        width: 150,
        editable: false,
      },
      { 
        field: 'tarea_gestionada',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"TAREA GESTIONADA"}</strong>
        ),
        width: 200,
        editable: false,
        renderCell: (params) => {
          let color;
          let icon;
  
          if (params.value === '1ra Carta Invitación') {
            color = 'secondary';
            icon = <MarkEmailRead sx={{ color: 'secondary' }} />;
          } else if (params.value === '2da Carta Invitación') {
            color = 'warning';
            icon = <MarkEmailRead sx={{ color: 'warning' }} />;
          } else if (params.value === '3ra Carta Invitación') {
            color = 'warning';
            icon = <MarkEmailRead sx={{ color: 'warning' }} />;
          } else if (params.value === '4ta Carta Invitación') {
            color = 'error';
            icon = <MarkEmailRead sx={{ color: 'error' }} />;
          } else {
            color = 'info';
            icon = <ReceiptLong sx={{ color: 'info' }} />;
          }
  
          return (
            <Chip
              icon={icon}
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
        field: 'nombre_gestor',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"NOMBRE DE GESTOR"}</strong>
        ),
        width: 290,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', p: '2px' }}>
            <AvatarImage data={params.row.foto} />
            <Typography variant="h6" sx={{ marginLeft: 1 }}>{params.value}</Typography>
          </Box>
        )
      },
      { 
        field: 'fecha_gestion',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FECHA DE GESTION"}</strong>
        ),
        width: 210,
        editable: false,
        renderCell: (params) => (
          <Chip
            icon={<CalendarToday />}
            label={
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                {formatDate(params.value)}
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
        field: 'estatus_predio',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"ESTATUS DEL PREDIO"}</strong>
        ),
        width: 200,
        editable: false,
        renderCell: (params) => {
          let color;
          let icon;
  
          if (params.value === 'Predio localizado') {
            color = 'secondary';
            icon = <DoneAll sx={{ color: 'secondary' }} />;
          } else if (params.value === 'Predio baldío') {
            color = 'info';
            icon = <WrongLocation sx={{ color: 'info' }} />;
          } else if (params.value === 'Predio abandonado') {
            color = 'warning';
            icon = <NotListedLocation sx={{ color: 'warning' }} />;            
          } else if (params.value === 'Predio no localizado') {
            color = 'error';
            icon = <LocationOff sx={{ color: 'error' }} />;
          } else {
            color = 'success';
            icon = <ReceiptLong sx={{ color: 'success' }} />;
          }
  
          return (
            <Chip
              icon={icon}
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
        field: 'proceso',
        renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"PROCESO"}</strong>
        ),
        width: 200,
        editable: false,
        renderCell: (params) => {
          let color;
          let icon;
  
          if (params.value === 'carta_invitacion') {
            color = 'secondary';
            icon = <MarkEmailRead sx={{ color: 'secondary' }} />;
          } else if (params.value === 'cortes') {
            color = 'info';
            icon = <WaterDrop sx={{ color: 'info' }} />;
          } else if (params.value === 'ejecucion_fiscal') {
            color = 'warning';
            icon = <Balance sx={{ color: 'warning' }} />;            
          } else {
            color = 'info';
            icon = <ReceiptLong sx={{ color: 'info' }} />;
          }
  
          return (
            <Chip
              icon={icon}
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
        field: 'foto_fachada_1',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FOTO FACHADA 1"}</strong>
        ),
        width: 150,
        renderCell: (params) => (
          params.row.foto_fachada_1 ? (
            <Card 
              sx={{ 
                maxWidth: 150,
                height: '100%', 
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #5EBFFF',
                overflow: 'hidden'
              }}
            >
              <CardMedia
               component="img"
               height="100%"
               image={params.row.foto_fachada_1}
               alt="Foto fachada 1"
               sx={{ 
                 objectFit: 'cover'
               }}
               onClick={() => handleOpenModal({                  
                cuenta: params.row.cuenta,
                id_registro: params.row.id_registro,
                id_registro_foto: params.row.id_foto_fachada_1,
                foto: params.row.foto_fachada_1,
                tarea_gestionada: params.row.tarea_gestionada,
                nombre_gestor: params.row.nombre_gestor,
                fecha_gestion: params.row.fecha_gestion,
                proceso: params.row.proceso,
                tipo: params.row.tipo_foto_fachada_1,
                num_foto: 1,
                celda: 'foto_fachada_1'
              })}
              />                
            </Card>
          ) : (
            <Typography>No disponible</Typography>
          )
        )
      },
      { 
        field: 'foto_fachada_2',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FOTO FACHADA 2"}</strong>
        ),
        width: 150,
        renderCell: (params) => (
          params.row.foto_fachada_2 ? (
            <Card 
              sx={{ 
                maxWidth: 150,
                height: '100%', 
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #5EBFFF',
                overflow: 'hidden'
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={params.row.foto_fachada_2}
                alt="Foto fachada 2"
                sx={{ 
                  objectFit: 'cover'
                }}
                onClick={() => handleOpenModal({                    
                  cuenta: params.row.cuenta,
                  id_registro: params.row.id_registro,
                  id_registro_foto: params.row.id_foto_fachada_2,
                  foto: params.row.foto_fachada_2,
                  tarea_gestionada: params.row.tarea_gestionada,
                  nombre_gestor: params.row.nombre_gestor,
                  fecha_gestion: params.row.fecha_gestion,
                  proceso: params.row.proceso,
                  tipo: params.row.tipo_foto_fachada_2,
                  num_foto: 2,
                  celda: 'foto_fachada_2'
                })}
              />                
            </Card>
          ) : (
            <Typography>No disponible</Typography>
          )
        )
      },
      { 
        field: 'foto_evidencia_1',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FOTO EVIDENCIA 1"}</strong>
        ),
        width: 150,
        renderCell: (params) => (
          params.row.foto_evidencia_1 ? (
            <Card 
              sx={{ 
                maxWidth: 150,
                height: '100%', 
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #5EBFFF',
                overflow: 'hidden'
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={params.row.foto_evidencia_1}
                alt="Foto evidencia 1"
                sx={{ 
                  objectFit: 'cover'
                }}
                onClick={() => handleOpenModal({                    
                  cuenta: params.row.cuenta,
                  id_registro: params.row.id_registro,
                  id_registro_foto: params.row.id_foto_evidencia_1,
                  foto: params.row.foto_evidencia_1,
                  tarea_gestionada: params.row.tarea_gestionada,
                  nombre_gestor: params.row.nombre_gestor,
                  fecha_gestion: params.row.fecha_gestion,
                  proceso: params.row.proceso,
                  tipo: params.row.tipo_foto_evidencia_1,
                  num_foto: 1,
                  celda: 'foto_evidencia_1'
                })}
              />                
            </Card>
          ) : (
            <Typography>No disponible</Typography>
          )
        )
      },
      { 
        field: 'foto_evidencia_2',
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"FOTO EVIDENCIA 2"}</strong>
        ),
        width: 150,
        renderCell: (params) => (
          params.row.foto_evidencia_2 ? (
            <Card 
              sx={{ 
                maxWidth: 150,
                height: '100%', 
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #5EBFFF',
                overflow: 'hidden'
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={params.row.foto_evidencia_2}
                alt="Foto evidencia 2"
                sx={{ 
                  objectFit: 'cover'
                }}
                onClick={() => handleOpenModal({                    
                  cuenta: params.row.cuenta,
                  id_registro: params.row.id_registro,
                  id_registro_foto: params.row.id_foto_evidencia_2,
                  foto: params.row.foto_evidencia_2,
                  tarea_gestionada: params.row.tarea_gestionada,
                  nombre_gestor: params.row.nombre_gestor,
                  fecha_gestion: params.row.fecha_gestion,
                  proceso: params.row.proceso,
                  tipo: params.row.tipo_foto_evidencia_2,
                  num_foto: 2,
                  celda: 'foto_evidencia_2'
                })}
              />                
            </Card>
          ) : (
            <Typography>No disponible</Typography>
          )
        )
      },
  ], []);
}

export default buildColumns;