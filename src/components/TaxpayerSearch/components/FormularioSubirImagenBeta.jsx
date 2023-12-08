
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Container,
  Box,
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon
} from "@mui/icons-material";
// import { Close } from "@mui/icons-material";
import React from "react";

const Transition = React.forwardRef(function Transition(
  props,
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const tiposDeFoto = ["Retrato", "Paisaje", "Macro", "Otros"];
function useDialog() {
  const [open, setOpen] = React.useState(false);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return { open, openDialog, closeDialog };
}


function FormularioSubirImagen() {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Sound
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box my={2}>
              <Controller
                name="fecha"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Box>
            <Box my={2}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Foto</InputLabel>
                <Controller
                  name="tipoFoto"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select {...field}>
                      {tiposDeFoto.map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Box>
            <Box my={2}>
              <Controller
                name="usuario"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Usuario" fullWidth />
                )}
              />
            </Box>
            <Box my={2} width={'100%'}>
              <Button fullWidth type="submit" variant="contained" color="primary">
                Enviar
              </Button>
            </Box>
          </form>
        </Container>
      </Dialog>
    </>
  );
};
// export default FormularioSubirImagen;
export default FormularioSubirImagen;