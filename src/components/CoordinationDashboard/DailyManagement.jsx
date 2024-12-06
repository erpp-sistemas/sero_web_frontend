import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import PropTypes from "prop-types";
import ResponsiveLineChart from "../Charts/NivoCharts/ResponsiveLineChart.jsx";

function DailyManagement({ data, typeConcept }) {  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Arreglo de 12 colores predefinidos
  const predefinedColors = [
    colors.accentGreen[100],
    colors.redAccent[500],
    colors.blueAccent[500],
    colors.greenAccent[500],
    colors.yellowAccent[500],
    colors.tealAccent[500],
    colors.accentGreen[200],
    colors.redAccent[100],
    colors.blueAccent[100],
    colors.greenAccent[100],
    colors.yellowAccent[100],
    colors.tealAccent[100],
  ];

  if (!data) {
    return null;
  }

  // Agrupar datos por `month_year`
  const groupedData = data.reduce((acc, curr) => {
    const { month_year, concept, count } = curr;
    if (!acc[month_year]) {
      acc[month_year] = {
        id: month_year,
        color:
          predefinedColors[Object.keys(acc).length % predefinedColors.length],
        data: [],
      };
    }
    acc[month_year].data.push({ x: concept.toString(), y: count });
    return acc;
  }, {});

  // Determinar el número máximo de días presentes en los datos
  const allDays = Array.from(
    { length: Math.max(...data.map((item) => item.concept)) },
    (_, i) => (i + 1).toString()
  );

  // Rellenar días faltantes con `y: 0`
  Object.values(groupedData).forEach((group) => {
    const daySet = new Set(group.data.map((point) => point.x));
    allDays.forEach((day) => {
      if (!daySet.has(day)) {
        group.data.push({ x: day, y: 0 });
      }
    });
    // Ordenar los datos por `x`
    group.data.sort((a, b) => parseInt(a.x) - parseInt(b.x));
  });

  const formattedData = Object.values(groupedData);  

  return (
    <Box
      sx={{
        overflow: "auto",
        width: "100%",
        height: "300px",
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          backgroundColor: "rgba(128, 128, 128, 0.1)",
          borderRadius: "10px",
          gridColumn: "span 12",
          height: "100%",
          minWidth: "1000px",
          width: "100%",
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
            sx={{ fontWeight: "bold", paddingTop: 1, color: colors.accentGreen[100] }}
          >
            GESTIONES REALIZADAS
          </Typography>
        </Box>

        {data.length > 0 && (
          <ResponsiveLineChart
            data={formattedData}
            lineColor={colors.greenAccent[500]}
            showLegend={true}
            tooltipFormat={"#,.0f"}
            margin={{ top: 30, right: 140, bottom: 80, left: 80 }}
            axisBottomLegend={
              typeConcept === "hour" ? "horas del dia" : "dias del mes"
            }
            axisLeftLegend={"Gestiones"}
            axisLeftLegendOffset={-55}
            backgroundColor="transparent"
            enableArea={true}
            areaOpacity={0.3}
            areaBaselineValue={0}
            tickRotation={0}
            axisLeftFormat={""}
          />
        )}
      </Box>
    </Box>
  );
}

DailyManagement.propTypes = {
  data: PropTypes.any.isRequired,
  typeConcept: PropTypes.any.isRequired,
};

export default DailyManagement;
