// src/components/Inventory/InventoryMinimalSkeleton.jsx
import React from "react";
import { Box, Skeleton, useTheme, alpha } from "@mui/material";
import { tokens } from "../../theme";

const InventorySkeleton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Línea superior muy sutil - solo 3 elementos */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Skeleton 
          variant="text" 
          width={120} 
          height={24} 
          sx={{ 
            bgcolor: alpha(colors.primary[400], 0.9),
            borderRadius: "4px"
          }} 
        />
        <Skeleton 
          variant="text" 
          width={80} 
          height={24} 
          sx={{ 
            bgcolor: alpha(colors.primary[400], 0.9),
            borderRadius: "4px"
          }} 
        />
        <Skeleton 
          variant="text" 
          width={100} 
          height={24} 
          sx={{ 
            bgcolor: alpha(colors.primary[400], 0.9),
            borderRadius: "4px"
          }} 
        />
      </Box>

      {/* Grid de 4 cards ultra sutiles */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              p: 2,
              borderRadius: "12px",
              border: `1px solid ${alpha(colors.primary[400], 0.9)}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Skeleton 
                variant="circular" 
                width={32} 
                height={32} 
                sx={{ bgcolor: alpha(colors.primary[400], 0.9) }} 
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  height={20} 
                  sx={{ bgcolor: alpha(colors.primary[400], 0.9) }} 
                />
                <Skeleton 
                  variant="text" 
                  width="40%" 
                  height={14} 
                  sx={{ bgcolor: alpha(colors.primary[400], 0.9) }} 
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Dos cards más grandes */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3 }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              p: 2,
              borderRadius: "12px",
              border: `1px solid ${alpha(colors.primary[400], 0.9)}`,
            }}
          >
            <Skeleton 
              variant="text" 
              width="40%" 
              height={18} 
              sx={{ bgcolor: alpha(colors.primary[400], 0.9), mb: 2 }} 
            />
            {Array.from({ length: 3 }).map((_, j) => (
              <Box key={j} sx={{ mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Skeleton 
                    variant="text" 
                    width="30%" 
                    height={14} 
                    sx={{ bgcolor: alpha(colors.primary[400], 0.9) }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="15%" 
                    height={14} 
                    sx={{ bgcolor: alpha(colors.primary[400], 0.9) }} 
                  />
                </Box>
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={4} 
                  sx={{ bgcolor: alpha(colors.primary[400], 0.9) }} 
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Alerta sutil al final */}
      <Box
        sx={{
          mt: 3,
          p: 1.5,
          borderRadius: "8px",
          border: `1px solid ${alpha(colors.primary[400], 0.9)}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Skeleton 
          variant="circular" 
          width={20} 
          height={20} 
          sx={{ bgcolor: alpha(colors.primary[400], 0.9) }} 
        />
        <Skeleton 
          variant="text" 
          width="40%" 
          height={16} 
          sx={{ bgcolor: alpha(colors.primary[400], 0.9) }} 
        />
      </Box>
    </Box>
  );
};

export default InventorySkeleton;