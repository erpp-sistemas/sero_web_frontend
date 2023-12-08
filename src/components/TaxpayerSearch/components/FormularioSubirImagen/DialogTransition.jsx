import { Slide } from "@mui/material";
import { forwardRef } from "react";


const DialogTransition = forwardRef(function Transition(
  props,
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default DialogTransition;