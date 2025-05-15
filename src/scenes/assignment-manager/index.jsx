import React, { useCallback, useState, useEffect } from "react";
import { tokens } from "../../theme";
import PlaceSelect from "../../components/select/placeSelect.jsx";
import ServiceSelect from "../../components/select/serviceSelect";
import { Button, TextField, Typography, useTheme } from "@mui/material";
import { Search } from "@mui/icons-material";
import { assignmentAllRequest } from "../../api/assignment.js";
import DataGridAssignmentAll from "../../components/AssignmentManager/DataGridAssignmentAll.jsx";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showModalLoading, setShowModalLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [resultData, setResultData] = useState([]);

  const handlePlaceChange = useCallback((event) => {
    setSelectedPlace(event.target.value);
    setSelectedService("");
    setResultData([]);
  }, []);

  const handleServiceChange = useCallback((event) => {
    setSelectedService(event.target.value);
    setResultData([]);
  }, []);

  const handleGetAssignmentManager = () => {
    if (!selectedPlace || !selectedService) {
      setAlertTitle("Atencion");
      setAlertMessage("Por favor selecciona una plaza y un servicio");
      setAlertType("warning");
      setAlertOpen(true);
      return;
    }

    setShowModalLoading(true);

    assignmentAllRequest(selectedPlace, selectedService)
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
          Administracion de asignaciones
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
          <Button
            variant="contained"
            onClick={() => {
              handleGetAssignmentManager();
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
        <DataGridAssignmentAll data={resultData} />
      </div>
    </div>
  );
}

export default Index;
