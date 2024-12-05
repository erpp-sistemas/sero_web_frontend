import { Box } from "@mui/material";
import React from "react";
import Legend from "../../components/LightweightCharts/Legend";

function PaymentsDay({ data }) {
  const title = "Pagos por dia";
  const title_label = "Total pagado";
  const format = "currency"
  return (
    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gap="15px"
    >
      <Box
        gridColumn="span 12"
        backgroundColor="rgba(128, 128, 128, 0.1)"
        borderRadius="8px"
        sx={{
          cursor: "pointer",
          borderRadius: "8px",
          boxShadow: 3,
          padding: 0,
        }}
      >
        <Legend data={data} title={title} title_label={title_label} format={ format } />
      </Box>
    </Box>
  );
}

export default PaymentsDay;
