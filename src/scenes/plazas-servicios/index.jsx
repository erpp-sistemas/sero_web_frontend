// S02-H2.5: "Plazas y servicios" (/plazas-servicios): plaza → sus servicios → sus procesos (y tareas), en una sola
// pantalla. Reemplaza Plazas (/maintenance, /places), Servicios (/service), Procesos (/process) y Tareas (/task).
// Datos de GET /admin/catalogo; cambios por /admin/catalogo/* (token + permiso por acción). Nada se borra.
// Tiene su propio árbol en lugar del selector de contexto de la barra superior: edita el catálogo (incluye lo inactivo y
// lo que nadie tiene asignado), no elige dónde se trabaja (excepción anotada en DESIGN.md).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Skeleton, Typography, useMediaQuery } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import TemaSero from '../../tema/TemaSero'
import { colores } from '../../tema/seroTheme'
import useMisPermisos from '../../hooks/useMisPermisos'
import { mensajeDeError } from '../../api/usuariosAdmin'
import {
	agregarCombinacionRequest,
	cambiarEstadoEnCatalogoRequest,
	crearEnCatalogoRequest,
	editarEnCatalogoRequest,
	obtenerCatalogoRequest,
} from '../../api/catalogoAdmin'
import { EncabezadoPagina, EstadoPantalla } from '../usuarios/componentes/comunes'
import AvisoCambiosSinGuardar from '../usuarios/componentes/AvisoCambiosSinGuardar'
import ArbolCatalogo from './componentes/ArbolCatalogo'
import Detalle from './componentes/Detalle'
import DialogoEstado from './componentes/DialogoEstado'
import { TIPOS, csvCatalogo } from './componentes/utilidadesCatalogo'

const lista = { plaza: 'plazas', servicio: 'servicios', proceso: 'procesos', tarea: 'tareas' }

const PlazasServicios = () => {
	const { puede, cargando: cargandoPermisos, error: errorPermisos } = useMisPermisos()
	const celular = useMediaQuery('(max-width: 899.95px)')
	const [catalogo, setCatalogo] = useState(null)
	const [cargando, setCargando] = useState(true)
	const [error, setError] = useState('')
	const [buscar, setBuscar] = useState('')
	const [filtro, setFiltro] = useState('activos')
	const [seleccion, setSeleccion] = useState(null) // { tipo, id, idPlaza } | { tipo, nuevo: true }
	const [aviso, setAviso] = useState('')
	const [estado, setEstado] = useState(null) // { tipo, elemento, activar }
	const [hayCambios, setHayCambios] = useState(false)
	const [pendiente, setPendiente] = useState(null) // selección que espera confirmar "salir sin guardar"
	const salidaPermitida = useRef(false)
	const [menuAgregar, setMenuAgregar] = useState(null)
	const puedeVer = puede('plazas', 'read')

	const cargar = useCallback(async () => {
		setError('')
		try {
			const r = await obtenerCatalogoRequest()
			setCatalogo(r.data)
			return r.data
		} catch (e) {
			setError(mensajeDeError(e, 'No se pudo cargar el catálogo'))
			return null
		} finally {
			setCargando(false)
		}
	}, [])

	useEffect(() => {
		if (!cargandoPermisos && puedeVer) cargar()
		else if (!cargandoPermisos) setCargando(false)
	}, [cargandoPermisos, puedeVer, cargar])

	const elegir = (nueva) => {
		if (hayCambios) return setPendiente(nueva ?? { vacio: true })
		setSeleccion(nueva)
		setAviso('')
		return undefined
	}

	const elemento = useMemo(() => {
		if (!catalogo || !seleccion || seleccion.nuevo) return null
		return catalogo[lista[seleccion.tipo]]?.find((x) => x[TIPOS[seleccion.tipo].idCampo] === seleccion.id) ?? null
	}, [catalogo, seleccion])

	const guardar = async (datos) => {
		const t = TIPOS[seleccion.tipo]
		if (seleccion.nuevo) {
			const r = await crearEnCatalogoRequest(t.api, datos)
			setHayCambios(false)
			await cargar()
			setSeleccion({ tipo: seleccion.tipo, id: r.data[t.idCampo] })
			setAviso(`Se creó ${t.articulo} “${datos.nombre}”.`)
		} else {
			await editarEnCatalogoRequest(t.api, seleccion.id, datos)
			setHayCambios(false)
			await cargar()
			setAviso('Cambios guardados.')
		}
	}

	const confirmarEstado = async () => {
		const { tipo, elemento: e, activar } = estado
		const t = TIPOS[tipo]
		await cambiarEstadoEnCatalogoRequest(t.api, e[t.idCampo], activar)
		setEstado(null)
		await cargar()
		setAviso(`${t.articulo.charAt(0).toUpperCase()}${t.articulo.slice(1)} “${e.nombre}” quedó ${activar ? (tipo === 'plaza' || tipo === 'tarea' ? 'activa' : 'activo') : tipo === 'plaza' || tipo === 'tarea' ? 'desactivada' : 'desactivado'}.`)
	}

	const combinacion = async (idPlaza, idServicio, idProceso) => {
		await agregarCombinacionRequest(idPlaza, idServicio, idProceso)
		await cargar()
		setAviso('Se agregó el servicio y proceso a la plaza.')
	}

	const tarea = async (t, nombre, idProceso) => {
		if (t) await editarEnCatalogoRequest('tareas', t.id_tarea, { nombre })
		else await crearEnCatalogoRequest('tareas', { nombre, id_proceso: idProceso })
		await cargar()
		setAviso(t ? 'Se cambió el nombre de la tarea.' : `Se creó la tarea “${nombre}”.`)
	}

	const exportar = () => {
		const blob = new Blob([csvCatalogo(catalogo)], { type: 'text/csv;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `plazas-servicios-procesos-${new Date().toISOString().slice(0, 10)}.csv`
		a.click()
		URL.revokeObjectURL(url)
	}

	const onCambios = useCallback((v) => setHayCambios(v), [])

	// --- Estados de la pantalla
	let contenido
	if (cargandoPermisos || (cargando && puedeVer)) {
		contenido = (
			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '360px 1fr' }, gap: 4 }} aria-busy="true" aria-label="Cargando el catálogo">
				<Box>
					<Skeleton height={40} />
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} height={32} />
					))}
				</Box>
				<Box sx={{ display: { xs: 'none', md: 'block' } }}>
					<Skeleton height={48} width="50%" />
					<Skeleton height={200} />
				</Box>
			</Box>
		)
	} else if (errorPermisos) {
		contenido = <EstadoPantalla icono={ErrorOutlineIcon} titulo="No se pudieron revisar tus permisos" descripcion="Vuelve a cargar la página." />
	} else if (!puedeVer) {
		contenido = (
			<EstadoPantalla
				icono={LockOutlinedIcon}
				titulo="No tienes acceso a plazas y servicios"
				descripcion="Pide a un administrador el permiso “Plazas y servicios: ver”."
			/>
		)
	} else if (error && !catalogo) {
		contenido = (
			<EstadoPantalla
				icono={ErrorOutlineIcon}
				titulo="No se pudo cargar el catálogo"
				descripcion={error}
				accion={
					<Button variant="outlined" onClick={() => { setCargando(true); cargar() }}>
						Intentar de nuevo
					</Button>
				}
			/>
		)
	} else if (catalogo) {
		const vacio = catalogo.plazas.length === 0 && catalogo.servicios.length === 0 && catalogo.procesos.length === 0
		const detalle = seleccion && (seleccion.nuevo || elemento) && (
			<Detalle
				key={`${seleccion.tipo}-${seleccion.nuevo ? 'nuevo' : seleccion.id}`}
				tipo={seleccion.tipo}
				elemento={elemento}
				nuevo={Boolean(seleccion.nuevo)}
				catalogo={catalogo}
				idPlazaContexto={seleccion.idPlaza}
				puede={puede}
				puedeCrearPlaza={Boolean(catalogo.puede_crear_plaza)}
				onGuardar={guardar}
				onEstado={(tipo, e, activar) => setEstado({ tipo, elemento: e, activar })}
				onCombinacion={combinacion}
				onTarea={tarea}
				onVolver={celular ? () => elegir(null) : undefined}
				onCancelarNuevo={() => { setHayCambios(false); setSeleccion(null) }}
				onSeleccionar={elegir}
				onCambios={onCambios}
			/>
		)
		contenido = vacio ? (
			<EstadoPantalla icono={AccountTreeOutlinedIcon} titulo="Todavía no hay plazas, servicios ni procesos" descripcion="Crea el primero con los botones de arriba." />
		) : (
			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '360px minmax(0, 1fr)' }, gap: 4, alignItems: 'start' }}>
				{(!celular || !seleccion) && (
					<Box component="nav" aria-label="Catálogo" sx={{ position: { md: 'sticky' }, top: { md: 16 } }}>
						<ArbolCatalogo
							catalogo={catalogo}
							buscar={buscar}
							onBuscar={setBuscar}
							filtro={filtro}
							onFiltro={setFiltro}
							seleccion={seleccion}
							onSeleccionar={elegir}
						/>
					</Box>
				)}
				{(!celular || seleccion) && (
					<Box component="section" aria-label="Detalle" sx={{ minWidth: 0 }}>
						{detalle || (
							<EstadoPantalla
								icono={AccountTreeOutlinedIcon}
								titulo="Elige una plaza, servicio o proceso"
								descripcion="Verás sus datos, dónde se usa y lo que puedes cambiar."
							/>
						)}
					</Box>
				)}
			</Box>
		)
	}

	// Altas: plaza solo Superadmin (decisión 6); servicio y proceso con su permiso "crear".
	const altas = catalogo
		? [
				catalogo.puede_crear_plaza && { tipo: 'plaza', texto: 'Plaza' },
				puede('servicios', 'create') && { tipo: 'servicio', texto: 'Servicio' },
				puede('procesos', 'create') && { tipo: 'proceso', texto: 'Proceso' },
			].filter(Boolean)
		: []
	const acciones =
		catalogo && puedeVer ? (
			<>
				{altas.length > 0 && (
					<>
						<Button
							variant="outlined"
							startIcon={<AddIcon />}
							endIcon={<ExpandMoreIcon />}
							onClick={(e) => setMenuAgregar(e.currentTarget)}
							aria-haspopup="menu"
							aria-expanded={Boolean(menuAgregar)}
							aria-controls={menuAgregar ? 'menu-agregar' : undefined}
						>
							Agregar
						</Button>
						<Menu id="menu-agregar" anchorEl={menuAgregar} open={Boolean(menuAgregar)} onClose={() => setMenuAgregar(null)}>
							{altas.map((a) => (
								<MenuItem
									key={a.tipo}
									onClick={() => {
										setMenuAgregar(null)
										elegir({ tipo: a.tipo, nuevo: true })
									}}
								>
									{a.texto}
								</MenuItem>
							))}
						</Menu>
					</>
				)}
				{puede('plazas', 'export') && (
					<Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={exportar}>
						Exportar
					</Button>
				)}
			</>
		) : null

	return (
		<TemaSero>
			<Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1320, mx: 'auto', bgcolor: colores.blanco, minHeight: '100%' }}>
				<EncabezadoPagina
					eyebrow="Administración"
					titulo="Plazas y servicios"
					descripcion="Plazas, sus servicios y procesos, y las tareas de cada proceso. Nada se borra: lo que ya no se usa se desactiva."
					acciones={acciones}
				/>
				{aviso && (
					<Alert severity="success" onClose={() => setAviso('')} sx={{ mb: 3 }} role="status">
						{aviso}
					</Alert>
				)}
				{error && catalogo && (
					<Alert severity="error" sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}
				{contenido}
			</Box>

			<DialogoEstado
				abierto={Boolean(estado)}
				tipo={estado?.tipo}
				elemento={estado?.elemento}
				activar={Boolean(estado?.activar)}
				onCerrar={() => setEstado(null)}
				onConfirmar={confirmarEstado}
			/>

			<Dialog open={Boolean(pendiente)} onClose={() => setPendiente(null)} maxWidth="xs" fullWidth>
				<DialogTitle sx={{ fontSize: 18, fontWeight: 500 }}>Tienes cambios sin guardar</DialogTitle>
				<DialogContent>
					<Typography sx={{ fontSize: 14, color: colores.texto2 }}>Si cambias de elemento ahora, se pierden.</Typography>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button variant="contained" onClick={() => setPendiente(null)} autoFocus>
						Seguir editando
					</Button>
					<Button
						variant="outlined"
						onClick={() => {
							setHayCambios(false)
							setSeleccion(pendiente.tipo ? pendiente : null)
							setPendiente(null)
							setAviso('')
						}}
						sx={{ color: '#B42318', borderColor: '#F3C5C1' }}
					>
						Descartar cambios
					</Button>
				</DialogActions>
			</Dialog>
			<AvisoCambiosSinGuardar activo={hayCambios} salidaPermitida={salidaPermitida} />
		</TemaSero>
	)
}

export default PlazasServicios
