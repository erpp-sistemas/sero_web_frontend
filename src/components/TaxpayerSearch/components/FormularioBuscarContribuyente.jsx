import React, { useEffect, useState } from "react";
import { TextField, Button, Paper, InputAdornment, MenuItem } from "@mui/material";
import ListaPlaza from "./ListaPlaza";
import SearchIcon from "@mui/icons-material/Search";
import "./styles/FormularioBuscarContribuyente.css";
import GenericSelect from "./generic/GenericSelect";
import useStore from "./store/useStore.";
import axios from "axios";
import PlaceIcon from '@mui/icons-material/Place';

const FormularioBuscarContribuyente = ({
  cuenta, setCuenta,
  plaza, setPlaza,
  servicio, setServicio
}) => {
  const {specificAccount,setSpecificAccount}=useStore()
  const [searchValue, setSearchValue] = useState('');
  

  // const [cuenta, setCuenta] = useState("");
  // const [plaza, setPlaza] = useState();
  // const [servicio, setServicio] = useState('')
  const apiUrl = `http://localhost:3000/api/AccountHistoryByCount/${searchValue}/`
  const handleSearch = () => {
    // Aquí puedes realizar la acción de búsqueda con el valor de "cuenta"
    // Por ahora, solo mostraremos el valor en la consola

    

    

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;
  
        // Hacer algo con los datos, por ejemplo, actualizar el estado del componente
        setSpecificAccount(data)
      } catch (error) {
        // Manejar errores, por ejemplo, imprimir el mensaje de error en la consola
        console.error('Error al hacer la solicitud:', error.message);
      }
    };
  
    // Llama a la función para hacer la solicitud al montar el componente
    fetchData();
  
    // Si necesitas hacer algo cuando el componente se desmonta, puedes devolver una función desde useEffect
   
    console.log("aqui es boton");
    
  };

  return (
    <Paper
      className="contenedor-formulario-buscar-cuenta"
      variant="outlined"
      elevation={2}
    >

      {/* <GenericSelect
        className="hijo-formulario-buscar-cuenta"
        label={"Selecciona Plaza"}
        setSelected={setPlaza}
        options={[
          "Zinacantepec",
          "Cuautitlan Izcalli",
          "Demo",
          "Naucalpan",
          // "Cuautitlan Izcalli",
        ]}
      /> */}
        <TextField
                   
                    select
                    label="Sexo"
                    variant="filled"
                    sx={{ width: '45%' }}
                    defaultValue=""
                   /*  onChange={(e) => changeControl(e, 'sexo')} */
                >
                    <MenuItem key="1" value="1"> Cuautitlan Mexicoº </MenuItem>
                    <MenuItem key="2" value="2"> Cuautitlan Izcalli </MenuItem>
                    <MenuItem key="2" value="2"> Naucalpan </MenuItem>
                    <MenuItem key="3" value="3"> No sabe </MenuItem>
                </TextField>
      <GenericSelect
        className="hijo-formulario-buscar-cuenta"
        label={"Selecciona tipo de servicio"}
        setSelected={setServicio}
        options={["Predio", "Agua"]}
      />
      <TextField
        variant="standard"
        placeholder="Cuenta a Buscar..."
        InputProps={{
          startAdornment: <SearchIcon color="action" fontSize="small" />,
        }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <Button
        className="hijo-formulario-buscar-cuenta"
        variant="outlined"
        onClick={handleSearch}
        endIcon={<SearchIcon />}
        style={{ maxWidth: 200 }} // Hace que este elemento se expanda
      >
        Buscar
      </Button>
    </Paper>
  );
};

export default FormularioBuscarContribuyente;
