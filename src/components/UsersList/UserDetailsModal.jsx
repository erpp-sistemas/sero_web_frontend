import React from 'react';
import { Dialog, DialogContent, Typography, Avatar, Divider, Chip } from '@mui/material';
import { EventOutlined, PhoneOutlined, PhoneCallbackOutlined, CheckCircleOutline, ComputerOutlined, PhoneAndroidOutlined, AccountCircleOutlined, WorkOutlineOutlined, PeopleAltOutlined, MenuBookOutlined, Man, Woman, Wc } from '@mui/icons-material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListSubheader from '@mui/material/ListSubheader';
import ImageIcon from '@mui/icons-material/Image';
import { green, pink, lightBlue, blue } from '@mui/material/colors';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const avatarStyle = {
  width: 100,
  height: 100,
  margin: 'auto',
};

const titleStyle = {
  color: '#5EBFFF',  
};

const labelStyle = {
  fontWeight: 'bold',
  color: '#5EBFFF',
};

const UserDetailsModal = ({ open, onClose, user }) => {
  if (!user) return null;

  const fullName = `${user.name} ${user.last_name} ${user.second_last_name}`;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <ListItem>
            <Avatar src={user.url_image} alt="Foto de usuario" sx={{ bgcolor: 'transparent', border: '2px solid #5EBFFF' }} style={avatarStyle}>
            </Avatar>
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: '#5EBFFF' }} />
        <List sx={{ width: '100%', bgcolor: 'background.paper' }} subheader={<ListSubheader sx={titleStyle}>Informacion General</ListSubheader>}>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <AccountCircleOutlined/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Nombre' secondary={fullName} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <EventOutlined/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Fecha de Nacimiento' secondary={new Date(user.birthdate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: user.sex === 'masculino' ? blue[500] : pink[500] }}>
              {user.sex === 'masculino' ? <Man /> : <Woman />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Genero' secondary={user.sex} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <PhoneOutlined/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Telefono Personal' secondary={user.personal_phone} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <PhoneCallbackOutlined/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Telefono de Trabajo' secondary={user.work_phone} />
          </ListItem>          
        </List>
        <Divider sx={{ backgroundColor: '#5EBFFF' }} />
        <List sx={{ width: '100%', bgcolor: 'background.paper' }} subheader={<ListSubheader sx={titleStyle}>Estatus de Acceso</ListSubheader>}>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: user.active_web_access === 'acceso permitido' ? green[500] : pink[500] }}>
                <ComputerOutlined/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Acceso Web' secondary={user.active_web_access} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: user.active_app_movil_access === 'acceso permitido' ? green[500] : pink[500] }}>
                <PhoneAndroidOutlined/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Acceso App Movil' secondary={user.active_app_movil_access} />
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: '#5EBFFF' }} />
        <List sx={{ width: '100%', bgcolor: 'background.paper' }} subheader={<ListSubheader sx={titleStyle}>Datos de Acceso al Sistema</ListSubheader>}>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <AlternateEmailIcon/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Nombre de usuario' secondary={user.user_name} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <LockOpenIcon/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Contraseña' secondary={user.password} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <WorkOutlineOutlined/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Perfil' secondary={user.profile} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <MenuBookOutlined/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Version de la App movil instalada' secondary={user.app_version} />
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: '#5EBFFF' }} />
        <List sx={{ width: '100%', bgcolor: 'background.paper' }} subheader={<ListSubheader sx={titleStyle}>Permisos Asignados</ListSubheader>}>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>
                <PeopleAltOutlined/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Plazas Asignadas' secondary={user.assigned_places} />
          </ListItem>
        </List>


      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
