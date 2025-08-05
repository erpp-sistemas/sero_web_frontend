// import React, { useMemo } from "react";
// import {
//   Chip,
//   Stack,
//   Typography,
//   Skeleton,
//   Grow,
//   Box,
//   useTheme,
// } from "@mui/material";
// import { tokens } from "../../theme";
// import WidgetsIcon from "@mui/icons-material/Widgets";

// function CategoryFilter({
//   inventory,
//   selectedCategory,
//   filters,
//   onChange,
//   loading,
//   primaryFilter,
// }) {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   // Filtrar inventario según si es filtro principal o no
//   const filteredInventory = useMemo(() => {
//     const isThisPrimary = primaryFilter === "categoria";

//     return inventory.filter((item) => {
//       // Clarifico con paréntesis para evitar confusión:
//       return (
//         (!filters.plaza || isThisPrimary || item.plaza === filters.plaza) &&
//         (!filters.usuario || isThisPrimary || item.usuario === filters.usuario) &&
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

//   // Contar categorías
//   const categoryCounts = useMemo(() => {
//     const counts = {};
//     filteredInventory.forEach((item) => {
//       const category = item.categoria || "Sin categoría";
//       counts[category] = (counts[category] || 0) + 1;
//     });
//     return counts;
//   }, [filteredInventory]);

//   const total = Object.values(categoryCounts).reduce(
//     (sum, count) => sum + count,
//     0
//   );

//   // Manejador para evitar llamadas innecesarias a onChange
//   const handleClick = (category) => {
//     const valueToSend = category === null ? "todos" : category;
//     if (valueToSend === selectedCategory || (category === null && !selectedCategory)) {
//       // No hacer nada si el filtro ya está seleccionado
//       return;
//     }
//     onChange(valueToSend);
//   };

//   return (
//     <Box mb={4}>
//       <Typography
//         variant="h6"
//         sx={{ mb: 1, fontWeight: "bold", color: colors.accentGreen[100] }}
//       >
//         Filtrar por categorías:
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
//                 color={!selectedCategory ? "primary" : "default"}
//                 onClick={() => handleClick(null)}
//                 clickable={total > 0}
//                 disabled={total === 0}
//               />
//             </div>
//           </Grow>

//           {Object.entries(categoryCounts).map(([category, count]) => (
//             <Grow in timeout={300} key={category}>
//               <div>
//                 <Chip
//                   sx={{ my: 0.5 }}
//                   icon={<WidgetsIcon />}
//                   label={`${category} (${count})`}
//                   color={selectedCategory === category ? "primary" : "default"}
//                   onClick={() => handleClick(category)}
//                   clickable
//                 />
//               </div>
//             </Grow>
//           ))}
//         </Stack>
//       )}
//     </Box>
//   );
// }

// export default CategoryFilter;
// src/components/filters/CategoriaFilter.jsx
import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CategoryFilter = ({ value, onChange, opciones }) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="category-filter-label">Categoría</InputLabel>
      <Select
        labelId="category-filter-label"
        id="category-filter"
        value={value}
        label="Categoría"
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {opciones.map((cat, idx) => (
          <MenuItem key={idx} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryFilter;






