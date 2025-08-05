// import React, { useMemo } from "react";
// import { Avatar, Chip, Grow, Skeleton, Stack, Typography } from "@mui/material";

// function UserFilter({
//   inventory,
//   filters,
//   selectedUser,
//   onChange,
//   loading,
//   primaryFilter,
// }) {
//   const isThisPrimary = primaryFilter === "usuario";

//   // Filtrar inventario considerando jerarquía, excepto usuario si no es filtro principal
//   const filteredInventory = useMemo(() => {
//     return inventory.filter((item) => {
//       return (
//         (!filters.plaza || isThisPrimary || item.plaza === filters.plaza) &&
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

//   // Contar usuarios con imagen
//   const userCounts = useMemo(() => {
//     const counts = {};
//     filteredInventory.forEach((item) => {
//       const usuario = item.usuario || "Desconocido";
//       if (!counts[usuario]) {
//         counts[usuario] = {
//           count: 0,
//           imagen: item.imagen_usuario || null,
//         };
//       }
//       counts[usuario].count += 1;
//     });
//     return counts;
//   }, [filteredInventory]);

//   const total = Object.values(userCounts).reduce((sum, u) => sum + u.count, 0);

//   // Evitar onChange innecesario
//   const handleClick = (usuario) => {
//     if ((usuario === null && !selectedUser) || usuario === selectedUser) {
//       return;
//     }
//     onChange(usuario === null ? "todos" : usuario);
//   };

//   return (
//     <div className="mb-4">
//       <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
//         Usuarios:
//       </Typography>

//       {loading ? (
//         <Stack direction="row" spacing={1} flexWrap="wrap">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Skeleton
//               key={i}
//               variant="rounded"
//               width={150}
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
//                 color={!selectedUser ? "primary" : "default"}
//                 onClick={() => handleClick(null)}
//                 clickable
//               />
//             </div>
//           </Grow>

//           {Object.entries(userCounts).map(([usuario, { count, imagen }]) => (
//             <Grow in timeout={300} key={usuario}>
//               <div>
//                 <Chip
//                   sx={{ my: 0.5 }}
//                   avatar={
//                     <Avatar
//                       src={imagen}
//                       alt={usuario}
//                       sx={{ width: 24, height: 24 }}
//                     />
//                   }
//                   label={`${usuario} (${count})`}
//                   color={selectedUser === usuario ? "primary" : "default"}
//                   onClick={() => handleClick(usuario)}
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

// export default UserFilter;
import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const UserFilter = ({ value, onChange, opciones }) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="user-filter-label">Usuario</InputLabel>
      <Select
        labelId="user-filter-label"
        id="user-filter"
        value={value}
        label="Usuario"
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {opciones.map((user, idx) => (
          <MenuItem key={idx} value={user}>
            {user}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UserFilter;



