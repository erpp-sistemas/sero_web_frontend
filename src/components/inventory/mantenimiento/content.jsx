import { Box, Typography, TextField, Button } from "@mui/material"
import { useState } from "react"
import AddBoxIcon from '@mui/icons-material/AddBox'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Download } from "@mui/icons-material"
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'

const Content = () => {

    const [prueba, setPrueba] = useState('')
    const [date, setDate] = useState(null)
    const [isImagesOpen, setIsImagesOpen] = useState(false)
    const [imagenes, setImagenes] = useState([])

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setImagenes((prevImages) => [...prevImages, ...files])
    }

    return (

        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'start', alignItems: 'start', mt: '40px', flexDirection:{ xs:'column', md:'row' } }}>
            
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

            <Box sx={{ width:{ xs:'100%', md:'40%' }, height: 'auto', minHeight: '500px', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'column', margin:{ xs:'40px 0px', md:'0px' } }}>

                <Typography sx={{ width: '100%', textAlign: 'center', fontSize: '24px' }}>Agregar mantenimiento</Typography>

				<TextField
                    sx={{
                        width: '100%',
                        maxWidth: '320px',
                        marginTop: '20px',
                        '& input[type=number]': {
                            '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0,
                        },
                    }}
                    id="Tipo"
                    label="Tipo"
                    value={prueba}
                    variant="outlined"
                    onChange={event => setPrueba(event.target.value)}
                    type="text"
                />

                <TextField
                    sx={{ width: '100%', maxWidth: '320px', marginTop: '20px' }}
                    id="start-date"
                    label="Fecha"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    sx={{
                        width: '100%',
                        maxWidth: '320px',
                        marginTop: '20px',
                        '& input[type=number]': {
                            '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                            '-webkit-appearance': 'none',
                            margin: 0,
                        },
                    }}
                    id="Costo"
                    label="Costo"
                    value={prueba}
                    variant="outlined"
                    onChange={event => setPrueba(event.target.value)}
                    type="number"
                />

                <Typography sx={{ width: '100%', maxWidth: '320px', textAlign: 'start', fontSize: '14px', padding: '20px 5px' }}>Evidencias</Typography>

                <Box sx={{ width: '100%', maxWidth: '320px', height: '250px', border: '1px solid #ffffff', background: 'rgba(0,0,0,0.2)', borderRadius: '5px', display: 'flex', justifyContent: 'start', flexWrap: 'wrap', alignItems: 'start', alignContent: 'flex-start', gap: '10px', padding: '10px', overflowY: 'scroll', overflowX: 'hidden' }}>
                    <Button
                        component="label"
                        sx={{ width: '90px', height: '90px', borderRadius: '5px' }}
                    >
                        <AddBoxIcon sx={{ fontSize: '70px', color: '#66bb6a' }} />
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>
                    {imagenes.map((imagen, index) => (
                        <Box key={index} sx={{ width: '90px', minWidth: '90px', height: '90px', background: '#fff', borderRadius: '5px', overflow: 'hidden', display:'flex', justifyContent:'center', alignItems:'center' }}>
                            <img src={URL.createObjectURL(imagen)} alt={`imagen-${index}`} width={'100%'} height={'100%'} />
                        </Box>
                    ))}
                </Box>

                <Button sx={{ color: '#ffffff', background: '#66bb6a', mt: '20px', p: '5px 35px', fontSize: '14px', marginBottom:'30px' }}>Crear</Button>

            </Box>

        </Box>

    )

}

export default Content