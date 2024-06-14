import React, { useState, useEffect } from "react"
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import CancelIcon from '@mui/icons-material/Cancel'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { tokens } from "../../theme"
import PlaceSelect from '../../components/PlaceSelect'
import ServiceSelect from '../../components/ServiceSelect'
import AlertMessage from "../../components/AlertMessage"
import { Box, useTheme, Button} from "@mui/material"
import Typography from '@mui/material/Typography'
import Input from '@mui/material/Input'
import { read, utils } from 'xlsx'
import {postWorkAssignment} from '../../services/assignment.service.js'
import { DataGrid } from "@mui/x-data-grid"

const Index = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const [selectedPlace, setSelectedPlace] = useState('')
    const [selectedService, setSelectedService] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [error, setError] = useState(null);
    const [fileKey, setFileKey] = useState(0);
    const [resultAssignment, setResultAssignment] = useState([])
    const [resultCounts, setResultCounts] = useState({})
    const [totalRecords, setTotalRecords] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

	const handlePlaceChange = (event) => {
		setSelectedPlace(event.target.value)
		setSelectedService('')
	}

	const handleServiceChange = (event) => {
		setSelectedService(event.target.value)       
	}

	const handleFileChange = (e) => {

		const file = e.target.files[0];

		setSelectedFile(null)
		setError(null)

		if (file) {
		const allowedExtensions = ['.xlsx', '.xls'];
		const fileExtension = file.name.substring(file.name.lastIndexOf('.'))
	
			if (allowedExtensions.includes(fileExtension)) {
				setSelectedFile(file)        
				setError(null)
			} else {        
				setError('El archivo seleccionado no es un archivo Excel válido (.xlsx o .xls).')
				e.target.value = ''          
			}
		}
		else{
			setError("¡Error! Debes seleccionar un archivo Excel.")
		}

		setFileKey(prevKey => prevKey + 1)

	}

	const handleConvertExcelToArray = async () => {

		try {
			setIsLoading(true)

			if (!selectedFile) {
				setError("¡Error! Debes seleccionar un archivo Excel.")
				return
			}
		
			const reader = new FileReader()
		
			reader.onload = async (e) => {

			try {

				const data = new Uint8Array(e.target.result)
				const workbook = read(data, { type: 'array' })
				const sheetName = workbook.SheetNames[0]
				const worksheet = workbook.Sheets[sheetName]
				let dataArray = utils.sheet_to_json(worksheet, { header: 1 })
				dataArray = dataArray.filter(item => item.length > 0)
				dataArray.shift()
				const result = await postWorkAssignment(selectedPlace, selectedService, dataArray)  
				setResultAssignment(result)

			} catch (error) {

				if(Array.isArray(error.response.data)){
					return setError(error.response.data)
				} 
				else {    
					setError([error.response.data.message])
				}
			}

			finally {
				setIsLoading(false)
			}

		}

		reader.readAsArrayBuffer(selectedFile);
		
		} catch (error) {
		setIsLoading(false)
		console.error("Error general al convertir Excel a Array:", error);
		setError("¡Error al convertir Excel a Array!");
		}
	}

	const columns = [      
		{
			field: "account",
			headerName: "Cuenta",
			headerAlign: "center",          
			cellClassName: "name-column--cell",          
		},
		{
			field: "task_assigned",
			headerName: "Tarea",
			headerAlign: "center",
			align: "center",
			cellClassName: "name-column--cell",
			flex:1,            
		},
		{
			field: "person_assigned",
			headerName: "Gestor",
			headerAlign: "center",
			align: "center",
			cellClassName: "name-column--cell",
			flex:1,
		},
		{
			field: "assignment_result",
			headerName: "Resultado",
			headerAlign: "center",
			align: "center",
			cellClassName: "name-column--cell",
			flex:1,
		}      
	]

	useEffect(() => {
		const counts = resultAssignment.reduce((acc, row) => {
			const result = row.assignment_result
			acc[result] = (acc[result] || 0) + 1
			return acc
		}, {})
		setResultCounts(counts)
		setTotalRecords(resultAssignment.length)
	}, [resultAssignment])

	const resultIcons = {
		"asignacion correcta": <CheckCircleIcon />,
		"no existe la cuenta": <ErrorIcon />,
		"cuenta duplicada": <WarningIcon />,
		"no existe la tarea": <CancelIcon />,
		"no existe el usuario": <PersonOutlineIcon />,
		"no tiene deuda en el mes actual": <AttachMoneyIcon />,
	}

    return (

        <>
		
            <Box
                m='20px 0'
                display='flex'
                justifyContent='space-evenly'
                flexWrap='wrap'
                gap='20px'
                sx={{ backgroundColor: colors.primary[400], width: '100%' }}
                padding='15px 10px'
                borderRadius='10px'
            >
               <PlaceSelect                
                selectedPlace={selectedPlace}
                handlePlaceChange={handlePlaceChange}
               />

                <ServiceSelect
                  selectedPlace={selectedPlace}                  
                  selectedService={selectedService}
                  handleServiceChange={handleServiceChange}
                />

              <Box>
                <label htmlFor="file-upload-excel">
                  <Typography variant="body1" gutterBottom>
                    Cargar archivo Excel
                  </Typography>
                  <Input
                  key={fileKey}
                    accept=".xlsx, .xls"
                    id="file-upload-excel"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <Typography variant="body2">
                    Archivo seleccionado: {selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}
                  </Typography>
                </label>
              </Box>
              {error && <AlertMessage message={error} type="error" />}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleConvertExcelToArray();
                  
                }}
                disabled={ isLoading || !selectedPlace || !selectedService } 
              >
                Convertir Excel a Array
              </Button>

              {isLoading && 
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress
                    color="success"
                  />
                </Box>
              }

            </Box>           
            
            <Box                
                display='flex'
                justifyContent='center'
                alignItems="center"
                sx={{
                    backgroundColor: colors.primary[400],
                }}
            >
                <Grid container spacing={2}>

					<Grid item xs={8}>

						<Box                      
							margin='0 0 0 10px'
							height="400px"
							sx={{
								"& .MuiDataGrid-root": {
									border: "none",
									textAlign: "center"
									},
									"& .MuiDataGrid-cell": {
									borderBottom: "none",
									textAlign: "center !important"
									},
									"& .name-column--cell": {
									color: colors.grey[200],
									fontSize: "14px"
									},
									"& .MuiDataGrid-columnHeaders": {
									backgroundColor: colors.primary[400],
									borderBottomColor: colors.greenAccent[700],
									},
									"& .MuiDataGrid-virtualScroller": {
									backgroundColor: colors.primary[400],
									},
									"& .MuiDataGrid-footerContainer": {
									borderTop: "none",
									backgroundColor: colors.primary[400],
									},
									"& .MuiCheckbox-root": {
									color: `${colors.greenAccent[200]} !important`,
									},
									"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
									color: `${colors.grey[100]} !important`,
									},
							}}
						>
							<DataGrid 
								rows={resultAssignment} 
								columns={columns}                       
								disableExtendRowFullWidth
								pageSize={10}
								pagination 
								columnBuffer={totalRecords}
								disableColumnResize={true}
								rowCount={totalRecords}                      
								sx={{
									width: '100%',
									"& .MuiDataGrid-root": {
									border: "none",
									textAlign: "center",
									}
							}}/>
						</Box>

					</Grid>

					<Grid item xs={4}>
						<Box
							m='10px 0'
							display='flex'
							flexDirection='column'
							justifyContent='space-evenly'
							gap='20px'
							sx={{
								backgroundColor: colors.primary[400],
								padding: '15px 10px',
								borderRadius: '10px',
								width: '100%',
							}}
						>
							<List
								sx={{
									width: '100%',
									maxWidth: 360,                        
									bgcolor: {backgroundColor: colors.primary[400]},
								}}
							>
								<ListItem>
									<ListItemAvatar>
									<Avatar>
										<DoneAllIcon />
									</Avatar>
									</ListItemAvatar>
									<ListItemText primary={`Registros Cargados: ${totalRecords}`} />
								</ListItem>
								<Divider variant="inset" component="li" />
								{Object.entries(resultCounts).map(([result, count]) => (
									<React.Fragment key={result}>
										<ListItem>
											<ListItemAvatar>
												<Avatar>
													{resultIcons[result]}
												</Avatar>
											</ListItemAvatar>
											<ListItemText primary={`${result}: ${count}`} />
										</ListItem>
										<Divider variant="inset" component="li" />
									</React.Fragment>
								))}
							</List>

						</Box>

					</Grid>    
              
                </Grid>

            </Box>
                  
        </>

    )

}

export default Index