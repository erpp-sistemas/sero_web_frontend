import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";

import { SearchOutlined, KeyboardArrowDownOutlined } from "@mui/icons-material";

import { tokens } from "../../theme";

const FilterBar = ({ plazas = [], onChange, isLoading }) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedPlaza, setSelectedPlaza] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Styles
  |--------------------------------------------------------------------------
  */

  const selectStyles = {
    borderRadius: "10px",
    fontSize: "0.875rem",
    backgroundColor: colors.bgContainer,

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.borderContainer,
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.accentGreen[100],
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.accentGreen[200],
      boxShadow: "0 0 0 3px rgba(34,197,94,.15)",
    },
  };

  /*
  |--------------------------------------------------------------------------
  | Effects
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!plazas.length) return;

    const plaza = plazas[0];

    const servicio = plaza.servicios?.[0] || null;

    setSelectedPlaza(plaza);

    setSelectedServicio(servicio);

  }, [plazas]);

  /*
  |--------------------------------------------------------------------------
  | Events
  |--------------------------------------------------------------------------
  */

  const handlePlazaChange = (event) => {

    const plaza = plazas.find(
      (item) => item.id_plaza === event.target.value
    );

    setSelectedPlaza(plaza);

    setSelectedServicio(plaza?.servicios?.[0] || null);

  };

  const handleServicioChange = (event) => {

    const servicio = selectedPlaza?.servicios.find(
      (item) => item.id_servicio === event.target.value
    );

    setSelectedServicio(servicio);

  };

  const handleSearch = () => {

    if (!selectedPlaza || !selectedServicio) return;

    onChange({

      plazaId: selectedPlaza.id_plaza,

      servicioId: selectedServicio.id_servicio,

    });

  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (

    <Box className="w-full mb-6">

      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: colors.bgContainer,
          border: `1px solid ${colors.borderContainer}`,
          transition:
            "background-color .3s ease, border-color .3s ease, box-shadow .3s ease",
          "&:hover": {
            boxShadow: "0 2px 6px rgba(0,0,0,.05)",
          },
        }}
      >

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

          {/* Plaza */}

          <FormControl fullWidth size="small">

            <InputLabel>

              Plaza

            </InputLabel>

            <Select
              value={selectedPlaza?.id_plaza || ""}
              label="Plaza"
              onChange={handlePlazaChange}
              sx={selectStyles}
              IconComponent={(props) => (
                <KeyboardArrowDownOutlined
                  {...props}
                  sx={{
                    color: colors.grey[300],
                    fontSize: 20,
                  }}
                />
              )}
            >

              {plazas.map((plaza) => (

                <MenuItem
                  key={plaza.id_plaza}
                  value={plaza.id_plaza}
                >

                  {plaza.nombre_plaza}

                </MenuItem>

              ))}

            </Select>

          </FormControl>

          {/* Servicio */}

          <FormControl fullWidth size="small">

            <InputLabel>

              Servicio

            </InputLabel>

            <Select
              value={selectedServicio?.id_servicio || ""}
              label="Servicio"
              onChange={handleServicioChange}
              sx={selectStyles}
              IconComponent={(props) => (
                <KeyboardArrowDownOutlined
                  {...props}
                  sx={{
                    color: colors.grey[300],
                    fontSize: 20,
                  }}
                />
              )}
            >

              {selectedPlaza?.servicios?.map((servicio) => (

                <MenuItem
                  key={servicio.id_servicio}
                  value={servicio.id_servicio}
                >

                  {servicio.nombre_servicio}

                </MenuItem>

              ))}

            </Select>

          </FormControl>

          {/* Buscar */}

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={
              !selectedPlaza ||
              !selectedServicio ||
              isLoading
            }
            endIcon={
              <SearchOutlined
                sx={{
                  fontSize: 18,
                  color: colors.textAccent,
                }}
              />
            }
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              fontWeight: 500,
              fontSize: "0.875rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              backgroundColor: colors.accentGreen[100],
              color: colors.textAccent,
              height: "40px",

              "&:hover": {
                backgroundColor: colors.accentGreen[200],
                boxShadow: "0 2px 6px rgba(0,0,0,.08)",
              },

              "&:active": {
                backgroundColor: colors.accentGreen[300],
              },

              "&.Mui-disabled": {
                backgroundColor: colors.grey[300],
                color: colors.grey[500],
              },

              transition: "all .3s ease",
              boxShadow: "none",
            }}
          >

            {isLoading ? "Buscando..." : "Buscar"}

          </Button>

        </div>

      </Box>

    </Box>

  );

};

export default FilterBar;