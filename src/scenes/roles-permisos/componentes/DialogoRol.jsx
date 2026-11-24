// S02-H2.6: diálogos de la matriz: nuevo rol personalizado, cambiar nombre y copiar permisos de otro rol.
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, OutlinedInput, Select, Typography } from '@mui/material'
import { colores } from '../../../tema/seroTheme'
import { mensajeDeError } from '../../../api/usuariosAdmin'
import { Campo } from '../../usuarios/componentes/comunes'
import { estiloInput } from '../../usuarios/componentes/utilidades'

const TITULOS = { nuevo: 'Nuevo rol', renombrar: 'Cambiar nombre del rol', copiar: 'Copiar permisos de otro rol' }

const DialogoRol = ({ modo, rol, roles, idRolActor, nivelActor, onCerrar, onCrear, onRenombrar, onCopiar }) => {
	const [nombre, setNombre] = useState('')
	const [descripcion, setDescripcion] = useState('')
	const [idBase, setIdBase] = useState('')
	const [copiarDe, setCopiarDe] = useState('')
	const [error, setError] = useState(null)
	const [enviando, setEnviando] = useState(false)

	useEffect(() => {
		if (!modo) return
		setError(null)
		setEnviando(false)
		setNombre(modo === 'renombrar' ? rol?.nombre ?? '' : '')
		setDescripcion(modo === 'renombrar' ? rol?.descripcion ?? '' : '')
		setIdBase('')
		setCopiarDe('')
	}, [modo, rol])

	// Bases posibles: roles de siempre, activos, no heredados, de nivel ≤ al de quien crea; Superadmin y Sistemas solo para Superadmin
	const bases = roles.filter((r) => !r.es_personalizado && r.activo && !r.es_heredado && r.nivel <= nivelActor && (![1, 9].includes(r.id_rol) || idRolActor === 1))
	const origenes = roles.filter((r) => r.id_rol !== rol?.id_rol)

	const enviar = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		setError(null)
		if (modo !== 'copiar' && nombre.trim().length < 2) return setError('Escribe un nombre de al menos 2 caracteres.')
		if (modo === 'nuevo' && !idBase) return setError('Elige el rol base.')
		if (modo === 'copiar' && !copiarDe) return setError('Elige de qué rol copiar.')
		setEnviando(true)
		try {
			if (modo === 'nuevo') await onCrear({ nombre: nombre.trim(), descripcion: descripcion.trim() || null, id_rol_base: Number(idBase), ...(copiarDe ? { copiar_de: Number(copiarDe) } : {}) })
			else if (modo === 'renombrar') await onRenombrar({ nombre: nombre.trim(), descripcion: descripcion.trim() || null })
			else await onCopiar(Number(copiarDe))
		} catch (err) {
			setError(mensajeDeError(err))
			setEnviando(false)
		}
		return undefined
	}

	return (
		<Dialog open={Boolean(modo)} onClose={enviando ? undefined : onCerrar} maxWidth="xs" fullWidth aria-labelledby="dialogo-rol-titulo">
			<form onSubmit={enviar} noValidate>
				<DialogTitle id="dialogo-rol-titulo" sx={{ fontWeight: 300, fontSize: 22, color: colores.tinta }}>
					{TITULOS[modo] ?? ''}
				</DialogTitle>
				<DialogContent sx={{ display: 'grid', gap: 2 }}>
					{error && (
						<Alert severity="error" role="alert">
							{error}
						</Alert>
					)}
					{modo === 'nuevo' && (
						<Typography sx={{ fontSize: 14, color: colores.texto2 }}>
							Un rol personalizado (por ejemplo RH o Validación) cambia solo lo que la persona ve y hace en la web. Para reportes, asignaciones y la app sigue contando su rol base.
						</Typography>
					)}
					{modo !== 'copiar' && (
						<>
							<Campo id="rol-nombre" etiqueta="Nombre" obligatorio>
								<OutlinedInput id="rol-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth inputProps={{ maxLength: 80 }} sx={estiloInput} autoFocus />
							</Campo>
							<Campo id="rol-descripcion" etiqueta="Descripción (opcional)">
								<OutlinedInput id="rol-descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} fullWidth inputProps={{ maxLength: 300 }} sx={estiloInput} />
							</Campo>
						</>
					)}
					{modo === 'nuevo' && (
						<Campo id="rol-base" etiqueta="Rol base" obligatorio ayuda="El que conserva en reportes y en la app. Su nivel es el del rol base.">
							<Select id="rol-base" value={idBase} onChange={(e) => setIdBase(e.target.value)} displayEmpty fullWidth size="small" sx={{ height: 40 }}>
								<MenuItem value="" disabled>
									Elige un rol
								</MenuItem>
								{bases.map((r) => (
									<MenuItem key={r.id_rol} value={r.id_rol}>
										{r.nombre}
									</MenuItem>
								))}
							</Select>
						</Campo>
					)}
					{(modo === 'nuevo' || modo === 'copiar') && (
						<Campo id="rol-copiar" etiqueta={modo === 'nuevo' ? 'Empezar con los permisos de' : 'Copiar los permisos de'} ayuda={modo === 'nuevo' ? 'Si no eliges, empieza con los del rol base.' : 'Reemplaza lo marcado en la matriz; nada se guarda hasta que revises y guardes.'}>
							<Select id="rol-copiar" value={copiarDe} onChange={(e) => setCopiarDe(e.target.value)} displayEmpty fullWidth size="small" sx={{ height: 40 }}>
								<MenuItem value="" disabled={modo === 'copiar'}>
									{modo === 'nuevo' ? 'Los del rol base' : 'Elige un rol'}
								</MenuItem>
								{origenes.map((r) => (
									<MenuItem key={r.id_rol} value={r.id_rol}>
										{r.nombre}
									</MenuItem>
								))}
							</Select>
						</Campo>
					)}
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button variant="outlined" onClick={onCerrar} disabled={enviando}>
						Cancelar
					</Button>
					<Button type="submit" variant="contained" disabled={enviando}>
						{enviando ? 'Guardando…' : modo === 'nuevo' ? 'Crear rol' : modo === 'renombrar' ? 'Guardar' : 'Copiar'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}

DialogoRol.propTypes = {
	modo: PropTypes.oneOf(['nuevo', 'renombrar', 'copiar', null]),
	rol: PropTypes.object,
	roles: PropTypes.array.isRequired,
	idRolActor: PropTypes.number,
	nivelActor: PropTypes.number,
	onCerrar: PropTypes.func.isRequired,
	onCrear: PropTypes.func.isRequired,
	onRenombrar: PropTypes.func.isRequired,
	onCopiar: PropTypes.func.isRequired,
}

export default DialogoRol
