import { Box } from "@mui/material"
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useState, useEffect } from "react"
import InformacionGeneral from "./newVehiculo/informacionGeneral"
import Header from "./newVehiculo/header"
import Documentos from "./newVehiculo/documentos"
import Pagos from "./newVehiculo/pagos"
import Estado from "./newVehiculo/estado"
import Title from "./newVehiculo/title"
import Botones from "./newVehiculo/botones"
import { useSelector } from 'react-redux'

const slideIn = keyframes`
	from {
		transform: translateY(110%) scale(0);
		opacity: 0;
	}
	to {
		transform: translateY(0) scale(1);
		opacity: 1;
	}
`

const slideOut = keyframes`
	from {
		transform: translateY(0%) scale(1);
		opacity: 1;
	}
	to {
		transform: translateY(110%) scale(0);
		opacity: 0;
	}
`

const AnimatedBox = styled(Box)`
	animation: ${props => props.animation ? slideOut : slideIn} 710ms ease-out;
`

const NewVehiculo = ({ setOpenNew, setAlertClean }) => {
	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'
	const [animation, setAnimation] = useState(false)
	const [next, setNext] = useState('')
	const informacionGeneral = useSelector(state => state.informacionGeneral)
	const documentos = useSelector(state => state.documentos)
	const estado = useSelector(state => state.estado)
	const imagenesEstado = useSelector(state => state.imagenesEstado)
	const pagosVerificacion = useSelector(state => state.pagosVerificacion)
	const pagosTenencia = useSelector(state => state.pagosTenencia)
	const pagosPlacas = useSelector(state => state.pagosPlacas)
	const pagosExtraordinarios = useSelector(state => state.pagosExtraordinarios)

	useEffect(() => {
		if (animation) {	
			const timer = setTimeout(() => {
				setOpenNew(false)
				setAlertClean(true)
			}, 700)
			return () => clearTimeout(timer)
		}
	}, [animation, setOpenNew, setAlertClean])

	const data = {
		kilometraje: informacionGeneral.kilometraje,
		selectedPlace: informacionGeneral.selectedPlace,
		image: informacionGeneral.image,
		modelo: informacionGeneral.modelo,
		placa: informacionGeneral.placa,
		vehiculo: informacionGeneral.vehiculo,
		marca: informacionGeneral.marca,
		serie: informacionGeneral.serie,
		color: informacionGeneral.color,
		colorLlavero: informacionGeneral.colorLlavero,
		tipoMotor: informacionGeneral.tipoMotor
	}

	const dataDocuments = {
		tarjetaCirculacion: documentos.tarjetaCirculacion,
		factura: documentos.factura,
		seguro: documentos.seguro,
		garantia: documentos.garantia,
		frente: documentos.frente,
		trasera: documentos.trasera,
		ladoIzquierdo: documentos.ladoIzquierdo,
		ladoDerecho: documentos.ladoDerecho,
	}

	const dataEstado = {
		combustible: estado.combustible,
		bateria: estado.bateria,
		neumaticos: estado.neumaticos,
		observaciones: estado.observaciones,
		fugaAceite: estado.fugaAceite,
		fugaCombustible: estado.fugaCombustible,
		fugaAceiteMotor: estado.fugaAceiteMotor,
		direccionalesDelanteras: estado.direccionalesDelanteras,
		direccionalesTraseras: estado.direccionalesTraseras,
		lucesTablero: estado.lucesTablero,
		luzFreno: estado.luzFreno,
		llantaDelantera: estado.llantaDelantera,
		llantaTrasera: estado.llantaTrasera,
		deformaciones: estado.deformacionesLlanta,
		encendido: estado.encendido,
		tension: estado.tensionCadena,
		frenoDelantero: estado.frenoDelantero,
		frenoTrasero: estado.frenoTrasero,
		amortiguadores: estado.amortiguadores,
		direccion: estado.direccion,
		silla: estado.silla,
		espejos: estado.espejos,
		velocimetro: estado.velocimetro,
		claxon: estado.claxon,
		escalapies: estado.palancas
	}

	const dataImagenes = {
		imagenesFugaAceite: imagenesEstado.imagenesFugaAceite,
		imagenesFugaCombustible: imagenesEstado.imagenesFugaCombustible,
		imagenesFugaAceiteMotor: imagenesEstado.imagenesFugaAceiteMotor,
		imagenesDireccionalesDelanteras: imagenesEstado.imagenesDireccionalesDelanteras,
		imagenesDireccionalesTraseras: imagenesEstado.imagenesDireccionalesTraseras,
		imagenesLucesTablero: imagenesEstado.imagenesLucesTablero,
		imagenesLuzFreno: imagenesEstado.imagenesLuzFreno,
		imagenesLlantaDelantera: imagenesEstado.imagenesLlantaDelantera,
		imagenesLlantaTrasera: imagenesEstado.imagenesLlantaTrasera,
		imagenesDeformacionesLlanta: imagenesEstado.imagenesDeformacionesLlanta,
		imagenesEncendido: imagenesEstado.imagenesEncendido,
		imagenesTensionCadena: imagenesEstado.imagenesTensionCadena,
		imagenesFrenoDelantero: imagenesEstado.imagenesFrenoDelantero,
		imagenesFrenoTrasero: imagenesEstado.imagenesFrenoTrasero,
		imagenesAmortiguadores: imagenesEstado.imagenesAmortiguadores,
		imagenesSilla: imagenesEstado.imagenesSilla,
		imagenesEspejos: imagenesEstado.imagenesEspejos,
		imagenesVelocimetro: imagenesEstado.imagenesVelocimetro,
		imagenesClaxon: imagenesEstado.imagenesClaxon,
		imagenesPalancas: imagenesEstado.imagenesPalancas,
	}

	const dataPagos = {
		pagosVerificacion: pagosVerificacion.pagosVerificacion,
		pagosExtraordinarios: pagosExtraordinarios.pagosExtraordinarios,
		pagosTenencia: pagosTenencia.pagosTenencia,
		pagosPlacas: pagosPlacas.pagosPlacas,
	}

	return (

		<Box 
			sx={{
				width: '100%',
				position: 'fixed',
				top: '0',
				left: '0',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				background: 'rgba(0,0,0,0.3)',
				zIndex: '1200'
			}}
		>
			<AnimatedBox 
				animation={animation}
				sx={{
					width: '90%',
					height: '90%',
					background: isLightMode ? '#fff' : '#17212F',
					borderRadius: '20px',
					display: 'flex',
					justifyContent: 'start',
					alignItems: 'center',
					flexDirection:'column',
					padding: '30px',
					border: isLightMode ? '1px solid #17212F' : '2px solid #fff',
					overflow:'scroll'
				}}
			>

				<Title setAnimation={setAnimation}/>

				<Box sx={{ mt:'20px', mb:'50px', width:'100%' }}>
					
					<Header next={next} />

					<Botones 
						next={next} data={data} dataDocuments={dataDocuments} dataEstado={dataEstado} dataImagenes={dataImagenes} dataPagos={dataPagos}
						setNext={setNext} 
					/>
					
					{
						next === 'documentos' ? 
							<Documentos/>
						: next === 'estado' ?
							<Estado/> 
						: next === 'pagos' ?
							<Pagos/>
						:
							<InformacionGeneral /> 	
					}
					
				</Box>

			</AnimatedBox>
		
		</Box>
	
	)

}

NewVehiculo.propTypes = {
	setOpenNew: PropTypes.func.isRequired, 
	setAlertClean: PropTypes.func.isRequired,
	openNew: PropTypes.bool.isRequired, 
}

export default NewVehiculo