import { Box, Typography, Button } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Download } from "@mui/icons-material"
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useState } from "react"
import PropTypes from 'prop-types'

const Historial = ({ imagenes }) => {
    const [isImagesOpen, setIsImagesOpen] = useState(false)

	return (

		<Box sx={{ width:{ xs:'100%', md:'60%' }, height: '550px', minHeight: '550px', display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column', border: '1px solid #fff', padding: '20px', borderRadius: '5px' }}>
					
			<Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'  }}>

				<Typography sx={{ width: 'auto', textAlign: 'center', fontSize: '24px' }}>Historial</Typography>

				<Button 
					variant="outlined"                             
					color="secondary"       
					sx={{ width:'auto' }}                     
					onClick={() => {
						console.log('exportar')                 
					}}
					size="small"	
					startIcon={<Download />}
				>                                                        
					Exportar
				</Button>

			</Box>
			
			<Box sx={{ width: '100%', height: 'auto', mt: '20px', display: 'flex', justifyContent: 'start', alignItems: 'center', overflow: 'hidden', flexDirection: 'column', gap: '20px', overflowX: 'hidden', overflowY: 'scroll', padding: '20px 0px' }}>
				
				<Box onClick={() => setIsImagesOpen(!isImagesOpen)} sx={{ width: '95%', height: 'auto', border: '1px solid #fff', borderRadius: '5px', p: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', cursor: 'pointer', background: 'rgba(0,0,0,0.3)', flexDirection: 'column' }}>
					
					<Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						
						<Box sx={{ width: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'start', gap: '20px', flexDirection:{ xs:'column', md:'row' } }}>

							<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
								<Typography>Tipo:</Typography>
								<Typography>Servicio</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
								<Typography>Fecha:</Typography>
								<Typography>24/08/2024</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
								<Typography>Costo:</Typography>
								<Typography>$12,000</Typography>
							</Box>
							
						</Box>

						<Box sx={{ width: 'auto', height: 'auto' }}>
							{
								isImagesOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
							}
						</Box>

					</Box>

					<Box sx={{ width: '100%', height: 'auto', display: isImagesOpen ? 'flex' : 'none', justifyContent: 'start', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
						{imagenes.map((imagen, index) => (
							<Box key={index} sx={{ width:{  xs:'90px', md:'150px' }, minWidth:{  xs:'90px', md:'150px' }, height:{  xs:'90px', md:'150px' }, minHeight:{  xs:'90px', md:'150px' }, background:'#fff', borderRadius:'5px', overflow:'hidden', display:'flex', justifyContent:'center', alignItems:'center' }}>
								<img src={URL.createObjectURL(imagen)} alt={`imagen-${index}`} width={'100%'} height={'100%'} />
							</Box>
						))}
					</Box>

				</Box>

			</Box>

		</Box>

	)

}

Historial.propTypes = {
	imagenes: PropTypes.object.isRequired,
}

export default Historial