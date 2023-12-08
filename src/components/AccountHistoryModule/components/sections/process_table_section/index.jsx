import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import React from "react";
import { useStoreZustand } from "../../../../../zustan_store/useStoreZustand";
import { Avatar, Box } from "@mui/material";
import Viewer from "react-viewer";
import useCombinedSlices from "../../../../../hooks/useCombinedSlices";

function ProcessTableSection() {
  const { actions } = useCombinedSlices();
  console.log(actions);
  /* // ✅ Valid
const CountButton = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Button onClick={() => setCount((prev) => prev + 1)}>{count} click(s)</Button>
  );
};

const column = {
  // ...other properties,
  renderCell: () => <CountButton />,
}; */
  const AvatarImage = ({ image }) => {
    console.log(image);

    const [visibleAvatar, setVisibleAvatar] = React.useState(false);
    /*  */

    if (image) {
      return (
        <>
          <Avatar
            onClick={() => {
              setVisibleAvatar(true);
            }}
            alt="avatar"
            src={image}
          />
          <Viewer
            visible={visibleAvatar}
            onClose={() => {
              setVisibleAvatar(false);
            }}
            images={[{ src: image, alt: "avatar" }]}
          />
        </>
      );
    } else {
      return "";
    }
  };

  const columns = [];
  actions?.forEach((actionObject, index) => {
    console.log(actionObject);
    actionObject = { ...actionObject, avatar: "avatar" };
    if (index === 0) {
      for (const key in actionObject) {
        switch (key) {
          case "taskDone":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong style={{color:"#5EBFFF"}}>
                  {"Tarea Gestionada "}
               {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
                </strong>
              ),
              width: 150,
              editable: true,
            });

            break;

          case "dateCapture":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong  style={{color:"#5EBFFF"}}>
                  {"Fecha de Captura "}
             {/*      <span role="img" aria-label="fecha" style={{color:"#5EBFFF"}}>
                    📆
                  </span> */}
                </strong>
              ),
              width: 150,
              editable: true,
              type: "dateTime",
              valueGetter: ({ value }) => {
                if (value) {
                  return new Date(value);
                } else {
                  return "";
                }
              },
            });
            break;

          case "personWhoCapture":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong style={{color:"#5EBFFF"}}>
                  {"Gestor "}
                  <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
                    🧑
                  </span>
                </strong>
              ),
              width: 300,
              editable: true,
            });
            break;
          case "avatar":
            columns.push({
              field: key,
              renderHeader: () => (
                <strong style={{color:"#5EBFFF"}}>
                  {"Imagen "}
                  <span role="img" aria-label="img" style={{color:"#5EBFFF"}}>
                  
                  </span>
                </strong>
              ),

              renderCell: (params) => (
                <AvatarImage image={params.row.photoPersonWhoCapture} />
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

  actions?.forEach((debtObject, index) => {
    debtObject = { ...debtObject, id: index + 1 };
    rows.push(debtObject);
  });



  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="secondary" />
        <GridToolbarFilterButton color="secondary"/>
        <GridToolbarDensitySelector color="secondary"/>
        <GridToolbarExport color="secondary"/>
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
        "& .firstLetter": {
          color: "#0066cc",
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
      slots={{ toolbar: CustomToolbar }}
      localeText={{
        toolbarColumns: "Columnas",
        toolbarFilters: "Filtros",
        toolbarDensity: "Tamaño Celda",
        toolbarExport: "Exportar"
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
        pageSizeOptions={[5]}
        disableMultipleRowSelection={true}
        checkboxSelection
        disableRowSelectionOnClick
        getCellClassName={(params) => {
          switch (params.value) {
            case "1ra Carta Invitación":
              return "firstLetter";

            case "2da Carta Invitación":
              return "secondLetter";

            case "3ra Carta Invitación":
              return "thirdLetter";
            case "4ta Carta Invitación":
              return "fourthLetter";

            default:
              break;
          }
        }}
      />
    </Box>
  );
}

export default ProcessTableSection;
