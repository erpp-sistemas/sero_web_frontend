import React, { useState, useCallback } from "react";
import { tokens } from "../../theme";
import PlaceSelect from "../../components/select/placeSelect.jsx";
import { workAttendanceRequest } from "../../api/attendance.js";
import { useTheme, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux"; // material ui
import TextField from "@mui/material/TextField";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";
import GeneralAttendanceReport from "../../components/work-attendance/GeneralAttendanceReport/GeneralAttendanceReport.jsx";
import { Search } from "@mui/icons-material";

const Index = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  
  const user = useSelector((state) => state.user);
  const [generalAttendanceReportData, setGeneralAttendanceReportData] =
    useState([]);
  const [reportWorkHoursData, setReportWorkHoursData] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [noData, setNoData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const handlePlaceChange = useCallback((event) => {
    setNoData("");
    setSelectedPlace(event.target.value);
    setGeneralAttendanceReportData([]);
  }, []);

  const handleStartDateChange = (event) => {
    setNoData("");
    setSelectedStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setNoData("");
    setSelectedEndDate(event.target.value);
  };

  const handleGetWorkAttendance = async () => {
    try {
      if (!selectedPlace) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar una plaza");
        return;
      } else if (!selectedStartDate) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar una fecha de inicio");
        return;
      } else if (!selectedEndDate) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar una fecha final");
        return;
      }

      setIsLoading(true);

      const user_id_session = user.user_id;

      const response = await workAttendanceRequest(
        selectedPlace,
        selectedStartDate,
        selectedEndDate,
        user_id_session
      );

      setNoData("");      
      setGeneralAttendanceReportData(
        JSON.parse(response.data[0].GeneralAttendanceReport)
      );
      setReportWorkHoursData(JSON.parse(response.data[0].ReportWorkHours));

      console.log(JSON.parse(response.data[0].GeneralAttendanceReport))
      setIsLoading(false);

      const responseData = response.data[0].GeneralAttendanceReport;

      if (responseData === null) {
        setAlertOpen(true);
        setAlertType("warning");
        setAlertMessage("¡Lo sentimos! No se encontraron resultados");
      } else {
        try {
          setAlertOpen(true);
          setAlertType("success");
          setAlertMessage("¡Felicidades! Se genero el proceso correctamente");
        } catch (error) {
          console.error("Error al parsear JSON:", error);
        }
      }
    } catch (error) {
      setIsLoading(false);

      console.log(error);

      if (error.response.status === 400) {
        setAlertOpen(true);
        setAlertType("warning");
        setAlertMessage("¡Atencion! No se encontraron asistencias");
        setUsers([]);
      }
      setUsers([]);
    }
  };

  return (
    <div className="p-4 font-[sans-serif]">
      <LoadingModal open={isLoading} />
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
          Reporte de asistencia
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <PlaceSelect
            selectedPlace={selectedPlace}
            handlePlaceChange={handlePlaceChange}
            setSelectedPlace={setSelectedPlace}
          />
        </div>
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
            value={selectedEndDate}
            onChange={handleEndDateChange}
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
            style={{ width: "100%", height: "100%" }}
            onClick={() => {
              handleGetWorkAttendance();
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
        <GeneralAttendanceReport
          data={generalAttendanceReportData}
          reportWorkHoursData={reportWorkHoursData}
        />
      </div>
    </div>
  );
};
export default Index;
