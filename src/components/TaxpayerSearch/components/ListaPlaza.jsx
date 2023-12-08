import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel, Box
} from "@mui/material";

const options = [
  "Zinacantepec",
  "Cuautitlan Izcalli",
  "Demo",
  "Naucalpan",
  // "Cuautitlan Izcalli",
];


const ListaPlaza = ({ setSelected, ...rest }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    const index = event.target.value;
    // const [index, text] = item;
    setSelectedOption(index);
    setSelected({ index, text: options[index] });
    // console.log({ index, text });
    // const itemIndex = event.target.inde as string;
  };

  return (
    <Box {...rest}>
      <FormControl style={{ width: "fit-content", minWidth: '100%' }}>
        <InputLabel sx={{ width: "auto" }} id="select-label">
          Selecciona Plaza
        </InputLabel>
        <Select
          labelId="select-label"
          id="select"
          variant="standard"
          value={`${selectedOption}`}
          label="Selecciona una opción"
          onChange={handleChange}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={`${index}`}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <p>Seleccionaste: {selectedOption}</p> */}
    </Box>
  );
};

export default ListaPlaza;
