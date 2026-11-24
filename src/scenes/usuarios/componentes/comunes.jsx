// S02-H2.4: piezas comunes de las pantallas de usuarios (DESIGN.md: encabezado de página, estados, chip, campo).
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import { colores } from '../../../tema/seroTheme'
import { ESTADOS } from './utilidades'

// Encabezado igual en todas: eyebrow → título 30/300 → frase → acciones a la derecha.
export const EncabezadoPagina = ({ eyebrow, titulo, descripcion, acciones }) => (
	<Box
		sx={{
			display: 'flex',
			flexDirection: { xs: 'column', sm: 'row' },
			alignItems: { xs: 'stretch', sm: 'flex-end' },
			justifyContent: 'space-between',
			gap: 2,
			mb: 3,
		}}
	>
		<Box sx={{ minWidth: 0 }}>
			{eyebrow && (
				<Typography variant="overline" component="p" sx={{ textTransform: 'uppercase', lineHeight: 1.45, display: 'block' }}>
					{eyebrow}
				</Typography>
			)}
			<Typography variant="h1" component="h1" sx={{ color: colores.tinta, mt: 0.5 }}>
				{titulo}
			</Typography>
			{descripcion && <Typography sx={{ color: colores.texto2, mt: 1 }}>{descripcion}</Typography>}
		</Box>
		{acciones && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexShrink: 0 }}>{acciones}</Box>}
	</Box>
)

EncabezadoPagina.propTypes = {
	eyebrow: PropTypes.string,
	titulo: PropTypes.string.isRequired,
	descripcion: PropTypes.node,
	acciones: PropTypes.node,
}

// Estado vacío / error / sin permiso: ícono de línea 32px, título 16/500, una frase, una acción.
export const EstadoPantalla = ({ icono: Icono, titulo, descripcion, accion }) => (
	<Box
		role="status"
		sx={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			textAlign: 'center',
			py: 6,
			px: 2,
			border: `1px solid ${colores.linea}`,
			borderRadius: '4px',
			bgcolor: colores.blanco,
		}}
	>
		{Icono && <Icono sx={{ fontSize: 32, color: colores.deshabilitado }} />}
		<Typography sx={{ fontSize: 16, fontWeight: 500, color: colores.tinta, mt: 1.5 }}>{titulo}</Typography>
		{descripcion && <Typography sx={{ color: colores.texto2, mt: 0.5, maxWidth: 420 }}>{descripcion}</Typography>}
		{accion && <Box sx={{ mt: 2 }}>{accion}</Box>}
	</Box>
)

EstadoPantalla.propTypes = {
	icono: PropTypes.elementType,
	titulo: PropTypes.string.isRequired,
	descripcion: PropTypes.node,
	accion: PropTypes.node,
}

// Chip de estado: pill 12px con punto de 6px (nunca solo color: siempre lleva texto).
export const ChipEstado = ({ tipo = 'neutro', children }) => {
	const c = ESTADOS[tipo] ?? ESTADOS.neutro
	return (
		<Box
			component="span"
			sx={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '6px',
				px: 1,
				py: '2px',
				borderRadius: 9999,
				bgcolor: c.fondo,
				color: c.texto,
				fontSize: 12,
				lineHeight: 1.45,
				whiteSpace: 'nowrap',
			}}
		>
			<Box component="span" aria-hidden sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: c.texto, flexShrink: 0 }} />
			{children}
		</Box>
	)
}

ChipEstado.propTypes = { tipo: PropTypes.oneOf(Object.keys(ESTADOS)), children: PropTypes.node }

// Campo de formulario con etiqueta real arriba (13–14px) y error debajo (12px).
export const Campo = ({ id, etiqueta, ayuda, error, obligatorio, children, sx }) => (
	<Box sx={sx}>
		<Typography component="label" htmlFor={id} sx={{ display: 'block', mb: 0.75, fontSize: 14, color: colores.tinta }}>
			{etiqueta}
			{obligatorio && (
				<Box component="span" aria-hidden sx={{ color: colores.texto3 }}>
					{' '}
					*
				</Box>
			)}
		</Typography>
		{children}
		{error ? (
			<Typography id={`${id}-error`} role="alert" sx={{ mt: 0.75, fontSize: 12, color: '#B42318' }}>
				{error}
			</Typography>
		) : (
			ayuda && (
				<Typography id={`${id}-ayuda`} sx={{ mt: 0.75, fontSize: 12, color: colores.texto3 }}>
					{ayuda}
				</Typography>
			)
		)}
	</Box>
)

Campo.propTypes = {
	id: PropTypes.string.isRequired,
	etiqueta: PropTypes.string.isRequired,
	ayuda: PropTypes.node,
	error: PropTypes.string,
	obligatorio: PropTypes.bool,
	children: PropTypes.node.isRequired,
	sx: PropTypes.object,
}
