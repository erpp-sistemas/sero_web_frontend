import { Alert, AlertTitle } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
/**
 * Displays an alert message based on the provided alert information.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.alertInfo - The alert information object.
 * @param {number} props.alertInfo.status - The status code of the alert.
 * @param {string} props.alertInfo.statusText - The status text of the alert.
 * @returns {JSX.Element | null} JSX Element representing the alert or null if there is no alert information.
 */
function AlertAccountHistory({ alertInfo }) {
  // Return null if there is no alert information
  if (!alertInfo) {
    return null;
  }
  // Variables for severity, title, and message based on the status code
  let severity;
  let title;
  let message;
  // Switch statement to determine severity, title, and message based on the status code category
  switch (Math.floor(alertInfo.status / 100)) {
    case 2:
      severity = "success";
      title = "Éxito";
      message = "La información se cargó correctamente.";
      break;

    case 4:
      severity = "error";
      title = `Error ${alertInfo.status}`;
      message =
        "Hubo un problema al procesar tu solicitud. Por favor, verifica los datos ingresados.";
      break;

    case 5:
      severity = "error";
      title = `Error ${alertInfo.status}`;
      message =
        "Hubo un error en el servidor. Por favor, inténtalo de nuevo más tarde.";
      break;

    default:
      severity = "info";
      title = "Información";
      message = "Se recibió una respuesta con un código de estado inesperado.";
  }
// JSX rendering of the alert
  return (
    <Alert severity={severity}>
      <AlertTitle>{title}</AlertTitle>
      {message} — <strong>{alertInfo.statusText}</strong>
    </Alert>
  );
}

// Especificación de PropTypes para las props
AlertAccountHistory.propTypes = {
  alertInfo: PropTypes.shape({
    status: PropTypes.number.isRequired,
    statusText: PropTypes.string.isRequired,
  }),
};

export default AlertAccountHistory;
