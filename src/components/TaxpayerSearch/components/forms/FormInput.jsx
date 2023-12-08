import React from "react";
import { Controller } from "react-hook-form";
import { TextField, Box } from "@mui/material";


// type  propsInput = ControllerProps
const FormInput = ({
  labelText,
  labelName,
  control,
  config,
  sxBox,
  classNameBox,
  // sxController
}) => {
  return (
    <Box sx={sxBox} my={2} className={classNameBox}>
      <Controller
        name={labelName}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField label={labelText} variant="outlined" {...field} />
        )}
        {...config}
      />
    </Box>
  );
};

export default FormInput;
