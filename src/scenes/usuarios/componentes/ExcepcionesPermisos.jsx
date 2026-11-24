// S02-H2.4: permisos de una persona = los de su rol + excepciones (agrega o quita).
// Muestra arriba las excepciones (qué tiene de más y de menos) con "Quitar" y "Dejar igual que su rol";
// abajo, todos los permisos agrupados por menú con casillas. El valor es un Map codigo → concede (true/false).
import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, ButtonBase, Checkbox, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { colores } from '../../../tema/seroTheme'
import { ChipEstado } from './comunes'
import { focoVisible } from './utilidades'

const ExcepcionesPermisos = ({ permisos, base, excepciones, onCambiar, deshabilitado, esSuperadmin }) => {
	const [verTodos, setVerTodos] = useState(false)
	const porCodigo = useMemo(() => new Map(permisos.map((p) => [p.codigo, p])), [permisos])

	const efectivo = (codigo) => (excepciones.has(codigo) ? excepciones.get(codigo) : base.has(codigo))

	const poner = (codigo, valor, mapa) => {
		if (valor === base.has(codigo)) mapa.delete(codigo)
		else mapa.set(codigo, valor)
	}

	const cambiar = (codigo, valor) => {
		const nuevo = new Map(excepciones)
		poner(codigo, valor, nuevo)
		const p = porCodigo.get(codigo)
		// Una pantalla de submenú no se ve sin su menú: al darla, se da también el menú padre.
		if (valor && p?.codigo_padre) {
			const padreEfectivo = nuevo.has(p.codigo_padre) ? nuevo.get(p.codigo_padre) : base.has(p.codigo_padre)
			if (!padreEfectivo) poner(p.codigo_padre, true, nuevo)
		}
		onCambiar(nuevo)
	}

	const quitar = (codigo) => {
		const nuevo = new Map(excepciones)
		nuevo.delete(codigo)
		onCambiar(nuevo)
	}

	const grupos = useMemo(() => {
		const lista = []
		for (const p of permisos) {
			let g = lista.find((x) => x.nombre === p.grupo)
			if (!g) lista.push((g = { nombre: p.grupo, permisos: [] }))
			g.permisos.push(p)
		}
		return lista
	}, [permisos])

	const agregados = [...excepciones.entries()].filter(([, c]) => c).map(([codigo]) => codigo)
	const quitados = [...excepciones.entries()].filter(([, c]) => !c).map(([codigo]) => codigo)
	const total = permisos.filter((p) => efectivo(p.codigo)).length

	const listaExcepciones = (codigos, tipo, titulo) =>
		codigos.length > 0 && (
			<Box sx={{ mb: 1.5 }}>
				<Typography sx={{ fontSize: 12, color: colores.texto3, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>{titulo}</Typography>
				{codigos.map((codigo) => (
					<Box key={codigo} sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 36, borderBottom: `1px solid ${colores.linea}` }}>
						<ChipEstado tipo={tipo}>{tipo === 'exito' ? 'De más' : 'De menos'}</ChipEstado>
						<Typography sx={{ fontSize: 14, color: colores.tinta, flex: 1, minWidth: 0 }}>{porCodigo.get(codigo)?.nombre ?? codigo}</Typography>
						{!deshabilitado && (
							<Button size="small" variant="text" onClick={() => quitar(codigo)} sx={{ height: 28, color: colores.marino, fontWeight: 400, ...focoVisible }}>
								Quitar
							</Button>
						)}
					</Box>
				))}
			</Box>
		)

	return (
		<Box>
			<Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
				<Typography sx={{ fontSize: 14, color: colores.texto2 }}>
					Tiene <b style={{ fontWeight: 500, color: colores.tinta }}>{total}</b> de {permisos.length} permisos.{' '}
					{excepciones.size === 0 ? 'Igual que su rol.' : `${excepciones.size} diferencia${excepciones.size === 1 ? '' : 's'} con su rol.`}
				</Typography>
				{!deshabilitado && excepciones.size > 0 && (
					<Button variant="outlined" size="small" onClick={() => onCambiar(new Map())} sx={{ height: 32, ...focoVisible }}>
						Dejar igual que su rol
					</Button>
				)}
			</Box>

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
				<Box sx={{ mt: 1, border: `1px solid ${colores.linea}`, borderRadius: '4px', maxHeight: 420, overflowY: 'auto' }}>
					{esSuperadmin && (
						<Typography sx={{ fontSize: 13, color: '#9A5B00', bgcolor: '#FFF4DE', px: 2, py: 1 }}>
							Por ahora a un Superadmin no se le pueden quitar pantallas del menú; sí acciones como crear o editar usuarios.
						</Typography>
					)}
					{grupos.map((g) => (
						<Box key={g.nombre} sx={{ borderBottom: `1px solid ${colores.linea}`, '&:last-of-type': { borderBottom: 0 } }}>
							<Typography sx={{ fontSize: 12, color: colores.texto3, textTransform: 'uppercase', letterSpacing: '0.04em', px: 2, pt: 1.5, pb: 0.5, bgcolor: colores.banda }}>
								{g.nombre}
							</Typography>
							{g.permisos.map((p) => {
								const id = `permiso-${p.codigo}`
								const valor = efectivo(p.codigo)
								const esExcepcion = excepciones.has(p.codigo)
								// Superadmin: las pantallas del menú (permisos "read") no se le pueden quitar hasta H2.6
								const bloqueado = deshabilitado || (esSuperadmin && valor && p.accion === 'read')
								return (
									<Box key={p.codigo} sx={{ display: 'flex', alignItems: 'center', minHeight: 36, px: 1.5, '&:hover': { bgcolor: colores.banda } }}>
										<Checkbox
											id={id}
											size="small"
											checked={valor}
											onChange={(e) => cambiar(p.codigo, e.target.checked)}
											disabled={bloqueado}
											sx={{ p: 0.5, color: colores.borde, '&.Mui-checked': { color: colores.marino } }}
										/>
										<Typography component="label" htmlFor={id} sx={{ fontSize: 14, color: colores.tinta, flex: 1, cursor: bloqueado ? 'default' : 'pointer', py: 0.5 }}>
											{p.nombre}
										</Typography>
										{esExcepcion && <ChipEstado tipo={valor ? 'exito' : 'error'}>{valor ? 'De más' : 'De menos'}</ChipEstado>}
									</Box>
								)
							})}
						</Box>
					))}
				</Box>
			)}
		</Box>
	)
}

ExcepcionesPermisos.propTypes = {
	permisos: PropTypes.arrayOf(
		PropTypes.shape({ codigo: PropTypes.string.isRequired, nombre: PropTypes.string, grupo: PropTypes.string, codigo_padre: PropTypes.string, accion: PropTypes.string }),
	).isRequired,
	base: PropTypes.instanceOf(Set).isRequired,
	excepciones: PropTypes.instanceOf(Map).isRequired,
	onCambiar: PropTypes.func.isRequired,
	deshabilitado: PropTypes.bool,
	esSuperadmin: PropTypes.bool,
}

export default ExcepcionesPermisos
