// S02-H2.5: confirmar desactivar o activar una plaza, servicio, proceso o tarea. Al desactivar muestra qué pasa en la app
// y los conteos (GET /admin/catalogo/:tipo/:id/impacto): plazas, personas, asignaciones abiertas, gestiones y fotos.
// Nada se borra: se puede volver a activar.
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import { colores } from '../../../tema/seroTheme'
import { impactoRequest } from '../../../api/catalogoAdmin'
import { mensajeDeError } from '../../../api/usuariosAdmin'
import { TIPOS, efectoEnApp, numero, plural } from './utilidadesCatalogo'

const DialogoEstado = ({ abierto, tipo, elemento, activar, onCerrar, onConfirmar }) => {
	const [impacto, setImpacto] = useState(null)
	const [cargando, setCargando] = useState(false)
	const [error, setError] = useState('')
	const [guardando, setGuardando] = useState(false)
	const [errorGuardar, setErrorGuardar] = useState('')
	const t = TIPOS[tipo]
	const id = elemento?.[t?.idCampo]

	useEffect(() => {
		if (!abierto || activar || !t || !id) return undefined
		let vivo = true
		setImpacto(null)
		setError('')
		setCargando(true)
		impactoRequest(t.api, id)
			.then((r) => vivo && setImpacto(r.data))
			.catch((e) => vivo && setError(mensajeDeError(e, 'No se pudieron contar las asignaciones y gestiones')))
			.finally(() => vivo && setCargando(false))
		return () => {
			vivo = false
		}
	}, [abierto, activar, t, id])

	useEffect(() => {
		if (abierto) {
			setErrorGuardar('')
			setGuardando(false)
		}
	}, [abierto])

	if (!t || !elemento) return null

	const confirmar = async () => {
		setGuardando(true)
		setErrorGuardar('')
		try {
			await onConfirmar()
		} catch (e) {
			setErrorGuardar(mensajeDeError(e))
			setGuardando(false)
		}
	}

	const efecto = activar ? [] : efectoEnApp(tipo, impacto)
	const conPlazas = !activar && impacto && tipo !== 'plaza'

	return (
		<Dialog open={abierto} onClose={guardando ? undefined : onCerrar} maxWidth="sm" fullWidth aria-labelledby="titulo-estado">
			<DialogTitle id="titulo-estado" sx={{ fontSize: 18, fontWeight: 500 }}>
				{activar ? `¿Activar ${t.articulo} “${elemento.nombre}”?` : `¿Desactivar ${t.articulo} “${elemento.nombre}”?`}
			</DialogTitle>
			<DialogContent>
				{activar ? (
					<Typography sx={{ fontSize: 14, color: colores.texto2 }}>
						{tipo === 'tarea' || tipo === 'proceso'
							? 'Vuelve a aparecer en la web y en la app.'
							: 'Vuelve a aparecer en la web. En la app no cambia nada: la app muestra lo que cada persona tiene asignado.'}
					</Typography>
				) : (
					<>
						{cargando && (
							<Box aria-busy="true" aria-label="Contando asignaciones y gestiones">
								<Skeleton height={24} />
								<Skeleton height={24} width="80%" />
								<Skeleton height={120} sx={{ mt: 1 }} />
							</Box>
						)}
						{error && (
							<Alert severity="warning" sx={{ mb: 2 }}>
								{error}. Puedes desactivar de todos modos.
							</Alert>
						)}
						{!cargando && (
							<Box component="ul" sx={{ m: 0, pl: 2.5, color: colores.tinta, fontSize: 14, '& li': { mb: 1 } }}>
								{efecto.map((linea) => (
									<li key={linea}>{linea}</li>
								))}
								<li>Nada se borra: puedes volver a {t.articulo.startsWith('la') ? 'activarla' : 'activarlo'} cuando quieras.</li>
							</Box>
						)}
						{impacto && (
							<Box sx={{ mt: 2 }}>
								<Typography sx={{ fontSize: 13, color: colores.texto2 }}>
									{plural(impacto.personas, 'persona activa lo tiene asignado', 'personas activas lo tienen asignado')}
									{tipo === 'plaza' ? '' : ` · en ${plural(impacto.plazas, 'plaza', 'plazas')}`}
								</Typography>
								{conPlazas && impacto.por_plaza.length > 0 && (
									<Box sx={{ mt: 1.5, border: `1px solid ${colores.linea}`, borderRadius: '4px', overflowX: 'auto' }}>
										<Table size="small" aria-label="Uso por plaza">
											<TableHead>
												<TableRow>
													<TableCell>Plaza</TableCell>
													<TableCell align="right">Asignaciones abiertas</TableCell>
													<TableCell align="right">Gestiones</TableCell>
													<TableCell align="right">Fotos</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{impacto.por_plaza.map((p) => (
													<TableRow key={p.id_plaza}>
														<TableCell>{p.nombre}</TableCell>
														<TableCell align="right">{numero(p.asignaciones_abiertas)}</TableCell>
														<TableCell align="right">{numero(p.gestiones)}</TableCell>
														<TableCell align="right">{numero(p.fotos)}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</Box>
								)}
								{tipo === 'plaza' && (
									<Typography sx={{ fontSize: 13, color: colores.texto2, mt: 1 }}>
										Asignaciones abiertas en la plaza: {numero(impacto.asignaciones_abiertas)}
									</Typography>
								)}
								{impacto.plazas_sin_dato > 0 && (
									<Typography sx={{ fontSize: 12, color: colores.texto3, mt: 1 }}>
										“Sin dato”: la base de {plural(impacto.plazas_sin_dato, 'plaza', 'plazas')} no respondió o no está configurada; los totales no la incluyen.
									</Typography>
								)}
								{conPlazas && (
									<Typography sx={{ fontSize: 12, color: colores.texto3, mt: 1 }}>
										Las gestiones y fotos ya registradas se conservan; solo se cuentan para que sepas cuánto se usa.
									</Typography>
								)}
							</Box>
						)}
					</>
				)}
				{errorGuardar && (
					<Alert severity="error" sx={{ mt: 2 }}>
						{errorGuardar}
					</Alert>
				)}
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button variant="outlined" onClick={onCerrar} disabled={guardando}>
					Cancelar
				</Button>
				{activar ? (
					<Button variant="contained" onClick={confirmar} disabled={guardando}>
						{guardando ? 'Activando…' : 'Activar'}
					</Button>
				) : (
					<Button
						variant="contained"
						onClick={confirmar}
						disabled={guardando || cargando}
						sx={{ bgcolor: '#B42318', color: colores.blanco, '&:hover': { bgcolor: '#8F1C13' } }}
					>
						{guardando ? 'Desactivando…' : 'Desactivar'}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	)
}

DialogoEstado.propTypes = {
	abierto: PropTypes.bool.isRequired,
	tipo: PropTypes.oneOf(Object.keys(TIPOS)),
	elemento: PropTypes.object,
	activar: PropTypes.bool,
	onCerrar: PropTypes.func.isRequired,
	onConfirmar: PropTypes.func.isRequired,
}

export default DialogoEstado
