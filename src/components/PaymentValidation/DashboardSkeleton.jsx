// src/components/Common/DashboardSkeleton.jsx
import { Box, Skeleton, Grid, Card } from "@mui/material";

const DashboardSkeleton = () => (
  <Box sx={{ mt: 4 }}>
    {/* Skeleton para KPI Cards */}
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1, borderRadius: 2 }} />
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Skeleton para Tabla */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} variant="rectangular" width="100%" height={40} sx={{ mb: 1, borderRadius: 1 }} />
      ))}
    </Box>

    {/* Skeleton para Gráficos */}
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, borderRadius: 3 }}>
          <Skeleton variant="text" width="40%" height={28} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, borderRadius: 3 }}>
          <Skeleton variant="text" width="40%" height={28} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default DashboardSkeleton;