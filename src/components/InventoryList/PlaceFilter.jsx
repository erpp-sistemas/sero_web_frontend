// import React, { useMemo } from "react";
// import {
//   Chip,
//   Stack,
//   Typography,
//   Skeleton,
//   Grow,
//   useTheme,
// } from "@mui/material";
// import LocationCityIcon from "@mui/icons-material/LocationCity";
// import { tokens } from "../../theme";

// function PlaceFilter({
//   inventory,
//   selectedPlaza,
//   filters,
//   onChange,
//   loading,
//   primaryFilter,
// }) {
//   const isThisPrimary = primaryFilter === "plaza";
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   // Filtrar inventario con todos los filtros excepto plaza, solo si es filtro principal
//   const filteredInventory = useMemo(() => {
//     return inventory.filter((item) => {
//       return (
//         (!filters.usuario || isThisPrimary || item.usuario === filters.usuario) &&
//         (!filters.categoria || isThisPrimary || item.categoria === filters.categoria) &&
//         (!filters.subcategoria || isThisPrimary || item.subcategoria === filters.subcategoria) &&
//         (
//           !filters.estatus ||
//           isThisPrimary ||
//           (filters.estatus === "activo" && item.activo === true) ||
//           (filters.estatus === "inactivo" && item.activo === false)
//         )
//       );
//     });
//   }, [inventory, filters, primaryFilter]);

//   // Contar plazas únicas dentro del inventario filtrado
//   const plazaCounts = useMemo(() => {
//     const counts = {};
//     filteredInventory.forEach((item) => {
//       const plaza = item.plaza || "Sin plaza";
//       counts[plaza] = (counts[plaza] || 0) + 1;
//     });
//     return counts;
//   }, [filteredInventory]);

//   const total = Object.values(plazaCounts).reduce((acc, count) => acc + count, 0);

//   // Control para evitar llamadas onChange innecesarias
//   const handleClick = (plaza) => {
//     if ((plaza === null && !selectedPlaza) || plaza === selectedPlaza) return;
//     onChange(plaza === null ? "todos" : plaza);
//   };

//   return (
//     <div className="mb-4">
//       <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", color: colors.accentGreen[100] }}>
//         Plazas:
//       </Typography>

//       {loading ? (
//         <Stack direction="row" spacing={1} flexWrap="wrap">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Skeleton
//               key={i}
//               variant="rounded"
//               width={120}
//               height={32}
//               sx={{ borderRadius: "16px" }}
//             />
//           ))}
//         </Stack>
//       ) : (
//         <Stack direction="row" spacing={1} flexWrap="wrap">
//           <Grow in timeout={300}>
//             <div>
//               <Chip
//                 sx={{ my: 0.5 }}
//                 label={`Todos (${total})`}
//                 color={!selectedPlaza ? "primary" : "default"}
//                 onClick={() => handleClick(null)}
//                 clickable
//                 disabled={total === 0}
//               />
//             </div>
//           </Grow>

//           {Object.entries(plazaCounts).map(([plaza, count]) => (
//             <Grow in timeout={300} key={plaza}>
//               <div>
//                 <Chip
//                   sx={{ my: 0.5 }}
//                   icon={<LocationCityIcon />}
//                   label={`${plaza} (${count})`}
//                   color={selectedPlaza === plaza ? "primary" : "default"}
//                   onClick={() => handleClick(plaza)}
//                   clickable
//                 />
//               </div>
//             </Grow>
//           ))}
//         </Stack>
//       )}
//     </div>
//   );
// }

// export default PlaceFilter;
import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const PlaceFilter = ({ value, onChange, opciones }) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="place-filter-label">Plaza</InputLabel>
      <Select
        labelId="place-filter-label"
        id="place-filter"
        value={value}
        label="Plaza"
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {opciones.map((place, idx) => (
          <MenuItem key={idx} value={place}>
            {place}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PlaceFilter;



