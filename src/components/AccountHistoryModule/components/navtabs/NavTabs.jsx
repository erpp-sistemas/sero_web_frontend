import { Tab, Tabs } from '@mui/material'
import PropTypes from 'prop-types';
import React from 'react'
import PaymentIcon from '@mui/icons-material/Payment';
import PaidIcon from '@mui/icons-material/Paid';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BusinessIcon from '@mui/icons-material/Business';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import * as Sentry from '@sentry/react';
/**
 * Maneja errores y los reporta a Sentry.
 * 
 * @param {Error} error - Error que se va a reportar.
 * @param {string} errorInfo - Información del error.
 */
const handleSentryError = (error, errorInfo) => {
  Sentry.captureException(error, { extra: errorInfo });
};

/**
 * Componente de pestañas de navegación con íconos para diferentes secciones.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.value - Valor de la pestaña activa.
 * @param {Function} props.handleChange - Función llamada al cambiar de pestaña.
 * @returns {JSX.Element} - Elemento JSX que representa las pestañas de navegación.
 */
function NavTabs({value,handleChange}) {
   
  
  
  return (
    <Tabs /* TabIndicatorProps={{sx:{backgroundColor:"green"}}}  */ value={value} onChange={handleChange}  aria-label="icon tabs example" indicatorColor={"secondary"} textColor='secondary'>
    <Tab icon={<BusinessIcon />} label="Domicilio" value={"Contributor"}/>
    <Tab icon={<PaymentIcon />} label="Adeudos" value={"Debt"}/>
    <Tab icon={<PaidIcon />} label="Pagos" value={"Payments"}/>
    <Tab icon={<SupervisedUserCircleIcon />} label="Acciones" value={"PerformedActions"}/>
    <Tab icon={<PhotoCameraIcon />} label="Fotografias" value={"CapturedPhotographs"}/>
    <Tab icon={<InsertChartIcon />} label="Estadisticas" value={"Statistics"}/>
  </Tabs>
  )
}
NavTabs.propTypes = {
  /**
   * Valor de la pestaña activa.
   */
  value: PropTypes.string.isRequired,

  /**
   * Función llamada al cambiar de pestaña.
   */
  handleChange: PropTypes.func.isRequired,
};


export default Sentry.withErrorBoundary(NavTabs, {
  fallback: (
    <div>
      <p>Hubo un error al renderizar las pestañas.</p>
      <p>El error ha sido reportado automáticamente.</p>
    </div>
  ),
  onError: handleSentryError,
});