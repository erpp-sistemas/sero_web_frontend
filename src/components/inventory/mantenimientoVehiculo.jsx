import { Box } from "@mui/material"
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useState, useEffect } from "react"
import Title from "./mantenimiento/title"
import Content from "./mantenimiento/content"

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

const EditVehiculo = ({ setOpenMantenimiento, setAlertClean }) => {
	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'
	const [animation, setAnimation] = useState(false)

	useEffect(() => {
		if (animation) {	
			const timer = setTimeout(() => {
				setOpenMantenimiento(false)
			}, 700)
			return () => clearTimeout(timer)
		}
	}, [animation, setOpenMantenimiento, setAlertClean])

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
					padding: { xs:'10px', md:'30px' },
					border: isLightMode ? '1px solid #17212F' : '2px solid #fff',
					overflowX:'hidden',
					overflowY:'scroll'
				}}
			>
				<Title setOpenEdit={setOpenMantenimiento} setAnimation={setAnimation} />
				<Content />
			</AnimatedBox>
		
		</Box>
	
	)

}

EditVehiculo.propTypes = {
	setOpenMantenimiento: PropTypes.func.isRequired, 
	setAlertClean: PropTypes.func.isRequired,
	openEdit: PropTypes.bool.isRequired, 
	fetchData: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired
}

export default EditVehiculo