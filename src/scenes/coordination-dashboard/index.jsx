import React, { useState } from "react";
import { tokens } from "../../theme";
import PlaceSelect from "../../components/PlaceSelect";
import ServiceSelect from "../../components/ServiceSelect";
import ProcessSelect from "../../components/ProcessSelect";
import { Box, useTheme, Button } from "@mui/material";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { ManageSearch, Search } from "@mui/icons-material";
import { coordinationDashboardRequest } from "../../api/coordination.js";
import RowOne from "../../components/CoordinationDashboard/RowOne.jsx";
import DataGridManagementByManager from "../../components/CoordinationDashboard/DataGridManagementByManager.jsx";
import ManagedTask from "../../components/CoordinationDashboard/ManagedTask.jsx";
import LocationStatus from "../../components/CoordinationDashboard/LocationStatus.jsx";
import TypeService from "../../components/CoordinationDashboard/TypeService.jsx";
import TypeProperty from "../../components/CoordinationDashboard/TypeProperty.jsx";
import DailyManagement from "../../components/CoordinationDashboard/DailyManagement.jsx";
import DailyWorkSummary from "../../components/CoordinationDashboard/DailyWorkSummary.jsx";
import PaymentsProcedures from "../../components/CoordinationDashboard/PaymentsProcedures.jsx";
import PaymentsProceduresByTypeService from "../../components/CoordinationDashboard/PaymentsProceduresByTypeService.jsx";
import PaymentsProceduresByManager from "../../components/CoordinationDashboard/PaymentsProceduresByManager.jsx";
import DailyManagementNotPhoto from "../../components/CoordinationDashboard/DailyManagementNotPhoto.jsx";
import BatteryMeter from "../../components/CoordinationDashboard/BatteryMeter.jsx";
import VerifiedAddress from "../../components/CoordinationDashboard/VerifiedAddress.jsx";
import StatCards from "../../components/CoordinationDashboard/StatCards.jsx";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedStartDate, setSelectedStartDate] = React.useState("");
  const [selectedFinishDate, setSelectedFinishDate] = React.useState("");
  const [result, setResult] = useState([]);
  const [rowOneData, setRowOneData] = useState([]);
  const [lineMonthData, setLineMonthData] = useState([]);
  const [lineWeekData, setLineWeekData] = useState([]);
  const [lineDayData, setLineDayData] = useState([]);
  const [dataGridData, setDataGridData] = useState([]);
  const [pieManagementByTypeData, setPieManagementByTypeData] = useState([]);
  const [pieManagementByLocationData, setPieManagementByLocationData] =
    useState([]);
  const [barStackData, setBarStackData] = useState([]);
  const [managedTaskData, setManagedTaskData] = useState([]);
  const [locationStatusData, setLocationStatusData] = useState([]);
  const [typeServiceData, setTypeServiceData] = useState([]);
  const [typePropertyData, setTypePropertyData] = useState([]);
  const [dailyManagementData, setDailyManagementData] = useState([]);
  const [dailyWorkSummaryData, setDailyWorkSummaryData] = useState([]);
  const [typeDailyManagementData, setTypeDailyManagementData] =
    useState("month");
  const [paymentsProceduresData, setPaymentsProceduresData] = useState([]);
  const [
    paymentsProceduresByTypeServiceData,
    setPaymentsProceduresByTypeServiceData,
  ] = useState([]);
  const [paymentsProceduresByManagerData, setPaymentsProceduresByManagerData] =
    useState([]);
  const [dailyManagementNotPhotoData, setDailyManagementNotPhotoData] =
    useState([]);
  const [batteryMeterData, setBatteryMeterData] = useState([]);
  const [verifiedAddressData, setVerifiedAddressData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const handlePlaceChange = (event) => {
    setSelectedPlace(event.target.value);
    setSelectedService("");
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    setSelectedProcess("");
  };

  const handleProcessChange = (event) => {
    setSelectedProcess(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setSelectedStartDate(event.target.value);
  };

  const handleFinishDateChange = (event) => {
    setSelectedFinishDate(event.target.value);
  };

  const handleGetCoordinationDashboard = async () => {
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

      const typeConcept =
        selectedStartDate === selectedFinishDate ? "hour" : "month";
      setTypeDailyManagementData(typeConcept);
      setIsLoading(true);
      const response = await coordinationDashboardRequest(
        selectedPlace,
        selectedService,
        selectedProcess,
        selectedStartDate,
        selectedFinishDate
      );
      setRowOneData(JSON.parse(response.data[0].row_one));
      setLineMonthData(
        JSON.parse(response.data[0].LineMonthNumberOFTotalProcedures)
      );
      setLineWeekData(
        JSON.parse(response.data[0].LineWeekNumberOFTotalProcedures)
      );
      setLineDayData(
        JSON.parse(response.data[0].LineDayNumberOFTotalProcedures)
      );
      setDataGridData(JSON.parse(response.data[0].DataGridManagementByManager));
      setPieManagementByTypeData(
        JSON.parse(response.data[0].PieManagementByTypeOfService)
      );
      setPieManagementByLocationData(
        JSON.parse(response.data[0].PieManagementByLocationStatus)
      );
      setBarStackData(
        JSON.parse(
          response.data[0].BarStackManagementsByManagerAndLocationStatus
        )
      );
      setManagedTaskData(JSON.parse(response.data[0].ManagedTask));
      setLocationStatusData(JSON.parse(response.data[0].LocationStatus));
      setTypeServiceData(JSON.parse(response.data[0].TypeService));
      setTypePropertyData(JSON.parse(response.data[0].TypeProperty));
      setDailyManagementData(JSON.parse(response.data[0].DailyManagement));
      setDailyWorkSummaryData(JSON.parse(response.data[0].DailyWorkSummary));
      setPaymentsProceduresData(
        JSON.parse(response.data[0].PaymentsProcedures)
      );
      setPaymentsProceduresByTypeServiceData(
        JSON.parse(response.data[0].PaymentsProceduresByTypeService)
      );
      setPaymentsProceduresByManagerData(
        JSON.parse(response.data[0].PaymentsProceduresByManager)
      );
      setDailyManagementNotPhotoData(
        JSON.parse(response.data[0].DailyManagementNotPhoto)
      );
      setBatteryMeterData(JSON.parse(response.data[0].BatteryMeter));
      setVerifiedAddressData(JSON.parse(response.data[0].VerifiedAddress));
      setResult(response.data);
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

        {result.length > 0 && (
          <>
            <Grid
              xs={12}
              container
              justifyContent="space-between"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12} md={12}>
                <StatCards
                  data={rowOneData}
                  placeId={selectedPlace}
                  serviceId={selectedService}
                  proccessId={selectedProcess}
                  startDate={selectedStartDate}
                  finishDate={selectedFinishDate}
                />
              </Grid>
            </Grid>
                        
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12}>
                <DailyManagement
                  data={dailyManagementData}
                  typeConcept={typeDailyManagementData}
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
              <Grid item xs={12} md={6}>
                <DailyManagementNotPhoto
                  data={dailyManagementNotPhotoData}
                  typeConcept={typeDailyManagementData}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DataGridManagementByManager data={dataGridData} />
              </Grid>
            </Grid>

            <Grid
              container
              justifyContent="space-between"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12} md={6}>
                <ManagedTask data={managedTaskData} />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocationStatus data={locationStatusData} />
              </Grid>
            </Grid>

            <Grid
              container
              justifyContent="space-between"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12} md={6}>
                <TypeService data={typeServiceData} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TypeProperty data={typePropertyData} />
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12}>
                <DailyWorkSummary
                  data={dailyWorkSummaryData}
                  placeId={selectedPlace}
                  serviceId={selectedService}
                  proccessId={selectedProcess}
                />
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12}>
                <PaymentsProcedures data={paymentsProceduresData} />
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
              <Grid item xs={12} md={6}>
                <PaymentsProceduresByTypeService
                  data={paymentsProceduresByTypeServiceData}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <PaymentsProceduresByManager
                  data={paymentsProceduresByManagerData}
                />
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12}>
                <BatteryMeter data={batteryMeterData} />
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12}>
                <VerifiedAddress
                  data={verifiedAddressData}
                  placeId={selectedPlace}
                  serviceId={selectedService}
                  proccessId={selectedProcess}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Index;
