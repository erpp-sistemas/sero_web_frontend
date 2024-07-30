import { Box, Button } from "@mui/material"
import PropTypes from 'prop-types'
import { useState } from "react"
import Alerts from '../../../components/Alerts'
import { setErrorKilometraje, setErrorSelectedPlace, setErrorImage, setErrorModelo, setErrorVehiculo, setErrorMarca, setErrorColor, setErrorColorLlavero, setErrorSerie, setErrorTipoMotor, setErrorPlaca } from '../../../redux/vehiculosSlices/informacionGeneralErrorsSlice.js'
import { setErrorFactura, setErrorGarantia, setErrorSeguro, setErrorTarjetaCirculacion, setErrorLadoDerecho, setErrorLadoIzquierdo, setErrorFrente, setErrorTrasera } from '../../../redux/vehiculosSlices/documentosErrorsSlice.js'
import { setErrorCombustible, setErrorBateria, setErrorNeumatico } from '../../../redux/vehiculosSlices/estadoErrorsSlice.js'
import { useDispatch } from 'react-redux'
import toolkitVehiculos from "../../../toolkit/toolkitVehiculos.js"

const Botones = ({ next, setNext, data, dataDocuments, dataEstado, dataPagos, dataImagenes }) => {
    const [errorText, setErrorText] = useState('')
    const [error, setError] = useState(false)
	const dispatch = useDispatch()

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

	const SubirVehiculo = async () => {
		try {
			const respuesta = await toolkitVehiculos.generateVehiculo(data)
			console.log(respuesta)
		} catch (error) {
			console.error('Error fetching data:', error)
		}
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
                    sx={{ fontSize:'12px', color:'#fff', padding:'5px 20px'}} 
                    variant="contained" 
                    color="success" 
                    onClick={VeficationData}
                >
                    Siguiente
                </Button> 
            }
			{ next === 'pagos' && 
                <Button 
                    sx={{ fontSize:'12px', color:'#fff', padding:'5px 20px'}} 
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
}

export default Botones