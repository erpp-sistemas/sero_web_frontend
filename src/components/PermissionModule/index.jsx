import React from "react"
import Container from "../Container"
import {
  Alert,
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material"
import { getAllMenus } from "../../api/menu"
import { getAllSubMenus } from "../../api/submenu"
import { getAllRoles } from "../../api/rol"
import {
  createMenuRol,
  createSubMenuRol,
  getMenuRolByIdRol,
  getSubMenuRolByIdRol,
  updateMenuRolById,
  updateSubMenuRolById,
} from "../../api/permission"
import CloseIcon from "@mui/icons-material/Close"
import { AddOutlined, Sync } from "@mui/icons-material"
import { PiTreeStructureFill } from "react-icons/pi"

function PermissionModule() {
	const [menus, setMenus] = React.useState([])
	const [subMenus, setSubMenus] = React.useState([])
	const [roles, setRoles] = React.useState([])
	const [selectedRole, setSelectedRole] = React.useState("")
	const [menuRols, setMenuRols] = React.useState([])
	const [subMenuRols, setSubMenuRols] = React.useState([])
	const [snackbar, setSnackbar] = React.useState(null)
	const [isNewMenuRolDialogOpen, setIsNewMenuRolDialogOpen] = React.useState(false)
	const [isNewSubMenuRolDialogOpen, setIsNewSubMenuRolDialogOpen] = React.useState(false)
	const [menuRolData, setMenuRolData] = React.useState({ id_menu: "", id_rol: "", activo: "" })
	const [subMenuRolData, setSubMenuRolData] = React.useState({ id_sub_menu: "", id_rol: "", activo: "" })

	const handleInputOnChange = (event) => {
		const { name, value, type, checked } = event.target
		const newValue = type === "checkbox" ? checked : value
		setMenuRolData((prevState) => ({
			...prevState,
			[name]: newValue,
		}))
	}

	const handleInputSubMenuOnChange = (event) => {
		const { name, value, type, checked } = event.target
		const newValue = type === "checkbox" ? checked : value
		setSubMenuRolData((prevState) => ({
			...prevState,
			[name]: newValue,
		}))
	}

	const handleOpenNewSubMenuRolDialog = () => {
		setIsNewSubMenuRolDialogOpen(true)
	}

	const handleCloseNewSubMenuRolDialog = () => {
		setIsNewSubMenuRolDialogOpen(false)
	}

	const handleOpenNewMenuRolDialog = () => {
		setIsNewMenuRolDialogOpen(true)
	}

	const handleCloseNewMenuRolDialog = () => {
		setIsNewMenuRolDialogOpen(false)
	}

	const handleCloseSnackbar = () => setSnackbar(null)

	const handleCheckboxChange = async (menuId, checked) => {

		try {

			const menuRol = menuRols.find((mr) => mr.id_menu === menuId)

			if (menuRol) {

				menuRol.activo = checked
				setMenuRols([...menuRols])

				if (checked) {
				await updateMenuRolById(menuId, {
					id_menu_rol: menuRol.id_menu_rol,
					id_menu: menuRol.id_menu,
					id_rol: selectedRole,
					activo: checked
				})

				fetchMenuByRolId()

				setSnackbar({
					children: "El menu se asocio exitosamente al rol ",
					severity: "success"
				})
				} else {
				await updateMenuRolById(menuId, {
					id_menu_rol: menuRol.id_menu_rol,
					id_menu: menuRol.id_menu,
					id_rol: selectedRole,
					activo: checked
				})

				fetchMenuByRolId()

				setSnackbar({
					children: "El menu se desasocio al rol ",
					severity: "error",
				})

			}

			} else {

				setSnackbar({
					children: "No se pudo asociar o desasociar el menú al rol porque la asociaciòn  no existe debes crear una nueva",
					severity: "warning",
				})

			}

		} catch (error) {
			console.error("Error updating menu_rol entry:", error)
		}

	}

	const handleChangeSelect = (event) => {
		setSelectedRole(event.target.value);
	}

	const fetchRoles = async () => {
		try {
			const response = await getAllRoles()
			const rowsWithId = response.map((row, index) => ({
				...row,
				id: row.id_rol || index.toString(),
			}))
			setRoles(rowsWithId)
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}

	const fetchMenus = async () => {
		try {
			const response = await getAllMenus()
			const rowsWithId = response.map((row) => ({
				...row,
				id: row.id_menu,
			}))
			setMenus(rowsWithId)
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}

	const fetchMenuByRolId = async () => {
		try {
			const data = await getMenuRolByIdRol(selectedRole)
			setMenuRols(data)
		} catch (error) {
			console.error("Error al obtener menu_rol entries por ID de rol:", error)
		}
	}

	const fetchSubMenuByRolId = async () => {
		try {
			const data = await getSubMenuRolByIdRol(selectedRole)
			setSubMenuRols(data)
		} catch (error) {
			console.error("Error al obtener menu_rol entries por ID de rol:", error)
		}
	}

	const fetchSubMenus = async () => {
		try {
			const response = await getAllSubMenus()
			const rowsWithId = response.map((row) => ({
				...row,
				id: row.id_sub_menu,
			}))
			setSubMenus(rowsWithId)
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}

	React.useEffect(() => {
		fetchMenuByRolId()
		fetchSubMenuByRolId()
		fetchMenus()
		fetchSubMenus()
		fetchRoles()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRole])

	const filteredSubMenusByRole = (menuId, idRol) => {
		const subMenusForMenu = subMenus.filter((subMenu) => subMenu.id_menu_padre === menuId)
		const subMenusWithActiveFlag = subMenusForMenu.map((subMenu) => {
			const subMenuRol = subMenuRols.find((subMenuRol) => subMenuRol.id_sub_menu === subMenu.id && subMenuRol.id_rol === idRol)
			const isActive = subMenuRol ? subMenuRol.activo : false
			return {
				...subMenu,
				activo: isActive,
			}
		})
		return subMenusWithActiveFlag
	}

	const handleAddMenuRol = async () => {
		try {
			const response = await createMenuRol(menuRolData)
			console.log("Respuesta de la API:", response.data)
			setSnackbar({
				children: "Asociaciòn entre menu y rol exitoso",
				severity: "success",
			})
			fetchMenuByRolId()
			handleCloseNewMenuRolDialog()
		} catch (error) {
			console.error("Error al guardar datos:", error)
			setSnackbar({ children: "Error al guardar datos", severity: "error" })
		}
	}

	const handleAddSubMenuRol = async () => {
		try {
			const response = await createSubMenuRol(subMenuRolData)
			console.log("Respuesta de la API:", response.data)
			setSnackbar({
				children: "Asociaciòn entre sub-menu y rol exitoso",
				severity: "success",
			})
			fetchSubMenuByRolId()
			handleCloseNewSubMenuRolDialog()
		} catch (error) {
			console.error("Error al guardar datos:", error)
			setSnackbar({ children: "Error al guardar datos", severity: "error" })
		}
	}

	const handleSubMenuCheckboxChange = async (subMenuId, checked) => {
		try {
			const subMenuRol = subMenuRols.find((mr) => mr.id_sub_menu === subMenuId)
			if (subMenuRol) {
				subMenuRol.activo = checked
				setSubMenuRols([...subMenuRols]);
				if (checked) {
				await updateSubMenuRolById(subMenuId, {
					id_sub_menu_rol: subMenuRol.id_sub_menu_rol,
					id_sub_menu: subMenuRol.id_sub_menu,
					id_rol: selectedRole,
					activo: checked,
				})
				fetchSubMenuByRolId()
					setSnackbar({
						children: "El submenu se asocio exitosamente al rol ",
						severity: "success",
					})
				} else {
				await updateSubMenuRolById(subMenuId, {
					id_sub_menu_rol: subMenuRol.id_sub_menu_rol,
					id_sub_menu: subMenuRol.id_sub_menu,
					id_rol: selectedRole,
					activo: checked,
				})
				fetchSubMenuByRolId()
				setSnackbar({
					children: "El submenu se desasocio al rol ",
					severity: "error",
				})
				}
			}else {
				setSnackbar({
					children:"No se pudo asociar o desasociar el submenú al rol porque la asociaciòn  no existe debes crear una nueva",
					severity: "warning",
				})
			}
		} catch (error) {
			console.error("Error updating menu_rol entry:", error)
		}
	}

	return (

		<Container>

			<Stack 
				spacing={1} 
				sx={{ 
					p: 1,
					display:'flex',
					flexDirection:{
						xs:'column',
						md:'row'
					},
					justifyContent:'center',
					width:'100%',
					gap:{
						xs:'40px',
						md:'0px'
					}
				}}
			>

				<FormControl 
					variant="filled" 
					sx={{ 
						m: 1, 
						minWidth: 300,
						width:'50%',
					}}
				>

					<InputLabel id="demo-simple-select-filled-label">Rol</InputLabel>

					<Select
						sx={{ width:'90%' }}
						labelId="demo-simple-select-filled-label"
						id="demo-simple-select-filled"
						value={selectedRole}
						onChange={handleChangeSelect}
					>

						<MenuItem value="">
							<em>Ningun</em>
						</MenuItem>

						{roles.map((role) => (

							<MenuItem key={role.id} value={role.id}>
								{role.nombre}{" "}
							</MenuItem>

						))}

					</Select>
					
				</FormControl>	
				
				<Box 
					sx={{ 
						m: 1, 
						minWidth: 300,
						width:'50%'
					}}
				>

					<Button
						onClick={handleOpenNewMenuRolDialog}
						variant="outlined"
						size="small"
						color="secondary"
						startIcon={<AddOutlined />}
						endIcon={<PiTreeStructureFill />}
					>
						Ligar Rol-Menu
					</Button>

					<Button
						onClick={handleOpenNewSubMenuRolDialog}
						variant="outlined"
						size="small"
						color="secondary"
						startIcon={<AddOutlined />}
						endIcon={<PiTreeStructureFill />}
					>
						Ligar Rol-SubMenu
					</Button>

					{menus.map((menu) => {

						const menuRol = menuRols.find((mr) => mr.id_menu === menu.id)
						const isChecked = menuRol ? menuRol.activo : false

						return (

							<FormGroup key={menu.id}>

								<FormControlLabel
									control={
										<Checkbox
											color="secondary"
											checked={isChecked}
											onChange={(event) => {
											handleCheckboxChange(menu.id, event.target.checked)
											}}
										/>
									}
									label={menu.nombre}
								/>

								{ filteredSubMenusByRole(menu.id, selectedRole).map((subMenu) => (
									<FormControlLabel
										key={subMenu.id}
										sx={{ marginLeft: "2rem" }}
										control={
											<Checkbox
												checked={subMenu.activo}
												onChange={ (event) => { handleSubMenuCheckboxChange(subMenu.id, event.target.checked) } }
												color="secondary"
											/>
									}
										label={`${subMenu.nombre}`}
									/>
								))}

							</FormGroup>
							
						)

					})}
				
				</Box>
			
			</Stack>

			{!!snackbar && (
				<Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
				<Alert {...snackbar} onClose={handleCloseSnackbar} />
				</Snackbar>
			)}

			{isNewMenuRolDialogOpen && (
				<Dialog
				fullScreen
				open={isNewMenuRolDialogOpen}
				onClose={handleCloseNewMenuRolDialog}
				>
				<AppBar sx={{ position: "relative" }}>
					<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={handleCloseNewMenuRolDialog}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					{/*  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
						Agrega nueva tarea
					</Typography> */}
					{/*  <Button autoFocus color="inherit"  onClick={handleClose}>
						Guardar
					</Button> */}
					</Toolbar>
				</AppBar>
				{/* Aqui va el contenido */}
				<Box
					sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%", // Ajusta según sea necesario
					}}
				>
					<Paper
					sx={{
						width: "40%",
						height: "auto",
						boxShadow: 3,
						padding: "2rem",
						borderRadius: 1,
					}}
					>
					{/* Contenido real del Paper */}
					<Typography variant="body1" sx={{ mb: "2rem" }}>
						Agregar nueva asociaciòn menu rol
					</Typography>
					{/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
					<Grid container spacing={2}>
						<Grid item xs={12} sx={{ p: 2 }}>
						<FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
							<InputLabel id="demo-simple-select-filled-label">
							Rol
							</InputLabel>
							<Select
							sx={{ width: 450 }}
							color="secondary"
							labelId="demo-simple-select-filled-label-id-rol"
							id="demo-simple-select-filled-id-rol"
							name="id_rol"
							value={menuRolData.id_rol}
							onChange={handleInputOnChange}
							>
							<MenuItem value="">
								<em>Ningun</em>
							</MenuItem>
							{roles.map((role) => (
								<MenuItem key={role.id} value={role.id}>
								{role.nombre}{" "}
								{/* Replace with the actual property name from your role object */}
								</MenuItem>
							))}
							</Select>
						</FormControl>

						<FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
							<InputLabel id="demo-simple-select-filled-label">
							Menu
							</InputLabel>
							<Select
							sx={{ width: 450 }}
							color="secondary"
							labelId="demo-simple-select-filled-label-id-menu"
							id="demo-simple-select-filled-id-menu"
							name="id_menu"
							value={menuRolData.id_menu}
							onChange={handleInputOnChange}
							>
							<MenuItem value="">
								<em>Ningun</em>
							</MenuItem>
							{menus.map((menu) => (
								<MenuItem key={menu.id} value={menu.id}>
								{menu.nombre}{" "}
								{/* Replace with the actual property name from your role object */}
								</MenuItem>
							))}
							</Select>
						</FormControl>
						{/*   {validateInputs.nombre ? (
							<Stack sx={{ marginTop: "0.2rem" }} direction="row">
							<FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
							<Typography color={"secondary"} variant="caption">
								¡Gracias por ingresar un rol!
							</Typography>
							</Stack>
						) : (
							<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, ingresa un rol!
							</Typography>
						)}  */}

						<Box
							sx={{
							display: "flex",
							flexDirection: "row",
							alignContent: "center",
							marginBottom: "2rem",
							p: 2,
							}}
						>
							<InputLabel sx={{ alignSelf: "center" }}>Activo</InputLabel>
							<Checkbox
							{..."label"}
							onChange={handleInputOnChange}
							name="activo"
							size="small"
							color="secondary"
							/>
						</Box>
						</Grid>
					</Grid>

					<Box
						sx={{
						display: "flex",
						justifyContent: "end",
						marginTop: "2.5rem",
						}}
					>
						<Button
						endIcon={<Sync />}
						color="secondary"
						variant="contained"
						onClick={handleAddMenuRol}
						>
						Guardar Asociaciòn de Rol con Menu
						</Button>
					</Box>
					</Paper>
				</Box>
				</Dialog>
			)}

			{isNewSubMenuRolDialogOpen && (
				<Dialog
				fullScreen
				open={isNewSubMenuRolDialogOpen}
				onClose={handleCloseNewSubMenuRolDialog}
				>
				<AppBar sx={{ position: "relative" }}>
					<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={handleCloseNewSubMenuRolDialog}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					{/*  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
						Agrega nueva tarea
					</Typography> */}
					{/*  <Button autoFocus color="inherit"  onClick={handleClose}>
						Guardar
					</Button> */}
					</Toolbar>
				</AppBar>
				{/* Aqui va el contenido */}
				<Box
					sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%", // Ajusta según sea necesario
					}}
				>
					<Paper
					sx={{
						width: "40%",
						height: "auto",
						boxShadow: 3,
						padding: "2rem",
						borderRadius: 1,
					}}
					>
					{/* Contenido real del Paper */}
					<Typography variant="body1" sx={{ mb: "2rem" }}>
						Agregar nueva asociaciòn sub-menu rol
					</Typography>
					{/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
					<Grid container spacing={2}>
						<Grid item xs={12} sx={{ p: 2 }}>
						<FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
							<InputLabel id="demo-simple-select-filled-label">
							Rol
							</InputLabel>
							<Select
							sx={{ width: 450 }}
							color="secondary"
							labelId="demo-simple-select-filled-label-id-rol"
							id="demo-simple-select-filled-id-rol"
							name="id_rol"
							value={subMenuRolData.id_rol}
							onChange={handleInputSubMenuOnChange} 
							>
							<MenuItem value="">
								<em>Ningun</em>
							</MenuItem>
							{roles.map((role) => (
								<MenuItem key={role.id} value={role.id}>
								{role.nombre}{" "}
								{/* Replace with the actual property name from your role object */}
								</MenuItem>
							))}
							</Select>
						</FormControl>

						<FormControl variant="filled" sx={{ m: 1, minWidth: 300 }}>
							<InputLabel id="demo-simple-select-filled-label">
							SubMenu
							</InputLabel>
							<Select
							sx={{ width: 450 }}
							color="secondary"
							labelId="demo-simple-select-filled-label-id-menu"
							id="demo-simple-select-filled-id-menu"
							name="id_sub_menu"
							value={subMenuRolData.id_sub_menu}
							onChange={handleInputSubMenuOnChange} 
							>
							<MenuItem value="">
								<em>Ningun</em>
							</MenuItem>
							{subMenus.map((subMenu) => (
								<MenuItem key={subMenu.id} value={subMenu.id}>
								{subMenu.nombre}{" "}
								{/* Replace with the actual property name from your role object */}
								</MenuItem>
							))}
							</Select>
						</FormControl>
						{/*   {validateInputs.nombre ? (
							<Stack sx={{ marginTop: "0.2rem" }} direction="row">
							<FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
							<Typography color={"secondary"} variant="caption">
								¡Gracias por ingresar un rol!
							</Typography>
							</Stack>
						) : (
							<Typography sx={{ color: "red" }} variant="caption">
							* ¡Por favor, ingresa un rol!
							</Typography>
						)}  */}

						<Box
							sx={{
							display: "flex",
							flexDirection: "row",
							alignContent: "center",
							marginBottom: "2rem",
							p: 2,
							}}
						>
							<InputLabel sx={{ alignSelf: "center" }}>Activo</InputLabel>
							<Checkbox
							{..."label"}
							onChange={handleInputSubMenuOnChange}
							name="activo"
							size="small"
							color="secondary"
							/>
						</Box>
						</Grid>
					</Grid>

					<Box
						sx={{
						display: "flex",
						justifyContent: "end",
						marginTop: "2.5rem",
						}}
					>
						<Button
						endIcon={<Sync />}
						color="secondary"
						variant="contained"
						onClick={handleAddSubMenuRol} 
						>
						Guardar Asociaciòn de Rol con Sub-Menu
						</Button>
					</Box>
					</Paper>
				</Box>
				</Dialog>
			)}

		</Container>

	)

}

export default PermissionModule;
