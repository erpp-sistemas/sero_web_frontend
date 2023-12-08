import { Dialog as BasicDialog, DialogContent } from '@mui/material';

const Dialog = ({ visible, children }) => {
  return (
    <BasicDialog open={visible} >
      <DialogContent>
        {children}
      </DialogContent>
    </BasicDialog>
  );
};

export default Dialog;
