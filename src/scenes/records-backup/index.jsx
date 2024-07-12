import { useState, useEffect } from 'react'
import { Box, Typography, Button, FormControl, TextField, Input } from '@mui/material'
import ChargeMessage from '../../components/Records/chargeMessage.jsx'
import { useTheme } from '@mui/material/styles'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import tool from '../../toolkit/toolkitFicha.js'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const Backup = () => {
    const [archivo, setArchivo] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [nombre, setNombre] = useState('')
    const [zipCount, setZipCount] = useState(0)
    const [instrucciones, setInstrucciones] = useState(false)
    const [respaldos, setRespaldos] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3

    const theme = useTheme()
    const isLightMode = theme.palette.mode === 'light'

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files)
        setArchivo(files)
        setZipCount(Math.ceil(files.length / 50))
    }

    const handleUpload = async () => {
        if (!archivo) return
        setCargando(true)

        try {
			archivo.sort((a, b) => a.name.localeCompare(b.name))
            const totalZips = Math.ceil(archivo.length / 50)

            for (let i = 0; i < totalZips; i++) {
                const chunk = archivo.slice(i * 50, (i + 1) * 50)
                const zip = await tool.createZipFromFiles(chunk, `parte_${i + 1}.zip`)
                const data = await tool.uploadBackup(zip, `${nombre}_part_${i + 1}`)

                const respaldoData = {
                    id_usuario: 1,
                    identificador: nombre,
                    url_respaldo: data.filePath,
                }

                const response = await tool.createRespaldo(respaldoData)

                if (response !== 'success') {
                    throw new Error('Error al crear el respaldo')
                }
            }

            alert('Archivos subidos exitosamente')
        } catch (error) {
            alert('Error al subir archivos')
        } finally {
			fetchData()
            setCargando(false)
            setArchivo(null)
            setNombre('')
            setZipCount(0)
        }
    }

	const fetchData = async () => {
		try {
			const response = await tool.getRespaldo()
			setRespaldos(response)
			console.log(response)
		} catch (error) {
			console.error('Error al obtener respaldos:', error)
		}
	}

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await tool.getRespaldo()
                setRespaldos(response)
                console.log(response)
            } catch (error) {
                console.error('Error al obtener respaldos:', error)
            }
        }

        fetchData()
    }, [])

    const filteredRespaldos = Object.keys(respaldos)
        .filter((identificador) => identificador.toLowerCase().includes(searchTerm.toLowerCase()))
        .reduce((obj, key) => {
            obj[key] = respaldos[key]
            return obj
        }, {})

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const handleDownload = (registros) => {
        if (registros && registros.registros) { 
            registros.registros.forEach((registro) => {
                const { url_respaldo } = registro
                window.open(url_respaldo, '_blank')
            })
        } else {
            console.error('No se encontraron registros válidos para descargar.')
        }
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentRespaldos = Object.keys(filteredRespaldos).slice(indexOfFirstItem, indexOfLastItem)

    return (

        <Box minHeight="100vh" width="auto" display="flex" alignItems="center" justifyContent="start" flexDirection="column">

            <Typography className="records_impression__title" mb="2rem" textAlign="center" color={isLightMode ? '#000000' : '#cff9e0'} fontSize="2.5rem">
                Subir Respaldo de Fichas
            </Typography>

            <div className={isLightMode ? 'backups__ligth' : 'backups'}>

                <FormControl fullWidth sx={{ width: '70%', marginTop: '1rem', marginBottom: '0.6rem' }}>

                    <button onClick={() => setInstrucciones(!instrucciones)}>
                        <Typography sx={{ mb: '20px', background: !isLightMode ? '#141B2D' : '#cff9e0', textAlign: 'center', fontSize: '20px', borderRadius: '10px' }}>
                            Instrucciones {instrucciones ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                        </Typography>
                    </button>

                    {instrucciones && (
                        <Typography
                            sx={{
                                mb: '20px',
                                fontSize: '16px',
                                opacity: instrucciones ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out'
                            }}>
                            Selecciona la carpeta donde se encuentren todos los PDF. El programa automáticamente creará ZIPs y los subirá parte por parte.
                        </Typography>
                    )}

                    <TextField
                        sx={{ width: '100%', mt: '10px' }}
                        id="outlined-basic"
                        label="Nombre de las fichas"
                        variant="outlined"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />

                </FormControl>

                <Box mt="1rem" width="70%">

                    {zipCount > 0 && (
                        <Typography variant="body1" sx={{ marginBottom: '1rem', color: isLightMode ? '#000000' : '#fff' }}>
                            Cantidad de ZIPs que se van a subir: {zipCount}
                        </Typography>
                    )}

                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        accept=".pdf"
                        webkitdirectory=""
                        style={{ display: 'none', width: '80%' }}
                    />

                    <label htmlFor="file-upload">

                        <Button
                            sx={{
                                border: isLightMode ? '1px solid #000000' : '1px solid #cff9e0',
                                color: isLightMode ? '#000000' : '#cff9e0'
                            }}
                            component="span"
                            fullWidth
                            variant="outlined">
                            SELECCIONAR CARPETA
                        </Button>

                    </label>

                </Box>

                {archivo && (
                    <Box mt="1rem" width="70%">
                        <Button
                            sx={{
                                backgroundColor: '#add8e6',
                                color: '#000000',
                                '&:hover': {
                                    backgroundColor: '#87ceeb'
                                }
                            }}
                            component="span"
                            fullWidth
                            variant="contained"
                            onClick={handleUpload}>
                            SUBIR
                        </Button>
                    </Box>
                )}
            </div>

            <div className={isLightMode ? 'backups__ligth_two' : 'backups_two'}>

                <Typography sx={{ mb: '20px', fontSize: '25px' }}>Descarga de Respaldos</Typography>

                <Box sx={{ mb: '30px', display: 'flex', alignItems: 'center' }}>
                    <ManageSearchIcon sx={{ fontSize: '40px', marginRight: '10px' }} />
                    <Input
                        type="text"
                        sx={{ background: 'transparent', border: 'none', width: '300px' }}
                        placeholder="Buscar por identificador..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Box>

                {currentRespaldos.length === 0 ? (

                    <Typography variant="body1" sx={{ width: '80%', textAlign: 'center', mt: '20px', fontSize: '20px', color: isLightMode ? '#000000' : '#fff' }}>
                        No se encontraron registros con ese nombre.
                    </Typography>

                ) : (

                    currentRespaldos.map((identificador, index) => (
                        <Box key={index} width={'80%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={2} p={2} bgcolor={isLightMode ? 'rgba(255, 255, 255, 0.250)' : 'rgba(0, 0, 63, 0.202)'} borderRadius={'10px'}>
                            <Typography sx={{ fontSize: '20px' }} variant="h6">
                                {identificador}
                            </Typography>
                            <Button onClick={() => handleDownload(filteredRespaldos[identificador])}>
                                <CloudDownloadIcon sx={{ color: '#fff', fontSize: '35px' }} />
                            </Button>
                        </Box>

                    ))

                )}

                <Box mt="2rem" display="flex" justifyContent="center" alignItems="center">

                    <Button
                        sx={{
                            marginRight: '10px',
                            backgroundColor: 'transparent',
                            color: isLightMode ? '#000000' : '#cff9e0',
                            '&:hover': {
                                backgroundColor: '#add8e6'
                            }
                        }}
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}>
                        <KeyboardArrowLeftIcon />
                    </Button>

                    <Typography variant="body1" sx={{ margin: '0 20px', color: isLightMode ? '#000000' : '#cff9e0' }}>
                        {currentPage} de {Math.ceil(Object.keys(filteredRespaldos).length / itemsPerPage)}
                    </Typography>

                    <Button
                        sx={{
                            marginLeft: '10px',
                            backgroundColor: 'transparent',
                            color: isLightMode ? '#000000' : '#cff9e0',
                            '&:hover': {
                                backgroundColor: '#add8e6'
                            }
                        }}
                        disabled={currentPage === Math.ceil(Object.keys(filteredRespaldos).length / itemsPerPage)}
                        onClick={() => paginate(currentPage + 1)}>
                        <KeyboardArrowRightIcon />
                    </Button>

                </Box>

            </div>

            {cargando && <ChargeMessage />}

        </Box>

    )

}

export default Backup