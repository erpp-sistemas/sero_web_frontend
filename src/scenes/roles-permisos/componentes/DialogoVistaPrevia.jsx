// S02-H2.6: vista previa de un cambio de matriz: qué se agrega y qué se quita al rol, y a cuántas personas afecta
// (quién gana o pierde qué). Guardar usa la versión de esta vista previa.
import { useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Box, Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { colores } from '../../../tema/seroTheme'
import { ChipEstado } from '../../usuarios/componentes/comunes'
import { focoVisible } from '../../usuarios/componentes/utilidades'

const Lista = ({ titulo, codigos, tipo, nombre }) =>
	codigos.length > 0 && (
		<Box sx={{ mb: 2 }}>
			<Typography sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: colores.texto3, mb: 0.5 }}>
				{titulo} ({codigos.length})
			</Typography>
			<Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', maxHeight: 180, overflowY: 'auto', border: `1px solid ${colores.linea}`, borderRadius: '4px' }}>
				{codigos.map((c) => (
					<Box component="li" key={c} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, minHeight: 32, borderBottom: `1px solid ${colores.linea}`, '&:last-of-type': { borderBottom: 0 } }}>
						<ChipEstado tipo={tipo}>{tipo === 'exito' ? 'Agrega' : 'Quita'}</ChipEstado>
						<Typography sx={{ fontSize: 13, color: colores.tinta }}>{nombre(c)}</Typography>
						{c.endsWith('.delete') && <ChipEstado tipo="advertencia">No se deshace</ChipEstado>}
					</Box>
				))}
			</Box>
		</Box>
	)

Lista.propTypes = { titulo: PropTypes.string, codigos: PropTypes.array, tipo: PropTypes.string, nombre: PropTypes.func }

const DialogoVistaPrevia = ({ abierto, vista, rol, nombre, guardando, onCerrar, onGuardar }) => {
	const [verPersonas, setVerPersonas] = useState(false)
	if (!vista) return null
	const n = vista.personas_afectadas
	const titulo = n === 0 ? 'No cambia lo que nadie puede hacer hoy' : `Afecta a ${n} persona${n === 1 ? '' : 's'}`
	return (
		<Dialog open={abierto} onClose={guardando ? undefined : onCerrar} maxWidth="sm" fullWidth aria-labelledby="vista-previa-titulo">
			<DialogTitle id="vista-previa-titulo" sx={{ fontWeight: 300, fontSize: 22, color: colores.tinta }}>
				{titulo}
			</DialogTitle>
			<DialogContent>
				{vista.aviso && (
					<Alert severity="warning" sx={{ mb: 2 }}>
						{vista.aviso}
					</Alert>
				)}
				<Typography sx={{ fontSize: 14, color: colores.texto2, mb: 2 }}>
					Rol <b style={{ fontWeight: 500, color: colores.tinta }}>{rol?.nombre}</b>: {vista.total_personas} persona{vista.total_personas === 1 ? '' : 's'} activa{vista.total_personas === 1 ? '' : 's'} lo usa{vista.total_personas === 1 ? '' : 'n'}.
					{n < vista.total_personas && vista.total_personas > 0 ? ' A las demás no les cambia nada porque ya tienen esos permisos por excepción.' : ''}
				</Typography>
				<Lista titulo="Se agregan al rol" codigos={vista.agregados} tipo="exito" nombre={nombre} />
				<Lista titulo="Se quitan del rol" codigos={vista.quitados} tipo="error" nombre={nombre} />
				{n > 0 && (
					<>
						<ButtonBase
							onClick={() => setVerPersonas((v) => !v)}
							aria-expanded={verPersonas}
							sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colores.marino, fontSize: 14, py: 0.5, borderRadius: '4px', ...focoVisible }}
						>
							{verPersonas ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
							{verPersonas ? 'Ocultar quién gana o pierde qué' : 'Ver quién gana o pierde qué'}
						</ButtonBase>
						{verPersonas && (
							<Box component="ul" sx={{ m: 0, mt: 1, p: 0, listStyle: 'none', maxHeight: 260, overflowY: 'auto', border: `1px solid ${colores.linea}`, borderRadius: '4px' }}>
								{vista.personas.map((p) => (
									<Box component="li" key={p.id_usuario} sx={{ px: 1.5, py: 1, borderBottom: `1px solid ${colores.linea}`, '&:last-of-type': { borderBottom: 0 } }}>
										<Typography sx={{ fontSize: 14, fontWeight: 500, color: colores.tinta }}>{p.nombre}</Typography>
										{p.gana.length > 0 && <Typography sx={{ fontSize: 13, color: '#1E7A47' }}>Gana: {p.gana.map(nombre).join(', ')}</Typography>}
										{p.pierde.length > 0 && <Typography sx={{ fontSize: 13, color: '#B42318' }}>Pierde: {p.pierde.map(nombre).join(', ')}</Typography>}
									</Box>
								))}
							</Box>
						)}
					</>
				)}
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button variant="outlined" onClick={onCerrar} disabled={guardando}>
					Volver
				</Button>
				<Button variant="contained" onClick={onGuardar} disabled={guardando}>
					{guardando ? 'Guardando…' : 'Guardar cambios'}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

DialogoVistaPrevia.propTypes = {
	abierto: PropTypes.bool,
	vista: PropTypes.object,
	rol: PropTypes.object,
	nombre: PropTypes.func.isRequired,
	guardando: PropTypes.bool,
	onCerrar: PropTypes.func.isRequired,
	onGuardar: PropTypes.func.isRequired,
}

export default DialogoVistaPrevia
