// S02-H2.2: login con el diseño nuevo (docs/DESIGN.md).
// Mismo endpoint (POST /login), mismos datos guardados (localStorage "token" y cookie "token" de 7 días,
// setUser, setLogin) y misma redirección (/home) que la pantalla anterior.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import {
	Box,
	Button,
	CircularProgress,
	FormHelperText,
	IconButton,
	InputAdornment,
	OutlinedInput,
	Typography,
} from '@mui/material'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { loginRequest } from '../../api/auth'
import { setUser } from '../../features/user/userSlice'
import TemaSero from '../../tema/TemaSero'
import { colores } from '../../tema/seroTheme'

// Frase del panel izquierdo (escritorio). Alternativas propuestas en docs/PROGRESO.md.
const FRASE_PANEL = 'Planea, opera y mide. Todo en un solo lugar.'

const MENSAJE_SERVIDOR = 'Error del servidor, intenta de nuevo'
const MENSAJE_CREDENCIALES = 'Usuario o contraseña incorrectos'
// El backend distingue estos dos casos; la pantalla los muestra como uno solo para no revelar qué usuarios existen.
const MENSAJES_DE_CREDENCIALES = ['Usuario no encontrado', 'Contraseña incorrecta']

const mensajeDeError = (error) => {
	const data = error?.response?.data
	if (!data) return MENSAJE_SERVIDOR
	const mensaje = Array.isArray(data) ? data.filter(Boolean).join(' ') : data.message
	if (typeof mensaje !== 'string' || !mensaje) return MENSAJE_SERVIDOR
	if (MENSAJES_DE_CREDENCIALES.includes(mensaje)) return MENSAJE_CREDENCIALES
	return mensaje
}

const anilloFoco = { outline: `2px solid ${colores.marino}`, outlineOffset: 2 }

const estiloInput = {
	height: 40,
	fontSize: 15,
	color: colores.tinta,
	bgcolor: colores.blanco,
	'& input': { height: 40, boxSizing: 'border-box', py: 0, px: 1.5 },
	// Selectores completos: los del tema pierden contra la regla de foco por defecto de MUI (verde, 2 px).
	'& .MuiOutlinedInput-notchedOutline': { borderColor: colores.borde },
	'&.Mui-focused': { boxShadow: `0 0 0 3px ${colores.seleccion}` },
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colores.marino, borderWidth: 1 },
	'&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: '#B42318', borderWidth: 1 },
	'&.Mui-error.Mui-focused': { boxShadow: '0 0 0 3px #FEECEB' },
}

const Campo = ({ id, etiqueta, error, children }) => (
	<Box>
		<Typography
			component="label"
			htmlFor={id}
			sx={{ display: 'block', mb: 0.75, fontSize: 14, color: colores.tinta }}
		>
			{etiqueta}
		</Typography>
		{children}
		{error && (
			<FormHelperText id={`${id}-error`} error sx={{ mx: 0, mt: 0.75, fontSize: 12 }}>
				{error}
			</FormHelperText>
		)}
	</Box>
)

Campo.propTypes = {
	id: PropTypes.string.isRequired,
	etiqueta: PropTypes.string.isRequired,
	error: PropTypes.string,
	children: PropTypes.node.isRequired,
}

const Login = ({ setLogin }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [mensajeError, setMensajeError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	// react-hook-form entrega la ref aparte: en MUI va en inputRef, no en el contenedor.
	const { ref: refUsuario, ...usuarioProps } = register('username', { required: 'Escribe tu usuario' })
	const { ref: refContrasena, ...contrasenaProps } = register('password', { required: 'Escribe tu contraseña' })

	const entrar = async (datos) => {
		if (isLoading) return
		setMensajeError('')
		setIsLoading(true)
		try {
			const res = await loginRequest(datos)
			if (res?.data?.token) {
				dispatch(setUser(res.data))
				setLogin(true)
				localStorage.setItem('token', res.data.token)
				Cookies.set('token', res.data.token, { expires: 7 })
				setIsLoading(false)
				navigate('/home')
			} else {
				setMensajeError(MENSAJE_SERVIDOR)
				setIsLoading(false)
			}
		} catch (error) {
			setMensajeError(mensajeDeError(error))
			setIsLoading(false)
		}
	}

	return (
		<TemaSero>
			<Box
				component="main"
				sx={{
					minHeight: '100vh',
					display: 'grid',
					gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 5fr) minmax(0, 6fr)' },
					bgcolor: colores.blanco,
				}}
			>
				{/* Panel de contraste: solo en pantallas anchas */}
				<Box
					sx={{
						display: { xs: 'none', md: 'flex' },
						flexDirection: 'column',
						justifyContent: 'space-between',
						bgcolor: colores.tinta,
						p: 6,
					}}
				>
					<Box component="img" src="/sero_claro.png" alt="SERO" sx={{ height: 40, width: 'auto', alignSelf: 'flex-start' }} />
					<Typography
						component="p"
						sx={{
							color: colores.blanco,
							fontWeight: 300,
							fontSize: 'clamp(36px, 4vw, 56px)',
							lineHeight: 1.03,
							letterSpacing: '-0.025em',
							maxWidth: 460,
						}}
					>
						{FRASE_PANEL}
					</Typography>
					<Typography sx={{ color: colores.borde, fontSize: 13 }}>ERPP · Plataforma de recaudación</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, md: 4 }, py: 4 }}>
					<Box sx={{ width: '100%', maxWidth: 400 }}>
						<Box
							component="img"
							src="/sero-logo.png"
							alt="SERO"
							sx={{ display: { xs: 'block', md: 'none' }, height: 36, width: 'auto', mb: 5 }}
						/>
						<Typography variant="h1" component="h1" sx={{ color: colores.tinta }}>
							Iniciar sesión
						</Typography>
						<Typography sx={{ mt: 1, mb: 4, color: colores.texto2 }}>
							Entra con tu usuario y contraseña.
						</Typography>

						<Box
							component="form"
							noValidate
							onSubmit={handleSubmit(entrar)}
							aria-busy={isLoading}
							sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
						>
							<Campo id="login-usuario" etiqueta="Usuario o correo" error={errors.username?.message}>
								<OutlinedInput
									id="login-usuario"
									type="text"
									fullWidth
									autoFocus
									autoComplete="username"
									autoCapitalize="none"
									spellCheck={false}
									readOnly={isLoading}
									error={Boolean(errors.username)}
									inputRef={refUsuario}
									inputProps={{
										'aria-invalid': Boolean(errors.username),
										'aria-describedby': errors.username ? 'login-usuario-error' : undefined,
									}}
									sx={estiloInput}
									{...usuarioProps}
								/>
							</Campo>

							<Campo id="login-contrasena" etiqueta="Contraseña" error={errors.password?.message}>
								<OutlinedInput
									id="login-contrasena"
									type={showPassword ? 'text' : 'password'}
									fullWidth
									autoComplete="current-password"
									readOnly={isLoading}
									error={Boolean(errors.password)}
									inputRef={refContrasena}
									inputProps={{
										'aria-invalid': Boolean(errors.password),
										'aria-describedby': errors.password ? 'login-contrasena-error' : undefined,
									}}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												edge="end"
												size="small"
												aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
												aria-pressed={showPassword}
												onClick={() => setShowPassword((v) => !v)}
												onMouseDown={(e) => e.preventDefault()}
												sx={{ color: colores.texto2, '&.Mui-focusVisible': anilloFoco }}
											>
												{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
											</IconButton>
										</InputAdornment>
									}
									sx={estiloInput}
									{...contrasenaProps}
								/>
							</Campo>

							<Button
								type="submit"
								variant="contained"
								color="primary"
								fullWidth
								aria-disabled={isLoading}
								sx={{
									mt: 1,
									fontSize: 14,
									'&.Mui-focusVisible': anilloFoco,
									// aria-disabled (no disabled): así el botón no pierde el foco mientras entra; entrar() ignora el segundo envío.
									'&[aria-disabled="true"]': { opacity: 0.75, cursor: 'progress' },
								}}
							>
								{isLoading ? (
									<>
										<CircularProgress size={16} thickness={5} sx={{ color: colores.tinta, mr: 1 }} />
										Entrando…
									</>
								) : (
									'Entrar'
								)}
							</Button>

							{/* Región siempre presente para que el lector de pantalla anuncie el error al aparecer */}
							<Box role="alert" aria-live="assertive">
								{mensajeError && (
									<Box
										sx={{
											display: 'flex',
											alignItems: 'flex-start',
											gap: 1,
											bgcolor: '#FEECEB',
											color: '#B42318',
											border: '1px solid #F3C5C1',
											borderRadius: '4px',
											px: 2,
											py: 1.5,
											fontSize: 14,
										}}
									>
										<ErrorOutline sx={{ fontSize: 20, mt: '1px' }} />
										<span>{mensajeError}</span>
									</Box>
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</TemaSero>
	)
}

Login.propTypes = {
	setLogin: PropTypes.func.isRequired,
}

export default Login
