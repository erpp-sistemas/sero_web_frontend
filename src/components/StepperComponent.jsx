import * as React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Stepper,
  Step,
  StepButton,
  Snackbar,
  Alert,
} from "@mui/material";

import FormDatosGenerales from "./FormDatosGenerales";
import SelectPlazaCreateUser from "./SelectPlazaCreateUser";
import SelectMenusCreateUser from "./SelectMenusCreateUser";

import MessageAlert from "./MessageAlert";

import { tokens } from "../theme";
import { registerRequest } from "../api/auth.js";
import { registerUserFirebase } from "../firebase/auth";
import { createUserPlazaServiceProcess, getAllPlaces } from "../api/place";
import { getAllServices } from "../api/service";
import { getAllProcesses } from "../api/process";
import { createMenuByUserAndRol, getAllMenus } from "../api/menu";
import { createSubMenuByUserAndRol, getAllSubMenus } from "../api/submenu";
import { getUserById } from "../api/user";
import { store } from "../redux/store";

function generateCombinations(
  user_id,
  arrayPlazas,
  arrayServicios,
  arrayProcesos
) {
  // Create an array to store the final result
  const resultArray = [];

  // Loop through each plaza
  arrayPlazas.forEach((plaza) => {
    // Loop through each service
    arrayServicios.forEach((servicio) => {
      // Loop through each process
      arrayProcesos.forEach((proceso) => {
        // Create an object with id_plaza, id_servicio, and id_proceso
        const dataObject = {
          id_usuario: user_id,
          id_plaza: plaza.id_plaza,
          id_servicio: servicio.id_servicio,
          id_proceso: proceso.id_proceso,
        };

        // Push the dataObject to the resultArray
        resultArray.push(dataObject);
      });
    });
  });

  return resultArray;
}

function generateMenuObjects(menuArray, idRol, idUsuario) {
  const resultArray = [];

  menuArray.forEach((item) => {
    if (item.activo) {
      const dataObject = {
        id_menu: item.id_menu,
        id_rol: idRol,
        id_usuario: idUsuario,
        activo: true,
      };

      resultArray.push(dataObject);
    } else {
      const dataObject = {
        id_menu: item.id_menu,
        id_rol: idRol,
        id_usuario: idUsuario,
        activo: false,
      };

      resultArray.push(dataObject);
    }
  });

  return resultArray;
}

function generateSubMenuObjects(subMenuArray, idRol, idUsuario) {
  const resultArray = [];

  subMenuArray.forEach((item) => {
    if (item.activo) {
      const dataObject = {
        id_sub_menu: item.id_sub_menu,
        id_rol: idRol,
        id_usuario: idUsuario,
        activo: true,
      };

      resultArray.push(dataObject);
    } else {
      const dataObject = {
        id_sub_menu: item.id_sub_menu,
        id_rol: idRol,
        id_usuario: idUsuario,
        activo: false,
      };

      resultArray.push(dataObject);
    }
  });

  return resultArray;
}

const steps = [
  "Datos generales",
  "Selecciona las plazas",
  "Selecciona los menus",
];

export default function HorizontalNonLinearStepper({
  setComponentesVisibility,
  componentName,
  fetchUser
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [snackbar, setSnackbar] = React.useState(null);

  // DATOS DE GENERALES Y DE ACCESO
  const [datosGenerales, setDatosGenerales] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefonoPersonal: "",
    telefonoEmpresa: "",
    sexo: "",
    fechaNacimiento: "",
    foto: "",
    usuarioAcceso: "",
    password: "",
    rol: "",
    accesoSeroWeb: false,
    accesoSeroMovil: false,
    credencialesCorreo: false,
    credencialesWhatsApp: false,
  });

  /**
   * Cierra la notificación (snackbar) actualmente abierta.
   *
   * @function
   * @name handleCloseSnackbar
   */
  const handleCloseSnackbar = () => setSnackbar(null);

  // PLAZAS, SERVICIOS Y PROCESOS
  const [plazasServiciosProcesos, setPlazasServiciosProcesos] = useState({
    plazas: [],
    servicios: [],
    procesos: [],
  });

  const [selectedMenus, setSelectedMenus] = React.useState([]);

  const extractedData = plazasServiciosProcesos?.plazas?.map((plaza) => {
    return {
      id_plaza: plaza.id_plaza,
      id_servicio: plaza.relacion_servicio?.service_id || null,
      id_proceso: plaza.relacion_servicio?.relacion_proceso?.process_id || null,
    };
  });

  function agregarIdUsuarioAObjetos(arrayDeObjetos, idUsuario) {
    arrayDeObjetos.forEach((objeto) => {
      objeto.id_usuario = idUsuario;
    });

    return arrayDeObjetos;
  }
  function agregarIdUsuarioAObjetosMenu(arrayDeObjetos, idUsuario) {
    arrayDeObjetos.forEach((objeto) => {
      objeto.id_usuario = idUsuario;
      objeto.activo = true;
    });

    return arrayDeObjetos;
  }

  const [notShowFormPlazas, setNotFormShowPlazas] = useState(true);
  const [notShowFormMenus, setNotFormShowMenus] = useState(true);
  const [services, setServices] = React.useState([]);
  const [processes, setProcesses] = React.useState([]);
  const [places, setPlaces] = React.useState([]);
  const [menus, setMenus] = React.useState([]);
  const [submenus, setSubmenus] = React.useState([]);
  



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
    console.log("HandlerStep " + step);
    setActiveStep(step);
  };

  /* const handleComplete = async () => {
  const {
    nombre,
    apellidoPaterno,
    sexo,
    telefonoPersonal,
    fechaNacimiento,
    foto,
    password,
    rol,
    usuarioAcceso,
    accesoSeroWeb,
    accesoSeroMovil,
    credencialesCorreo,
    credencialesWhatsApp,
    telefonoEmpresa
  } = datosGenerales;

  if (
    [nombre, apellidoPaterno, sexo, telefonoPersonal, password, rol].includes('') ||
    foto.length === 0
  ) {
    setSnackbar({
      children: "Campos incompletos favor de llenar todos los campos",
      severity: "error",
    });
  } else {
    try {
      const commonUserData = {
        name: nombre,
        first_last_name: apellidoPaterno,
        second_last_name: datosGenerales.apellidoMaterno,
        birthdate: fechaNacimiento,
        sex_id: sexo,
        user_name: usuarioAcceso,
        password: password,
        profile_id: rol,
        active_web_access: accesoSeroWeb,
        active_app_movil_access: accesoSeroMovil,
        personal_phone: telefonoPersonal,
        work_phone: telefonoEmpresa,
        url_image: foto,
        active_credentials_by_whats_app:credencialesWhatsApp,
        active_credentials_by_email:credencialesCorreo,
      };

      // Registrar usuario en SeroMovil si está habilitado
      if (accesoSeroMovil) {
        await registerUserFirebase(usuarioAcceso, password, nombre, rol);
      }

      // Registrar usuario con datos comunes
      const response = await registerUser(commonUserData);

      // Subir la foto a Firebase o al S3 (aquí puedes añadir la lógica necesaria)

      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setSnackbar({
        children: "Se registro usuario con exito",
        severity: "success",
      });
      setNotFormShowPlazas(false);
      setCompleted(newCompleted);
      handleNext();
    } catch (error) {
      console.error(error);
      setSnackbar({
        children: `${error}`,
        severity: "error",
      });
    }
  }
}; */

  /**
   * Función asíncrona para obtener los datos de los servicios y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchSubMenus = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllSubMenus();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_servicio || index.toString(),
      }));

      setSubmenus(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Función asíncrona para obtener los datos de los servicios y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchMenus = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllMenus();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_servicio || index.toString(),
      }));

      setMenus(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Función asíncrona para obtener los datos de los servicios y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchPlaces = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllPlaces();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_servicio || index.toString(),
      }));

      setPlaces(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Función asíncrona para obtener los datos de los servicios y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchServices = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllServices();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_servicio || index.toString(),
      }));

      setServices(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Función asíncrona para obtener los datos de los roles y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchProcesses = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllProcesses();

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_proceso,
      }));

      setProcesses(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchSubMenus();
    fetchMenus();
    fetchPlaces();
    fetchProcesses();
    fetchServices();
    fetchUser();
  }, []);

  const handleComplete = async () => {
    const {
      nombre,
      apellidoPaterno,
      sexo,
      telefonoPersonal,
      fechaNacimiento,
      foto,
      password,
      rol,
      usuarioAcceso,
      accesoSeroWeb,
      accesoSeroMovil,
      credencialesCorreo,
      credencialesWhatsApp,
      telefonoEmpresa,
    } = datosGenerales;

    // Función para mostrar mensajes de error en el Snackbar
    const showSnackbarError = (message) => {
      setSnackbar({
        children: message,
        severity: "error",
      });
    };

    if (
      (rol !== 1 &&
        [
          nombre,
          apellidoPaterno,
          sexo,
          telefonoPersonal,
          fechaNacimiento,
          foto,
          password,
          rol,
          usuarioAcceso,
          telefonoEmpresa,
        ].some((field) => field === "")) ||
      foto.length === 0
    ) {
      showSnackbarError(
        "Campos incompletos para el rol seleccionado, por favor, llena todos los campos obligatorios."
      );
      return;
    }

    // Verificación de campos para rol Administrador
    if (
      (rol === 1 &&
        [
          nombre,
          apellidoPaterno,
          sexo,
          telefonoPersonal,
          fechaNacimiento,
          foto,
          password,
          rol,
          usuarioAcceso,
          telefonoEmpresa,
        ].some((field) => field === "")) ||
      foto.length === 0
    ) {
      showSnackbarError(
        "Campos incompletos para rol Administrador, por favor, llena todos los campos obligatorios."
      );
      return;
    }

    // Verificación de campos para rol que no sea Administrador (puedes ajustar según tus necesidades)

    // Verificación de campos específicos
    if (
      rol == 1 &&
      accesoSeroWeb !== true &&
      accesoSeroMovil !== true &&
      credencialesCorreo !== true &&
      credencialesWhatsApp !== true
    ) {
      showSnackbarError(
        "Para el rol de administrador, asegúrate de proporcionar valores válidos para 'accesoSeroWeb', 'accesoSeroMovil', 'credencialesCorreo' y 'credencialesWhatsApp"
      );
      return;
    }

    const commonUserData = {
      name: nombre,
      first_last_name: apellidoPaterno,
      second_last_name: datosGenerales.apellidoMaterno,
      birthdate: fechaNacimiento,
      sex_id: sexo,
      user_name: usuarioAcceso,
      password: password,
      profile_id: rol,
      active_web_access: accesoSeroWeb,
      active_app_movil_access: accesoSeroMovil,
      personal_phone: telefonoPersonal,
      work_phone: telefonoEmpresa,
      url_image: foto,
      active_credentials_by_whats_app: credencialesWhatsApp,
      active_credentials_by_email: credencialesCorreo,
    };

    try {
      if (activeStep === 0) {
        if (activeStep === 0 && datosGenerales.rol === 1) {
          if (accesoSeroMovil) {
            await registerUserFirebase(usuarioAcceso, password, nombre, rol);
          }

          // Registrar usuario con datos comunes
          const response = await registerRequest(commonUserData);

          if ((response.id_usuario, places, services, processes)) {
            const extractedData = generateCombinations(
              response.id_usuario,
              places,
              services,
              processes
            );
            console.log(extractedData);
            extractedData.forEach(async (data) => {
              try {
                // Use the spread operator (...) to add id_usuario property to the data object

                // Call createUserPlazaServiceProcess with the updated data object
                console.log(data);
                await createUserPlazaServiceProcess(data);
                console.log(
                  "User plaza service process data created successfully"
                );
              } catch (error) {
                console.error(
                  "Error creating user plaza service process data:",
                  error
                );
              }
            });
          }

          if ((response.id_usuario, menus, response.id_rol)) {
            const extractedMenuData = generateMenuObjects(
              menus,
              response.id_rol,
              response.id_usuario
            );

            extractedMenuData.forEach(async (data) => {
              try {
                // Use the spread operator (...) to add id_usuario property to the data object

                // Call createUserPlazaServiceProcess with the updated data object
                await createMenuByUserAndRol(data);
                console.log(
                  "User plaza service process data created successfully"
                );
              } catch (error) {
                console.error(
                  "Error creating user plaza service process data:",
                  error
                );
              }
            });
          }

          if ((response.id_usuario, submenus, response.id_rol)) {
            const extractedSubMenuData = generateSubMenuObjects(
              submenus,
              response.id_rol,
              response.id_usuario
            );

            extractedSubMenuData.forEach(async (data) => {
              try {
                // Use the spread operator (...) to add id_usuario property to the data object

                

                // Call createUserPlazaServiceProcess with the updated data object
                await createSubMenuByUserAndRol(data);
                console.log(
                  "User plaza service process data created successfully"
                );
              } catch (error) {
                console.error(
                  "Error creating user plaza service process data:",
                  error
                );
              }
            });
          }

          setCompleted({
            0: true,
            1: true,
            2: true,
          });
          setSnackbar({
            children: "Admin registrado con exito ",
            severity: "success",
          });

          // Salir del proceso aquí si se cumple la condición
          fetchUser()
          setTimeout(() => {
            setComponentesVisibility({
              dataGridVisible: true,
              stepperVisible: false,
            });
            
          }, 2000);
         
          return;
        }

        if (activeStep === 0 && datosGenerales.rol == 5) {
          if (!accesoSeroMovil || accesoSeroWeb) {
            showSnackbarError(
              "Para el rol de gestor, asegúrate de proporcionar valores válidos para  'accesoSeroMovil' y no puedes seleccionar 'accesoSeroWeb' ya que es invalido para este rol"
            );

            return;
          } else {
            setNotFormShowPlazas(false);
            setCompleted({
              0: true,
            });
            handleNext();

            setSnackbar({
              children: "Se guardaron datos de gestor con exito",
              severity: "success",
            });
          }
        }
        setNotFormShowPlazas(false);
        setCompleted({
          0: true,
        });
        handleNext();

        setSnackbar({
          children: `Se guardaron los datos de ${datosGenerales.rol} con exito`,
          severity: "success",
        });
      }
      /* Administrador  el gestor no tiene ningun proceso ni menu */

      /* Paso 2  Aqui*/

      if (activeStep === 1) {
        if (activeStep === 1 && datosGenerales.rol == 5) {
          try {
            // Registro de usuario en Firebase y en el sistema
            const [firebaseRegistration, systemRegistration] =
              await Promise.all([
                registerUserFirebase(usuarioAcceso, password, nombre, rol),
                registerUser(commonUserData),
              ]);


              



           /*  if (systemRegistration.id_usuario) {
              const objetosActualizados = agregarIdUsuarioAObjetosMenu(
                selectedMenus,
                systemRegistration.id_usuario
              ); */

              if (systemRegistration.id_usuario) {
                const objetosActualizados = agregarIdUsuarioAObjetos(
                  extractedData,
                  systemRegistration.id_usuario
                );

                // Creación de menús en paralelo
        
                objetosActualizados.forEach(async (data) => {
                  try {
                    console.log(data);
                    // Use the spread operator (...) to add id_usuario property to the data object
      
                    // Call createUserPlazaServiceProcess with the updated data object
                    await createUserPlazaServiceProcess(data);
                    console.log(
                      "User plaza service process data created successfully"
                    );
                  } catch (error) {
                    console.error(
                      "Error creating user plaza service process data:",
                      error
                    );
                  }
                })
            

              setNotFormShowPlazas(false);
              setCompleted({
                0: true,
                1: true,
                2: true,
              });
              fetchUser()
            setTimeout(() => {
              setComponentesVisibility({
                dataGridVisible: true,
                stepperVisible: false,
              });
              
            }, 2000);

              setSnackbar({
                children: "Se registró gestor con éxito",
                severity: "success",
              });
            }
          } catch (error) {
            console.error("Error during gestor registration:", error);
            setSnackbar({
              children: `Error durante el registro del gestor: ${error}`,
              severity: "error",
            });
          }
          return 
        } else {
          setNotFormShowPlazas(false);
          setCompleted({
            0: true,
            1: true,
          });
          handleNext();

          setSnackbar({
            children: "Se seleccionaron las plazas",
            severity: "success",
          });

          
        }

        /*    extractedData?.forEach(async (data) => {
              try {
                const updatedData = { ...data, id_usuario: 999 };
                await createUserPlazaServiceProcess(updatedData);
                console.log("User plaza service process data created successfully");
              } catch (error) {
                console.error("Error creating user plaza service process data:", error);
              }
            }); */

        /*   setNotFormShowPlazas(false);
        setCompleted({
          0: true,
          1: true,
        });
        handleNext();

        setSnackbar({
          children: "Se seleccionaron las plazas",
          severity: "success",
        }); */
      }

      /* Paso 3 Aqui */
      if (
        activeStep === 2 &&
        (datosGenerales.rol != 5 || datosGenerales.rol != 1)
      ) {
        if (accesoSeroMovil) {
          await registerUserFirebase(usuarioAcceso, password, nombre, rol);
        }

        // Registrar usuario con datos comunes
        const response = await registerUser(commonUserData);

        if (response.id_usuario) {
          const objetosActualizados = agregarIdUsuarioAObjetos(
            extractedData,
            response.id_usuario
          );

          objetosActualizados.forEach(async (data) => {
            try {
              // Use the spread operator (...) to add id_usuario property to the data object

              // Call createUserPlazaServiceProcess with the updated data object
              await createUserPlazaServiceProcess(data);
              console.log(
                "User plaza service process data created successfully"
              );
            } catch (error) {
              console.error(
                "Error creating user plaza service process data:",
                error
              );
            }
          });

          const objetosActualizadosMenu = agregarIdUsuarioAObjetosMenu(
            selectedMenus,
            response.id_usuario
          );

          objetosActualizadosMenu.forEach(async (data) => {
            try {
              // Use the spread operator (...) to add id_usuario property to the data object

              // Call createUserPlazaServiceProcess with the updated data object
              await createMenuByUserAndRol(data);
              console.log(
                "User plaza service process data created successfully"
              );
            } catch (error) {
              console.error(
                "Error creating user plaza service process data:",
                error
              );
            }
          });
        }

        setNotFormShowPlazas(false);
        setCompleted({
          0: true,
          1: true,
          2: true,
        });
        handleNext();
            // Salir del proceso aquí si se cumple la condición
            fetchUser()
            setTimeout(() => {
              setComponentesVisibility({
                dataGridVisible: true,
                stepperVisible: false,
              });
              
            }, 2000);
        setSnackbar({
          children: "Se registro usuario con exito",
          severity: "success",
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        children: `${error}`,
        severity: "error",
      });
    }

    // Conditionally set success message only when activeStep is equal to 0

    /*    const newCompleted = completed;
      newCompleted[activeStep] = true;
     
      setNotFormShowPlazas(false);
      setCompleted(newCompleted);
      handleNext(); */
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
        borderColor: "success.main",
      },
    },
    "& .Mui-completed": {
      "&.MuiStepIcon-root": {
        color: "secondary.main",
        fontSize: "2rem",
      },
      "& .MuiStepConnector-line": {
        borderColor: "success.main",
      },
    },
  };

  return (
    <Box>
      <Stepper
        nonLinear
        activeStep={activeStep}
        sx={stepStyle}
        //sx={{backgroundColor: colors.greenAccent[500], padding:'7px', borderRadius:'5px'}}
      >
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
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
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
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
                {notShowFormPlazas === false ? (
                  <SelectPlazaCreateUser
                    setPlazasServiciosProcesos={setPlazasServiciosProcesos}
                  />
                ) : (
                  <MessageAlert
                    title="No se pueden mostrar las plazas, servicios y procesos ya que el usuario aún no se crea"
                    severity="warning"
                  />
                )}
              </>
            )}

            {activeStep + 1 === 3 && (
              <>
                {notShowFormPlazas === false ? (
                  <SelectMenusCreateUser
                    role={datosGenerales.rol}
                    setSelectedMenus={setSelectedMenus}
                  />
                ) : (
                  <MessageAlert
                    title="No se pueden mostrar los menus ya que el usuario aún no se crea"
                    severity="warning"
                  />
                )}
              </>
            )}

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />

              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography
                    variant="caption"
                    sx={{ display: "inline-block" }}
                  >
                    Paso {activeStep + 1} completado
                  </Typography>
                ) : (
                  <Button
                    sx={{
                      mr: 1,
                      backgroundColor: colors.blueAccent[600],
                      color: colors.primary[100],
                      width: "120px",
                      ":hover": {
                        bgcolor: colors.blueAccent[300],
                      },
                    }}
                    onClick={handleComplete}
                  >
                    {completedSteps() === totalSteps() - 1
                      ? "Terminar"
                      : "Completar paso"}
                  </Button>
                ))}
            </Box>
          </React.Fragment>
        )}
      </div>

      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
}
