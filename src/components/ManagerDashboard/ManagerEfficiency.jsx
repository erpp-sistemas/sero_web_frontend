import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import { tokens } from "../../theme.js";
import ManagerEfficiencyChart from '../ManagerDashboard/ManagerEfficiency/ManagerEfficiencyChart.jsx'
import ManagerEfficiencyTable from '../ManagerDashboard/ManagerEfficiency/ManagerEfficiencyTable.jsx'

function ManagerEfficiency({ data }) {

  console.log(data)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "980px",
        p: 2,
        borderRadius: "10px",
      }}
    >      
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(128, 128, 128, 0.1)",
          borderRadius: "10px",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {data.length > 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ManagerEfficiencyChart data={data} />
            </Grid>
            <Grid item xs={12}>
              <ManagerEfficiencyTable data={data} />
            </Grid>
          </Grid>
          
        )}
      </Box>
    </Box>
  );
}

export default ManagerEfficiency;
