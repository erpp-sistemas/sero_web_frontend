// src/components/Inventory/InventorySkeleton.jsx
import React from "react";
import { Box, Skeleton, Card, Grid } from "@mui/material";

const InventorySkeleton = () => {
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Skeletons para filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Skeleton variant="rectangular" width={280} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 2 }} />
      </Box>

      {/* Skeleton para KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Grid item xs={12} sm={6} md={2.4} key={i}>
            <Card sx={{ p: 2, borderRadius: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Skeleton para gráficos (categorías y subcategorías) */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Skeleton variant="text" width="30%" height={16} />
                  <Skeleton variant="text" width="15%" height={16} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 3 }} />
              </Box>
            ))}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Skeleton variant="text" width="30%" height={16} />
                  <Skeleton variant="text" width="15%" height={16} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 3 }} />
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>

      {/* Skeleton para tabs */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        ))}
      </Box>

      {/* Skeleton para tabla */}
      <Card sx={{ p: 2, borderRadius: 3 }}>
        <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={48} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Card>
    </Box>
  );
};

export default InventorySkeleton;