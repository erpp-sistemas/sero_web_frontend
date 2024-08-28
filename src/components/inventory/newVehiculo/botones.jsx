import { Box, Button } from "@mui/material"
import PropTypes from 'prop-types'
import { useState } from "react"
import Alerts from '../../../components/Alerts'
import { setErrorKilometraje, setErrorSelectedPlace, setErrorImage, setErrorModelo, setErrorVehiculo, setErrorMarca, setErrorColor, setErrorColorLlavero, setErrorSerie, setErrorTipoMotor, setErrorPlaca } from '../../../redux/vehiculosSlices/informacionGeneralErrorsSlice.js'
import { setErrorFactura, setErrorGarantia, setErrorSeguro, setErrorTarjetaCirculacion, setErrorLadoDerecho, setErrorLadoIzquierdo, setErrorFrente, setErrorTrasera } from '../../../redux/vehiculosSlices/documentosErrorsSlice.js'
import { setErrorCombustible, setErrorBateria, setErrorNeumatico } from '../../../redux/vehiculosSlices/estadoErrorsSlice.js'
import { useDispatch } from 'react-redux'
import toolkitVehiculos from "../../../toolkit/toolkitVehiculos.js"
import Charge from '../../Records/charge.jsx'
import { setKilometraje, setSelectedPlace, setImage, setModelo, setPlaca, setVehiculo, setMarca, setSerie, setColor, setColorLlavero, setTipoMotor, setImagePreview } from "../../../redux/vehiculosSlices/informacionGeneralSlice.js"
import { setFactura, setFrente, setGarantia, setLadoDerecho, setLadoIzquierdo, setNombreFactura, setNombreGarantia, setNombreSeguro, setNombreTarjetaCirculacion, setPreviewFrente, setPreviewLadoDerecho, setPreviewLadoIzquierdo, setPreviewTrasera, setSeguro, setTarjetaCirculacion, setTrasera } from '../../../redux/vehiculosSlices/documentosSlice.js'
import { setCombustible, setBateria, setNeumaticos, setFugaAceite, setFugaCombustible, setFugaAceiteMotor, setDireccionalesDelanteras, setDireccionalesTraseras, setLucesTablero, setLuzFreno, setLlantaDelantera, setLlantaTrasera, setDeformacionesLlanta, setEncendido, setTensionCadena, setFrenoDelantero, setFrenoTrasero, setAmortiguadores, setDireccion, setSilla, setEspejos, setVelocimetro, setClaxon, setPalancas, setObservaciones } from "../../../redux/vehiculosSlices/estadoSlice.js"
import { setImagenFugaAceite, setImagenFugaCombustible, setImagenFugaAceiteMotor, setImagenDireccionalesDelanteras, setImagenDireccionalesTraseras, setImagenLucesTablero, setImagenLuzFreno, setImagenLlantaDelantera, setImagenLlantaTrasera, setImagenDeformacionesLlanta, setImagenEncendido, setImagenTensionCadena, setImagenFrenoDelantero, setImagenFrenoTrasero, setImagenAmortiguadores, setImagenSilla, setImagenEspejos, setImagenVelocimetro, setImagenClaxon, setImagenPalancas } from '../../../redux/vehiculosSlices/imagenesEstadoSlice.js'
import { setPagosVerificacion } from '../../../redux/vehiculosSlices/pagosVerificacionSlice.js'
import { setPagosTenencia } from '../../../redux/vehiculosSlices/pagosTenenciaSlice.js'
import { removeAllPagoPlacas } from '../../../redux/vehiculosSlices/pagosPlacasSlice.js'
import { setPagosExtraordinarios } from '../../../redux/vehiculosSlices/pagosExtraordinariosSlice.js'

const 	Botones = ({ next, setNext, data, dataDocuments, dataEstado, dataPagos, dataImagenes, setOpenNew, dataVeiculos, setAlert }) => {
    const [errorText, setErrorText] = useState('')
    const [error, setError] = useState(false)
	const [charge, setCharge] = useState(false)
	const dispatch = useDispatch()

	const ResetData = () => {
		dispatch(setKilometraje('')); dispatch(setSelectedPlace('')); dispatch(setImage(null)); dispatch(setImagePreview(null)); dispatch(setModelo('')); dispatch(setPlaca('')); dispatch(setVehiculo('')); dispatch(setSerie('')); dispatch(setMarca('')); dispatch(setColor('')); dispatch(setColorLlavero('')); dispatch(setTipoMotor(''));
		dispatch(setFactura(null)); dispatch(setFrente(null)); dispatch(setGarantia(null)); dispatch(setLadoDerecho(null)); dispatch(setLadoIzquierdo(null)); dispatch(setNombreFactura('')); dispatch(setNombreGarantia('')); dispatch(setNombreSeguro('')); dispatch(setNombreTarjetaCirculacion('')); 
		dispatch(setPreviewFrente(null)); dispatch(setPreviewLadoDerecho(null)); dispatch(setPreviewLadoIzquierdo(null)); dispatch(setPreviewTrasera(null)); dispatch(setSeguro(null)); dispatch(setTarjetaCirculacion(null)); dispatch(setTrasera(null));
		dispatch(setCombustible('')); dispatch(setBateria('')); dispatch(setNeumaticos('')); dispatch(setFugaAceite(false)); dispatch(setFugaCombustible(false)); dispatch(setFugaAceiteMotor(false)); dispatch(setDireccionalesDelanteras(false)); dispatch(setDireccionalesTraseras(false)); dispatch(setLucesTablero(false));
		dispatch(setLuzFreno(false)); dispatch(setLlantaDelantera(false)); dispatch(setLlantaTrasera(false)); dispatch(setDeformacionesLlanta(false)); dispatch(setEncendido(false)); dispatch(setTensionCadena(false)); dispatch(setFrenoDelantero(false)); dispatch(setFrenoTrasero(false)); dispatch(setAmortiguadores(false));
		dispatch(setDireccion(false)); dispatch(setSilla(false)); dispatch(setEspejos(false)); dispatch(setVelocimetro(false)); dispatch(setClaxon(false)); dispatch(setPalancas(false)); dispatch(setObservaciones(''));
		dispatch(setImagenFugaAceite(null)); dispatch(setImagenFugaCombustible(null)); dispatch(setImagenFugaAceiteMotor(null)); dispatch(setImagenDireccionalesDelanteras(null)); dispatch(setImagenDireccionalesTraseras(null)); dispatch(setImagenLucesTablero(null)); dispatch(setImagenLuzFreno(null));
		dispatch(setImagenLlantaDelantera(null)); dispatch(setImagenLlantaTrasera(null)); dispatch(setImagenDeformacionesLlanta(null)); dispatch(setImagenEncendido(null)); dispatch(setImagenTensionCadena(null)); dispatch(setImagenFrenoDelantero(null)); dispatch(setImagenFrenoTrasero(null));
		dispatch(setImagenAmortiguadores(null)); dispatch(setImagenSilla(null)); dispatch(setImagenEspejos(null)); dispatch(setImagenVelocimetro(null)); dispatch(setImagenClaxon(null)); dispatch(setImagenPalancas(null));
		dispatch(setPagosExtraordinarios([])); dispatch(removeAllPagoPlacas()); dispatch(setPagosTenencia([])); dispatch(setPagosVerificacion([]));
	}

    const NextPage = () => {
        if (next === '') {
            setNext('documentos')
        } else if (next === 'documentos') {
            setNext('estado')
        } else if (next === 'estado') {
            setNext('pagos')
        } else {
            setNext('')
        }
    }
	
    const VerificacionErrores = () => {
        const errors = []
        Object.keys(data).forEach(field => {
            let label = field.charAt(0).toUpperCase() + field.slice(1)
            if (field === 'image' ? data[field] === null : data[field] === '') {
                errors.push(label)
                if (field === 'kilometraje') {	
                    dispatch(setErrorKilometraje(true))
                }
				if (field === 'modelo') {
                    dispatch(setErrorModelo(true))
                }
				if (field === 'selectedPlace') {
                   dispatch(setErrorSelectedPlace(true))
                }
				if (field === 'serie') {
                    dispatch(setErrorSerie(true))
                }
				if (field === 'marca') {
                    dispatch(setErrorMarca(true))
                }
				if (field === 'color') {
                    dispatch(setErrorColor(true))
                }
				if (field === 'colorLlavero') {
                    dispatch(setErrorColorLlavero(true))
                }
				if (field === 'tipoMotor') {
                    dispatch(setErrorTipoMotor(true))
                }
				if (field === 'image') {
                    dispatch(setErrorImage(true))
                }
				if (field === 'vehiculo') {
                    dispatch(setErrorVehiculo(true))
                }
				if (field === 'placa') {
                    dispatch(setErrorPlaca(true))
                }
            }
        })
        if (errors.length > 0) {
            if (errors.length === 1) {
                setErrorText(`Falta el campo: ${errors[0]}`)
            } else {
                setErrorText('Hay múltiples datos vacíos, por favor completa el formulario.')
            }
            setError(true)
            return true
        } else {
            setError(false)
            return false
        }
    }

	const VerificacionDocumentos = () => {
		const errors = []
		Object.keys(dataDocuments).forEach(field => {
			let label = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()
			if (dataDocuments[field] === null) {
				errors.push(label)
				if (field === 'factura') dispatch(setErrorFactura(true))
				if (field === 'garantia') dispatch(setErrorGarantia(true))
				if (field === 'seguro') dispatch(setErrorSeguro(true))
				if (field === 'tarjetaCirculacion') dispatch(setErrorTarjetaCirculacion(true))
				if (field === 'frente') dispatch(setErrorFrente(true))
				if (field === 'trasera') dispatch(setErrorTrasera(true))
				if (field === 'ladoDerecho') dispatch(setErrorLadoDerecho(true))
				if (field === 'ladoIzquierdo') dispatch(setErrorLadoIzquierdo(true))
			}
		})

		if (errors.length > 0) {
			if (errors.length === 1) {
				setErrorText(`Falta el campo: ${errors[0]}`)
			} else {
				setErrorText('Hay múltiples datos vacíos, por favor completa el formulario.')
			}
			setError(true)
			return true
		} else {
			setError(false)
			return false
		}

	}

	const VerificacionEstado = () => {
		const errors = []
		const estadoFields = Object.keys(dataEstado).slice(0, 3)
		estadoFields.forEach(field => {
			let label = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()
			if (dataEstado[field] === null || dataEstado[field] === '') {
				errors.push(label)
				if (field === 'combustible') dispatch(setErrorCombustible(true))
				if (field === 'bateria') dispatch(setErrorBateria(true))
				if (field === 'neumatico') dispatch(setErrorNeumatico(true))
			}
		})
		if (errors.length > 0) {
			if (errors.length === 1) {
				setErrorText(`Falta el campo: ${errors[0]}`)
			} else {
				setErrorText('Hay múltiples datos vacíos, por favor completa el formulario.')
			}
			setError(true)
			return true
		} else {
			setError(false)
			return false
		}
	}

	const VeficationData = () => {
		
		if(next === ''){
			const hasError = VerificacionErrores()
			if (!hasError) {
				NextPage()  
			} else {
				console.info(errorText)
			}
		} else if(next === 'documentos') {
			const hasError = VerificacionDocumentos()
			if (!hasError) {
				NextPage()  
			} else {
				console.info(errorText)
			}
		} else if(next === 'estado') {
			const hasError = VerificacionEstado()
			if (!hasError) {
				NextPage()  
			} else {
				console.info(errorText)
			}
		}
	}

    const PrevPage = () => {
        if (next === 'pagos') {
            setNext('estado')
        } else if (next === 'estado') {
            setNext('documentos')
        } else {
            setNext('')
        }
    }

	const subirDocumento = async (documento, tipo) => {
		const response = await toolkitVehiculos.subirImagen(documento, tipo)
		return response.data.fileUrl
	}
		
	const procesarPagos = async (dataPagos, id_vehiculo) => {
		const siguiente_pago = 'desconocido'
		const tiposPagos = [
			{ tipo: 'pagosExtraordinarios', metodo: 'actualizarExtraordinarios', label: 'Pago Extraordinario' },
			{ tipo: 'pagosPlacas', metodo: 'actualizarPlacas', label: 'Pago Placas' },
			{ tipo: 'pagosTenencia', metodo: 'actualizarTenencia', label: 'Pago Tenencia' },
			{ tipo: 'pagosVerificacion', metodo: 'actualizarVerificacion', label: 'Pago Verificacion' },
		]
		for (const { tipo, metodo, label } of tiposPagos) {
			if (dataPagos[tipo].length > 0) {
				for (const pago of dataPagos[tipo]) {
					const constancia = await subirDocumento(pago.documento, label)
					await toolkitVehiculos[metodo]({ ...pago, id_vehiculo, constancia, siguiente_pago })
				}
			}
		}
		return 201
	}
		
	const SubirVehiculo = async () => {

		console.log(dataImagenes)

		// setCharge(true)

		// try{

		// 	const imagenResponse = await toolkitVehiculos.subirImagen(data.imagen, 'Imagen Vehiculo')
		// 	const imagen_vehiculo = imagenResponse.data.fileUrl
		// 	const vehiculoResponse = await toolkitVehiculos.generateVehiculo({ ...data, imagen_vehiculo })
		// 	const vehiculo = vehiculoResponse.data
		// 	const docs = ['tarjetaCirculacion', 'factura', 'seguro', 'garantia', 'frente', 'trasera', 'ladoIzquierdo', 'ladoDerecho']
		// 	const documentPromises = docs.map(doc => subirDocumento(dataDocuments[doc], doc.replace(/([A-Z])/g, ' $1').trim()))
		// 	const documentUrls = await Promise.all(documentPromises)
		// 	if (documentUrls.some(url => !url)) {
		// 		console.error('Los documentos no se subieron correctamente')
		// 		return
		// 	}
		// 	const newDocuments = {
		// 		id_vehiculo: vehiculo.data.id_vehiculo,
		// 		tarjeta_circulacion: documentUrls[0],
		// 		factura: documentUrls[1],
		// 		seguro: documentUrls[2],
		// 		garantia: documentUrls[3],
		// 		imagen_frente: documentUrls[4],
		// 		imagen_trasera: documentUrls[5],
		// 		imagen_lado_izquierdo: documentUrls[6],
		// 		imagen_lado_derecho: documentUrls[7]
		// 	}
		// 	const documentos = await toolkitVehiculos.actualizarDocumentos(newDocuments)
		// 	if (documentos.status !== 201) {
		// 		console.error('Hubo un problema al actualizar los documentos')
		// 		return
		// 	}
		// 	dataEstado.id_vehiculo = vehiculo.data.id_vehiculo
		// 	const estado = await toolkitVehiculos.crearEstadoVehiculo(dataEstado)
		// 	if (estado.status !== 201) {
		// 		console.error('Hubo un problema al crear el estado del vehiculo')
		// 		return
		// 	}
		// 	for (const key in dataImagenes) {
		// 		if (dataImagenes[key]) {
		// 		const imagePromises = dataImagenes[key].map(image => subirDocumento(image.file, key))
		// 		const imageResponses = await Promise.all(imagePromises)
		// 		const uploadPromises = imageResponses.map((fileUrl) => toolkitVehiculos.actualizarImagenes({
		// 			id_vehiculo: vehiculo.data.id_vehiculo,
		// 			imagen: fileUrl
		// 		}, key))
		// 		await Promise.all(uploadPromises)
		// 		}
		// 	}
		// 	await procesarPagos(dataPagos, vehiculo.data.id_vehiculo)
		// 	setCharge(false)
		// 	dataVeiculos()
		// 	ResetData()
		// 	setAlert(true)
		// 	setOpenNew(false)

		// } catch(error) {
		// 	console.error(error.message)
		// }
		
	}

    return (

        <Box 
            sx={{
                width:'100%', 
                height:'auto',
                marginTop:'20px',
                display:'flex',
                justifyContent:'flex-end',
                alignItems:'center',
                gap:'1rem'
            }}
        >
            { next !== '' && 
                <Button 
                    sx={{ fontSize:'12px', color:'#fff', padding:'5px 20px', background:'#4d82bc'}} 
                    variant="contained" 
                    onClick={PrevPage}
                >
                    Anterior
                </Button> 
            }
            { next !== 'pagos' && 
                <Button 
                    sx={{ 
						fontSize:'12px',
						color:'#fff', 
						padding:'5px 20px',
						bgcolor: 'secondary.main', 
						'&:hover': { bgcolor: 'secondary.dark' }
					}} 
                    variant="contained" 
                    color="success" 
                    onClick={VeficationData}
                >
                    Siguiente
                </Button> 
            }
			{ next === 'pagos' && 
                <Button 
                    sx={{ 
						fontSize:'12px', 
						color:'#fff', 
						padding:'5px 20px',
						bgcolor: 'secondary.main', 
						'&:hover': { bgcolor: 'secondary.dark' }
					}} 
                    variant="contained" 
                    color="success" 
                    onClick={SubirVehiculo}
                >
                    CREAR VEHICULO
                </Button> 
            }
            { error && 
				<Alerts message={errorText} alertOpen={error} setAlertOpen={setError} variant='error'/>
            }

			{ charge ? <Charge /> : false }
		
        </Box>

    )

}	


Botones.propTypes = {
    setNext: PropTypes.func.isRequired,
    next: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    dataDocuments: PropTypes.object.isRequired,
    dataEstado: PropTypes.object.isRequired,
    dataPagos: PropTypes.object.isRequired,
    dataImagenes: PropTypes.object.isRequired,
	setOpenNew: PropTypes.func.isRequired, 
	dataVeiculos: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired
}

export default Botones