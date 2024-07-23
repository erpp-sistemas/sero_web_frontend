import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { Box, Typography } from "@mui/material"
import { keyframes } from '@emotion/react'
import PropTypes from 'prop-types'

const Header = ({ next }) => {

	const expandWidth = keyframes`
		0% {
			width: 0%;
			background-color: #38b000; 
		}
		100% {
			width: 100%;
			background-color: #38b000; 
		}
		`
	
	return(

		<Box sx={{ width:'100%', height:'auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'20px' }}>

			<Box sx={{ width:'10%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
				<CheckCircleIcon sx={{ fontSize:'25px', marginBottom:'5px', color:'#38b000' }} />
				<Typography sx={{ fontSize:'12px', width:'100%', textAlign:'center', color:'#38b000' }} >Informacion Básica</Typography>
			</Box>

			<Box sx={{ width:'20%', height:'auto' }}>
				<Box sx={{ width:'100%', background:'#38b000', height:'3px', animation: next === '' ? `${expandWidth} 4s infinite` : false }}></Box>
			</Box>

			<Box sx={{ width:'10%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
				{ next !== '' ? <CheckCircleIcon sx={{ fontSize:'25px', marginBottom:'5px', color:'#38b000' }} /> : false }
				{ next === '' ? <RemoveCircleIcon sx={{ fontSize:'25px', marginBottom:'5px', color:'grey' }} /> : false }
				<Typography sx={{ fontSize:'12px', width:'100%', textAlign:'center',color:next === '' ? 'grey' : '#38b000' }}>Documentos</Typography>
			</Box>

			{  
				next === '' ? 
					<Box sx={{ width:'20%', background:'grey', height:'2px'  }}></Box> 
				: 
					<Box sx={{ width:'20%', height:'auto' }}>
						<Box sx={{ width:'100%', background:'#38b000', height:'3px', animation: next === 'documentos' ? `${expandWidth} 4s infinite` : false }}></Box>
					</Box>
			}

			<Box sx={{ width:'10%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
				{ next !== '' && next !== 'documentos' ? <CheckCircleIcon sx={{ fontSize:'25px', marginBottom:'5px', color:'#38b000' }}/> : false }
				{ next !== 'estado' && next !== 'pagos' ? <RemoveCircleIcon sx={{ fontSize:'25px', marginBottom:'5px', color:'grey' }}/> : false }
				<Typography sx={{ fontSize:'12px', width:'100%', textAlign:'center', color:next !== 'estado' && next !== 'pagos' ? 'grey' : '#38b000' }}>Estado Inicial del vehiculo</Typography>
			</Box>

			{  
				next !== 'estado' && next !== 'pagos' ? 
					<Box sx={{ width:'20%', background:'grey', height:'2px'  }}></Box>
				: 
					<Box sx={{ width:'20%', height:'auto' }}>
						<Box sx={{ width:'100%', background:'#38b000', height:'3px', animation: next === 'estado' ? `${expandWidth} 4s infinite` : false }}></Box>
					</Box>
			}

			<Box sx={{ width:'10%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
				{ next === 'pagos' ? <CheckCircleIcon sx={{ fontSize:'25px', marginBottom:'5px', color:'#38b000' }}/> : false }
				{ next !== 'pagos' ? <RemoveCircleIcon sx={{ fontSize:'25px', marginBottom:'5px', color:'grey' }}/> : false }
				<Typography sx={{ fontSize:'12px', width:'100%', textAlign:'center', color:next !== 'pagos' ? 'grey' : '#38b000' }}>Pagos del vehiculo</Typography>
			</Box>

		</Box>

	)

}

Header.propTypes = {
	next: PropTypes.string.isRequired
}

export default Header