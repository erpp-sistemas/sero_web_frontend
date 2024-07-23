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

	// ESTADO INICIAL DE VEHICULO
	const [combustible, setCombustible] = useState('')
	const [bateria, setBateria] = useState(null)
	const [neumaticos, setNeumaticos] = useState('')
	const [observaciones, setObservaciones] = useState('')
	const [aceite, setAceite] = useState(false)
	const [fugaCombustible, setFugaCombustible] = useState(false)
	const [fugaAceite, setFugaAceite] = useState(false)
	const [direccionalesDelanteras, setDireccionalesDelanteras] = useState(false)
	const [direccionalesTraseras, setDireccionalesTraseras] = useState(false)
	const [lucesTablero, setLucesTablero] = useState(false)
	const [luzFreno, setLuzFreno] = useState(false)
	const [llantaDelantera, setLlantaDelantera] = useState(false)
	const [llantaTrasera, setLlantaTrasera] = useState(false)
	const [deformaciones, setDeformaciones] = useState(false)
	const [encendido, setEncendido] = useState(false)
	const [tension, setTension] = useState(false)
	const [frenoDelantero, setFrenoDelantero] = useState(false)
	const [frenoTrasero, setFrenoTrasero] = useState(false)
	const [amortiguadores, setAmortiguadores] = useState(false)
	const [direccion, setDireccion] = useState(false)
	const [silla, setSilla] = useState(false)
	const [espejos, setEspejos] = useState(false)
	const [velocimetro, setVelocimetro] = useState(false)
	const [claxon, setClaxon] = useState(false)
	const [escalapies, setEscalapies] = useState(false)

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

	const dataEstadoInicial = {
		combustible: combustible,
		bateria: bateria,
		neumaticos: neumaticos,
		observaciones: observaciones,
		aceite: aceite,
		fugaCombustible: fugaCombustible,
		fugaAceite: fugaAceite,
		direccionalesDelanteras: direccionalesDelanteras,
		direccionalesTraseras: direccionalesTraseras,
		lucesTablero: lucesTablero,
		luzFreno: luzFreno,
		llantaDelantera: llantaDelantera,
		llantaTrasera: llantaTrasera,
		deformaciones: deformaciones,
		encendido: encendido,
		tension: tension,
		frenoDelantero: frenoDelantero,
		frenoTrasero: frenoTrasero,
		amortiguadores: amortiguadores,
		direccion: direccion,
		silla: silla,
		espejos: espejos,
		velocimetro: velocimetro,
		claxon: claxon,
		escalapies: escalapies
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
						next={next} data={data} dataDocuments={dataDocuments} dataEstadoInicial={dataEstadoInicial}
						setNext={setNext} 
					/>
					
					{
						next === 'documentos' ? 
							<Documentos
								setNext={setNext} 
							/>
						: next === 'estado' ?
							<Estado
								setNext={setNext} setCombustible={setCombustible} setBateria={setBateria} setNeumaticos={setNeumaticos} setObservaciones={setObservaciones} setAceite={setAceite} setFugaCombustible={setFugaCombustible} setFugaAceite={setFugaAceite} setDireccionalesDelanteras={setDireccionalesDelanteras} setDireccionalesTraseras={setDireccionalesTraseras} setLucesTablero={setLucesTablero} setLuzFreno={setLuzFreno} setLlantaDelantera={setLlantaDelantera} setLlantaTrasera={setLlantaTrasera}
								setDeformaciones={setDeformaciones} setEncendido={setEncendido} setTension={setTension} setFrenoDelantero={setFrenoDelantero} setFrenoTrasero={setFrenoTrasero} setAmortiguadores={setAmortiguadores} setDireccion={setDireccion} setSilla={setSilla} setEspejos={setEspejos} setVelocimetro={setVelocimetro} setClaxon={setClaxon} setEscalapies={setEscalapies}
								combustible={combustible} bateria={bateria} neumaticos={neumaticos} observaciones={observaciones} aceite={aceite} fugaCombustible={fugaCombustible}	fugaAceite={fugaAceite} direccionalesDelanteras={direccionalesDelanteras} direccionalesTraseras={direccionalesTraseras} lucesTablero={lucesTablero} luzFreno={luzFreno} llantaDelantera={llantaDelantera} llantaTrasera={llantaTrasera}
								deformaciones={deformaciones} encendido={encendido} tension={tension} frenoDelantero={frenoDelantero} frenoTrasero={frenoTrasero} amortiguadores={amortiguadores} direccion={direccion} silla={silla} espejos={espejos} velocimetro={velocimetro} claxon={claxon} escalapies={escalapies}
							/> 
						: next === 'pagos' ?
							<Pagos
								setNext={setNext}	
							/>
						:
							<InformacionGeneral 
								next={next} setNext={setNext}
							/> 	
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