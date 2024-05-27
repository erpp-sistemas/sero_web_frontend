import React, { useState, useEffect } from "react";
import Line from '../../components/NivoChart/Line.jsx'
import Legend from '../../components/LightweightCharts/Legend.jsx'
import { Box, useTheme, Button, ButtonGroup, Typography } from "@mui/material";
import { tokens } from "../../theme";

function LineNumberOFTotalProcedures({ lineMonthData, lineWeekData, lineDayData }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const generateRandomColorHSL = () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30 + 70);
    const l = Math.floor(Math.random() * 30 + 50);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  // const transformData = (data) => {
  //   const transformedData = data.map(item => ({
  //     x: item.x,
  //     y: item.y
  //   }));

  //   const transformedDataObject = {
  //     id: 'mes',
  //     color: generateRandomColorHSL(),
  //     data: transformedData
  //   };

  //   return [transformedDataObject];
  // };

  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const getDataForPeriod = () => {
    switch (selectedPeriod) {
      case 'month':
        return lineMonthData;
      case 'week':
        return lineWeekData;
      case 'day':
        return lineDayData;
      default:
        return [];
    }
  };

  // const getDataForPeriod = () => {
  //   switch (selectedPeriod) {
  //     case 'month':
  //       return transformData(lineMonthData);
  //     case 'week':
  //       return transformData(lineWeekData);
  //     case 'day':
  //       return transformData(lineDayData);
  //     default:
  //       return [];
  //   }
  // };

  return (
    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="390px"
      gap="15px"
    >
      <Box
        gridColumn='span 12'
        backgroundColor='rgba(128, 128, 128, 0.1)'
        borderRadius="10px"
        sx={{ cursor: 'pointer' }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ padding: "10px 30px 0 20px" }}
            color={colors.grey[100]}
            textAlign={'center'}
          >
            NUMERO DE GESTIONES
          </Typography>
        </Box>
        <Box>
          <ButtonGroup variant="contained" aria-label="Basic button group" size='small' >
            <Button
              sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              onClick={() => setSelectedPeriod('month')}
            >
              Mes
            </Button>
            <Button
              sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              onClick={() => setSelectedPeriod('week')}
            >
              Semanas
            </Button>
            <Button
              sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              onClick={() => setSelectedPeriod('day')}
            >
              Días
            </Button>
          </ButtonGroup>
        </Box>
        {getDataForPeriod().length > 0 && (
          <Legend
            data={getDataForPeriod()}
          />
        )}
      </Box>
    </Box>
  )
}

export default LineNumberOFTotalProcedures;


// import React, { useState, useEffect } from "react";
// import Line from '../../components/NivoChart/Line.jsx'
// import { dataLine } from '../../data/line.js'
// import { Box, useTheme, Button, Avatar, Typography, ButtonGroup } from "@mui/material";
// import Grid from '@mui/material/Grid';
// import { tokens } from "../../theme";

// function LineNumberOFTotalProcedures({ data }) {

//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const [monthData, setMonthData] = useState(0);
//   const [weekData, setWeekData] = useState(0);
//   const [dayData, setDayData] = useState(0);

//   const generateRandomColorHSL = () => {
//     const h = Math.floor(Math.random() * 360);
//     const s = Math.floor(Math.random() * 30 + 70);
//     const l = Math.floor(Math.random() * 30 + 50);
//     return `hsl(${h}, ${s}%, ${l}%)`;
//   };

//   console.log(data)
  
  
//   const monthNames = [
//     "Ene", "Feb", "Mar", "Abr", "May", "Jun",
//     "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
//   ];
  
//   const monthMap = {
//     "Jan": "Ene",
//     "Feb": "Feb",
//     "Mar": "Mar",
//     "Apr": "Abr",
//     "May": "May",
//     "Jun": "Jun",
//     "Jul": "Jul",
//     "Aug": "Ago",
//     "Sep": "Sep",
//     "Oct": "Oct",
//     "Nov": "Nov",
//     "Dec": "Dic"
//   };
  
//   const transformData = (data) => {
//     const transformedData = data.map(item => {
//       const [monthAbbr, year] = item.x.split("-");
//       const monthFullName = monthMap[monthAbbr];
//       const monthIndex = monthNames.indexOf(monthFullName);
//       return { x: `${year}-${monthFullName}`, y: item.y, monthIndex };
//     }).sort((a, b) => {
//       return a.monthIndex - b.monthIndex;
//     }).map(item => {
//       return { x: item.x, y: item.y };
//     });
  
//     const transformedDataObject = {
//       id: 'mes',
//       color: generateRandomColorHSL(),
//       data: transformedData
//     };
  
//     return [transformedDataObject];
//   };

//   const transformedData = transformData(data);      
  

//   return (
//     <Box
//       id="grid-1"
//       display="grid"
//       gridTemplateColumns="repeat(12, 1fr)"
//       gridAutoRows="390px"
//       gap="15px"      
//     >
//       <Box
//         gridColumn='span 12'
//         backgroundColor= 'rgba(128, 128, 128, 0.1)'
//         borderRadius="10px"
//         sx={{ cursor: 'pointer' }}
//       >
//         <Box>
//           <Typography
//             variant="h5"
//             sx={{ padding: "10px 30px 0 20px" }}
//             color={colors.grey[100]}
//             textAlign={'center'}
//           >
//               META ESTABLECIDA
//           </Typography>
//         </Box>
//         <Box>
//         <ButtonGroup variant="contained" aria-label="Basic button group" size='small' >
//           <Button sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}>Mes</Button>
//           <Button sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}>Semanas</Button>
//           <Button sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}>Dias</Button>
//         </ButtonGroup>
//         </Box>
//         {data.length > 0 && (
//           <Line                
//             data= { transformedData }
//           />
//         )}
//       </Box>
//     </Box>
//   )
// }

// export default LineNumberOFTotalProcedures