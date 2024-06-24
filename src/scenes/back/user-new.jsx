import React, { useState, useEffect } from 'react';
import {
    Box, Stepper, Step, StepButton, Button, Typography,
    useMediaQuery, Alert, Collapse
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import StepOne from '../../components/NewUser/StepOne';
import StepTwo from '../../components/NewUser/StepTwo';
import StepThree from '../../components/NewUser/StepThree';
import { registerRequest } from '../../api/auth';

const steps = [
    { label: 'Datos Personales', icon: <FaceIcon />, size: 'large' },
    { label: 'Plazas, Servicio y Procesos', icon: <WorkIcon />, size: 'large' },
    { label: 'Permisos', icon: <BusinessCenterIcon />, size: 'large' }
];

function Index() {
    const matches = useMediaQuery('(min-width:600px)');
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const [profileId, setProfileId] = useState(null);
    const [formData, setFormData] = useState({});
    const [signinErrors, setSigninErrors] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);

    const totalSteps = () => steps.length;

    const completedSteps = () => Object.keys(completed).length;

    const isLastStep = () => activeStep === totalSteps() - 1;

    const allStepsCompleted = () => completedSteps() === totalSteps();

    const handleNext = () => {
        const newActiveStep = isLastStep() && !allStepsCompleted()
            ? steps.findIndex((step, i) => !(i in completed))
            : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1);

    const handleStep = step => () => setActiveStep(step);

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    const handleStepOneNext = data => {
        setFormData(prevData => ({ ...prevData, ...data }));
        setProfileId(data.profile_id);

        if (data.profile_id === 1) {
            signup(data);
        } else {
            handleNext();
        }
    };

    const handleStepTwoNext = data => {
        setFormData(prevData => ({ ...prevData, ...data }));

        const profileIdFromformData = data.profile_id;

        if (profileIdFromformData === 5) {
            setProfileId(profileIdFromformData);
            setActiveStep(totalSteps());
        } else {
            handleNext();
        }
    };

    const handleStepThreeNext = data => {
        setFormData(prevData => ({ ...prevData, ...data }));
        setActiveStep(totalSteps());
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
    };

    useEffect(() => {
        if (signinErrors.length > 0) {
            setAlertOpen(true);
            setTimeout(() => {
                setAlertOpen(false);
            }, 5000);
            return;
        }
    }, [signinErrors]);

    return (
        <Box m="20px">
            <Stepper nonLinear activeStep={activeStep} orientation={matches ? 'horizontal' : 'vertical'}>
                {steps.map((step, index) => (
                    <Step key={step.label} completed={completed[index]}>
                        <StepButton
                            color="inherit"
                            onClick={handleStep(index)}
                            completed={completed[index]}
                            icon={React.cloneElement(step.icon, { fontSize: step.size })}
                            sx={{
                                color: index === activeStep ? 'info.main' : 'inherit',
                                '& .MuiStepLabel-label': {
                                    fontSize: step.size === 'large' ? '1.25rem' : '1rem',
                                    fontWeight: 'bold'
                                },
                            }}
                        >
                            <Typography
                                variant="inherit"
                                sx={{
                                    color: index === activeStep ? 'info.main' : 'inherit',
                                    fontSize: step.size === 'large' ? '1.25rem' : '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {step.label}
                            </Typography>
                        </StepButton>
                    </Step>
                ))}
            </Stepper>

            <Box mt={2}>
                <Collapse in={alertOpen}>
                    <Alert severity="error" onClose={() => setAlertOpen(false)}>
                        {signinErrors}
                    </Alert>
                </Collapse>
            </Box>

            <div>
                {activeStep === 0 && <StepOne onNext={handleStepOneNext} onFormData={setFormData} />}
                {activeStep === 1 && <StepTwo onNextTwo={handleStepTwoNext} onFormDataTwo={setFormData} />}
                {activeStep === 2 && <StepThree profileId={profileId} onNextThree={handleStepThreeNext} onFormDataThree={setFormData} />}

                {(allStepsCompleted() || (profileId === 1 && activeStep === totalSteps()) || profileId === 5) && activeStep !== 1 ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            Todos los pasos completados - ¡Has terminado!
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reiniciar</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                            Paso {activeStep + 1}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: matches ? 'row' : 'column', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1, bgcolor: 'info.main', '&:hover': { bgcolor: 'info.dark' } }}
                            >
                                Atrás
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext} sx={{ mr: 1, bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}>
                                Siguiente
                            </Button>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                                        Paso {activeStep + 1} ya completado
                                    </Typography>
                                ) : (
                                    <Button onClick={handleComplete} sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}>
                                        {completedSteps() === totalSteps() - 1
                                            ? 'Finalizar'
                                            : 'Completar Paso'}
                                    </Button>
                                ))}
                        </Box>
                    </React.Fragment>
                )}
            </div>

        </Box>
    );
}

export default Index;
