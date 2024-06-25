import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Box, Typography, Button, FormControl, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import tool from '../../toolkit/toolkitFicha.js'
import ChargeMessage from '../../components/Records/chargeMessage.jsx'
import ModalBackup from '../../components/Records/ModalBackup.jsx'

/**
 * @name RespaldoFichas
 * @autor Iván Sánchez
 * @component
*/
const Backup = () => {

    const [fileName, setFileName] = useState('')
    const [archivo, setArchivo] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [backup, setBackup] = useState()
    const [open, setOpen] = useState(false)
    const [nombre, setNombre] = useState('')
    const user = useSelector(state => state.user)

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setArchivo(file)
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        setFileName(file.name)
    }

    const processUpload = async () => {
        if (!nombre) {
            alert("Por favor, ingresa un nombre para el archivo.")
            return
        }

        setCargando(true)

        try {
            const renamedFile = new File([archivo], `${nombre}.zip`, { type: archivo.type })

            await tool.uploadBackup(renamedFile, nombre)
            setCargando(false)
            setArchivo(null)
            setOpen(true)
        } catch (error) {
            console.error('Error al subir el archivo de Excel:', error)
            setCargando(false)
            setArchivo(null)
        }
    }

    useEffect(() => {
        const getBackup = async () => {
            const data = await tool.getBackup()
            setBackup(data)
        }

        getBackup()
    }, [])


    return (

        <Box minHeight='100vh' width={'auto'} display={'flex'} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>

            <Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#cff9e0'} fontSize={'2.5rem'}>Subir Respaldo de Fichas</Typography>

            <div className='backups'>

                <Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#fffff'} fontSize={'1.3rem'}>Para subir el respaldo de fichas finales a la nube es necesario que estas se encuenten comprimidas en formato .ZIP o .RAR </Typography>
                <Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#fffff'} fontSize={'1.3rem'}>En caso de necesitar ayuda parar comprimir dar click <a href="https://www.youtube.com/watch?v=ymvMnVfwOGI" style={{ color: '#00FF00', marginLeft: '2px' }} target="_blank" rel="noopener noreferrer"> AQUI</a></Typography>

                <FormControl fullWidth sx={{ width: '70%', marginTop: '1rem', marginBottom: '0.6rem' }} >

                    <TextField
                        sx={{
                            width: '100%',
                        }}
                        id='outlined-basic'
                        label='Nombre del archivo'
                        variant='outlined'
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />

                </FormControl>

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

            {
                
                user.user_id !==0 ?

                    <div className='table'>

                        <div className='table__header'>
                            <h1 className='table__text'>Descarga de backups</h1>
                            <div>
                                <SearchIcon />
                                <input type="text" placeholder='BUSQUEDA POR NOMBRE' className='table__header__input'  />
                            </div>
                        </div>

						<button onClick={ () => console.log(backup.data.folders) }>Backup</button>

                        {/* <ul className='table__list'>
						{backup?.data?.folders && backup.data.folders.length > 0 ? (
							backup.data.folders.map((folder, index) => (
								<li key={index}>{folder}</li>
							))
							) : (
								<li>No folders available</li>
							)}
                        </ul> */}

                    </div>

                    : false

            }

            { cargando ? <ChargeMessage/> : false} 
            { open ? <ModalBackup/> : false}

        </Box>

    )

}

export default Backup
