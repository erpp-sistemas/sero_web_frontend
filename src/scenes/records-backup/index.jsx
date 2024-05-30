import { Box, Typography, Button } from '@mui/material'
import { useState } from 'react'
import tool from '../../toolkit/toolkitFicha.js'
import Charge from '../../components/Records/charge.jsx'
import ModalBackup from '../../components/Records/ModalBackup.jsx'

const Backup = () => {
	
	const [fileName, setFileName] = useState('')
	const [archivo, setArchivo] = useState(null)
	const [cargando, setCargando] = useState(false)
	const [open, setOpen] = useState(false)


	const handleFileUpload = (e) => {
		const file = e.target.files?.[0]
		if (!file) return
		setArchivo(file)
		const reader = new FileReader()
		reader.readAsArrayBuffer(file)
		setFileName(file.name)
	}

	const processUpload = async () => {

		setCargando(true)

		try {
            const archivoURL = await tool.uploadBackup(archivo)
			console.log(archivoURL)
			setCargando(false)
			setArchivo(null)
			setOpen(true)
        } catch (error) {
            console.error('Error al subir el archivo de Excel:', error)
			setCargando(false)
			setArchivo(null)
        }

	}

	return (

		<Box minHeight='100vh' width={'auto'} display={'flex'} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>

			<Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#cff9e0'} fontSize={'2.5rem'}>Subir Respaldo de Fichas</Typography>
			
			<div className='backups'>
				
				<Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#fffff'} fontSize={'1.3rem'}>Para subir el respaldo de fichas finales a la nube es necesario que estas se encuenten comprimidas en formato .ZIP o .RAR </Typography>
				<Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#fffff'} fontSize={'1.3rem'}>En caso de necesitar ayuda parar comprimir dar click <a href="https://www.youtube.com/watch?v=ymvMnVfwOGI" style={{ color: '#00FF00', marginLeft: '2px' }} target="_blank" rel="noopener noreferrer"> AQUI</a></Typography>
				
				<Box mt={'2rem'} width={'70%'}>

					{fileName && (

						<Typography variant='body1' sx={{ marginBottom: '1rem', color: '#fff' }}>
							Archivo seleccionado: {fileName}
						</Typography>

					)}

					<input 
                        type='file' 
                        id='file-upload' 
                        onChange={handleFileUpload} 
                        accept='.zip,.rar' 
                        style={{ display: 'none', width: '80%', }} 
                    />

					<label htmlFor='file-upload'>
						<Button 
						sx={{
							border:'1px solid #cff9e0',
							color: '#cff9e0',
						}}
							component='span' 
							fullWidth 
							variant='outlined' 
						>SELECCIONAR ARCHIVO</Button>
					</label>

				</Box>

				{

					archivo ? (

						<Box mt={'1rem'} width={'70%'}>
							<Button
								sx={{
									backgroundColor: '#add8e6', 
									color: '#000000', 
									'&:hover': {
										backgroundColor: '#87ceeb', 
									},
								}}
								component='span' 
								fullWidth 
								variant='contained' 
								onClick={processUpload}
							>SUBIR</Button>
						</Box>

					):(
						false
					)
					
				}
				

			</div>

			{ cargando ? <Charge/> : false}
			{ open ? <ModalBackup/> : false}

		</Box>

	)

}

export default Backup

