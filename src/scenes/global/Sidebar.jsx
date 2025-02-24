import React, { useState, useRef, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  Typography,
  Tooltip,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { getMenusUserId } from "../../services/menu.service";
import { useSelector } from "react-redux";
import { tokens } from "../../theme";
import { useNavigate, Link, useLocation } from "react-router-dom";
import * as MUIIcons from "@mui/icons-material";

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const sidebarRef = useRef(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsCollapsed(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function loadMenus() {
      const res = await getMenusUserId(user.user_id);
      setMenus(res);
    }
    loadMenus();
  }, [user.user_id]);

  useEffect(() => {
    const savedSelectedMenu = localStorage.getItem("selectedMenu");
    if (savedSelectedMenu) {
      setSelectedMenu(JSON.parse(savedSelectedMenu));
    }
  }, []);

  const transformMenuData = (menus) => {
    const result = {};
    const sectionMap = new Map();
  
    // Ordenar los menús padres por la propiedad 'orden'
    const sortedMenus = menus.filter(menu => menu.parent_menu_id === 0)
                             .sort((a, b) => a.orden - b.orden);
  
    sortedMenus.forEach((menu) => {
      sectionMap.set(menu.menu_id, menu.name);
      result[menu.name] = {
        icon: menu.icon_mui || "DefaultIcon",
        orden: menu.orden || 0,
        items: [],
      };
    });
  
    menus.forEach((menu) => {
      if (menu.parent_menu_id !== 0) {
        const sectionName = sectionMap.get(menu.parent_menu_id);
        if (sectionName) {
          result[sectionName].items.push({
            section: sectionName,
            id_menu: menu.menu_id,
            id_menu_parent: menu.parent_menu_id,
            name: menu.name,
            icon: menu.icon_mui || "DefaultIcon",
            route: menu.route || "#",
            is_active: true,
            submenus: [],
          });
        }
      }
    });
  
    return result;
  };

  const menuTree = transformMenuData(menus);  

  const renderIcon = (iconName) => {
    const IconComponent = MUIIcons[iconName] || MUIIcons.LocationOn;
    return <IconComponent />;
  };

  const isActiveMenu = (route) => {
    return location.pathname === route
      ? "bg-gray-500 dark:bg-gray-600 "
      : "";
  };

  const handleMenuItemClick = (event, route, menuItem) => {
    event.preventDefault(); // Prevent page reload
    setSelectedMenu(menuItem.id_menu);
    localStorage.setItem("selectedMenu", JSON.stringify(menuItem.id_menu));
    navigate(route);
  };

  const handleSectionClick = (sectionName) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [sectionName]: !prevState[sectionName],
    }));
  };

  const handleLogoClick = () => {
    setSelectedMenu(null);
    localStorage.removeItem("selectedMenu");
    navigate("/home");
  };

  return (
    <Box
      sx={{
        width: "100px",
        display: { xs: "none", md: "flex" },
      }}
    >
      <Box
        ref={sidebarRef}
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
          height: "100%",
          display: { xs: "none", md: "inline" },
          position: "fixed",
          zIndex: "9998",
          "& .pro-submenu": {
            backgroundColor: "transparent !important",
            boxShadow: "none !important",
            border: "none !important",
          },
          "& .pro-submenu:hover": {
            backgroundColor: "transparent !important",
          },
          "& .pro-submenu .pro-inner-item": {
            backgroundColor: "transparent !important",
          },
          "& .pro-submenu .pro-inner-item:hover": {
            backgroundColor: "transparent !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "0px 0 20px 0",
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
                  <img
                    src={
                      theme.palette.mode === "dark"
                        ? "sero_claro.png"
                        : "sero-logo.png"
                    }
                    style={{ width: "150px" }}
                    alt="Logo"
                    onClick={handleLogoClick}
                  />
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            <List>
              {Object.keys(menuTree).map((sectionName) => (
                <React.Fragment key={sectionName}>
                  <ListItem
                    button
                    onClick={() => handleSectionClick(sectionName)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip
                      title={isCollapsed ? sectionName : ""}
                      placement="right"
                    >
                      <ListItemIcon sx={{ color: colors.accentGreen[100] }}>
                        {renderIcon(menuTree[sectionName].icon)}
                      </ListItemIcon>
                    </Tooltip>
                    {!isCollapsed && (
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: colors.accentGreen[100],
                          fontSize: "0.675rem", // Ajusta el tamaño de la fuente aquí
                          flexGrow: 5,
                          textAlign: "left",
                        }}
                      >
                        {sectionName}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        marginLeft: isCollapsed ? "-20px" : "0",
                      }}
                    >
                      {openSections[sectionName] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </Box>
                  </ListItem>
                  <Collapse
                    in={openSections[sectionName]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {menuTree[sectionName].items.map((menuItem, index) => (
                        <React.Fragment key={menuItem.id_menu}>
                          <ListItem
                            button
                            className={`${isActiveMenu(menuItem.route)} ${
                              selectedMenu === menuItem.id_menu
                                ? "selected"
                                : ""
                            }`}
                            onClick={(e) =>
                              handleMenuItemClick(e, menuItem.route, menuItem)
                            }
                            sx={{
                              pl: 4,
                              backgroundColor:
                                selectedMenu === menuItem.id_menu
                                  ? colors.accentGreen[100]
                                  : "transparent",
                              "&:hover": {
                                borderRadius: "35px",
                                backgroundColor: colors.primary[500],
                              },
                              "&.selected": {
                                backgroundColor: colors.accentGreen[100],
                                borderRadius: "35px",
                                "& .MuiListItemIcon-root": {
                                  color: "black",
                                },
                                "& .MuiListItemText-root": {
                                  color: "black",
                                },
                              },
                            }}
                          >
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Tooltip
                                title={isCollapsed ? menuItem.name : ""}
                                placement="right"
                              >
                                <ListItemIcon
                                  sx={{
                                    color:
                                      selectedMenu === menuItem.id_menu
                                        ? "black"
                                        : colors.accentGreen[100],
                                  }}
                                >
                                  {renderIcon(menuItem.icon)}
                                </ListItemIcon>
                              </Tooltip>
                            </Box>
                            {!isCollapsed && (
                              <ListItemText
                                primary={menuItem.name}
                                sx={{
                                  color:
                                    selectedMenu === menuItem.id_menu
                                      ? "black"
                                      : "inherit",
                                }}
                              />
                            )}
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </Menu>
        </ProSidebar>
      </Box>

      {/* SpeedDial for mobile view */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" }, // solo se muestra en celulares
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: "9999",
        }}
      >
        <SpeedDial
          ariaLabel="SpeedDial menu"
          icon={<SpeedDialIcon />}
          onClose={() => setOpenSpeedDial(false)}
          onOpen={() => setOpenSpeedDial(true)}
          open={openSpeedDial}
        >
          {Object.keys(menuTree).reduce((actions, sectionName) => {
  actions.push(
    <SpeedDialAction
      key={`parent-${sectionName}`}
      icon={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {renderIcon(menuTree[sectionName].icon)}
          {menuTree[sectionName].items.length > 0 && (
            openSections[sectionName] ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )
          )}
        </Box>
      }
      tooltipTitle={sectionName}
      onClick={() => handleSectionClick(sectionName)}
    />
  );
  if (openSections[sectionName]) {
    menuTree[sectionName].items.forEach((menuItem) => {
      const childIconColor =
        selectedMenu === menuItem.id_menu ? "black" : colors.accentGreen[100];
      actions.push(
        <SpeedDialAction
          key={`child-${menuItem.id_menu}`}
          icon={
            <Box sx={{ color: childIconColor }}>
              {renderIcon(menuItem.icon)}
            </Box>
          }
          FabProps={{
            sx: {
              bgcolor: selectedMenu === menuItem.id_menu ? colors.accentGreen[100] : "inherit",
            },
          }}
          tooltipTitle={menuItem.name}
          onClick={() =>
            handleMenuItemClick(
              { preventDefault: () => {} },
              menuItem.route,
              menuItem
            )
          }
        />
      );
    });
  }
  return actions;
}, [])}
        </SpeedDial>
      </Box>
    </Box>
  );
};

export default Sidebar;