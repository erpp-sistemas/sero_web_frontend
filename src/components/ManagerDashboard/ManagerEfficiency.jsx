import React from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme.js";
import { ManagerEfficiencyChart} from '../ManagerDashboard/ManagerEfficiency/ManagerEfficiencyChart.jsx'

function ManagerEfficiency({ data }) {
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
        height: "400px",
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
          <ManagerEfficiencyChart data={data} />
        )}
      </Box>
    </Box>
  );
}

export default ManagerEfficiency;
