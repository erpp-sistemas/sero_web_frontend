import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import React from "react";

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

  

  const buildColumns = ()=>{

    const columns = [

    
        {
          field: "task_done",
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>
              {"Tarea"}
              {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                    📃
                    </span> */}
            </strong>
          ),
          width: 300,
          editable: true,
        },
        {
          field: "avatar",
          renderHeader: () => (
            <strong style={{color:"#5EBFFF"}}>
              {"Imagen "}
              <span role="img" aria-label="img" style={{color:"#5EBFFF"}}>
              
              </span>
            </strong>
          ),

          renderCell: (params) => (
            <AvatarImage image={params.row.photo_person_who_capture} />
          ),
        },
        {
          field: "person_who_capture",
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>
              {"Nombre Gestor"}
              {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                    📃
                    </span> */}
            </strong>
          ),
          width: 160,
          editable: true,
        },
        {
          field: "date_capture",
          type:'dateTime',
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>
              {"Fecha de Captura"}
              {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                    📃
                    </span> */}
            </strong>
          ),
          width: 160,
     
          valueGetter: ({ value }) => value && new Date(value),
        },
    
    ];
    return columns


  }
  const buildRows = ()=>{


    const rows = [];
    actions?.forEach((debtObject, index) => {
      debtObject = { ...debtObject, id: index + 1 };
      rows.push(debtObject);
    });

    return rows



  }
 

  





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
        rows={buildRows()}
        columns={buildColumns()}
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
