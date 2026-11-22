// S02-H2.1: barra superior del diseño nuevo (docs/DESIGN.md › Barra superior).
// Izquierda: selector de contexto (o el título del mapa en /map/:place_id). Derecha: buscador, herramientas y avatar.
// Sin botón de modo oscuro (tema claro único) y sin campana hasta que existan las notificaciones.
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Box, IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LayersIcon from '@mui/icons-material/Layers'
import Apps from '../Topbar/Apps'
import Profile from '../Topbar/Profile'
import SelectorContexto from './SelectorContexto'
import BuscadorPantallas from './BuscadorPantallas'
import { colores, medidas } from '../../tema/seroTheme'

// Selector de contexto Plaza › Servicio › Proceso de la barra superior. Apagado mientras las pantallas viejas
// tengan su propio selector (mostrarían valores distintos). Ponerlo en true cuando se rehagan esas pantallas
// (regla en docs/DESIGN.md › Barra superior).
const MOSTRAR_SELECTOR_CONTEXTO = false

const BarraSuperior = ({ pantallas, esMovil, onAbrirMenu }) => {
	const location = useLocation()
	const mapa = useSelector((state) => state.plaza_mapa)
	const enMapa = location.pathname === `/map/${mapa.place_id}`

	return (
		<Box
			component="header"
			sx={{
				height: medidas.barra,
				minHeight: medidas.barra,
				display: 'flex',
				alignItems: 'center',
				gap: 1.5,
				px: { xs: 2, md: 3 },
				backgroundColor: colores.blanco,
				borderBottom: `1px solid ${colores.linea}`,
				mb: 2,
			}}
		>
			{esMovil && !enMapa && (
				<IconButton onClick={onAbrirMenu} aria-label="Abrir menú" sx={{ ml: -1, color: colores.tinta }}>
					<MenuIcon />
				</IconButton>
			)}

			<Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
				{enMapa ? (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
						<LayersIcon sx={{ color: colores.marino }} />
						<Typography noWrap sx={{ fontSize: 15, color: colores.texto2 }}>
							Sistema de información geográfica{' '}
							<Box component="span" sx={{ color: colores.tinta, fontWeight: 500 }}>
								{mapa.name}
							</Box>
						</Typography>
					</Box>
				) : (
					MOSTRAR_SELECTOR_CONTEXTO && <SelectorContexto />
				)}
			</Box>

			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<BuscadorPantallas pantallas={pantallas} />
				<Apps />
				<Profile />
			</Box>
		</Box>
	)
}

BarraSuperior.propTypes = {
	pantallas: PropTypes.array.isRequired,
	esMovil: PropTypes.bool,
	onAbrirMenu: PropTypes.func.isRequired,
}

export default BarraSuperior
