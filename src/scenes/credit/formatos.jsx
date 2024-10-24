import { Box, Typography, Button } from "@mui/material"
import { useState, useRef } from "react"
import * as XLSX from "xlsx"
import PropTypes from "prop-types"
import tool from '../../toolkit/toolkitCatastro'
import ChargeMessage from '../../components/Records/chargeMessage.jsx'

export default function Formatos({ setPreview, setSeleccionFormato, setOpenConfirmation, validAccounts, setValidAccounts, invalidAccounts, setInvalidAccounts, fileName, setFileName }) {

    const fileInputRef = useRef(null)
    const [openFormatos, setOpenFormatos] = useState(false)

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setFileName(file.name)
            readExcelFile(file)
        }
    }

	const readExcelFile = (file) => {
		setOpenFormatos(true)
		const reader = new FileReader()
		reader.onload = async (e) => {
			try {
			const data = new Uint8Array(e.target.result)
			const workbook = XLSX.read(data, { type: "array" })
			const worksheet = workbook.Sheets[workbook.SheetNames[0]]
			const json = XLSX.utils.sheet_to_json(worksheet)
			const accountChecks = json.map(async (row) => {
				const account = row.cuentas || row.Account || 'Cuenta desconocida'
				const isValid = await tool.checkCuenta(account)
				return { ...row, isValid }
			})
			const results = await Promise.all(accountChecks)
			const validRows = results.filter(row => row.isValid)
			const invalidRows = results.filter(row => !row.isValid)
			setValidAccounts(validRows)
			setInvalidAccounts(invalidRows)
			const updatedValidRows = await Promise.all(
				validRows.map(async (item) => {
				try {
					const response = await tool.getCuenta(item.cuentas)
					let accountData = response.data
					accountData.catastroCentral = Array.isArray(accountData.catastroCentral) ? accountData.catastroCentral : [accountData.catastroCentral]
					accountData.catastroConstruccion = Array.isArray(accountData.catastroConstruccion) ? accountData.catastroConstruccion : [accountData.catastroConstruccion]
					accountData.catastroTerreno = Array.isArray(accountData.catastroTerreno) ? accountData.catastroTerreno : [accountData.catastroTerreno]
					accountData.catastroAdeudo = Array.isArray(accountData.catastroAdeudo) ? accountData.catastroAdeudo : [accountData.catastroAdeudo]

					const transformedData = {
						cuentas: item.cuentas,
						altura: '1',
						año_final: item.año_final,
						año_inicio: item.año_inicio,
						bimestre_final: item.bimestre_final,
						bimestre_inicio: item.bimestre_incio,
						folio: item.expediente,
						notificacion: item.notificacion,
						ejecucion: item.ejecucion,
						clave_catastral: accountData.catastroCentral[0].clave_catastral,
						domicilio: accountData.catastroCentral[0].direccion,
						nombre: accountData.catastroCentral[0].propietario,
						terreno: accountData.catastroTerreno,
						construccion: accountData.catastroConstruccion,
						adeudo: accountData.catastroAdeudo
					}

					return transformedData 
				} catch (error) {
					console.error(`Error al obtener datos de la cuenta ${item.cuentas}:`, error)
					return item
				}
				})
			)
			setValidAccounts(updatedValidRows)
			} catch (error) {
				console.error("Error al leer el archivo Excel:", error)
			} finally {
				setOpenFormatos(false)
			}
		}
		reader.readAsArrayBuffer(file)
	}

	const openPreviewFinales = (cuenta, data) => {
		setPreview(true)
		setSeleccionFormato(data)
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

                <Typography sx={{ fontSize: '24px', fontWeight: '700' }}>Creación de formatos</Typography>

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

                {fileName && (
                    <>
                        <Typography sx={{ mt: '0px', color: 'rgb(76, 206, 172)', width: '100%', maxWidth: '200px', textAlign: 'center' }}>
                            {fileName}
                        </Typography>
                        {validAccounts.length !== null && (
                            <Typography sx={{ mt: '0px', color: '#fff' }}>
                                Número de formatos totales: {validAccounts.length}
                            </Typography>
                        )}
                        {invalidAccounts.length !== null && (
                            <Typography sx={{ mt: '0px', color: '#fff' }}>
								Cuentas sin información complementaria: {invalidAccounts.length}
                            </Typography>
                        )}
                        <Button
                            sx={{
                                padding: '5px 20px',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: 'white',
                                bgcolor: 'secondary.main',
                                '&:hover': { bgcolor: 'secondary.dark' }
                            }}
							onClick={() => setOpenConfirmation(true)}
                        >
                            Crear formatos
                        </Button>
                    </>
                )}
            </Box>

            <Box 		
                sx={{ 
                    width: '50%', 
                    height: '400px', 
                    background: 'rgba(0,0,0,0.4)', 
                    borderRadius: '10px', 
                    p: '20px', 
                    display: 'flex', 
                    justifyContent: 'start', 
                    alignItems: 'center', 
                    flexDirection: 'column', 
                    gap: '14px', 
                    overflowX: 'hidden' 
                }}
            >
                { validAccounts.length > 0 && (
                    <>
                        <Typography sx={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>
                            Cuentas Completas
                        </Typography>
						
                        { validAccounts.map((row, index) => (
                            <Button
                                key={`valid-${index}`}
                                sx={{
                                    m: '0px',
                                    p: '0px',
                                    color: '#fff',
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.3)',
                                }}
                                onClick={() => openPreviewFinales(row.cuentas, row)}
                            >
                                Cuenta: {row.cuentas || row.Account || 'Cuenta desconocida'}
                            </Button>
                        ))}
                    </>
                )}

                {invalidAccounts.length > 0 && (
                    <>
                        <Typography sx={{ fontSize: '18px', fontWeight: '600', color: '#fff', mt: '20px', textAlign:'center' }}>
                            Cuentas sin información complementaria
                        </Typography>
                        {invalidAccounts.map((row, index) => (
                            <Button
                                key={`invalid-${index}`}
                                sx={{
                                    m: '0px',
                                    p: '0px',
                                    color: '#fff',
                                    width: '100%',
                                    background: 'rgba(255,0,0,0.3)',
                                }}
                                disabled
                            >
                                Cuenta: {row.cuentas || row.Account || 'Cuenta desconocida'}
                            </Button>
                        ))}
                    </>
                )}
            </Box>

            {openFormatos && <ChargeMessage />}
        </Box>

    )

}

Formatos.propTypes = {
    setPreview: PropTypes.func,
    setSeleccionFormato: PropTypes.func,
	setOpenConfirmation: PropTypes.func,
	validAccounts: PropTypes.object,
	setValidAccounts: PropTypes.func,
	invalidAccounts: PropTypes.object,
	setInvalidAccounts: PropTypes.func,
	fileName: PropTypes.object, 
	setFileName: PropTypes.func
}