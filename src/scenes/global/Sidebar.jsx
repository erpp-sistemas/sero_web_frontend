import React from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { getMenusUserId } from '../../services/menu.service';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrafficIcon from '@mui/icons-material/Traffic';
import PublicIcon from '@mui/icons-material/Public';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import StorageIcon from '@mui/icons-material/Storage';
import StreetviewIcon from '@mui/icons-material/Streetview';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

import InsightsIcon from '@mui/icons-material/Insights';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SubjectIcon from '@mui/icons-material/Subject';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ListIcon from '@mui/icons-material/List';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import QuizIcon from '@mui/icons-material/Quiz';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useDispatch } from 'react-redux';
import { setUser, logoutUser } from '../../features/user/userSlice'
import HomeIcon from '@mui/icons-material/Home';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import * as MUIIcons from "@mui/icons-material";
const iconsMap = {
  "Home": <HomeIcon />,
  "DashboardIcon": <DashboardIcon />,
  "TrafficIcon": <TrafficIcon />,
  "PublicIcon": <PublicIcon />,
  "DocumentScannerIcon": <DocumentScannerIcon />,
  "StorageIcon": <StorageIcon />,
  "StreetviewIcon": <StreetviewIcon />,
  "TravelExploreIcon": <TravelExploreIcon />,
  "SettingsSuggestIcon": <SettingsSuggestIcon />,
  "LibraryBooksIcon": <LibraryBooksIcon />,
  "PictureAsPdfIcon": <PictureAsPdfIcon />,
  "ContactPhoneIcon": <ContactPhoneIcon />,

  "InsightsIcon": <InsightsIcon />,
  "AutoGraphIcon": <AutoGraphIcon />,
  "QueryStatsIcon": <QueryStatsIcon />,
  "SubjectIcon": <SubjectIcon />,
  "RequestQuoteIcon": <RequestQuoteIcon />,
  "CurrencyExchangeIcon": <CurrencyExchangeIcon />,
  "CloudSyncIcon": <CloudSyncIcon />,
  "FilterAltIcon": <FilterAltIcon />,
  "WaterfallChartIcon": <WaterfallChartIcon />,
  "ContactEmergencyIcon": <ContactEmergencyIcon />,
  "PersonSearchIcon": <PersonSearchIcon />,
  "LocationCityIcon": <LocationCityIcon />,
  "HomeRepairServiceIcon": <HomeRepairServiceIcon />,
  "AccountTreeIcon": <AccountTreeIcon />,
  "ListIcon": <ListIcon />,
  "WorkspacePremiumIcon": <WorkspacePremiumIcon />,
  "QuizIcon": <QuizIcon />,
  "PriceCheckIcon": <PriceCheckIcon />,
  "PlaylistAddCheckIcon": <PlaylistAddCheckIcon />,
  "SensorOccupiedIcon": <SensorOccupiedIcon />,
  "PriceChangeIcon": <PriceChangeIcon />,
  "ScreenSearchDesktopIcon": <ScreenSearchDesktopIcon/>
};

const Item = ({ title, to, icon, selected, setSelected, color, isCollapsed = false }) => {

  const theme = useTheme();

  // Check if icon is a valid string and exists in MUIIcons
  const isValidIcon = typeof icon === 'string' && MUIIcons[icon];

  return (
    <>
      {isCollapsed ? (
        <Tooltip title={title} placement="right" arrow={true} >
          <MenuItem
            active={selected === title}
            style={{
              color: color
            }}
            onClick={() => setSelected(title)}
            icon={isValidIcon ? React.createElement(MUIIcons[icon]) : null}
          >
            <Typography>{title}</Typography>
            <Link to={to} />
          </MenuItem>
        </Tooltip>
      ) : (
        <MenuItem
          active={selected === title}
          style={{
            color: color
          }}
          onClick={() => setSelected(title)}
          icon={isValidIcon ? React.createElement(MUIIcons[icon]) : null}
        >
          <Typography>{title}</Typography>
          <Link to={to} />
        </MenuItem>
      )}
    </>


  );
};



const Sidebar = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [selected, setSelected] = React.useState("Dashboard");
  const user = useSelector(state => state.user)
  const [menus, setMenus] = React.useState([])
  const [menu, setMenu] = React.useState([])
  const [subMenu, setSubMenu] = React.useState([])
  const dispatch = useDispatch();
  //console.log(user)
  //const [user, setUser] = useState(null)

  React.useEffect(() => {
    screen.width <= 450 ? setIsCollapsed(true) : setIsCollapsed(false)

    async function loadMenus() {
      const res = await getMenusUserId(user.user_id)
      setMenus(res)
    }

    loadMenus()

  }, [])

  React.useEffect(() => {
    if (menus && menus.length > 0) {
      console.log(menus);
      const mainMenu = menus.filter((m) => m.parent_menu_id === 0);
      const subMenus = menus.filter((sm) => sm.parent_menu_id > 0);

      setMenu(mainMenu);
      setSubMenu(subMenus);
    }
  }, [menus]);

  

  const handleCerrarSesion = () => {

    Cookies.remove('token')
    dispatch(logoutUser());
    window.location.reload()
  }

  const menuWithSubmenus = menu.map((m) => {
    const relatedSubmenus = subMenu.filter((sm) => sm.parent_menu_id === m.menu_id);
    return {
      ...m,
      subMenu: relatedSubmenus,
    };
  });



  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#a4a9fc !important",
        },
        "& .pro-menu-item.active": {
          color: "#6EBE71 !important",
        },
        "height": "100%"
      }}
    >


      <ProSidebar collapsed={isCollapsed} >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <img src={theme.palette.mode === "dark" ? "sero_claro.png" : "sero-logo.png"} style={{ width: '150px' }} alt="" />
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>

            <Item
              title="Inicio"
              to="/home"
              icon={<HomeIcon />}
              selected={selected}
              setSelected={setSelected}
              color={colors.grey[100]}
              isCollapsed={isCollapsed}
            />

            {!menus && (
              <Item
                title="Menus not found"
                to="/login"
                icon={<SearchOffIcon />}
                selected={selected}
                setSelected={setSelected}
                color={colors.grey[100]}
                isCollapsed={isCollapsed}
              />
            )}

            {menuWithSubmenus.map((m) => (
              <div key={m.menu_id}>
                {!isCollapsed && (
                  <Typography
                    variant="h6"
                    color={colors.grey[400]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    {m.name}
                  </Typography>
                )}
                {m.subMenu.map((submenus) => (
                  <div key={submenus.menu_id}>
                    <Item
                      title={submenus.name}
                      to={submenus.route}
                      icon={submenus.icon_mui}
                      selected={selected}
                      setSelected={setSelected}
                      color={colors.grey[100]}
                      isCollapsed={isCollapsed}
                    />

                  </div>
                ))

                }

              </div>
            ))

            }

            <MenuItem
              style={{
                color: colors.redAccent[500],
                marginTop: '20px'
              }}
              onClick={handleCerrarSesion}
              icon={<LogoutIcon />}
            >
              <Typography>Cerrar sesión</Typography>
            </MenuItem>

          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
