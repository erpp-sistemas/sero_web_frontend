import { useState, useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { useTheme, Typography, Box } from "@mui/material";
import { tokens } from "../../theme";

const Legend = ({ data, height = 290, customColors }) => {
  const theme = useTheme();
  const color = tokens(theme.palette.mode);
  const chartContainerRef = useRef();

  const [total, setTotal] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [minValue, setMinValue] = useState(0);

  const colors = customColors || {
    backgroundColor: "rgba(128, 128, 128, 0)",
    lineColor: color.accentGreen[100],
    textColor: color.grey[100],
    areaTopColor: "#071d54",
    areaBottomColor: "rgba(153, 255, 153, 0.09)",
  };

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map((point) => point.value ?? point.close);
      setMaxValue(Math.max(...values));
      setMinValue(Math.min(...values));
    }
  }, [data]);

  useEffect(() => {
    const container = chartContainerRef.current;

    const chart = createChart(container, {
      layout: {
        background: { color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      watermark: {
        visible: true,
        fontSize: 24,
        horzAlign: "center",
        vertAlign: "top",
        color: color.accentGreen[100],
        text: "Pagos por dia",
      },
      grid: {
        vertLines: { color: "#334158" },
        horzLines: false,
      },
      width: container.clientWidth,
      height,
    });

    chart.timeScale().fitContent();

    const areaSeries = chart.addAreaSeries({
      lineColor: colors.lineColor,
      topColor: colors.areaTopColor,
      bottomColor: colors.areaBottomColor,
    });

    areaSeries.setData(data);

    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const seriesData = param.seriesData.get(areaSeries);
        const price = seriesData?.value ?? seriesData?.close ?? 0;
        setTotal(price);
      }
    });

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, colors, height]);

  const formatValue = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <Box sx={{ borderRadius: "10px", backgroundColor: colors.backgroundColor }}>
      <Box
        sx={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            color: colors.textColor,
          }}
        >
          {`Total pagado: ${formatValue(total)}`}
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            color: colors.textColor,
          }}
        >
          {`Valor máximo: ${formatValue(maxValue)}`}
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            color: colors.textColor,
          }}
        >
          {`Valor mínimo: ${formatValue(minValue)}`}
        </Typography>
      </Box>

      <div ref={chartContainerRef} style={{ width: "100%" }} />
    </Box>
  );
};

export default Legend;
