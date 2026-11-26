// S02-H2.6: Roles y permisos. Lista de roles (de siempre y personalizados) y, por rol, la matriz de permisos:
// grupos y pantallas en filas, acciones en columnas. Guardar pide una vista previa ("Afecta a N personas: quién gana
// o pierde qué") y se confirma con la versión vista (si alguien más cambió el rol, avisa y vuelve a calcular).
// Reemplaza a las pantallas viejas /roles y /permission (que escribían en db_prueba).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
	Alert,
	Box,
	Button,
	ButtonBase,
	MenuItem,
	Select,
	Skeleton,
	Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import TemaSero from '../../tema/TemaSero'
import { colores } from '../../tema/seroTheme'
import useMisPermisos from '../../hooks/useMisPermisos'
import { mensajeDeError } from '../../api/usuariosAdmin'
import {
	listarRolesRequest,
	obtenerCatalogoRolesRequest,
	obtenerRolRequest,
	vistaPreviaRolRequest,
	guardarPermisosRolRequest,
	crearRolRequest,
	editarRolRequest,
	cambiarEstadoRolRequest,
} from '../../api/rolesAdmin'
import { EncabezadoPagina, EstadoPantalla, ChipEstado } from '../usuarios/componentes/comunes'
import { focoVisible } from '../usuarios/componentes/utilidades'
import AvisoCambiosSinGuardar from '../usuarios/componentes/AvisoCambiosSinGuardar'
import CuadriculaPermisos from '../../components/permisos/CuadriculaPermisos'
import { aplicarCambio, dependenciasDe, nombrePermiso } from '../../components/permisos/arbolPermisos'
import DialogoVistaPrevia from './componentes/DialogoVistaPrevia'
import DialogoRol from './componentes/DialogoRol'
import DialogoConfirmar from './componentes/DialogoConfirmar'

const mismoConjunto = (a, b) => a.size === b.size && [...a].every((x) => b.has(x))

const ItemRol = ({ rol, elegido, onElegir }) => (
	<ButtonBase
		onClick={onElegir}
		aria-current={elegido ? 'true' : undefined}
		sx={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			width: '100%',
			textAlign: 'left',
			px: 2,
			py: 1.25,
			borderBottom: `1px solid ${colores.linea}`,
			borderLeft: `2px solid ${elegido ? colores.verde : 'transparent'}`,
			bgcolor: elegido ? colores.seleccion : colores.blanco,
			'&:hover': { bgcolor: elegido ? colores.seleccion : colores.banda },
			...focoVisible,
		}}
	>
		<Typography sx={{ fontSize: 14, fontWeight: 500, color: colores.tinta }}>{rol.nombre}</Typography>
		<Typography sx={{ fontSize: 12, color: colores.texto3, fontFeatureSettings: '"tnum"' }}>
			{rol.personas} persona{rol.personas === 1 ? '' : 's'} · {rol.permisos} permisos
			{rol.es_personalizado ? ` · sobre ${rol.rol_base}` : ''}
		</Typography>
		{(rol.es_heredado || !rol.activo || rol.solo_app) && (
			<Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
				{rol.es_heredado && <ChipEstado tipo="neutro">Heredado</ChipEstado>}
				{rol.solo_app && <ChipEstado tipo="neutro">Solo app</ChipEstado>}
				{!rol.activo && <ChipEstado tipo="advertencia">Desactivado</ChipEstado>}
			</Box>
		)}
	</ButtonBase>
)

ItemRol.propTypes = {
	rol: PropTypes.shape({
		nombre: PropTypes.string,
		personas: PropTypes.number,
		permisos: PropTypes.number,
		es_personalizado: PropTypes.bool,
		rol_base: PropTypes.string,
		es_heredado: PropTypes.bool,
		activo: PropTypes.bool,
		solo_app: PropTypes.bool,
	}).isRequired,
	elegido: PropTypes.bool,
	onElegir: PropTypes.func.isRequired,
}

const RolesPermisos = () => {
	const misPermisos = useMisPermisos()
	const navigate = useNavigate()
	const [params] = useSearchParams()
	const idElegido = Number(params.get('rol')) || null

	const [roles, setRoles] = useState(null)
	const [catalogo, setCatalogo] = useState(null)
	const [carga, setCarga] = useState({ cargando: true, error: null, sinPermiso: false })
	const [rol, setRol] = useState(null) // detalle del rol elegido
	const [cargandoRol, setCargandoRol] = useState(false)
	const [borrador, setBorrador] = useState(new Set())
	const [vista, setVista] = useState(null) // vista previa
	const [calculando, setCalculando] = useState(false)
	const [guardando, setGuardando] = useState(false)
	const [aviso, setAviso] = useState(null)
	const [dialogo, setDialogo] = useState(null) // 'nuevo' | 'renombrar' | 'desactivar' | 'activar' | 'copiar'
	const [intento, setIntento] = useState(0)
	const salidaPermitida = useRef(false)
	const avisoAlCambiar = useRef(null) // aviso que debe mostrarse después de cambiar de rol (p. ej. al crear uno)

	const puedeLeer = misPermisos.puede('roles', 'read')
	const puedeCrear = misPermisos.puede('roles', 'create')
	const puedeActualizar = misPermisos.puede('roles', 'update')
	const puedeDesactivar = misPermisos.puede('roles', 'deactivate')

	const cargarRoles = useCallback(() => listarRolesRequest().then(({ data }) => setRoles(data)), [])

	useEffect(() => {
		if (misPermisos.cargando || !puedeLeer) return undefined
		let vigente = true
		setCarga({ cargando: true, error: null, sinPermiso: false })
		Promise.all([listarRolesRequest(), obtenerCatalogoRolesRequest()])
			.then(([r, c]) => {
				if (!vigente) return
				setRoles(r.data)
				setCatalogo(c.data)
				setCarga({ cargando: false, error: null, sinPermiso: false })
			})
			.catch((error) => {
				if (!vigente) return
				const sinPermiso = error?.response?.status === 403
				setCarga({ cargando: false, error: sinPermiso ? null : mensajeDeError(error), sinPermiso })
			})
		return () => {
			vigente = false
		}
	}, [misPermisos.cargando, puedeLeer, intento])

	// Rol elegido (por omisión, el primero de la lista)
	useEffect(() => {
		if (!roles?.length) return
		if (!idElegido || !roles.some((r) => r.id_rol === idElegido)) navigate(`/roles-y-permisos?rol=${roles[0].id_rol}`, { replace: true })
	}, [roles, idElegido, navigate])

	const cargarRol = useCallback(async (id) => {
		setCargandoRol(true)
		try {
			const { data } = await obtenerRolRequest(id)
			setRol(data)
			setBorrador(new Set(data.permisos))
		} catch (error) {
			setAviso({ tipo: 'error', texto: mensajeDeError(error) })
		} finally {
			setCargandoRol(false)
		}
	}, [])

	// Se carga al cambiar de rol (no al refrescar la lista después de guardar, que borraría el aviso)
	const rolExiste = Boolean(idElegido && roles?.some((r) => r.id_rol === idElegido))
	useEffect(() => {
		if (rolExiste) {
			setAviso(avisoAlCambiar.current)
			avisoAlCambiar.current = null
			cargarRol(idElegido)
		}
	}, [idElegido, rolExiste, cargarRol])

	const grupos = useMemo(() => catalogo?.grupos ?? [], [catalogo])
	const acciones = useMemo(() => catalogo?.acciones ?? [], [catalogo])
	const deps = useMemo(() => dependenciasDe(grupos), [grupos])
	const original = useMemo(() => new Set(rol?.permisos ?? []), [rol])
	const hayCambios = Boolean(rol) && !mismoConjunto(original, borrador)
	const agregados = [...borrador].filter((c) => !original.has(c))
	const quitados = [...original].filter((c) => !borrador.has(c))

	const editable = Boolean(rol?.puede_editar) && puedeActualizar && (rol.activo || !rol.es_personalizado)
	const motivoSoloLectura = !rol
		? null
		: !puedeActualizar
			? 'Solo lectura: no tienes permiso para cambiar roles.'
			: !rol.puede_editar
				? [1, 9].includes(rol.es_personalizado ? rol.id_rol_base : rol.id_rol)
					? 'Solo un Superadmin puede cambiar este rol.'
					: 'No puedes cambiar un rol de mayor nivel que el tuyo.'
				: rol.es_personalizado && !rol.activo
					? 'Rol desactivado: actívalo para cambiar sus permisos.'
					: null

	const nombre = (codigo) => nombrePermiso(codigo, grupos, acciones)

	const revisar = async () => {
		setCalculando(true)
		setAviso(null)
		try {
			const { data } = await vistaPreviaRolRequest(rol.id_rol, [...borrador])
			setVista(data)
		} catch (error) {
			setAviso({ tipo: 'error', texto: mensajeDeError(error) })
		} finally {
			setCalculando(false)
		}
	}

	const guardar = async () => {
		setGuardando(true)
		try {
			const { data } = await guardarPermisosRolRequest(rol.id_rol, [...borrador], vista.version)
			setVista(null)
			await Promise.all([cargarRol(rol.id_rol), cargarRoles()])
			misPermisos.recargar()
			setAviso({
				tipo: 'success',
				texto: `Se guardaron los permisos de ${rol.nombre}: ${data.agregados.length} agregado${data.agregados.length === 1 ? '' : 's'}, ${data.quitados.length} quitado${data.quitados.length === 1 ? '' : 's'}. Afectó a ${data.personas_afectadas} persona${data.personas_afectadas === 1 ? '' : 's'}.`,
			})
		} catch (error) {
			if (error?.response?.status === 409) {
				// Alguien más lo cambió: se recalcula la vista previa con la versión actual
				try {
					const { data } = await vistaPreviaRolRequest(rol.id_rol, [...borrador])
					setVista({ ...data, aviso: 'Otra persona cambió este rol mientras revisabas. Esta es la vista previa actualizada: revísala antes de guardar.' })
				} catch (e2) {
					setVista(null)
					setAviso({ tipo: 'error', texto: mensajeDeError(e2) })
				}
			} else {
				setVista(null)
				setAviso({ tipo: 'error', texto: mensajeDeError(error) })
			}
		} finally {
			setGuardando(false)
		}
	}

	const crear = async (datos) => {
		const { data } = await crearRolRequest(datos)
		await cargarRoles()
		setDialogo(null)
		avisoAlCambiar.current = { tipo: 'success', texto: `Se creó el rol ${datos.nombre}. Ajusta sus permisos y asígnalo desde Usuarios.` }
		salidaPermitida.current = true
		navigate(`/roles-y-permisos?rol=${data.id_rol}`)
		salidaPermitida.current = false
	}

	const renombrar = async (datos) => {
		await editarRolRequest(rol.id_rol, { ...datos, version: rol.version })
		await Promise.all([cargarRol(rol.id_rol), cargarRoles()])
		setDialogo(null)
		setAviso({ tipo: 'success', texto: 'Se guardó el nombre del rol.' })
	}

	const cambiarEstado = async (activo) => {
		try {
			await cambiarEstadoRolRequest(rol.id_rol, activo)
			await Promise.all([cargarRol(rol.id_rol), cargarRoles()])
			setAviso({ tipo: 'success', texto: activo ? 'Rol activado.' : 'Rol desactivado: ya no se puede asignar.' })
		} catch (error) {
			setAviso({ tipo: 'error', texto: mensajeDeError(error) })
		} finally {
			setDialogo(null)
		}
	}

	const copiarDe = async (idOrigen) => {
		try {
			const { data } = await obtenerRolRequest(idOrigen)
			// Solo lo que quien edita puede dar (lo que el rol ya tenía se respeta)
			const permitidos = data.permisos.filter((c) => misPermisos.permisos.has(c) || original.has(c))
			setBorrador(new Set(permitidos))
			setAviso({
				tipo: 'info',
				texto: `Se copiaron los permisos de ${data.nombre}${permitidos.length < data.permisos.length ? ` (menos ${data.permisos.length - permitidos.length} que tú no tienes)` : ''}. Revisa y guarda.`,
			})
		} catch (error) {
			setAviso({ tipo: 'error', texto: mensajeDeError(error) })
		} finally {
			setDialogo(null)
		}
	}

	const elegir = (id) => navigate(`/roles-y-permisos?rol=${id}`)

	// ----------------------------------------------------------------------------------------
	let contenido
	if (misPermisos.cargando || (puedeLeer && carga.cargando)) {
		contenido = (
			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 3 }}>
				<Skeleton variant="rectangular" height={360} sx={{ borderRadius: '4px' }} />
				<Skeleton variant="rectangular" height={360} sx={{ borderRadius: '4px' }} />
			</Box>
		)
	} else if (misPermisos.error) {
		contenido = (
			<EstadoPantalla icono={ErrorOutlineIcon} titulo="No se pudieron revisar tus permisos" descripcion="Revisa tu conexión e intenta de nuevo." accion={<Button variant="outlined" onClick={() => misPermisos.recargar()}>Reintentar</Button>} />
		)
	} else if (!puedeLeer || carga.sinPermiso) {
		contenido = <EstadoPantalla icono={LockOutlinedIcon} titulo="No tienes acceso a roles y permisos" descripcion="Pide a un administrador el permiso “Roles: ver”." />
	} else if (carga.error) {
		contenido = <EstadoPantalla icono={ErrorOutlineIcon} titulo="No se pudieron cargar los roles" descripcion={carga.error} accion={<Button variant="outlined" onClick={() => setIntento((n) => n + 1)}>Reintentar</Button>} />
	} else if (!roles?.length) {
		contenido = <EstadoPantalla icono={ShieldOutlinedIcon} titulo="Todavía no hay roles" descripcion="Crea el primero para asignarle permisos." />
	} else {
		contenido = (
			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '280px minmax(0, 1fr)' }, gap: 3, alignItems: 'start' }}>
				{/* Lista de roles (en celular, un selector) */}
				<Box sx={{ display: { xs: 'none', md: 'block' }, border: `1px solid ${colores.linea}`, borderRadius: '4px', overflow: 'hidden', bgcolor: colores.blanco }}>
					<Typography sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: colores.texto3, px: 2, py: 1, bgcolor: colores.banda, borderBottom: `1px solid ${colores.linea}` }}>
						Roles
					</Typography>
					<Box component="nav" aria-label="Roles">
						{roles.map((r) => (
							<ItemRol key={r.id_rol} rol={r} elegido={r.id_rol === idElegido} onElegir={() => elegir(r.id_rol)} />
						))}
					</Box>
				</Box>
				<Box sx={{ display: { xs: 'block', md: 'none' } }}>
					<Typography component="label" htmlFor="rol-movil" sx={{ display: 'block', fontSize: 14, color: colores.tinta, mb: 0.75 }}>
						Rol
					</Typography>
					<Select id="rol-movil" value={idElegido ?? ''} onChange={(e) => elegir(e.target.value)} fullWidth size="small" sx={{ height: 40, bgcolor: colores.blanco }}>
						{roles.map((r) => (
							<MenuItem key={r.id_rol} value={r.id_rol}>
								{r.nombre} · {r.personas} persona{r.personas === 1 ? '' : 's'}
							</MenuItem>
						))}
					</Select>
				</Box>

				{/* Matriz del rol */}
				<Box sx={{ minWidth: 0 }}>
					{!rol || cargandoRol ? (
						<Skeleton variant="rectangular" height={420} sx={{ borderRadius: '4px' }} />
					) : (
						<>
							<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
								<Box sx={{ minWidth: 0 }}>
									<Typography component="h2" sx={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.01em', color: colores.tinta }}>
										{rol.nombre}
									</Typography>
									<Typography sx={{ fontSize: 14, color: colores.texto2, mt: 0.5 }}>
										{rol.es_personalizado
											? `Rol personalizado sobre ${rol.rol_base}: cambia solo los permisos web; para reportes y la app sigue siendo ${rol.rol_base}.`
											: rol.descripcion || 'Rol de siempre.'}
									</Typography>
								</Box>
								{editable && (
									<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
										<Button variant="outlined" size="small" onClick={() => setDialogo('copiar')} sx={{ height: 32, ...focoVisible }}>
											Copiar de otro rol
										</Button>
										<Button variant="outlined" size="small" onClick={() => setDialogo('renombrar')} sx={{ height: 32, ...focoVisible }}>
											Cambiar nombre
										</Button>
										{rol.es_personalizado && puedeDesactivar && (
											<Button variant="outlined" size="small" color="error" onClick={() => setDialogo('desactivar')} sx={{ height: 32, ...focoVisible }}>
												Desactivar
											</Button>
										)}
									</Box>
								)}
								{rol.es_personalizado && !rol.activo && rol.puede_editar && puedeDesactivar && (
									<Button variant="outlined" size="small" onClick={() => setDialogo('activar')} sx={{ height: 32, ...focoVisible }}>
										Activar
									</Button>
								)}
							</Box>

							{motivoSoloLectura && (
								<Alert severity="info" sx={{ mb: 2 }}>
									{motivoSoloLectura}
								</Alert>
							)}
							{aviso && (
								<Alert severity={aviso.tipo} role={aviso.tipo === 'error' ? 'alert' : 'status'} sx={{ mb: 2 }} onClose={() => setAviso(null)}>
									{aviso.texto}
								</Alert>
							)}

							<CuadriculaPermisos
								idTabla="matriz-rol"
								grupos={grupos}
								acciones={acciones}
								valor={(c) => borrador.has(c)}
								onCambiar={(codigo, v) => setBorrador((b) => aplicarCambio(b, codigo, v, deps))}
								marca={(c) => (borrador.has(c) && !original.has(c) ? 'agregado' : !borrador.has(c) && original.has(c) ? 'quitado' : null)}
								leyenda={{ agregado: 'Por dar al guardar', quitado: 'Por quitar al guardar', sinColor: 'Sin cambios' }}
								bloqueo={(c, v) => (!v && !original.has(c) && !misPermisos.permisos.has(c) ? 'Tú no tienes este permiso: no lo puedes dar' : null)}
								deshabilitado={!editable}
							/>

							{editable && (
								<Box sx={{ position: 'sticky', bottom: 0, mt: 2, py: 2, bgcolor: colores.blanco, borderTop: `1px solid ${colores.linea}`, display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', zIndex: 3 }}>
									<Typography role="status" sx={{ fontSize: 14, color: colores.texto2, mr: 'auto' }}>
										{hayCambios ? `${agregados.length} por agregar y ${quitados.length} por quitar` : 'Sin cambios'}
									</Typography>
									<Button variant="outlined" disabled={!hayCambios || calculando} onClick={() => setBorrador(new Set(original))} sx={focoVisible}>
										Descartar
									</Button>
									<Button variant="contained" disabled={!hayCambios || calculando} onClick={revisar} sx={focoVisible}>
										{calculando ? 'Calculando…' : 'Revisar y guardar'}
									</Button>
								</Box>
							)}
						</>
					)}
				</Box>
			</Box>
		)
	}

	return (
		<TemaSero>
			<Box sx={{ maxWidth: 1320, mx: 'auto', p: { xs: 2, sm: 3, md: 4 } }}>
				<EncabezadoPagina
					eyebrow="Manager"
					titulo="Roles y permisos"
					descripcion="Qué puede ver y hacer cada rol en la web. Los cambios aplican a todas las personas con ese rol, salvo sus excepciones."
					acciones={
						puedeLeer && puedeCrear && !carga.cargando && !carga.error ? (
							<Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDialogo('nuevo')} sx={focoVisible}>
								Nuevo rol
							</Button>
						) : null
					}
				/>
				{contenido}
			</Box>

			<AvisoCambiosSinGuardar activo={hayCambios} salidaPermitida={salidaPermitida} />

			<DialogoVistaPrevia
				abierto={Boolean(vista)}
				vista={vista}
				rol={rol}
				nombre={nombre}
				guardando={guardando}
				onCerrar={() => setVista(null)}
				onGuardar={guardar}
			/>
			<DialogoRol
				modo={dialogo === 'nuevo' ? 'nuevo' : dialogo === 'renombrar' ? 'renombrar' : dialogo === 'copiar' ? 'copiar' : null}
				rol={rol}
				roles={roles ?? []}
				idRolActor={misPermisos.idRol}
				nivelActor={misPermisos.nivel}
				onCerrar={() => setDialogo(null)}
				onCrear={crear}
				onRenombrar={renombrar}
				onCopiar={copiarDe}
			/>
			<DialogoConfirmar
				abierto={dialogo === 'desactivar' || dialogo === 'activar'}
				titulo={dialogo === 'desactivar' ? `¿Desactivar ${rol?.nombre}?` : `¿Activar ${rol?.nombre}?`}
				texto={
					dialogo === 'desactivar'
						? 'Ya no se podrá asignar a nadie. Solo se puede desactivar si ninguna persona lo tiene. Sus permisos se conservan por si lo vuelves a activar.'
						: 'Se podrá asignar otra vez desde Usuarios.'
				}
				confirmar={dialogo === 'desactivar' ? 'Desactivar' : 'Activar'}
				peligro={dialogo === 'desactivar'}
				onCerrar={() => setDialogo(null)}
				onConfirmar={() => cambiarEstado(dialogo === 'activar')}
			/>
		</TemaSero>
	)
}

export default RolesPermisos
