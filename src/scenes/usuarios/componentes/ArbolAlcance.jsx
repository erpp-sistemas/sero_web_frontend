// S02-H2.4: árbol Plaza › Servicio › Proceso con casillas reales, buscador y conteo (DESIGN.md).
// La selección es un Set de claves "plaza-servicio-proceso".
import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, ButtonBase, Checkbox, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { colores } from '../../../tema/seroTheme'
import { claveAlcance, focoVisible } from './utilidades'

const normalizar = (t) =>
	String(t ?? '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')

const Fila = ({ nivel, etiqueta, conteo, estado, onCambiar, abierto, onAlternar, deshabilitado, id }) => (
	<Box sx={{ display: 'flex', alignItems: 'center', minHeight: 36, pl: `${nivel * 24}px`, '&:hover': { bgcolor: colores.banda } }}>
		{onAlternar ? (
			<ButtonBase
				onClick={onAlternar}
				aria-label={abierto ? `Cerrar ${etiqueta}` : `Abrir ${etiqueta}`}
				aria-expanded={abierto}
				sx={{ width: 28, height: 28, borderRadius: '4px', color: colores.texto2, ...focoVisible }}
			>
				{abierto ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
			</ButtonBase>
		) : (
			<Box sx={{ width: 28 }} />
		)}
		<Checkbox
			id={id}
			size="small"
			checked={estado === 'todo'}
			indeterminate={estado === 'parcial'}
			onChange={(e) => onCambiar(e.target.checked)}
			disabled={deshabilitado}
			sx={{ p: 0.5, color: colores.borde, '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: colores.marino } }}
		/>
		<Typography component="label" htmlFor={id} sx={{ fontSize: 14, color: colores.tinta, cursor: deshabilitado ? 'default' : 'pointer', flex: 1, minWidth: 0, py: 0.5 }}>
			{etiqueta}
		</Typography>
		{conteo && <Typography sx={{ fontSize: 12, color: colores.texto3, pr: 1.5, whiteSpace: 'nowrap' }}>{conteo}</Typography>}
	</Box>
)

Fila.propTypes = {
	nivel: PropTypes.number.isRequired,
	etiqueta: PropTypes.string.isRequired,
	conteo: PropTypes.string,
	estado: PropTypes.oneOf(['nada', 'parcial', 'todo']).isRequired,
	onCambiar: PropTypes.func.isRequired,
	abierto: PropTypes.bool,
	onAlternar: PropTypes.func,
	deshabilitado: PropTypes.bool,
	id: PropTypes.string.isRequired,
}

// permitidas: Set de claves que quien edita puede dar (null = todas). Lo ya marcado siempre se puede quitar.
const ArbolAlcance = ({ arbol, seleccion, onCambiar, deshabilitado, permitidas = null }) => {
	const [buscar, setBuscar] = useState('')
	const [abiertos, setAbiertos] = useState(() => {
		// Al entrar se abren las plazas que ya tienen algo
		const inicial = new Set()
		for (const p of arbol) if (p.servicios.some((s) => s.procesos.some((pr) => seleccion.has(claveAlcance(p.id_plaza, s.id_servicio, pr.id_proceso))))) inicial.add(`p${p.id_plaza}`)
		return inicial
	})

	const filtro = normalizar(buscar.trim())
	const arbolVisible = useMemo(() => {
		if (!filtro) return arbol
		return arbol
			.map((p) => {
				if (normalizar(p.nombre).includes(filtro)) return p
				const servicios = p.servicios
					.map((s) => {
						if (normalizar(s.nombre).includes(filtro)) return s
						const procesos = s.procesos.filter((pr) => normalizar(pr.nombre).includes(filtro))
						return procesos.length ? { ...s, procesos } : null
					})
					.filter(Boolean)
				return servicios.length ? { ...p, servicios } : null
			})
			.filter(Boolean)
	}, [arbol, filtro])

	const clavesDe = (p, servicios = p.servicios) => servicios.flatMap((s) => s.procesos.map((pr) => claveAlcance(p.id_plaza, s.id_servicio, pr.id_proceso)))

	const estadoDe = (claves) => {
		const marcadas = claves.filter((c) => seleccion.has(c)).length
		return { marcadas, total: claves.length, estado: marcadas === 0 ? 'nada' : marcadas === claves.length ? 'todo' : 'parcial' }
	}

	const sePuede = (c) => !permitidas || permitidas.has(c) || seleccion.has(c)
	// Una fila queda desactivada si no hay nada que quien edita pueda marcar o quitar en ella
	const sinAcceso = (claves) => Boolean(permitidas) && !claves.some(sePuede)

	const cambiar = (claves, marcar) => {
		const nueva = new Set(seleccion)
		for (const c of claves) {
			if (marcar && permitidas && !permitidas.has(c)) continue
			marcar ? nueva.add(c) : nueva.delete(c)
		}
		onCambiar(nueva)
	}

	const alternar = (clave) =>
		setAbiertos((a) => {
			const n = new Set(a)
			n.has(clave) ? n.delete(clave) : n.add(clave)
			return n
		})

	return (
		<Box>
			<OutlinedInput
				value={buscar}
				onChange={(e) => setBuscar(e.target.value)}
				placeholder="Buscar plaza, servicio o proceso"
				inputProps={{ 'aria-label': 'Buscar plaza, servicio o proceso' }}
				startAdornment={
					<InputAdornment position="start">
						<SearchIcon fontSize="small" sx={{ color: colores.texto3 }} />
					</InputAdornment>
				}
				sx={{ height: 36, fontSize: 14, width: '100%', mb: 1 }}
			/>
			<Box sx={{ border: `1px solid ${colores.linea}`, borderRadius: '4px', maxHeight: 360, overflowY: 'auto', py: 0.5 }}>
				{arbolVisible.length === 0 && (
					<Typography sx={{ p: 2, color: colores.texto2, fontSize: 14 }}>{arbol.length ? 'Nada coincide con la búsqueda.' : 'No hay plazas activas con servicios y procesos.'}</Typography>
				)}
				{arbolVisible.map((p) => {
					const ep = estadoDe(clavesDe(p))
					const abiertoP = Boolean(filtro) || abiertos.has(`p${p.id_plaza}`)
					return (
						<Box key={p.id_plaza}>
							<Fila
								id={`alcance-p${p.id_plaza}`}
								nivel={0}
								etiqueta={p.nombre}
								conteo={`${ep.marcadas} de ${ep.total} proceso${ep.total === 1 ? '' : 's'}`}
								estado={ep.estado}
								onCambiar={(m) => cambiar(clavesDe(p), m)}
								abierto={abiertoP}
								onAlternar={filtro ? undefined : () => alternar(`p${p.id_plaza}`)}
								deshabilitado={deshabilitado || sinAcceso(clavesDe(p))}
							/>
							{abiertoP &&
								p.servicios.map((s) => {
									const es = estadoDe(clavesDe(p, [s]))
									const claveS = `s${p.id_plaza}-${s.id_servicio}`
									const abiertoS = Boolean(filtro) || abiertos.has(claveS)
									return (
										<Box key={s.id_servicio}>
											<Fila
												id={`alcance-${claveS}`}
												nivel={1}
												etiqueta={s.nombre}
												conteo={`${es.marcadas} de ${es.total}`}
												estado={es.estado}
												onCambiar={(m) => cambiar(clavesDe(p, [s]), m)}
												abierto={abiertoS}
												onAlternar={filtro ? undefined : () => alternar(claveS)}
												deshabilitado={deshabilitado || sinAcceso(clavesDe(p, [s]))}
											/>
											{abiertoS &&
												s.procesos.map((pr) => {
													const c = claveAlcance(p.id_plaza, s.id_servicio, pr.id_proceso)
													return (
														<Fila
															key={pr.id_proceso}
															id={`alcance-${c}`}
															nivel={2}
															etiqueta={pr.nombre}
															estado={seleccion.has(c) ? 'todo' : 'nada'}
															onCambiar={(m) => cambiar([c], m)}
															deshabilitado={deshabilitado || !sePuede(c)}
														/>
													)
												})}
										</Box>
									)
								})}
						</Box>
					)
				})}
			</Box>
		</Box>
	)
}

ArbolAlcance.propTypes = {
	arbol: PropTypes.arrayOf(
		PropTypes.shape({
			id_plaza: PropTypes.number.isRequired,
			nombre: PropTypes.string,
			servicios: PropTypes.array.isRequired,
		}),
	).isRequired,
	seleccion: PropTypes.instanceOf(Set).isRequired,
	onCambiar: PropTypes.func.isRequired,
	deshabilitado: PropTypes.bool,
	permitidas: PropTypes.instanceOf(Set),
}

export default ArbolAlcance
