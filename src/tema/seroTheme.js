// S02-H2.1: tema de MUI del diseño nuevo (docs/DESIGN.md, decisión 0002).
// Se aplica al armazón (menú lateral y barra superior) y a las pantallas rehechas, con <TemaSero>.
import { createTheme } from '@mui/material/styles'

export const colores = {
	tinta: '#0F2340',
	marino: '#254061',
	verde: '#17E85D',
	verdeOscuro: '#12C94F',
	texto2: '#50617A',
	texto3: '#58687F',
	deshabilitado: '#9AA8BD',
	linea: '#E5EDF5',
	borde: '#C9D6E8',
	banda: '#F8FAFD',
	seleccion: '#EAF0F8',
	blanco: '#FFFFFF',
}

export const medidas = {
	menuAbierto: 232,
	menuCerrado: 64,
	barra: 56,
}

export const seroTheme = createTheme({
	palette: {
		mode: 'light',
		primary: { main: '#17E85D', dark: '#12C94F', contrastText: '#0F2340' },
		secondary: { main: '#254061', dark: '#0F2340', light: '#EAF0F8', contrastText: '#FFFFFF' },
		success: { main: '#1E7A47', light: '#E8FBEF' },
		warning: { main: '#9A5B00', light: '#FFF4DE' },
		error: { main: '#B42318', light: '#FEECEB' },
		info: { main: '#254061', light: '#EAF0F8' },
		background: { default: '#FFFFFF', paper: '#FFFFFF' },
		text: { primary: '#0F2340', secondary: '#50617A', disabled: '#9AA8BD' },
		divider: '#E5EDF5',
	},
	shape: { borderRadius: 4 },
	typography: {
		fontFamily: "'Inter Tight', ui-sans-serif, system-ui, sans-serif",
		fontSize: 14,
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 500,
		h1: { fontSize: 30, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1 },
		h2: { fontSize: 22, fontWeight: 300, letterSpacing: '-0.01em' },
		h3: { fontSize: 16, fontWeight: 500 },
		body1: { fontSize: 14, lineHeight: 1.45 },
		body2: { fontSize: 13, lineHeight: 1.45 },
		caption: { fontSize: 12, color: '#58687F' },
		overline: { fontSize: 12, letterSpacing: '0.04em', fontWeight: 400, color: '#58687F' },
		button: { textTransform: 'none', fontWeight: 500 },
	},
	components: {
		MuiCssBaseline: { styleOverrides: { body: { fontFeatureSettings: '"tnum"' } } },
		MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { border: '1px solid #E5EDF5', borderRadius: 4 } } },
		MuiButton: {
			defaultProps: { disableElevation: true },
			styleOverrides: { root: { height: 40, borderRadius: 4, paddingInline: 20 } },
			variants: [{ props: { variant: 'outlined' }, style: { borderColor: '#C9D6E8', color: '#254061', fontWeight: 400 } }],
		},
		MuiOutlinedInput: {
			styleOverrides: {
				// Selectores completos (clase + clase + clase): con '&.Mui-focused fieldset' ganaba la regla de MUI
				// y el foco salía verde de 2 px. DESIGN.md: borde marino de 1 px con anillo #EAF0F8.
				root: {
					borderRadius: 4,
					'& .MuiOutlinedInput-notchedOutline': { borderColor: '#C9D6E8' },
					'&.Mui-focused': { boxShadow: '0 0 0 3px #EAF0F8' },
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#254061', borderWidth: 1 },
					'&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: '#B42318', borderWidth: 1 },
					'&.Mui-error.Mui-focused': { boxShadow: '0 0 0 3px #FEECEB' },
				},
			},
		},
		// Apagadores: encendido en marino (el verde por defecto de "primary" casi no se ve sobre blanco).
		MuiSwitch: {
			styleOverrides: {
				switchBase: {
					'&.Mui-checked': { color: '#FFFFFF' },
					'&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#254061', opacity: 1 },
					'&.Mui-disabled + .MuiSwitch-track': { opacity: 0.45 },
					'&.Mui-checked.Mui-disabled': { color: '#FFFFFF' },
					'&.Mui-focusVisible .MuiSwitch-thumb': { outline: '2px solid #254061', outlineOffset: 2 },
				},
				// Apagado: gris de 3.4:1 sobre blanco (mínimo 3:1 para controles)
				track: { backgroundColor: '#7D8DA3', opacity: 1 },
				thumb: { boxShadow: '0 1px 2px rgba(15,35,64,.25)' },
			},
		},
		MuiChip: { styleOverrides: { root: { borderRadius: 9999, fontSize: 12 } } },
		MuiTableCell: {
			styleOverrides: {
				root: { borderColor: '#E5EDF5', fontSize: 14, padding: '12px 16px' },
				head: { background: '#F8FAFD', color: '#58687F', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' },
				sizeSmall: { fontSize: 13, padding: '6px 12px' },
			},
		},
		MuiDataGrid: { defaultProps: { density: 'standard' } },
	},
})
