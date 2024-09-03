import { Box, Typography, Button } from '@mui/material'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import PropTypes from 'prop-types'

const DocumentoIndividual = ({ label, onClick, fileRef, onChange, nombreDocumento, error }) => (

	<Box sx={{ height:{ xs:'260px', md:'300px' }, display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'column' }}>

		<Typography sx={{ maxHeight: '50px', height: '50px', fontSize: '16px', color: '#fff', width: '100%', textAlign: 'center', textTransform: 'uppercase', maxWidth: '170px' }}>
			{label}
		</Typography>

		<Button
			sx={{ width: '170px', height: '170px',  background: 'rgba(255,255,255,0.1)', mt:'5px', borderRadius: '10px', border: !error ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center' }}
			onClick={onClick}
		>
			{nombreDocumento ? (
				<PictureAsPdfIcon sx={{ color: 'red', fontSize: '60px' }} />
			) : (
				<DocumentScannerIcon sx={{ color: '#fff', fontSize: '60px' }} />
			)}
		</Button>

		<input
			type="file"
			style={{ display: 'none' }}	
			ref={fileRef}
			onChange={onChange}
			accept="application/pdf"
		/>

		{nombreDocumento && <Typography sx={{ fontSize: '14px', maxWidth: '170px', color: '#fff', width: '100%', textAlign: 'center', mt: '10px' }}>{nombreDocumento}</Typography>}
	
	</Box>

)

DocumentoIndividual.defaultProps = {
	nombreDocumento: '',
	error: false,
}

DocumentoIndividual.propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	fileRef: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	nombreDocumento: PropTypes.string,
	error: PropTypes.bool,
}

export default DocumentoIndividual