import { Box, Typography, Button } from "@mui/material"
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import ImageIcon from '@mui/icons-material/Image'
import { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNombreTarjetaCirculacion, setNombreFactura, setNombreGarantia, setNombreSeguro, setTarjetaCirculacion, setFactura, setGarantia, setSeguro, setFrente, setTrasera, setLadoDerecho, setLadoIzquierdo } from '../../../redux/vehiculosSlices/documentosSlice.js'
import { setErrorTarjetaCirculacion, setErrorFactura, setErrorGarantia, setErrorSeguro, setErrorFrente, setErrorTrasera, setErrorLadoDerecho, setErrorLadoIzquierdo } from '../../../redux/vehiculosSlices/documentosErrorsSlice.js'

const Documentos = () => {
    const documentos = useSelector(state => state.documentos)
    const documentosErrors = useSelector(state => state.documentosErrors)
    const dispatch = useDispatch()

    const fileInputRef = useRef({
        tarjetaCirculacion: null,
        factura: null,
        seguro: null,
        garantia: null,
        ladoIzquierdo: null,
        ladoDerecho: null,
        frente: null,
        trasera: null,
    })

    const [previews, setPreviews] = useState({
        frente: null,
        trasera: null,
        ladoDerecho: null,
        ladoIzquierdo: null
    })

    const handleFileChange = (e, po, pf) => {
        const file = e.target.files[0]
        if (file) {
            dispatch(po(file.name))
            dispatch(pf(file))
        }
    }

    const handleFileChangeImage = (e, pf, key) => {
        const file = e.target.files[0]
        if (file) {
            dispatch(pf(file))
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [key]: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleClick = (type) => {
        fileInputRef.current[type].click()
    }

    return (

        <Box sx={{ width: '100%', height: 'auto' }}>

            <Typography sx={{ fontSize: '24px', width: '100%', textAlign: 'start', mb: '20px', mt: '40px' }}>Documentos</Typography>

            <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
          
                <Box>
                    <Typography sx={{ fontSize: '18px', color: '#fff', width: '100%', textAlign: 'center' }}>Tarjeta de circulación</Typography>
                    <Button
                        sx={{ width: '170px', height: '170px', background: 'rgba(0,0,0,0.2)', mt: '10px', borderRadius: '10px', border: !documentosErrors.errorTarjetaCirculacion ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center' }}
                        onClick={() => handleClick('tarjetaCirculacion')}
                    >
                        <DocumentScannerIcon sx={{ color: '#fff', fontSize: '60px' }} />
                    </Button>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRef.current.tarjetaCirculacion = el)}
                        onChange={(e) => { handleFileChange(e, setNombreTarjetaCirculacion, setTarjetaCirculacion); dispatch(setErrorTarjetaCirculacion(false)); }}
                    />
                    {documentos.nombreTarjetaCirculacion && <Typography sx={{ fontSize: '14px', color: '#fff', width: '100%', textAlign: 'center', mt: '10px', maxWidth: '180px' }}>{documentos.nombreTarjetaCirculacion}</Typography>}
                </Box>

                <Box>
                    <Typography sx={{ fontSize: '18px', color: '#fff', width: '100%', textAlign: 'center' }}>Factura</Typography>
                    <Button
                        sx={{ width: '170px', height: '170px', background: 'rgba(0,0,0,0.2)', mt: '10px', borderRadius: '10px', border: !documentosErrors.errorFactura ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center' }}
                        onClick={() => handleClick('factura')}
                    >
                        <DocumentScannerIcon sx={{ color: '#fff', fontSize: '60px' }} />
                    </Button>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRef.current.factura = el)}
                        onChange={(e) => { handleFileChange(e, setNombreFactura, setFactura); dispatch(setErrorFactura(false)); }}
                    />
                    {documentos.nombreFactura && <Typography sx={{ fontSize: '14px', color: '#fff', width: '100%', textAlign: 'center', mt: '10px', maxWidth: '180px' }}>{documentos.nombreFactura}</Typography>}
                </Box>

                <Box>
                    <Typography sx={{ fontSize: '18px', color: '#fff', width: '100%', textAlign: 'center' }}>Seguro</Typography>
                    <Button
                        sx={{ width: '170px', height: '170px', background: 'rgba(0,0,0,0.2)', mt: '10px', borderRadius: '10px', border: !documentosErrors.errorSeguro ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center' }}
                        onClick={() => handleClick('seguro')}
                    >
                        <DocumentScannerIcon sx={{ color: '#fff', fontSize: '60px' }} />
                    </Button>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRef.current.seguro = el)}
                        onChange={(e) => { handleFileChange(e, setNombreSeguro, setSeguro); dispatch(setErrorSeguro(false)); }}
                    />
                    {documentos.nombreSeguro && <Typography sx={{ fontSize: '14px', color: '#fff', width: '100%', textAlign: 'center', mt: '10px', maxWidth: '180px' }}>{documentos.nombreSeguro}</Typography>}
                </Box>

                <Box>
                    <Typography sx={{ fontSize: '18px', color: '#fff', width: '100%', textAlign: 'center' }}>Garantía</Typography>
                    <Button
                        sx={{ width: '170px', height: '170px', background: 'rgba(0,0,0,0.2)', mt: '10px', borderRadius: '10px', border: !documentosErrors.errorGarantia ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center' }}
                        onClick={() => handleClick('garantia')}
                    >
                        <DocumentScannerIcon sx={{ color: '#fff', fontSize: '60px' }} />
                    </Button>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRef.current.garantia = el)}
                        onChange={(e) => { handleFileChange(e, setNombreGarantia, setGarantia); dispatch(setErrorGarantia(false)); }}
                    />
                    {documentos.nombreGarantia && <Typography sx={{ fontSize: '14px', color: '#fff', width: '100%', textAlign: 'center', mt: '10px', maxWidth: '180px' }}>{documentos.nombreGarantia}</Typography>}
                </Box>
            </Box>

            <Typography sx={{ fontSize: '24px', width: '100%', textAlign: 'start', mb: '20px', mt: '40px' }}>Imagenes</Typography>

            <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>

                <Box>
                    <Typography sx={{ fontSize: '18px', color: '#fff', width: '100%', textAlign: 'center' }}>Frente</Typography>
                    <Button
                        sx={{ width: '170px', height: '170px', background: 'rgba(0,0,0,0.2)', mt: '10px', borderRadius: '10px', border: !documentosErrors.errorFrente ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                        onClick={() => handleClick('frente')}
                    >
                        {previews.frente ? (
                            <img src={previews.frente} alt="Frente" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <ImageIcon sx={{ color: '#fff', fontSize: '60px' }} />
                        )}
                    </Button>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        accept=".png,.jpg"
                        ref={(el) => (fileInputRef.current.frente = el)}
                        onChange={(e) => { handleFileChangeImage(e, setFrente, 'frente'); dispatch(setErrorFrente(false)); }}
                    />
                </Box>

                <Box>
                    <Typography sx={{ fontSize: '18px', color: '#fff', width: '100%', textAlign: 'center' }}>Trasera</Typography>
                    <Button
                        sx={{ width: '170px', height: '170px', background: 'rgba(0,0,0,0.2)', mt: '10px', borderRadius: '10px', border: !documentosErrors.errorTrasera ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                        onClick={() => handleClick('trasera')}
                    >
                        {previews.trasera ? (
                            <img src={previews.trasera} alt="Trasera" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <ImageIcon sx={{ color: '#fff', fontSize: '60px' }} />
                        )}
                    </Button>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        accept=".png,.jpg"
                        ref={(el) => (fileInputRef.current.trasera = el)}
                        onChange={(e) => { handleFileChangeImage(e, setTrasera, 'trasera'); dispatch(setErrorTrasera(false)); }}
                    />
                </Box>

                <Box>
                    <Typography sx={{ fontSize: '18px', color: '#fff', width: '100%', textAlign: 'center' }}>Lado derecho</Typography>
                    <Button
                        sx={{ width: '170px', height: '170px', background: 'rgba(0,0,0,0.2)', mt: '10px', borderRadius: '10px', border: !documentosErrors.errorLadoDerecho ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                        onClick={() => handleClick('ladoDerecho')}
                    >
                        {previews.ladoDerecho ? (
                            <img src={previews.ladoDerecho} alt="Lado derecho" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <ImageIcon sx={{ color: '#fff', fontSize: '60px' }} />
                        )}
                    </Button>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        accept=".png,.jpg"
                        ref={(el) => (fileInputRef.current.ladoDerecho = el)}
                        onChange={(e) => { handleFileChangeImage(e, setLadoDerecho, 'ladoDerecho'); dispatch(setErrorLadoDerecho(false)); }}
                    />
                </Box>

                <Box>
                    <Typography sx={{ fontSize: '18px', color: '#fff', width: '100%', textAlign: 'center' }}>Lado izquierdo</Typography>
                    <Button
                        sx={{ width: '170px', height: '170px', background: 'rgba(0,0,0,0.2)', mt: '10px', borderRadius: '10px', border: !documentosErrors.errorLadoIzquierdo ? '1px solid #fff' : '1px solid red', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                        onClick={() => handleClick('ladoIzquierdo')}
                    >
                        {previews.ladoIzquierdo ? (
                            <img src={previews.ladoIzquierdo} alt="Lado izquierdo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <ImageIcon sx={{ color: '#fff', fontSize: '60px' }} />
                        )}
                    </Button>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        accept=".png,.jpg"
                        ref={(el) => (fileInputRef.current.ladoIzquierdo = el)}
                        onChange={(e) => { handleFileChangeImage(e, setLadoIzquierdo, 'ladoIzquierdo'); dispatch(setErrorLadoIzquierdo(false)); }}
                    />

                </Box>

            </Box>

        </Box>

    )

}

export default Documentos