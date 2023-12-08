import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { TipoPagos, TipoAdeudos } from "../Custom/types";

const GraficaDoughnut = ({ pagos, adeudos }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = (chartRef.current).getContext("2d");

    // Si ya hay una instancia de gráfica, destrúyela antes de crear una nueva
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    // Procesa los datos para la gráfica
    const datos = [pagos.length, adeudos.length];
    const etiquetas = ["Pagos", "Adeudos"];
    const colores = ["#36A2EB", "#FF6384"];

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: etiquetas,
        datasets: [
          {
            data: datos,
            backgroundColor: colores,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Estado de Pagos y Adeudos",
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

export default GraficaDoughnut;
