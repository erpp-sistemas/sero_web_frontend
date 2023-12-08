import React from "react";
import './styles/FormularioDatosFaltantes.css'
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';

const formFields = [
  { name: "nombre", label: "Nombre", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "mensaje", label: "Mensaje", type: "textarea" },
];

function FormularioDatosFaltantes({ campos, setNuevosCampos }) {
  const { handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    if (setNuevosCampos) setNuevosCampos(data)
    
    // console.log(data);
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center">
        <Typography sx={{
          textAlign: 'center',
          width: '100%',
          marginTop: 2,
          marginBottom: 2,
        }} variant="h5" color="textSecondary">
          <CreateIcon fontSize="medium" color="primary" />
          Formulario de datos faltantes
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {campos?.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            control={control} />
        ))}
        <Button type="submit" variant="contained" color="primary">
          Enviar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Rellenar
        </Button>
      </form>
    </Container>
  );
}

function FormField({ name, label, type, control }) {
  const commonTextFieldProps = {
    name,
    control,
    defaultValue: "",
  };

  if (type === "textarea") {
    return <TextareaField
      name={name}
      label={label}
      control={control}
      commonTextFieldProps={commonTextFieldProps}
    />;
  } else {
    return (
      <Box sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
      }} mb={2}>
        <label className="capitalize" style={{ width: 300, textAlign: 'left' }}>{label}</label>
        <Controller
          {...commonTextFieldProps}
          render={({ field }) =>
            <TextField {...field} fullWidth className="capitalize datos-faltantes-input" />
          }
        />
      </Box>
    );
  }
}

function TextareaField({ name, label, control, commonTextFieldProps }) {
  return (
    <Box mb={2}>
      <label className="capitalize">
        <Typography variant="caption" color="textSecondary">
          {label}
        </Typography>
      </label>
      <Controller
        {...commonTextFieldProps}
        render={({ field }) => <TextareaAutosize {...field} minRows={3} />}
      />
    </Box>
  );
}


export default FormularioDatosFaltantes;
