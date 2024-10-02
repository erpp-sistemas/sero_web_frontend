import React, {useRef} from 'react'
import { Box, Button, useTheme } from '@mui/material';
import * as htmlToImage from 'html-to-image';
import { tokens } from "../../../../theme.js";
import ResponsivePieChart from '../../../../components/Charts/NivoCharts/ResponsivePieChart.jsx'

function AmountOfProcedures({ amountValidProcedures, amountInvalidProcedures }) {

  if (!amountValidProcedures ) {
		return null
	}

  const chartRef = useRef();

  const theme = useTheme()
  const colors = tokens(theme.palette.mode) 

  const data = [
      {
          id: "Gestiones Validas",
          label: "Gestiones Validas",
          value: amountValidProcedures,
          color: "#00ff00"
      },
      {
          id: "Gestiones No Validas",
          label: "Gestiones No Validas",
          value: amountInvalidProcedures,
          color: "#db4f4a"
      },
  ];

  const convertedData = data.map(item => ({
      ...item,
      value: parseFloat(item.value.replace(/,/g, ''))
  }));

  const handleDownload = () => {
    const chartElement = chartRef.current;  // Elemento DOM de la gráfica

    // Oculta temporalmente el botón antes de capturar la imagen
    const downloadButton = document.getElementById("download-button");
    if (downloadButton) downloadButton.style.display = "none";

    // Genera la imagen y la descarga
    htmlToImage.toPng(chartElement)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'grafica.png';
        link.href = dataUrl;
        link.click();

        // Muestra el botón nuevamente después de la captura
        if (downloadButton) downloadButton.style.display = "block";
      })
      .catch((err) => {
        console.error('Error al generar la imagen', err);
      });
  };

  return (
    <Box
      ref={chartRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '600px',
        p: 1,
        borderRadius: '10px',
        gridColumn: 'span 6'      
      }}
    >       
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        borderRadius: '10px',
        width: '100%',
        height: '100%',
        overflow: 'hidden'        
      }}
    >
				{data.length > 0 && (
					<ResponsivePieChart 
            data={ convertedData }
            tooltipFormat=">-$,"
            margin = { { top: 40, right: 80, bottom: 80, left: 100 } }
            legendItemsSpacing={30}            
          />
				)}

			</Box>
        <Button
          id="download-button" 
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{ marginTop: '20px' }}
        >
          Descargar gráfica
        </Button>

		</Box>
  )
}

export default AmountOfProcedures