import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Alert, Collapse, Box } from '@mui/material'

function Alerts({ alertOpen, variant, message, setAlertOpen }) {

	useEffect(() => {
		const timer = setTimeout(() => {
		setAlertOpen(false)
		}, 5000)
		return () => clearTimeout(timer)
	}, [alertOpen, setAlertOpen])

	return (

		<Box
			sx={{
				width:'auto',
				height:'auto',
				position:'absolute',
				top:'1%',
				left:'50%',
				transform: 'translate(-50%,-1%)',
				zIndex:'9999'
			}}
		>

			<Collapse in={alertOpen}>

				<Alert severity={variant} onClose={() => setAlertOpen(false)}>
					{message}
				</Alert>

			</Collapse>

		</Box>

	)

}

Alerts.propTypes = {
	alertOpen: PropTypes.bool.isRequired,
	variant: PropTypes.oneOf(['error', 'warning', 'info', 'success']).isRequired,
	message: PropTypes.string.isRequired,
	setAlertOpen: PropTypes.func.isRequired,
}

export default Alerts