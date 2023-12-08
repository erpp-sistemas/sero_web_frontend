import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import {
  Close as CloseIcon
} from "@mui/icons-material";

function DialogBar({ closeDialog }) {
  return (
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={closeDialog} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          Subir imagenes
        </Typography>
        <Button autoFocus color="inherit" onClick={closeDialog}>
          save
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default DialogBar;