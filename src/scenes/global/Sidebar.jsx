import React from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, IconButton, Typography, useTheme, Tooltip } from "@mui/material"
import { Link } from "react-router-dom"
import "react-pro-sidebar/dist/css/styles.css"
import { tokens } from "../../theme"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import LogoutIcon from '@mui/icons-material/Logout'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { getMenusUserId } from '../../services/menu.service'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../features/user/userSlice'
import HomeIcon from '@mui/icons-material/Home'
import * as MUIIcons from "@mui/icons-material"
import PropTypes from 'prop-types'

const Item = ({ title, to, icon, selected, setSelected, color, isCollapsed = false }) => {

  const isValidIcon = typeof icon === 'string' && MUIIcons[icon]
	
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

	)

}

const Sidebar = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
	const [isCollapsed, setIsCollapsed] = React.useState(false)
	const [selected, setSelected] = React.useState("Dashboard")
	const user = useSelector(state => state.user)
	const [menus, setMenus] = React.useState([])
	const [menu, setMenu] = React.useState([])
	const [subMenu, setSubMenu] = React.useState([])
	const dispatch = useDispatch()

	React.useEffect(() => {
		screen.width <= 450 ? setIsCollapsed(true) : setIsCollapsed(false)
		async function loadMenus() {
			const res = await getMenusUserId(user.user_id)
			setMenus(res)
		}
		loadMenus()
	}, [user.user_id])

	React.useEffect(() => {
		if (menus && menus.length > 0) {
			const mainMenu = menus.filter((m) => m.parent_menu_id === 0)
			const subMenus = menus.filter((sm) => sm.parent_menu_id > 0)
			setMenu(mainMenu)
			setSubMenu(subMenus)
		}
	}, [menus])

	const handleCerrarSesion = () => {
		localStorage.removeItem('token')
		Cookies.remove('token')
		dispatch(logoutUser())
		window.location.reload()
	}

	const menuWithSubmenus = menu.map((m) => {
		const relatedSubmenus = subMenu.filter((sm) => sm.parent_menu_id === m.menu_id);
		return {
		...m,
		subMenu: relatedSubmenus,
		}
	})

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
				"height": "100%",
				display:{
					xs:'none',
					md:'inline',
				}
			}}
		>

			<ProSidebar collapsed={isCollapsed} >

				<Menu iconShape="square">

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

						{ menuWithSubmenus.map((m) => (

								<div key={m.menu_id}>

									{!isCollapsed && (
										<Typography variant="h6" color={colors.grey[400]} sx={{ m: "15px 0 5px 20px" }} >
											{m.name}
										</Typography>
									)}

									{
										
										m.subMenu.map((submenus) => ( 
					
											<Item
												key={submenus.menu_id}
												title={submenus.name}
												to={submenus.route}
												icon={submenus.icon_mui}
												selected={selected}
												setSelected={setSelected}
												color={colors.grey[100]}
												isCollapsed={isCollapsed}
											/>

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

	)

}

export default Sidebar

Item.propTypes = {
	title: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
	selected: PropTypes.string.isRequired,
	setSelected: PropTypes.func.isRequired,
	color: PropTypes.string.isRequired,
	isCollapsed: PropTypes.bool,
}