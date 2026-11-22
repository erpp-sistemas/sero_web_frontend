// S02-H2.1: buscador de pantallas (Ctrl+K / ⌘K). Busca solo entre las pantallas del menú del usuario.
import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Box, ButtonBase, Dialog, InputBase, List, ListItemButton, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { colores } from '../../tema/seroTheme'

const normalizar = (texto) => String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const esMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

const BuscadorPantallas = ({ pantallas }) => {
	const navigate = useNavigate()
	const [abierto, setAbierto] = useState(false)
	const [texto, setTexto] = useState('')
	const [indice, setIndice] = useState(0)

	useEffect(() => {
		const alPresionar = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				setAbierto(true)
			}
		}
		window.addEventListener('keydown', alPresionar)
		return () => window.removeEventListener('keydown', alPresionar)
	}, [])

	const resultados = useMemo(() => {
		const buscado = normalizar(texto.trim())
		const lista = pantallas.filter((p) => p.ruta && p.ruta !== '#')
		if (!buscado) return lista
		return lista.filter((p) => normalizar(`${p.nombre} ${p.grupo}`).includes(buscado))
	}, [pantallas, texto])

	useEffect(() => setIndice(0), [texto])

	const cerrar = () => {
		setAbierto(false)
		setTexto('')
	}

	const ir = (pantalla) => {
		cerrar()
		navigate(pantalla.ruta)
	}

	const alTeclear = (e) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setIndice((i) => Math.min(i + 1, resultados.length - 1))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setIndice((i) => Math.max(i - 1, 0))
		} else if (e.key === 'Enter' && resultados[indice]) {
			e.preventDefault()
			ir(resultados[indice])
		}
	}

	return (
		<>
			<ButtonBase
				onClick={() => setAbierto(true)}
				aria-label="Buscar pantalla"
				sx={{
					height: 36,
					px: 1.5,
					gap: 1,
					borderRadius: '4px',
					border: `1px solid ${colores.linea}`,
					color: colores.texto3,
					fontSize: 14,
					minWidth: { xs: 36, md: 240 },
					justifyContent: 'flex-start',
					'&:hover': { backgroundColor: colores.banda },
				}}
			>
				<SearchIcon sx={{ fontSize: 18 }} />
				<Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, flex: 1, textAlign: 'left' }}>
					Buscar pantalla…
				</Box>
				<Box
					component="kbd"
					sx={{
						display: { xs: 'none', md: 'inline' },
						fontFamily: "'JetBrains Mono', ui-monospace, monospace",
						fontSize: 11,
						px: 0.75,
						py: 0.25,
						borderRadius: '4px',
						border: `1px solid ${colores.linea}`,
						backgroundColor: colores.banda,
					}}
				>
					{esMac ? '⌘K' : 'Ctrl K'}
				</Box>
			</ButtonBase>

			<Dialog
				open={abierto}
				onClose={cerrar}
				fullWidth
				maxWidth="sm"
				PaperProps={{ sx: { alignSelf: 'flex-start', mt: '12vh', boxShadow: '0 16px 48px rgba(15,35,64,0.18)' } }}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, height: 52, borderBottom: `1px solid ${colores.linea}` }}>
					<SearchIcon sx={{ fontSize: 20, color: colores.texto3 }} />
					<InputBase
						autoFocus
						fullWidth
						placeholder="Buscar pantalla…"
						value={texto}
						onChange={(e) => setTexto(e.target.value)}
						onKeyDown={alTeclear}
						inputProps={{ 'aria-label': 'Buscar pantalla' }}
						sx={{ fontSize: 15, color: colores.tinta }}
					/>
				</Box>
				{resultados.length === 0 ? (
					<Typography sx={{ p: 3, fontSize: 14, color: colores.texto2, textAlign: 'center' }}>
						{pantallas.length === 0 ? 'No tienes pantallas asignadas.' : 'Ninguna pantalla coincide con la búsqueda.'}
					</Typography>
				) : (
					<List dense sx={{ maxHeight: 380, overflowY: 'auto', p: 1 }}>
						{resultados.map((p, i) => (
							<ListItemButton
								key={`${p.grupo}-${p.id}`}
								selected={i === indice}
								onMouseEnter={() => setIndice(i)}
								onClick={() => ir(p)}
								sx={{ borderRadius: '4px', gap: 1, '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: colores.seleccion } }}
							>
								<Typography sx={{ fontSize: 14, color: colores.tinta }}>{p.nombre}</Typography>
								<Typography sx={{ fontSize: 12, color: colores.texto3, ml: 'auto' }}>{p.grupo}</Typography>
							</ListItemButton>
						))}
					</List>
				)}
			</Dialog>
		</>
	)
}

BuscadorPantallas.propTypes = { pantallas: PropTypes.array.isRequired }

export default BuscadorPantallas
