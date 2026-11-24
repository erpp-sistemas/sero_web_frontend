// S02-H2.4: alta y edición de usuario en una sola página (DESIGN.md: formularios largos).
// Secciones: 1) datos, 2) rol y jefe directo, 3) dónde trabaja, 4) acceso y permisos; resumen lateral en palabras.
// La contraseña solo se escribe; la web nunca la recibe del servidor.
// Acceso a la app (Firebase): después de guardar en /admin/usuarios se llama a /updateActiveUser como antes
// (en desarrollo no: ver SINCRONIZA_APP en src/api/usuariosAdmin.js).
import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
	Alert,
	Autocomplete,
	Avatar,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	MenuItem,
	OutlinedInput,
	Radio,
	Select,
	Skeleton,
	Switch,
	TextField,
	Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined'
import TemaSero from '../../tema/TemaSero'
import { colores } from '../../tema/seroTheme'
import useMisPermisos from '../../hooks/useMisPermisos'
import { subirArchivo } from '../../api/uploads'
import {
	SINCRONIZA_APP,
	cambiarAccesoAppRequest,
	cambiarEstadoUsuarioRequest,
	crearUsuarioRequest,
	editarUsuarioRequest,
	listarUsuariosRequest,
	mensajeDeError,
	obtenerCatalogosUsuariosRequest,
	obtenerUsuarioRequest,
	sincronizarAppRequest,
} from '../../api/usuariosAdmin'
import { Campo, ChipEstado, EncabezadoPagina, EstadoPantalla } from './componentes/comunes'
import { claveAlcance, estiloInput, focoVisible, nombreCompleto } from './componentes/utilidades'
import ArbolAlcance from './componentes/ArbolAlcance'
import AvisoCambiosSinGuardar from './componentes/AvisoCambiosSinGuardar'
import ExcepcionesPermisos from './componentes/ExcepcionesPermisos'

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TELEFONO = /^[0-9+\-() ]*$/

const formularioVacio = {
	nombre: '',
	apellido_paterno: '',
	apellido_materno: '',
	fecha_nacimiento: '',
	id_sexo: '',
	telefono_personal: '',
	telefono_empresa: '',
	usuario: '',
	contrasena: '',
	acceso_web: true,
	dar_app: false,
	id_rol: '',
	id_supervisor: null,
	foto: null,
}

const desdeUsuario = (u) => ({
	nombre: u.nombre ?? '',
	apellido_paterno: u.apellido_paterno ?? '',
	apellido_materno: u.apellido_materno ?? '',
	fecha_nacimiento: u.fecha_nacimiento ?? '',
	id_sexo: u.id_sexo ?? '',
	telefono_personal: u.telefono_personal ?? '',
	telefono_empresa: u.telefono_empresa ?? '',
	usuario: u.usuario ?? '',
	contrasena: '',
	acceso_web: Boolean(u.acceso_web),
	dar_app: false,
	id_rol: u.id_rol ?? '',
	id_supervisor: u.id_supervisor ?? null,
	foto: null,
})

const Seccion = ({ numero, titulo, descripcion, children, accion }) => (
	<Box component="section" aria-labelledby={`seccion-${numero}`} sx={{ py: 4, borderTop: `1px solid ${colores.linea}`, '&:first-of-type': { borderTop: 0, pt: 0 } }}>
		<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
			<Box>
				<Typography id={`seccion-${numero}`} component="h2" sx={{ fontSize: 20, fontWeight: 300, letterSpacing: '-0.01em', color: colores.tinta }}>
					<Box component="span" sx={{ color: colores.texto3, mr: 1.5, fontFeatureSettings: '"tnum"' }}>
						{numero}
					</Box>
					{titulo}
				</Typography>
				{descripcion && <Typography sx={{ fontSize: 14, color: colores.texto2, mt: 0.5 }}>{descripcion}</Typography>}
			</Box>
			{accion}
		</Box>
		{children}
	</Box>
)

const CampoContrasena = ({ id, valor, onCambiar, error, deshabilitado, autoComplete = 'new-password' }) => {
	const [ver, setVer] = useState(false)
	return (
		<OutlinedInput
			id={id}
			type={ver ? 'text' : 'password'}
			value={valor}
			onChange={(e) => onCambiar(e.target.value)}
			fullWidth
			autoComplete={autoComplete}
			disabled={deshabilitado}
			error={Boolean(error)}
			inputProps={{ maxLength: 100, 'aria-invalid': Boolean(error), 'aria-describedby': error ? `${id}-error` : undefined }}
			endAdornment={
				<InputAdornment position="end">
					<IconButton
						edge="end"
						size="small"
						aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						aria-pressed={ver}
						onClick={() => setVer((v) => !v)}
						onMouseDown={(e) => e.preventDefault()}
						sx={{ color: colores.texto2, ...focoVisible }}
					>
						{ver ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
					</IconButton>
				</InputAdornment>
			}
			sx={estiloInput}
		/>
	)
}

// Lo que se compara para saber si hay cambios sin guardar (la contraseña solo cuenta si se escribió algo)
const serializar = (f, alc, exc) => JSON.stringify({ f: { ...f, contrasena: f.contrasena ? '*' : '' }, a: [...alc].sort(), e: [...exc].sort() })

const validar = (f, { esNuevo, usuarioOriginal, procesos, jefeInvalido }) => {
	const e = {}
	if (!f.nombre.trim()) e.nombre = 'Escribe el nombre'
	if (!f.apellido_paterno.trim()) e.apellido_paterno = 'Escribe el apellido paterno'
	if (!f.id_sexo) e.id_sexo = 'Elige una opción'
	if (f.telefono_personal && (!TELEFONO.test(f.telefono_personal) || f.telefono_personal.length > 15)) e.telefono_personal = 'Hasta 15 caracteres: números, espacios, +, - y paréntesis'
	if (f.telefono_empresa && (!TELEFONO.test(f.telefono_empresa) || f.telefono_empresa.length > 15)) e.telefono_empresa = 'Hasta 15 caracteres: números, espacios, +, - y paréntesis'
	const usuario = f.usuario.trim().toLowerCase()
	if (!usuario) e.usuario = 'Escribe el correo con el que entrará'
	else if ((esNuevo || usuario !== (usuarioOriginal ?? '').toLowerCase()) && !CORREO.test(usuario)) e.usuario = 'Escribe un correo válido'
	if (esNuevo && !f.contrasena) e.contrasena = 'Escribe una contraseña'
	if (f.contrasena && f.contrasena.length < 8) e.contrasena = 'Al menos 8 caracteres'
	if (f.contrasena && f.contrasena.trim() !== f.contrasena) e.contrasena = 'Sin espacios al inicio o al final'
	if (!f.id_rol) e.id_rol = 'Elige un rol'
	if (jefeInvalido) e.id_supervisor = 'Este jefe ya no cumple las reglas (rol o plazas). Elige otro o déjalo vacío.'
	// Gestor (5) y Coordinador (4) trabajan en procesos: al menos uno
	if ([4, 5].includes(Number(f.id_rol)) && procesos === 0) e.alcance = 'Un Gestor o un Coordinador necesita al menos un proceso asignado.'
	return e
}

const nivelDeRolJefe = (catalogos, idRol) => (catalogos?.roles ?? []).find((r) => r.id_rol === idRol)?.nivel_jefe ?? null

const EditarUsuario = () => {
	const { id } = useParams()
	const esNuevo = !id
	const idUsuario = esNuevo ? null : Number(id)
	const navigate = useNavigate()
	const location = useLocation()
	const misPermisos = useMisPermisos()

	const [catalogos, setCatalogos] = useState(null)
	const [original, setOriginal] = useState(null)
	const [carga, setCarga] = useState({ cargando: true, error: null, noEncontrado: false, sinPermiso: false })
	const [form, setForm] = useState(formularioVacio)
	const [alcance, setAlcance] = useState(new Set())
	const [excepciones, setExcepciones] = useState(new Map())
	const [errores, setErrores] = useState({})
	const [guardando, setGuardando] = useState(false)
	const [aviso, setAviso] = useState(null) // { tipo, texto }
	const [fotoPrevia, setFotoPrevia] = useState(null)
	const [subiendoFoto, setSubiendoFoto] = useState(false)
	const [dialogo, setDialogo] = useState(null) // 'desactivar' | 'activar' | 'app' | 'quitar_app' | 'copiar'
	const [intento, setIntento] = useState(0)
	const archivoRef = useRef(null)
	const avisoRef = useRef(null)

	const puedeEditar = esNuevo ? misPermisos.tiene('usuarios.create') : misPermisos.tiene('usuarios.update')
	const inicialRef = useRef(serializar(formularioVacio, new Set(), new Map()))
	const salidaPermitida = useRef(false)

	useEffect(() => {
		if (misPermisos.cargando) return undefined
		let vigente = true
		setCarga({ cargando: true, error: null, noEncontrado: false, sinPermiso: false })
		const pedidos = [obtenerCatalogosUsuariosRequest(), esNuevo ? Promise.resolve(null) : obtenerUsuarioRequest(idUsuario)]
		Promise.all(pedidos)
			.then(([cat, usr]) => {
				if (!vigente) return
				setCatalogos(cat.data)
				if (usr) {
					const u = usr.data
					const alc = new Set(u.alcance.map((a) => claveAlcance(a.id_plaza, a.id_servicio, a.id_proceso)))
					const exc = new Map(u.excepciones.map((x) => [x.codigo, x.concede]))
					setOriginal(u)
					setForm(desdeUsuario(u))
					setAlcance(alc)
					setExcepciones(exc)
					inicialRef.current = serializar(desdeUsuario(u), alc, exc)
				}
				setCarga({ cargando: false, error: null, noEncontrado: false, sinPermiso: false })
			})
			.catch((error) => {
				if (!vigente) return
				const status = error?.response?.status
				setCarga({ cargando: false, error: status === 403 || status === 404 ? null : mensajeDeError(error), noEncontrado: status === 404, sinPermiso: status === 403 })
			})
		return () => {
			vigente = false
		}
	}, [esNuevo, idUsuario, misPermisos.cargando, intento])

	// Lleva la vista al aviso (éxito o error del servidor). Los errores de validación llevan el foco al campo.
	useEffect(() => {
		if (aviso && !aviso.validacion) avisoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}, [aviso])

	const poner = (campo) => (valor) => {
		setForm((f) => ({ ...f, [campo]: valor }))
		setErrores((e) => (e[campo] ? { ...e, [campo]: undefined } : e))
	}

	// Nivel de quien edita: no se ofrecen roles de mayor nivel que el suyo; Superadmin solo para Superadmin.
	// (El servidor vuelve a revisarlo y responde 403.)
	const nivelDeRol = (idRol) => (catalogos?.roles ?? []).find((r) => r.id_rol === idRol)?.nivel ?? 0
	const nivelActor = nivelDeRol(misPermisos.idRol)
	const rolesDisponibles = useMemo(
		() =>
			(catalogos?.roles ?? []).filter((r) => {
				if (original && original.id_rol === r.id_rol) return true
				if (r.es_heredado) return false
				if (r.id_rol === 1 && misPermisos.idRol !== 1) return false
				return r.nivel <= nivelActor
			}),
		[catalogos, original, misPermisos.idRol, nivelActor],
	)
	const rolElegido = (catalogos?.roles ?? []).find((r) => r.id_rol === Number(form.id_rol))

	const desactivada = !esNuevo && Boolean(original) && !original.activo
	const fueraDeNivel =
		!esNuevo && Boolean(original) && ((original.id_rol === 1 && misPermisos.idRol !== 1) || nivelDeRol(original.id_rol) > nivelActor)
	const soloLectura = !puedeEditar || desactivada || fueraDeNivel
	const motivoSoloLectura = desactivada
		? 'Persona desactivada: actívala para hacer cambios.'
		: fueraDeNivel
			? 'No puedes editar a alguien con un rol de mayor nivel que el tuyo.'
			: !puedeEditar
				? 'Solo lectura: no tienes permiso para editar usuarios.'
				: null

	// Plazas y permisos que quien edita puede dar (además de lo que la persona ya tenía)
	const plazasDeLaPersona = useMemo(() => new Set([...alcance].map((c) => Number(c.split('-')[0]))), [alcance])
	const alcancePermitido = useMemo(() => {
		if (misPermisos.alcanceTotal) return null
		const propias = (misPermisos.alcance ?? []).map((a) => claveAlcance(a.id_plaza, a.id_servicio, a.id_proceso))
		const previas = (original?.alcance ?? []).map((a) => claveAlcance(a.id_plaza, a.id_servicio, a.id_proceso))
		return new Set([...propias, ...previas])
	}, [misPermisos.alcanceTotal, misPermisos.alcance, original])
	const concedidosAntes = useMemo(() => new Set((original?.excepciones ?? []).filter((x) => x.concede).map((x) => x.codigo)), [original])

	// Jefes posibles: activos, Coordinador < Gerente < Director general (de mayor nivel que el rol de la persona),
	// que compartan al menos una plaza (Director general: todas) y sin crear ciclos. Nunca Superadmin ni Sistemas.
	const jefesPosibles = useMemo(() => {
		if (!rolElegido || rolElegido.sin_jefe || !catalogos) return []
		const vigentes = catalogos.jefes_vigentes ?? {}
		const creaCiclo = (idJefe) => {
			let actual = idJefe
			for (let paso = 0; paso < 50 && actual; paso += 1) {
				if (idUsuario && actual === idUsuario) return true
				actual = vigentes[actual] ?? null
			}
			return false
		}
		return (catalogos.jefes ?? []).filter(
			(j) =>
				j.id_usuario !== idUsuario &&
				(nivelDeRolJefe(catalogos, j.id_rol) ?? 0) > (rolElegido.nivel_jefe ?? 0) &&
				(j.id_rol === 2 || j.plazas.some((p) => plazasDeLaPersona.has(p))) &&
				!creaCiclo(j.id_usuario),
		)
	}, [catalogos, rolElegido, plazasDeLaPersona, idUsuario])
	const jefeInvalido = Boolean(form.id_supervisor) && !jefesPosibles.some((j) => j.id_usuario === form.id_supervisor)
	const ayudaJefe = !rolElegido
		? 'Elige primero un rol.'
		: rolElegido.sin_jefe
			? 'Este rol no tiene jefe directo.'
			: plazasDeLaPersona.size === 0
				? 'Elige primero dónde trabaja (sección 3): el jefe debe compartir al menos una plaza.'
				: 'Coordinador, Gerente o Director general de mayor nivel, que comparta al menos una plaza. Mientras un jefe no tenga gente capturada, ve a toda la gente de sus plazas.'

	const hayCambios = !carga.cargando && !soloLectura && serializar(form, alcance, excepciones) !== inicialRef.current
	const base = useMemo(() => new Set(catalogos?.base_por_rol?.[form.id_rol] ?? []), [catalogos, form.id_rol])

	// Al cambiar de rol, se quitan las excepciones que ya no difieren del nuevo rol
	const cambiarRol = (idRol) => {
		poner('id_rol')(idRol)
		const nuevaBase = new Set(catalogos?.base_por_rol?.[idRol] ?? [])
		setExcepciones((ex) => {
			const n = new Map()
			for (const [codigo, concede] of ex) if (concede !== nuevaBase.has(codigo)) n.set(codigo, concede)
			return n
		})
	}

	const cuerpo = () => ({
		nombre: form.nombre.trim(),
		apellido_paterno: form.apellido_paterno.trim(),
		apellido_materno: form.apellido_materno.trim() || null,
		fecha_nacimiento: form.fecha_nacimiento || null,
		id_sexo: Number(form.id_sexo),
		telefono_personal: form.telefono_personal.trim() || null,
		telefono_empresa: form.telefono_empresa.trim() || null,
		usuario: form.usuario.trim().toLowerCase(),
		...(form.contrasena ? { contrasena: form.contrasena } : {}),
		id_rol: Number(form.id_rol),
		acceso_web: form.acceso_web,
		id_supervisor: form.id_supervisor || null,
		alcance: [...alcance].map((c) => {
			const [p, s, pr] = c.split('-').map(Number)
			return { id_plaza: p, id_servicio: s, id_proceso: pr }
		}),
		excepciones: [...excepciones].map(([codigo, concede]) => ({ codigo, concede })),
		...(form.foto ? { foto: form.foto } : {}),
	})

	const recargar = async () => {
		const { data } = await obtenerUsuarioRequest(idUsuario)
		const alc = new Set(data.alcance.map((a) => claveAlcance(a.id_plaza, a.id_servicio, a.id_proceso)))
		const exc = new Map(data.excepciones.map((x) => [x.codigo, x.concede]))
		setOriginal(data)
		setForm(desdeUsuario(data))
		setAlcance(alc)
		setExcepciones(exc)
		inicialRef.current = serializar(desdeUsuario(data), alc, exc)
		setFotoPrevia(null)
	}

	const avisoApp = (resultado, accion) =>
		resultado?.omitido ? ` En desarrollo no se ${accion} el usuario de la app (Firebase); en producción sí.` : ''

	const guardar = async (e) => {
		e.preventDefault()
		// Los diálogos viven en un portal: su submit sube por React hasta aquí y no debe guardar el formulario.
		if (e.target !== e.currentTarget) return
		if (guardando) return
		const encontrados = validar(form, { esNuevo, usuarioOriginal: original?.usuario, procesos: alcance.size, jefeInvalido })
		setErrores(encontrados)
		if (Object.keys(encontrados).length) {
			setAviso({ tipo: 'error', texto: 'Revisa los campos marcados.', validacion: true })
			const primero = document.getElementById(`usuario-${Object.keys(encontrados)[0]}`)
			primero?.focus()
			return
		}
		setGuardando(true)
		setAviso(null)
		try {
			if (esNuevo) {
				const { data } = await crearUsuarioRequest(cuerpo())
				let extra = ''
				if (form.dar_app) {
					try {
						await cambiarAccesoAppRequest(data.id_usuario, true, form.contrasena)
						const r = await sincronizarAppRequest({
							idUsuario: data.id_usuario,
							nombreCompleto: nombreCompleto(form),
							usuario: form.usuario.trim().toLowerCase(),
							contrasena: form.contrasena,
							tipo: 'activeMobile',
							activo: true,
						})
						extra = avisoApp(r, 'creó')
					} catch (error) {
						extra = ` No se pudo dar acceso a la app: ${mensajeDeError(error)} Inténtalo desde su ficha.`
					}
				}
				salidaPermitida.current = true
				navigate(`/usuarios/${data.id_usuario}`, { replace: true, state: { aviso: `Usuario creado.${extra}` } })
				return
			}
			await editarUsuarioRequest(idUsuario, cuerpo())
			await recargar()
			setAviso({ tipo: 'success', texto: form.contrasena ? 'Cambios guardados, con contraseña nueva.' : 'Cambios guardados.' })
		} catch (error) {
			setAviso({ tipo: 'error', texto: mensajeDeError(error) })
		} finally {
			setGuardando(false)
		}
	}

	// Aviso que llega al crear (estado de la navegación)
	useEffect(() => {
		const texto = location.state?.aviso
		if (texto) setAviso({ tipo: texto.includes('No se pudo') || texto.includes('En desarrollo') ? 'warning' : 'success', texto })
	}, [location.state])

	const cambiarEstado = async (activo) => {
		setGuardando(true)
		try {
			const { data } = await cambiarEstadoUsuarioRequest(idUsuario, activo)
			let extra = ''
			if (data.sincronizar_app) {
				try {
					const r = await sincronizarAppRequest({ idUsuario, nombreCompleto: nombreCompleto(original), usuario: original.usuario, contrasena: '', tipo: 'active', activo: false })
					extra = avisoApp(r, 'desactivó')
				} catch (error) {
					extra = ` Ojo: no se pudo desactivar en la app (${mensajeDeError(error)}).`
				}
			}
			await recargar()
			setAviso({ tipo: extra.includes('Ojo') ? 'warning' : 'success', texto: `${activo ? 'Usuario activado. Revisa su acceso a la web antes de avisarle.' : 'Usuario desactivado.'}${extra}` })
		} catch (error) {
			setAviso({ tipo: 'error', texto: mensajeDeError(error) })
		} finally {
			setGuardando(false)
			setDialogo(null)
		}
	}

	const cambiarApp = async (activo, contrasena) => {
		setGuardando(true)
		try {
			await cambiarAccesoAppRequest(idUsuario, activo, contrasena)
			let extra = ''
			try {
				const r = await sincronizarAppRequest({ idUsuario, nombreCompleto: nombreCompleto(original), usuario: original.usuario, contrasena: contrasena ?? '', tipo: 'activeMobile', activo })
				extra = avisoApp(r, activo ? 'creó' : 'desactivó')
			} catch (error) {
				extra = ` Ojo: no se pudo actualizar la app (${mensajeDeError(error)}). Vuelve a intentarlo.`
			}
			await recargar()
			setAviso({ tipo: extra.includes('Ojo') ? 'warning' : 'success', texto: `${activo ? 'Acceso a la app activado.' : 'Acceso a la app quitado.'}${extra}` })
		} catch (error) {
			setAviso({ tipo: 'error', texto: mensajeDeError(error) })
		} finally {
			setGuardando(false)
			setDialogo(null)
		}
	}

	const elegirFoto = async (e) => {
		const archivo = e.target.files?.[0]
		e.target.value = ''
		if (!archivo) return
		if (!['image/jpeg', 'image/png'].includes(archivo.type)) return setAviso({ tipo: 'error', texto: 'La foto debe ser JPG o PNG.' })
		if (archivo.size > 5 * 1024 * 1024) return setAviso({ tipo: 'error', texto: 'La foto no debe pasar de 5 MB.' })
		setSubiendoFoto(true)
		try {
			const key = await subirArchivo(archivo, 'usuarios')
			poner('foto')(key)
			setFotoPrevia(URL.createObjectURL(archivo))
		} catch (error) {
			setAviso({ tipo: 'error', texto: `No se pudo subir la foto: ${mensajeDeError(error, error.message)}` })
		} finally {
			setSubiendoFoto(false)
		}
		return undefined
	}

	// ----- estados de pantalla
	let estadoPantalla = null
	if (misPermisos.cargando || carga.cargando) {
		estadoPantalla = (
			<Box sx={{ display: 'grid', gap: 2 }}>
				<Skeleton height={40} width="40%" />
				<Skeleton variant="rectangular" height={280} sx={{ borderRadius: '4px' }} />
				<Skeleton variant="rectangular" height={180} sx={{ borderRadius: '4px' }} />
			</Box>
		)
	} else if (!misPermisos.tiene('usuarios.read') || carga.sinPermiso || (esNuevo && !misPermisos.tiene('usuarios.create'))) {
		estadoPantalla = <EstadoPantalla icono={LockOutlinedIcon} titulo="No tienes acceso" descripcion={esNuevo ? 'No tienes permiso para dar de alta usuarios.' : 'No tienes permiso para ver este usuario.'} accion={<Button variant="outlined" onClick={() => navigate('/usuarios')}>Ir a usuarios</Button>} />
	} else if (carga.noEncontrado) {
		estadoPantalla = <EstadoPantalla icono={PersonOffOutlinedIcon} titulo="No encontramos a esta persona" descripcion="Puede que no exista o que no esté en tus plazas." accion={<Button variant="outlined" onClick={() => navigate('/usuarios')}>Ir a usuarios</Button>} />
	} else if (carga.error) {
		estadoPantalla = <EstadoPantalla icono={ErrorOutlineIcon} titulo="No se pudo cargar" descripcion={carga.error} accion={<Button variant="outlined" onClick={() => setIntento((n) => n + 1)}>Reintentar</Button>} />
	}

	const titulo = esNuevo ? 'Nuevo usuario' : nombreCompleto(original ?? {}) || 'Usuario'
	const jefeElegido = form.id_supervisor
		? (jefesPosibles.find((j) => j.id_usuario === form.id_supervisor) ??
			(catalogos?.jefes ?? []).find((j) => j.id_usuario === form.id_supervisor) ?? {
				id_usuario: form.id_supervisor,
				nombre: original?.id_supervisor === form.id_supervisor ? original.supervisor : '',
				rol: '',
			})
		: null
	// Si el jefe elegido ya no cumple, se deja en la lista para que el valor no quede huérfano (se marca con error)
	const opcionesJefe = jefeInvalido && jefeElegido ? [...jefesPosibles, jefeElegido] : jefesPosibles
	const soloAppConWeb = Boolean(rolElegido?.solo_app) && form.acceso_web

	const plazasElegidas = useMemo(() => {
		const ids = new Set([...alcance].map((c) => Number(c.split('-')[0])))
		return (catalogos?.arbol ?? []).filter((p) => ids.has(p.id_plaza)).map((p) => p.nombre)
	}, [alcance, catalogos])
	const totalPermisos = (catalogos?.permisos ?? []).filter((p) => (excepciones.has(p.codigo) ? excepciones.get(p.codigo) : base.has(p.codigo))).length

	// Por qué un apagador de acceso no se puede mover (se muestra debajo de él)
	const esPropio = !esNuevo && original?.id_usuario === misPermisos.idUsuario
	const motivoWeb = motivoSoloLectura ?? (esPropio ? 'No puedes quitarte tu propio acceso a la web.' : null)
	const motivoApp = motivoSoloLectura ?? (!SINCRONIZA_APP ? 'En local no se cambia el acceso a la app; pruébalo en producción.' : null)

	const acciones =
		!esNuevo && original && puedeEditar && !fueraDeNivel ? (
			original.activo ? (
				<Button variant="outlined" onClick={() => setDialogo('desactivar')} disabled={guardando || original.id_usuario === misPermisos.idUsuario} sx={{ color: '#B42318', borderColor: '#F3C5C1', ...focoVisible }}>
					Desactivar
				</Button>
			) : (
				<Button variant="outlined" onClick={() => setDialogo('activar')} disabled={guardando} sx={focoVisible}>
					Activar
				</Button>
			)
		) : null

	return (
		<TemaSero>
			<Box
				component="form"
				noValidate
				onSubmit={guardar}
				sx={{
					px: { xs: 2, md: 4 },
					py: { xs: 3, md: 4 },
					maxWidth: 1320,
					mx: 'auto',
					bgcolor: colores.blanco,
					// Solo lectura: los datos se leen bien (no en el gris de deshabilitado, que no llega a 3:1)
					'& .MuiInputBase-input.Mui-disabled, & .MuiSelect-select.Mui-disabled': { WebkitTextFillColor: colores.texto2, color: colores.texto2 },
				}}
			>
				<Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/usuarios')} sx={{ height: 32, px: 1, mb: 1, color: colores.marino, fontWeight: 400, ...focoVisible }}>
					Usuarios
				</Button>
				<EncabezadoPagina
					eyebrow="Administración › Usuarios"
					titulo={titulo}
					descripcion={
						esNuevo ? (
							'Llena las cuatro secciones y guarda. El rol propone los permisos; solo ajusta lo que sea diferente.'
						) : original ? (
							<Box component="span" sx={{ display: 'inline-flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
								<ChipEstado tipo={original.activo ? 'exito' : 'neutro'}>{original.activo ? 'Activo' : 'Inactivo'}</ChipEstado>
								<span>{original.usuario || 'Sin usuario de acceso'}</span>
								{soloLectura && <ChipEstado tipo="info">Solo lectura</ChipEstado>}
							</Box>
						) : null
					}
					acciones={acciones}
				/>

				{aviso && (
					<Alert ref={avisoRef} severity={aviso.tipo} sx={{ mb: 2 }} onClose={() => setAviso(null)} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
						{aviso.texto}
					</Alert>
				)}

				{!estadoPantalla && desactivada && (
					<Alert severity="warning" sx={{ mb: 2 }}>
						Esta persona está desactivada. Actívala para hacer cambios.
					</Alert>
				)}
				{!estadoPantalla && !desactivada && fueraDeNivel && (
					<Alert severity="info" sx={{ mb: 2 }}>
						Puedes ver a esta persona, pero no editarla: su rol es de mayor nivel que el tuyo.
					</Alert>
				)}

				{estadoPantalla ?? (
					<Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'minmax(0,1fr) 300px' }, gap: { xs: 2, lg: 5 }, alignItems: 'start' }}>
						<Box>
							{/* 1. Datos */}
							<Seccion numero={1} titulo="Datos" descripcion="Cómo se llama y cómo entra.">
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
									<Avatar src={fotoPrevia || original?.foto || undefined} alt="" sx={{ width: 56, height: 56, bgcolor: colores.seleccion, color: colores.marino }}>
										{(form.nombre[0] ?? '').toUpperCase()}
									</Avatar>
									{!soloLectura && (
										<>
											<input ref={archivoRef} type="file" accept="image/jpeg,image/png" hidden onChange={elegirFoto} />
											<Button variant="outlined" size="small" onClick={() => archivoRef.current?.click()} disabled={subiendoFoto} sx={{ height: 32, ...focoVisible }}>
												{subiendoFoto ? 'Subiendo…' : form.foto || original?.foto ? 'Cambiar foto' : 'Agregar foto'}
											</Button>
										</>
									)}
								</Box>
								<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2.5 }}>
									<Campo id="usuario-nombre" etiqueta="Nombre" obligatorio error={errores.nombre}>
										<OutlinedInput id="usuario-nombre" value={form.nombre} onChange={(e) => poner('nombre')(e.target.value)} fullWidth disabled={soloLectura} error={Boolean(errores.nombre)} inputProps={{ maxLength: 100 }} sx={estiloInput} />
									</Campo>
									<Campo id="usuario-apellido_paterno" etiqueta="Apellido paterno" obligatorio error={errores.apellido_paterno}>
										<OutlinedInput id="usuario-apellido_paterno" value={form.apellido_paterno} onChange={(e) => poner('apellido_paterno')(e.target.value)} fullWidth disabled={soloLectura} error={Boolean(errores.apellido_paterno)} inputProps={{ maxLength: 100 }} sx={estiloInput} />
									</Campo>
									<Campo id="usuario-apellido_materno" etiqueta="Apellido materno">
										<OutlinedInput id="usuario-apellido_materno" value={form.apellido_materno} onChange={(e) => poner('apellido_materno')(e.target.value)} fullWidth disabled={soloLectura} inputProps={{ maxLength: 100 }} sx={estiloInput} />
									</Campo>
									<Campo id="usuario-fecha_nacimiento" etiqueta="Fecha de nacimiento">
										<OutlinedInput id="usuario-fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={(e) => poner('fecha_nacimiento')(e.target.value)} fullWidth disabled={soloLectura} sx={estiloInput} />
									</Campo>
									<Campo id="usuario-id_sexo" etiqueta="Sexo" obligatorio error={errores.id_sexo}>
										<Select id="usuario-id_sexo" value={form.id_sexo} onChange={(e) => poner('id_sexo')(e.target.value)} displayEmpty fullWidth disabled={soloLectura} error={Boolean(errores.id_sexo)} sx={{ height: 40, fontSize: 14 }} inputProps={{ 'aria-labelledby': undefined }}>
											<MenuItem value="" disabled>
												Elige
											</MenuItem>
											{(catalogos?.sexos ?? []).map((s) => (
												<MenuItem key={s.id_sexo} value={s.id_sexo}>
													{s.nombre ? s.nombre[0].toUpperCase() + s.nombre.slice(1) : s.id_sexo}
												</MenuItem>
											))}
										</Select>
									</Campo>
									<Box sx={{ display: { xs: 'none', md: 'block' } }} />
									<Campo id="usuario-telefono_personal" etiqueta="Teléfono personal" error={errores.telefono_personal}>
										<OutlinedInput id="usuario-telefono_personal" type="tel" value={form.telefono_personal} onChange={(e) => poner('telefono_personal')(e.target.value)} fullWidth disabled={soloLectura} error={Boolean(errores.telefono_personal)} inputProps={{ maxLength: 15 }} sx={estiloInput} />
									</Campo>
									<Campo id="usuario-telefono_empresa" etiqueta="Teléfono de la empresa" error={errores.telefono_empresa}>
										<OutlinedInput id="usuario-telefono_empresa" type="tel" value={form.telefono_empresa} onChange={(e) => poner('telefono_empresa')(e.target.value)} fullWidth disabled={soloLectura} error={Boolean(errores.telefono_empresa)} inputProps={{ maxLength: 15 }} sx={estiloInput} />
									</Campo>
								</Box>
								<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mt: 2.5 }}>
									<Campo
										id="usuario-usuario"
										etiqueta="Correo para entrar"
										obligatorio
										error={errores.usuario}
										ayuda={original?.acceso_app ? 'Tiene acceso a la app: para cambiar el correo, quita primero el acceso a la app.' : 'Con este correo entra a la web y, si se le da, a la app.'}
									>
										<OutlinedInput id="usuario-usuario" type="email" value={form.usuario} onChange={(e) => poner('usuario')(e.target.value)} fullWidth autoComplete="off" disabled={soloLectura || Boolean(original?.acceso_app)} error={Boolean(errores.usuario)} inputProps={{ maxLength: 100 }} sx={estiloInput} />
									</Campo>
									{!soloLectura && (
										<Campo
											id="usuario-contrasena"
											etiqueta={esNuevo ? 'Contraseña' : 'Contraseña nueva'}
											obligatorio={esNuevo}
											error={errores.contrasena}
											ayuda={esNuevo ? 'Al menos 8 caracteres. Entrégala a la persona por un medio seguro.' : 'Déjala vacía para no cambiarla. La actual no se puede ver.'}
										>
											<CampoContrasena id="usuario-contrasena" valor={form.contrasena} onCambiar={poner('contrasena')} error={errores.contrasena} />
										</Campo>
									)}
								</Box>
							</Seccion>

							{/* 2. Rol y jefe directo */}
							<Seccion
								numero={2}
								titulo="Rol y jefe directo"
								descripcion="El rol propone qué puede hacer. Los roles heredados ya no se asignan."
								accion={
									!soloLectura && (
										<Button variant="outlined" size="small" startIcon={<ContentCopyOutlinedIcon />} onClick={() => setDialogo('copiar')} sx={{ height: 32, ...focoVisible }}>
											Copiar accesos de otro usuario
										</Button>
									)
								}
							>
								{errores.id_rol && (
									<Typography role="alert" sx={{ fontSize: 12, color: '#B42318', mb: 1 }}>
										{errores.id_rol}
									</Typography>
								)}
								<Box role="radiogroup" aria-label="Rol" id="usuario-id_rol" tabIndex={-1} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
									{rolesDisponibles.map((r) => {
										const elegido = Number(form.id_rol) === r.id_rol
										return (
											<Box
												key={r.id_rol}
												component="label"
												sx={{
													display: 'flex',
													gap: 1,
													alignItems: 'flex-start',
													p: 1.5,
													border: `1px solid ${elegido ? colores.marino : colores.linea}`,
													bgcolor: elegido ? colores.seleccion : colores.blanco,
													borderRadius: '4px',
													cursor: soloLectura ? 'default' : 'pointer',
													'&:focus-within': { outline: `2px solid ${colores.marino}`, outlineOffset: 2 },
												}}
											>
												<Radio checked={elegido} onChange={() => cambiarRol(r.id_rol)} value={r.id_rol} name="rol" disabled={soloLectura} size="small" sx={{ p: 0.25, color: colores.borde, '&.Mui-checked': { color: colores.marino } }} />
												<Box>
													<Typography sx={{ fontSize: 14, fontWeight: 500, color: colores.tinta }}>
														{r.nombre}
														{r.es_heredado && <Typography component="span" sx={{ fontSize: 12, color: colores.texto3, fontWeight: 400 }}> · heredado</Typography>}
														{r.solo_app && <Typography component="span" sx={{ fontSize: 12, color: colores.texto3, fontWeight: 400 }}> · solo app</Typography>}
													</Typography>
													{r.descripcion && <Typography sx={{ fontSize: 13, color: colores.texto2 }}>{r.descripcion}</Typography>}
												</Box>
											</Box>
										)
									})}
								</Box>
								<Campo id="usuario-id_supervisor" etiqueta="Jefe directo (opcional)" ayuda={ayudaJefe} error={errores.id_supervisor ?? (jefeInvalido ? 'Este jefe ya no cumple las reglas (rol o plazas). Elige otro o déjalo vacío.' : undefined)} sx={{ mt: 2.5, maxWidth: 420 }}>
									<Autocomplete
										id="usuario-id_supervisor"
										options={opcionesJefe}
										openText="Abrir"
										closeText="Cerrar"
										clearText="Quitar jefe"
										loadingText="Cargando…"
										ListboxProps={{ style: { maxHeight: 264 } }}
										slotProps={{ popper: { placement: 'bottom-start', sx: { zIndex: 1300 } }, paper: { sx: { border: `1px solid ${colores.linea}`, boxShadow: '0 8px 24px rgba(15,35,64,.10)' } } }}
										value={jefeElegido}
										onChange={(_, v) => poner('id_supervisor')(v?.id_usuario ?? null)}
										getOptionLabel={(o) => o.nombre ?? ''}
										isOptionEqualToValue={(o, v) => o.id_usuario === v.id_usuario}
										renderOption={(props, o) => (
											<li {...props} key={o.id_usuario}>
												<Box>
													<Typography sx={{ fontSize: 14 }}>{o.nombre}</Typography>
													{o.rol && <Typography sx={{ fontSize: 12, color: colores.texto3 }}>{o.rol}</Typography>}
												</Box>
											</li>
										)}
										noOptionsText={jefesPosibles.length ? 'Nadie coincide con lo que escribiste' : 'No hay jefes posibles con este rol y estas plazas'}
										disabled={soloLectura || !rolElegido || rolElegido.sin_jefe}
										renderInput={(params) => <TextField {...params} placeholder="Sin jefe directo" size="small" error={Boolean(errores.id_supervisor) || jefeInvalido} />}
									/>
								</Campo>
							</Seccion>

							{/* 3. Dónde trabaja */}
							<Seccion numero={3} titulo="Dónde trabaja" descripcion="Plazas, servicios y procesos que puede ver.">
								<Box id="usuario-alcance" tabIndex={-1} sx={{ outline: 'none' }}>
									{errores.alcance && (
										<Typography role="alert" sx={{ fontSize: 12, color: '#B42318', mb: 1 }}>
											{errores.alcance}
										</Typography>
									)}
									<ArbolAlcance
										arbol={catalogos?.arbol ?? []}
										seleccion={alcance}
										onCambiar={(nueva) => {
											setAlcance(nueva)
											setErrores((e) => (e.alcance ? { ...e, alcance: undefined } : e))
										}}
										deshabilitado={soloLectura}
										permitidas={alcancePermitido}
									/>
								</Box>
							</Seccion>

							{/* 4. Acceso y permisos */}
							<Seccion numero={4} titulo="Acceso y permisos" descripcion="Si entra a la web y a la app, y qué puede hacer además (o de menos) que su rol.">
								{soloAppConWeb && (
									<Alert
										severity="warning"
										sx={{ mb: 2 }}
										action={
											!soloLectura && (
												<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
													{!esPropio && (
														<Button size="small" variant="outlined" onClick={() => poner('acceso_web')(false)} sx={{ height: 30, bgcolor: colores.blanco }}>
															Quitar acceso a la web
														</Button>
													)}
													<Button
														size="small"
														variant="outlined"
														onClick={() => {
															document.getElementById('seccion-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
															document.querySelector('#usuario-id_rol input[type=radio]:checked')?.focus()
														}}
														sx={{ height: 30, bgcolor: colores.blanco }}
													>
														Cambiar el rol
													</Button>
												</Box>
											)
										}
									>
										El rol {rolElegido.nombre} es solo para la app, pero esta persona tiene acceso a la web.
									</Alert>
								)}
								<Box sx={{ display: 'grid', gap: 1.5, mb: 3 }}>
									<FilaApagador
										id="usuario-acceso_web"
										titulo="Entra a la web"
										descripcion="Puede iniciar sesión en esta plataforma."
										encendido={form.acceso_web}
										motivo={motivoWeb}
										onCambiar={poner('acceso_web')}
									/>
									<FilaApagador
										id="usuario-acceso_app"
										titulo="Entra a la app móvil"
										descripcion={esNuevo ? 'Usará el mismo correo y contraseña.' : original?.acceso_app ? 'Tiene acceso a la app.' : 'No tiene acceso a la app.'}
										encendido={esNuevo ? form.dar_app : Boolean(original?.acceso_app)}
										motivo={motivoApp}
										ocupado={guardando}
										onCambiar={(valor) => (esNuevo ? poner('dar_app')(valor) : setDialogo(valor ? 'app' : 'quitar_app'))}
									/>
								</Box>
								{form.id_rol ? (
									<ExcepcionesPermisos
										permisos={catalogos?.permisos ?? []}
										base={base}
										excepciones={excepciones}
										onCambiar={setExcepciones}
										deshabilitado={soloLectura}
										esSuperadmin={Number(form.id_rol) === 1}
										puedeDar={(codigo) => misPermisos.permisos.has(codigo) || base.has(codigo) || concedidosAntes.has(codigo)}
									/>
								) : (
									<Typography sx={{ fontSize: 14, color: colores.texto2 }}>Elige un rol para ver sus permisos.</Typography>
								)}
							</Seccion>
						</Box>

						{/* Resumen lateral */}
						<Box component="aside" aria-label="Resumen" sx={{ position: { lg: 'sticky' }, top: { lg: 24 }, border: `1px solid ${colores.linea}`, borderRadius: '4px', p: 3, bgcolor: colores.banda }}>
							<Typography sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: colores.texto3, mb: 1.5 }}>Resumen</Typography>
							<Box component="ul" sx={{ m: 0, pl: 2.5, display: 'grid', gap: 1, fontSize: 14, color: colores.tinta, '& li::marker': { color: colores.texto3 } }}>
								<li>{form.nombre.trim() ? `${nombreCompleto(form)}` : 'Sin nombre todavía'}{!esNuevo && original && !original.activo ? ' (desactivado)' : ''}.</li>
								<li>{rolElegido ? `Es ${rolElegido.nombre}.` : 'Sin rol.'}</li>
								<li>
									{rolElegido?.solo_app
										? form.acceso_web
											? 'Su rol es solo para la app, pero tiene acceso a la web: revisa la sección 4.'
											: `Su rol es solo para la app${(esNuevo ? form.dar_app : original?.acceso_app) ? ' y entra a la app.' : '; todavía no tiene acceso a la app.'}`
										: `${form.acceso_web ? 'Puede entrar a la web' : 'No puede entrar a la web'}${(esNuevo ? form.dar_app : original?.acceso_app) ? ' y a la app.' : '; no entra a la app.'}`}
								</li>
								<li>{plazasElegidas.length ? `Trabaja en ${plazasElegidas.length === 1 ? plazasElegidas[0] : `${plazasElegidas.length} plazas`} (${alcance.size} proceso${alcance.size === 1 ? '' : 's'}).` : 'No tiene plazas asignadas.'}</li>
								<li>{form.id_rol ? `Tiene ${totalPermisos} permisos${excepciones.size ? `, ${excepciones.size} distinto${excepciones.size === 1 ? '' : 's'} a su rol` : ', igual que su rol'}.` : 'Sin permisos.'}</li>
								<li>{jefeElegido ? `Su jefe directo es ${jefeElegido.nombre}.` : 'Sin jefe directo.'}</li>
							</Box>
						</Box>
					</Box>
				)}

				{/* Barra de guardar */}
				{!estadoPantalla && !soloLectura && (
					<Box sx={{ position: 'sticky', bottom: 0, mt: 3, py: 2, bgcolor: colores.blanco, borderTop: `1px solid ${colores.linea}`, display: 'flex', gap: 1, justifyContent: 'flex-end', zIndex: 2 }}>
						<Button variant="outlined" onClick={() => navigate('/usuarios')} disabled={guardando} sx={focoVisible}>
							Cancelar
						</Button>
						<Button type="submit" variant="contained" aria-disabled={guardando} sx={{ minWidth: 140, ...focoVisible, '&[aria-disabled="true"]': { opacity: 0.75, cursor: 'progress' } }}>
							{guardando ? (
								<>
									<CircularProgress size={16} thickness={5} sx={{ color: colores.tinta, mr: 1 }} />
									Guardando…
								</>
							) : esNuevo ? (
								'Crear usuario'
							) : (
								'Guardar cambios'
							)}
						</Button>
					</Box>
				)}

				<AvisoCambiosSinGuardar activo={hayCambios} salidaPermitida={salidaPermitida} />
				<DialogoConfirmar
					abierto={dialogo === 'desactivar'}
					titulo="¿Desactivar a esta persona?"
					texto="Ya no podrá entrar a la web ni a la app móvil, y su sesión dejará de servir. No se borra nada: la puedes volver a activar."
					confirmar="Desactivar"
					peligro
					ocupado={guardando}
					onCerrar={() => setDialogo(null)}
					onConfirmar={() => cambiarEstado(false)}
				/>
				<DialogoConfirmar
					abierto={dialogo === 'activar'}
					titulo="¿Activar a esta persona?"
					texto="Vuelve a aparecer como activa. Su acceso a la web y a la app se revisa aparte, en la sección 4."
					confirmar="Activar"
					ocupado={guardando}
					onCerrar={() => setDialogo(null)}
					onConfirmar={() => cambiarEstado(true)}
				/>
				<DialogoConfirmar
					abierto={dialogo === 'quitar_app'}
					titulo="¿Quitar el acceso a la app?"
					texto="Ya no podrá entrar a la app móvil. Su acceso a la web no cambia."
					confirmar="Quitar acceso"
					peligro
					ocupado={guardando}
					onCerrar={() => setDialogo(null)}
					onConfirmar={() => cambiarApp(false)}
				/>
				<DialogoApp abierto={dialogo === 'app'} ocupado={guardando} onCerrar={() => setDialogo(null)} onConfirmar={(c) => cambiarApp(true, c)} />
				<DialogoCopiar
					abierto={dialogo === 'copiar'}
					excluir={idUsuario}
					onCerrar={() => setDialogo(null)}
					onCopiar={(u) => {
						const rolValido = (catalogos?.roles ?? []).find((r) => r.id_rol === u.id_rol && (!r.es_heredado || original?.id_rol === r.id_rol))
						if (rolValido) poner('id_rol')(u.id_rol)
						setAlcance(new Set(u.alcance.map((a) => claveAlcance(a.id_plaza, a.id_servicio, a.id_proceso))))
						setExcepciones(new Map(u.excepciones.map((x) => [x.codigo, x.concede])))
						setDialogo(null)
						setAviso({
							tipo: rolValido ? 'info' : 'warning',
							texto: `Se copiaron ${rolValido ? 'el rol, ' : ''}las plazas y las excepciones de ${nombreCompleto(u)}.${rolValido ? '' : ' Su rol es heredado y no se copió: elige uno.'} Revisa y guarda.`,
						})
					}}
				/>
			</Box>
		</TemaSero>
	)
}

// Fila con apagador (acceso web / app). Si está desactivado a propósito, dice por qué.
const FilaApagador = ({ id, titulo, descripcion, encendido, motivo, ocupado, onCambiar }) => (
	<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: 1.5, border: `1px solid ${colores.linea}`, borderRadius: '4px' }}>
		<Box sx={{ minWidth: 0 }}>
			<Typography component="label" htmlFor={id} sx={{ fontSize: 14, fontWeight: 500, color: colores.tinta }}>
				{titulo}
			</Typography>
			<Typography sx={{ fontSize: 13, color: colores.texto2 }}>{descripcion}</Typography>
			{motivo && (
				<Typography id={`${id}-motivo`} sx={{ fontSize: 12, color: colores.texto3, mt: 0.25 }}>
					{motivo}
				</Typography>
			)}
		</Box>
		<Switch
			id={id}
			checked={encendido}
			onChange={(e) => onCambiar(e.target.checked)}
			disabled={Boolean(motivo) || ocupado}
			inputProps={{ 'aria-describedby': motivo ? `${id}-motivo` : undefined }}
		/>
	</Box>
)

FilaApagador.propTypes = {
	id: PropTypes.string.isRequired,
	titulo: PropTypes.string.isRequired,
	descripcion: PropTypes.string,
	encendido: PropTypes.bool.isRequired,
	motivo: PropTypes.string,
	ocupado: PropTypes.bool,
	onCambiar: PropTypes.func.isRequired,
}

// ----- Diálogos

const DialogoConfirmar = ({ abierto, titulo, texto, confirmar, peligro, ocupado, onCerrar, onConfirmar }) => (
	<Dialog open={abierto} onClose={ocupado ? undefined : onCerrar} maxWidth="xs" fullWidth>
		<DialogTitle sx={{ fontSize: 18, fontWeight: 500 }}>{titulo}</DialogTitle>
		<DialogContent>
			<Typography sx={{ fontSize: 14, color: colores.texto2 }}>{texto}</Typography>
		</DialogContent>
		<DialogActions sx={{ px: 3, pb: 2 }}>
			<Button variant="outlined" onClick={onCerrar} disabled={ocupado}>
				Cancelar
			</Button>
			<Button variant="contained" onClick={onConfirmar} disabled={ocupado} sx={peligro ? { bgcolor: '#B42318', color: '#FFFFFF', '&:hover': { bgcolor: '#912018' } } : undefined}>
				{ocupado ? 'Un momento…' : confirmar}
			</Button>
		</DialogActions>
	</Dialog>
)

const DialogoApp = ({ abierto, ocupado, onCerrar, onConfirmar }) => {
	const [c1, setC1] = useState('')
	const [c2, setC2] = useState('')
	const [error, setError] = useState('')
	useEffect(() => {
		if (abierto) {
			setC1('')
			setC2('')
			setError('')
		}
	}, [abierto])
	const enviar = (e) => {
		e.preventDefault()
		e.stopPropagation()
		if (c1.length < 8) return setError('Al menos 8 caracteres')
		if (c1.trim() !== c1) return setError('Sin espacios al inicio o al final')
		if (c1 !== c2) return setError('Las contraseñas no coinciden')
		onConfirmar(c1)
		return undefined
	}
	return (
		<Dialog open={abierto} onClose={ocupado ? undefined : onCerrar} maxWidth="xs" fullWidth>
			<Box component="form" noValidate onSubmit={enviar}>
				<DialogTitle sx={{ fontSize: 18, fontWeight: 500 }}>Dar acceso a la app</DialogTitle>
				<DialogContent sx={{ display: 'grid', gap: 2 }}>
					<Typography sx={{ fontSize: 14, color: colores.texto2 }}>La app pide una contraseña. Esta será también su contraseña de la web.</Typography>
					<Campo id="app-c1" etiqueta="Contraseña" error={error}>
						<CampoContrasena id="app-c1" valor={c1} onCambiar={setC1} error={error} />
					</Campo>
					<Campo id="app-c2" etiqueta="Repite la contraseña">
						<CampoContrasena id="app-c2" valor={c2} onCambiar={setC2} />
					</Campo>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button variant="outlined" onClick={onCerrar} disabled={ocupado}>
						Cancelar
					</Button>
					<Button type="submit" variant="contained" disabled={ocupado}>
						{ocupado ? 'Un momento…' : 'Dar acceso'}
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

const DialogoCopiar = ({ abierto, excluir, onCerrar, onCopiar }) => {
	const [opciones, setOpciones] = useState([])
	const [cargando, setCargando] = useState(false)
	const [elegido, setElegido] = useState(null)
	const [error, setError] = useState('')
	useEffect(() => {
		if (!abierto) return
		setElegido(null)
		setError('')
		setCargando(true)
		listarUsuariosRequest({ estado: 'activo' })
			.then(({ data }) => setOpciones(data.usuarios.filter((u) => u.id_usuario !== excluir)))
			.catch((e) => setError(mensajeDeError(e)))
			.finally(() => setCargando(false))
	}, [abierto, excluir])
	const copiar = async () => {
		if (!elegido) return setError('Elige a una persona')
		setCargando(true)
		try {
			const { data } = await obtenerUsuarioRequest(elegido.id_usuario)
			onCopiar(data)
		} catch (e) {
			setError(mensajeDeError(e))
		} finally {
			setCargando(false)
		}
		return undefined
	}
	return (
		<Dialog open={abierto} onClose={onCerrar} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontSize: 18, fontWeight: 500 }}>Copiar accesos de otro usuario</DialogTitle>
			<DialogContent sx={{ display: 'grid', gap: 2 }}>
				<Typography sx={{ fontSize: 14, color: colores.texto2 }}>Se copian su rol, sus plazas y sus excepciones. Los datos personales y la contraseña no.</Typography>
				<Campo id="copiar-de" etiqueta="Copiar de" error={error}>
					<Autocomplete
						id="copiar-de"
						options={opciones}
						loading={cargando}
						value={elegido}
						onChange={(_, v) => {
							setElegido(v)
							setError('')
						}}
						getOptionLabel={(o) => `${nombreCompleto(o)} · ${o.rol ?? 'sin rol'}`}
						isOptionEqualToValue={(o, v) => o.id_usuario === v.id_usuario}
						noOptionsText="Nadie coincide"
						loadingText="Cargando…"
						openText="Abrir"
						closeText="Cerrar"
						clearText="Borrar"
						renderInput={(params) => <TextField {...params} placeholder="Busca por nombre" size="small" />}
					/>
				</Campo>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button variant="outlined" onClick={onCerrar}>
					Cancelar
				</Button>
				<Button variant="contained" onClick={copiar} disabled={cargando}>
					Copiar
				</Button>
			</DialogActions>
		</Dialog>
	)
}


Seccion.propTypes = {
	numero: PropTypes.number.isRequired,
	titulo: PropTypes.string.isRequired,
	descripcion: PropTypes.node,
	children: PropTypes.node,
	accion: PropTypes.node,
}

CampoContrasena.propTypes = {
	id: PropTypes.string.isRequired,
	valor: PropTypes.string.isRequired,
	onCambiar: PropTypes.func.isRequired,
	error: PropTypes.string,
	deshabilitado: PropTypes.bool,
	autoComplete: PropTypes.string,
}

DialogoConfirmar.propTypes = {
	abierto: PropTypes.bool.isRequired,
	titulo: PropTypes.string.isRequired,
	texto: PropTypes.string.isRequired,
	confirmar: PropTypes.string.isRequired,
	peligro: PropTypes.bool,
	ocupado: PropTypes.bool,
	onCerrar: PropTypes.func.isRequired,
	onConfirmar: PropTypes.func.isRequired,
}

DialogoApp.propTypes = {
	abierto: PropTypes.bool.isRequired,
	ocupado: PropTypes.bool,
	onCerrar: PropTypes.func.isRequired,
	onConfirmar: PropTypes.func.isRequired,
}

DialogoCopiar.propTypes = {
	abierto: PropTypes.bool.isRequired,
	excluir: PropTypes.number,
	onCerrar: PropTypes.func.isRequired,
	onCopiar: PropTypes.func.isRequired,
}

export default EditarUsuario
