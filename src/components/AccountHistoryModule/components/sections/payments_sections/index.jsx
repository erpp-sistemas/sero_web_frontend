import React from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import functionsCustom from "../../../../../helpers";
import useCombinedSlices from "../../../../../hooks/useCombinedSlices";

function PaymentsSections() {
  const { payments } = useCombinedSlices();
  /* console.log(payments); */
  const Chips = ({ params }) => {
    return (
      <Box>
        <Chip label={params} color="secondary" size="small" />
      </Box>
    );
  };

  const columns = [];
  payments?.forEach((debtObject, index) => {
    if (index === 0) {
      for (const key in debtObject) {
        switch (key) {
          case "referencia":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>
                  {"Referencia "}
                  {/*    <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
                    🧑
                  </span> */}
                </strong>
              ),
              width: 100,
              editable: true,
            });

            break;
          case "descripcion":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>
                  {"Descripciòn"}
                  {/*  <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
                    {""}
                  </span> */}
                </strong>
              ),
              width: 300,
              editable: true,
              valueGetter: ({ value }) => {
                switch (value) {
                  case "DERECHOS DE AGUA POTABLE REZAGO":
                    return `💦 ${value}`;

                    break;

                  default:
                    return value;
                    break;
                }
              },
            });
            break;
          case "payment_period":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>
                  {"Periodo de Pago "}
                  {/*    <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
                    🧑
                  </span> */}
                </strong>
              ),
              width: 150,
              editable: true,
              type: "dateTime",
              valueGetter: ({ value }) => {
                return new Date(value);
              },
            });
            break;
          case "fechaDePago":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>
                  {"Fecha de Pago"}
                  {/*  <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
                    🧑
                  </span> */}
                </strong>
              ),
              width: 150,
              editable: true,
              type: "dateTime",
              valueGetter: ({ value }) => {
                return new Date(value);
              },
            });
            break;
          case "montoPagado":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>
                  {"Pago "}
                  {/*    <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
                    🧑
                  </span> */}
                </strong>
              ),
              width: 150,
              editable: true,
              type: "string",
              valueGetter: ({ value }) => {
                return value
                  ? `$ ${functionsCustom.formatNumberWithCommas(value)}`
                  : `$ 00.00`;
              },
            });
            break;
          case "paymentPeriod":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>
                  {"Periodo de pago "}
                  {/*    <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
                      🧑
                    </span> */}
                </strong>
              ),
              width: 150,
              renderCell: (params) => (
                <Chips params={params.row.paymentPeriod} />
              ),
            });
            break;

          default:
            break;
        }
      }
    }
  });

  const rows = [];
  payments?.forEach((debtObject, index) => {
    // Verificar si todas las propiedades del objeto son undefined
    const allUndefined = Object.values(debtObject).every(
      (value) => value === undefined
    );

    if (debtObject && !allUndefined) {
      console.log(debtObject);
      debtObject = { ...debtObject, id: index + 1 };
      rows.push(debtObject);
    }
  });

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="secondary" />
        <GridToolbarFilterButton color="secondary" />
        <GridToolbarDensitySelector color="secondary" />
        <GridToolbarExport color="secondary" />
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      sx={{
        height: 300,
        width: "100%",
        "& .cold": {
          color: "red",
        },
        "& .payment": {
          color: "#17E85D",
        },
        "& .secondLetter": {
          color: "#ff9900",
        },
        "& .thirdLetter": {
          color: "#33cc33",
        },
        "& .fourthLetter": {
          color: "#ff0000",
        },
      }}
    >
      <DataGrid
        slots={{ toolbar: CustomToolbar}}
       
        localeText={{
          toolbarColumns: "Columnas",
          toolbarFilters: "Filtros",
          toolbarDensity: "Tamaño Celda",
          toolbarExport: "Exportar",
        }}
        rows={rows.filter((row) => row !== undefined)}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5,10,30,50]}
        checkboxSelection
        disableRowSelectionOnClick
        getCellClassName={(params) => {
          if (
            params.value &&
            typeof params.value === "string" &&
            params.value.includes("$")
          ) {
            return "payment";
          }
        }}
      />
    </Box>
  );
}

export default PaymentsSections;
