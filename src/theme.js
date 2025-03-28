import { createContext, useState, useMemo } from "react"
import { createTheme } from "@mui/material/styles"

export const tokens = (mode) => ({
	...(mode === "dark"
	? {
		grey: {
			100: "#e0e0e0",
			200: "#c2c2c2",
			300: "#a3a3a3",
			400: "#858585",
			500: "#666666",
			600: "#525252",
			700: "#3d3d3d",
			800: "#292929",
			900: "#141414",
			1000: "#FBFCFC"
		},
		tealAccent: {
			100: "#001010", 
			200: "#042020", 
			300: "#094142", 
			400: "#1dd5d8",  // Color claro equivalente
			500: "#74dddf", 
			600: "#a2e9ea", 
			700: "#d0f4f5", 
			800: "#e8f9fa",  // Tonos muy claros
			900: "#f6fcfc", 
		  },
		  green: {
			100: "#ccffcc",  // Verde muy claro, casi pastel
			200: "#99ff99",  // Verde claro
			300: "#66ff66",  // Verde vivo, pero no saturado
			400: "#33ff33",  // Verde brillante
			500: "#00ff00",  // Color principal (verde puro del logotipo)
			600: "#00cc00",  // Verde más oscuro
			700: "#009900",  // Verde bosque oscuro
			800: "#006600",  // Verde muy oscuro
			900: "#003300",  // Verde casi negro
		  },
		searchButton:{
			100: "#99ff99",
			200: "#33ff33",
		},
		contentSearchButton:{
			100: "#254061"			
		},
		accentGreen:{
			100: "#99ff99",
			200: "#33ff33",
		},
		contentAccentGreen:{
			100: "#254061"
		},
		primary: {
			100: "#d0d1d5",
			200: "#a1a4ab",
			300: "#727681",
			400: "#1F2D40",
			500: "#17212F",
			600: "#101624",
			700: "#0c101b",
			800: "#080b12",
			900: "#040509",
			1000: "#334051"
		},
		greenAccent: {
			100: "#0f2922",
			200: "#1e5245",
			300: "#2e7c67",
			400: "#4cceac",
			500: "#00ff00",
			600: "#6EBE71",
			700: "#94e2cd",
			800: "#b7ebde",
			900: "#dbf5ee",
		},
		redAccent: {
			100: "#f8dcdb",
			200: "#f1b9b7",
			300: "#e99592",
			400: "#e2726e",
			500: "#db4f4a",
			600: "#af3f3b",
			700: "#832f2c",
			800: "#58201e",
			900: "#2c100f",
		},
		blueAccent: {
			100: "#e1e2fe",
			200: "#c3c6fd",
			300: "#a4a9fc",
			400: "#868dfb",
			500: "#6870fa",
			600: "#535ac8",
			700: "#3e4396",
			800: "#2a2d64",
			900: "#151632",
		},
		yellowAccent: {
			100: '#FCF3CF',
			200: '#F9E79F',
			300: '#F7DC6F',
			400: '#F4D03F',
			500: '#F1C40F',
			600: '#D4AC0D',
			700: '#B7950B',
			800: '#9A7D0A',
			900: '#7D6608'
		}
		}


		: {
		grey: {
			100: "#141414",
			200: "#292929",
			300: "#3d3d3d",
			400: "#525252",
			500: "#666666",
			600: "#858585",
			700: "#a3a3a3",
			800: "#c2c2c2",
			900: "#e0e0e0",
			1000: "#FBFCFC"
		},
		tealAccent: {
			100: "#d0f4f5",  // Muy claro
			200: "#a2e9ea", 
			300: "#74dddf", 
			400: "#19b7ba",  // Color principal
			500: "#138e91", 
			600: "#0e6669", 
			700: "#094142", 
			800: "#042020", 
			900: "#001010",  // Muy oscuro
		  },
		  green: {
			100: "#003300",  // Verde oscuro profundo
			200: "#99ff99",  // Verde muy oscuro
			300: "#009900",  // Verde bosque oscuro
			400: "#00cc00",  // Verde más oscuro
			500: "#00ff00",  // Color principal (verde puro del logotipo)
			600: "#33ff33",  // Verde brillante
			700: "#99ff99",  // Verde vivo, pero no saturado
			800: "#99ff99",  // Verde claro
			900: "#ccffcc",  // Verde muy claro, casi pastel
		  },
		  searchButton:{
			100: "#00a884",
			200: "#33c4a9",
		},
		contentSearchButton:{
			100: "#fff"			
		},
		accentGreen:{
			100: "#00a884",
			200: "#33ff33",
		},
		contentAccentGreen:{
			100: "#fff"
		},
		primary: {
			100: "#040509",
			200: "#080b12",
			300: "#0c101b",
			400: "#f2f0f0", 
			500: "#141b2d",
			600: "#1F2A40",
			700: "#727681",
			800: "#a1a4ab",
			900: "#d0d1d5",
			1000: "#dcdada"
		},
		greenAccent: {
			100: "#0f2922",
			200: "#1e5245",
			300: "#2e7c67",
			400: "#4cceac",
			500: "#00ff00",
			600: "#6EBE71",
			700: "#94e2cd",
			800: "#b7ebde",
			900: "#dbf5ee",
		},
		redAccent: {
			100: "#2c100f",
			200: "#58201e",
			300: "#832f2c",
			400: "#af3f3b",
			500: "#db4f4a",
			600: "#e2726e",
			700: "#e99592",
			800: "#f1b9b7",
			900: "#f8dcdb",
		},
		blueAccent: {
			100: "#151632",
			200: "#2a2d64",
			300: "#3e4396",
			400: "#535ac8",
			500: "#6870fa",
			600: "#868dfb",
			700: "#a4a9fc",
			800: "#c3c6fd",
			900: "#e1e2fe",
		},
		yellowAccent: {
			100: '#FCF3CF',
			200: '#F9E79F',
			300: '#F7DC6F',
			400: '#F4D03F',
			500: '#F1C40F',
			600: '#D4AC0D',
			700: '#B7950B',
			800: '#9A7D0A',
			900: '#7D6608'
		}
    }),
})

export const themeSettings = (mode) => {
	const colors = tokens(mode)
	return {
		palette: {
		mode: mode,
		...(mode === "dark"
			? {
			primary: {
				main: colors.primary[500],
			},
			secondary: {
				main: colors.greenAccent[500],
			},
			neutral: {
				dark: colors.grey[700],
				main: colors.grey[500],
				light: colors.grey[100],
			},
			background: {
				default: colors.primary[500],
			},
			}
			: {
			primary: {
				main: colors.primary[100],
			},
			secondary: {
				main: colors.greenAccent[500],
			},
			neutral: {
				dark: colors.grey[700],
				main: colors.grey[500],
				light: colors.grey[100],
			},
			background: {
				default: "#F7F9F4",
			},
			}),
		},
		typography: {
		fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
		fontSize: 12,
		h1: {
			fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
			fontSize: 40,
		},
		h2: {
			fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
			fontSize: 32,
		},
		h3: {
			fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
			fontSize: 24,
		},
		h4: {
			fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
			fontSize: 20,
		},
		h5: {
			fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
			fontSize: 16,
		},
		h6: {
			fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
			fontSize: 14,
		},
		},
	}
}

export const ColorModeContext = createContext({
	toggleColorMode: () => { },
})

export const useMode = () => {

	const [mode, setMode] = useState("dark")

	const colorMode = useMemo(
		() => ({
		toggleColorMode: () =>
			setMode((prev) => (prev === "light" ? "dark" : "light")),
		}),
		[]
	)

	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
	return [theme, colorMode]

}
