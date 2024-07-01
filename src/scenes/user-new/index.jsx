import React, { useState } from 'react';
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

function NewUser() {
  const [selectedChip, setSelectedChip] = useState('Datos Generales');
  const [formData, setFormData] = useState({});
  const [profileId, setProfileId] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChipClick = (chipLabel) => {
    setSelectedChip(chipLabel);
  };

  const handleStepOneNext = data => {
    setFormData(prevData => ({ ...prevData, ...data }))
    setProfileId(data.profile_id)
}

const handleStepTwoNext = data => {
  setFormData(prevData => ({ ...prevData, ...data }))

  if (profileId === 5) {

      //registerAssignedPlaces(2, data)
      console.log(data)
  } else {
    console.log(data)
  }
}

const handleStepThreeNext = data => {
  setFormData(prevData => ({ ...prevData, ...data }));

  //registerMenuAndSubMenu(2, 2, data)

  console.log(data)
};

const signup = async user => {
  try {
      const res = await registerRequest(user);
      
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
        />
        <Chip
          icon={<PlaceIcon />}
          label="Plazas, Servicios y Procesos"
          clickable
          color={selectedChip === 'Plazas, Servicios y Procesos' ? 'secondary' : 'default'}
          onClick={() => handleChipClick('Plazas, Servicios y Procesos')}
        />
        <Chip
          icon={<LockIcon />}
          label="Permisos"
          clickable
          color={selectedChip === 'Permisos' ? 'secondary' : 'default'}
          onClick={() => handleChipClick('Permisos')}
        />
        <Chip
          icon={<DevicesOtherIcon />}
          label="Resguardos"
          clickable
          color={selectedChip === 'Resguardos' ? 'secondary' : 'default'}
          onClick={() => handleChipClick('Resguardos')}
        />
      </Box>
      <Box mt={2}>
        {selectedChip === 'Datos Generales' && <StepOne onNext={handleStepOneNext} onFormData={setFormData}/>}
        {selectedChip === 'Plazas, Servicios y Procesos' && <StepTwo onNextTwo={handleStepTwoNext} onFormDataTwo={setFormData} />}
        {selectedChip === 'Permisos' && <StepThree profileId={profileId} onNextThree={handleStepThreeNext} onFormDataThree={setFormData} />}
        
      </Box>
    </Box>
  );
}

export default NewUser;
