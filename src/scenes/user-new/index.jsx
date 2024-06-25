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
import { registerRequest } from '../../api/auth';

function NewUser() {
  const [selectedChip, setSelectedChip] = useState('Datos Generales');
  const [formData, setFormData] = useState({});
  const [profileId, setProfileId] = useState(null);

  const handleChipClick = (chipLabel) => {
    setSelectedChip(chipLabel);
  };

  const handleStepOneNext = data => {
    setFormData(prevData => ({ ...prevData, ...data }))
    setProfileId(data.profile_id)
}

const handleStepTwoNext = data => {
  setFormData(prevData => ({ ...prevData, ...data }))

  const profileIdFromformData = data.profile_id;

  if (profileIdFromformData === 5) {
      setProfileId(profileIdFromformData);
  }
}

const handleStepThreeNext = data => {
  setFormData(prevData => ({ ...prevData, ...data }));
};

const signup = async user => {
  try {
      const res = await registerRequest(user);
      console.info(res.data);
      setActiveStep(totalSteps());
  } catch (error) {
      if (Array.isArray(error.response.data)) {
          return setSigninErrors(error.response.data);
      }
      setSigninErrors([error.response.data.message]);
      handleNext();
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
