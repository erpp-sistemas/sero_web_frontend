// S02-H2.5: árbol Plaza › Servicio › Proceso (DESIGN.md: sangría de 24px por nivel, buscador arriba, conteos en el padre)
// más el catálogo general de servicios y procesos (los que todavía no están en ninguna plaza también se editan aquí).
// Es el objeto que se edita, no un filtro de contexto: por eso esta pantalla no usa el selector de la barra superior
// (excepción anotada en DESIGN.md).
import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, ButtonBase, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { colores } from '../../../tema/seroTheme'
import { focoVisible } from '../../usuarios/componentes/utilidades'
import { ChipEstado } from '../../usuarios/componentes/comunes'
import { normalizar, plural } from './utilidadesCatalogo'

export const FILTROS_ESTADO = [
	{ valor: 'activos', texto: 'Activos' },
	{ valor: 'inactivos', texto: 'Inactivos' },
	{ valor: 'todos', texto: 'Todos' },
]

const pasaEstado = (activo, filtro) => filtro === 'todos' || (filtro === 'activos' ? activo : !activo)

// Arma plazas › servicios › procesos desde el catálogo, aplicando búsqueda y estado.
// Un nodo pasa si él o algún descendiente cumple; con "Activos", un hijo inactivo de una plaza activa no se muestra.
export const armarArbol = (catalogo, buscar, filtro) => {
	const b = normalizar(buscar.trim())
	const coincide = (nombre) => !b || normalizar(nombre).includes(b)
	const servicios = new Map(catalogo.servicios.map((s) => [s.id_servicio, s]))
	const procesos = new Map(catalogo.procesos.map((p) => [p.id_proceso, p]))

	return catalogo.plazas
		.map((plaza) => {
			const porServicio = new Map()
			for (const c of plaza.combinaciones) {
				const s = servicios.get(c.id_servicio)
				const p = procesos.get(c.id_proceso)
				if (!s || !p) continue
				if (!porServicio.has(s.id_servicio)) porServicio.set(s.id_servicio, { servicio: s, procesos: [] })
				porServicio.get(s.id_servicio).procesos.push({ proceso: p, personas: c.personas })
			}
			const hijos = [...porServicio.values()]
				.map((n) => {
					const procesosVisibles = n.procesos
						.filter((x) => pasaEstado(x.proceso.activo, filtro) || (filtro === 'inactivos' && !n.servicio.activo))
						.filter((x) => coincide(plaza.nombre) || coincide(n.servicio.nombre) || coincide(x.proceso.nombre))
					const servicioPasa = pasaEstado(n.servicio.activo, filtro) && (coincide(plaza.nombre) || coincide(n.servicio.nombre))
					return { ...n, totalProcesos: n.procesos.length, procesos: procesosVisibles, visible: servicioPasa || procesosVisibles.length > 0 }
				})
				.filter((n) => n.visible)
				.sort((a, b) => a.servicio.nombre.localeCompare(b.servicio.nombre, 'es'))
			const plazaPasa = pasaEstado(plaza.activo, filtro) && coincide(plaza.nombre)
			return { plaza, servicios: hijos, totalServicios: porServicio.size, visible: plazaPasa || hijos.length > 0 }
		})
		.filter((n) => n.visible)
}

export const filtrarLista = (lista, nombreCampo, buscar, filtro) => {
	const b = normalizar(buscar.trim())
	return lista.filter((x) => pasaEstado(x.activo, filtro) && (!b || normalizar(x[nombreCampo]).includes(b)))
}

const Nodo = ({ nivel, nombre, detalle, activo, seleccionado, abierto, onAlternar, onSeleccionar }) => (
	<Box component="li" sx={{ listStyle: 'none' }}>
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				minHeight: 36,
				pl: `${8 + nivel * 24}px`,
				pr: 1,
				bgcolor: seleccionado ? colores.seleccion : 'transparent',
				boxShadow: seleccionado ? `inset 2px 0 0 ${colores.verde}` : 'none',
				'&:hover': { bgcolor: seleccionado ? colores.seleccion : colores.banda },
			}}
		>
			{onAlternar ? (
				<ButtonBase
					onClick={onAlternar}
					aria-label={`${abierto ? 'Cerrar' : 'Abrir'} ${nombre}`}
					aria-expanded={abierto}
					sx={{ width: 24, height: 24, borderRadius: '4px', color: colores.texto3, flexShrink: 0, ...focoVisible }}
				>
					{abierto ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
				</ButtonBase>
			) : (
				<Box sx={{ width: 24, flexShrink: 0 }} />
			)}
			<ButtonBase
				onClick={onSeleccionar}
				aria-current={seleccionado ? 'true' : undefined}
				sx={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', textAlign: 'left', py: 0.75, px: 0.75, borderRadius: '4px', gap: 1, ...focoVisible }}
			>
				<Typography
					component="span"
					sx={{ fontSize: 14, color: activo ? colores.tinta : colores.texto3, fontWeight: seleccionado ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
				>
					{nombre}
				</Typography>
				{detalle && (
					<Typography component="span" sx={{ fontSize: 12, color: colores.texto3, whiteSpace: 'nowrap', flexShrink: 0 }}>
						{detalle}
					</Typography>
				)}
				{!activo && (
					<Box component="span" sx={{ flexShrink: 0, ml: 'auto' }}>
						<ChipEstado tipo="neutro">Inactivo</ChipEstado>
					</Box>
				)}
			</ButtonBase>
		</Box>
	</Box>
)

Nodo.propTypes = {
	nivel: PropTypes.number.isRequired,
	nombre: PropTypes.string.isRequired,
	detalle: PropTypes.string,
	activo: PropTypes.bool,
	seleccionado: PropTypes.bool,
	abierto: PropTypes.bool,
	onAlternar: PropTypes.func,
	onSeleccionar: PropTypes.func.isRequired,
}

const Titulo = ({ children }) => (
	<Typography component="h2" sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: colores.texto3, px: 1.5, pt: 2, pb: 0.5 }}>
		{children}
	</Typography>
)
Titulo.propTypes = { children: PropTypes.node }

const ArbolCatalogo = ({ catalogo, buscar, onBuscar, filtro, onFiltro, seleccion, onSeleccionar }) => {
	const [abiertos, setAbiertos] = useState(() => new Set())
	const arbol = useMemo(() => armarArbol(catalogo, buscar, filtro), [catalogo, buscar, filtro])
	const servicios = useMemo(() => filtrarLista(catalogo.servicios, 'nombre', buscar, filtro), [catalogo, buscar, filtro])
	const procesos = useMemo(() => filtrarLista(catalogo.procesos, 'nombre', buscar, filtro), [catalogo, buscar, filtro])
	const buscando = buscar.trim() !== ''

	const alternar = (clave) =>
		setAbiertos((a) => {
			const n = new Set(a)
			if (n.has(clave)) n.delete(clave)
			else n.add(clave)
			return n
		})
	const estaAbierto = (clave) => buscando || abiertos.has(clave)
	const esSel = (tipo, id, idPlaza = null) => seleccion?.tipo === tipo && seleccion?.id === id && (seleccion?.idPlaza ?? null) === idPlaza

	const nada = arbol.length === 0 && servicios.length === 0 && procesos.length === 0

	return (
		<Box>
			<OutlinedInput
				value={buscar}
				onChange={(e) => onBuscar(e.target.value)}
				placeholder="Buscar plaza, servicio o proceso"
				size="small"
				inputProps={{ 'aria-label': 'Buscar plaza, servicio o proceso', 'aria-controls': 'arbol-catalogo' }}
				startAdornment={
					<InputAdornment position="start">
						<SearchIcon fontSize="small" sx={{ color: colores.texto3 }} />
					</InputAdornment>
				}
				sx={{ width: '100%', height: 36, bgcolor: colores.blanco }}
			/>
			<Box role="group" aria-label="Estado" sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
				{FILTROS_ESTADO.map((f) => (
					<ButtonBase
						key={f.valor}
						onClick={() => onFiltro(f.valor)}
						aria-pressed={filtro === f.valor}
						sx={{
							px: 1.5,
							height: 28,
							borderRadius: 9999,
							fontSize: 13,
							border: `1px solid ${filtro === f.valor ? colores.marino : colores.borde}`,
							bgcolor: filtro === f.valor ? colores.marino : colores.blanco,
							color: filtro === f.valor ? colores.blanco : colores.marino,
							...focoVisible,
						}}
					>
						{f.texto}
					</ButtonBase>
				))}
			</Box>

			<Box id="arbol-catalogo" sx={{ mt: 1.5, border: `1px solid ${colores.linea}`, borderRadius: '4px', bgcolor: colores.blanco, pb: 1 }}>
				{nada && (
					<Typography sx={{ p: 3, textAlign: 'center', color: colores.texto2, fontSize: 14 }}>
						{buscando ? `Nada coincide con “${buscar}”.` : 'No hay elementos con este estado.'}
					</Typography>
				)}

				{arbol.length > 0 && <Titulo>Plazas</Titulo>}
				<Box component="ul" aria-label="Plazas, servicios y procesos" sx={{ p: 0, m: 0 }}>
					{arbol.map(({ plaza, servicios: hijos, totalServicios }) => {
						const clave = `p${plaza.id_plaza}`
						return (
							<Box component="li" key={clave} sx={{ listStyle: 'none' }}>
								<Box component="ul" sx={{ p: 0, m: 0 }}>
									<Nodo
										nivel={0}
										nombre={plaza.nombre}
										detalle={plural(totalServicios, 'servicio', 'servicios')}
										activo={plaza.activo}
										seleccionado={esSel('plaza', plaza.id_plaza)}
										abierto={estaAbierto(clave)}
										onAlternar={hijos.length ? () => alternar(clave) : undefined}
										onSeleccionar={() => onSeleccionar({ tipo: 'plaza', id: plaza.id_plaza })}
									/>
									{estaAbierto(clave) &&
										hijos.map((n) => {
											const claveS = `${clave}s${n.servicio.id_servicio}`
											return (
												<Box component="li" key={claveS} sx={{ listStyle: 'none' }}>
													<Box component="ul" sx={{ p: 0, m: 0 }}>
														<Nodo
															nivel={1}
															nombre={n.servicio.nombre}
															detalle={plural(n.totalProcesos, 'proceso', 'procesos')}
															activo={n.servicio.activo}
															seleccionado={esSel('servicio', n.servicio.id_servicio, plaza.id_plaza)}
															abierto={estaAbierto(claveS)}
															onAlternar={n.procesos.length ? () => alternar(claveS) : undefined}
															onSeleccionar={() => onSeleccionar({ tipo: 'servicio', id: n.servicio.id_servicio, idPlaza: plaza.id_plaza })}
														/>
														{estaAbierto(claveS) &&
															n.procesos.map((x) => (
																<Nodo
																	key={`${claveS}r${x.proceso.id_proceso}`}
																	nivel={2}
																	nombre={x.proceso.nombre}
																	detalle={plural(x.personas, 'persona', 'personas')}
																	activo={x.proceso.activo}
																	seleccionado={esSel('proceso', x.proceso.id_proceso, plaza.id_plaza)}
																	onSeleccionar={() => onSeleccionar({ tipo: 'proceso', id: x.proceso.id_proceso, idPlaza: plaza.id_plaza })}
																/>
															))}
													</Box>
												</Box>
											)
										})}
								</Box>
							</Box>
						)
					})}
				</Box>

				{(servicios.length > 0 || procesos.length > 0) && (
					<Typography sx={{ fontSize: 12, color: colores.texto3, px: 1.5, pt: 2 }}>
						Catálogo general: los mismos servicios y procesos para todas las plazas.
					</Typography>
				)}
				{servicios.length > 0 && <Titulo>Servicios</Titulo>}
				<Box component="ul" aria-label="Todos los servicios" sx={{ p: 0, m: 0 }}>
					{servicios.map((s) => (
						<Nodo
							key={`s${s.id_servicio}`}
							nivel={0}
							nombre={s.nombre}
							activo={s.activo}
							seleccionado={esSel('servicio', s.id_servicio)}
							onSeleccionar={() => onSeleccionar({ tipo: 'servicio', id: s.id_servicio })}
						/>
					))}
				</Box>
				{procesos.length > 0 && <Titulo>Procesos</Titulo>}
				<Box component="ul" aria-label="Todos los procesos" sx={{ p: 0, m: 0 }}>
					{procesos.map((p) => (
						<Nodo
							key={`r${p.id_proceso}`}
							nivel={0}
							nombre={p.nombre}
							activo={p.activo}
							seleccionado={esSel('proceso', p.id_proceso)}
							onSeleccionar={() => onSeleccionar({ tipo: 'proceso', id: p.id_proceso })}
						/>
					))}
				</Box>
			</Box>
		</Box>
	)
}

ArbolCatalogo.propTypes = {
	catalogo: PropTypes.shape({ plazas: PropTypes.array, servicios: PropTypes.array, procesos: PropTypes.array }).isRequired,
	buscar: PropTypes.string.isRequired,
	onBuscar: PropTypes.func.isRequired,
	filtro: PropTypes.oneOf(FILTROS_ESTADO.map((f) => f.valor)).isRequired,
	onFiltro: PropTypes.func.isRequired,
	seleccion: PropTypes.shape({ tipo: PropTypes.string, id: PropTypes.number, idPlaza: PropTypes.number }),
	onSeleccionar: PropTypes.func.isRequired,
}

export default ArbolCatalogo
