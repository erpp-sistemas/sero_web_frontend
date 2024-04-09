import React, { useState } from 'react';
import { Button, Checkbox } from '@mui/material';

const YourComponent = ({chekCuenta,index}) => {
  const [toggle, setToggle] = useState(true); 

  const handleToggle = () => {
    setToggle(!toggle); 
    chekCuenta(index)
  };

  return (
    <Checkbox
    color="secondary" 
    style={{ color: "#00ff00" }} 
    onClick={handleToggle}
    checked={toggle}
    />
  );
};

export default YourComponent;
