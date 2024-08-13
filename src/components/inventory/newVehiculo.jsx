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

const NewVehiculo = ({ setOpenNew, setAlertClean, dataVeiculos, setAlert }) => {
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
		plaza: informacionGeneral.selectedPlace,
		modelo: informacionGeneral.modelo,
		placa: informacionGeneral.placa,
		vehiculo: informacionGeneral.vehiculo,
		marca: informacionGeneral.marca,
		serie: informacionGeneral.serie,
		color: informacionGeneral.color,
		color_llavero: informacionGeneral.colorLlavero,
		tipo_motor: informacionGeneral.tipoMotor,
		imagen: informacionGeneral.image,
		id_usuario: 1
	}

	const dataDocuments = {
		tarjetaCirculacion: documentos.tarjetaCirculacion,
		factura: documentos.factura,
		seguro: documentos.seguro,
		garantia: documentos.garantia,
		frente: documentos.frente,
		trasera: documentos.trasera,
		ladoIzquierdo: documentos.ladoIzquierdo,
		ladoDerecho: documentos.ladoDerecho
	}

	const dataEstado = {
		combustible: estado.combustible,
		bateria: estado.bateria,
		neumaticos: estado.neumaticos,
		observaciones: estado.observaciones,
		fuga_aceite: estado.fugaAceite,
		fuga_combustible: estado.fugaCombustible,
		fuga_aceite_motor: estado.fugaAceiteMotor,
		direccionales_delanteras: estado.direccionalesDelanteras,
		direccionales_traseras: estado.direccionalesTraseras,
		luces_tablero: estado.lucesTablero,
		luz_freno: estado.luzFreno,
		llanta_delantera: estado.llantaDelantera,
		llanta_trasera: estado.llantaTrasera,
		deformaciones_llanta: estado.deformacionesLlanta,
		encendido: estado.encendido,
		tension_cadena: estado.tensionCadena,
		freno_delantero: estado.frenoDelantero,
		freno_trasero: estado.frenoTrasero,
		amortiguadores: estado.amortiguadores,
		direccion: estado.direccion,
		silla: estado.silla,
		espejos: estado.espejos,
		velocimetro: estado.velocimetro,
		claxon: estado.claxon,
		palancas: estado.palancas
	}

	const dataImagenes = {
		fugaAceite: imagenesEstado.imagenesFugaAceite,
		fugaCombustible: imagenesEstado.imagenesFugaCombustible,
		fugaMotor: imagenesEstado.imagenesFugaAceiteMotor,
		direccionalesDelanteras: imagenesEstado.imagenesDireccionalesDelanteras,
		direccionalesTraseras: imagenesEstado.imagenesDireccionalesTraseras,
		direccion: imagenesEstado.imagenesDireccion,
		luces: imagenesEstado.imagenesLucesTablero,
		luz: imagenesEstado.imagenesLuzFreno,
		llantaDelantera: imagenesEstado.imagenesLlantaDelantera,
		llantaTrasera: imagenesEstado.imagenesLlantaTrasera,
		deformaciones: imagenesEstado.imagenesDeformacionesLlanta,
		encendido: imagenesEstado.imagenesEncendido,
		cadena: imagenesEstado.imagenesTensionCadena,
		frenoDelantero: imagenesEstado.imagenesFrenoDelantero,
		frenoTrasero: imagenesEstado.imagenesFrenoTrasero,
		amortiguadores: imagenesEstado.imagenesAmortiguadores,
		silla: imagenesEstado.imagenesSilla,
		espejos: imagenesEstado.imagenesEspejos,
		velocimetro: imagenesEstado.imagenesVelocimetro,
		claxon: imagenesEstado.imagenesClaxon,
		palancas: imagenesEstado.imagenesPalancas,
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
						setNext={setNext} setOpenNew={setOpenNew} dataVeiculos={dataVeiculos} setAlert={setAlert}
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
	dataVeiculos: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired
}

export default NewVehiculo