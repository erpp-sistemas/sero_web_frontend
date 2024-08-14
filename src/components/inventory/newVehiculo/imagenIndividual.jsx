import PropTypes from 'prop-types'
import { Box, Typography, Button } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'

const ImageIndividual = ({ label, onClick, fileRef, onChange, preview, error }) => (

	<Box sx={{ height:{ xs:'260px', md:'300px' }, }}>

		<Typography sx={{ fontSize: '18px', color: '#fff', width: '100%', textAlign: 'center' }}>{label}</Typography>

		<Button
			sx={{ width: '170px', height: '170px', background: 'rgba(0,0,0,0.2)', mt: '10px', borderRadius: '10px', border: !error ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
			onClick={onClick}
		>
			{preview ? (
				<img src={preview} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
			) : (
				<ImageIcon sx={{ color: '#fff', fontSize: '60px' }} />
			)}
		</Button>

		<input
			type="file"
			style={{ display: 'none' }}
			accept=".png,.jpg"
			ref={fileRef}
			onChange={onChange}
		/>

	</Box>
)

ImageIndividual.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  fileRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  preview: PropTypes.string,
  error: PropTypes.bool,
}

ImageIndividual.defaultProps = {
  preview: '',
  error: false,
}

export default ImageIndividual