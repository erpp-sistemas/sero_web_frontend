/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { Box, useTheme, Avatar, Typography, LinearProgress, InputAdornment, FormControl, FormHelperText, TextField, Chip, Button } from "@mui/material"
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import Viewer from 'react-viewer'
import { TaskAlt, Search, CalendarToday, AccessTime } from "@mui/icons-material"
import PropTypes from 'prop-types'
import Download from "@mui/icons-material/Download"
import * as ExcelJS from "exceljs";
import LoadingModal from '../../components/LoadingModal.jsx'

function BatteryMeter({ data }) {

	const theme = useTheme()
	const [searchTerm, setSearchTerm] = useState(null)
	const [filteredUsers, setFilteredUsers] = useState([])
	const [matching, setMatching] = useState(-1)
	const [noResults, setNoResults] = useState(false)
	const [searchPerformed, setSearchPerformed] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	if (!data) {
		return null
	}

	const buildColumns = () => {   
		const columns = [
			{ 
				field: 'user',
				renderHeader: () => (
					<strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
				),
				width: 270,
				editable: false,
				renderCell: (params) => (
					<Box sx={{ display: 'flex', alignItems: 'center', p: '12px' }}>
						<AvatarImage data={params.row.image_user} />
						<Typography variant="h6" sx={{ marginLeft: 1 }}>{params.value}</Typography>
					</Box>
				)
			}, 
			{ 
				field: 'date',
				renderHeader: () => (
					<strong style={{ color: "#5EBFFF" }}>{"FECHA"}</strong>
				),
				width: 150,
				editable: false,
				renderCell: (params) => (
                    <Chip
                      icon={<CalendarToday />}
                      label={
                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                          {params.value}
                        </Typography>
                      }
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.info.main,
                        color: theme.palette.info.main,
                        '& .MuiChip-icon': {
                          color: theme.palette.info.main
                        }
                      }}
                    />
                  )
			}, 
            { 
                field: 'first_hour_percentage',
                renderHeader: () => (
                    <strong style={{ color: "#5EBFFF" }}>{"PRIMER HORA"}</strong>
                ),
                width: 150,
                editable: false,
                renderCell: (params) => {                    
                    let color;
                    color = theme.palette.secondary.main;                    
            
                    return (
                    <Chip
                        icon={<AccessTime />}
                        label={
                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                            {params.value}
                        </Typography>
                        }
                        variant="outlined"
                        sx={{
                        borderColor: color,
                        color: color,
                        '& .MuiChip-icon': {
                            color: color
                        }
                        }}
                    />
                    );
                }
            }, 
			{ 
				field: 'first_percentage',
				renderHeader: () => (
					<strong style={{ color: "#5EBFFF" }}>{"PRIMER PORCENTAGE"}</strong>
				),
				width: 150,
				editable: false,
				renderCell: (params) => {
					const percentage = params.value
					let progressColor
					if (percentage <= 33) {
						progressColor = 'error'
					} else if (percentage <= 66) {
						progressColor = 'warning'
					} else {
						progressColor = 'secondary'
					}
					return (
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90px' }}>							
							<LinearProgress
								variant="determinate"
								value={params.value}
								sx={{ width: '60%', height: '8px' }}
								style={{ marginTop: '5px' }}
								color={progressColor}
							/>
							<Typography variant="body1" sx={{ fontSize: '1.2em' }}>
								{`${Math.round(params.value)}%`}
							</Typography>
						</div>
					)
				}
			}, 
      { 
          field: 'last_hour_percentage',
          renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"ULTIMA HORA"}</strong>
          ),
          width: 150,
          editable: false,
          renderCell: (params) => {                    
              let color;
              color = theme.palette.warning.main;                    
      
              return (
              <Chip
                  icon={<AccessTime />}
                  label={
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                      {params.value}
                  </Typography>
                  }
                  variant="outlined"
                  sx={{
                  borderColor: color,
                  color: color,
                  '& .MuiChip-icon': {
                      color: color
                  }
                  }}
              />
              );
          }
      },
			{ 
				field: 'last_percentage',
				renderHeader: () => (
					<strong style={{ color: "#5EBFFF" }}>{"ULTIMO PORCENTAGE"}</strong>
				),
				width: 150,
				editable: false,
				renderCell: (params) => {
					const percentage = params.value
					let progressColor
					if (percentage <= 33) {
						progressColor = 'error'
					} else if (percentage <= 66) {
						progressColor = 'warning'
					} else {
						progressColor = 'secondary'
					}
					return (
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90px' }}>							
							<LinearProgress
								variant="determinate"
								value={params.value}
								sx={{ width: '60%', height: '8px' }}
								style={{ marginTop: '5px' }}
								color={progressColor}
							/>
							<Typography variant="body1" sx={{ fontSize: '1.2em' }}>
								{`${Math.round(params.value)}%`}
							</Typography>
						</div>
					)
				}
			},      
		]
		return columns
	}

	const AvatarImage = ({ data }) => {
		const [visibleAvatar, setVisibleAvatar] = useState(false)
		return (
			<>
				<Avatar
				onClick={() => {
					setVisibleAvatar(true);
				}}
				alt="Remy Sharp"
				src={data}
				/>
		
				<Viewer
				visible={visibleAvatar}
				onClose={() => {
					setVisibleAvatar(false);
				}}
				images={[{ src: data, alt: 'avatar' }]}          
				/>
			</>
		)
	}

	useEffect(() => {
		
		setSearchPerformed(true)
		
		if (!searchTerm) {
		setFilteredUsers([]);
		setNoResults(false);
		setMatching(-1);
		return;
		} 
		
		const matchingUsers = data.filter(user => {
			return Object.values(user).some(value =>
				value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
			)
		})
		
		if (matchingUsers.length === 0) {
			setFilteredUsers([])
			setNoResults(true)
			setMatching(0)
		} else {
			setFilteredUsers(matchingUsers)
			setNoResults(false)
			setMatching(matchingUsers.length)
		}
	
	}, [data, searchTerm])

	useEffect(() => {
		setNoResults(false)
	}, [])

	const handleChange = (event) => {
		setSearchTerm(event.target.value.toLowerCase())
	}

  const handleDownloadExcelDataGrid = async () => {
    try {
      setIsLoading(true);
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");  
  
      const columnHeaders = {
        user: "GESTOR",
        date: "FECHA",
        first_hour_percentage: "PRIMER HORA ",
        first_percentage: "PRIMER PORCENTAGE",
        last_hour_percentage: "ULTIMA HORA",
        last_percentage: "ULTIMO PORCENTAGE",        
      };
  
      const addRowsToWorksheet = (data) => {
        const headers = Object.keys(columnHeaders);
        const headerRow = headers.map(header => columnHeaders[header]);
        worksheet.addRow(headerRow);
  
        data.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
      };
  
      if (filteredUsers.length > 0) {
        addRowsToWorksheet(filteredUsers);
      } else {
        addRowsToWorksheet(data);
      }
  
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Registros_Medidor_Pila.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

	return (

		<Box
			id="grid-1"
			display="grid"
			gridTemplateColumns="repeat(12, 1fr)"
			gridAutoRows="450px"
			gap="15px"
		>   

			<Box
				gridColumn='span 12'
				backgroundColor='rgba(128, 128, 128, 0.1)'
				borderRadius="10px"
				sx={{ cursor: 'pointer' }}
			>
				{data.length > 0 && (
				<>
			<Grid item xs={12} md={12} container justifyContent="space-between" alignItems="stretch" spacing={2} >
            <Grid item xs={4} md={6} sx={{ paddingBottom: 1 }}>
                <FormControl>
                <TextField                              
                    fullWidth                            
                    value={searchTerm}              
                    onChange={handleChange}              
                    color='secondary'
                    size="small"
                    placeholder="Ingresa tu búsqueda"
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <Search color="secondary"/>
                        </InputAdornment>
                    ),
                    }}
                />
                
                {( noResults ) && (
                    <FormHelperText  style={{ color: 'red' }}>
                    No se encontraron resultados
                    </FormHelperText>
                )}
                
                </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <Button 
                variant="outlined"                             
                color="secondary"                            
                onClick={() => {
                  handleDownloadExcelDataGrid();                    
                }}
                size="small"
                startIcon={<Download/>}
                >                                                        
                Exportar
              </Button>
            </Grid>
					</Grid>
					<Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
					<Grid item xs={12} style={{ height: 400, width: '100%' }}>         
						<DataGrid
							rows={filteredUsers.length > 0 ? filteredUsers : data}
							columns={buildColumns()}
							getRowId={(row) => row.user}
							editable={false}                 
							autoPageSize
						/>
					</Grid>
					</Grid>
				</>
				)}  
			</Box>
			<LoadingModal open={isLoading}/>
		</Box>  
		

	)

}

BatteryMeter.propTypes = { 
    data: PropTypes.any.isRequired
}

export default BatteryMeter