import { Box, Typography, Button } from "@mui/material"
import PropTypes from "prop-types"
import tool from '../../../toolkit/toolkitCatastro.js'
import { useState } from "react"
import ChargeMessage from '../../../components/Records/chargeMessage.jsx'

export default function PreviewConfirmacion ({ openConfirmation, setOpenConfirmation, invalidAccounts, validAccounts, setValidAccounts, setFileName }) {
	const [cargandoConfirmacion, setCargandoConfirmacion] = useState(false)

	const crearPdf = async () => {
		try {
			setCargandoConfirmacion(true)
			for (const account of validAccounts) {
				const validateData = account
				const respuesta = await tool.createPdf(validateData)
				if (respuesta && respuesta.data && respuesta.data.pdfUrl) {
					const pdfUrl = respuesta.data.pdfUrl
					const response = await fetch(pdfUrl)
					if (!response.ok) {
						throw new Error(`Error al descargar el PDF: ${response.statusText}`)
					}
					const blob = await response.blob()
					const url = window.URL.createObjectURL(blob)
					const link = document.createElement('a')
					link.href = url
					link.download = pdfUrl.split('/').pop()
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
					window.URL.revokeObjectURL(url)
				} else {
					console.error("No se obtuvo la URL del PDF o respuesta inesperada:", respuesta)
				}
				setValidAccounts([])
				setFileName('')
				setOpenConfirmation(false)
				setCargandoConfirmacion(false)
			}
		} catch (error) {
			console.error("Error al crear PDFs:", error)
		}
	}
	
	return(

		<Box sx={{ width:'100%', height:'100vh', position:'fixed', top:'0', left:'0', display:openConfirmation ? 'flex' : 'none', zIndex:9999, background:'rgba(0,0,0,0.6)', justifyContent:'center', alignItems:'center' }}>

			<Box sx={{ width:'95%', maxWidth:'800px', background:'#17212F', borderRadius:'15px', border:'1px solid #fff', height:'auto', minHeight:'500px', display:"flex", justifyContent:"center", alignItems:"center", flexDirection:'column', padding:'20px 50px' }}>
				{

					invalidAccounts.length > 0 ? 
						<Typography sx={{ fontSize:'20px', mb:'20px', fontWeight:'600', textAlign:'center' }}>
							Tienes <Typography sx={{ color:'red', fontWeight:'600', fontSize:'24px' }}>{invalidAccounts.length}</Typography> cuentas sin información
						</Typography>
						:
						<Typography sx={{ fontSize:'20px', mb:'20px', fontWeight:'600' }}>
							Todas tu cuentas contienen información
						</Typography>

				}
				{

					invalidAccounts.length > 0 ? 
						<Typography sx={{ fontSize:'20px', width:'80%', textAlign:'center' }}>
							Si continuas las cuentas sin información no generaran ningun documento, debido a que no existen registros de esa cuenta, actualiza el listado de catastro para generar los documentos sin información.
						</Typography>
						:
						<Typography sx={{ fontSize:'20px', width:'80%', textAlign:'center', m:'30px 0px' }}>
							Continua para generar todas las determinaciones de crédito fiscal solicitadas.
						</Typography>
				}
				<Box sx={{ mt:'20px', display:'flex', justifyContent:'center', alignItems:'center', gap:'30px' }}>
					<Button 
						variant="contained" color="primary"
						sx={{ 
							padding: '5px 20px',
							fontSize:'14px' 
						}}
						onClick={() => setOpenConfirmation(false) 
					}>
						Cancelar
					</Button>
					<Button  
						sx={{
							padding: '5px 20px',
							fontSize: '14px',
							fontWeight: '600',
							color: 'white',
							bgcolor: 'secondary.main',
							'&:hover': { bgcolor: 'secondary.dark' }
						}}
						onClick={() => crearPdf()}
					>
						Aceptar
					</Button>
				</Box>

			</Box>

			{cargandoConfirmacion && <ChargeMessage />}

		</Box>

	)

}

PreviewConfirmacion.propTypes = {
    openConfirmation: PropTypes.bool,
    setOpenConfirmation: PropTypes.func,
	invalidAccounts: PropTypes.object,
	validAccounts: PropTypes.object,
	setValidAccounts: PropTypes.func,
	setFileName: PropTypes.func,
}