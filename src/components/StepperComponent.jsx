import * as React from 'react';
import { useState } from 'react';
import { Box, Typography, useTheme, Button, Stepper, Step, StepButton } from "@mui/material";

import FormDatosGenerales from './FormDatosGenerales';
import SelectPlazaCreateUser from './SelectPlazaCreateUser';
import SelectMenusCreateUser from './SelectMenusCreateUser';

import MessageAlert from './MessageAlert';

import { tokens } from "../theme";
import { registerUser } from '../api/auth';



const steps = ['Datos generales', 'Selecciona las plazas', 'Selecciona los menus'];

export default function HorizontalNonLinearStepper() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});

    // DATOS DE GENERALES Y DE ACCESO
    const [datosGenerales, setDatosGenerales] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefonoPersonal: '',
        telefonoEmpresa: '',
        sexo: '',
        fechaNacimiento: '',
        foto: '',
        usuarioAcceso: '',
        password: '',
        rol: '',
        accesoSeroWeb: false,
        accesoSeroMovil: false
    })


    console.log(datosGenerales);

    // PLAZAS, SERVICIOS Y PROCESOS
    const [plazasServiciosProcesos, setPlazasServiciosProcesos] = useState({
        plazas: [],
        servicios: [],
        procesos: []
    });


    const [notShowFormPlazas, setNotFormShowPlazas] = useState(true)
    const [notShowFormMenus, setNotFormShowMenus] = useState(true)

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        console.log("HandlerStep " + step)
        setActiveStep(step);
    };

    const handleComplete = async() => {

        console.log(datosGenerales)
        let { nombre, apellidoPaterno, sexo, telefonoPersonal, fechaNacimiento, foto, password, rol } = datosGenerales
        console.log(nombre, apellidoPaterno, sexo, telefonoPersonal, fechaNacimiento, password, rol)
        if ([nombre, apellidoPaterno, sexo, telefonoPersonal, password, rol].includes('') || foto.length === 0) {
            alert("Campos incompletos")
        } else {

            try {

            const response = registerUser({name:datosGenerales.nombre,
                first_last_name:datosGenerales.apellidoPaterno,
                second_last_name:datosGenerales.apellidoMaterno,
                birthdate:datosGenerales.fechaNacimiento,
                sex_id:datosGenerales.sexo,
                user_name:datosGenerales.usuarioAcceso,
                password:datosGenerales.password,
                profile_id:Number(5),
                active_web_access:datosGenerales.accesoSeroWeb,
                active_app_movil_access:datosGenerales.accesoSeroMovil,
                personal_phone:datosGenerales.telefonoPersonal,
                work_phone:datosGenerales.telefonoEmpresa,
                url_image:datosGenerales.foto})

                  // subir la foto a firebase o al s3
            const newCompleted = completed;
            newCompleted[activeStep] = true;
            //console.log(newCompleted)
            setNotFormShowPlazas(false)
            setCompleted(newCompleted);
            handleNext();
                
            } catch (error) {
                console.log(error);
                
            }
            
          
        }

    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    const stepStyle = {
        boxShadow: 2,
        backgroundColor: colors.primary[400],
        padding: 2,
        "& .Mui-active": {
            "&.MuiStepIcon-root": {
                color: "info.main",
                fontSize: "2rem",
            },
            "& .MuiStepConnector-line": {
                borderColor: "success.main"
            }
        },
        "& .Mui-completed": {
            "&.MuiStepIcon-root": {
                color: "secondary.main",
                fontSize: "2rem",
            },
            "& .MuiStepConnector-line": {
                borderColor: "success.main"
            }
        }
    }

    return (
        <Box >
            <Stepper nonLinear activeStep={activeStep}
                sx={stepStyle}
            //sx={{backgroundColor: colors.greenAccent[500], padding:'7px', borderRadius:'5px'}}
            >
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]} >
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            Usuario creado con éxito
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {activeStep + 1 === 1 && (
                            <FormDatosGenerales
                                chageDatosGenerales={setDatosGenerales}
                                datosGenerales={datosGenerales}
                            />
                        )}

                        {activeStep + 1 === 2 && (
                            <>
                                {notShowFormPlazas === false ? <SelectPlazaCreateUser /> : (
                                    <MessageAlert
                                        title="No se pueden mostrar las plazas, servicios y procesos ya que el usuario aún no se crea"
                                        severity="warning"
                                    />
                                )}
                            </>
                        )}

                        {activeStep + 1 === 3 && (
                            <>
                                {notShowFormPlazas === false ?  <SelectMenusCreateUser /> : (
                                    <MessageAlert
                                        title="No se pueden mostrar los menus ya que el usuario aún no se crea"
                                        severity="warning"
                                    />
                                )}
                            </>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>

                            <Box sx={{ flex: '1 1 auto' }} />

                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                                        Paso {activeStep + 1} completado
                                    </Typography>
                                ) : (
                                    <Button
                                        sx={{
                                            mr: 1,
                                            backgroundColor: colors.blueAccent[600],
                                            color: colors.primary[100],
                                            width: '120px',
                                            ":hover": {
                                                bgcolor: colors.blueAccent[300]
                                            }
                                        }}
                                        onClick={handleComplete}>
                                        {completedSteps() === totalSteps() - 1
                                            ? 'Terminar'
                                            : 'Completar paso'}
                                    </Button>
                                ))}
                        </Box>
                    </React.Fragment>
                )}
            </div>
        </Box>
    );
}