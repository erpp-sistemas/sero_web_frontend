import { Dialog as MUIDialog } from "@mui/material";
import DialogTransition from "./DialogTransition";

function Dialog({ open, closeDialog, children }) {
  return (
    <MUIDialog fullScreen open={open} onClose={closeDialog} TransitionComponent={DialogTransition}>
      {children}
    </MUIDialog>
  );
}

export default Dialog;