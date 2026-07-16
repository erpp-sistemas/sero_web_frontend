import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

import { Alert, Box, Snackbar, Typography, useTheme } from "@mui/material";

import { tokens } from "../../theme";

import {
  assignmentManagerSummaryRequest,
  assignmentManagerDetailRequest,
  assignmentManagerUnassignRequest,
} from "../../api/assignment";

import WelcomeHeader from "../../components/AssignmentManagement/WelcomeHeader";
import FilterBar from "../../components/AssignmentManagement/FilterBar";
import AssignmentKpiCards from "../../components/AssignmentManagement/AssignmentKpiCards";
import SummaryTable from "../../components/AssignmentManagement/SummaryTable";
import DialogAssignment from "../../components/AssignmentManagement/DialogAssignment";

import DashboardSkeleton from "../../components/PaymentValidation/DashboardSkeleton";

function Index() {
  /*
  |--------------------------------------------------------------------------
  | Theme
  |--------------------------------------------------------------------------
  */

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const user = useSelector((state) => state.user);

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [filters, setFilters] = useState({
    plazaId: null,
    servicioId: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Assignment Manager
  |--------------------------------------------------------------------------
  */

  const [summary, setSummary] = useState([]);

  const [detail, setDetail] = useState([]);

  const [selectedManager, setSelectedManager] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(false);

  const [loadingSummary, setLoadingSummary] = useState(false);

  const [loadingDetail, setLoadingDetail] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  /*
  |--------------------------------------------------------------------------
  | Private Methods
  |--------------------------------------------------------------------------
  */

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const loadSummary = useCallback(async ({ plazaId, servicioId }) => {
    try {
      setLoadingSummary(true);

      const response = await assignmentManagerSummaryRequest(
        plazaId,
        servicioId,
      );

      setSummary(response.data ?? []);
    } catch (error) {
      setSummary([]);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message ??
          "Ocurrió un error al obtener las asignaciones.",
      });
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const loadDetail = useCallback(
    async (userId) => {
      try {
        setLoadingDetail(true);

        const response = await assignmentManagerDetailRequest(
          filters.plazaId,
          filters.servicioId,
          userId,
        );

        setDetail(response.data || []);

        setDialogOpen(true);
      } catch (error) {
        showSnackbar(
          error?.response?.data?.message ||
            "Ocurrió un error al obtener el detalle.",
          "error",
        );
      } finally {
        setLoadingDetail(false);
      }
    },
    [filters, showSnackbar],
  );

  /*
  |--------------------------------------------------------------------------
  | Events
  |--------------------------------------------------------------------------
  */

  const handleFilterChange = useCallback(
    async (values) => {
      setFilters(values);

      await loadSummary(values);
    },
    [loadSummary],
  );

  const handleManagerSelected = useCallback(
    async (manager) => {
      setSelectedManager(manager);

      await loadDetail(manager.id_usuario);
    },
    [loadDetail],
  );

  const handleUnassign = useCallback(
    async (accounts) => {
      try {
        setLoading(true);

        await assignmentManagerUnassignRequest(
          filters.plazaId,
          filters.servicioId,
          user.user_id,
          accounts,
        );

        setDialogOpen(false);

        showSnackbar(
          "Las cuentas fueron desasignadas correctamente.",
          "success",
        );

        await loadSummary(filters);
      } catch (error) {
        showSnackbar(
          error?.response?.data?.message ||
            "Ocurrió un error al desasignar las cuentas.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, user, loadSummary, showSnackbar],
  );

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Effects
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!dialogOpen) {
      setDetail([]);
      setSelectedManager(null);
    }
  }, [dialogOpen]);

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <Box className="p-4">
      <WelcomeHeader />

      <FilterBar
        plazas={user.place_service_process}
        onChange={handleFilterChange}
        isLoading={loading}
      />

      {loading && <DashboardSkeleton />}

      {!loading && summary.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <AssignmentKpiCards data={summary} />
          <SummaryTable
            data={summary}
            onManagerSelected={handleManagerSelected}
          />
        </Box>
      )}

      <DialogAssignment
        open={dialogOpen}
        manager={selectedManager}
        data={detail}
        loading={loadingDetail}
        processing={loading}
        onClose={() => setDialogOpen(false)}
        onUnassign={handleUnassign}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Index;
