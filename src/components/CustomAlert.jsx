import React, { useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CustomAlert = ({ alertOpen, type, message, onClose }) => {

  useEffect(() => {
    let timer;
    if (alertOpen) {
      timer = setTimeout(() => {
        onClose(false);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [alertOpen, onClose]);

  return (
    <Snackbar open={alertOpen} autoHideDuration={5000} onClose={() => onClose(false)}  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert severity={type} onClose={() => onClose(false)}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
