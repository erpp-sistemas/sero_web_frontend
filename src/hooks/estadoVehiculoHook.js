import { setImagenFugaAceite, setImagenFugaCombustible, setImagenFugaAceiteMotor, setImagenDireccionalesDelanteras, setImagenDireccionalesTraseras, 
	setImagenLuzFreno, setImagenLucesTablero, setImagenLlantaDelantera, setImagenLlantaTrasera, setImagenDeformacionesLlanta, setImagenEncendido, setImagenTensionCadena, 
	setImagenFrenoDelantero, setImagenFrenoTrasero, setImagenAmortiguadores, setImagenDireccion, setImagenSilla, setImagenEspejos, setImagenVelocimetro, setImagenClaxon, setImagenPalancas
} from '../redux/vehiculosSlices/imagenesEstadoSlice.js'
import { setEncendido, setTensionCadena, setFrenoDelantero, setFrenoTrasero, setAmortiguadores, setDireccion, setSilla, setEspejos, setVelocimetro, setClaxon, setPalancas,
	setFugaAceiteMotor, setFugaCombustible, setFugaAceite, setDireccionalesDelanteras, setDireccionalesTraseras, 
	setLucesTablero, setLuzFreno, setLlantaDelantera, setLlantaTrasera, setDeformacionesLlanta
} from '../redux/vehiculosSlices/estadoSlice.js'
import { setComentarioAmortiguadores, setComentarioClaxon, setComentarioDeformacionesLlanta, setComentarioDireccion, setComentarioDireccionalesDelanteras, setComentarioDireccionalesTraseras, setComentarioEncendido,
	setComentarioEspejos, setComentarioFrenoDelantero, setComentarioFrenoTrasero, setComentarioFugaAceite, setComentarioFugaAceiteMotor, setComentarioFugaCombustible, setComentarioLlantaDelantera,
	setComentarioLlantaTrasera, setComentarioLucesTablero, setComentarioLuzFreno, setComentarioPalancas, setComentarioSilla, setComentarioTensionCadena, setComentarioVelocimetro
} from '../redux/vehiculosSlices/comentariosSlice.js'

export const tiposPagos = [
	{ tipo: 'pagosExtraordinarios', metodo: 'actualizarExtraordinarios', label: 'Pago Extraordinario' },
	{ tipo: 'pagosPlacas', metodo: 'actualizarPlacas', label: 'Pago Placas' },
	{ tipo: 'pagosTenencia', metodo: 'actualizarTenencia', label: 'Pago Tenencia' },
	{ tipo: 'pagosVerificacion', metodo: 'actualizarVerificacion', label: 'Pago Verificacion' },
]

export const docs = ['tarjetaCirculacion', 'factura', 'seguro', 'garantia', 'frente', 'trasera', 'ladoIzquierdo', 'ladoDerecho']

export const imagenesMap = {
	fugaAceite: 'imagenesFugaAceite',
	fugaCombustible: 'imagenesFugaCombustible',
	fugaAceiteMotor: 'imagenesFugaAceiteMotor',
	direccionalesDelanteras: 'imagenesDireccionalesDelanteras',
	direccionalesTraseras: 'imagenesDireccionalesTraseras',
	lucesTablero: 'imagenesLucesTablero',
	luzFreno: 'imagenesLuzFreno',
	llantaDelantera: 'imagenesLlantaDelantera',
	llantaTrasera: 'imagenesLlantaTrasera',
	deformacionesLlanta: 'imagenesDeformacionesLlanta',
	encendido: 'imagenesEncendido',
	tensionCadena: 'imagenesTensionCadena',
	frenoDelantero: 'imagenesFrenoDelantero',
	frenoTrasero: 'imagenesFrenoTrasero',
	amortiguadores: 'imagenesAmortiguadores',
	direccion: 'imagenesDireccion',
	silla: 'imagenesSilla',
	espejos: 'imagenesEspejos',
	velocimetro: 'imagenesVelocimetro',
	claxon: 'imagenesClaxon',
	palancas: 'imagenesPalancas',
}

export const dispatchMap = {
	fugaAceite: setImagenFugaAceite,
	fugaCombustible: setImagenFugaCombustible,
	fugaAceiteMotor: setImagenFugaAceiteMotor,
	direccionalesDelanteras: setImagenDireccionalesDelanteras,
	direccionalesTraseras: setImagenDireccionalesTraseras,
	lucesTablero: setImagenLucesTablero,
	luzFreno: setImagenLuzFreno,
	llantaDelantera: setImagenLlantaDelantera,
	llantaTrasera: setImagenLlantaTrasera,
	deformacionesLlanta: setImagenDeformacionesLlanta,
	encendido: setImagenEncendido,
	tensionCadena: setImagenTensionCadena,
	frenoDelantero: setImagenFrenoDelantero,
	frenoTrasero: setImagenFrenoTrasero,
	amortiguadores: setImagenAmortiguadores,
	direccion: setImagenDireccion,
	silla: setImagenSilla,
	espejos: setImagenEspejos,
	velocimetro: setImagenVelocimetro,
	claxon: setImagenClaxon,
	palancas: setImagenPalancas
}

export const opcionesMecanicas = [
	{ nombre: 'ENCENDIDO', variable: 'encendido', set: setEncendido, setImagen: setImagenEncendido, comentario:'comentarioEncendido', setComentario: setComentarioEncendido  },
	{ nombre: 'TENSION EN LA CADENA', variable: 'tensionCadena', set: setTensionCadena, setImagen: setImagenTensionCadena, comentario:'comentarioTensionCadena', setComentario: setComentarioTensionCadena },
	{ nombre: 'FRENO DELANTERO', variable: 'frenoDelantero', set: setFrenoDelantero, setImagen: setImagenFrenoDelantero, comentario:'comentarioFrenoDelantero', setComentario: setComentarioFrenoDelantero },
	{ nombre: 'FRENO TRASERO', variable: 'frenoTrasero', set: setFrenoTrasero, setImagen: setImagenFrenoTrasero, comentario:'comentarioFrenoTrasero', setComentario: setComentarioFrenoTrasero },
	{ nombre: 'AMORTIGUADORES', variable: 'amortiguadores', set: setAmortiguadores, setImagen: setImagenAmortiguadores, comentario:'comentarioAmoritguadores', setComentario: setComentarioAmortiguadores },
	{ nombre: 'FUNCIONAMIENTO DIRECCION', variable: 'direccion', set: setDireccion, setImagen: setImagenDireccion, comentario:'comentarioDireccion', setComentario: setComentarioDireccion },
]

export const opcionesAdicionales = [
	{ nombre: 'SILLA DE CONDUCTOR', variable: 'silla', set: setSilla, setImagen: setImagenSilla, comentario:'comentarioSilla', setComentario: setComentarioSilla },
	{ nombre: 'ESPEJOS LATERALES', variable: 'espejos', set: setEspejos, setImagen: setImagenEspejos, comentario:'comentarioEspejos', setComentario: setComentarioEspejos },
	{ nombre: 'INDICADOR DE VELOCIDAD', variable: 'velocimetro', set: setVelocimetro, setImagen: setImagenVelocimetro, comentario:'comentarioVelocimetro', setComentario: setComentarioVelocimetro },
	{ nombre: 'CLAXÓN', variable: 'claxon', set: setClaxon, setImagen: setImagenClaxon, comentario:'comentarioClaxon', setComentario: setComentarioClaxon },
	{ nombre: 'ESCALAPIES Y PALANCAS', variable: 'palancas', set: setPalancas, setImagen: setImagenPalancas, comentario:'comentarioPalancas', setComentario: setComentarioPalancas },
]

export const opcionesLiquidos = [
	{ nombre: 'FUGA DE ACEITE GENERAL', variable: 'fugaAceite', set: setFugaAceite, setImagen: setImagenFugaAceite, comentario:'comentarioFugaAceite', setComentario: setComentarioFugaAceite },
	{ nombre: 'FUGA DE COMBUSTIBLE', variable: 'fugaCombustible', set: setFugaCombustible, setImagen: setImagenFugaCombustible, comentario:'comentarioFugaCombustible', setComentario: setComentarioFugaCombustible },
	{ nombre: 'FUGA DE ACEITE EN MOTOR', variable: 'fugaAceiteMotor', set: setFugaAceiteMotor, setImagen: setImagenFugaAceiteMotor, comentario:'comentarioFugaAceiteMotor', setComentario: setComentarioFugaAceiteMotor },
]

export const opcionesLuces = [
	{ nombre: 'DIRECCIONALES DELANTERAS', variable: 'direccionalesDelanteras', set: setDireccionalesDelanteras, setImagen: setImagenDireccionalesDelanteras, comentario:'comentarioDireccionalesDelanteras', setComentario: setComentarioDireccionalesDelanteras },
	{ nombre: 'DIRECCIONALES TRASERAS', variable: 'direccionalesTraseras', set: setDireccionalesTraseras, setImagen: setImagenDireccionalesTraseras, comentario:'comentarioDireccionalesTraseras', setComentario: setComentarioDireccionalesTraseras },
	{ nombre: 'LUCES DEL TABLERO', variable: 'lucesTablero', set: setLucesTablero, setImagen: setImagenLucesTablero, comentario:'comentarioLucesTablero', setComentario: setComentarioLucesTablero },
	{ nombre: 'LUZ DE FRENO', variable: 'luzFreno', set: setLuzFreno, setImagen: setImagenLuzFreno, comentario:'comentarioLuzFreno', setComentario: setComentarioLuzFreno },
]

export const opcionesLlantas = [
	{ nombre: 'DELANTERA', variable: 'llantaDelantera', set: setLlantaDelantera, setImagen: setImagenLlantaDelantera, comentario:'comentarioLlantaDelantera', setComentario: setComentarioLlantaDelantera },
	{ nombre: 'TRASERA', variable: 'llantaTrasera', set: setLlantaTrasera, setImagen: setImagenLlantaTrasera, comentario:'comentarioLlantaTrasera', setComentario: setComentarioLlantaTrasera },
	{ nombre: 'DEFORMACION EN LLANTAS', variable: 'deformacionesLlanta', set: setDeformacionesLlanta, setImagen: setImagenDeformacionesLlanta, comentario:'comentarioDeformacionesLlanta', setComentario: setComentarioDeformacionesLlanta },
]

export const opcionesPagos = [
	{ nombre: 'VERIFICACION', variable: 'llantaDelantera', set: setLlantaDelantera, setImagen: setImagenLlantaDelantera,  },
	{ nombre: 'TENENCIA', variable: 'llantaTrasera', set: setLlantaTrasera, setImagen: setImagenLlantaTrasera },
	{ nombre: 'PAGOS EXTRAORDINARIOS', variable: 'deformacionesLlanta', set: setDeformacionesLlanta, setImagen: setImagenDeformacionesLlanta },
]

export const Meses = [
	'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]