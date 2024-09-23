import { Box, Typography, Button } from "@mui/material"
import { useState, useRef } from "react"
import * as XLSX from "xlsx"
import PropTypes from "prop-types"
import tool from '../../toolkit/toolkitCatastro'
import ChargeMessage from '../../components/Records/chargeMessage.jsx'

export default function Catastro({ setData, setSeleccion }) {
	const [fileNameCatastro, setFileNameCatastro] = useState("")
	const [combinedData, setCombinedData] = useState([])
	const fileInputRef = useRef(null)
	const [cargandoCatastro, setCargandoCatastro] = useState(false)
	
	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const handleFileChange = (event) => {
		const file = event.target.files[0]
		if (file) {
			setFileNameCatastro(file.name)
			readExcelFile(file)
		}
	}

	const transformData = (data) => {
		return data.map(item => {
			const valorCatastral = item.valorCatastral?.[0] || {}
			const tipoAdeudo = valorCatastral['tipo adeudo'] || ''
			const years = Object.keys(valorCatastral)
			.filter(key => key.startsWith('VAL CAT'))
			.map(key => {
				const year = parseInt(key.split(' ')[2], 10)
				return { year, value: parseFloat(valorCatastral[key]) }
			})
			.sort((a, b) => b.year - a.year)
			const catastroAdeudo = years.map(yearEntry => ({
				tipo_adeudo: tipoAdeudo,
				año_adeudo: yearEntry.year,
				adeudo: yearEntry.value
			}))
			const transformedData = {
			cuenta: item.cuenta || '',
			clave_catastral: item.clave_catastral || '',
			propietario: item.propietario || '',
			catastroTerreno: item.detallesTerreno?.map(terreno => ({
				superficie_terreno: parseFloat(terreno['SUPERFICIE TERRENO']) || 0,
				vus: parseFloat(terreno['VUS']) || 0,
				frente: parseFloat(terreno['FRENTE']) || 0,
				fondo: parseFloat(terreno['FONDO']) || 0,
				area_inscrita: parseFloat(terreno['AREA INSCRITA']) || 0,
				desnivel: parseFloat(terreno['DESNIVEL']) || 0,
				posicion: parseFloat(terreno['POSICION']) || 0,
				area_aprovechable: parseFloat(terreno['AREA APROVECHABLE']) || 0,
				f_frente: parseFloat(terreno['FFRENTE']) || 0,
				f_fondo: parseFloat(terreno['FFONDO']) || 0,
				f_irregularidad: parseFloat(terreno['FIRREGULARIDAD']) || 1.0,
				f_area: parseFloat(terreno['FAAREA']) || 0,
				f_topografia: parseFloat(terreno['FTOPOGRAFIA']) || 0,
				f_posicion: parseFloat(terreno['FPOSICION']) || 0,
				f_restriccion: parseFloat(terreno['FRESTRICCION']) || 0,
				factor_aplicado_terreno: parseFloat(terreno['F ACTOR APLICADO']) || 0,
				valor_terreno: parseFloat(terreno['VALOR TERRENO']) || 0
			})) || [],
			catastroConstruccion: item.detallesConstruccion?.map(construccion => ({
				unidad_constructiva: parseFloat(construccion['UNIDAD CONSTRUCTIVA']) || 0,
				tipologia_construccion: String(construccion['TIPOLOGIA CONSTRUCCION']) || 'N/A',
				uso: String(construccion['USO']) || 'N/A',
				clase_const: String(construccion['CLASE CONST']) || 'N/A',
				categ_const: parseFloat(construccion['CATEGCONST']) || 0,
				construccion_privativa: parseFloat(construccion['CONSTRUCCION PRIVATIVA']) || 0,
				construccion_comun: parseFloat(construccion['CONSTRUCCION COMUN']) || 0,
				construccion: parseFloat(construccion['CONSTRUCCION']) || 0,
				edad_construccion: parseFloat(construccion['EDAD CONSTRUCCION']) || 0,
				grado_conservacion: construccion['GRADO CONSERVACION'] || '',
				niveles: parseFloat(construccion['NIVELES']) || 0,
				f_edad: parseFloat(construccion['F EDAD']) || 0,
				f_conservacion: parseFloat(construccion['F CONSERVACION']) || 0,
				f_niveles: parseFloat(construccion['F NIVELES']) || 0,
				factor_aplicado_construccion: parseFloat(construccion['FACTOR APLICADO']) || 1.0,
				valor_construccion: parseFloat(construccion['VALOR CONSTRUCCION']) || 0
			})) || [],
			catastroAdeudo
			}
			return transformedData
		})
	}

	const readExcelFile = (file) => {
		const reader = new FileReader()
		
		reader.onload = (e) => {
			const data = new Uint8Array(e.target.result)
			const workbook = XLSX.read(data, { type: "array" })
			const allSheetsData = {}
			workbook.SheetNames.forEach((sheetName) => {
				const worksheet = workbook.Sheets[sheetName]
				const sheetData = XLSX.utils.sheet_to_json(worksheet)
				allSheetsData[sheetName] = sheetData
			})
			const combinedData = combineSheetData(allSheetsData)
			if (combinedData.length > 0) {
				const transformedData = transformData(combinedData)
				setCombinedData(transformedData)
			}
		}
		
		reader.readAsArrayBuffer(file)
	}

	const combineSheetData = (allSheetsData) => {
		const sheet1Data = allSheetsData['DEMERITOS_TERRENO'] || []
		const sheet2Data = allSheetsData['DEMERITOS CONSTRUCCION'] || []
		const sheet3Data = allSheetsData['VALOR CATASTRAL'] || []
		const combined = {}
		const addToCombinedFromSheet1 = (data) => {
			data.forEach((item) => {
				const cuenta = item['CUENTA'] ? item['CUENTA'].toString().trim() : ''
				if (cuenta) { 
					if (!combined[cuenta]) {
						combined[cuenta] = {
							cuenta,
							clave_catastral: item['CLAVE CATASTRAL'],
							propietario: item['PROPIETARIO'],
							detallesTerreno: [removeGlobalFields(item)]
						}
					} else {
						combined[cuenta].detallesTerreno.push(removeGlobalFields(item))
					}
				}
			})
		}
		const addToCombinedFromSheet2 = (data) => {
			data.forEach((item) => {
				const cuenta = item['CUENTA'] ? item['CUENTA'].toString().trim() : ''
				if (cuenta) {  
					if (!combined[cuenta]) {
						combined[cuenta] = {
							cuenta,
							clave_catastral: item['CLAVE CATASTRAL'],
							propietario: item['PROPIETARIO'],
							detallesConstruccion: [removeGlobalFields(item)]
						}
					} else {
						if (!combined[cuenta].detallesConstruccion) {
							combined[cuenta].detallesConstruccion = []
						}
						combined[cuenta].detallesConstruccion.push(removeGlobalFields(item))
					}
				}
			})
		}
		const addToCombinedFromSheet3 = (data) => {
			data.forEach((item) => {
				const cuenta = item['CUENTA'] ? item['CUENTA'].toString().trim() : ''
				if (cuenta) {
					if (!combined[cuenta]) {
						combined[cuenta] = {
							cuenta,
							clave_catastral: item['CLAVE CATASTRAL'],
							propietario: item['PROPIETARIO'],
							valorCatastral: [removeGlobalFields(item)]
						}
					} else {
						if (!combined[cuenta].valorCatastral) {
							combined[cuenta].valorCatastral = []
						}
						combined[cuenta].valorCatastral.push(removeGlobalFields(item))
					}
				}
			})
		}
		const removeGlobalFields = (item) => {
			// eslint-disable-next-line no-unused-vars
			const { CUENTA, 'CLAVE CATASTRAL': claveCatastral, PROPIETARIO, ...rest } = item
			return rest
		}
		addToCombinedFromSheet1(sheet1Data)	
		addToCombinedFromSheet2(sheet2Data)
		addToCombinedFromSheet3(sheet3Data)
		const dataFinal = Object.values(combined).filter(item => item.cuenta && item.cuenta.trim())
		return dataFinal
	}

	const actualizarCatastro = async () => {
		setCargandoCatastro(true)
		const cuentasEdicion = []
		const cuentasCreacion = []
		for (const item of combinedData) {
			try {
				const response = await tool.checkCuenta(item.cuenta)
				const isValid = response
				if (isValid) {
					cuentasEdicion.push(item)
				} else {
					cuentasCreacion.push(item)
				}
			} catch (error) {
				console.error(`Error al validar la cuenta ${item.cuenta}:`, error)
				cuentasCreacion.push(item)
			}
		}
		if (cuentasEdicion.length > 0) {
			for (const cuenta of cuentasEdicion) {
				try {
					await tool.editCuenta(cuenta)  
				} catch (error) {
					console.error(`Error al editar la cuenta ${cuenta.cuenta}:`, error)
				}
			}
		} else {
			console.error("No hay cuentas para editar.")
		}
		if (cuentasCreacion.length > 0) {
			for (const cuenta of cuentasCreacion) {
				try {
					await tool.addCuenta(cuenta) 
				} catch (error) {
					console.error(`Error al crear la cuenta ${cuenta.cuenta}:`, error)
				}
			}
		} else {
			console.error("No hay cuentas para crear.")
		}
		setCargandoCatastro(false)
	}

	return (
		
		<Box
			sx={{
				width: '100%',
				maxWidth: '700px',
				height: 'auto',
				background: 'rgb(31, 45, 64)',
				m: 'auto',
				mt: '30px',
				borderRadius: '10px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'start',
				padding: '15px'
			}}
		>

			<Box sx={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '18px' }}>

				<Typography sx={{ fontSize: '22px', fontWeight: '700' }}>Actualizar Catastro</Typography>
			
				<Typography sx={{ fontSize: '16px' }}>Inserta tu documento</Typography>

				<Button variant="contained" color="primary" onClick={handleButtonClick}>
					Seleccionar Archivo
				</Button>

				<input
					type="file"
					accept=".xls,.xlsx"
					ref={fileInputRef}
					onChange={handleFileChange}
					style={{ display: 'none' }}
				/>

				{fileNameCatastro && (
					<>
						<Typography sx={{ mt: '0px', color: 'rgb(76, 206, 172)', width: '100%', maxWidth: '200px', textAlign: 'center' }}>
							{fileNameCatastro}
						</Typography>

						<Typography sx={{ fontSize: '16px', fontWeight: '600', color: 'rgb(76, 206, 172)', mb: '10px' }}>
							Registros esperados: {combinedData.length}
						</Typography>

						<Button
							sx={{
								padding: '5px 20px',
								fontSize: '13px',
								fontWeight: '600',
								color: 'white',
								bgcolor: 'secondary.main',
								'&:hover': { bgcolor: 'secondary.dark' }
							}}
							onClick={() => actualizarCatastro()}
						>
							ACTUALIZAR CATASTRO
						</Button>
					</>
				)}

			</Box>

			<Box sx={{ width: '50%', height: '400px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', p: '20px', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'column', gap: '14px', overflowX: 'hidden' }}>
			
				{combinedData.length > 0 && (
					<>
						
						{combinedData
							.map((item, index) => (
								<Button
									onClick={() => (setData(true), setSeleccion(item))}
									key={index}
									sx={{
										m: '0px',
										p: '0px',
										color: '#fff',
										width: '100%',
										background: 'rgba(255,255,255,0.3)',
										'&:hover': {
											background: 'rgba(255,255,255,0.5)',
										},
									}}
								>
									Cuenta: {item.cuenta || 'Sin cuenta'}
								</Button>
							))
						}
					</>
				)}

			</Box>

			{cargandoCatastro && <ChargeMessage />}

		</Box>

	)
	
}

Catastro.propTypes = { 
	setData: PropTypes.func.isRequired,
	setSeleccion: PropTypes.func.isRequired
}