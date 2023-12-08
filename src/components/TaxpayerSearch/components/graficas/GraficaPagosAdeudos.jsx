import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

const GraficaPagosAdeudos = ({
  pagos,
  adeudos,
}) => {
  const chartRef = useRef();

  useEffect(() => {
    const ctx = (chartRef.current).getContext("2d");

    // Procesa los datos para la gráfica
    const labels = pagos?.map((pago) => pago.fechaDePago);
    const pagosData = pagos?.map((pago) => pago.montoPagado);
    const adeudosData = adeudos.map((adeudo) => adeudo.montoAdeudo);

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Pagos",
            data: pagosData,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Adeudos",
            data: adeudosData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
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

export default GraficaPagosAdeudos;
