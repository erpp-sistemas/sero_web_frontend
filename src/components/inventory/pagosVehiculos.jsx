import { Box } from "@mui/material"
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useState, useEffect } from "react"
import Title from "./pagos/title.jsx"
import Content from "./pagos/content.jsx"

const slideIn = keyframes`
	from {
		transform: translateY(110%) scale(0);
		opacity: 0;
	}
	to {
		transform: translateY(0) scale(1);
		opacity: 1;
	}
`

const slideOut = keyframes`
	from {
		transform: translateY(0%) scale(1);
		opacity: 1;
	}
	to {
		transform: translateY(110%) scale(0);
		opacity: 0;
	}
`

const AnimatedBox = styled(Box)`
	animation: ${props => props.animation ? slideOut : slideIn} 710ms ease-out;
`

const PagosVehiculo = ({ setOpenPagos, setAlertClean }) => {
	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'
	const [animation, setAnimation] = useState(false)

	useEffect(() => {
		if (animation) {	
			const timer = setTimeout(() => {
				setOpenPagos(false)
			}, 700)
			return () => clearTimeout(timer)
		}
	}, [animation, setOpenPagos, setAlertClean])

	return (

		<Box 
			sx={{
				width: '100%',
				position: 'fixed',
				top: '0',
				left: '0',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				background: 'rgba(0,0,0,0.3)',
				zIndex: '1200',
				ml:{ xs:'0px', md:'20px' }
			}}
		>
			<AnimatedBox 
				animation={animation}
				sx={{
					width: '90%',
					height: '90%',
					background: isLightMode ? '#fff' : '#17212F',
					borderRadius: '20px',
					display: 'flex',
					justifyContent: 'start',
					alignItems: 'center',
					flexDirection:'column',
					padding:{ xs:'10px', md:'30px' },
					border: isLightMode ? '1px solid #17212F' : '2px solid #fff',
					overflowX:'hidden',
					overflowY:'scroll'
				}}
			>
				<Title setAnimation={setAnimation} />
				<Content />
			</AnimatedBox>
		
		</Box>
	
	)

}

PagosVehiculo.propTypes = {
	setOpenPagos: PropTypes.func.isRequired, 
	setAlertClean: PropTypes.func.isRequired,
}

export default PagosVehiculo