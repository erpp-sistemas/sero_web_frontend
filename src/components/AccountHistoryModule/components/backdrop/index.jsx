import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types';
/**
 * Displays a backdrop with a circular progress indicator.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handelOpenBackDrop - Callback function to open the backdrop.
 * @param {Function} props.handelCloseBackDrop - Callback function to close the backdrop.
 * @param {boolean} props.openBackDrop - Flag indicating whether the backdrop is open or closed.
 * @returns {JSX.Element} JSX Element representing the backdrop with circular progress.
 */
function BackDrop({handelOpenBackDrop,handelCloseBackDrop,openBackDrop}) {
    
     // JSX que representa el fondo con el progreso circular
  return (
    
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openBackDrop}
      onClick={handelCloseBackDrop}
    >
      <CircularProgress color="secondary" />
    </Backdrop>
  )
}

// Especificación de PropTypes para las props
BackDrop.propTypes = {
  handelOpenBackDrop: PropTypes.func.isRequired,
  handelCloseBackDrop: PropTypes.func.isRequired,
  openBackDrop: PropTypes.bool.isRequired,
};

export default BackDrop