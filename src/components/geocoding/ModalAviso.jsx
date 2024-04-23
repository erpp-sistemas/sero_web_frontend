
    import Box from '@mui/material/Box';
    import Modal from '@mui/material/Modal';
    import { Alert, Button } from '@mui/material';
    
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,

    };
    const style_btn = {
        margin:"0 auto"
    };
    
    const ModalAviso = ({open,setOpen,plaza}) => {
      
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
    
      return (
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} >
            <Alert variant="filled" severity="info">SI CAMBIAS DE PLAZA SE PERDERAN TODOS LOS DATOS</Alert>
                <Box display={"flex"} justifyContent={"space-around"} marginTop={"20px"}>
                    <Button sx={style_btn} variant='contained' color='success'onClick={plaza} >Cambiar de plaza</Button>
                    <Button  sx={style_btn} variant='contained' onClick={()=>setOpen(false)}>Cancelar</Button>
                </Box>
            </Box>
          </Modal>
        </div>
      );
    }


export default ModalAviso