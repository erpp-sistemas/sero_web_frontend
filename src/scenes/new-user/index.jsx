import React, { useState, useMemo, useEffect } from "react";
import { Chip, Button } from "@mui/material";
import PersonalDataStep from "../../components/NewUser/PersonalDataStep";
import AssignedPlacesStep from "../../components/NewUser/AssignedPlacesStep";
import useFormulario from "../../hooks/useFormulario";
import { useDispatch } from "react-redux";
import { resetFormulario } from "../../redux/formularioSlice";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const allSteps = [
  {
    key: "datosPersonales",
    label: "Datos personales",
    component: PersonalDataStep,
  },
  {
    key: "plazas",
    label: "Plazas",
    component: AssignedPlacesStep,
  },
  {
    key: "menus",
    label: "Menús",
    component: () => <div>Menús (en construcción)</div>,
  },
  {
    key: "horario",
    label: "Horario",
    component: () => <div>Horario (en construcción)</div>,
  },
  {
    key: "resguardo",
    label: "Resguardo",
    component: () => <div>Resguardo (en construcción)</div>,
  },
];

export default function UserCreationWizard({
  mode = "create",
  initialData = {},
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState(initialData || {});
  const dispatch = useDispatch();

  const { guardarSeccion, seccionesVisibles, seccionesCompletadas } =
    useFormulario();

  useEffect(() => {
    dispatch(resetFormulario());
  }, [dispatch]);

  // 🔍 Memoizamos los pasos visibles según el estado Redux
  const visibleSteps = useMemo(() => {
    return allSteps.filter((step) => {
      if (step.key === "datosPersonales") return true; // siempre visible
      return seccionesVisibles?.[step.key];
    });
  }, [seccionesVisibles]);

  const handleChangeStep = (index) => {
    setActiveStep(index);
  };

  const handleSaveDraft = () => {
    console.log("Guardar borrador:", userData);
    // Podrías llamar guardarBorrador() del hook
  };

  const handleFinalize = () => {
    console.log("Finalizar registro:", userData);
    // Aquí llamarías a la API para guardar al usuario
  };

  const CurrentStepComponent =
    visibleSteps[activeStep]?.component || (() => <div>Sin paso</div>);

    console.log("Secciones completadas:", seccionesCompletadas);


  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Chips de navegación */}
      <div className="flex flex-wrap gap-2">
        {visibleSteps.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = seccionesCompletadas?.[step.key]?.completado;

          return (
            <Chip
              key={step.key}
              label={step.label}
              color={isActive ? "info" : "default"}
              onClick={() => handleChangeStep(index)}
              variant={isActive ? "filled" : "outlined"}
              clickable
              icon={isCompleted ? <CheckCircleIcon color="secondary" /> : null}
            />
          );
        })}
      </div>

      {/* Contenido del paso actual */}
      <div className="border rounded-2xl p-6 min-h-[300px] shadow-md">
        <CurrentStepComponent
          mode={mode}
          initialValues={userData}
          onChange={(updatedData) => setUserData(updatedData)}          
        />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button variant="contained" color="primary" onClick={handleSaveDraft}>
          Guardar Borrador
        </Button>
        <Button variant="contained" color="primary" onClick={handleFinalize}>
          {mode === "edit" ? "Guardar Cambios" : "Finalizar"}
        </Button>
      </div>
    </div>
  );
}
