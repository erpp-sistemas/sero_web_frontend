import { Box, Grid, Typography, useTheme } from '@mui/material';
import React from 'react'
import { tokens } from '../../../../../theme';

import TableContributor from './components/TableContributor';

import GoogleMaps from './components/maps';

function ContributorSection() {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
      <Box
    backgroundColor={colors.primary[400]}
    gridColumn={`span ${7}`} 
    borderRadius='10px'
>

    <Box sx={{ marginTop: '20px', backgroundColor: colors.primary[400] }}>
        <Typography
            variant="h5"
            color={colors.greenAccent[400]}
            sx={{ paddingTop: '10px', paddingLeft: '30px' }}
        >
            CONTRIBUYENTE
        </Typography>
    </Box>

    <Box
        m="20px 0 0 0"
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

       {/*  <DataGrid rows={recaudadoGestor} columns={columns} autoPageSize /> */}<TableContributor/>
    </Box>
    

</Box>

      </Grid>
      <Grid item xs={6}>
      <Box sx={{ marginTop: '20px', backgroundColor: colors.primary[400] }}>
        <Typography
            variant="h5"
            color={colors.greenAccent[400]}
            sx={{ paddingTop: '10px', paddingLeft: '30px' }}
        >
            GOOGLE MAPS
        </Typography>
    </Box>
    <Box
        m="20px 0 0 0"
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

       {/*  <DataGrid rows={recaudadoGestor} columns={columns} autoPageSize /> */}<GoogleMaps/>
    </Box>

      </Grid>

    </Grid>
   
  )
}

export default ContributorSection