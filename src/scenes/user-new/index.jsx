import React, { useState, useEffect } from "react";
import { Box, Chip, useTheme } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import LockIcon from "@mui/icons-material/Lock";
import StepOne from "../../components/NewUser/StepOne.jsx";
import StepTwo from "../../components/NewUser/StepTwo";
import StepThree from "../../components/NewUser/StepThree.jsx";
import {
  registerRequest,
  registerAssignedPlacesRequest,
  registerMenuAndSubMenuRequest,
} from "../../api/auth";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";
import { useSelector } from "react-redux";
import { tokens } from "../../theme";

function NewUser() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedChip, setSelectedChip] = useState("Datos Generales");
  const [formData, setFormData] = useState({});
  const [formDataTwo, setFormDataTwo] = useState({});
  const [formDataThree, setFormDataThree] = useState({});
  const [profileId, setProfileId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [completedSteps, setCompletedSteps] = useState({
    stepOne: false,
    stepTwo: false,
    stepThree: false,
  });
  const user = useSelector((state) => state.user);

  const [resetTrigger, setResetTrigger] = useState(0);

  const resetForm = () => {
    setFormData({});
    setFormDataTwo({});
    setFormDataThree({});
    setProfileId(null);
    setUserId(null);
    setCompletedSteps({
      stepOne: false,
      stepTwo: false,
      stepThree: false,
    });
    setSelectedChip("Datos Generales");
    setResetTrigger((prev) => prev + 1);
  };

  const handleChipClick = (chipLabel) => {
    if (
      (chipLabel === "Datos Generales" && completedSteps.stepOne) ||
      (chipLabel === "Plazas, Servicios y Procesos" &&
        completedSteps.stepTwo) ||
      (chipLabel === "Permisos" && completedSteps.stepThree)
    )
      return;

    setSelectedChip(chipLabel);
  };

  // Ajuste: signup retorna el userId
  const signup = async (user) => {
    try {
      setIsLoading(true);
      const res = await registerRequest(user);

      setIsLoading(false);

      if (res.status === 200) {
        const userIdFromMessage = res.data.message.match(/\d+/)[0];
        setUserId(userIdFromMessage);
        console.log("userIdFromMessage:", userIdFromMessage);
        setAlertOpen(true);
        setAlertType("success");
        setAlertMessage("¡Felicidades! " + res.data.message);
        return { success: true, userId: userIdFromMessage };
      } else {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage(`Error! Unexpected status code: ${res.status}`);
        return { success: false };
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! " + message);
      } else {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! " + error.message);
      }
      return { success: false };
    }
  };

  // Paso 1
  const handleStepOneNext = async (data) => {
    const updateData = { ...data, username_session: user.username };

    setFormData(updateData);
    setProfileId(updateData.profile_id);

    if (updateData.profile_id === 1) {
      const signupResponse = await signup(updateData);

      if (signupResponse.success) {
        setCompletedSteps({ ...completedSteps, stepOne: true });
        setAlertOpen(true);
        setAlertType("success");
        setAlertMessage(
          "El proceso se ha completado. Como perfil de administrador, tiene acceso a todas las plazas y permisos."
        );
        resetForm();
      }
    } else {
      setSelectedChip("Plazas, Servicios y Procesos");
      setCompletedSteps({ ...completedSteps, stepOne: true });
    }
  };

  // Paso 2
  const handleStepTwoNext = async (data) => {
    setFormDataTwo(data);

    // Si es gestor, registrar usuario y plazas
    if (profileId === 5) {
      const updateData = { ...formData, username_session: user.username };
      const signupResponse = await signup(updateData);

      if (signupResponse.success) {
        // Usar el userId retornado por signup
        await registerAssignedPlaces(signupResponse.userId, data);
        setUserId(signupResponse.userId); // Por si se necesita en el paso 3
        setAlertOpen(true);
        setAlertType("success");
        setAlertMessage(
          "El proceso se ha completado. Como gestor, no es necesario tener permisos de la plataforma web."
        );
        resetForm();
      }
    } else {
      setSelectedChip("Permisos");
      setCompletedSteps({ ...completedSteps, stepTwo: true });
    }
  };

  // Paso 3
  const handleStepThreeNext = async (data) => {
    setFormDataThree(data);

    const updateData = { ...formData, username_session: user.username };

    // Si el usuario aún no existe, regístralo y usa el userId retornado
    let finalUserId = userId;
    if (!finalUserId) {
      const signupResponse = await signup(updateData);
      if (signupResponse.success) {
        finalUserId = signupResponse.userId;
        setUserId(finalUserId);
      } else {
        // Si falla el registro, no continuar
        return;
      }
    }

    await registerAssignedPlaces(finalUserId, formDataTwo);
    await registerMenuAndSubMenu(finalUserId, profileId, data);

    setAlertOpen(true);
    setAlertType("success");
    setAlertMessage("Todos los pasos se han completado correctamente.");
    resetForm();
  };

  // Función para registrar plazas asignadas
  const registerAssignedPlaces = async (user_id, dataAssignedPlaces) => {
    console.log("user_id enviado a registerAssignedPlacesRequest:", user_id);
    console.log("dataAssignedPlaces enviado a registerAssignedPlacesRequest:", dataAssignedPlaces);

    try {
      const res = await registerAssignedPlacesRequest(
        user_id,
        dataAssignedPlaces
      );

      if (res.status === 200) {
        console.log("Success:", res.data.message);
      } else {
        console.log(`Unexpected status code: ${res.status}`);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          console.log("Bad Request:", error.response.data.message);
        } else if (status === 500) {
          console.log("Server Error:", error.response.data.message);
        } else {
          console.log(`Error (${status}):`, error.response.data.message);
        }
      } else {
        console.log("Error:", error.message);
      }
    }
  };

  // Función para registrar menús y submenús
  const registerMenuAndSubMenu = async (
    user_id,
    role_id,
    dataAssignedMenus
  ) => {
    try {
      const res = await registerMenuAndSubMenuRequest(
        user_id,
        role_id,
        dataAssignedMenus
      );

      if (res.status === 200) {
        console.log("Success:", res.data.message);
      } else {
        console.log(`Unexpected status code: ${res.status}`);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          console.log("Bad Request:", error.response.data.message);
        } else if (status === 500) {
          console.log("Server Error:", error.response.data.message);
        } else {
          console.log(`Error (${status}):`, error.response.data.message);
        }
      } else {
        console.log("Error:", error.message);
      }
    }
  };

  return (
    <Box m="20px">
      <div className="max-w-full mx-auto pb-5 rounded font-[sans-serif]">
        <div
          className="flex items-center gap-4 border-b border-g ray-300 pb-2"
          style={{ borderBottom: `2px solid ${colors.accentGreen[100]}` }}
        >
          <h3
            className="text-2xl font-extrabold text-green-300"
            style={{ color: colors.accentGreen[100] }}
          >
            Nuevo usuario
          </h3>
          <p className="text-gray-400 leading-relaxed text-base">
            Crea nuevos usuarios con sus plazas asignadas y configura sus
            accesos al sistema de manera eficiente y organizada.
          </p>
        </div>
      </div>
      <Box mt={2} display="flex" gap={1}>
        <Chip
          icon={<PersonIcon />}
          label="Datos Generales"
          clickable
          color={selectedChip === "Datos Generales" ? "secondary" : "default"}
          sx={{
            background: selectedChip === "Datos Generales" ? colors.accentGreen[100] : "default",
            fontWeight: "bold"
          }}
          onClick={() => handleChipClick("Datos Generales")}
          disabled={completedSteps.stepOne}
        />
        {selectedChip !== "Datos Generales" && profileId === 5 && (
          <Chip
            icon={<PlaceIcon />}
            label="Plazas, Servicios y Procesos"
            clickable
            color={
              selectedChip === "Plazas, Servicios y Procesos"
                ? "secondary"
                : "default"
            }
            onClick={() => handleChipClick("Plazas, Servicios y Procesos")}
            disabled={completedSteps.stepTwo}
          />
        )}
        {selectedChip !== "Datos Generales" && profileId !== 5 && (
          <>
            <Chip
              icon={<PlaceIcon />}
              label="Plazas, Servicios y Procesos"
              clickable
              color={
                selectedChip === "Plazas, Servicios y Procesos"
                  ? "secondary"
                  : "default"
              }
              onClick={() => handleChipClick("Plazas, Servicios y Procesos")}
              disabled={completedSteps.stepTwo}
            />
            <Chip
              icon={<LockIcon />}
              label="Permisos"
              clickable
              color={selectedChip === "Permisos" ? "secondary" : "default"}
              onClick={() => handleChipClick("Permisos")}
              disabled={completedSteps.stepThree}
            />
          </>
        )}
      </Box>
      <Box mt={2}>
        <LoadingModal open={isLoading} />
        <CustomAlert
          alertOpen={alertOpen}
          type={alertType}
          message={alertMessage}
          onClose={setAlertOpen}
        />

        {selectedChip === "Datos Generales" && (
          <StepOne
            onNext={handleStepOneNext}
            onFormData={setFormData}
            resetTrigger={resetTrigger}
          />
        )}
        {selectedChip === "Plazas, Servicios y Procesos" && (
          <StepTwo
            onNextTwo={handleStepTwoNext}
            onFormDataTwo={setFormDataThree}
          />
        )}
        {selectedChip === "Permisos" && (
          <StepThree
            profileId={profileId}
            onNextThree={handleStepThreeNext}
            onFormDataThree={setFormDataThree}
          />
        )}
      </Box>
    </Box>
  );
}

export default NewUser;
