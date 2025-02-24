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
  SpeedDialIcon,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Fab,
  Button,
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
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const sidebarRef = useRef(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Ajusta el breakpoint según sea necesario

  console.log("isMobile:", isMobile);

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
    const sortedMenus = menus
      .filter((menu) => menu.parent_menu_id === 0)
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
    return location.pathname === route ? "bg-gray-500 dark:bg-gray-600 " : "";
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

  const handleSectionMobileClick = (sectionName) => {
    setCurrentSection(sectionName);
  };

  const handleLogoClick = () => {
    setSelectedMenu(null);
    localStorage.removeItem("selectedMenu");
    navigate("/home");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSection(null);
  };

  return (
    <Box
      sx={{
        width: { xs: "0%", md: "100px" }, // Ajusta el ancho según el tamaño de la pantalla
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

      {/* Vista móvil: botón FAB que abre un diálogo con menú en cuadrícula */}
      {isMobile && (
        <>
          <Fab
            onClick={handleOpenDialog}
            sx={{
              position: "fixed",
              backgroundColor: colors.accentGreen[100],
              bottom: 16,
              right: 16,
              zIndex: 9999999,
            }}
          >
            <SpeedDialIcon />
          </Fab>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle
              sx={{
                backgroundColor: colors.primary[600],
                color: colors.accentGreen[100],
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {currentSection ? (
                <IconButton onClick={() => setCurrentSection(null)}>
                  <MUIIcons.ArrowBack sx={{ color: colors.accentGreen[100] }} />
                </IconButton>
              ) : (
                "Menú"
              )}
            </DialogTitle>
            <DialogContent
              sx={{
                backgroundColor: colors.primary[400],
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box sx={{ paddingTop: "16px" }}>
                <Grid container spacing={2} justifyContent="center">
                  {currentSection
                    ? menuTree[currentSection].items.map((menuItem) => (
                        <Grid item xs={6} key={menuItem.id_menu}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                          >
                            <Tooltip title={menuItem.name} placement="top">
                              <Fab
                                onClick={() => {
                                  handleMenuItemClick(
                                    { preventDefault: () => {} },
                                    menuItem.route,
                                    menuItem
                                  );
                                  handleCloseDialog();
                                }}
                                sx={{
                                  backgroundColor:
                                    selectedMenu === menuItem.id_menu
                                      ? colors.accentGreen[100]
                                      : "transparent",
                                  color:
                                    selectedMenu === menuItem.id_menu
                                      ? "black"
                                      : colors.accentGreen[100],
                                  "& .MuiListItemIcon-root": {
                                    color: colors.accentGreen[100],
                                  },
                                  "&:hover": {
                                    backgroundColor: colors.primary[500],
                                  },
                                }}
                              >
                                {renderIcon(menuItem.icon)}
                              </Fab>
                            </Tooltip>
                            <Typography
                              variant="caption"
                              display="block"
                              align="center"
                              sx={{
                                color: colors.accentGreen[100],
                                fontWeight: "bold",
                              }}
                            >
                              {menuItem.name}
                            </Typography>
                          </Box>
                        </Grid>
                      ))
                    : Object.keys(menuTree).map((sectionName) => (
                        <Grid item xs={6} key={sectionName}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                          >
                            <Tooltip title={sectionName} placement="top">
                              <Fab
                                color="primary"
                                onClick={() =>
                                  handleSectionMobileClick(sectionName)
                                }
                                sx={{
                                  backgroundColor: colors.accentGreen[100],
                                  color: "black", // Cambiar el color de los íconos a negro
                                }}
                              >
                                {renderIcon(menuTree[sectionName].icon)}
                              </Fab>
                            </Tooltip>
                            <Typography
                              variant="caption"
                              display="block"
                              align="center"
                              sx={{
                                color: colors.accentGreen[100],
                                fontWeight: "bold",
                              }}
                            >
                              {sectionName}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                </Grid>
              </Box>
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Sidebar;
