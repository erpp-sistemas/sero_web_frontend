import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import GetAppIcon from "@mui/icons-material/GetApp";
import * as ExcelJS from "exceljs";
import TopColoniasChart from "./PaymentsByTypeOfService/TopColoniasChart.jsx";
import TopColoniasTable from "./PaymentsByTypeOfService/TopColoniasTable.jsx";
import { tokens } from "../../theme";
import {  
  useTheme,
} from "@mui/material";

function PaymentsByTypeOfService({ data }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [topColoniasByType, setTopColoniasByType] = useState({});

  // useEffect para configurar los tipos únicos y reiniciar el estado cuando cambie `data`
  useEffect(() => {
    if (data) {
      setUniqueTypes(
        [...new Set(data.map((item) => item.tipo_servicio))].sort()
      );
      resetState(); // Llamamos a la función de reinicio del estado
    }
  }, [data]);

  // Función para reiniciar el estado
  const resetState = () => {
    setSelectedTypes([]);
    setTopColoniasByType({});
  };

  // Función para manejar los clics en los chips
  const handleChipClick = (type) => {
    setSelectedTypes((prevSelected) =>
      prevSelected.includes(type)
        ? prevSelected.filter((t) => t !== type)
        : [...prevSelected, type]
    );

    setTopColoniasByType((prevTopColonias) => {
      if (prevTopColonias[type]) {
        const { [type]: _, ...rest } = prevTopColonias;
        return rest;
      } else {
        const coloniasSumadas = data
          .filter((item) => item.tipo_servicio === type)
          .reduce((acc, item) => {
            if (!acc[item.colonia]) {
              acc[item.colonia] = { total: 0, count: 0 };
            }
            acc[item.colonia].total += item.total;
            acc[item.colonia].count += 1;
            return acc;
          }, {});

        const topColonias = Object.entries(coloniasSumadas)
          .map(([colonia, { total, count }]) => ({
            colonia,
            total,
            count,
            promedio: count ? total / count : 0,
          }))
          .sort((a, b) => b.promedio - a.promedio)
          .slice(0, 10);

        return { ...prevTopColonias, [type]: topColonias };
      }
    });
  };

  const exportToExcel = async () => {
    if (selectedTypes.length === 0) {
      return;
    }

    const workbook = new ExcelJS.Workbook();

    selectedTypes.forEach((type) => {
      const worksheet = workbook.addWorksheet(type);

      worksheet.columns = [
        { header: "Colonia", key: "colonia", width: 25 },
        { header: "Cuentas", key: "count", width: 10 },
        {
          header: "Total",
          key: "total",
          width: 15,
          style: { numFmt: '"$"#,##0.00_);("$"#,##0.00)' },
        },
      ];

      // Aplicar estilo a las cabeceras
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4F81BD" }, // Fondo azul para cabeceras
        };
      });

      // Obtener y ordenar todas las colonias por total de mayor a menor
      const allColonias = data
        .filter((item) => item.tipo_servicio === type)
        .reduce((acc, item) => {
          if (!acc[item.colonia]) {
            acc[item.colonia] = { total: 0, count: 0 };
          }
          acc[item.colonia].total += item.total;
          acc[item.colonia].count += 1;
          return acc;
        }, {});

      const coloniaArray = Object.entries(allColonias)
        .map(([colonia, { total, count }]) => ({ colonia, total, count }))
        .sort((a, b) => b.total - a.total); // Ordenar por total de mayor a menor

      // Identificar las top 10 colonias para aplicar estilo de resaltado
      const top10Colonias = coloniaArray
        .slice(0, 10)
        .map((colonia) => colonia.colonia);

      // Agregar las colonias ordenadas al worksheet
      coloniaArray.forEach((colonia) => {
        const row = worksheet.addRow({
          colonia: colonia.colonia || "Sin nombre",
          count: colonia.count,
          total: colonia.total,
        });

        // Aplicar color si es una de las top 10
        if (top10Colonias.includes(colonia.colonia)) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFD966" }, // Fondo amarillo para destacar top 10
            };
          });
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PaymentsByTypeOfService.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        {uniqueTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            clickable
            color={selectedTypes.includes(type) ? "secondary" : "default"}
            onClick={() => handleChipClick(type)}
          />
        ))}
      </Stack>

      <Box mt={2} mb={2} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          color="warning"
          onClick={exportToExcel}
          style={{ marginLeft: "16px" }}
          startIcon={<GetAppIcon />}
        >
          Exportar en Excel
        </Button>
      </Box>

      {selectedTypes.length > 0 && (
        <div>
          <Grid container spacing={2}>
            {selectedTypes.map((type) => {
              const totalData =
                topColoniasByType[type]
                  ?.slice()
                  .sort((a, b) => b.total - a.total)
                  .map((colonia) => ({
                    x: colonia.colonia || "Sin nombre",
                    y: colonia.total,
                  })) || [];

              const countData =
                topColoniasByType[type]
                  ?.slice()
                  .sort((a, b) => b.count - a.count)
                  .map((colonia) => ({
                    x: colonia.colonia || "Sin nombre",
                    y: colonia.count,
                  })) || [];

                console.log(countData)

              return (
                <Grid container key={type}>
                  <Grid item xs={12} sm={4}>
                    <TopColoniasChart
                      data={[{ id: type, data: totalData }]}
                      title={`Total Pagado por Tipo de Servicio: ${type}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TopColoniasChart
                      data={[{ id: type, data: countData }]}
                      title={`Cuentas Pagadas por Tipo de Servicio: ${type}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TopColoniasTable
                      type={type}
                      topColonias={topColoniasByType[type] || []}
                    />
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </div>
      )}
    </div>
  );
}

export default PaymentsByTypeOfService;
