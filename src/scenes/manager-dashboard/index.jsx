import * as React from "react";
import { useCallback, useState } from "react";
import { tokens } from "../../theme";
import PlaceSelect from "../../components/PlaceSelect";
import ServiceSelect from "../../components/ServiceSelect";
import ProcessSelect from "../../components/ProcessSelectMultipleChip";
import { Box, useTheme, Button } from "@mui/material";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { AlarmOn, CurrencyExchange, ManageSearch, Search } from "@mui/icons-material";
import { managerDashboardRequest } from "../../api/manager.js";
import PaymentsByTypeOfService from "../../components/ManagerDashboard/PaymentsByTypeOfService.jsx";
import ManagerEfficiency from "../../components/ManagerDashboard/ManagerEfficiency.jsx";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedProcess, setSelectedProcess] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedFinishDate, setSelectedFinishDate] = useState("");
  const [paymentsPerColonyData, setPaymentsPerColonyData] = useState([]);
  const [paymentsByTypeOfServiceData, setPaymentsByTypeOfServiceData] =
    useState([]);
  const [managerEfficiencyData, setManagerEfficiencyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePlaceChange = useCallback((event) => {
    setSelectedPlace(event.target.value);
    setSelectedService("");
    console.log("place:", event.target.value);
  }, []);

  const handleServiceChange = useCallback((event) => {
    setSelectedService(event.target.value);
    setSelectedProcess([]);
  }, []);

  const handleProcessChange = useCallback((event) => {
    setSelectedProcess(
      Array.isArray(event.target.value)
        ? event.target.value
        : [event.target.value]
    );
  }, []);

  const handleStartDateChange = useCallback((event) => {
    setSelectedStartDate(event.target.value);
  }, []);

  const handleFinishDateChange = useCallback((event) => {
    setSelectedFinishDate(event.target.value);
  }, []);

  const handleGetCoordinationDashboard = async () => {
    setPaymentsByTypeOfServiceData([]);
    setManagerEfficiencyData([]);

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
        setAlertMessage("¡Error! Debes seleccionar un proceso");
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

      const response = await managerDashboardRequest(
        selectedPlace,
        selectedService,
        selectedProcess,
        selectedStartDate,
        selectedFinishDate
      );
      setPaymentsByTypeOfServiceData(
        JSON.parse(response.data[0].paymentsByTypeOfService)
      );
      setManagerEfficiencyData(JSON.parse(response.data[0].managerEfficiency));
      console.log(JSON.parse(response.data[0].managerEfficiency));

      setIsLoading(false);
      setAlertOpen(true);
      setAlertType("success");
      setAlertMessage("¡Felicidades! Se genero el proceso correctamente");
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ margin: "20px" }}>
      <Box
        m="20px 0"
        display="flex"
        justifyContent="space-evenly"
        flexWrap="wrap"
        gap="20px"
        sx={{ backgroundColor: colors.primary[400], width: "100%" }}
        padding="15px"
        borderRadius="10px"
      >
        <LoadingModal open={isLoading} />

        <CustomAlert
          alertOpen={alertOpen}
          type={alertType}
          message={alertMessage}
          onClose={setAlertOpen}
        />

        <Grid container spacing={2}>
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

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
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
          </Grid>

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              style={{ width: "100%", height: "100%" }}
              onClick={() => {
                handleGetCoordinationDashboard();
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
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="icon label tabs example"
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
            >
              <Tab
                icon={<CurrencyExchange />}
                label="PAGOS POR TIPO DE SERVICIO"
              />
              <Tab icon={<AlarmOn />} label="EFICIENCIA DE GESTION" />
              <Tab icon={<PersonPinIcon />} label="NEARBY" />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            {value === 0 && (
              <PaymentsByTypeOfService data={paymentsByTypeOfServiceData} />
            )}
            {value === 1 && <ManagerEfficiency data={managerEfficiencyData} />}
            {/* Aquí puedes condicionalmente renderizar otros componentes si es necesario */}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Index;
