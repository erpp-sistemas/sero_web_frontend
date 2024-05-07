import { Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
export default function Preview({ registro, setOpenPreview }) {

    return (

        <Box sx={{ position:'absolute', width:'100%', height:'100vh', display: 'flex', alignItems: 'center', top:'0px', left:'0', zIndex:'20000', background:'rgba(0, 0, 0, 0.42)', flexDirection:'column', justifyContent:'center' }}>
            
			<Box sx={{ width:'85%', padding:'40px', height:'85%', background:'#ffffff', display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection:'column', gap:'1rem', borderRadius:'10px', position:'relative' }}>
                
				<button onClick={() => setOpenPreview(false)} className='preview_close'><CloseIcon sx={{ fontSize:'1.5rem', color:'black', fontWeight:'900' }} /></button>
                
				<Typography sx={{ color:'black', fontSize:'2rem', fontWeight:'500' }}>Vista previa</Typography>

                <Box sx={{ width:'95%', height:'95%', border:'2px solid gray', borderRadius:'20px', overflow:'hidden' }}>

                    <iframe srcDoc={`<!DOCTYPE html>

                        <html lang="en">

                        <head>

                            <meta charset="UTF-8">

                            <meta name="viewport" content="width=device-width, initial-scale=1.0">

                            <title>Preuba de template</title>

                        </head>

                        <body>

                            <h1 style="color: blue;  font-family: sans-serif;" >TEMPLATE DE PRUEBA</h1>

							<p>Calle: ${registro.calle}</p>

                            <p>Colonia: ${registro.colonia}</p>

                            <p>Tarea Gestionada: ${registro.tarea_gestionada}</p>	

                            <p>Tipo de Gestion: ${registro.tipo_gestion}</p>	

                        </body>

                        </html>`} title="Vista previa" style={{ width: '100%', height: '100%', border: 'none' }} />

                </Box>


            </Box>

        </Box>

    )

}
	
Preview.propTypes = {
    registro: PropTypes.object.isRequired,
    setOpenPreview: PropTypes.func.isRequired
}