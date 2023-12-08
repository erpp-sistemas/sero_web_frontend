import React from "react";
import { useForm } from "react-hook-form";
import { Button, Container, Typography } from "@mui/material";
import FormInput from "./FormInput";
import "./styles/FormularioDatosContribuyente.css";
const classNames = {
  principal: "FormularioDatosContribuyentePrincipal",
  form: "FormularioDatosContribuyente",
  input: "FormularioDatosContribuyenteInput",
};

const inputs = [
  { text: "Cuenta", name: "cuenta" },
  { text: "Propietario", name: "propietario" },
  { text: "Posicion", name: "posicion" },
  { text: "CFDI", name: "CFDI" },
  { text: "Folio", name: "folio" },
  // { text: "Clave Catastral", name: "claveCatastral" },
  // { text: "Tipo de Servicio", name: "tipoDeServicio" },
  // { text: "Tipo de Tarifa", name: "tipoDeTarifa" },
  // { text: "Giro", name: "giro" },
  // { text: "Serie del medidor", name: "serieDelMedidor" },
  // { text: "Servicio", name: "servicio" },
];
123;
const FormularioDatosContribuyente = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Aquí puedes manejar los datos del formulario
    const { posicion } = data;
    if (!posicion) return;
    //* https://www.google.com/maps/@19.6580354,-99.2109048,16z?hl=es&entry=ttu
    const search =
      /(?:(?:https\:\/\/)?www\.google\.com\/maps\/?@)(-?[\d.]+),(-?[\d.]+)/g;
    console.log({ posicion, search });
    const matches = search.exec(posicion);
    if (!matches) return;
    const [match, latitud, longitud] = matches;

    console.log({ match, longitud, latitud });

    // posicion.
  };

  return (
    <Container className={classNames.principal}>
      <Typography variant="h5">Actualizar Datos Contribuyente</Typography>
      <form className={classNames.form} onSubmit={handleSubmit(onSubmit)}>
        {inputs.map((input) => (
          <FormInput
            key={input.name}
            control={control}
            labelName={input.name}
            labelText={input.text}
            classNameBox={classNames.input}
          />
        ))}

        <Button type="submit" variant="contained" color="primary">
          Enviar
        </Button>
      </form>
    </Container>
  );
};

export default FormularioDatosContribuyente;
