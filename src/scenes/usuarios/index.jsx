// S02-H2.4: lista de usuarios (DESIGN.md: encabezado, filtros como pills, tabla compacta, estados).
// Datos de GET /admin/usuarios (el backend filtra por alcance: Superadmin y Director ven a todos).
import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
	Alert,
	Box,
	Button,
	ButtonBase,
	InputAdornment,
	MenuItem,
	OutlinedInput,
	Select,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import TemaSero from '../../tema/TemaSero'
import { colores } from '../../tema/seroTheme'
import useMisPermisos from '../../hooks/useMisPermisos'
import { listarUsuariosRequest, obtenerCatalogosUsuariosRequest, mensajeDeError } from '../../api/usuariosAdmin'
import { ChipEstado, EncabezadoPagina, EstadoPantalla } from './componentes/comunes'
import { focoVisible, nombreCompleto } from './componentes/utilidades'

const ESTADOS_FILTRO = [
	{ valor: 'activo', texto: 'Activos' },
	{ valor: 'inactivo', texto: 'Inactivos' },
	{ valor: 'todos', texto: 'Todos' },
]

const CLAVE_DENSIDAD = 'sero.usuarios.densidad'
const leerDensidad = () => {
	try {
		return localStorage.getItem(CLAVE_DENSIDAD) === 'comoda' ? 'comoda' : 'compacta'
	} catch {
		return 'compacta'
	}
}

const Pill = ({ activo, onClick, children }) => (
	<ButtonBase
		onClick={onClick}
		aria-pressed={activo}
		sx={{
			height: 32,
			px: 1.5,
			borderRadius: 9999,
			fontSize: 13,
			border: `1px solid ${activo ? colores.marino : colores.borde}`,
			bgcolor: activo ? colores.seleccion : colores.blanco,
			color: activo ? colores.tinta : colores.texto2,
			fontWeight: activo ? 500 : 400,
			...focoVisible,
		}}
	>
		{children}
	</ButtonBase>
)

Pill.propTypes = { activo: PropTypes.bool, onClick: PropTypes.func, children: PropTypes.node }

const estiloSelect = { height: 32, fontSize: 13, minWidth: 160, bgcolor: colores.blanco, borderRadius: 9999, '& .MuiSelect-select': { py: 0, pl: 1.5 } }

// Marca de orden de bytes: Excel abre el CSV con acentos correctos
const BOM = String.fromCharCode(0xfeff)

const exportarCsv = (usuarios) => {
	const columnas = ['Nombre', 'Correo', 'Rol', 'Plazas', 'Web', 'App', 'Estado', 'Excepciones']
	const celda = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
	const filas = usuarios.map((u) =>
		[nombreCompleto(u), u.usuario, u.rol, u.plazas, u.acceso_web ? 'Sí' : 'No', u.acceso_app ? 'Sí' : 'No', u.activo ? 'Activo' : 'Inactivo', u.excepciones]
			.map(celda)
			.join(','),
	)
	const blob = new Blob([`${BOM}${[columnas.map(celda).join(','), ...filas].join('\r\n')}`], { type: 'text/csv;charset=utf-8' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = `usuarios-${new Date().toISOString().slice(0, 10)}.csv`
	a.click()
	URL.revokeObjectURL(url)
}

const Usuarios = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const misPermisos = useMisPermisos()
	const [catalogos, setCatalogos] = useState(null)
	const [buscarTexto, setBuscarTexto] = useState('')
	const [buscar, setBuscar] = useState('')
	const [idRol, setIdRol] = useState('')
	const [idPlaza, setIdPlaza] = useState('')
	const [estado, setEstado] = useState('activo')
	const [datos, setDatos] = useState({ cargando: true, error: null, sinPermiso: false, usuarios: [] })
	const [pagina, setPagina] = useState(0)
	const [porPagina, setPorPagina] = useState(50)
	const [densidad, setDensidad] = useState(leerDensidad)
	const [intento, setIntento] = useState(0)
	const avisoInicial = location.state?.aviso ?? null

	const puedeLeer = misPermisos.tiene('usuarios.read')

	// Búsqueda con espera corta para no pedir en cada tecla
	useEffect(() => {
		const t = setTimeout(() => setBuscar(buscarTexto.trim()), 300)
		return () => clearTimeout(t)
	}, [buscarTexto])

	useEffect(() => {
		if (!puedeLeer) return
		obtenerCatalogosUsuariosRequest()
			.then(({ data }) => setCatalogos(data))
			.catch(() => setCatalogos({ roles: [], arbol: [] }))
	}, [puedeLeer])

	useEffect(() => {
		if (misPermisos.cargando || !puedeLeer) return undefined
		let vigente = true
		setDatos((d) => ({ ...d, cargando: true, error: null }))
		listarUsuariosRequest({ buscar, idRol, idPlaza, estado })
			.then(({ data }) => {
				if (!vigente) return
				setDatos({ cargando: false, error: null, sinPermiso: false, usuarios: data.usuarios })
				setPagina(0)
			})
			.catch((error) => {
				if (!vigente) return
				const status = error?.response?.status
				setDatos({ cargando: false, error: status === 403 ? null : mensajeDeError(error), sinPermiso: status === 403, usuarios: [] })
			})
		return () => {
			vigente = false
		}
	}, [buscar, idRol, idPlaza, estado, misPermisos.cargando, puedeLeer, intento])

	const cambiarDensidad = (valor) => {
		setDensidad(valor)
		try {
			localStorage.setItem(CLAVE_DENSIDAD, valor)
		} catch {
			/* sin almacenamiento: solo esta vez */
		}
	}

	const visibles = useMemo(() => datos.usuarios.slice(pagina * porPagina, pagina * porPagina + porPagina), [datos.usuarios, pagina, porPagina])
	const hayFiltros = Boolean(buscar || idRol || idPlaza || estado !== 'activo')
	const compacta = densidad === 'compacta'

	const acciones = (
		<>
			{misPermisos.tiene('usuarios.export') && (
				<Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} disabled={!datos.usuarios.length} onClick={() => exportarCsv(datos.usuarios)} sx={focoVisible}>
					Exportar
				</Button>
			)}
			{misPermisos.tiene('usuarios.create') && (
				<Button variant="contained" startIcon={<PersonAddAlt1OutlinedIcon />} onClick={() => navigate('/usuarios/nuevo')} sx={focoVisible}>
					Nuevo usuario
				</Button>
			)}
		</>
	)

	let contenido
	if (misPermisos.cargando) {
		contenido = <Skeleton variant="rectangular" height={320} sx={{ borderRadius: '4px' }} />
	} else if (misPermisos.error) {
		contenido = (
			<EstadoPantalla
				icono={ErrorOutlineIcon}
				titulo="No se pudieron revisar tus permisos"
				descripcion="Revisa tu conexión e intenta de nuevo."
				accion={<Button variant="outlined" onClick={misPermisos.recargar}>Reintentar</Button>}
			/>
		)
	} else if (!puedeLeer || datos.sinPermiso) {
		contenido = (
			<EstadoPantalla icono={LockOutlinedIcon} titulo="No tienes acceso a usuarios" descripcion="Pide a un administrador que te dé el permiso para ver usuarios." />
		)
	} else {
		contenido = (
			<>
				{/* Filtros */}
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 2 }}>
					<OutlinedInput
						value={buscarTexto}
						onChange={(e) => setBuscarTexto(e.target.value)}
						placeholder="Buscar por nombre o correo"
						inputProps={{ 'aria-label': 'Buscar por nombre o correo', maxLength: 100 }}
						startAdornment={
							<InputAdornment position="start">
								<SearchIcon fontSize="small" sx={{ color: colores.texto3 }} />
							</InputAdornment>
						}
						sx={{ height: 32, fontSize: 13, width: { xs: '100%', sm: 280 }, bgcolor: colores.blanco, borderRadius: 9999 }}
					/>
					<Select
						value={idRol}
						onChange={(e) => setIdRol(e.target.value)}
						displayEmpty
						inputProps={{ 'aria-label': 'Filtrar por rol' }}
						sx={estiloSelect}
					>
						<MenuItem value="">Todos los roles</MenuItem>
						{(catalogos?.roles ?? []).map((r) => (
							<MenuItem key={r.id_rol} value={r.id_rol}>
								{r.nombre}
								{r.es_heredado ? ' (heredado)' : ''}
							</MenuItem>
						))}
					</Select>
					<Select
						value={idPlaza}
						onChange={(e) => setIdPlaza(e.target.value)}
						displayEmpty
						inputProps={{ 'aria-label': 'Filtrar por plaza' }}
						sx={estiloSelect}
					>
						<MenuItem value="">Todas las plazas</MenuItem>
						{(catalogos?.arbol ?? []).map((p) => (
							<MenuItem key={p.id_plaza} value={p.id_plaza}>
								{p.nombre}
							</MenuItem>
						))}
					</Select>
					<Box role="group" aria-label="Estado" sx={{ display: 'flex', gap: 0.5 }}>
						{ESTADOS_FILTRO.map((e) => (
							<Pill key={e.valor} activo={estado === e.valor} onClick={() => setEstado(e.valor)}>
								{e.texto}
							</Pill>
						))}
					</Box>
					<Box sx={{ flex: 1 }} />
					<Box role="group" aria-label="Densidad de la tabla" sx={{ display: 'flex', gap: 0.5 }}>
						<Pill activo={compacta} onClick={() => cambiarDensidad('compacta')}>
							Compacta
						</Pill>
						<Pill activo={!compacta} onClick={() => cambiarDensidad('comoda')}>
							Cómoda
						</Pill>
					</Box>
				</Box>

				{datos.error ? (
					<EstadoPantalla
						icono={ErrorOutlineIcon}
						titulo="No se pudo cargar la lista"
						descripcion={datos.error}
						accion={<Button variant="outlined" onClick={() => setIntento((n) => n + 1)}>Reintentar</Button>}
					/>
				) : !datos.cargando && datos.usuarios.length === 0 ? (
					<EstadoPantalla
						icono={GroupOutlinedIcon}
						titulo={hayFiltros ? 'Nadie coincide con los filtros' : 'Todavía no hay usuarios'}
						descripcion={hayFiltros ? 'Cambia la búsqueda o quita algún filtro.' : 'Da de alta a la primera persona.'}
						accion={
							hayFiltros ? (
								<Button
									variant="outlined"
									onClick={() => {
										setBuscarTexto('')
										setIdRol('')
										setIdPlaza('')
										setEstado('activo')
									}}
								>
									Quitar filtros
								</Button>
							) : null
						}
					/>
				) : (
					<Box sx={{ border: `1px solid ${colores.linea}`, borderRadius: '4px', bgcolor: colores.blanco, overflow: 'hidden' }}>
						<TableContainer sx={{ maxHeight: { xs: 'none', md: 'calc(100vh - 330px)' } }}>
							<Table stickyHeader size={compacta ? 'small' : 'medium'} aria-label="Usuarios" aria-busy={datos.cargando} sx={{ tableLayout: 'fixed', width: '100%' }}>
								<TableHead>
									<TableRow>
										<TableCell sx={{ width: { xs: '68%', sm: '34%' } }}>Persona</TableCell>
										<TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, width: 150 }}>Rol</TableCell>
										<TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Plazas</TableCell>
										<TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, width: 130 }}>Acceso</TableCell>
										<TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, width: 120 }} align="right">
											Excepciones
										</TableCell>
										<TableCell sx={{ width: { xs: '32%', sm: 110 } }}>Estado</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{datos.cargando
										? Array.from({ length: 8 }).map((_, i) => (
												<TableRow key={i}>
													{Array.from({ length: 6 }).map((__, j) => (
														<TableCell key={j} sx={j === 1 ? { display: { xs: 'none', sm: 'table-cell' } } : j === 2 ? { display: { xs: 'none', md: 'table-cell' } } : j === 3 ? { display: { xs: 'none', sm: 'table-cell' } } : j === 4 ? { display: { xs: 'none', lg: 'table-cell' } } : undefined}>
															<Skeleton width={j === 0 ? 180 : 80} />
														</TableCell>
													))}
												</TableRow>
										))
										: visibles.map((u) => (
												<TableRow
													key={u.id_usuario}
													hover
													onClick={() => navigate(`/usuarios/${u.id_usuario}`)}
													sx={{ cursor: 'pointer', '&:hover': { bgcolor: `${colores.banda} !important` } }}
												>
													<TableCell>
														<Box
															component={RouterLink}
															to={`/usuarios/${u.id_usuario}`}
															onClick={(e) => e.stopPropagation()}
															sx={{
																color: colores.tinta,
																fontWeight: 500,
																textDecoration: 'none',
																display: 'block',
																overflow: 'hidden',
																textOverflow: 'ellipsis',
																whiteSpace: 'nowrap',
																'&:focus-visible': { outline: `2px solid ${colores.marino}`, outlineOffset: 2, borderRadius: '2px' },
															}}
														>
															{nombreCompleto(u) || 'Sin nombre'}
														</Box>
														<Typography sx={{ fontSize: 12, color: colores.texto3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
															{u.usuario || 'Sin usuario de acceso'}
														</Typography>
														{/* En celular el rol va aquí (su columna se oculta) */}
														<Typography sx={{ display: { xs: 'block', sm: 'none' }, fontSize: 12, color: colores.texto2 }}>{u.rol || 'Sin rol'}</Typography>
													</TableCell>
													<TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
														{u.rol || '—'}
														{u.rol_heredado && (
															<Typography component="span" sx={{ fontSize: 12, color: colores.texto3 }}>
																{' '}
																· heredado
															</Typography>
														)}
													</TableCell>
													<TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
														<Box title={u.plazas} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: u.plazas ? colores.tinta : colores.texto3 }}>
															{u.plazas || 'Sin plazas'}
														</Box>
													</TableCell>
													<TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
														<Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
															{u.acceso_web && <ChipEstado tipo="info">Web</ChipEstado>}
															{u.acceso_app && <ChipEstado tipo="info">App</ChipEstado>}
															{!u.acceso_web && !u.acceso_app && <ChipEstado tipo="neutro">Sin acceso</ChipEstado>}
														</Box>
													</TableCell>
													<TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }} align="right">
														{u.excepciones ? (
															<ChipEstado tipo="advertencia">{u.excepciones}</ChipEstado>
														) : (
															<Typography component="span" sx={{ fontSize: 'inherit', color: colores.texto3 }}>
																—
															</Typography>
														)}
													</TableCell>
													<TableCell>
														<ChipEstado tipo={u.activo ? 'exito' : 'neutro'}>{u.activo ? 'Activo' : 'Inactivo'}</ChipEstado>
													</TableCell>
												</TableRow>
										))}
								</TableBody>
							</Table>
						</TableContainer>
						{!datos.cargando && (
							<TablePagination
								component="div"
								count={datos.usuarios.length}
								page={pagina}
								onPageChange={(_, p) => setPagina(p)}
								rowsPerPage={porPagina}
								onRowsPerPageChange={(e) => {
									setPorPagina(Number(e.target.value))
									setPagina(0)
								}}
								rowsPerPageOptions={[25, 50, 100]}
								labelRowsPerPage="Filas por página"
								labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
								sx={{ borderTop: `1px solid ${colores.linea}`, color: colores.texto2 }}
							/>
						)}
					</Box>
				)}
			</>
		)
	}

	return (
		<TemaSero>
			<Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1320, mx: 'auto', bgcolor: colores.blanco, minHeight: '100%' }}>
				<EncabezadoPagina
					eyebrow="Administración"
					titulo="Usuarios"
					descripcion="Quién entra a la web y a la app, con qué rol, en qué plazas y qué puede hacer."
					acciones={!misPermisos.cargando && puedeLeer ? acciones : null}
				/>
				{avisoInicial && (
					<Alert severity="success" sx={{ mb: 2 }} onClose={() => navigate(location.pathname, { replace: true, state: null })}>
						{avisoInicial}
					</Alert>
				)}
				{contenido}
			</Box>
		</TemaSero>
	)
}

export default Usuarios
