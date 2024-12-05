import React from "react";
import {
  Dialog,
  DialogContent,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import {
  EventOutlined,
  PhoneOutlined,
  PhoneCallbackOutlined,
  ComputerOutlined,
  PhoneAndroidOutlined,
  AccountCircleOutlined,
  WorkOutlineOutlined,
  PeopleAltOutlined,
  MenuBookOutlined,
  Man,
  Woman,
  Wc,
} from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListSubheader from "@mui/material/ListSubheader";
import { green, pink, lightBlue, blue } from "@mui/material/colors";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { tokens } from "../../theme";

const avatarStyle = {
  width: 100,
  height: 100,
  margin: "auto",
};

const UserDetailsModal = ({ open, onClose, user }) => {
  if (!user) return null;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fullName = `${user.name} ${user.first_last_name} ${user.second_last_name}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          border: `2px solid ${colors.accentGreen[100]}`,
        },
      }}
    >
      <DialogContent>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <Avatar
              src={user.url_image}
              alt="Foto de usuario"
              sx={{
                bgcolor: "transparent",
                border: `2px solid ${colors.accentGreen[100]}`,
              }}
              style={avatarStyle}
            ></Avatar>
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={
            <ListSubheader
              sx={{
                color: colors.accentGreen[100],
                fontWeight: "bold",
              }}
            >
              Informacion General
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.accentGreen[100] }}>
                <AccountCircleOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Nombre" secondary={fullName} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.accentGreen[100] }}>
                <EventOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Fecha de Nacimiento"
              secondary={new Date(user.birthdate).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: user.sex === "masculino" ? blue[500] : pink[500],
                }}
              >
                {user.sex === "masculino" ? <Man /> : <Woman />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Genero" secondary={user.sex} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.accentGreen[100] }}>
                <PhoneOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Telefono Personal"
              secondary={user.personal_phone}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.accentGreen[100] }}>
                <PhoneCallbackOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Telefono de Trabajo"
              secondary={user.work_phone}
            />
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={
            <ListSubheader
              sx={{
                color: colors.accentGreen[100],
                fontWeight: "bold",
              }}
            >
              Estatus de Acceso
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor:
                    user.active_web_access === "acceso permitido"
                      ? colors.accentGreen[200]
                      : pink[500],
                }}
              >
                <ComputerOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Acceso Web"
              secondary={user.active_web_access}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor:
                    user.active_app_movil_access === "acceso permitido"
                    ? colors.accentGreen[200]
                      : pink[500],
                }}
              >
                <PhoneAndroidOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Acceso App Movil"
              secondary={user.active_app_movil_access}
            />
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={
            <ListSubheader
              sx={{
                color: colors.accentGreen[100],
                fontWeight: "bold",
              }}
            >
              Datos de Acceso al Sistema
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.accentGreen[100] }}>
                <AlternateEmailIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Nombre de usuario"
              secondary={user.user_name}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.accentGreen[100] }}>
                <LockOpenIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Contraseña" secondary={user.password} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.accentGreen[100] }}>
                <WorkOutlineOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Perfil" secondary={user.profile} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.accentGreen[100] }}>
                <MenuBookOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Version de la App movil instalada"
              secondary={user.app_version}
            />
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: colors.accentGreen[100]}} />
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={
            <ListSubheader 
              sx={{
                color: colors.accentGreen[100],
                fontWeight: "bold"
              }}>
                Permisos Asignados
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors.accentGreen[100] }}>
                <PeopleAltOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Plazas Asignadas"
              secondary={user.assigned_places}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
