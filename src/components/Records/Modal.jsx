import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Alert, colors } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SpringModal({ open, setOpen, text, type, action }) {

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Alert variant="filled" severity={type}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ color: "#fff" }}
            >
             {text}
            </Typography>
          </Alert>
         <Box sx={{display:"flex"}}>
         <Button variant="contained"  sx={{margin:"10px 0 0 auto"}} onClick={action}>
            aceptar
          </Button>
         </Box>
        </Box>
      </Modal>
    </div>
  );
}
