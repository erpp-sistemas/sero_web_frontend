import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Pie from "../../components/NivoChart/Pie";
import ResponsivePieChart from "../../components/Charts/NivoCharts/ResponsivePieChart.jsx";

function PaymentsProceduresByTypeService({ data }) {
  console.log(data);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data) {
    return null;
  }

  const generatePieChartData = (data, colorsArray) => {
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return sortedData.map((item, index) => ({
      ...item,
      color: colorsArray[index % colorsArray.length], // Asignar colores cíclicamente
    }));
  };

  // Array de colores personalizados
  const customColors = [
    colors.accentGreen[100],
    colors.redAccent[500],
    colors.blueAccent[500],
    colors.yellowAccent[500],
    colors.greenAccent[500], 
    colors.tealAccent[500],
    colors.accentGreen[200],
    colors.redAccent[100],
    colors.greenAccent[100],
    colors.blueAccent[100],    
    colors.yellowAccent[100],
    colors.tealAccent[100],
  ];

  // Datos formateados
  const formattedPieChartData = generatePieChartData(data, customColors);

  return (
    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="480px"
      gap="15px"
      width="100%"
    >
      <Box
        gridColumn="span 12"
        backgroundColor="rgba(128, 128, 128, 0.1)"
        borderRadius="10px"
        sx={{ cursor: "pointer" }}
      >
        <Box>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              paddingTop: 1,
              color: colors.accentGreen[100],
            }}
          >
            GESTIONES CON PAGO POR TIPO DE SERVICIO
          </Typography>
        </Box>
        <Box
          gridColumn="span 12"
          borderRadius="10px"
          sx={{ padding: "0 5px" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          height="380px"
        >
          <Box sx={{ width: "100%", height: "100%" }}>
            {data.length > 0 && (
              <ResponsivePieChart
                data={formattedPieChartData}
                tooltipFormat=">-,"
                margin={{ top: 40, right: 80, bottom: 80, left: 100 }}
                legendItemsSpacing={30}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PaymentsProceduresByTypeService;
