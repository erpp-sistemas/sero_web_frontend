// S02-H2.4 / H2.6: permisos de una persona = los de su rol + excepciones (agrega o quita).
// Arriba, las excepciones (qué tiene de más y de menos) con "Quitar" y "Dejar igual que su rol"; abajo, la misma
// cuadrícula que la matriz de roles (pantallas × acciones). El valor es un Map codigo → concede (true/false).
import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, ButtonBase, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { colores } from '../../../tema/seroTheme'
import { ChipEstado } from './comunes'
import { focoVisible } from './utilidades'
import CuadriculaPermisos from '../../../components/permisos/CuadriculaPermisos'
import { aplicarCambio, arbolDesdePermisos, dependenciasDe, nombrePermiso } from '../../../components/permisos/arbolPermisos'

const ExcepcionesPermisos = ({ permisos, base, excepciones, onCambiar, deshabilitado, puedeDar, nombreBase }) => {
	const [verTodos, setVerTodos] = useState(false)
	const grupos = useMemo(() => arbolDesdePermisos(permisos), [permisos])
	const deps = useMemo(() => dependenciasDe(grupos), [grupos])
	const codigos = useMemo(() => permisos.map((p) => p.codigo), [permisos])

	const efectivo = (codigo) => (excepciones.has(codigo) ? excepciones.get(codigo) : base.has(codigo))

	// Marca o desmarca (con sus dependencias) y vuelve a calcular las excepciones como diferencia con el rol.
	const cambiar = (codigo, valor) => {
		const actual = new Set(codigos.filter(efectivo))
		const nuevo = aplicarCambio(actual, codigo, valor, deps)
		const mapa = new Map([...excepciones].filter(([c]) => !codigos.includes(c))) // las de pantallas que no se muestran, intactas
		for (const c of codigos) if (nuevo.has(c) !== base.has(c)) mapa.set(c, nuevo.has(c))
		onCambiar(mapa)
	}

	const quitar = (codigo) => {
		const nuevo = new Map(excepciones)
		nuevo.delete(codigo)
		onCambiar(nuevo)
	}

	const nombre = (codigo) => (codigos.includes(codigo) ? nombrePermiso(codigo, grupos) : codigo)
	const agregados = [...excepciones.entries()].filter(([, c]) => c).map(([codigo]) => codigo)
	const quitados = [...excepciones.entries()].filter(([, c]) => !c).map(([codigo]) => codigo)
	const total = permisos.filter((p) => efectivo(p.codigo)).length

	const listaExcepciones = (lista, tipo, titulo) =>
		lista.length > 0 && (
			<Box sx={{ mb: 1.5 }}>
				<Typography sx={{ fontSize: 12, color: colores.texto3, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>{titulo}</Typography>
				<Box sx={{ maxHeight: 240, overflowY: 'auto' }}>
					{lista.map((codigo) => (
						<Box key={codigo} sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 36, borderBottom: `1px solid ${colores.linea}` }}>
							<ChipEstado tipo={tipo}>{tipo === 'exito' ? 'Adicional' : 'Quitado'}</ChipEstado>
							<Typography sx={{ fontSize: 14, color: colores.tinta, flex: 1, minWidth: 0 }}>{nombre(codigo)}</Typography>
							{!deshabilitado && (
								<Button size="small" variant="text" onClick={() => quitar(codigo)} sx={{ height: 28, color: colores.marino, fontWeight: 400, ...focoVisible }}>
									Quitar
								</Button>
							)}
						</Box>
					))}
				</Box>
			</Box>
		)

	return (
		<Box>
			<Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
				<Typography sx={{ fontSize: 14, color: colores.texto2 }}>
					Tiene <b style={{ fontWeight: 500, color: colores.tinta }}>{total}</b> de {permisos.length} permisos.{' '}
					{excepciones.size === 0 ? `Igual que ${nombreBase ? `“${nombreBase}”` : 'su rol'}.` : `${excepciones.size} diferencia${excepciones.size === 1 ? '' : 's'} con ${nombreBase ? `“${nombreBase}”` : 'su rol'}.`}
				</Typography>
				{!deshabilitado && excepciones.size > 0 && (
					<Button variant="outlined" size="small" onClick={() => onCambiar(new Map())} sx={{ height: 32, ...focoVisible }}>
						Dejar igual que su rol
					</Button>
				)}
			</Box>

			{excepciones.size > 0 && (
				<Typography sx={{ fontSize: 14, color: colores.tinta, mb: 1 }}>Permisos que esta persona tiene distinto a lo que da su rol</Typography>
			)}
			{listaExcepciones(agregados, 'exito', 'Tiene además de su rol')}
			{listaExcepciones(quitados, 'error', 'Su rol lo da, pero a esta persona no')}

			<ButtonBase
				onClick={() => setVerTodos((v) => !v)}
				aria-expanded={verTodos}
				sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colores.marino, fontSize: 14, py: 0.5, borderRadius: '4px', ...focoVisible }}
			>
				{verTodos ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
				{verTodos ? 'Ocultar todos los permisos' : 'Ver y cambiar todos los permisos'}
			</ButtonBase>

			{verTodos && (
				<Box sx={{ mt: 1.5 }}>
					<CuadriculaPermisos
						idTabla="permisos-persona"
						grupos={grupos}
						valor={efectivo}
						onCambiar={cambiar}
						deshabilitado={deshabilitado}
						alto={440}
						marca={(codigo) => (excepciones.has(codigo) ? (excepciones.get(codigo) ? 'agregado' : 'quitado') : null)}
						// Quien edita no puede dar un permiso que él mismo no tiene (el servidor responde 403)
						bloqueo={(codigo, valor) => (!valor && puedeDar && !puedeDar(codigo) ? 'Tú no tienes este permiso: no lo puedes dar' : null)}
					/>
				</Box>
			)}
		</Box>
	)
}

ExcepcionesPermisos.propTypes = {
	permisos: PropTypes.arrayOf(
		PropTypes.shape({
			codigo: PropTypes.string.isRequired,
			recurso: PropTypes.string,
			recurso_nombre: PropTypes.string,
			recurso_tipo: PropTypes.string,
			grupo: PropTypes.string,
			codigo_padre: PropTypes.string,
			accion: PropTypes.string,
		}),
	).isRequired,
	base: PropTypes.instanceOf(Set).isRequired,
	excepciones: PropTypes.instanceOf(Map).isRequired,
	onCambiar: PropTypes.func.isRequired,
	deshabilitado: PropTypes.bool,
	puedeDar: PropTypes.func,
	nombreBase: PropTypes.string,
}

export default ExcepcionesPermisos
