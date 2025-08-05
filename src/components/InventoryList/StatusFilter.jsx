import React, { useMemo } from "react";
import { Chip, Stack, Typography, Skeleton, Grow } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

function StatusFilter({ inventory, selectedStatus, filters, onChange, loading, primaryFilter }) {
  const isThisPrimary = primaryFilter === "estatus";

  // Filtrar inventario según jerarquía y si es filtro principal
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      return (
        (!filters.plaza || isThisPrimary || item.plaza === filters.plaza) &&
        (!filters.usuario || isThisPrimary || item.usuario === filters.usuario) &&
        (!filters.categoria || isThisPrimary || item.categoria === filters.categoria) &&
        (!filters.subcategoria || isThisPrimary || item.subcategoria === filters.subcategoria)
      );
    });
  }, [inventory, filters, primaryFilter]);

  // Contar activos e inactivos en el inventario filtrado según jerarquía
  const statusCounts = useMemo(() => {
    const counts = { activo: 0, inactivo: 0 };
    filteredInventory.forEach((item) => {
      if (item.activo) counts.activo++;
      else counts.inactivo++;
    });
    return counts;
  }, [filteredInventory]);

  const total = statusCounts.activo + statusCounts.inactivo;

  return (
    <div className="mb-4">
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Estatus:
      </Typography>

      {loading ? (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={120}
              height={32}
              sx={{ borderRadius: "16px" }}
            />
          ))}
        </Stack>
      ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Grow in timeout={300}>
            <div>
              <Chip
                label={`Todos (${total})`}
                color={!selectedStatus ? "primary" : "default"}
                onClick={() => onChange("todos")}
                clickable={total > 0}
                disabled={total === 0}
                sx={{ my: 0.5 }}
              />
            </div>
          </Grow>

          <Grow in timeout={300}>
            <div>
              <Chip
                icon={<CheckCircleOutlineIcon />}
                label={`Activo (${statusCounts.activo})`}
                color={selectedStatus === "activo" ? "primary" : "default"}
                onClick={() => onChange("activo")}
                clickable={statusCounts.activo > 0}
                disabled={statusCounts.activo === 0}
                sx={{ my: 0.5 }}
              />
            </div>
          </Grow>

          <Grow in timeout={300}>
            <div>
              <Chip
                icon={<HighlightOffIcon />}
                label={`Inactivo (${statusCounts.inactivo})`}
                color={selectedStatus === "inactivo" ? "primary" : "default"}
                onClick={() => onChange("inactivo")}
                clickable={statusCounts.inactivo > 0}
                disabled={statusCounts.inactivo === 0}
                sx={{ my: 0.5 }}
              />
            </div>
          </Grow>
        </Stack>
      )}
    </div>
  );
}

export default StatusFilter;
