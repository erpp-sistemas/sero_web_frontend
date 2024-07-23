import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'

function AlertMessage({ message, type }) {

	return (

		<Typography variant="body2" color={type === 'error' ? 'error' : 'textPrimary'}>
			{message}
		</Typography>

	)

}

AlertMessage.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
}

export default AlertMessage