import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Box, Typography, Button, FormControl, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import tool from '../../toolkit/toolkitFicha.js'
import ChargeMessage from '../../components/Records/chargeMessage.jsx'
import DownloadingIcon from '@mui/icons-material/Downloading'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const Backup = () => {
    const [fileName, setFileName] = useState('')
    const [archivo, setArchivo] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [nombre, setNombre] = useState('')
    const [backup, setBackup] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(3) // Cambia aquí el número de elementos por página según necesites
    const [searchTerm, setSearchTerm] = useState('') // Estado para el término de búsqueda
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
            const response = await tool.uploadBackup(archivo, nombre)
            const data = {
                id_usuario: 1,  
                nombre: nombre,
                url_respaldo: response.filePath 
            }
            const finalResponse = await tool.createRespaldo(data)
            if(finalResponse === 'success'){
                window.location.reload()
            }
            setArchivo(null)
            setCargando(false)
        } catch (error) {
            console.error('Error al subir o crear el respaldo:', error)
            setCargando(false)
            setArchivo(null)
        }
    }
    
    useEffect(() => {
        const getBackup = async () => {
            const response = await tool.getRespaldos()
            setBackup(response.data || [])
        }
        getBackup()
    }, [])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    const filteredBackup = backup.filter(respaldo => 
        respaldo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const currentItems = filteredBackup.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredBackup.length / itemsPerPage)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <Box minHeight='100vh' width={'auto'} display={'flex'} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
            <Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#cff9e0'} fontSize={'2.5rem'}>Subir Respaldo de Fichas</Typography>

            <div className='backups'>
                <Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#fffff'} fontSize={'1.3rem'}>Para subir el respaldo de fichas finales a la nube es necesario que estas se encuentren comprimidas en formato .ZIP o .RAR </Typography>
                <Typography className='records_impression__title' mb={'2rem'} textAlign={'center'} color={'#fffff'} fontSize={'1.3rem'}>En caso de necesitar ayuda para comprimir, haz click <a href="https://www.youtube.com/watch?v=ymvMnVfwOGI" style={{ color: '#00FF00', marginLeft: '2px' }} target="_blank" rel="noopener noreferrer"> AQUÍ</a></Typography>

                <FormControl fullWidth sx={{ width: '70%', marginTop: '1rem', marginBottom: '0.6rem' }}>
                    <TextField
                        sx={{ width: '100%' }}
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
                        >
                            SELECCIONAR ARCHIVO
                        </Button>
                    </label>
                </Box>

                { archivo && (
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
                        >
                            SUBIR
                        </Button>
                    </Box>
                )}

            </div>

            { user.user_id !== 0 && (
                <div className='table'>
                    <div className='table__header'>
                        <h1 className='table__text'>Descarga de backups</h1>
                        <div>
                            <SearchIcon />
                            <input 
                                type="text" 
                                placeholder='BUSQUEDA POR NOMBRE' 
                                className='table__header__input'  
                                onChange={e => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1) // Reset page to 1 on new search
                                }}
                                value={searchTerm}
                            />
                        </div>
                    </div>

                    <div className='table__list'>
                        <ol>
                            {
                                currentItems.length === 0 
                                ? <div>No hay respaldos disponibles</div> 
                                : currentItems.map((respaldo, index) => (
                                    <li className='table__list__li' key={index}>
                                        {respaldo.nombre} 
                                        <button className='table__list__li__button'>
											<a href={respaldo.url_respaldo}>
												<DownloadingIcon sx={{ fontSize:'30px', color:'#00FF00' }} />
											</a>
                                        </button>
                                    </li>
                                ))
                            }
                        </ol>
                    </div>

                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}><ArrowBackIosIcon sx={{ fontSize:'25px' }} /></button>
                        <span className='pagination__text'>{currentPage} de {totalPages}</span>
                        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= filteredBackup.length}><ArrowForwardIosIcon sx={{ fontSize:'25px' }} /></button>
                    </div>
                </div>
            )}

            { cargando && <ChargeMessage/> } 

        </Box>
    )
}

export default Backup 	