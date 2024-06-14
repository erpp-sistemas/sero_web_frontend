import { Alert, AlertTitle } from "@mui/material"
import PropTypes from "prop-types"

function AlertAccountHistory({ alertInfo }) {

	if (!alertInfo) {
		return null
	}

	let severity
	let title
	let message

	switch (Math.floor(alertInfo.status / 100)) {
		case 2:
		severity = "success"
		title = "Éxito"
		message = "La información se cargó correctamente."
		break

		case 4:
		severity = "error"
		title = `Error ${alertInfo.status}`
		message ="Hubo un problema al procesar tu solicitud. Por favor, verifica los datos ingresados."
		break

		case 5:
		severity = "error"
		title = `Error ${alertInfo.status}`
		message = "Hubo un error en el servidor. Por favor, inténtalo de nuevo más tarde."
		break

		default:
		severity = "info"
		title = "Información"
		message = "Se recibió una respuesta con un código de estado inesperado."
	}

	return (
		<Alert severity={severity}>
		<AlertTitle>{title}</AlertTitle>
		{message} — <strong>{alertInfo.statusText}</strong>
		</Alert>
	)
}

AlertAccountHistory.propTypes = {
	alertInfo: PropTypes.shape({
		status: PropTypes.number.isRequired,
		statusText: PropTypes.string.isRequired,
	}),
}

export default AlertAccountHistory
