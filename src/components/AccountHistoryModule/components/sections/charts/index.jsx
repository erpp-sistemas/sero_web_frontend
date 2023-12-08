import React from "react";
import useAccountData from "../../../../../hooks/accountDataHook";
import { useStoreZustand } from "../../../../../zustan_store/useStoreZustand";
import { create, all } from "mathjs";
import ReactApexChart from "react-apexcharts";
import { Grid } from "@mui/material";
const config = {};
const math = create(all, config);
function Charts() {
  const { accountData } = useAccountData();

  const { debts, payments } = useStoreZustand();

  // Obtener montos de adeudo
  console.log(debts);
  const datos = debts.map((item) => item.debtAmount || 0);
  const media = math.mean(datos).toFixed(2);

  // Calcular la mediana
  const mediana = math.median(datos).toFixed(2);

  // Calcular la desviación estándar
  const desviacionEstandar = math.std(datos).toFixed(2);

  // Calcular el mínimo y máximo
  const minimo = math.min(datos).toFixed(2);
  const maximo = math.max(datos).toFixed(2);

  // Imprimir resultados
  console.log("Media:", media);
  console.log("Mediana:", mediana);
  console.log("Desviación Estándar:", desviacionEstandar);
  console.log("Mínimo:", minimo);
  console.log("Máximo:", maximo);

  console.log(math);
// Rango
const mean = math.mean(datos);

// Mediana
const median = math.median(datos);

// Moda (math.mode no está disponible, se puede implementar manualmente)
const mode = getMode(datos);

// Desviación estándar
const stdDev = math.std(datos);

// Rango
const dataRange = math.max(datos) - math.min(datos);

// Percentiles (math.quantileSeq)
const percentiles = getPercentiles(datos);

console.log("Media:", mean);
console.log("Mediana:", median);
console.log("Moda:", mode);
console.log("Desviación Estándar:", stdDev);
console.log("Rango:", dataRange);
console.log("Percentiles:", percentiles);


function getMode(data) {
  const counts = {};
  datos.forEach(function (value) {
    counts[value] = (counts[value] || 0) + 1;
  });

  var maxCount = 0;
  var modes = [];

  for (var value in counts) {
    if (counts[value] > maxCount) {
      modes = [value];
      maxCount = counts[value];
    } else if (counts[value] === maxCount) {
      modes.push(value);
    }
  }

  return modes;
}

// Función para calcular percentiles
function getPercentiles(datos) {
  var sortedData = math.sort(datos);
  return [math.quantileSeq(sortedData, 0.25), math.quantileSeq(sortedData, 0.5), math.quantileSeq(sortedData, 0.75)];
}

const variance = math.variance(datos);
console.log("Varianza:", variance);


const coefficientOfVariation = (stdDev / mean) * 100;
console.log("Coeficiente de Variación:", coefficientOfVariation);


const minValue = math.min(datos);
const maxValue = math.max(datos);
console.log("Mínimo:", minValue);
console.log("Máximo:", maxValue);

const amplitude = maxValue - minValue;
console.log("Amplitud:", amplitude);


const quartiles = [
  math.quantileSeq(datos.sort(), 0.25),
  math.quantileSeq(datos.sort(), 0.5),
  math.quantileSeq(datos.sort(), 0.75),
];
console.log("Cuartiles:", quartiles);

const IQR = quartiles[2] - quartiles[0];
console.log("Rango Intercuartílico (IQR):", IQR);


const frequencyDistribution = getFrequencyDistribution(datos);
console.log("Frequency Distribution:", frequencyDistribution);

function getFrequencyDistribution(data) {
  const counts = {};
  data.forEach(function (value) {
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
}


/* const histogram = getHistogram(datos, 5); // Adjust the number of bins as needed
console.log("Histogram:", histogram);
 */

  /* 
// Calcular estadísticas descriptivas

const debtStats = math.describe(debtAmounts);
console.log('Estadísticas de Adeudos:');
console.log(debtStats);

// Calcular la mediana
const medianDebt = math.median(debtAmounts);
console.log(`Mediana de Adeudos: ${medianDebt}`);

// Calcular el percentil 75
const percentile75Debt = math.percentileSeq(debtAmounts, 0.75);
console.log(`Percentil 75 de Adeudos: ${percentile75Debt}`);

// Realizar un análisis de frecuencia
const debtHistogram = math.histogram(debtAmounts, 'auto');
console.log('Histograma de Adeudos:');
console.log(debtHistogram);

// Identificar adeudos atípicos utilizando z-scores
const zScoresDebt = math.zScores(debtAmounts);
const outliersDebt = zScoresDebt.map((zScore, index) => ({ index, zScore })).filter(data => Math.abs(data.zScore) > 2);
console.log('Adeudos atípicos:');
console.log(outliersDebt.map(outlier => debtAmounts[outlier.index]));

// Calcular coeficiente de variación para medir la variabilidad relativa
const coefficientOfVariationDebt = math.std(debtAmounts) / math.mean(debtAmounts);
console.log(`Coeficiente de Variación de Adeudos: ${coefficientOfVariationDebt}`); */
  // Configuración del gráfico
  const chartOptions = {
    xaxis: {
      categories: [
        "Media",
        "Mediana",
        "Desviación Estándar",
        "Mínimo",
        "Máximo",
      ],
      labels: {
        style: {
          colors: ["#17E85D", "#17E85D", "#17E85D", "#17E85D", "#17E85D"],
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["#17E85D", "#17E85D", "#17E85D", "#17E85D", "#17E85D"],
        },
      },
    },
    dataLabels: {
      style: {
        colors: ["#17E85D", "#17E85D", "#17E85D", "#17E85D", "#17E85D"],
      },
    },
    x: {
      show: true,
      format: 'dd',
      
  },  
    tooltip:{
      enabled:true,
      theme:
        "dark"
      ,
    }
  };

  // Datos del gráfico
  const chartSeries = [
    {
      name: "Estadísticas",
      data: [media, mediana, desviacionEstandar, minimo, maximo],
    },
  ];
  return (
    <>
      <div>Charts</div>

      <Grid container spacing={2} >
        <Grid item xs={6}>
        <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
        style={{width:"100%"}}
      />

        </Grid>
        <Grid item xs={6}>
      

        </Grid>

      </Grid>
     
    </>
  );
}

export default Charts;
