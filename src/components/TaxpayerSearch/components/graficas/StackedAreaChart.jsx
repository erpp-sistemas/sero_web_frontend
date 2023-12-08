import React from "react";
import Chart from "react-apexcharts";
import useStore from "../store/useStore.";


const StackedAreaChart = () => {
  const store = useStore()
  const adeudos = store.adeudos
  const pagos = store.pagos
  const categories = adeudos.map((item) => item.updateDate);
  const seriesAdeudo = adeudos.map((item) => item.debtAmount);
  const seriesPagos = pagos?.map((item) => item.montoPagado);

  const chartOptions = {
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: "Monto",
      },
    },
    stroke: {

      width: 1,
    },
  };

  const chartSeries = [
    {
      name: "Adeudo",
      data: seriesAdeudo,
      color: "#ff6384"

    },
    {
      name: "Pagos",
      data: seriesPagos,
      color: "#48bd98"
    },
  ];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="area"
      height={350}
    />
  );
};

export default StackedAreaChart;
