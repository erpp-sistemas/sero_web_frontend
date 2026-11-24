// S02-H2.4: constantes y funciones de las pantallas de usuarios (separadas de los componentes por fast refresh).
import { colores } from '../../../tema/seroTheme'

export const ESTADOS = {
	exito: { texto: '#1E7A47', fondo: '#E8FBEF' },
	advertencia: { texto: '#9A5B00', fondo: '#FFF4DE' },
	error: { texto: '#B42318', fondo: '#FEECEB' },
	info: { texto: colores.marino, fondo: colores.seleccion },
	neutro: { texto: colores.texto3, fondo: colores.banda },
}

// Estilo de inputs de 40px (DESIGN.md: Input). El foco y el error vienen del tema.
export const estiloInput = {
	height: 40,
	fontSize: 14,
	color: colores.tinta,
	bgcolor: colores.blanco,
	'& input': { height: 40, boxSizing: 'border-box', py: 0, px: 1.5 },
}

// Botón con anillo de foco visible.
export const focoVisible = { '&.Mui-focusVisible': { outline: `2px solid ${colores.marino}`, outlineOffset: 2 } }

export const nombreCompleto = (u) =>
	[u?.nombre, u?.apellido_paterno, u?.apellido_materno].map((p) => (p ?? '').trim()).filter(Boolean).join(' ')

export const claveAlcance = (p, s, pr) => `${p}-${s}-${pr}`
