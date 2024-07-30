import { useState } from 'react'
import { IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import DrawerNotification from '../../components/DrawerNotification'
import { useLocation } from "react-router-dom";
import DialogUI from '../../components/MaterialUI/Dialog'
import { useSelector } from 'react-redux'
import { getIcon } from '../../data/Icons';
import Apps from '../../components/Topbar/Apps'
import Profile from '../../components/Topbar/Profile'
import Badge from '@mui/material/Badge';

const Topbar = () => {

  const mapa_seleccionado = useSelector((state) => state.plaza_mapa)
  let location = useLocation()

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  return (
    <div className="h-16 flex justify-between items-center px-4 mb-4 z-50" style={{ backgroundColor: location.pathname === `/map/${mapa_seleccionado.place_id}` ? theme.palette.mode === 'dark' ? colors.primary[400] : '#F2F0F0' : null }}>

      <div className="flex items-center rounded gap-[10px]" style={{ backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : '#F2F0F0' }}>
        {location.pathname === `/map/${mapa_seleccionado.place_id}` && (
          <>
            {getIcon('LayersIcon', { fontSize: '36px' })}
            <p className="text-[22px]">
              Sistema de información geográfica
              <span style={{ marginLeft: '15px', color: theme.palette.mode === "dark" ? colors.greenAccent[400] : 'black', fontSize: '20px', fontWeight: 'bold' }}>
                {` ${mapa_seleccionado.name}`}
              </span>
            </p>
          </>
        )}
      </div>

      {/* ICONS */}
      <div className="flex gap-[10px]">
        {/* BOTON PARA CAMBIO DE TEMA */}
        <IconButton sx={{ width: '50px', height: '50px' }} onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            getIcon('LightModeOutlinedIcon', {})
          ) : (
            getIcon('DarkModeOutlinedIcon', {})
          )}
        </IconButton>

        {/* BOTON PARA VISUALIZAR LAS HERRAMIENTAS DEL MAPA */}
        {location.pathname === `/map/${mapa_seleccionado.id_campana}` && (
          <DialogUI id_campana={mapa_seleccionado.id_campana} />
        )}

        {/* BOTON  PARA LAS HERRAMIENTAS COMO MAPA O WHATSAPP  */}
        <Apps />

        {/* BOTON PARA LAS NOTIFICACIONES */}
        {/* <DrawerNotification state={state} toggleDrawer={toggleDrawer}  /> */}
        <Badge badgeContent={2} color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
          sx={{ '& .MuiBadge-badge': { top: '15%', right: '25%', transform: 'translate(50%, -50%)', }, }} >
          <IconButton sx={{ width: '50px', height: '50px' }} onClick={toggleDrawer('right', true)} >
            {getIcon('NotificationsOutlinedIcon', {})}
          </IconButton>
        </Badge>

        {/* BOTON PARA EL PERFIL */}
        <Profile />

        
      </div>

    </div>
  );
};

export default Topbar;
