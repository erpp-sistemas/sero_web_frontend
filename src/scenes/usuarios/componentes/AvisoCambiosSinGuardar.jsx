// S02-H2.4: aviso de cambios sin guardar al salir de la pantalla.
// La app usa <BrowserRouter> (no un "data router"), así que useBlocker de react-router no existe: mientras haya
// cambios se interceptan navigator.push/replace (enlaces del menú, botones "Usuarios"/"Cancelar") y se pregunta
// con un diálogo. Recargar o cerrar la pestaña lo cubre "beforeunload" (el navegador muestra su propio aviso).
// No cubre el botón "atrás" del navegador.
import { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { UNSAFE_NavigationContext } from 'react-router-dom'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { colores } from '../../../tema/seroTheme'

const AvisoCambiosSinGuardar = ({ activo, salidaPermitida }) => {
	const { navigator } = useContext(UNSAFE_NavigationContext)
	const [pendiente, setPendiente] = useState(null)

	useEffect(() => {
		if (!activo) return undefined
		const antesDeSalir = (e) => {
			e.preventDefault()
			e.returnValue = ''
		}
		window.addEventListener('beforeunload', antesDeSalir)

		const push = navigator.push
		const replace = navigator.replace
		const interceptar = (original) => (...args) => {
			if (salidaPermitida?.current) return original.apply(navigator, args)
			setPendiente({ original, args })
			return undefined
		}
		navigator.push = interceptar(push)
		navigator.replace = interceptar(replace)

		return () => {
			window.removeEventListener('beforeunload', antesDeSalir)
			navigator.push = push
			navigator.replace = replace
		}
	}, [activo, navigator, salidaPermitida])

	const salir = () => {
		const { original, args } = pendiente
		setPendiente(null)
		original.apply(navigator, args)
	}

	return (
		<Dialog open={Boolean(pendiente)} onClose={() => setPendiente(null)} maxWidth="xs" fullWidth>
			<DialogTitle sx={{ fontSize: 18, fontWeight: 500 }}>Tienes cambios sin guardar</DialogTitle>
			<DialogContent>
				<Typography sx={{ fontSize: 14, color: colores.texto2 }}>Si sales ahora, se pierden. ¿Quieres salir de todos modos?</Typography>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button variant="contained" onClick={() => setPendiente(null)} autoFocus>
					Seguir editando
				</Button>
				<Button variant="outlined" onClick={salir} sx={{ color: '#B42318', borderColor: '#F3C5C1' }}>
					Salir sin guardar
				</Button>
			</DialogActions>
		</Dialog>
	)
}

AvisoCambiosSinGuardar.propTypes = {
	activo: PropTypes.bool.isRequired,
	salidaPermitida: PropTypes.shape({ current: PropTypes.bool }),
}

export default AvisoCambiosSinGuardar
