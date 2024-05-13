import { Backdrop, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'

function BackDrop({ handelCloseBackDrop, openBackDrop }) {
    
	return (
    
		<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackDrop} onClick={handelCloseBackDrop}>
			<CircularProgress color="secondary" />
		</Backdrop>

	)

}

BackDrop.propTypes = {
	handelOpenBackDrop: PropTypes.func.isRequired,
	handelCloseBackDrop: PropTypes.func.isRequired,
	openBackDrop: PropTypes.bool.isRequired,
}

export default BackDrop