// S02-H2.6: confirmación simple (desactivar o activar un rol personalizado). Relleno rojo solo aquí (DESIGN.md).
import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { colores } from '../../../tema/seroTheme'

const DialogoConfirmar = ({ abierto, titulo, texto, confirmar, peligro, onCerrar, onConfirmar }) => {
	const [enviando, setEnviando] = useState(false)
	const ejecutar = async () => {
		setEnviando(true)
		try {
			await onConfirmar()
		} finally {
			setEnviando(false)
		}
	}
	return (
		<Dialog open={abierto} onClose={enviando ? undefined : onCerrar} maxWidth="xs" fullWidth aria-labelledby="confirmar-titulo">
			<DialogTitle id="confirmar-titulo" sx={{ fontWeight: 300, fontSize: 22, color: colores.tinta }}>
				{titulo}
			</DialogTitle>
			<DialogContent>
				<Typography sx={{ fontSize: 14, color: colores.texto2 }}>{texto}</Typography>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button variant="outlined" onClick={onCerrar} disabled={enviando}>
					Cancelar
				</Button>
				<Button
					variant="contained"
					onClick={ejecutar}
					disabled={enviando}
					sx={peligro ? { bgcolor: '#B42318', color: '#FFFFFF', '&:hover': { bgcolor: '#8F1C13' } } : undefined}
				>
					{enviando ? 'Un momento…' : confirmar}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

DialogoConfirmar.propTypes = {
	abierto: PropTypes.bool,
	titulo: PropTypes.string,
	texto: PropTypes.string,
	confirmar: PropTypes.string,
	peligro: PropTypes.bool,
	onCerrar: PropTypes.func.isRequired,
	onConfirmar: PropTypes.func.isRequired,
}

export default DialogoConfirmar
