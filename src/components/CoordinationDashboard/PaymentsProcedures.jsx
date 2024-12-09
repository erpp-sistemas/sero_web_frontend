import React from "react";
import { Box, useTheme, Button, Avatar, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { tokens } from "../../theme";
import Bar from "../NivoChart/Bar";
import ResponsiveBarChart from '../../components/Charts/NivoCharts/ResponsiveBarChart.jsx'

function PaymentsProcedures({ data }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data) {
    return null;
  }

  const formatData = (data) => {
    return data.map((item) => ({
      concept: item.concept, // Mantener el índice original
      gestiones_con_pago: item.gestiones_con_pago,
      gestiones_con_pagoColor: colors.accentGreen[100], // Asignar color personalizado
      gestiones_sin_pago: item.gestiones_sin_pago,
      gestiones_sin_pagoColor: colors.blueAccent[500], // Asignar color personalizado
    }));
  };

  const formattedData = formatData(data);

  console.log(formattedData);

  const conceptNamesKeys = ["gestiones_con_pago", "gestiones_sin_pago"];

  return (
    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="390px"
      gap="15px"
      width="100%"
      padding="5px"
    >
      <Box
        sx={{
          cursor: "pointer",
          gridColumn: "span 12",
          backgroundColor: "rgba(128, 128, 128, 0.1)",
          borderRadius: "10px",
          overflowY: "hidden",
          overflowX: "scroll",
        }}
      >
        <Box
          mt="10px"
          mb="-15px"
          p="0 10px"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              paddingTop: 1,
              color: colors.accentGreen[100],
            }}
          >
            GESTIONES Y CUANTAS FUERON PAGADAS
          </Typography>
        </Box>
        {data.length > 0 && (
          <ResponsiveBarChart
            data={formattedData}
            barColor={({ id, data }) => data[`${id}Color`]}
            showLegend={false}
            tooltipFormat={(value) => `${value.toLocaleString()}`}
            margin={{ top: 30, right: 100, bottom: 50, left: 75 }}
            backgroundColor="transparent"
            keys={conceptNamesKeys}
            indexBy="concept"
            axisBottomLegend="dia"
            axisLeftLegend="Cuentas"
            axisLeftLegendOffset={-60}
            showBarValues={false}
            groupMode="grouped"
             valueScale ="symlog"
          />
        )}
      </Box>
    </Box>
  );
}

export default PaymentsProcedures;
