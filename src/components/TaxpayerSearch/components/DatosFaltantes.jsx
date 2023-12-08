import React from 'react'
import React from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import {
  AccountCircle,
  Payment,
  Person,
  Room,
  Description,
  LocationOn,
  MonetizationOn,
  PaymentSharp,
  AccountBalance,
  House,
  Place,
  SettingsApplications,
  AttachMoney,
  Business,
  ConfirmationNumber,
  LocalLaundryService,
  Receipt,
  DateRange,
  LocalOffer,
  Event,
  PersonOutline,
  PlaylistAddCheck,
  EventNote,
  Assignment,
  TableChart,
  HomeWork,
  AssignmentTurnedIn,
  Image,
  InsertLink,
} from "@mui/icons-material";

const formFields = [
  { name: "cuenta", label: "Cuenta", icon: <AccountBalance /> },
  { name: "clave_catastral", label: "Clave Catastral", icon: <House /> },
  { name: "propietario", label: "Propietario", icon: <Person /> },
  { name: "calle", label: "Calle", icon: <LocationOn /> },
  { name: "colonia", label: "Colonia", icon: <LocationOn /> },
  { name: "latitud", label: "Latitud", icon: <Place /> },
  { name: "longitud", label: "Longitud", icon: <Place /> },
  { name: "tipo_de_servicio", label: "Tipo de Servicio", icon: <SettingsApplications /> },
  { name: "tipo_tarifa", label: "Tipo de Tarifa", icon: <AttachMoney /> },
  { name: "giro", label: "Giro", icon: <Business /> },
  { name: "serie_medidor", label: "Serie de Medidor", icon: <ConfirmationNumber /> },
  { name: "servicio", label: "Servicio", icon: <LocalLaundryService /> },
  { name: "recibo", label: "Recibo", icon: <Receipt /> },
  { name: "descripcion", label: "Descripción", icon: <Description /> },
  { name: "tipo_pago", label: "Tipo de Pago", icon: <Payment /> },
  { name: "periodo", label: "Periodo", icon: <DateRange /> },
  { name: "año_inicio", label: "Año de Inicio", icon: <DateRange /> },
  { name: "bimestre_inicio", label: "Bimestre de Inicio", icon: <DateRange /> },
  { name: "año_fin", label: "Año de Fin", icon: <DateRange /> },
  { name: "bimestre_fin", label: "Bimestre de Fin", icon: <DateRange /> },
  { name: "promocion", label: "Promoción", icon: <LocalOffer /> },
  { name: "deuda", label: "Deuda", icon: <MonetizationOn /> },
  { name: "fecha_pago", label: "Fecha de Pago", icon: <Event /> },
  { name: "total_pagado", label: "Total Pagado", icon: <MonetizationOn /> },
  { name: "porcentaje_pagado", label: "Porcentaje Pagado", icon: <MonetizationOn /> },
  { name: "porcentaje_descuento", label: "Porcentaje de Descuento", icon: <MonetizationOn /> },
  { name: "descuento", label: "Descuento", icon: <MonetizationOn /> },
  { name: "gestor", label: "Gestor", icon: <PersonOutline /> },
  { name: "tarea_gestionada", label: "Tarea Gestionada", icon: <PlaylistAddCheck /> },
  { name: "fecha_gestion", label: "Fecha de Gestión", icon: <EventNote /> },
  { name: "tipo_gestion", label: "Tipo de Gestión", icon: <Assignment /> },
  { name: "tabla_gestion", label: "Tabla de Gestión", icon: <TableChart /> },
  { name: "estatus_predio", label: "Estatus del Predio", icon: <HomeWork /> },
  { name: "estatus_gestion_valida", label: "Estatus de Gestión Valida", icon: <AssignmentTurnedIn /> },
  { name: "estatus_cartera", label: "Estatus en Nuestra Cartera", icon: <AccountBalance /> },
  { name: "estatus_cuenta", label: "Estatus de la Cuenta", icon: <AccountBalance /> },
  { name: "bimestre_valido", label: "Bimestre Válido", icon: <DateRange /> },
  { name: "foto_fachada_predio", label: "Foto Fachada del Predio", icon: <Image /> },
  { name: "url_imagen_fachada", label: "URL de la Imagen de Fachada", icon: <InsertLink /> },
  { name: "foto_evidencia_predio", label: "Foto de Evidencia del Predio", icon: <Image /> },
  { name: "url_imagen_evidencia", label: "URL de la Imagen de Evidencia", icon: <InsertLink /> },
];


function DatosFaltantes({ formFields }) {
  const { handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" color="textSecondary">
        Formulario Personalizado
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {formFields?.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            label={field.label}
            icon={field.icon}
            control={control} />
        ))}
        <Button type="submit" variant="contained" color="primary">
          Enviar
        </Button>
      </form>
    </Container>
  );
}

function FormField({ name, label, icon, control }) {
  return (
    <Box mb={2}>
      <label style={{ display: "flex", alignItems: "center" }}>
        {icon} {/* Icono */}
        <Typography variant="caption" color="textSecondary">
          {label}
        </Typography>
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => <TextField {...field} fullWidth />}
      />
    </Box>
  );
}

export default DatosFaltantes;


