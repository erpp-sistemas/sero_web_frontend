// S02-H2.6: cuadrícula de permisos: grupos y pantallas en filas, acciones en columnas.
// La usan la matriz de roles (/roles-y-permisos) y las excepciones de cada persona (/usuarios/:id).
// Tabla compacta (DESIGN.md: tablas operativas grandes): encabezado fijo, casillas reales con etiqueta accesible.
// marca(codigo) → 'agregado' | 'quitado' | null: la celda lleva fondo y un signo (+ / −), nunca solo color.
import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Checkbox, InputAdornment, OutlinedInput, Tooltip, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { colores } from '../../tema/seroTheme'
import { columnasUsadas, ACCIONES } from './arbolPermisos'

const MARCAS = {
	agregado: { fondo: '#E8FBEF', texto: '#1E7A47', signo: '+', nombre: 'Agregado' },
	quitado: { fondo: '#FEECEB', texto: '#B42318', signo: '−', nombre: 'Quitado' },
}

const normalizar = (t) => (t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const Celda = ({ permiso, etiqueta, valor, marca, bloqueo, deshabilitado, onCambiar }) => {
	if (!permiso) {
		return (
			<Box component="td" sx={{ textAlign: 'center', color: colores.deshabilitado, borderBottom: `1px solid ${colores.linea}`, px: 1 }}>
				<span aria-hidden>—</span>
				<Box component="span" sx={visuallyHidden}>No aplica</Box>
			</Box>
		)
	}
	const m = marca ? MARCAS[marca] : null
	const casilla = (
		<Checkbox
			size="small"
			checked={valor}
			disabled={deshabilitado || Boolean(bloqueo)}
			onChange={(e) => onCambiar(permiso, e.target.checked)}
			inputProps={{ 'aria-label': `${etiqueta}${m ? ` (${m.nombre.toLowerCase()})` : ''}${bloqueo ? `. ${bloqueo}` : ''}` }}
			sx={{ p: 0.5, color: colores.borde, '&.Mui-checked': { color: colores.marino }, '&.Mui-checked.Mui-disabled': { color: colores.texto3 } }}
		/>
	)
	return (
		<Box component="td" sx={{ textAlign: 'center', borderBottom: `1px solid ${colores.linea}`, px: 1, bgcolor: m?.fondo, whiteSpace: 'nowrap' }}>
			{bloqueo && !deshabilitado ? (
				<Tooltip title={bloqueo}>
					<span>{casilla}</span>
				</Tooltip>
			) : (
				casilla
			)}
			{m && (
				<Box component="span" aria-hidden sx={{ color: m.texto, fontSize: 13, fontWeight: 500, ml: 0.25 }}>
					{m.signo}
				</Box>
			)}
		</Box>
	)
}

Celda.propTypes = {
	permiso: PropTypes.string,
	etiqueta: PropTypes.string,
	valor: PropTypes.bool,
	marca: PropTypes.oneOf(['agregado', 'quitado', null]),
	bloqueo: PropTypes.string,
	deshabilitado: PropTypes.bool,
	onCambiar: PropTypes.func,
}

// Leyenda visible arriba de la tabla: cada marca con su muestra real (fondo + signo) y su significado.
const Leyenda = ({ textos }) => (
	<Box component="ul" aria-label="Qué significan las marcas" sx={{ listStyle: 'none', p: 0, m: 0, mb: 1.5, display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2.5 }, fontSize: 13, color: colores.texto2 }}>
		{['agregado', 'quitado'].map((clave) => (
			<Box component="li" key={clave} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
				<Box component="span" aria-hidden sx={{ width: 22, height: 20, borderRadius: '4px', bgcolor: MARCAS[clave].fondo, color: MARCAS[clave].texto, fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
					{MARCAS[clave].signo}
				</Box>
				{textos[clave]}
			</Box>
		))}
		<Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
			<Box component="span" aria-hidden sx={{ width: 22, height: 20, borderRadius: '4px', border: `1px solid ${colores.linea}`, bgcolor: colores.blanco }} />
			{textos.sinColor}
		</Box>
	</Box>
)

Leyenda.propTypes = {
	textos: PropTypes.shape({ agregado: PropTypes.string, quitado: PropTypes.string, sinColor: PropTypes.string }).isRequired,
}

const visuallyHidden = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }

const CuadriculaPermisos = ({ grupos, acciones = ACCIONES, valor, onCambiar, marca, bloqueo, deshabilitado, alto = 520, idTabla = 'cuadricula-permisos', leyenda }) => {
	const [buscar, setBuscar] = useState('')
	const columnas = useMemo(() => columnasUsadas(grupos, acciones), [grupos, acciones])
	const visibles = useMemo(() => {
		const b = normalizar(buscar.trim())
		if (!b) return grupos
		return grupos
			.map((g) => (normalizar(g.nombre).includes(b) ? g : { ...g, pantallas: g.pantallas.filter((p) => normalizar(p.nombre).includes(b)) }))
			.filter((g) => normalizar(g.nombre).includes(b) || g.pantallas.length)
	}, [grupos, buscar])

	const celdas = (recurso, nombre) =>
		columnas.map((col) => {
			const a = recurso.acciones.find((x) => x.accion === col.codigo)
			return (
				<Celda
					key={col.codigo}
					permiso={a?.codigo}
					etiqueta={`${col.nombre} · ${nombre}`}
					valor={a ? valor(a.codigo) : false}
					marca={a && marca ? marca(a.codigo) : null}
					bloqueo={a && bloqueo ? bloqueo(a.codigo, valor(a.codigo)) : null}
					deshabilitado={deshabilitado}
					onCambiar={onCambiar}
				/>
			)
		})

	const encabezado = { position: 'sticky', top: 0, zIndex: 1, bgcolor: colores.banda, borderBottom: `1px solid ${colores.linea}`, fontSize: 12, fontWeight: 400, color: colores.texto3, textTransform: 'uppercase', letterSpacing: '0.04em', px: 1, py: 1 }

	return (
		<Box>
			<OutlinedInput
				value={buscar}
				onChange={(e) => setBuscar(e.target.value)}
				placeholder="Buscar pantalla o grupo"
				size="small"
				inputProps={{ 'aria-label': 'Buscar pantalla o grupo', 'aria-controls': idTabla }}
				startAdornment={
					<InputAdornment position="start">
						<SearchIcon fontSize="small" sx={{ color: colores.texto3 }} />
					</InputAdornment>
				}
				sx={{ mb: 1.5, width: { xs: '100%', sm: 320 }, height: 36, bgcolor: colores.blanco }}
			/>
			{leyenda && <Leyenda textos={leyenda} />}
			<Box sx={{ border: `1px solid ${colores.linea}`, borderRadius: '4px', maxHeight: alto, overflow: 'auto', bgcolor: colores.blanco }}>
				<Box component="table" id={idTabla} sx={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%', minWidth: 160 + columnas.length * 96, fontSize: 13 }}>
					<Box component="thead">
						<Box component="tr">
							<Box component="th" scope="col" sx={{ ...encabezado, textAlign: 'left', left: 0, zIndex: 2, minWidth: 180, px: 2 }}>
								Pantalla
							</Box>
							{columnas.map((c) => (
								<Box component="th" scope="col" key={c.codigo} sx={{ ...encabezado, textAlign: 'center', width: 96, lineHeight: 1.2 }}>
									{c.nombre}
									{c.es_especial && (
										<Box component="span" sx={{ display: 'block', textTransform: 'none', letterSpacing: 0, color: '#9A5B00', fontSize: 11 }}>
											no se deshace
										</Box>
									)}
								</Box>
							))}
						</Box>
					</Box>
					<Box component="tbody">
						{visibles.length === 0 && (
							<Box component="tr">
								<Box component="td" colSpan={columnas.length + 1} sx={{ p: 3, textAlign: 'center', color: colores.texto2, fontSize: 14 }}>
									Ninguna pantalla coincide con “{buscar}”.
								</Box>
							</Box>
						)}
						{visibles.map((g) => [
							<Box component="tr" key={g.codigo} sx={{ bgcolor: colores.banda }}>
								<Box component="th" scope="row" sx={{ textAlign: 'left', px: 2, py: 0.5, borderBottom: `1px solid ${colores.linea}`, fontSize: 12, fontWeight: 400, color: colores.texto3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
									{g.nombre}
									<Box component="span" sx={visuallyHidden}> (grupo del menú)</Box>
								</Box>
								{celdas(g, `grupo ${g.nombre}`)}
							</Box>,
							...g.pantallas.map((p) => (
								<Box component="tr" key={p.codigo} sx={{ '&:hover': { bgcolor: colores.banda } }}>
									<Box component="th" scope="row" sx={{ textAlign: 'left', pl: 5, pr: 1, py: 0.25, borderBottom: `1px solid ${colores.linea}`, fontWeight: 400, color: colores.tinta, fontSize: 13 }}>
										{p.nombre}
									</Box>
									{celdas(p, p.nombre)}
								</Box>
							)),
						])}
					</Box>
				</Box>
			</Box>
			<Typography sx={{ fontSize: 12, color: colores.texto3, mt: 1 }}>
				Marcar una acción marca también “Ver” de su pantalla y de su grupo; quitar “Ver” quita las acciones que dependen de él.
			</Typography>
		</Box>
	)
}

CuadriculaPermisos.propTypes = {
	grupos: PropTypes.arrayOf(
		PropTypes.shape({
			codigo: PropTypes.string.isRequired,
			nombre: PropTypes.string,
			acciones: PropTypes.array.isRequired,
			pantallas: PropTypes.array.isRequired,
		}),
	).isRequired,
	acciones: PropTypes.array,
	valor: PropTypes.func.isRequired,
	onCambiar: PropTypes.func.isRequired,
	marca: PropTypes.func,
	bloqueo: PropTypes.func,
	deshabilitado: PropTypes.bool,
	alto: PropTypes.number,
	idTabla: PropTypes.string,
	leyenda: PropTypes.shape({ agregado: PropTypes.string, quitado: PropTypes.string, sinColor: PropTypes.string }),
}

export default CuadriculaPermisos
