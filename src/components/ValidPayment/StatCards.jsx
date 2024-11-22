import React from "react";
import { Box, ButtonGroup, IconButton, Tooltip, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import {
  CloudDownload,
  CurrencyExchange,
  DateRange,
  Preview,
  ScreenSearchDesktop,
  VerifiedUser,
} from "@mui/icons-material";

const StatCards = ({
  countResult,
  countUniqueAccount,
  totalAmount,
  paymentDateRange,
  handleExportToExcel,
  handleFilteredRows,
  typeFilter,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div
      class={`px-6 py-8 font-sans ${
        theme.palette.mode === "dark" ? "bg-transparent" : "bg-white"
      }`}
    >
      <div class="grid lg:grid-cols-4 sm:grid-cols-2 gap-x-6 gap-y-10 max-w-7xl mx-auto">
        {/* <div
          class="flex items-center gap-6"
        > */}
        <div
          className={`flex items-center gap-6 ${
            typeFilter === 1 ? "border-2 rounded-lg border-green-300 animate-neon " : ""
          }`}         
        >
          <ScreenSearchDesktop
            sx={{
              fontSize: "6rem",
              color: colors.accentGreen[100],
            }}
          />
          <div>
            <h5 class="text-white text-3xl font-bold">{countResult}</h5>
            <p class="text-base text-gray-300">Registros Encontrados</p>
            {/* Elementos pequeños para la sección */}
            <div class="flex gap-3">
              <ButtonGroup
                variant="outlined"
                color="success"
                aria-label="outlined button group"
              >
                <Tooltip title="Descargar" arrow>
                  <IconButton onClick={() => handleExportToExcel(1)}>
                    <CloudDownload sx={{color: colors.accentGreen[100]}}/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ver Registros" arrow>
                  <IconButton onClick={() => handleFilteredRows(1)}>
                    <Preview  sx={{color: colors.accentGreen[100]}} />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <VerifiedUser sx={{ fontSize: "6rem", color: colors.accentGreen[100] }} />
          <div>
            <h5 class="text-white text-3xl font-bold">{countUniqueAccount}</h5>
            <p class="text-base text-gray-300 mt-2">Cuentas Unicas</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <CurrencyExchange sx={{ fontSize: "6rem", color: colors.accentGreen[100] }} />
          <div>
            <h5 class="text-white text-lg font-bold">$ {totalAmount}</h5>
            <p class="text-base text-gray-300 mt-2">Monto Ingresado</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <DateRange sx={{ fontSize: "6rem", color: colors.accentGreen[100] }} />
          <div>
            <h5 class="text-white text-sm font-bold">{paymentDateRange}</h5>
            <p class="text-sm text-gray-300 mt-2">Rango de fechas de pagos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
