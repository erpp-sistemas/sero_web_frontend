import {
  AssignmentInd,
  ChecklistRtl,
  CloudDownload,
  ImageNotSupported,
  Newspaper,
  WhereToVote,
  WrongLocation,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { ButtonGroup, IconButton, Tooltip, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { managementByRangeDateAndIndicatorTypeRequest } from "../../api/management.js";
import LoadingModal from "../../components/LoadingModal.jsx";
import * as ExcelJS from "exceljs";

function StatCards({
  data,
  placeId,
  serviceId,
  proccessId,
  startDate,
  finishDate,
}) {

  console.log(data)

  if (!data) {
    return null;
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [countRecords, setCountRecords] = useState(0);
  const [countLocated, setCountLocated] = useState(0);
  const [countNotLocated, setCountNotLocated] = useState(0);
  const [countManagers, setCountManagers] = useState(0);
  const [countNotPhoto, setCountNotPhoto] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      setCountRecords(data[0].count_records);
      setCountLocated(data[0].count_located);
      setCountNotLocated(data[0].count_not_located);
      setCountManagers(data[0].count_managers);
      setCountNotPhoto(data[0].count_not_photo);
    }
  }, [data]);

  const handleGetManagements = async (value) => {
    try {
      setIsLoading(true);
      let value_name = "";

      const response = await managementByRangeDateAndIndicatorTypeRequest(
        placeId,
        serviceId,
        proccessId,
        startDate,
        finishDate,
        value
      );

      if (value === "management") {
        value_name = "gestiones";
      } else if (value === "managers") {
        value_name = "gestores";
      } else if (value === "located_properties") {
        value_name = "predios_localizados";
      } else if (value === "unlocated_properties") {
        value_name = "predios_no_localizados";
      } else if (value === "procedures_without_photo") {
        value_name = "gestiones_sin_foto";
      }
      handleExportToExcelFull(response.data, value_name);
      setIsLoading(false);
    } catch (error) {
      if (error.response.status === 400) {
        setIsLoading(false);
      }

      setIsLoading(false);
    }
  };

  const handleExportToExcelFull = async (result, name) => {
    try {
      setIsLoading(true);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");

      const headers = Object.keys(result[0]);
      worksheet.addRow(headers);

      result.forEach((row) => {
        const values = headers.map((header) => row[header]);
        worksheet.addRow(values);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name + ".xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  return (
    <div class="bg-[#8080801A] px-6 py-8 font-[sans-serif]">
      <LoadingModal open={isLoading} />
      <div class="grid lg:grid-cols-5 sm:grid-cols-2 gap-x-6 gap-y-10 max-w-7xl mx-auto">
        <div class="flex items-center gap-6">
          <Newspaper
            sx={{
              fontSize: "4rem",
              color: colors.accentGreen[100],
            }}
          />
          <div>
            <h3 class="text-white text-3xl font-bold">
              {countRecords.toLocaleString()}
            </h3>
            <p class="text-base text-gray-300 mt-2">Gestiones</p>
            <div class="flex gap-3">
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Tooltip title="Descargar" arrow>
                  <IconButton
                    onClick={() => handleGetManagements("management")}
                  >
                    <CloudDownload sx={{ color: colors.accentGreen[100] }} />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <AssignmentInd
            sx={{
              fontSize: "4rem",
              color: colors.accentGreen[100],
            }}
          />
          <div>
            <h3 class="text-white text-3xl font-bold">{countManagers}</h3>
            <p class="text-base text-gray-300 mt-2">Gestores</p>
            <div class="flex gap-3">
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Tooltip title="Descargar" arrow>
                  <IconButton onClick={() => handleGetManagements("managers")}>
                    <CloudDownload sx={{ color: colors.accentGreen[100] }} />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <WhereToVote
            sx={{
              fontSize: "4rem",
              color: colors.accentGreen[100],
            }}
          />
          <div>
            <h3 class="text-white text-3xl font-bold">
              {countLocated.toLocaleString()}
            </h3>
            <p class="text-base text-gray-300 mt-2">Predios Localizados</p>
            <div class="flex gap-3">
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Tooltip title="Descargar" arrow>
                  <IconButton
                    onClick={() => handleGetManagements("located_properties")}
                  >
                    <CloudDownload sx={{ color: colors.accentGreen[100] }} />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <WrongLocation
            sx={{
              fontSize: "4rem",
              color: countNotLocated === 0 ? colors.accentGreen[100] : colors.redAccent[500],
            }}
          />
          <div>
            <h3 class="text-white text-3xl font-bold">{countNotLocated}</h3>
            <p class="text-sm text-gray-300 mt-2">Predios no localizados</p>
            <div class="flex gap-3">
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Tooltip title="Descargar" arrow>
                  <IconButton
                    onClick={() => handleGetManagements("unlocated_properties")}
                  >
                    <CloudDownload sx={{ color: colors.accentGreen[100] }} />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <ImageNotSupported
            sx={{
              fontSize: "4rem",
              color: countNotPhoto === 0 ? colors.accentGreen[100] : colors.redAccent[500],
            }}
          />
          <div>
            <h3 class="text-white text-3xl font-bold">{countNotPhoto}</h3>
            <p class="text-sm text-gray-300 mt-2">Gestiones sin foto</p>
            <div class="flex gap-3">
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Tooltip title="Descargar" arrow>
                  <IconButton
                    onClick={() =>
                      handleGetManagements("procedures_without_photo")
                    }
                  >
                    <CloudDownload sx={{ color: colors.accentGreen[100] }} />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCards;
