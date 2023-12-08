import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const GraficaBarrasApiladas = ({ pagos, adeudos }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = (chartRef.current).getContext("2d");

    // Si ya hay una instancia de gráfica, destrúyela antes de crear una nueva
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Procesa los datos para la gráfica
    const fechas = pagos?.map((pago) => pago.fechaDePago);
    const pagosData = pagos?.map((pago) => pago.montoPagado);
    const adeudosData = adeudos.map((adeudo) => adeudo.montoAdeudo);

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
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Evolución de Pagos y Adeudos",
          },
        },
      },
    });
  }, [pagos, adeudos]);

  return (
    <div style={{ maxWidth: "600px" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default GraficaBarrasApiladas;
