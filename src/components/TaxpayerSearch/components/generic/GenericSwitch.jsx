import React, { useState } from "react";
import { Switch, FormControlLabel } from "@mui/material";

const GenericSwitch = ({ label, checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = ({ target: { checked } }) => {
    setIsChecked(checked);
    onChange(checked);
  };

  return (
    <FormControlLabel
      control={<Switch checked={isChecked} onChange={handleChange} />}
      label={label}
    />
  );
};

export default GenericSwitch;
