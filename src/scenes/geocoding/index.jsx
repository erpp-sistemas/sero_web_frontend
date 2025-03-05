import React, { useState, useRef } from "react";
import { Box, Button, Grid, Input, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  CloudUpload,
  Download,
  Search,
  Pause,
  PlayArrow,
  Cancel,
} from "@mui/icons-material";
import * as ExcelJS from "exceljs";
import CustomAlert from "../../components/CustomAlert.jsx";
import { getCoordinates } from "../../services/geocoding.service";
import LoadingModal from "../../components/LoadingModal.jsx";

const Geocoding = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [fileKey, setFileKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [observations, setObservations] = useState({});
  const isPausedRef = useRef(false);
  const isCancelledRef = useRef(false);
  const [, forceRender] = useState();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setSelectedFile(null);

    if (file) {
      const allowedExtensions = [".xlsx", ".xls"];
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));

      if (allowedExtensions.includes(fileExtension)) {
        readExcel(file);
      } else {
        e.target.value = "";
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage(
          "¡Error! el archivo seleccionado no es un archivo Excel valido (.xlsx o .xls)"
        );
        // Limpiar DataGrid
        setRows([]);
        setColumns([]);
      }
    } else {
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage("¡Error! Debes seleccionar un archivo Excel.");
      // Limpiar DataGrid
      setRows([]);
      setColumns([]);
    }

    setFileKey((prevKey) => prevKey + 1);
  };

  const readExcel = async (file) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];

      const json = [];
      let cols = [];
      let missingColumns = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          cols = row.values.slice(1).map((col, index) => ({
            field: index.toString(),
            headerName: col,
            width: 150,
          }));

          // Validar que las columnas sean "identificador" y "direccion"
          const requiredColumns = ["identificador", "direccion"];
          const fileColumns = cols.map((col) => col.headerName.toLowerCase());
          missingColumns = requiredColumns.filter(
            (col) => !fileColumns.includes(col)
          );

          if (missingColumns.length > 0 || cols.length !== 2) {
            setAlertOpen(true);
            setAlertType("error");
            setAlertMessage(
              "¡Error! El archivo Excel debe contener exactamente dos columnas: 'identificador' y 'direccion'."
            );
            // Limpiar DataGrid
            setRows([]);
            setColumns([]);
            return;
          }

          setColumns([
            ...cols,
            { field: "latitud", headerName: "Latitud", width: 150 },
            { field: "longitud", headerName: "Longitud", width: 150 },
            { field: "observacion", headerName: "Observaciones", width: 250 },
            { field: "progreso", headerName: "Progreso", width: 150 },
          ]);
        } else {
          const rowData = {};
          row.values.slice(1).forEach((cell, cellIndex) => {
            rowData[cellIndex.toString()] = cell;
          });
          json.push({ id: rowNumber, ...rowData, progreso: "Pendiente" });
        }
      });

      if (cols.length === 2 && missingColumns.length === 0) {
        setRows(json);
        setSelectedFile(file);
      }
    };
    setIsLoading(false);
    reader.readAsArrayBuffer(file);
  };

  const processGeocoding = async () => {
    if (!selectedFile) {
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage("¡Error! Debes seleccionar un archivo Excel.");
      return;
    }

    setIsProcessing(true);
    setProcessedCount(0);
    setObservations({});
    isPausedRef.current = false;
    isCancelledRef.current = false;

    let processedRows = 0;

    for (const row of rows) {
      if (isCancelledRef.current) {
        console.log("Proceso cancelado.");
        break; // Detener el proceso inmediatamente
      }

      while (isPausedRef.current) {
        console.log("Proceso pausado...");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Espera hasta que se reanude
      }

      const address = row["1"]; // Suponiendo que la dirección está en la segunda columna
      try {
        setRows((prevRows) =>
          prevRows.map((r) =>
            r.id === row.id ? { ...r, progreso: "En Progreso" } : r
          )
        );
        const coordinates = await getCoordinates(address);
        processedRows++;
        setProcessedCount(processedRows);

        const updatedRow = {
          ...row,
          latitud: coordinates.latitude,
          longitud: coordinates.longitude,
          observacion: coordinates.observation,
          progreso: "Completado",
        };

        setRows((prevRows) =>
          prevRows.map((r) => (r.id === row.id ? updatedRow : r))
        );

        setObservations((prevObservations) => ({
          ...prevObservations,
          [coordinates.observation]:
            (prevObservations[coordinates.observation] || 0) + 1,
        }));
      } catch (error) {
        console.error("Error al obtener coordenadas:", error);
        processedRows++;
        setProcessedCount(processedRows);

        setRows((prevRows) =>
          prevRows.map((r) =>
            r.id === row.id
              ? { ...r, latitud: "Error", longitud: "Error", progreso: "Error" }
              : r
          )
        );

        setObservations((prevObservations) => ({
          ...prevObservations,
          "Error al obtener coordenadas":
            (prevObservations["Error al obtener coordenadas"] || 0) + 1,
        }));
      }
    }

    setIsProcessing(false);
    forceRender({});
    console.log("Proceso finalizado.");
  };

  const handlePause = () => {
    isPausedRef.current = true;
    forceRender({});
  };

  const handleContinue = () => {
    isPausedRef.current = false;
    forceRender({});
  };

  const handleCancel = () => {
    isCancelledRef.current = true;
    isPausedRef.current = false;
    setIsProcessing(false);
    forceRender({});
  };

  const handleDownload = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Geocoding");

    worksheet.columns = columns.map((col) => ({
      header: col.headerName,
      key: col.field,
    }));
    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "geocoding_result.xlsx";
      link.click();
    });
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography
        variant="h3"
        sx={{
          color: colors.accentGreen[100],
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Geocoding
      </Typography>
      <LoadingModal open={isLoading} />
      <CustomAlert
        alertOpen={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />

      <Grid container alignItems="stretch" spacing={2}>
        <Grid item xs={12} md={2}>
          <Box>
            <label htmlFor="file-upload-excel">
              <Button
                variant="contained"
                component="span"
                color="primary"
                sx={{
                  bgcolor: "info.main",
                  borderRadius: "35px",
                  "&:hover": { bgcolor: "info.dark" },
                  width: "100%",
                }}
              >
                Seleccionar archivo
                <CloudUpload style={{ marginLeft: "5px" }} />
              </Button>
              <Input
                key={fileKey}
                accept=".xlsx, .xls"
                id="file-upload-excel"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Typography variant="body2">
                Archivo seleccionado:{" "}
                {selectedFile
                  ? selectedFile.name
                  : "Ningún archivo seleccionado"}
              </Typography>
            </label>
          </Box>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            sx={{
              width: "100%",
              backgroundColor: colors.searchButton[100],
              color: colors.contentSearchButton[100],
              borderRadius: "35px",
              boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)", // Sombra sutil
              ":hover": {
                backgroundColor: colors.searchButton[200],
                boxShadow: "0 8px 12px rgba(255, 255, 255, 0.2)",
              },
            }}
            onClick={processGeocoding}
            disabled={isProcessing}
          >
            <span
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: { xs: "0.875rem", sm: "1rem" }, // Ajuste de tamaño de texto en pantallas pequeñas
                fontWeight: "bold",
              }}
            >
              Generar Coordenadas
            </span>
            <Search sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="info"
            endIcon={<Download />}
            sx={{
              width: "100%",
              borderRadius: "35px",
              color: colors.contentAccentGreen[100],
              fontWeight: "bold",
            }}
            onClick={handleDownload}
          >
            Descargar Excel
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="warning"
            endIcon={<Pause />}
            sx={{
              width: "100%",
              borderRadius: "35px",
              color: colors.contentAccentGreen[100],
              fontWeight: "bold",
            }}
            onClick={handlePause}
            disabled={isPausedRef.current || !isProcessing}
          >
            Pausar
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="success"
            endIcon={<PlayArrow />}
            sx={{
              width: "100%",
              borderRadius: "35px",
              color: colors.contentAccentGreen[100],
              fontWeight: "bold",
            }}
            onClick={handleContinue}
            disabled={!isPausedRef.current || !isProcessing}
          >
            Continuar
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="error"
            endIcon={<Cancel />}
            sx={{
              width: "100%",
              borderRadius: "35px",
              color: colors.contentAccentGreen[100],
              fontWeight: "bold",
            }}
            onClick={handleCancel}
            disabled={!isProcessing}
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="body1">
          Progreso: {processedCount} de {rows.length} filas procesadas
        </Typography>
        <Box sx={{ marginTop: "10px" }}>
          {Object.entries(observations).map(([observation, count]) => (
            <Typography key={observation} variant="body2">
              {observation}: {count}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box sx={{ height: 400, width: "100%", marginTop: "20px" }}>
        <DataGrid
          rows={rows}
          columns={columns.map((column) => ({
            ...column,
            renderHeader: () => (
              <Typography
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                }}
              >
                {column.headerName}
              </Typography>
            ),
          }))}
          pageSize={5}
          sx={{
            borderRadius: "8px",
            boxShadow: 3,
            padding: 0,
            background: "rgba(128, 128, 128, 0.1)",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.accentGreen[100], // Color de fondo deseado
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            },
            "& .MuiDataGrid-footerContainer": {
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              backgroundColor: colors.accentGreen[100], // Fondo del footer (paginador)
              color: colors.contentSearchButton[100], // Color de texto dentro del footer
            },
            "& .MuiTablePagination-root": {
              color: colors.contentSearchButton[100], // Color del texto del paginador
            },
            // Estilos específicos para los íconos en el encabezado y pie de página
            "& .MuiDataGrid-columnHeaders .MuiSvgIcon-root, .MuiDataGrid-footerContainer .MuiSvgIcon-root":
              {
                color: colors.contentSearchButton[100], // Color de los íconos (flechas)
              },
            // Evitar que los íconos en las celdas se vean afectados
            "& .MuiDataGrid-cell .MuiSvgIcon-root": {
              color: "inherit", // No afectar el color de los íconos en las celdas
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Geocoding;
