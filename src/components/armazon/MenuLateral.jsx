// S02-H2.1: menú lateral del diseño nuevo (docs/DESIGN.md › Menú lateral).
// Muestra los mismos menús que el menú anterior (/MenusUserId). 232px abierto, 64px cerrado; en celular, panel deslizable.
import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, ButtonBase, Drawer, IconButton, Menu, MenuItem, Skeleton, Tooltip, Typography } from '@mui/material'
import * as MUIIcons from '@mui/icons-material'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { colores, medidas } from '../../tema/seroTheme'
import { rutaAbsoluta } from '../../hooks/useMenusUsuario'

const CLAVE_GRUPOS = 'sero.menu.gruposAbiertos'

const Icono = ({ nombre, sx }) => {
	const Componente = MUIIcons[nombre] || MUIIcons.LocationOn
	return <Componente sx={{ fontSize: 18, ...sx }} />
}
Icono.propTypes = { nombre: PropTypes.string, sx: PropTypes.object }

const leerGruposAbiertos = () => {
	try {
		const valor = JSON.parse(localStorage.getItem(CLAVE_GRUPOS))
		return valor && typeof valor === 'object' ? valor : {}
	} catch {
		return {}
	}
}

const ItemMenu = ({ item, activo, onIr }) => (
	<ButtonBase
		onClick={() => onIr(item)}
		aria-current={activo ? 'page' : undefined}
		sx={{
			position: 'relative',
			width: '100%',
			height: 34,
			px: 1.5,
			gap: 1.25,
			justifyContent: 'flex-start',
			borderRadius: '4px',
			color: activo ? colores.tinta : colores.texto2,
			backgroundColor: activo ? colores.seleccion : 'transparent',
			fontSize: 14,
			fontWeight: activo ? 500 : 400,
			textAlign: 'left',
			'&::before': activo
				? { content: '""', position: 'absolute', left: 0, top: 6, bottom: 6, width: 2, borderRadius: 2, backgroundColor: colores.verde }
				: undefined,
			'&:hover': { backgroundColor: activo ? colores.seleccion : '#F1F5FA', color: colores.tinta },
			'&.Mui-focusVisible': { outline: `2px solid ${colores.marino}`, outlineOffset: -2 },
		}}
	>
		<Icono nombre={item.icono} sx={{ color: activo ? colores.marino : colores.texto3 }} />
		<Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
			{item.nombre}
		</Box>
	</ButtonBase>
)
ItemMenu.propTypes = { item: PropTypes.object.isRequired, activo: PropTypes.bool, onIr: PropTypes.func.isRequired }

const ContenidoMenu = ({ grupos, cargando, error, cerrado, onAlternar, onIr, esActiva, mostrarAlternar, abiertos, grupoActivo, onAlternarGrupo }) => {
	const [menuFlotante, setMenuFlotante] = useState({ ancla: null, grupo: null })

	// Todos los grupos se abren y se cierran, también el de la pantalla actual.
	const estaAbierto = (id) => Boolean(abiertos[id])

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Box
				sx={{
					height: medidas.barra,
					minHeight: medidas.barra,
					display: 'flex',
					alignItems: 'center',
					justifyContent: cerrado ? 'center' : 'space-between',
					px: cerrado ? 0 : 2,
					borderBottom: `1px solid ${colores.linea}`,
				}}
			>
				{!cerrado && (
					<ButtonBase onClick={() => onIr({ ruta: '/home' })} aria-label="Ir al inicio" sx={{ borderRadius: '4px' }}>
						<img src="/sero-logo.png" alt="SERO" style={{ height: 24, width: 'auto', display: 'block' }} />
					</ButtonBase>
				)}
				{mostrarAlternar && (
					<Tooltip title={cerrado ? 'Abrir menú' : 'Cerrar menú'} placement="right">
						<IconButton size="small" onClick={onAlternar} aria-label={cerrado ? 'Abrir menú' : 'Cerrar menú'} sx={{ color: colores.texto3 }}>
							{cerrado ? <KeyboardDoubleArrowRightIcon fontSize="small" /> : <KeyboardDoubleArrowLeftIcon fontSize="small" />}
						</IconButton>
					</Tooltip>
				)}
			</Box>

			<Box
				component="nav"
				aria-label="Menú principal"
				sx={{
					flex: 1,
					overflowY: 'auto',
					overflowX: 'hidden',
					py: 1.5,
					px: cerrado ? 1 : 1.5,
					'&::-webkit-scrollbar-thumb': { backgroundColor: colores.borde, borderRadius: 4 },
					'&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
				}}
			>
				{cargando && [1, 2, 3, 4, 5, 6].map((n) => <Skeleton key={n} variant="rounded" height={28} sx={{ mb: 1 }} />)}

				{!cargando && error && (
					<Typography sx={{ fontSize: 13, color: colores.texto2, px: cerrado ? 0 : 1.5, textAlign: cerrado ? 'center' : 'left' }}>
						{cerrado ? '!' : 'No se pudo cargar el menú. Recarga la página.'}
					</Typography>
				)}

				{!cargando && !error && grupos.length === 0 && !cerrado && (
					<Typography sx={{ fontSize: 13, color: colores.texto2, px: 1.5 }}>No tienes pantallas asignadas.</Typography>
				)}

				{!cargando && !error && grupos.map((grupo) => {
					const tieneActiva = grupo.id === grupoActivo
					if (cerrado) {
						return (
							<Tooltip key={grupo.id} title={grupo.nombre} placement="right">
								<ButtonBase
									onClick={(e) => setMenuFlotante({ ancla: e.currentTarget, grupo })}
									aria-label={grupo.nombre}
									sx={{
										position: 'relative',
										width: 40,
										height: 36,
										mx: 'auto',
										mb: 0.5,
										display: 'flex',
										borderRadius: '4px',
										backgroundColor: tieneActiva ? colores.seleccion : 'transparent',
										color: tieneActiva ? colores.marino : colores.texto3,
										'&::before': tieneActiva
											? { content: '""', position: 'absolute', left: 0, top: 8, bottom: 8, width: 2, borderRadius: 2, backgroundColor: colores.verde }
											: undefined,
										'&:hover': { backgroundColor: '#F1F5FA', color: colores.tinta },
									}}
								>
									<Icono nombre={grupo.icono} sx={{ fontSize: 20 }} />
								</ButtonBase>
							</Tooltip>
						)
					}
					const abierto = estaAbierto(grupo.id)
					return (
						<Box key={grupo.id} sx={{ mb: 1 }}>
							<ButtonBase
								onClick={() => onAlternarGrupo(grupo.id)}
								aria-expanded={abierto}
								sx={{
									width: '100%',
									height: 28,
									px: 1.5,
									justifyContent: 'space-between',
									borderRadius: '4px',
									// Grupo cerrado que contiene la pantalla actual: título en marino y peso 500.
									color: tieneActiva && !abierto ? colores.marino : colores.texto3,
									fontWeight: tieneActiva && !abierto ? 500 : 400,
									fontSize: 11.5,
									letterSpacing: '0.06em',
									textTransform: 'uppercase',
									'&:hover': { color: colores.tinta },
									'&.Mui-focusVisible': { outline: `2px solid ${colores.marino}`, outlineOffset: -2 },
								}}
							>
								<Box component="span" sx={{ flex: 1, minWidth: 0, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
									{grupo.nombre}
								</Box>
								<ExpandMoreIcon sx={{ fontSize: 16, transform: abierto ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
							</ButtonBase>
							{abierto && grupo.items.map((item) => <ItemMenu key={item.id} item={item} activo={esActiva(item.ruta)} onIr={onIr} />)}
						</Box>
					)
				})}
			</Box>

			<Menu
				anchorEl={menuFlotante.ancla}
				open={Boolean(menuFlotante.ancla)}
				onClose={() => setMenuFlotante({ ancla: null, grupo: null })}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
				slotProps={{ paper: { sx: { minWidth: 220, border: `1px solid ${colores.linea}`, boxShadow: '0 8px 24px rgba(15,35,64,0.12)' } } }}
			>
				<Typography sx={{ px: 2, py: 1, fontSize: 11.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: colores.texto3 }}>
					{menuFlotante.grupo?.nombre}
				</Typography>
				{menuFlotante.grupo?.items.map((item) => (
					<MenuItem
						key={item.id}
						selected={esActiva(item.ruta)}
						onClick={() => {
							setMenuFlotante({ ancla: null, grupo: null })
							onIr(item)
						}}
						sx={{ fontSize: 14, gap: 1.25, color: colores.tinta }}
					>
						<Icono nombre={item.icono} sx={{ color: colores.texto3 }} />
						{item.nombre}
					</MenuItem>
				))}
			</Menu>
		</Box>
	)
}
ContenidoMenu.propTypes = {
	grupos: PropTypes.array.isRequired,
	cargando: PropTypes.bool,
	error: PropTypes.bool,
	cerrado: PropTypes.bool,
	onAlternar: PropTypes.func,
	onIr: PropTypes.func.isRequired,
	esActiva: PropTypes.func.isRequired,
	mostrarAlternar: PropTypes.bool,
	abiertos: PropTypes.object.isRequired,
	grupoActivo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onAlternarGrupo: PropTypes.func.isRequired,
}

const MenuLateral = ({ grupos, cargando, error, cerrado, onAlternar, esMovil, abiertoMovil, onCerrarMovil }) => {
	const navigate = useNavigate()
	const location = useLocation()

	const esActiva = useMemo(() => (ruta) => rutaAbsoluta(ruta) === location.pathname, [location.pathname])

	// Qué grupos están abiertos vive aquí (no en ContenidoMenu) para que sobreviva al cerrar y abrir el panel del celular.
	const [abiertos, setAbiertos] = useState(leerGruposAbiertos)
	const grupoActivo = useMemo(() => grupos.find((g) => g.items.some((i) => esActiva(i.ruta)))?.id, [grupos, esActiva])

	const guardarAbiertos = (siguiente) => {
		try {
			localStorage.setItem(CLAVE_GRUPOS, JSON.stringify(siguiente))
		} catch {
			/* sin almacenamiento local: solo no se recuerda */
		}
		return siguiente
	}

	const alternarGrupo = (id) => setAbiertos((prev) => guardarAbiertos({ ...prev, [id]: !prev[id] }))

	// Al entrar a una pantalla, su grupo se abre solo; después la persona puede cerrarlo.
	useEffect(() => {
		if (!grupoActivo) return
		setAbiertos((prev) => (prev[grupoActivo] ? prev : guardarAbiertos({ ...prev, [grupoActivo]: true })))
		// esActiva cambia solo al cambiar de pantalla: así se reabre al entrar a otra pantalla del mismo grupo.
	}, [grupoActivo, esActiva])

	// Igual que el menú anterior: se navega con la ruta tal como viene de la base.
	const irA = (item) => {
		if (!item.ruta || item.ruta === '#') return
		navigate(item.ruta)
		if (esMovil) onCerrarMovil()
	}

	useEffect(() => {
		if (esMovil) onCerrarMovil()
		// Solo al cambiar de pantalla.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname])

	const fondo = { backgroundColor: colores.banda, borderRight: `1px solid ${colores.linea}` }

	if (esMovil) {
		return (
			<Drawer open={abiertoMovil} onClose={onCerrarMovil} PaperProps={{ sx: { width: medidas.menuAbierto, border: 'none', ...fondo } }}>
				<ContenidoMenu grupos={grupos} cargando={cargando} error={error} cerrado={false} onIr={irA} esActiva={esActiva} mostrarAlternar={false} abiertos={abiertos} grupoActivo={grupoActivo} onAlternarGrupo={alternarGrupo} />
			</Drawer>
		)
	}

	const ancho = cerrado ? medidas.menuCerrado : medidas.menuAbierto
	return (
		<Box
			component="aside"
			sx={{
				...fondo,
				width: ancho,
				minWidth: ancho,
				height: '100vh',
				position: 'sticky',
				top: 0,
				transition: 'width 150ms ease, min-width 150ms ease',
				zIndex: 1200,
			}}
		>
			<ContenidoMenu
				grupos={grupos}
				cargando={cargando}
				error={error}
				cerrado={cerrado}
				onAlternar={onAlternar}
				onIr={irA}
				esActiva={esActiva}
				mostrarAlternar
				abiertos={abiertos}
				grupoActivo={grupoActivo}
				onAlternarGrupo={alternarGrupo}
			/>
		</Box>
	)
}

MenuLateral.propTypes = {
	grupos: PropTypes.array.isRequired,
	cargando: PropTypes.bool,
	error: PropTypes.bool,
	cerrado: PropTypes.bool,
	onAlternar: PropTypes.func.isRequired,
	esMovil: PropTypes.bool,
	abiertoMovil: PropTypes.bool,
	onCerrarMovil: PropTypes.func.isRequired,
}

export default MenuLateral
