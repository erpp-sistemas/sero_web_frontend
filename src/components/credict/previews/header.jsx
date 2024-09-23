import { Box, Typography, Button } from "@mui/material";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import PropTypes from "prop-types"

export default function PreviewsHeader ({ setPreview }) {

	return (

		<Box sx={{ width:'100%', display:'flex', justifyContent:'space-between' }}>

			<Typography sx={{ color:'#fff', fontSize: '30px', fontWeight: '500' }}>Preview data determinación de crédito fiscal</Typography>

			<Button
				onClick={() => setPreview(false)}
			>
				<CloseFullscreenIcon 
					sx={{
						color: 'red',
						fontSize: '30px',
						fontWeight: '500'
					}}
				/>
			</Button>

		</Box>

	) 

}

PreviewsHeader.propTypes = {
	setPreview: PropTypes.func.isRequired
}