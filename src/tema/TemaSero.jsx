// S02-H2.1: aplica el tema nuevo solo a su contenido. Las pantallas viejas siguen con el tema de src/theme.js.
import PropTypes from 'prop-types'
import { ThemeProvider } from '@mui/material/styles'
import { seroTheme } from './seroTheme'

const TemaSero = ({ children }) => <ThemeProvider theme={seroTheme}>{children}</ThemeProvider>

TemaSero.propTypes = { children: PropTypes.node }

export default TemaSero
