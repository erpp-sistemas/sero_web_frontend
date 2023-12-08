import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import useStore from "../store/useStore.";
import { dateConverter } from "../../helpers/dateConverter";

const GraficaBarrasAgrupadas = () => {
  const store = useStore()
  const pagos = store.pagos
  const adeudos = store.adeudos
  
  const chartRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Si ya hay una instancia de gráfica, destrúyela antes de crear una nueva
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Procesa los datos para la gráfica
    const fechas = pagos?.map((pago) => dateConverter(pago.fechaDePago) );
    const pagosData = pagos?.map((pago) => pago.montoPagado);
    const adeudosData = adeudos.map((adeudo) => adeudo.debtAmount);
    console.log(adeudosData);

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: fechas,
        datasets: [
          {
            label: "Pagos",
            data: pagosData,
            backgroundColor: "#36A2EB",
            borderWidth: 1,
          },
          {
            label: "Adeudos",
            data: adeudosData,
            backgroundColor: "#FF6384",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            stacked: false,
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Comparación de Pagos y Adeudos por Fecha",
          },
        },
      },
    });
  }, [pagos, adeudos]);

  return (
    <div style={{ maxWidth: "400px" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default GraficaBarrasAgrupadas;
