import React, { useState, useEffect } from "react";
import { Box, useTheme, Avatar, Typography, LinearProgress, InputAdornment, FormControl, FormHelperText, Chip, Button} from "@mui/material";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { tokens } from "../../theme";
import { DataGrid } from '@mui/x-data-grid';
import Viewer from 'react-viewer';
import { Search, CalendarToday, AccessTime, Download, PersonPinCircle } from "@mui/icons-material";
import LoadingModal from '../../components/LoadingModal.jsx'
import * as ExcelJS from "exceljs";

function VerifiedAddress({data}) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [matching, setMatching] = useState(-1);

  const [noResults, setNoResults] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [isLoading, setIsLoading] = useState(false)

  if (!data) {
    return null;
}

  const buildColumns = () => {   
    const columns = [
        { 
			field: 'account',
			renderHeader: () => (
				<strong style={{ color: "#5EBFFF" }}>{"CUENTA"}</strong>
			),
			width: 270,
			editable: false,			
		}, 
    { 
			field: 'street',
			renderHeader: () => (
				<strong style={{ color: "#5EBFFF" }}>{"CALLE"}</strong>
			),
			width: 270,
			editable: false,			
		}, 
		{ 
			field: 'manager',
			renderHeader: () => (
				<strong style={{ color: "#5EBFFF" }}>{"GESTOR"}</strong>
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
			field: 'date_capture',
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
      field: 'position',
      renderHeader: () => (
      <strong style={{ color: "#5EBFFF" }}>{"Posicion"}</strong>
      ),
      width: 120,
      renderCell: (params) => (
      <PersonPinCircle 
        style={{ cursor: 'pointer', color: 'lightblue', fontSize: 40 }} 
        onClick={() => {
        window.open(params.value, '_blank');
        }}
      />
      ),
    },    
    ];
  
    return columns;
  };

  const AvatarImage = ({ data }) => {
    const [visibleAvatar, setVisibleAvatar] = React.useState(false);
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
    );
  };
  useEffect(() => {
    
    setSearchPerformed(true);  
    
    if (!searchTerm) {
      setFilteredUsers([]);
      setNoResults(false);
      setMatching(-1);
      return;
    } 
    
    const matchingUsers = data.filter(user => {
      return Object.values(user).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });  
    
    if (matchingUsers.length === 0) {
      setFilteredUsers([]);
      setNoResults(true);
      setMatching(0);
    } else {
      setFilteredUsers(matchingUsers);
      setNoResults(false);
      setMatching(matchingUsers.length);
    }
  
  }, [searchTerm]);
  

  useEffect(() => {
    setNoResults(false);
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleDownloadExcelDataGrid = async () => {
    try {
      setIsLoading(true);
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");  
  
      const columnHeaders = {
        account: "Cuenta",
        street: "Direccion",
        latitude: "Latitud",
        longitude: "Longitud",
        position: "Posicion",
        manager: "Gestor que Gestiono",
        date_capture: "Fecha de Captura"
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
      a.download = `Registros_Domicilio_verificado.xlsx`;
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
          <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2} >
            <Grid item xs={12}>
              <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', paddingTop: 1 }}>
                Domicilios Verificados
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ paddingBottom: 1 }}>
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
                    getRowId={(row) => row.id}
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
export default VerifiedAddress