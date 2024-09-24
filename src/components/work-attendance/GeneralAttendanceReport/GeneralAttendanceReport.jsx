import React, { useState, useEffect } from "react";
import { useTheme, Box, Grid, Typography, FormControl, TextField, InputAdornment, FormHelperText, Button, Avatar } from "@mui/material";
import { tokens } from "../../../theme";
import { DataGrid } from '@mui/x-data-grid'
import buildColumns from '../GeneralAttendanceReport/buildColumns.jsx'
import { AlarmOff, CheckCircle, Download, Error, Search, Warning } from "@mui/icons-material";
import * as ExcelJS from "exceljs";
import ModalTable from '../ModalTable.jsx'
import FilteredList from "./FilteredList/FilteredList.jsx";
import Viewer from "react-viewer";

function GeneralAttendanceReport({ data, reportWorkHoursData }) {

  if (!data) {
    return null;
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const useBuildColumns = buildColumns();

  const [columns, setColumns] = useState([]);

  const AvatarImage = ({ data }) => {
    const [visibleAvatar, setVisibleAvatar] = React.useState(false)

    return (
      <>
        <Avatar
          onClick={() => {
          setVisibleAvatar(true)
          }}
          alt="Remy Sharp"
          src={data}
        />
      
        <Viewer
          visible={visibleAvatar}
          onClose={() => {
          setVisibleAvatar(false)
          }}
          images={[{ src: data, alt: 'avatar' }]}          
        />
      </>
    )

  }

  const getColor = (type) => {
    switch (type) {
      case 'warning':
        return '#FFA726';
      case 'secondary':
        return '#00ff00';
      case 'error':
        return '#EF5350';
      case 'info':
        return '#03a9f4';
      default:
        return '#000';
    }
  };

  useEffect(() => {    

    if (reportWorkHoursData && reportWorkHoursData.length > 0) {
      const columnSet = new Set();
  
      reportWorkHoursData.forEach(item => {
        Object.keys(item).forEach(key => columnSet.add(key));
      });
  
      const filteredColumns = Array.from(columnSet).filter(key => key !== 'id_usuario');
  
      const dynamicColumns = filteredColumns.map(key => {
        if (key === 'usuario') {
          return {
            field: key,
            headerName: "NOMBRE",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
            ),
            width: 210,
            editable: false,
          };
        }
        if (key === 'imagen_url') {
          return {
            field: key,
            headerName: "FOTO",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"FOTO"}</strong>
            ),
            width: 70,
            renderCell: (params) => <AvatarImage data={params.row.imagen_url} />,
          };
        }
        if (key === 'plaza') {
          return {
            field: key,
            headerName: "PLAZA",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{"PLAZA"}</strong>
            ),
            width: 120,
          };
        }
        return {
          field: key,
          headerName: key,          
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{key}</strong>
          ),
          width: 80,
          renderCell: (params) => {
            const value_p = params.value;
          
          if (!value_p) {
            return <AlarmOff color="info" />;
          }

            const value = parseInt(params.value, 10);     
            
            let color = '';
            if (value >= 9) {
              color = 'secondary';
            } else if (value === 8) {
              color = 'warning';
            } else if (value <= 7) {
              color = 'error';
            } else {
              color = 'info';
            }

      
            return (
              <strong style={{ color: getColor(color) }}>
                {params.value}
              </strong>
            );
          }
        };
      });
  
      setColumns(dynamicColumns);
      setRows(reportWorkHoursData);
    }
  }, [reportWorkHoursData]);

  const [rows, setRows] = useState([]);  


  const [searchTerm, setSearchTerm] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredHours, setFilteredHours] = useState([]);
  const [matching, setMatching] = useState(-1);
  const [matchingHours, setMatchingHours] = useState(-1);

  const [noResults, setNoResults] = useState(false);
  const [noResultsHours, setNoResultsHours] = useState(false);

  const [totalRecords, setTotalRecords] = useState(0)
  const [resultCountsEntry, setResultCountsEntry] = useState({}) 
  const [resultCountsExit, setResultCountsExit] = useState({})

  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState([])

  useEffect(() => {   
    
    
    if (!searchTerm) {
      setFilteredUsers([]);
      setFilteredHours([]);
      setNoResults(false);
      setMatching(-1);
      return;
    } 
    
    const matchingUsers = data.filter(user => {
      return Object.values(user).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    const matchingHours = reportWorkHoursData.filter(hour => {
      return Object.values(hour).some(value =>
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

    if (matchingHours.length === 0) {
      setFilteredHours([]);
      setNoResultsHours(true);
      setMatchingHours(0);
    } else {
      setFilteredHours(matchingHours);
      setNoResultsHours(false);
      setMatchingHours(matchingHours.length);
    }
  
  }, [searchTerm]);
  

  useEffect(() => {
    setNoResults(false);
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  useEffect(() => {
    const usersToCount = filteredUsers.length > 0 ? filteredUsers : data;
  
    const countsE = usersToCount.reduce((acce, row) => {
      const resultE = row.estatus_entrada;
      acce[resultE] = (acce[resultE] || 0) + 1;
      return acce;
    }, {});
  
    const countsS = usersToCount.reduce((accs, row) => {
      const resultS = row.estatus_salida;
      accs[resultS] = (accs[resultS] || 0) + 1;
      return accs;
    }, {});
  
    setTotalRecords(usersToCount.length);
    setResultCountsEntry(countsE);
    setResultCountsExit(countsS);
  }, [data, filteredUsers]);    

    const handleDownloadExcel = async (type, result) => {
      try {
        setIsLoading(true);    
        
        const filteredData = filteredUsers.length > 0 ? 
          (type === 1 ? filteredUsers.filter(row => row.estatus_entrada === result) :
          filteredUsers.filter(row => row.estatus_salida === result)) :
          (type === 1 ? data.filter(row => row.estatus_entrada === result) :
          data.filter(row => row.estatus_salida === result));
    
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Registros Encontrados");
    
        if (filteredData.length === 0) {
          console.error("No hay datos para descargar.");
          setIsLoading(false);
          return;
        }
    
        const headers = Object.keys(filteredData[0]);
        worksheet.addRow(headers);
    
        filteredData.forEach(row => {
          const values = headers.map(header => row[header]);
          worksheet.addRow(values);
        });
    
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${result}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    const handleOpenModal = (type, result) => {

      const usersToFilter = filteredUsers.length > 0 ? filteredUsers : data;
  
      let filteredData;
    
      if (type === 1) {
        filteredData = usersToFilter.filter(row => row.estatus_entrada === result);
      } else if (type === 2) {
        filteredData = usersToFilter.filter(row => row.estatus_salida === result);
      }
    
      setModalData(filteredData);
      setOpenModal(true);
    };    
    
    const handleCloseModal = () => {
      setOpenModal(false);
    };

    const handleDownloadExcelDataGrid = async () => {
      try {
        setIsLoading(true);        
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Registros Encontrados");

        if (filteredUsers.length > 0){
          const headers = Object.keys(filteredUsers[0]);
          worksheet.addRow(headers);

          filteredUsers.forEach((row) => {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
          });
        }
        else {
          const headers = Object.keys(data[0]);
          worksheet.addRow(headers);

          data.forEach((row) => {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
          });
        }        

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Registros_Asistencia.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        setIsLoading(false);
      } catch (error) {
          console.error("Error:", error);
          setIsLoading(false);
      }
    };

    const handleDownloadExcelDataGridHours = async () => {
      try {
        setIsLoading(true);        
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Registros Encontrados");

        if (filteredHours.length > 0){
          const headers = Object.keys(filteredHours[0]);
          worksheet.addRow(headers);

          filteredHours.forEach((row) => {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
          });
        }
        else {
          const headers = Object.keys(reportWorkHoursData[0]);
          worksheet.addRow(headers);

          reportWorkHoursData.forEach((row) => {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
          });
        }        

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Registros_Asistencia.xlsx`;
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
      gridAutoRows="1300px"
      gap="15px"
    >   
      <Box
        gridColumn='span 12'
        backgroundColor='paper'
        borderRadius="10px"
        sx={{ cursor: 'pointer' }}
      >
        {data.length > 0 && (

          <>
          <Grid 
            item 
            xs={12} 
            container 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ paddingBottom: 1 }}
          >
            <Grid item xs={12}>
              <Typography 
                variant="h4" 
                align="center" 
                sx={{ fontWeight: 'bold', paddingTop: 1 }}
              >
                Listado General de Asistencia
              </Typography>
            </Grid>
            
            <Grid 
              item 
              xs={8} 
              container
              alignItems="center"
              spacing={2} 
              sx={{ paddingBottom: 1 }}
            >
              <Grid item xs={6}>
                <FormControl fullWidth>
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
                  {(noResults) && (
                    <FormHelperText style={{ color: 'red' }}>
                      No se encontraron resultados
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid 
                item 
                xs={2}
                sx={{ marginLeft: 1 }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDownloadExcelDataGrid}
                  size="small"
                  startIcon={<Download />}
                >
                  Exportar
                </Button>
              </Grid>
            </Grid>
          </Grid>
           <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" spacing={2}>              
              <Grid item xs={12} md={ 8 } style={{ height: 560, width: '100%' }}>         
                <DataGrid
                    rows={filteredUsers.length > 0 ? filteredUsers : data}
                    columns={useBuildColumns}
                    getRowId={(row) => row.usuario_id}
                    editable={false}                 
                    
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                    m='5px 0'
                    display='flex'
                    flexDirection='column'
                    justifyContent='space-evenly'
                    gap='10px'
                    sx={{
                        backgroundColor: colors.primary[400],
                        padding: '5px 5px',
                        borderRadius: '10px',
                        width: '100%',
                    }}
                  >
                    
                    <FilteredList
                      resultCountsEntry={resultCountsEntry}
                      resultCountsExit={resultCountsExit}
                      handleDownloadExcel={handleDownloadExcel}
                      handleOpenModal={handleOpenModal}
                      totalRecords={totalRecords}
                      colors={colors}
                      theme={theme}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} style={{ height: 560, width: '100%', marginTop: '20px' }}>
                  <Grid 
                    item 
                    xs={12} 
                    container 
                    justifyContent="space-between" 
                    alignItems="center"
                    sx={{ paddingBottom: 1 }}
                  >
                    <Grid item xs={12}>
                      <Typography 
                        variant="h4" 
                        align="center" 
                        sx={{ fontWeight: 'bold', paddingTop: 1 }}
                      >
                        Horas Trabajadas
                      </Typography>
                    </Grid>
                    <Grid 
                      item 
                      xs={2}
                      sx={{ p : 1 }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleDownloadExcelDataGridHours}
                        size="small"
                        startIcon={<Download />}
                      >
                        Exportar
                      </Button>
                    </Grid>
                  </Grid>

                  
                  <DataGrid
                    rows={filteredHours.length > 0 ? filteredHours :rows}
                    columns={columns}
                    getRowId={(row) => row.id_usuario} 
                    
                  />
                </Grid>
            </Grid>
          </>                    
        )}

          <ModalTable open={openModal} onClose={handleCloseModal} data={modalData} />

        </Box>
    </Box>
  )
}

export default GeneralAttendanceReport