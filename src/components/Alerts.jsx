import React, { useState, useEffect } from 'react'
import { Alert, Collapse, Box } from '@mui/material';

function Alerts({ alertOpen, variant, message }) {  

  useEffect(() => {      
    const timer = setTimeout(() => {
      setAlertOpen(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [alertOpen]);

  return (
    <>
      <Box mt={2}>
        <Collapse in={alertOpen}>
          <Alert severity={variant} onClose={() => setAlertOpen(false)}>
            {message}
          </Alert>
        </Collapse>
      </Box>
    </>
  )
}

export default Alerts