import { Button } from "@mui/material";

function DialogOpenButton({ openDialog }) {
  return (
    <Button variant="outlined" onClick={openDialog}>
      Open full-screen dialog
    </Button>
  );
}
export default DialogOpenButton;