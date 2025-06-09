// components/InventoryList/InventoryFilterBar.jsx
import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Chip } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const InventoryFilterBar = ({
  filterCategory,
  handleCategoryFilter,
  categories,
  subcategories,
  subcategoryFilter,
  handleSubcategoryFilter,
  statusFilter,
  handleStatusFilter,
  searchTerm,
  handleSearch,
  handleSort,
  handleResetFilters,
  handleExportPDF,
  handleExportExcel,
}) => {
  return (
    <Box className="flex flex-wrap gap-2 mb-4">
      {/* Categorías */}
      <Box className="flex gap-1 items-center flex-wrap">
        <Typography className="text-xs font-semibold text-gray-700">Categoría:</Typography>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            color={filterCategory === category ? 'primary' : 'default'}
            onClick={() => handleCategoryFilter(category)}
            className="text-xs"
          />
        ))}
      </Box>

      {/* Subcategorías */}
      <Box className="flex gap-1 items-center flex-wrap">
        <Typography className="text-xs font-semibold text-gray-700">Subcategoría:</Typography>
        {subcategories.map((subcategory) => (
          <Chip
            key={subcategory}
            label={subcategory}
            color={subcategoryFilter === subcategory ? 'primary' : 'default'}
            onClick={() => handleSubcategoryFilter(subcategory)}
            className="text-xs"
          />
        ))}
      </Box>

      {/* Estado */}
      <Box className="flex gap-1 items-center flex-wrap">
        <Typography className="text-xs font-semibold text-gray-700">Estado:</Typography>
        {['Operativo', 'No operativo', 'Baja'].map((status) => (
          <Chip
            key={status}
            label={status}
            color={statusFilter === status ? 'primary' : 'default'}
            onClick={() => handleStatusFilter(status)}
            className="text-xs"
          />
        ))}
      </Box>

      {/* Buscador */}
      <TextField
        label="Buscar"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full sm:w-64"
      />

      {/* Controles */}
      <Box className="flex gap-2">
        <Button variant="outlined" size="small" onClick={handleSort}>Ordenar A-Z</Button>
        <Button variant="outlined" size="small" onClick={handleResetFilters}>Limpiar filtros</Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CloudDownloadIcon />}
          onClick={handleExportPDF}
        >
          PDF
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CloudDownloadIcon />}
          onClick={handleExportExcel}
        >
          Excel
        </Button>
      </Box>
    </Box>
  );
};

export default InventoryFilterBar;
