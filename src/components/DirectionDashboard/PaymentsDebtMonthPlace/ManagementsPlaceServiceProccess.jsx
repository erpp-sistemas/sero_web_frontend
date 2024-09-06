import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Grid, 
  Typography, 
  useTheme, 
  Chip, 
  TableContainer, 
  Table, 
  Paper, 
  TableHead,
  TableRow,
  TableCell,
  TableBody  
 } from "@mui/material"
import { tokens } from "../../../theme.js"
import buildColumns from '../../../components/DirectionDashboard/PaymentsDebtMonthPlace/ManagementsPlaceServiceProccess/buildColumns.jsx'
import { AccountTree, SettingsApplications, Task } from '@mui/icons-material'

function ManagementsPlaceServiceProccess({ data }) {
    if (!data) {
		return null
	}

  const useBuildColumns = buildColumns();  

  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
   
   const [selectedProcess, setSelectedProcess] = useState(null);
   const [selectedTask, setSelectedTask] = useState(null); 
   
   const uniqueProcesses = [...new Set(data.map(item => item.name_proccess))];
   const uniqueTasks = selectedProcess 
     ? [...new Set(data.filter(item => item.name_proccess === selectedProcess).map(item => item.name_task))]
     : []; 
   
   useEffect(() => {
     if (uniqueProcesses.length > 0) {
       const defaultProcess = uniqueProcesses[0];
       setSelectedProcess(defaultProcess);
 
       const defaultTasks = [...new Set(data.filter(item => item.name_proccess === defaultProcess).map(item => item.name_task))];
       if (defaultTasks.length > 0) {
         setSelectedTask(defaultTasks[0]);
       }
     }
   }, [data]);

   const filteredData = data.filter(item => 
     (!selectedProcess || item.name_proccess === selectedProcess) &&
     (!selectedTask || item.name_task === selectedTask)
   ); 
   
   const handleProcessChange = (process) => {
     setSelectedProcess(process); 
     
     const tasksForProcess = [...new Set(data.filter(item => item.name_proccess === process).map(item => item.name_task))];
     setSelectedTask(tasksForProcess.length > 0 ? tasksForProcess[0] : null);
   };
 
   const handleTaskChange = (task) => {
     setSelectedTask(task);
   };

   const managementsTotals  = filteredData.reduce((acc, item) => {
    acc.number_managements += item.number_managements || 0;    
    return acc;
  }, {
    number_managements: 0    
  });

  return (
    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="auto"
      gap="15px"
    >
      
      <Box
        sx={{ 
          cursor: 'pointer',
          gridColumn:'span 12',
          backgroundColor:'rgba(128, 128, 128, 0.1)',
          borderRadius:"10px",				
			  }}
      >
         <Typography
         variant="h4" 
         align="center" 
         sx={{ 
          color: "#5EBFFF",
          fontWeight: 'bold',
          textAlign: 'center'
        }}
         >
          GESTIONES
        </Typography>

        <Grid container justifyContent="space-between" alignItems="stretch">
          <Grid item>
            {uniqueProcesses.map((process) => (
              <Chip
                key={process}
                label={process}
                onClick={() => handleProcessChange(process)}
                color={process === selectedProcess ? 'secondary' : 'default'}
                sx={{ margin: 1 }}
                icon={<AccountTree/>}
              />
            ))}
          </Grid>
        </Grid>

        <Grid container justifyContent="space-between" alignItems="stretch">
          <Grid item sx={{ margin: 1 }}>
            {selectedProcess && (
              <>              
                <Grid container spacing={1}>
                  {uniqueTasks.map((task) => (
                    <Chip
                      key={task}
                      label={task}
                      onClick={() => handleTaskChange(task)}
                      color={task === selectedTask ? 'secondary' : 'default'}
                      sx={{ margin: 1 }}
                      icon={<Task/>}
                    />
                  ))}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>        

          {filteredData.length > 0 && (
            <>
              <Grid item xs={12} container justifyContent="space-between" alignItems="stretch" sx={{ padding: 1 }}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {useBuildColumns.map((column) => (
                          <TableCell 
                            key={column.field} 
                            style={{ minWidth: column.minWidth }}
                            align={column.headerAlign || 'left'}
                          >
                            {column.renderHeader ? column.renderHeader() : column.headerName}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((row, index) => (
                        <TableRow key={index}>
                          {useBuildColumns.map((column) => (
                            <TableCell key={column.field}>
                            {column.renderCell ? column.renderCell(row[column.field]) : row[column.field]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableBody>
                      <TableRow 
                        sx={{
                          borderTop: `4px solid ${colors.greenAccent[500]}`, 
                          fontWeight: 'bold',
                          backgroundColor: colors.primary[400]                      
                        }}
                      >
                        <TableCell 
                          colSpan={5}
                          sx={{ 
                            fontSize: '1rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Totales
                        </TableCell>
                        <TableCell
                          sx={{ 
                            fontSize: '1rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {managementsTotals.number_managements.toLocaleString('es-MX')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}
      </Box>
    </Box>
  )
}

export default ManagementsPlaceServiceProccess