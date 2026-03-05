// src/components/Inventory/InventoryFilters.jsx
import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  useTheme,
  Grow,
  Typography,
} from "@mui/material";
import { tokens } from "../../theme";
import {
  Search,
  Clear,
  KeyboardArrowDownOutlined,
} from "@mui/icons-material";

const InventoryFilters = ({ 
  filters, 
  onFilterChange, 
  onReset, 
  categorias, 
  plazas,
  totalItems,
  filteredCount,
  loading 
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const hasActiveFilters = filters.busqueda !== "" || 
                           filters.categoria !== "todos" || 
                           filters.plaza !== "todos";

  return (
    <Grow in={true} timeout={400}>
      <Paper
        sx={{
          p: 2,
          mb: 3,
          bgcolor: colors.bgContainer,
          borderRadius: "12px",
          border: `1px solid ${colors.primary[500]}`,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          {/* Búsqueda */}
          <TextField
            size="small"
            placeholder="Buscar por nombre, folio o serie..."
            value={filters.busqueda}
            onChange={(e) => onFilterChange({ ...filters, busqueda: e.target.value })}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: colors.grey[400] }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 2,
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: "0.875rem",
                backgroundColor: colors.bgContainer,
              },
            }}
          />

          {/* Filtro por categoría - DINÁMICO */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: colors.grey[400] }}>Categoría</InputLabel>
            <Select
              value={filters.categoria}
              label="Categoría"
              onChange={(e) => onFilterChange({ ...filters, categoria: e.target.value })}
              disabled={loading}
              sx={{ borderRadius: "8px" }}
              IconComponent={(props) => (
                <KeyboardArrowDownOutlined {...props} sx={{ color: colors.grey[300] }} />
              )}
            >
              <MenuItem value="todos">Todas</MenuItem>
              {categorias.filter(c => c !== "todos").map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtro por plaza - DINÁMICO */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: colors.grey[400] }}>Plaza</InputLabel>
            <Select
              value={filters.plaza}
              label="Plaza"
              onChange={(e) => onFilterChange({ ...filters, plaza: e.target.value })}
              disabled={loading}
              sx={{ borderRadius: "8px" }}
              IconComponent={(props) => (
                <KeyboardArrowDownOutlined {...props} sx={{ color: colors.grey[300] }} />
              )}
            >
              <MenuItem value="todos">Todas</MenuItem>
              {plazas.filter(p => p !== "todos").map(plaza => (
                <MenuItem key={plaza} value={plaza}>{plaza}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Botón limpiar */}
          <Button
            startIcon={<Clear />}
            onClick={onReset}
            disabled={loading || !hasActiveFilters}
            sx={{
              color: colors.grey[400],
              textTransform: "none",
              "&:hover": { bgcolor: colors.primary[400] + "20" },
            }}
          >
            Limpiar
          </Button>
        </Box>

        {/* Contador de resultados */}
        <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="caption" sx={{ color: colors.grey[500] }}>
            {totalItems} artículos totales
            {hasActiveFilters && ` • ${filteredCount} resultados`}
          </Typography>
        </Box>
      </Paper>
    </Grow>
  );
};

export default InventoryFilters;