import React, { useCallback, useState } from "react";
import { tokens } from "../../theme";
import PlaceSelect from "../../components/select/placeSelect.jsx";
import ServiceSelect from "../../components/select/serviceSelect";
import ProcessSelect from "../../components/select/processSelect";
import { Button, TextField, Typography, useTheme } from "@mui/material";
import { Search } from "@mui/icons-material";
import { registerFormDynamicManagementRequest } from "../../api/management.js";
import DataGridManagement from "../../components/managements/DataGridManagement.jsx";
import PublicService from "../../components/managements/PublicService.jsx";
import Supervision from "../../components/managements/Supervision.jsx";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedFinishDate, setSelectedFinishDate] = useState("");
  const [showModalLoading, setShowModalLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [resultData, setResultData] = useState([]);  

  const handlePlaceChange = useCallback((event) => {
    setSelectedPlace(event.target.value);
    setSelectedProcess("");
    setSelectedService("");
    setResultData([]);
  }, []);

  const handleServiceChange = useCallback((event) => {
    setSelectedService(event.target.value);
    setSelectedProcess("");
    setResultData([]);
  }, []);

  const handleProcessChange = useCallback((event) => {
    setSelectedProcess(event.target.value);
    setResultData([]);
  }, []);

  const handleStartDateChange = useCallback((event) => {
    setSelectedStartDate(event.target.value);
    setResultData([]);
  }, []);

  const handleFinishDateChange = useCallback((event) => {
    setSelectedFinishDate(event.target.value);
    setResultData([]);
  }, []);

  const handleGetLektorManagement = () => {
    if (
      !selectedPlace ||
      !selectedService ||
      !selectedProcess ||
      !selectedStartDate ||
      !selectedFinishDate
    ) {
      setAlertTitle("Atencion");
      setAlertMessage(
        "Por favor selecciona una plaza, un servicio,un proceso y completa ambas fechas."
      );
      setAlertType("warning");
      setAlertOpen(true);
      return;
    }

    setShowModalLoading(true);

    registerFormDynamicManagementRequest(
      selectedPlace,
      selectedService,
      selectedProcess,
      selectedStartDate,
      selectedFinishDate
    )
      .then((register) => {
        if (!register.data || register.data.length === 0) {
          setResultData([]); // Limpiar el grid
          setAlertTitle("Información");
          setAlertMessage("No se encontraron registros.");
          setAlertType("info");
          setAlertOpen(true);
        } else {
          
          setResultData(register.data);
          console.log(register.data);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setResultData([]); // Limpiar el grid
          setAlertTitle("Sin datos");
          setAlertMessage(
            "No se encontraron registros para los filtros seleccionados."
          );
          setAlertType("info");
          setAlertOpen(true);
        } else {
          setAlertTitle("Error");
          setAlertMessage("Ocurrió un error al obtener los datos.");
          setAlertType("error");
          setAlertOpen(true);
        }
      })
      .finally(() => {
        setShowModalLoading(false); // Aseguramos que el indicador de carga desaparezca al finalizar.
      });
  };  

  return (
    <div className="p-4 font-[sans-serif]">
      <LoadingModal open={showModalLoading} />

      <CustomAlert
        alertOpen={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={setAlertOpen}
      />
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Typography
          variant="h3"
          sx={{
            color: colors.accentGreen[100],
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Reporte de gestiones realizadas
        </Typography>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <PlaceSelect
            selectedPlace={selectedPlace}
            handlePlaceChange={handlePlaceChange}
            setSelectedPlace={setSelectedPlace}
          />
        </div>
        <div>
          <ServiceSelect
            selectedPlace={selectedPlace}
            selectedService={selectedService}
            handleServiceChange={handleServiceChange}
            setSelectedService={setSelectedService}
          />
        </div>
        <div>
          <ProcessSelect
            selectedPlace={selectedPlace}
            selectedService={selectedService}
            selectedProcess={selectedProcess}
            handleProcessChange={handleProcessChange}
            setSelectedProcess={setSelectedProcess}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <TextField
            id="start-date"
            label="Fecha de inicio"
            type="date"
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
        </div>
        <div>
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
        </div>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              handleGetLektorManagement();
            }}
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
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <Typography
          variant="h4"
          sx={{
            color: colors.accentGreen[100],
            fontWeight: "bold",
          }}
        >
          Datos encontrados
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {selectedService === 8 &&
          selectedProcess === 13 &&
          resultData?.length > 0 && <PublicService data={resultData} />}

        {selectedService === 9 &&
          selectedProcess === 14 &&
          resultData?.length > 0 && <Supervision data={resultData} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <DataGridManagement data={resultData} />
      </div>
    </div>
  );
}

export default Index;
