//import './styles/FormularioSubirImagen.css'

import { useEffect, useState } from "react";
import Dialog from "./Dialog";
import DialogBar from "./DialogBar";
import DialogContainerContent from "./DialogContainerContent";
import DialogOpenButton from "./DialogOpenButton";
import Form from "./Form";
import useDialog from "./useDialog";
import { useForm } from "react-hook-form";
import useConfig from "./useConfig";

const FormularioSubirImagen = ({
  onOpenDialog,
  onSumit: onSubmitCallback,
  children,
}) => {
  const form = useForm();
  const { config } = useConfig();
  const { open, openDialog, closeDialog } = useDialog();
  const [nodeOpenDialog, setNodeOpenDialog] = useState();
  useEffect(() => {
    const nodeOpenDialog = onOpenDialog(openDialog);
    const isValid = Boolean(nodeOpenDialog);
    // console.log({ nodeOpenDialog, isValid });
    if (onOpenDialog && isValid) setNodeOpenDialog(nodeOpenDialog);
  }, []);
  const onSubmit = (data) => {
    data.activo = true;
    if (onSubmitCallback) onSubmitCallback(data);
    form.reset();
    if (config.isClosedAutomatically) closeDialog();
    
    console.log({ data });
  };
  return (
    <div>
      {/* <DialogOpenButton openDialog={openDialog} /> */}
      {nodeOpenDialog}
      <Dialog open={open} closeDialog={closeDialog}>
        <DialogBar closeDialog={closeDialog} />

        <DialogContainerContent>
          <Form form={form} onSubmit={onSubmit} />
        </DialogContainerContent>
      </Dialog>
    </div>
  );
};

export default FormularioSubirImagen;
