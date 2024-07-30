import { Box, Typography } from "@mui/material"
import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNombreTarjetaCirculacion, setNombreFactura, setNombreGarantia, setNombreSeguro, setTarjetaCirculacion, setFactura, setGarantia, setSeguro, setFrente, setTrasera, setLadoDerecho, setLadoIzquierdo, setPreviewLadoIzquierdo, setPreviewFrente, setPreviewTrasera, setPreviewLadoDerecho  } from '../../../redux/vehiculosSlices/documentosSlice.js'
import { setErrorTarjetaCirculacion, setErrorFactura, setErrorGarantia, setErrorSeguro, setErrorFrente, setErrorTrasera, setErrorLadoDerecho, setErrorLadoIzquierdo } from '../../../redux/vehiculosSlices/documentosErrorsSlice.js'
import DocumentoIndividual from "./documentoIndividual.jsx"
import ImageIndividual from "./imagenIndividual.jsx"

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

	const handleFileChange = (e, po, pf) => {
		const file = e.target.files[0]
		if (file) {
			dispatch(po(file.name))
			dispatch(pf(file))
		}
	}

	const handleFileChangeImage = (e, pf, previewAction) => {
		const file = e.target.files[0]
		if (file) {
			dispatch(pf(file))
			const reader = new FileReader()
			reader.onloadend = () => {
				dispatch(previewAction(reader.result))
			}
			reader.readAsDataURL(file)
		}
	}

	const handleClick = (type) => {
		fileInputRef.current[type].click()
	}

	return (

		<Box sx={{ width: '100%', height: 'auto' }}>

			<Typography sx={{ fontSize: '24px', width: '100%', textAlign: 'start', mb: '20px', mt: '40px', textTransform: 'uppercase' }}>Documentos</Typography>

			<Box sx={{ width: '100%', height: 'auto',  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
		
				<DocumentoIndividual
					label="Tarjeta de circulación"
					onClick={() => handleClick('tarjetaCirculacion')}
					fileRef={(el) => (fileInputRef.current.tarjetaCirculacion = el)}
					onChange={(e) => { handleFileChange(e, setNombreTarjetaCirculacion, setTarjetaCirculacion); dispatch(setErrorTarjetaCirculacion(false)); }}
					nombreDocumento={documentos.nombreTarjetaCirculacion}
					error={documentosErrors.errorTarjetaCirculacion}
				/>

				<DocumentoIndividual
					label="Factura"
					onClick={() => handleClick('factura')}
					fileRef={(el) => (fileInputRef.current.factura = el)}
					onChange={(e) => { handleFileChange(e, setNombreFactura, setFactura); dispatch(setErrorFactura(false)); }}
					nombreDocumento={documentos.nombreFactura}
					error={documentosErrors.errorFactura}
				/>

				<DocumentoIndividual
					label="Seguro"
					onClick={() => handleClick('seguro')}
					fileRef={(el) => (fileInputRef.current.seguro = el)}
					onChange={(e) => { handleFileChange(e, setNombreSeguro, setSeguro); dispatch(setErrorSeguro(false)); }}
					nombreDocumento={documentos.nombreSeguro}
					error={documentosErrors.errorSeguro}
				/>
				
				<DocumentoIndividual
					label="Garantía"
					onClick={() => handleClick('garantia')}
					fileRef={(el) => (fileInputRef.current.garantia = el)}
					onChange={(e) => { handleFileChange(e, setNombreGarantia, setGarantia); dispatch(setErrorGarantia(false)); }}
					nombreDocumento={documentos.nombreGarantia}
					error={documentosErrors.errorGarantia}
				/>

			</Box>

			<Typography sx={{ fontSize: '24px', width: '100%', textAlign: 'start', mb: '20px', mt: '40px', textTransform: 'uppercase' }}>Imagenes</Typography>

			<Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>

				<ImageIndividual
					label="Frente"
					onClick={() => handleClick('frente')}
					fileRef={(el) => (fileInputRef.current.frente = el)}
					onChange={(e) => { handleFileChangeImage(e, setFrente, setPreviewFrente); dispatch(setErrorFrente(false)); }}
					preview={documentos.previewFrente}
					error={documentosErrors.errorFrente}
				/>

				<ImageIndividual
					label="Trasera"
					onClick={() => handleClick('trasera')}
					fileRef={(el) => (fileInputRef.current.trasera = el)}
					onChange={(e) => { handleFileChangeImage(e, setTrasera, setPreviewTrasera); dispatch(setErrorTrasera(false)); }}
					preview={documentos.previewTrasera}
					error={documentosErrors.errorTrasera}
				/>

				<ImageIndividual
					label="Lado derecho"
					onClick={() => handleClick('ladoDerecho')}
					fileRef={(el) => (fileInputRef.current.ladoDerecho = el)}
					onChange={(e) => { handleFileChangeImage(e, setLadoDerecho, setPreviewLadoDerecho); dispatch(setErrorLadoDerecho(false)); }}
					preview={documentos.previewLadoDerecho}
					error={documentosErrors.errorLadoDerecho}
				/>

				<ImageIndividual
					label="Lado izquierdo"
					onClick={() => handleClick('ladoIzquierdo')}
					fileRef={(el) => (fileInputRef.current.ladoIzquierdo = el)}
					onChange={(e) => { handleFileChangeImage(e, setLadoIzquierdo, setPreviewLadoIzquierdo); dispatch(setErrorLadoIzquierdo(false)); }}
					preview={documentos.previewLadoIzquierdo}
					error={documentosErrors.errorLadoIzquierdo}
				/>

			</Box>

		</Box>

	)

}

export default Documentos