// S02-H2.1: armazón de la web (menú lateral + barra superior) con el tema nuevo.
// El contenido (las pantallas) queda fuera de <TemaSero>: las pantallas viejas siguen con el tema de src/theme.js.
import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Box, useMediaQuery } from '@mui/material'
import TemaSero from '../../tema/TemaSero'
import { seroTheme } from '../../tema/seroTheme'
import MenuLateral from './MenuLateral'
import BarraSuperior from './BarraSuperior'
import SidebarMap from '../../scenes/global/SidebarMap'
import useMenusUsuario from '../../hooks/useMenusUsuario'

const CLAVE_CERRADO = 'sero.menu.cerrado'

const leerCerrado = () => {
	try {
		return localStorage.getItem(CLAVE_CERRADO) === '1'
	} catch {
		return false
	}
}

const Armazon = ({ children }) => {
	const location = useLocation()
	const usuario = useSelector((state) => state.user)
	const mapa = useSelector((state) => state.plaza_mapa)
	const enMapa = location.pathname === `/map/${mapa.place_id}`
	const esMovil = useMediaQuery(seroTheme.breakpoints.down('md'))

	const { grupos, pantallas, cargando, error } = useMenusUsuario(usuario.user_id)
	const [cerrado, setCerrado] = useState(leerCerrado)
	const [abiertoMovil, setAbiertoMovil] = useState(false)

	const alternar = () => {
		setCerrado((prev) => {
			try {
				localStorage.setItem(CLAVE_CERRADO, prev ? '0' : '1')
			} catch {
				/* sin almacenamiento local: solo no se recuerda */
			}
			return !prev
		})
	}
	const cerrarMovil = useCallback(() => setAbiertoMovil(false), [])

	return (
		// overflow "clip" (no "hidden"): el panel de perfil vive fuera de la pantalla (position absolute, right negativo)
		// y con "hidden" el navegador podía desplazar todo el armazón de lado al enfocar algo (p. ej. el mapa).
		<Box className="app" sx={{ height: '100vh', overflow: 'hidden', '@supports (overflow: clip)': { overflow: 'clip' } }}>
			{enMapa ? (
				<SidebarMap isSidebar />
			) : (
				<TemaSero>
					<MenuLateral
						grupos={grupos}
						cargando={cargando}
						error={error}
						cerrado={cerrado}
						onAlternar={alternar}
						esMovil={esMovil}
						abiertoMovil={abiertoMovil}
						onCerrarMovil={cerrarMovil}
					/>
				</TemaSero>
			)}
			<Box component="main" className="content" sx={{ flex: 1, minWidth: 0, height: '100vh', overflow: 'auto' }}>
				<TemaSero>
					<BarraSuperior pantallas={pantallas} esMovil={esMovil} onAbrirMenu={() => setAbiertoMovil(true)} />
				</TemaSero>
				{children}
			</Box>
		</Box>
	)
}

Armazon.propTypes = { children: PropTypes.node }

export default Armazon
