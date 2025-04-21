import React, { useState, useCallback } from "react";
import { tokens } from "../../theme";
import PlaceSelect from "../../components/select/placeSelect.jsx";
import DateSelect from "../../components/select/dateSelect.jsx";
import SearchButton from "../../components/Buttons/SearchButton.jsx";
import { workAttendanceRequest } from "../../api/attendance.js";
import { useTheme, Typography } from "@mui/material";
import { useSelector } from "react-redux"; // material ui
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";
import GeneralAttendanceReport from "../../components/work-attendance/GeneralAttendanceReport/GeneralAttendanceReport.jsx";

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
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const handlePlaceChange = useCallback((event) => {
    setSelectedPlace(event.target.value);
    setGeneralAttendanceReportData([]);
    setReportWorkHoursData([]);
  }, []);

  const handleStartDateChange = (event) => {
    setSelectedStartDate(event.target.value);
    setGeneralAttendanceReportData([]);
    setReportWorkHoursData([]);
  };

  const handleEndDateChange = (event) => {
    setSelectedEndDate(event.target.value);
    setGeneralAttendanceReportData([]);
    setReportWorkHoursData([]);
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

      setGeneralAttendanceReportData(
        JSON.parse(response.data[0].GeneralAttendanceReport)
      );
      setReportWorkHoursData(JSON.parse(response.data[0].ReportWorkHours));

      console.log(JSON.parse(response.data[0].GeneralAttendanceReport));
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

      if (error.response.status === 400) {
        setAlertOpen(true);
        setAlertType("warning");
        setAlertMessage("¡Atencion! No se encontraron asistencias");
      }
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
          <DateSelect
            label="Fecha de inicio"
            selectedDate={selectedStartDate}
            handleDateChange={handleStartDateChange}
            setSelectedDate={setSelectedStartDate}
          />
        </div>
        <div>
          <DateSelect
            label="Fecha final"
            selectedDate={selectedEndDate}
            handleDateChange={handleEndDateChange}
            setSelectedDate={setSelectedEndDate}
          />
        </div>
        <div>
          <SearchButton onClick={handleGetWorkAttendance} text="Consultar" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <GeneralAttendanceReport
          data={generalAttendanceReportData}
          reportWorkHoursData={reportWorkHoursData}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
        />
      </div>
    </div>
  );
};
export default Index;
