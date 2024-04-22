import React, { useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CustomAlert = ({ alertOpen, type, message, onClose }) => {

  useEffect(() => {
    let timer;
    if (alertOpen) {
      timer = setTimeout(() => {
        onClose(false);
      }, 7000);
    }

    return () => clearTimeout(timer);
  }, [alertOpen, onClose]);

  return (
    <Snackbar open={alertOpen} autoHideDuration={7000} onClose={() => onClose(false)}  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert variant="filled" severity={type} onClose={() => onClose(false)} sx={{ fontSize: '1rem', color: 'white' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
