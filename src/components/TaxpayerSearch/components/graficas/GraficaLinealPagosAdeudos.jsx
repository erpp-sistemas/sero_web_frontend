import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";


const GraficaEvolucionPagosAdeudos = ({ pagos, adeudos }) => {
  const chartRef = useRef();

  useEffect(() => {
    const ctx = (chartRef.current).getContext("2d");

    // Procesa los datos para la gráfica
    const labels = pagos?.map((pago) => pago.fechaDePago);
    const pagosData = pagos?.map((pago) => pago.montoPagado);
    const adeudosData = adeudos.map((adeudo) => adeudo.montoAdeudo);

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Pagos",
            data: pagosData,
            fill: false,
            borderColor: "rgba(75, 192, 192, 1)",

          },
          {
            label: "Adeudos",
            data: adeudosData,
            fill: false,
            borderColor: "rgba(255, 99, 132, 1)",

          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [pagos, adeudos]);

  return (
    <div style={{ maxWidth: "600px" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default GraficaEvolucionPagosAdeudos;