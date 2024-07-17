import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 460,
  bgcolor: 'background.paper',
  border: '2px primary #000',
  boxShadow: 24,
  text:"center",
  display:"flex",
  flexWrap:"wrap",
  p: 4,
};

export default function ModalFichaEmpleado({title,open,close,action,OtionesHtml2}) {

  const handleOpen = () => close(true);
  const handleClose = () => close(false);

  


  return (
    <div>
      
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" margin={"20px auto "} >
                 <ErrorIcon color="warning"/> {title}
            </Typography>

           {
           !OtionesHtml2? 
            <Grid container spacing={2} >
                 <Button   onClick={handleClose} variant="contained" size="medium"  sx={{ margin: "23px auto" }}>
                     CANCELAR
                  </Button>
                  <Button onClick={action} variant="contained" size="medium" color="success" sx={{ margin: "23px auto" }}>
                    ACEPTAR
                  </Button>
            </Grid>
            :
            OtionesHtml2
          }
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}