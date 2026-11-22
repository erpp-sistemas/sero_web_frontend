// S02-H2.1: selector de contexto Plaza › Servicio › Proceso (docs/DESIGN.md › Barra superior).
// Opciones: lo asignado al usuario (user.place_service_process). La elección se guarda en Redux (persistente).
// Las pantallas viejas todavía no lo usan; las rehechas lo leen con useContexto().
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, ButtonBase, List, ListItemButton, Popover, Typography } from '@mui/material'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PropTypes from 'prop-types'
import { setContexto } from '../../features/contexto/contextoSlice'
import useContexto from '../../hooks/useContexto'
import { colores } from '../../tema/seroTheme'

const Columna = ({ titulo, opciones, idSeleccionado, campoId, campoNombre, onElegir, vacio }) => (
	<Box sx={{ minWidth: 200, flex: 1, borderRight: { sm: `1px solid ${colores.linea}` }, '&:last-of-type': { borderRight: 'none' } }}>
		<Typography sx={{ px: 2, pt: 1.5, pb: 1, fontSize: 11.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: colores.texto3 }}>
			{titulo}
		</Typography>
		{opciones.length === 0 ? (
			<Typography sx={{ px: 2, pb: 2, fontSize: 13, color: colores.texto2 }}>{vacio}</Typography>
		) : (
			<List dense disablePadding sx={{ maxHeight: 320, overflowY: 'auto', pb: 1 }}>
				{opciones.map((op) => {
					const elegido = op[campoId] === idSeleccionado
					return (
						<ListItemButton
							key={op[campoId]}
							selected={elegido}
							onClick={() => onElegir(op)}
							sx={{
								mx: 1,
								borderRadius: '4px',
								fontSize: 14,
								color: elegido ? colores.tinta : colores.texto2,
								'&.Mui-selected, &.Mui-selected:hover': { backgroundColor: colores.seleccion },
							}}
						>
							{op[campoNombre]}
						</ListItemButton>
					)
				})}
			</List>
		)}
	</Box>
)
Columna.propTypes = {
	titulo: PropTypes.string.isRequired,
	opciones: PropTypes.array.isRequired,
	idSeleccionado: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	campoId: PropTypes.string.isRequired,
	campoNombre: PropTypes.string.isRequired,
	onElegir: PropTypes.func.isRequired,
	vacio: PropTypes.string.isRequired,
}

const SelectorContexto = () => {
	const dispatch = useDispatch()
	const asignado = useSelector((state) => state.user.place_service_process)
	const { plaza, servicio, proceso } = useContexto()
	const [ancla, setAncla] = useState(null)

	const plazas = Array.isArray(asignado) ? asignado : []
	const servicios = plaza?.servicios || []
	const procesos = servicio?.procesos || []

	const elegirPlaza = (p) => {
		const s = p.servicios?.[0]
		dispatch(setContexto({ id_plaza: p.id_plaza, id_servicio: s?.id_servicio ?? null, id_proceso: s?.procesos?.[0]?.id_proceso ?? null }))
	}
	const elegirServicio = (s) => {
		dispatch(setContexto({ id_plaza: plaza?.id_plaza, id_servicio: s.id_servicio, id_proceso: s.procesos?.[0]?.id_proceso ?? null }))
	}
	const elegirProceso = (p) => {
		dispatch(setContexto({ id_plaza: plaza?.id_plaza, id_servicio: servicio?.id_servicio, id_proceso: p.id_proceso }))
		setAncla(null)
	}

	const sinAsignacion = plazas.length === 0
	const partes = sinAsignacion ? ['Sin plazas asignadas'] : [plaza?.nombre_plaza, servicio?.nombre_servicio, proceso?.nombre_proceso].filter(Boolean)

	return (
		<>
			<ButtonBase
				onClick={(e) => setAncla(e.currentTarget)}
				disabled={sinAsignacion}
				aria-haspopup="dialog"
				aria-label="Cambiar plaza, servicio y proceso"
				title={partes.join(' › ')}
				sx={{
					height: 36,
					px: 1.5,
					gap: 0.5,
					maxWidth: '100%',
					minWidth: 0,
					borderRadius: '4px',
					border: `1px solid ${colores.linea}`,
					color: colores.tinta,
					fontSize: 14,
					'&:hover': { backgroundColor: colores.banda },
					'&.Mui-disabled': { color: colores.texto2 },
				}}
			>
				<Box component="span" sx={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
					{partes.map((texto, i) => (
						<Box
							component="span"
							key={`${i}-${texto}`}
							sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flexShrink: i === 0 ? 0 : 1, maxWidth: i === 0 ? 180 : 'none', ...(i > 0 && { display: { xs: 'none', sm: 'flex' } }) }}
						>
							{i > 0 && <ChevronRightIcon sx={{ fontSize: 16, color: colores.texto3, mx: 0.25 }} />}
							<Box component="span" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: i === 0 ? 500 : 400 }}>
								{texto}
							</Box>
						</Box>
					))}
				</Box>
				{!sinAsignacion && <UnfoldMoreIcon sx={{ fontSize: 16, color: colores.texto3, ml: 0.5 }} />}
			</ButtonBase>

			<Popover
				open={Boolean(ancla)}
				anchorEl={ancla}
				onClose={() => setAncla(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
				slotProps={{ paper: { sx: { mt: 0.5, border: `1px solid ${colores.linea}`, boxShadow: '0 8px 24px rgba(15,35,64,0.12)', maxWidth: 'calc(100vw - 32px)' } } }}
			>
				<Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
					<Columna titulo="Plaza" opciones={plazas} idSeleccionado={plaza?.id_plaza} campoId="id_plaza" campoNombre="nombre_plaza" onElegir={elegirPlaza} vacio="Sin plazas" />
					<Columna titulo="Servicio" opciones={servicios} idSeleccionado={servicio?.id_servicio} campoId="id_servicio" campoNombre="nombre_servicio" onElegir={elegirServicio} vacio="Sin servicios" />
					<Columna titulo="Proceso" opciones={procesos} idSeleccionado={proceso?.id_proceso} campoId="id_proceso" campoNombre="nombre_proceso" onElegir={elegirProceso} vacio="Sin procesos" />
				</Box>
			</Popover>
		</>
	)
}

export default SelectorContexto
