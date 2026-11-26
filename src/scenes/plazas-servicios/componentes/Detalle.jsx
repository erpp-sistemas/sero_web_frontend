// S02-H2.5: panel de detalle de "Plazas y servicios": formulario de la plaza, servicio o proceso seleccionado (o nuevo),
// sus servicios y procesos (plaza), dónde se usa (servicio y proceso) y sus tareas (proceso).
// Los botones salen según permisos (usePuede); el backend vuelve a revisar cada acción.
import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
	Alert,
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { colores } from '../../../tema/seroTheme'
import { ChipEstado, Campo } from '../../usuarios/componentes/comunes'
import { estiloInput } from '../../usuarios/componentes/utilidades'
import { mensajeDeError } from '../../../api/usuariosAdmin'
import { TIPOS, plural, textoHorario } from './utilidadesCatalogo'

// Campos de cada tipo: valores del formulario ↔ API.
const VACIOS = {
	plaza: { nombre: '', estado_republica: '', latitud: '', longitud: '', radius: '', id_horario: '', have_service_public: false, orden: '0' },
	servicio: { nombre: '', orden: '0', icono_app_movil: '' },
	proceso: { nombre: '', url_aplicacion_movil: '' },
}

const aFormulario = (tipo, e) => {
	if (!e) return { ...VACIOS[tipo] }
	const t = (v) => (v === null || v === undefined ? '' : String(v))
	if (tipo === 'plaza')
		return {
			nombre: t(e.nombre),
			estado_republica: t(e.estado_republica),
			latitud: t(e.latitud),
			longitud: t(e.longitud),
			radius: t(e.radius),
			id_horario: t(e.id_horario),
			have_service_public: Boolean(e.have_service_public),
			orden: t(e.orden ?? 0),
		}
	if (tipo === 'servicio') return { nombre: t(e.nombre), orden: t(e.orden ?? 0), icono_app_movil: t(e.icono_app_movil) }
	return { nombre: t(e.nombre), url_aplicacion_movil: t(e.url_aplicacion_movil) }
}

const numeroONulo = (v) => (String(v).trim() === '' ? null : Number(v))

const aApi = (tipo, f) => {
	if (tipo === 'plaza')
		return {
			nombre: f.nombre.trim(),
			estado_republica: f.estado_republica.trim() || null,
			latitud: numeroONulo(f.latitud),
			longitud: numeroONulo(f.longitud),
			radius: numeroONulo(f.radius),
			id_horario: numeroONulo(f.id_horario),
			have_service_public: f.have_service_public,
			orden: numeroONulo(f.orden) ?? 0,
		}
	if (tipo === 'servicio') return { nombre: f.nombre.trim(), orden: numeroONulo(f.orden) ?? 0, icono_app_movil: f.icono_app_movil.trim() || null }
	return { nombre: f.nombre.trim(), url_aplicacion_movil: f.url_aplicacion_movil.trim() || null }
}

// Revisión antes de enviar (el backend vuelve a validar).
const validar = (tipo, f) => {
	const e = {}
	if (f.nombre.trim().length < 2) e.nombre = 'Escribe un nombre de al menos 2 caracteres.'
	const rango = (campo, limite, texto) => {
		if (String(f[campo]).trim() === '') return
		const n = Number(f[campo])
		if (!Number.isFinite(n) || n < -limite || n > limite) e[campo] = texto
	}
	if (tipo === 'plaza') {
		rango('latitud', 90, 'La latitud va de -90 a 90.')
		rango('longitud', 180, 'La longitud va de -180 a 180.')
		if (String(f.radius).trim() !== '' && !(Number.isInteger(Number(f.radius)) && Number(f.radius) >= 0)) e.radius = 'El radio es un número entero de metros.'
	}
	if (tipo !== 'proceso' && String(f.orden).trim() !== '' && !(Number.isInteger(Number(f.orden)) && Number(f.orden) >= 0)) e.orden = 'El orden es un número entero.'
	return e
}

const SoloLectura = ({ etiqueta, valor }) => (
	<Box>
		<Typography sx={{ fontSize: 12, color: colores.texto3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{etiqueta}</Typography>
		<Typography sx={{ fontSize: 14, color: colores.tinta, mt: 0.25, fontFamily: "'JetBrains Mono', monospace", wordBreak: 'break-all' }}>{valor || '—'}</Typography>
	</Box>
)
SoloLectura.propTypes = { etiqueta: PropTypes.string, valor: PropTypes.node }

const Seccion = ({ titulo, accion, children }) => (
	<Box component="section" sx={{ mt: 4, pt: 3, borderTop: `1px solid ${colores.linea}` }}>
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
			<Typography component="h3" sx={{ fontSize: 16, fontWeight: 500, color: colores.tinta }}>
				{titulo}
			</Typography>
			{accion}
		</Box>
		{children}
	</Box>
)
Seccion.propTypes = { titulo: PropTypes.string, accion: PropTypes.node, children: PropTypes.node }

const TablaSimple = ({ etiqueta, columnas, filas, vacio }) =>
	filas.length === 0 ? (
		<Typography sx={{ fontSize: 14, color: colores.texto2 }}>{vacio}</Typography>
	) : (
		<Box sx={{ border: `1px solid ${colores.linea}`, borderRadius: '4px', overflowX: 'auto' }}>
			<Table size="small" aria-label={etiqueta}>
				<TableHead>
					<TableRow>
						{columnas.map((c) => (
							<TableCell key={c.titulo} align={c.derecha ? 'right' : 'left'}>
								{c.titulo}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>{filas}</TableBody>
			</Table>
		</Box>
	)
TablaSimple.propTypes = { etiqueta: PropTypes.string, columnas: PropTypes.array, filas: PropTypes.array, vacio: PropTypes.string }

const Estado = ({ activo }) => <ChipEstado tipo={activo ? 'exito' : 'neutro'}>{activo ? 'Activo' : 'Inactivo'}</ChipEstado>
Estado.propTypes = { activo: PropTypes.bool }

// ---------------------------------------------------------------------------------------------
// Diálogos pequeños: agregar servicio y proceso a una plaza; nueva tarea o cambiar su nombre

const DialogoCombinacion = ({ abierto, plaza, catalogo, onCerrar, onGuardar }) => {
	const [idServicio, setIdServicio] = useState('')
	const [idProceso, setIdProceso] = useState('')
	const [error, setError] = useState('')
	const [guardando, setGuardando] = useState(false)
	useEffect(() => {
		if (abierto) {
			setIdServicio('')
			setIdProceso('')
			setError('')
			setGuardando(false)
		}
	}, [abierto])
	const ya = new Set(plaza?.combinaciones.map((c) => `${c.id_servicio}-${c.id_proceso}`) ?? [])
	const repetida = idServicio && idProceso && ya.has(`${idServicio}-${idProceso}`)
	const guardar = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		if (!idServicio || !idProceso) return setError('Elige un servicio y un proceso.')
		if (repetida) return setError('Esta plaza ya tiene ese servicio con ese proceso.')
		setGuardando(true)
		try {
			await onGuardar(Number(idServicio), Number(idProceso))
		} catch (err) {
			setError(mensajeDeError(err))
			setGuardando(false)
		}
	}
	return (
		<Dialog open={abierto} onClose={guardando ? undefined : onCerrar} maxWidth="xs" fullWidth aria-labelledby="titulo-combinacion">
			<form onSubmit={guardar} noValidate>
				<DialogTitle id="titulo-combinacion" sx={{ fontSize: 18, fontWeight: 500 }}>
					Agregar servicio y proceso a {plaza?.nombre}
				</DialogTitle>
				<DialogContent>
					<Typography sx={{ fontSize: 13, color: colores.texto2, mb: 2 }}>
						Los servicios y procesos son los mismos para todas las plazas. Si falta uno, créalo primero en el catálogo general.
					</Typography>
					<Campo id="combinacion-servicio" etiqueta="Servicio" obligatorio>
						<Select id="combinacion-servicio" value={idServicio} onChange={(e) => setIdServicio(e.target.value)} displayEmpty fullWidth size="small" sx={{ height: 40 }}>
							<MenuItem value="" disabled>
								Elige un servicio
							</MenuItem>
							{catalogo.servicios.filter((s) => s.activo).map((s) => (
								<MenuItem key={s.id_servicio} value={String(s.id_servicio)}>
									{s.nombre}
								</MenuItem>
							))}
						</Select>
					</Campo>
					<Campo id="combinacion-proceso" etiqueta="Proceso" obligatorio sx={{ mt: 2 }}>
						<Select id="combinacion-proceso" value={idProceso} onChange={(e) => setIdProceso(e.target.value)} displayEmpty fullWidth size="small" sx={{ height: 40 }}>
							<MenuItem value="" disabled>
								Elige un proceso
							</MenuItem>
							{catalogo.procesos.filter((p) => p.activo).map((p) => (
								<MenuItem key={p.id_proceso} value={String(p.id_proceso)}>
									{p.nombre}
								</MenuItem>
							))}
						</Select>
					</Campo>
					{(error || repetida) && (
						<Alert severity="error" sx={{ mt: 2 }}>
							{error || 'Esta plaza ya tiene ese servicio con ese proceso.'}
						</Alert>
					)}
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button variant="outlined" onClick={onCerrar} disabled={guardando}>
						Cancelar
					</Button>
					<Button type="submit" variant="contained" disabled={guardando}>
						{guardando ? 'Agregando…' : 'Agregar'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}
DialogoCombinacion.propTypes = { abierto: PropTypes.bool, plaza: PropTypes.object, catalogo: PropTypes.object, onCerrar: PropTypes.func, onGuardar: PropTypes.func }

const DialogoTarea = ({ abierto, tarea, proceso, onCerrar, onGuardar }) => {
	const [nombre, setNombre] = useState('')
	const [error, setError] = useState('')
	const [guardando, setGuardando] = useState(false)
	useEffect(() => {
		if (abierto) {
			setNombre(tarea?.nombre ?? '')
			setError('')
			setGuardando(false)
		}
	}, [abierto, tarea])
	const guardar = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		if (nombre.trim().length < 2) return setError('Escribe un nombre de al menos 2 caracteres.')
		setGuardando(true)
		try {
			await onGuardar(nombre.trim())
		} catch (err) {
			setError(mensajeDeError(err))
			setGuardando(false)
		}
	}
	return (
		<Dialog open={abierto} onClose={guardando ? undefined : onCerrar} maxWidth="xs" fullWidth aria-labelledby="titulo-tarea">
			<form onSubmit={guardar} noValidate>
				<DialogTitle id="titulo-tarea" sx={{ fontSize: 18, fontWeight: 500 }}>
					{tarea ? 'Cambiar nombre de la tarea' : `Nueva tarea en ${proceso?.nombre}`}
				</DialogTitle>
				<DialogContent>
					<Campo id="tarea-nombre" etiqueta="Nombre" obligatorio error={error}>
						<OutlinedInput
							id="tarea-nombre"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							fullWidth
							autoFocus
							inputProps={{ maxLength: 100, 'aria-invalid': Boolean(error), 'aria-describedby': error ? 'tarea-nombre-error' : undefined }}
							sx={estiloInput}
						/>
					</Campo>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button variant="outlined" onClick={onCerrar} disabled={guardando}>
						Cancelar
					</Button>
					<Button type="submit" variant="contained" disabled={guardando}>
						{guardando ? 'Guardando…' : 'Guardar'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}
DialogoTarea.propTypes = { abierto: PropTypes.bool, tarea: PropTypes.object, proceso: PropTypes.object, onCerrar: PropTypes.func, onGuardar: PropTypes.func }

// ---------------------------------------------------------------------------------------------

const Detalle = ({ tipo, elemento, nuevo, catalogo, idPlazaContexto, puede, puedeCrearPlaza, onGuardar, onEstado, onCombinacion, onTarea, onVolver, onCancelarNuevo, onSeleccionar, onCambios }) => {
	const t = TIPOS[tipo]
	const original = useMemo(() => aFormulario(tipo, nuevo ? null : elemento), [tipo, elemento, nuevo])
	const [form, setForm] = useState(original)
	const [errores, setErrores] = useState({})
	const [error, setError] = useState('')
	const [guardando, setGuardando] = useState(false)
	const [dialogo, setDialogo] = useState(null) // 'combinacion' | { tarea } | 'tarea-nueva'

	useEffect(() => {
		setForm(original)
		setErrores({})
		setError('')
	}, [original])

	const cambios = JSON.stringify(form) !== JSON.stringify(original)
	useEffect(() => onCambios(cambios), [cambios, onCambios])

	const puedeGuardar = nuevo ? (tipo === 'plaza' ? puedeCrearPlaza : puede(t.recurso, 'create')) : puede(t.recurso, 'update')
	const puedeEstado = !nuevo && puede(t.recurso, 'deactivate')
	const lectura = !puedeGuardar

	const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

	const guardar = async (e) => {
		e.preventDefault()
		const errs = validar(tipo, form)
		setErrores(errs)
		if (Object.keys(errs).length) {
			document.getElementById(`campo-${Object.keys(errs)[0]}`)?.focus()
			return
		}
		setGuardando(true)
		setError('')
		try {
			await onGuardar(aApi(tipo, form))
		} catch (err) {
			setError(mensajeDeError(err))
		} finally {
			setGuardando(false)
		}
	}

	const entrada = (campo, etiqueta, props = {}) => (
		<Campo id={`campo-${campo}`} etiqueta={etiqueta} obligatorio={props.obligatorio} error={errores[campo]} ayuda={props.ayuda} sx={props.sx}>
			<OutlinedInput
				id={`campo-${campo}`}
				value={form[campo]}
				onChange={cambiar(campo)}
				fullWidth
				readOnly={lectura}
				inputProps={{
					maxLength: props.max ?? 100,
					inputMode: props.numerico ? 'decimal' : undefined,
					'aria-invalid': Boolean(errores[campo]),
					'aria-describedby': errores[campo] ? `campo-${campo}-error` : props.ayuda ? `campo-${campo}-ayuda` : undefined,
				}}
				sx={{ ...estiloInput, ...(lectura ? { color: colores.texto2, bgcolor: colores.banda } : {}), ...(props.numerico ? { '& input': { ...estiloInput['& input'], fontVariantNumeric: 'tabular-nums' } } : {}) }}
			/>
		</Campo>
	)

	const servicios = new Map(catalogo.servicios.map((s) => [s.id_servicio, s]))
	const procesos = new Map(catalogo.procesos.map((p) => [p.id_proceso, p]))
	const usos =
		!nuevo && (tipo === 'servicio' || tipo === 'proceso')
			? catalogo.plazas.flatMap((p) =>
					p.combinaciones
						.filter((c) => c[t.idCampo] === elemento[t.idCampo])
						.map((c) => ({ plaza: p, servicio: servicios.get(c.id_servicio), proceso: procesos.get(c.id_proceso), personas: c.personas, clave: c.id_plaza_servicio_proceso })),
				)
			: []
	const tareas = !nuevo && tipo === 'proceso' ? catalogo.tareas.filter((x) => x.id_proceso === elemento.id_proceso) : []
	const plazaContexto = idPlazaContexto ? catalogo.plazas.find((p) => p.id_plaza === idPlazaContexto) : null

	const titulo = nuevo ? { plaza: 'Nueva plaza', servicio: 'Nuevo servicio', proceso: 'Nuevo proceso' }[tipo] : elemento.nombre

	return (
		<Box>
			{onVolver && (
				<Button variant="text" startIcon={<ArrowBackIcon />} onClick={onVolver} sx={{ mb: 1, px: 1, height: 36, color: colores.marino, fontWeight: 400 }}>
					Plazas y servicios
				</Button>
			)}
			<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="overline" component="p" sx={{ textTransform: 'uppercase', display: 'block' }}>
						{t.nombre}
						{plazaContexto && !nuevo ? ` · en ${plazaContexto.nombre}` : ''}
					</Typography>
					<Typography component="h2" sx={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.01em', color: colores.tinta, overflowWrap: 'anywhere' }}>
						{titulo}
					</Typography>
				</Box>
				{!nuevo && (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
						<Estado activo={elemento.activo} />
						{puedeEstado && (
							<Button
								variant="outlined"
								onClick={() => onEstado(tipo, elemento, !elemento.activo)}
								sx={elemento.activo ? { color: '#B42318', borderColor: '#F3C5C1', height: 36 } : { height: 36 }}
							>
								{elemento.activo ? 'Desactivar' : 'Activar'}
							</Button>
						)}
					</Box>
				)}
			</Box>

			{nuevo && tipo === 'plaza' && (
				<Alert severity="info" sx={{ mt: 2 }}>
					La base de la plaza la crea Sistemas. Hasta entonces la plaza existe en el catálogo, pero no tendrá padrón, asignaciones ni gestiones.
				</Alert>
			)}
			{!nuevo && (tipo === 'servicio' || tipo === 'proceso') && usos.length > 1 && (
				<Typography sx={{ fontSize: 13, color: colores.texto2, mt: 1 }}>
					Se usa en {plural(new Set(usos.map((u) => u.plaza.id_plaza)).size, 'plaza', 'plazas')}: los cambios se ven en todas.
				</Typography>
			)}
			{lectura && (
				<Typography sx={{ fontSize: 13, color: colores.texto2, mt: 1 }}>Solo lectura: no tienes permiso para {nuevo ? 'crear' : 'editar'} {t.nombre === 'plaza' ? 'plazas' : `${t.nombre}s`}.</Typography>
			)}

			<Box component="form" onSubmit={guardar} noValidate sx={{ mt: 3 }}>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
					{entrada('nombre', 'Nombre', { obligatorio: true, sx: { gridColumn: { sm: '1 / -1' } } })}
					{tipo === 'plaza' && (
						<>
							{entrada('estado_republica', 'Estado de la República')}
							<Campo id="campo-id_horario" etiqueta="Horario">
								<Select
									id="campo-id_horario"
									value={form.id_horario}
									onChange={cambiar('id_horario')}
									displayEmpty
									fullWidth
									size="small"
									readOnly={lectura}
									sx={{ height: 40, ...(lectura ? { bgcolor: colores.banda } : {}) }}
								>
									<MenuItem value="">Sin horario</MenuItem>
									{catalogo.horarios.map((h) => (
										<MenuItem key={h.id_horario} value={String(h.id_horario)}>
											{textoHorario(h)}
										</MenuItem>
									))}
								</Select>
							</Campo>
							{entrada('latitud', 'Latitud', { numerico: true, max: 20 })}
							{entrada('longitud', 'Longitud', { numerico: true, max: 20 })}
							{entrada('radius', 'Radio (metros)', { numerico: true, max: 10 })}
							{entrada('orden', 'Orden', { numerico: true, max: 6 })}
							<FormControlLabel
								sx={{ gridColumn: { sm: '1 / -1' }, ml: 0 }}
								control={<Checkbox checked={form.have_service_public} onChange={cambiar('have_service_public')} disabled={lectura} />}
								label={<Typography sx={{ fontSize: 14, color: colores.tinta }}>La app ofrece servicios públicos en esta plaza</Typography>}
							/>
						</>
					)}
					{tipo === 'servicio' && (
						<>
							{entrada('icono_app_movil', 'Ícono en la app', { ayuda: 'Nombre del ícono que muestra la app (p. ej. home, water).' })}
							{entrada('orden', 'Orden', { numerico: true, max: 6 })}
						</>
					)}
					{tipo === 'proceso' && (
						<>
							{entrada('url_aplicacion_movil', 'Pantalla en la app', { ayuda: 'Nombre de la pantalla de la app para este proceso.', sx: { gridColumn: { sm: '1 / -1' } } })}
							{!nuevo && (
								<>
									<SoloLectura etiqueta="Tabla de gestión" valor={elemento.tabla_gestion} />
									<SoloLectura etiqueta="Procedimiento del reporte" valor={elemento.procedimiento_almacenado_gestion} />
								</>
							)}
						</>
					)}
				</Box>
				{(tipo === 'proceso' || tipo === 'servicio' || tipo === 'plaza') && !nuevo && (
					<Typography sx={{ fontSize: 12, color: colores.texto3, mt: 2 }}>La imagen se cambia más adelante (pendiente H0.7).</Typography>
				)}
				{error && (
					<Alert severity="error" sx={{ mt: 2 }} role="alert">
						{error}
					</Alert>
				)}
				{puedeGuardar && (
					<Box sx={{ display: 'flex', gap: 1, mt: 3, flexWrap: 'wrap' }}>
						<Button type="submit" variant="contained" disabled={guardando || (!nuevo && !cambios)}>
							{guardando ? 'Guardando…' : nuevo ? `Crear ${t.nombre}` : 'Guardar cambios'}
						</Button>
						{(cambios || nuevo) && (
							<Button variant="outlined" onClick={nuevo ? onCancelarNuevo : () => setForm(original)} disabled={guardando}>
								{nuevo ? 'Cancelar' : 'Descartar cambios'}
							</Button>
						)}
					</Box>
				)}
			</Box>

			{!nuevo && tipo === 'plaza' && (
				<Seccion
					titulo="Servicios y procesos"
					accion={
						puede('plazas', 'update') && (
							<Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDialogo('combinacion')} sx={{ height: 36 }}>
								Agregar servicio y proceso
							</Button>
						)
					}
				>
					<TablaSimple
						etiqueta={`Servicios y procesos de ${elemento.nombre}`}
						columnas={[{ titulo: 'Servicio' }, { titulo: 'Proceso' }, { titulo: 'Personas', derecha: true }]}
						vacio="Esta plaza todavía no tiene servicios ni procesos."
						filas={[...elemento.combinaciones]
							.map((c) => ({ c, s: servicios.get(c.id_servicio), p: procesos.get(c.id_proceso) }))
							.sort((a, b) => `${a.s?.nombre}${a.p?.nombre}`.localeCompare(`${b.s?.nombre}${b.p?.nombre}`, 'es'))
							.map(({ c, s, p }) => (
								<TableRow key={c.id_plaza_servicio_proceso} hover>
									<TableCell>
										<Button variant="text" onClick={() => onSeleccionar({ tipo: 'servicio', id: c.id_servicio, idPlaza: elemento.id_plaza })} sx={{ p: 0, minWidth: 0, height: 'auto', fontWeight: 400, color: colores.marino }}>
											{s?.nombre}
										</Button>
										{s && !s.activo && <Box component="span" sx={{ ml: 1 }}><Estado activo={false} /></Box>}
									</TableCell>
									<TableCell>
										<Button variant="text" onClick={() => onSeleccionar({ tipo: 'proceso', id: c.id_proceso, idPlaza: elemento.id_plaza })} sx={{ p: 0, minWidth: 0, height: 'auto', fontWeight: 400, color: colores.marino }}>
											{p?.nombre}
										</Button>
										{p && !p.activo && <Box component="span" sx={{ ml: 1 }}><Estado activo={false} /></Box>}
									</TableCell>
									<TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
										{c.personas}
									</TableCell>
								</TableRow>
							))}
					/>
					<Typography sx={{ fontSize: 12, color: colores.texto3, mt: 1 }}>Quitar un servicio o proceso de la plaza llegará después; por ahora solo se agregan.</Typography>
				</Seccion>
			)}

			{!nuevo && (tipo === 'servicio' || tipo === 'proceso') && (
				<Seccion titulo="Dónde se usa">
					<TablaSimple
						etiqueta={`Plazas donde se usa ${elemento.nombre}`}
						columnas={[{ titulo: 'Plaza' }, { titulo: tipo === 'servicio' ? 'Proceso' : 'Servicio' }, { titulo: 'Personas', derecha: true }]}
						vacio="Todavía no está en ninguna plaza. Agrégalo desde el detalle de una plaza."
						filas={usos.map((u) => (
							<TableRow key={u.clave} hover>
								<TableCell>
									<Button variant="text" onClick={() => onSeleccionar({ tipo: 'plaza', id: u.plaza.id_plaza })} sx={{ p: 0, minWidth: 0, height: 'auto', fontWeight: 400, color: colores.marino }}>
										{u.plaza.nombre}
									</Button>
								</TableCell>
								<TableCell>{tipo === 'servicio' ? u.proceso?.nombre : u.servicio?.nombre}</TableCell>
								<TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
									{u.personas}
								</TableCell>
							</TableRow>
						))}
					/>
				</Seccion>
			)}

			{!nuevo && tipo === 'proceso' && (
				<Seccion
					titulo="Tareas"
					accion={
						puede('tareas', 'create') && (
							<Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDialogo('tarea-nueva')} sx={{ height: 36 }}>
								Nueva tarea
							</Button>
						)
					}
				>
					<TablaSimple
						etiqueta={`Tareas de ${elemento.nombre}`}
						columnas={[{ titulo: 'Tarea' }, { titulo: 'Estado' }, { titulo: 'Acciones', derecha: true }]}
						vacio="Este proceso no tiene tareas."
						filas={tareas.map((x) => (
							<TableRow key={x.id_tarea} hover>
								<TableCell sx={{ color: x.activo ? colores.tinta : colores.texto3 }}>{x.nombre}</TableCell>
								<TableCell>
									<Estado activo={x.activo} />
								</TableCell>
								<TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
									{puede('tareas', 'update') && (
										<Button variant="text" onClick={() => setDialogo({ tarea: x })} sx={{ height: 32, fontWeight: 400, color: colores.marino }}>
											Cambiar nombre
										</Button>
									)}
									{puede('tareas', 'deactivate') && (
										<Button
											variant="text"
											onClick={() => onEstado('tarea', x, !x.activo)}
											sx={{ height: 32, fontWeight: 400, color: x.activo ? '#B42318' : colores.marino }}
										>
											{x.activo ? 'Desactivar' : 'Activar'}
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					/>
				</Seccion>
			)}

			<DialogoCombinacion
				abierto={dialogo === 'combinacion'}
				plaza={tipo === 'plaza' ? elemento : null}
				catalogo={catalogo}
				onCerrar={() => setDialogo(null)}
				onGuardar={async (s, p) => {
					await onCombinacion(elemento.id_plaza, s, p)
					setDialogo(null)
				}}
			/>
			<DialogoTarea
				abierto={dialogo === 'tarea-nueva' || Boolean(dialogo?.tarea)}
				tarea={dialogo?.tarea ?? null}
				proceso={tipo === 'proceso' ? elemento : null}
				onCerrar={() => setDialogo(null)}
				onGuardar={async (nombre) => {
					await onTarea(dialogo?.tarea ?? null, nombre, elemento?.id_proceso)
					setDialogo(null)
				}}
			/>
		</Box>
	)
}

Detalle.propTypes = {
	tipo: PropTypes.oneOf(['plaza', 'servicio', 'proceso']).isRequired,
	elemento: PropTypes.object,
	nuevo: PropTypes.bool,
	catalogo: PropTypes.object.isRequired,
	idPlazaContexto: PropTypes.number,
	puede: PropTypes.func.isRequired,
	puedeCrearPlaza: PropTypes.bool,
	onGuardar: PropTypes.func.isRequired,
	onEstado: PropTypes.func.isRequired,
	onCombinacion: PropTypes.func.isRequired,
	onTarea: PropTypes.func.isRequired,
	onVolver: PropTypes.func,
	onCancelarNuevo: PropTypes.func,
	onSeleccionar: PropTypes.func.isRequired,
	onCambios: PropTypes.func.isRequired,
}

export default Detalle
