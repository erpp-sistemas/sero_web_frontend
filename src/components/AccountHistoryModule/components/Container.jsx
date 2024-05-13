import { Box,useTheme } from '@mui/material'
import { tokens } from '../../../theme'
import PropTypes from 'prop-types'

function Container({ children }) {

	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
  
	return (

		<Box
			m='20px 0'
			display='flex'
			justifyContent='space-evenly'
			flexWrap='wrap'
			gap='20px'
			padding='15px 10px'
			borderRadius='10px'
			sx={{ backgroundColor: colors.primary[400], width: '100%' }}
		>
			{""}
			{children}	
		</Box>

	)

}

Container.propTypes = {
	children: PropTypes.object,
}

export default Container