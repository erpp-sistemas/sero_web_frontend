import React, { useState, useEffect } from 'react';
import { Box, Chip } from '@mui/material';
import Header from '../../components/Header';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import LockIcon from '@mui/icons-material/Lock';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import StepOne from '../../components/NewUser/StepOne.jsx';
import StepTwo from '../../components/NewUser/StepTwo';
import StepThree from '../../components/NewUser/StepThree.jsx';
import { registerRequest, registerAssignedPlacesRequest, registerMenuAndSubMenuRequest } from '../../api/auth';
import LoadingModal from '../../components/LoadingModal.jsx'
import CustomAlert from '../../components/CustomAlert.jsx'
import { useSelector } from 'react-redux';

function NewUser() {
  const [selectedChip, setSelectedChip] = useState('Datos Generales');
  const [formData, setFormData] = useState({});
  const [formDataTwo, setFormDataTwo] = useState({});
  const [formDataThree, setFormDataThree] = useState({});
  const [profileId, setProfileId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [completedSteps, setCompletedSteps] = useState({
    stepOne: false,
    stepTwo: false,
    stepThree: false
  });
  const user = useSelector((state) => state.user);

  const [resetTrigger, setResetTrigger] = useState(0);

  const resetForm = () => {
    setFormData({});
    setFormDataTwo({});
    setFormDataThree({});
    setProfileId(null);
    setCompletedSteps({
      stepOne: false,
      stepTwo: false,
      stepThree: false
    });
    setSelectedChip('Datos Generales');
    setResetTrigger(prev => prev + 1)
  };

  const handleChipClick = (chipLabel) => {
    if ((chipLabel === 'Datos Generales' && completedSteps.stepOne) ||
        (chipLabel === 'Plazas, Servicios y Procesos' && completedSteps.stepTwo) ||
        (chipLabel === 'Permisos' && completedSteps.stepThree)) return;

    setSelectedChip(chipLabel);
  };

  const handleStepOneNext = async (data) => {

    const updateData = { ...data, username_session: user.username };

    setFormData(updateData);
    setProfileId(updateData.profile_id);    

    if (updateData.profile_id === 1) {
      const signupResponse = await signup(updateData);
      
      if (signupResponse) {
        setCompletedSteps({ ...completedSteps, stepOne: true });
        setAlertOpen(true);
        setAlertType("success");
        setAlertMessage("El proceso se ha completado. Como perfil de administrador, tiene acceso a todas las plazas y permisos.");
        resetForm();
      }
    } else {
      setSelectedChip('Plazas, Servicios y Procesos');
      setCompletedSteps({ ...completedSteps, stepOne: true });
    }
  };
  
const handleStepTwoNext = async data => {
  setFormDataTwo(data);

  console.log(data)

  if (profileId === 5) {
    const updateData = { ...formData, username_session: user.username };

    const signupResponse = await signup(updateData);
    console.log(data)

    if (signupResponse) {
      await registerAssignedPlaces(userId, data);
      setAlertOpen(true);
      setAlertType("success");
      setAlertMessage("El proceso se ha completado. Como gestor, no es necesario tener permisos de la plataforma web.");
      resetForm();
    }
    
  } else {
    setSelectedChip('Permisos');
    setCompletedSteps({ ...completedSteps, stepTwo: true });
  }
}

const handleStepThreeNext = async data => {
  setFormDataThree(data);

  console.log(data)

  const updateData = { ...formData, username_session: user.username };

  const signupResponse = await signup(updateData);

  if (signupResponse) {
    await registerAssignedPlaces(userId, formDataTwo);  

    await registerMenuAndSubMenu(userId, profileId, data);

    setAlertOpen(true);
    setAlertType("success");
    setAlertMessage("Todos los pasos se han completado correctamente.");
    resetForm();  
  }  

  // if (profileId !== 5) {
    
  // }
  // const finalFormData = { ...formData, ...formDataTwo, ...data };
  
  
};

const signup = async (user) => {
  try {
    setIsLoading(true);
    const res = await registerRequest(user);

    setIsLoading(false);

    if (res.status === 200) {
      const userIdFromMessage = res.data.message.match(/\d+/)[0];
      setUserId(userIdFromMessage);
      console.log('Success:', res.data.message);
      setAlertOpen(true);
      setAlertType("success");
      setAlertMessage("¡Felicidades! " + res.data.message);
      return true;
    } else {
      console.log(`Unexpected status code: ${res.status}`);
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage(`Error! Unexpected status code: ${res.status}`);
      return false;
    }
  } catch (error) {
    setIsLoading(false);
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message;

      console.log(`Error (${status}):`, message);
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage("¡Error! " + message);
    } else {
      console.log('Error:', error.message);
      setAlertOpen(true);
      setAlertType("error");
      setAlertMessage("¡Error! " + error.message);
    }
    return false;
  }
};

const registerAssignedPlaces = async (user_id, dataAssignedPlaces) => {
  try {
      const res = await registerAssignedPlacesRequest(user_id, dataAssignedPlaces);
      
      if (res.status === 200) {
        console.log('Success:', res.data.message);
        // Aquí puedes manejar el éxito, por ejemplo, mostrar una notificación al usuario
      } else {
        console.log(`Unexpected status code: ${res.status}`);
        // Manejar otros códigos de estado inesperados
      }

  } catch (error) {
     if (error.response) {
      const status = error.response.status;
      
      if (status === 400) {
        console.log('Bad Request:', error.response.data.message);
        // Aquí puedes manejar los errores de solicitud incorrecta (400)
      } else if (status === 500) {
        console.log('Server Error:', error.response.data.message);
        // Aquí puedes manejar los errores del servidor (500)
      } else {
        console.log(`Error (${status}):`, error.response.data.message);
        // Manejar otros códigos de estado de error
      }
    } else {
      console.log('Error:', error.message);
      // Manejar otros tipos de errores, como problemas de red
    }
  }
}

const registerMenuAndSubMenu = async (user_id, role_id, dataAssignedMenus) => {
  try {
    const res = await registerMenuAndSubMenuRequest(user_id, role_id, dataAssignedMenus);
    
    if (res.status === 200) {
      console.log('Success:', res.data.message);
      // Aquí puedes manejar el éxito, por ejemplo, mostrar una notificación al usuario
    } else {
      console.log(`Unexpected status code: ${res.status}`);
      // Manejar otros códigos de estado inesperados
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 400) {
        console.log('Bad Request:', error.response.data.message);
        // Aquí puedes manejar los errores de solicitud incorrecta (400)
      } else if (status === 500) {
        console.log('Server Error:', error.response.data.message);
        // Aquí puedes manejar los errores del servidor (500)
      } else {
        console.log(`Error (${status}):`, error.response.data.message);
        // Manejar otros códigos de estado de error
      }
    } else {
      console.log('Error:', error.message);
      // Manejar otros tipos de errores, como problemas de red
    }
  }
}

  return (
    <Box m="20px">
      <Header title="Nuevo usuario" />
      <Box mt={2} display="flex" gap={1}>
        <Chip
          icon={<PersonIcon />}
          label="Datos Generales"
          clickable
          color={selectedChip === 'Datos Generales' ? 'secondary' : 'default'}
          onClick={() => handleChipClick('Datos Generales')}
          disabled={completedSteps.stepOne}
        />
          {selectedChip !== 'Datos Generales' && profileId === 5 && (
          <Chip
            icon={<PlaceIcon />}
            label="Plazas, Servicios y Procesos"
            clickable
            color={selectedChip === 'Plazas, Servicios y Procesos' ? 'secondary' : 'default'}
            onClick={() => handleChipClick('Plazas, Servicios y Procesos')}
            disabled={completedSteps.stepTwo}
          />
        )}
        {selectedChip !== 'Datos Generales' && profileId !== 5 && (
          <>
            <Chip
              icon={<PlaceIcon />}
              label="Plazas, Servicios y Procesos"
              clickable
              color={selectedChip === 'Plazas, Servicios y Procesos' ? 'secondary' : 'default'}
              onClick={() => handleChipClick('Plazas, Servicios y Procesos')}
              disabled={completedSteps.stepTwo}
            />
            <Chip
              icon={<LockIcon />}
              label="Permisos"
              clickable
              color={selectedChip === 'Permisos' ? 'secondary' : 'default'}
              onClick={() => handleChipClick('Permisos')}
              disabled={completedSteps.stepThree}
            />
          </>
        )}
      </Box>
      <Box mt={2}>
        <LoadingModal open={isLoading}/>
        <CustomAlert
          alertOpen={alertOpen}
          type={alertType}
          message={alertMessage}
          onClose={setAlertOpen}
        />

        {selectedChip === 'Datos Generales' && <StepOne onNext={handleStepOneNext} onFormData={setFormData} resetTrigger={resetTrigger}/>}
        {selectedChip === 'Plazas, Servicios y Procesos' && <StepTwo onNextTwo={handleStepTwoNext} onFormDataTwo={setFormDataThree} />}
        {selectedChip === 'Permisos' && <StepThree profileId={profileId} onNextThree={handleStepThreeNext} onFormDataThree={setFormDataThree} />}
        
      </Box>
    </Box>
  );
}

export default NewUser;
