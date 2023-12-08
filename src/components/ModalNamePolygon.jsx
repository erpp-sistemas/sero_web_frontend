import { useState } from 'react'
import { Box, Button, useTheme, Modal, Typography, TextField } from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import { tokens } from "../theme";




const ModalNamePolygon = ({ setShowModal, setNombrePoligono, aceptName }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#EAF0F0',
        boxShadow: 24,
        pt: 4,
        px: 4,
        pb: 4,
        borderRadius: '10px'
    };

    const [open, setOpen] = useState(true);


    const handleClose = () => {
        setOpen(false);
        setShowModal(false)
    };


    return (
        <div>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <Typography
                        sx={{ fontSize: '16px', marginBottom: '10px', color: colors.primary[500] }}>Agrega un nombre al poligono
                    </Typography>
                    <p sx={{ marginTop: '10px' }} id="parent-modal-description">
                        <Typography sx={{ color: colors.grey[300], display: 'inline-block' }}>
                            Agrega un nombre al poligono seleccionado para su posterior identificación.
                        </Typography>
                    </p>
                    <Box
                        sx={{ marginTop: '15px' }}
                    >

                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Nombre de poligono"
                            type="text"
                            fullWidth
                            variant="standard"
                            color='success'
                            sx={{
                                input: {
                                    "&::placeholder": {
                                        color: "black"
                                    },
                                    color: 'black', borderBottom: '1px solid black'
                                }
                            }}
                            onChange={(e) => setNombrePoligono(e.target.value)}
                        />

                        <Button variant="contained" endIcon={<GridOnIcon />}
                            sx={{ backgroundColor: colors.greenAccent[600], margin: '10px 0' }}
                            onClick={aceptName}
                        >
                            Aceptar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default ModalNamePolygon