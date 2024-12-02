import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { tokens } from "../../theme";
import PlaceSelect from "../../components/PlaceSelect";
import ServiceSelect from "../../components/ServiceSelect";
import ProcessSelect from "../../components/ProcessSelectMultipleChip";
import { validPaymentRequest } from "../../api/payment.js";
import { useSelector } from "react-redux";
import {
  Box,
  useTheme,
  Button,
  InputAdornment,
  Typography,
  Card,
  CardMedia,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import * as ExcelJS from "exceljs";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import SecondSection from "../../components/ValidPayment/SecondSection.jsx";
import ThirdSection from "../../components/ValidPayment/ThirdSection.jsx";
import ClasificacionesSection from "../../components/ValidPayment/ClasificacionesSection.jsx";
import StatCards from "../../components/ValidPayment/StatCards.jsx";
import PaymentsDay from "../../components/ValidPayment/PaymentsDay.jsx";
import { Download, Search } from "@mui/icons-material";
import PhotoViewModal from "../../components/PhotoManagement/PhotoViewModal.jsx";

const Index = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.user);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedProcess, setSelectedProcess] = useState([]);
  const [selectedValidDays, setSelectedValidDays] = React.useState("");
  const [selectedStartDate, setSelectedStartDate] = React.useState("");
  const [selectedFinishDate, setSelectedFinishDate] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [columns, setColumns] = useState([]);

  const [resultOriginal, setResultOriginal] = useState([]);
  const [result, setResult] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [typeFilter, setTypeFilter] = useState(0);
  const [titleFilter, setTitleFilter] = useState("");
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
  const [countResult, setCountResult] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [countUniqueAccount, setCountUniqueAccount] = useState(0);
  const [paymentDateRange, setPaymentDateRange] = useState("1999-09-09");
  const [countValidProcedures, setCountValidProcedures] = useState(0);
  const [countInvalidProcedures, setCountInvalidProcedures] = useState(0);
  const [percentageValidProcedures, setPercentageValidProcedures] = useState(0);
  const [percentageInvalidProcedures, setPercentageInvalidProcedures] =
    useState(0);
  const [amountValidProcedures, setAmountValidProcedures] = useState(0);
  const [amountInvalidProcedures, setAmountInvalidProcedures] = useState(0);
  const [percentageAmountValidProcedures, setPercentageAmountValidProcedures] =
    useState(0);
  const [
    percentageAmountInvalidProcedures,
    setPercentageAmountInvalidProcedures,
  ] = useState(0);
  const [countNoPosition, setCountNoPosition] = useState(0);
  const [percentageCountNoPosition, setPercentageCountNoPosition] = useState(0);
  const [countWithoutPropertyPhoto, setCountWithoutPropertyPhoto] = useState(0);
  const [countWithoutEvidencePhoto, setCountWithoutEvidencePhoto] = useState(0);
  const [countPropertyNotLocated, setCountPropertyNotLocated] = useState(0);
  const [
    percentageCountWithoutPropertyPhoto,
    setPercentageCountWithoutPropertyPhoto,
  ] = useState(0);
  const [
    percentageCountWithoutEvidencePhoto,
    setPercentageCountWithoutEvidencePhoto,
  ] = useState(0);
  const [
    percentageCountPropertyNotLocated,
    setPercentageCountPropertyNotLocated,
  ] = useState(0);

  const initialClasificaciones = [
    { rango: "De 1 a 1 mil", total_pagado: 0, cuentas_pagadas: 0 },
    { rango: "De 1 a 5 mil", total_pagado: 0, cuentas_pagadas: 0 },
    { rango: "De 5 a 10 mil", total_pagado: 0, cuentas_pagadas: 0 },
    { rango: "De 10 a 25 mil", total_pagado: 0, cuentas_pagadas: 0 },
    { rango: "De 25 a 50 mil", total_pagado: 0, cuentas_pagadas: 0 },
    { rango: "De 50 a 100 mil", total_pagado: 0, cuentas_pagadas: 0 },
    { rango: "De 100 a 500 mil", total_pagado: 0, cuentas_pagadas: 0 },
    { rango: "Mayor a 500 mil", total_pagado: 0, cuentas_pagadas: 0 },
  ];

  const [clasificaciones, setClasificaciones] = useState(
    initialClasificaciones
  );

  const [paymentsChartData, setPaymentsChartData] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState([]);

  const handleOpenModal = (rowData) => {
    setSelectedRow(rowData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setOpenModal(false);
  };

  const handleImageUrlUpdate = (response_photo) => {
    setNewImageUrl(response_photo);
    const photo_field = response_photo.celda;
    const photo_field_exists =
      photo_field.replace(/_\d$/, "").replace(/_/g, " ") + " predio";

    setResultOriginal((prev) =>
      prev.map((row) =>
        row.id_registro === selectedRow.id_registro
          ? {
              ...row,
              [photo_field]: response_photo.image_url,
              [`id_${photo_field}`]: response_photo.photo_record_id,
              [photo_field_exists]: "si",
            }
          : row
      )
    );

    setFilteredResult((prev) =>
      prev.map((row) =>
        row.id_registro === selectedRow.id_registro
          ? {
              ...row,
              [photo_field]: response_photo.image_url,
              [`id_${photo_field}`]: response_photo.photo_record_id,
              [photo_field_exists]: "si",
            }
          : row
      )
    );

    setResult((prev) =>
      prev.map((row) =>
        row.id_registro === selectedRow.id_registro
          ? {
              ...row,
              [photo_field]: response_photo.image_url,
              [`id_${photo_field}`]: response_photo.photo_record_id,
              [photo_field_exists]: "si",
            }
          : row
      )
    );

    handleFilteredRows(typeFilter);
  };

  const handlePlaceChange = (event) => {
    setSelectedPlace(event.target.value);
    setSelectedService("");
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    setSelectedProcess([]);
  };

  const handleProcessChange = (event) => {
    setSelectedProcess(
      Array.isArray(event.target.value)
        ? event.target.value
        : [event.target.value]
    );
  };

  const handleValidDaysChange = (event) => {
    setSelectedValidDays(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setSelectedStartDate(event.target.value);
  };

  const handleFinishDateChange = (event) => {
    setSelectedFinishDate(event.target.value);
  };

  const handleGetValidPayment = async () => {
    try {
      if (!selectedPlace) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar una plaza");
        return;
      } else if (!selectedService) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar un servicio");
        return;
      } else if (selectedProcess.length === 0) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar uno o mas procesos");
        return;
      } else if (!selectedValidDays) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar un rango de dias");
        return;
      } else if (!selectedStartDate) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar una fecha de inicio");
        return;
      } else if (!selectedFinishDate) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar una fecha final");
        return;
      }

      setIsLoading(true);

      const type = 1;

      const response = await validPaymentRequest(
        selectedPlace,
        selectedService,
        selectedProcess,
        selectedValidDays,
        selectedStartDate,
        selectedFinishDate,
        type
      );

      setResultOriginal(response.data);
      setTypeFilter(1);
      setTitleFilter("Registros Encontrados");

      setIsLoading(false);

      setAlertOpen(true);
      setAlertType("success");
      setAlertMessage("¡Felicidades! Se genero el proceso correctamente");
    } catch (error) {
      setIsLoading(false);

      if (error.response.status === 400) {
        setAlertOpen(true);
        setAlertType("warning");
        setAlertMessage("¡Atencion! No se encontraron pagos");
        setResult([]);
      }
      setResult([]);
    }
  };

  useEffect(() => {
    if (!resultOriginal || resultOriginal.length === 0) return;

    const fechas = resultOriginal.map(
      (item) => new Date(item["fecha de pago"])
    );

    const fechaMasGrande = new Date(
      Math.max(...fechas.map((fecha) => fecha.getTime()))
    );
    const fechaMasChica = new Date(
      Math.min(...fechas.map((fecha) => fecha.getTime()))
    );

    const opciones = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    };
    const fechaMayorFormateada = fechaMasGrande.toLocaleDateString(
      "es-ES",
      opciones
    );
    const fechaMenorFormateada = fechaMasChica.toLocaleDateString(
      "es-ES",
      opciones
    );

    setPaymentDateRange(`${fechaMenorFormateada} - ${fechaMayorFormateada}`);

    let countPayments = 0;

    let totalSum = 0;
    const uniqueAccounts = new Set();

    let validaCount = 0;
    let noValidaCount = 0;

    let validaTotal = 0;
    let noValidaTotal = 0;

    let countLatitudCeroAndValid = 0;

    let countFotoFachadaNoAndValid = 0;
    let countFotoEvidenciaNoAndValid = 0;
    let countEstatusPredioNoLocalizadoAndValid = 0;

    setClasificaciones([...initialClasificaciones]);
    // Definir la clasificación como estado
    const updatedClasificaciones = [...initialClasificaciones];

    // Inicializar un objeto temporal para agrupar fechas y sumar total_pagado
    const groupedData = {};

    resultOriginal.forEach((item) => {
      totalSum +=
        selectedPlace === 2 && selectedService === 2
          ? item.total_pagado
          : item.total_pagado;
      uniqueAccounts.add(item.cuenta);

      if (item["estatus de gestion valida"] === "valida") {
        validaCount++;
        validaTotal +=
          selectedPlace === 2 && selectedService === 2
            ? item.total_pagado
            : item.total_pagado;

        // Clasificación por rango de total_pagado
        if (item.total_pagado > 0 && item.total_pagado <= 1000) {
          updatedClasificaciones[0].total_pagado += item.total_pagado;
          updatedClasificaciones[0].cuentas_pagadas += 1;
        } else if (item.total_pagado > 1000 && item.total_pagado <= 5000) {
          updatedClasificaciones[1].total_pagado += item.total_pagado;
          updatedClasificaciones[1].cuentas_pagadas += 1;
        } else if (item.total_pagado > 5000 && item.total_pagado <= 10000) {
          updatedClasificaciones[2].total_pagado += item.total_pagado;
          updatedClasificaciones[2].cuentas_pagadas += 1;
        } else if (item.total_pagado > 10000 && item.total_pagado <= 25000) {
          updatedClasificaciones[3].total_pagado += item.total_pagado;
          updatedClasificaciones[3].cuentas_pagadas += 1;
        } else if (item.total_pagado > 25000 && item.total_pagado <= 50000) {
          updatedClasificaciones[4].total_pagado += item.total_pagado;
          updatedClasificaciones[4].cuentas_pagadas += 1;
        } else if (item.total_pagado > 50000 && item.total_pagado <= 100000) {
          updatedClasificaciones[5].total_pagado += item.total_pagado;
          updatedClasificaciones[5].cuentas_pagadas += 1;
        } else if (item.total_pagado > 100000 && item.total_pagado <= 500000) {
          updatedClasificaciones[6].total_pagado += item.total_pagado;
          updatedClasificaciones[6].cuentas_pagadas += 1;
        } else if (item.total_pagado > 500000) {
          updatedClasificaciones[7].total_pagado += item.total_pagado;
          updatedClasificaciones[7].cuentas_pagadas += 1;
        }

        // Obtener la fecha sin hora
        const paymentDate = new Date(item["fecha de pago"])
          .toISOString()
          .split("T")[0];

        // Si la fecha ya existe en el objeto, sumar el total_pagado
        if (groupedData[paymentDate]) {
          groupedData[paymentDate] += item.total_pagado;
        } else {
          // Si la fecha no existe, inicializar con el valor de total_pagado
          groupedData[paymentDate] = item.total_pagado;
        }

        if (item.latitud === 0) {
          countLatitudCeroAndValid++;
        }

        if (item["foto fachada predio"] === "no") {
          countFotoFachadaNoAndValid++;
        }

        if (item["foto evidencia predio"] === "no") {
          countFotoEvidenciaNoAndValid++;
        }

        if (item["estatus_predio"] !== "Predio localizado") {
          countEstatusPredioNoLocalizadoAndValid++;
        }
      } else {
        noValidaCount++;
        noValidaTotal +=
          selectedPlace === 2 && selectedService === 2
            ? item.total_pagado
            : item.total_pagado;
      }
    });

    // Convertir el objeto agrupado en un array y ordenarlo por fecha
    const chartData = Object.keys(groupedData)
      .map((date) => ({
        time: date, // Formato requerido por lightweight-charts
        value: groupedData[date], // El total pagado en esa fecha
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time)); // Ordenar por fecha

    countPayments = resultOriginal.length;
    totalSum = Number(totalSum.toFixed(2));

    const uniqueCount = uniqueAccounts.size;

    const validaPercentage = (validaCount / countPayments) * 100;
    const noValidaPercentage = (noValidaCount / countPayments) * 100;

    const totalValidaPercentage = (validaTotal / totalSum) * 100;
    const totalNoValidaPercentage = (noValidaTotal / totalSum) * 100;

    const noPositionPercentage =
      (countLatitudCeroAndValid / countPayments) * 100;

    const fotoFachadaNoAndValidPercentage =
      (countFotoFachadaNoAndValid / countPayments) * 100;
    const fotoEvidenciaNoAndValidPercentage =
      (countFotoEvidenciaNoAndValid / countPayments) * 100;
    const estatusPredioNoLocalizadoAndValidPercentage =
      (countEstatusPredioNoLocalizadoAndValid / countPayments) * 100;

    setCountResult(countPayments.toLocaleString());
    setTotalAmount(totalSum.toLocaleString());
    setCountUniqueAccount(uniqueCount.toLocaleString());
    setCountValidProcedures(validaCount.toLocaleString());
    setCountInvalidProcedures(noValidaCount.toLocaleString());
    setPercentageValidProcedures(validaPercentage.toFixed(2));
    setPercentageInvalidProcedures(noValidaPercentage.toFixed(2));
    setAmountValidProcedures(validaTotal.toLocaleString());
    setAmountInvalidProcedures(noValidaTotal.toLocaleString());
    setPercentageAmountValidProcedures(totalValidaPercentage.toFixed(2));
    setPercentageAmountInvalidProcedures(totalNoValidaPercentage.toFixed(2));
    setCountNoPosition(countLatitudCeroAndValid.toLocaleString());
    setPercentageCountNoPosition(noPositionPercentage.toFixed(2));
    setCountWithoutPropertyPhoto(countFotoFachadaNoAndValid.toLocaleString());
    setCountWithoutEvidencePhoto(countFotoEvidenciaNoAndValid.toLocaleString());
    setCountPropertyNotLocated(
      countEstatusPredioNoLocalizadoAndValid.toLocaleString()
    );
    setPercentageCountWithoutPropertyPhoto(
      fotoFachadaNoAndValidPercentage.toFixed(2)
    );
    setPercentageCountWithoutEvidencePhoto(
      fotoEvidenciaNoAndValidPercentage.toFixed(2)
    );
    setPercentageCountPropertyNotLocated(
      estatusPredioNoLocalizadoAndValidPercentage.toFixed(2)
    );

    // Actualiza el estado de clasificaciones
    setClasificaciones(updatedClasificaciones);

    setPaymentsChartData(chartData);

    handleFilteredRows(typeFilter);
    console.log(typeFilter);
  }, [resultOriginal]);

  const handleExportToExcel = async (filter) => {
    try {
      setIsLoading(true);
      console.log(filter);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");

      const headers = Object.keys(resultOriginal[0]);
      worksheet.addRow(headers);

      if (filter === 1) {
        resultOriginal.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
      } else if (filter === 2) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            const values = headers.map((header) => row[header]);
            worksheet.addRow(values);
          }
        });
      } else if (filter === 3) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] !== "valida") {
            const values = headers.map((header) => row[header]);
            worksheet.addRow(values);
          }
        });
      } else if (filter === 4) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row.latitud === 0) {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 5) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["foto fachada predio"] === "no") {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 6) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["foto evidencia predio"] === "no") {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 7) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["estatus_predio"] !== "Predio localizado") {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 8) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["total_pagado"] > 0 && row["total_pagado"] <= 100) {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 9) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["total_pagado"] > 1000 && row["total_pagado"] <= 5000) {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 10) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["total_pagado"] > 5000 && row["total_pagado"] <= 10000) {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 11) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["total_pagado"] > 10000 && row["total_pagado"] <= 25000) {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 12) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["total_pagado"] > 25000 && row["total_pagado"] <= 50000) {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 13) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["total_pagado"] > 50000 && row["total_pagado"] <= 100000) {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 14) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["total_pagado"] > 100000 && row["total_pagado"] <= 500000) {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      } else if (filter === 15) {
        resultOriginal.forEach((row) => {
          if (row["estatus de gestion valida"] === "valida") {
            if (row["total_pagado"] > 500000) {
              const values = headers.map((header) => row[header]);
              worksheet.addRow(values);
            }
          }
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Pagos validos.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleExportToExcelFull = async () => {
    try {
      setIsLoading(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");

      const headers = Object.keys(resultOriginal[0]);
      worksheet.addRow(headers);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Pagos validos.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleExportToExcelDataGrid = async () => {
    try {
      setIsLoading(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");

      //const headers = Object.keys(resultOriginal[0]);
      //worksheet.addRow(headers);

      if (filteredResult.length > 0) {
        const headers = Object.keys(filteredResult[0]);
        worksheet.addRow(headers);

        filteredResult.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
      } else {
        const headers = Object.keys(result[0]);
        worksheet.addRow(headers);

        result.forEach((row) => {
          const values = headers.map((header) => row[header]);
          worksheet.addRow(values);
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Pagos_Validos.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton
          color="info"
          variant="contained"
          sx={{
            borderRadius: "35px",
            color: "white",
            margin: "5px",
          }}
        >
          Columnas
        </GridToolbarColumnsButton>
      </GridToolbarContainer>
    );
  }

  const buildColumns = () => {
    if (result.length > 0) {
      const firstRow = result[0];
      const dynamicColumns = Object.keys(firstRow)
        .map((key) => {
          if (key === "id") {
            return null;
          }

          if (key === "foto fachada predio") {
            return {
              field: key,
              headerName: key.toUpperCase(),
              renderCell: (params) => (
                <Chip
                  icon={
                    params.value === "si" ? (
                      <CheckCircleIcon style={{ color: "green" }} />
                    ) : (
                      <ErrorIcon style={{ color: "red" }} />
                    )
                  }
                  label={params.value}
                  color={params.value === "si" ? "secondary" : "error"}
                  variant="outlined"
                />
              ),
              width: 170,
            };
          }

          if (key === "foto evidencia predio") {
            return {
              field: key,
              headerName: key.toUpperCase(),
              renderCell: (params) => (
                <Chip
                  icon={
                    params.value === "si" ? (
                      <CheckCircleIcon style={{ color: "green" }} />
                    ) : (
                      <ErrorIcon style={{ color: "red" }} />
                    )
                  }
                  label={params.value}
                  color={params.value === "si" ? "secondary" : "error"}
                  variant="outlined"
                />
              ),
              width: 170,
            };
          }

          if (key === "estatus de gestion valida") {
            return {
              field: key,
              headerName: key.toUpperCase(),
              renderCell: (params) => (
                <Chip
                  icon={
                    params.value === "valida" ? (
                      <CheckCircleIcon style={{ color: "green" }} />
                    ) : (
                      <ErrorIcon style={{ color: "red" }} />
                    )
                  }
                  label={params.value}
                  color={params.value === "valida" ? "secondary" : "error"}
                  variant="outlined"
                />
              ),
              width: 150,
            };
          }

          if (key === "foto_fachada_1") {
            return {
              field: key,
              headerName: key.toUpperCase(),
              width: 150,
              renderCell: (params) =>
                params.row.foto_fachada_1 ? (
                  <Card
                    sx={{
                      maxWidth: 150,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      border: "2px solid #5EBFFF",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                      image={params.row.foto_fachada_1}
                      alt="Foto fachada 1"
                      sx={{
                        objectFit: "cover",
                      }}
                      onClick={() =>
                        handleOpenModal({
                          cuenta: params.row.cuenta,
                          id_registro: params.row.id_registro,
                          id_registro_foto: params.row.id_foto_fachada_1,
                          foto: params.row.foto_fachada_1,
                          tarea_gestionada: params.row.tarea_gestionada,
                          nombre_gestor: params.row.gestor,
                          fecha_gestion: params.row.fecha_de_gestion,
                          proceso: params.row.proceso,
                          tipo: params.row.tipo_foto_fachada_1,
                          num_foto: 1,
                          celda: "foto_fachada_1",
                        })
                      }
                    />
                  </Card>
                ) : (
                  <Typography>No disponible</Typography>
                ),
            };
          }

          if (key === "foto_evidencia_1") {
            return {
              field: key,
              headerName: key.toUpperCase(),
              width: 150,
              renderCell: (params) =>
                params.row.foto_evidencia_1 ? (
                  <Card
                    sx={{
                      maxWidth: 150,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      border: "2px solid #5EBFFF",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                      image={params.row.foto_evidencia_1}
                      alt="Foto evidencia 1"
                      sx={{
                        objectFit: "cover",
                      }}
                      onClick={() =>
                        handleOpenModal({
                          cuenta: params.row.cuenta,
                          id_registro: params.row.id_registro,
                          id_registro_foto: params.row.id_foto_evidencia_1,
                          foto: params.row.foto_evidencia_1,
                          tarea_gestionada: params.row.tarea_gestionada,
                          nombre_gestor: params.row.gestor,
                          fecha_gestion: params.row.fecha_de_gestion,
                          proceso: params.row.proceso,
                          tipo: params.row.tipo_foto_evidencia_1,
                          num_foto: 1,
                          celda: "foto_evidencia_1",
                        })
                      }
                    />
                  </Card>
                ) : (
                  <Typography>No disponible</Typography>
                ),
            };
          }

          return {
            field: key,
            headerName: key.toUpperCase(),
            width: 210,
            editable: false,
          };
        })
        .filter((column) => column !== null);

      setColumns(dynamicColumns);
    }
  };

  useEffect(() => {
    buildColumns();
  }, [result]);

  const handleFilteredRows = (type) => {
    if (type === 1) {
      setResult(resultOriginal);
      setTypeFilter(1);
      setTitleFilter("Registros Encontrados");
    } else if (type === 2) {
      setResult(
        resultOriginal.filter(
          (row) => row["estatus de gestion valida"] === "valida"
        )
      );
      setTypeFilter(2);
      setTitleFilter("Gestiones Validas");
    } else if (type === 3) {
      setResult(
        resultOriginal.filter(
          (row) => row["estatus de gestion valida"] === "no valida"
        )
      );
      setTypeFilter(3);
      setTitleFilter("Gestiones no validas");
    } else if (type === 4) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" && row.latitud === 0
        )
      );
      setTypeFilter(4);
      setTitleFilter("Registros sin posicion");
    } else if (type === 5) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["foto fachada predio"] === "no"
        )
      );
      setTypeFilter(5);
      setTitleFilter("Registros sin foto de fachada");
    } else if (type === 6) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["foto evidencia predio"] === "no"
        )
      );
      setTypeFilter(6);
      setTitleFilter("Registros sin foto de evidencia");
    } else if (type === 7) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["estatus_predio"] !== "Predio localizado"
        )
      );
      setTypeFilter(7);
      setTitleFilter("Registro de predios no localizados");
    } else if (type === 8) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["total_pagado"] > 0 &&
            row["total_pagado"] <= 1000
        )
      );
      setTypeFilter(8);
      setTitleFilter("Registro de 1 a 1 mil");
    } else if (type === 9) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["total_pagado"] > 1000 &&
            row["total_pagado"] <= 5000
        )
      );
      setTypeFilter(9);
      setTitleFilter("Registro de 1 a 5 mil");
    } else if (type === 10) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["total_pagado"] > 5000 &&
            row["total_pagado"] <= 10000
        )
      );
      setTypeFilter(10);
      setTitleFilter("Registro de 5 a 10 mil");
    } else if (type === 11) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["total_pagado"] > 10000 &&
            row["total_pagado"] <= 25000
        )
      );
      setTypeFilter(11);
      setTitleFilter("Registro de 10 a 25 mil");
    } else if (type === 12) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["total_pagado"] > 25000 &&
            row["total_pagado"] <= 50000
        )
      );
      setTypeFilter(12);
      setTitleFilter("Registro de 25 a 50 mil");
    } else if (type === 13) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["total_pagado"] > 50000 &&
            row["total_pagado"] <= 100000
        )
      );
      setTypeFilter(13);
      setTitleFilter("Registro de 50 a 100 mil");
    } else if (type === 14) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["total_pagado"] > 100000 &&
            row["total_pagado"] <= 500000
        )
      );
      setTypeFilter(14);
      setTitleFilter("Registro de 100 a 500 mil");
    } else if (type === 15) {
      setResult(
        resultOriginal.filter(
          (row) =>
            row["estatus de gestion valida"] === "valida" &&
            row["total_pagado"] > 500000
        )
      );
      setTypeFilter(15);
      setTitleFilter("Registro de 500 mil");
    }
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  useEffect(() => {
    let filtered = result;

    if (filterText) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            value != null &&
            value.toString().toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }

    setFilteredResult(filtered);
    setShowNoResultsMessage(filtered.length === 0 && filterText.length > 0);
  }, [result, filterText]);

  return (
    <Box
      sx={{
        padding: "10px",
      }}
    >
      <Box
        m="0 0"
        display="flex"
        justifyContent="space-evenly"
        flexWrap="wrap"
        gap="20px"
        sx={{ backgroundColor: colors.primary[400], width: "100%" }}
        padding="15px 10px"
        borderRadius="10px"
      >
        <LoadingModal open={isLoading} />
        <CustomAlert
          alertOpen={alertOpen}
          type={alertType}
          message={alertMessage}
          onClose={setAlertOpen}
        />
        <Grid container xs={12} md={12} spacing={2}>
          <Grid item xs={12} md={4}>
            <PlaceSelect
              selectedPlace={selectedPlace}
              handlePlaceChange={handlePlaceChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ServiceSelect
              selectedPlace={selectedPlace}
              selectedService={selectedService}
              handleServiceChange={handleServiceChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProcessSelect
              selectedPlace={selectedPlace}
              selectedService={selectedService}
              selectedProcess={selectedProcess}
              handleProcessChange={handleProcessChange}
            />
          </Grid>
        </Grid>
        <Grid
          xs={12}
          md={12}
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                Numero de dias antes del pago:
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedValidDays}
                onChange={handleValidDaysChange}
                label="Days"
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                <MenuItem value={30}>30 dias</MenuItem>
                <MenuItem value={60}>60 dias</MenuItem>
                <MenuItem value={90}>90 dias</MenuItem>
                <MenuItem value={120}>120 dias</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              id="start-date"
              label="Fecha de inicio"
              type="date"
              // sx={{ width: "100%" }}
              value={selectedStartDate}
              onChange={handleStartDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: "100%",
                "& input[type='date']::-webkit-calendar-picker-indicator": {
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(
                    colors.accentGreen[100]
                  )}'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5zm3-9h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              id="finish-date"
              label="Fecha final"
              type="date"
              value={selectedFinishDate}
              onChange={handleFinishDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: "100%",
                "& input[type='date']::-webkit-calendar-picker-indicator": {
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(
                    colors.accentGreen[100]
                  )}'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5zm3-9h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                minHeight: { xs: "50px", md: "100%" }, // Mantén un tamaño mínimo en pantallas pequeñas
                borderRadius: "35px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: { xs: "0 8px", md: "0 16px" }, // Ajusta el padding en pantallas pequeñas y grandes
                backgroundColor: colors.searchButton[100],
                color: colors.contentSearchButton[100],
                border: "1px solid #d5e3f5",
                boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)", // Sombra sutil
                ":hover": {
                  backgroundColor: colors.searchButton[200],
                  boxShadow: "0 8px 12px rgba(255, 255, 255, 0.2)",
                },
              }}
              onClick={() => {
                handleGetValidPayment();
              }}
            >
              {/* Texto centrado */}
              <span
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: { xs: "0.875rem", sm: "1rem" }, // Ajuste de tamaño de texto en pantallas pequeñas
                  fontWeight: "bold",
                }}
              >
                Buscar
              </span>

              {/* Icono al final */}
              <Search sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </Button>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item xs={12} md={12}>
            <StatCards
              countResult={countResult}
              countUniqueAccount={countUniqueAccount}
              totalAmount={totalAmount}
              paymentDateRange={paymentDateRange}
              handleExportToExcel={handleExportToExcel}
              handleFilteredRows={handleFilteredRows}
              typeFilter={typeFilter}
            />
          </Grid>
        </Grid>

        <Grid
          xs={12}
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item xs={12} md={12}>
            <PaymentsDay data={paymentsChartData} />
          </Grid>
        </Grid>

        <Grid
          xs={12}
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item xs={12} md={4}>
            <SecondSection
              countValidProcedures={countValidProcedures}
              countInvalidProcedures={countInvalidProcedures}
              percentageValidProcedures={percentageValidProcedures}
              percentageInvalidProcedures={percentageInvalidProcedures}
              amountValidProcedures={amountValidProcedures}
              percentageAmountValidProcedures={percentageAmountValidProcedures}
              amountInvalidProcedures={amountInvalidProcedures}
              percentageAmountInvalidProcedures={
                percentageAmountInvalidProcedures
              }
              handleExportToExcel={handleExportToExcel}
              handleFilteredRows={handleFilteredRows}
              typeFilter={typeFilter}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <ThirdSection
              countNoPosition={countNoPosition}
              percentageCountNoPosition={percentageCountNoPosition}
              countWithoutPropertyPhoto={countWithoutPropertyPhoto}
              percentageCountWithoutPropertyPhoto={
                percentageCountWithoutPropertyPhoto
              }
              countWithoutEvidencePhoto={countWithoutEvidencePhoto}
              percentageCountWithoutEvidencePhoto={
                percentageCountWithoutEvidencePhoto
              }
              countPropertyNotLocated={countPropertyNotLocated}
              percentageCountPropertyNotLocated={
                percentageCountPropertyNotLocated
              }
              handleExportToExcel={handleExportToExcel}
              handleFilteredRows={handleFilteredRows}
              typeFilter={typeFilter}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ClasificacionesSection
              clasificaciones={clasificaciones}
              handleExportToExcel={handleExportToExcel}
              handleFilteredRows={handleFilteredRows}
              typeFilter={typeFilter}
            />
          </Grid>
        </Grid>

        {/* Nueva sección con título centrado */}
        <Grid container justifyContent="center" sx={{ marginTop: "10px" }}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              align="center"
              sx={{ fontWeight: "bold", color: colors.accentGreen[100] }}
            >
              {titleFilter}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{
            marginTop: "10px",
            maxWidth: "100%", // Asegura que no se salga del Box
            boxSizing: "border-box", // Asegura que el padding esté dentro del ancho
          }}
        >
          <Grid item xs={12} sm={4}>
            <TextField
              label="Ingresa tu busqueda"
              value={filterText}
              onChange={handleFilterChange}
              fullWidth
              helperText={
                showNoResultsMessage ? "No se encontraron resultados" : ""
              }
              FormHelperTextProps={{ style: { color: "red" } }}
              color="secondary"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="secondary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="info"
              sx={{
                borderRadius: "35px",
                color: "white",
              }}
              endIcon={<Download />}
              onClick={handleExportToExcelDataGrid}
            >
              Exportar a Excel
            </Button>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item xs={12}>
            <Box>
              <Box
                sx={{
                  height: 800,
                  width: "100%",
                  ".css-196n7va-MuiSvgIcon-root": {
                    fill: "white",
                  },
                }}
              >
                {result.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    No row
                  </div>
                ) : (
                  <DataGrid
                    rows={filteredResult.length > 0 ? filteredResult : result}
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
                      "& .MuiSvgIcon-root": {
                        color: colors.contentSearchButton[100], // Color de los íconos (flechas)
                      },
                    }}
                    getRowId={(row) => row.id}
                    rowHeight={130}
                    editable={false}
                    slots={{ toolbar: CustomToolbar }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <PhotoViewModal
          open={openModal}
          onClose={handleCloseModal}
          selectedPlace={selectedPlace}
          selectedService={selectedService}
          data={selectedRow}
          onImageUrlUpdate={handleImageUrlUpdate}
        />
      </Box>
    </Box>
  );
};
export default Index;
