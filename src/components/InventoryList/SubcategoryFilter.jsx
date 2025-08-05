// import React, { useMemo } from "react";
// import { Chip, Stack, Typography, Skeleton, Grow } from "@mui/material";
// import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";

// function SubcategoryFilter({
//   inventory,
//   selectedCategory,
//   selectedSubcategory,
//   filters,
//   onChange,
//   loading,
//   primaryFilter,
// }) {
//   const isThisPrimary = primaryFilter === "subcategoria";

//   // Filtrado jerárquico, igual que en CategoryFilter
//   const filteredInventory = useMemo(() => {
//     return inventory.filter((item) => {
//       return (
//         (!filters.plaza || isThisPrimary || item.plaza === filters.plaza) &&
//         (!filters.usuario || isThisPrimary || item.usuario === filters.usuario) &&
//         (!filters.categoria || isThisPrimary || item.categoria === filters.categoria) &&
//         (
//           !filters.estatus ||
//           isThisPrimary ||
//           (filters.estatus === "activo" && item.activo === true) ||
//           (filters.estatus === "inactivo" && item.activo === false)
//         )
//       );
//     });
//   }, [inventory, filters, primaryFilter]);

//   // Contar subcategorías, filtrando además por categoría seleccionada si hay
//   const subcategoryCounts = useMemo(() => {
//     const counts = {};
//     filteredInventory.forEach((item) => {
//       if (selectedCategory && item.categoria !== selectedCategory) return;
//       const subcategory = item.subcategoria || "Sin subcategoría";
//       counts[subcategory] = (counts[subcategory] || 0) + 1;
//     });
//     return counts;
//   }, [filteredInventory, selectedCategory]);

//   const total = Object.values(subcategoryCounts).reduce((sum, count) => sum + count, 0);

//   // Evitar onChange innecesario
//   const handleClick = (subcategory) => {
//     if (
//       (subcategory === null && !selectedSubcategory) ||
//       subcategory === selectedSubcategory
//     ) {
//       return;
//     }
//     onChange(subcategory === null ? "todos" : subcategory);
//   };

//   return (
//     <div className="mb-4">
//       <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
//         Subcategorías:
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
//                 color={!selectedSubcategory ? "primary" : "default"}
//                 onClick={() => handleClick(null)}
//                 clickable={total > 0}
//                 disabled={total === 0}
//               />
//             </div>
//           </Grow>

//           {Object.entries(subcategoryCounts).map(([subcategory, count]) => (
//             <Grow in timeout={300} key={subcategory}>
//               <div>
//                 <Chip
//                   sx={{ my: 0.5 }}
//                   icon={<LabelOutlinedIcon />}
//                   label={`${subcategory} (${count})`}
//                   color={selectedSubcategory === subcategory ? "primary" : "default"}
//                   onClick={() => handleClick(subcategory)}
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

// export default SubcategoryFilter;
// src/components/filters/SubcategoriaFilter.jsx
import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SubcategoryFilter = ({ value, onChange, opciones }) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="subcategory-filter-label">Subcategoría</InputLabel>
      <Select
        labelId="subcategory-filter-label"
        id="subcategory-filter"
        value={value}
        label="Subcategoría"
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {opciones.map((subcat, idx) => (
          <MenuItem key={idx} value={subcat}>
            {subcat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SubcategoryFilter;



