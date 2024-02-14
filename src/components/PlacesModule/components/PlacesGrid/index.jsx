import { Avatar, Box, Button, IconButton } from '@mui/material'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import React from 'react'
import { getAllPlaceAndServiceAndProcess, getAllPlaces } from '../../../../api/place';
import { AddOutlined } from '@mui/icons-material';
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
const CheckCell = ({ data }) => {
  if (data) {
    return (
      <IconButton aria-label="check" size="small">
        <CheckIcon fontSize="inherit" color="secondary" />
      </IconButton>
    );
  } else {
    return (
      <IconButton aria-label="check" size="small">
        <ClearIcon fontSize="inherit" sx={{ color: "red" }} />
      </IconButton>
    );
  }
};

const AvatarImage = ({ data, handleClickOpen, getDataRow }) => {
  return (
    <Avatar
     /*  onClick={() => {
        console.log(data);
        handleOpenImageDialog();
        setGetRowData(getDataRow);
      }} */
      alt="Remy Sharp"
      src={data}
    />
  );
};

function PlacesGrid({setComponentesVisibility}) {

    const [placesAndServiceAndProcess,setPlacesAndServiceAndProcess] = React.useState([])
    



    function CustomToolbar() {
        /*   console.log(handleOpenDialog); */
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton color="secondary" />
            <GridToolbarFilterButton color="secondary" />
            <GridToolbarDensitySelector color="secondary" />
    
            <GridToolbarExport color="secondary" />
            {/*  <Button
              color="secondary"
              startIcon={<FaTasks />}
              onClick={handleOpenDialog}
            >
              Agregar Nueva Tarea
            </Button> */}
            <Button
              color="secondary"
             onClick={()=>{
              setComponentesVisibility({
                form: true,
                placesGrid: false,
              });
             }} 
              startIcon={<AddOutlined />}
              size="small"
            >
              Agregar Nueva Plaza 
            </Button> 
          </GridToolbarContainer>
        );
      }

      


    const fetchPlaceAndServiceAndProcess = async () => {
        try {
          // Aquí deberías hacer tu solicitud de red para obtener los datos
          // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
         /*  const response = await getAllPlaceAndServiceAndProcess(); */
         const response = await getAllPlaces();
    
          // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
          const rowsWithId = response.map((row, index) => ({
            ...row,
            id: row.id_plaza,
          }));
    
          setPlacesAndServiceAndProcess(rowsWithId);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };


    React.useEffect(() => {
      fetchPlaceAndServiceAndProcess()
    }, [])



    


    const buildColumns = () => {
        const columns = [
          {
            field: "nombre",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Nombre"}
             
              </strong>
            ),
            width: 130,
            editable: true,
          },
          {
            field: "imagen",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Imagen"}
             
              </strong>
            ),
            width: 130,
            editable: true,
            renderCell: (params) => (
              <AvatarImage
                /*  handleClickOpen={handleClickOpen}*/
              /*   getDataRow={params.row} */
                data={params.row.imagen}
              />
            ),
          },
          {
            field: "activo",
            type: "boolean",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Estado"}
                {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
              </strong>
            ),
            width: 80,
            editable: true,
            renderCell: (params) => <CheckCell data={params.row.activo} />,
          },
         /*  {
            field: "orden",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Orden"}
             
              </strong>
            ),
            width: 130,
            editable: true,
          }, */
          {
            field: "latitud",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Latitud"}
             
              </strong>
            ),
            width: 130,
            editable: true,
          },
          {
            field: "longitud",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Longitud"}
             
              </strong>
            ),
            width: 130,
            editable: true,
          },
          {
            field: "estado_republica",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Estado de la Republica"}
             
              </strong>
            ),
            width: 130,
            editable: true,
          },
          {
            field: "radius",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Radio"}
             
              </strong>
            ),
            width: 130,
            editable: true,
          },
         /*  {
            field: "id_plaza",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Plaza"}
             
              </strong>
            ),
            width: 130,
            editable: true,
          },
          {
            field: "id_servicio",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Servicio"}
             
              </strong>
            ),
            width: 130,
            editable: true,
          },
        
          {
            field: "id_proceso",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Proceso"}
       
              </strong>
            ),
            width: 130,
            editable: true,
          },
         */
        
      
        
         
      
        /*   {
            field: "actions",
            type: "actions",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Acciones"}
            
              </strong>
            ),
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
              return [
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={() => handleDeleteClick(id)}
                  color="inherit"
                />,
              ];
            },
          }, */
    
          /*  {
                  field: "fecha_ingreso",
                  type: "dateTime",
                  renderHeader: () => (
                    <strong style={{ color: "#5EBFFF" }}>
                      {"Fecha de Ingreso"}
                      
                    </strong>
                  ),
                  valueGetter: ({ value }) => {
                    return value && new Date(value);
                  },
                  width: 180,
                  editable: true,
                }, */
        ];
    
        return columns;
      };


  return (
    <Box sx={{ height: 400, width: "100%",'.css-196n7va-MuiSvgIcon-root': {
        fill:"white"
      }  }}>
       <DataGrid
        rows={placesAndServiceAndProcess}
        columns={buildColumns()} 

        localeText={{
            toolbarColumns: "Columnas",
            toolbarFilters: "Filtros",
            toolbarDensity: "Tamaño Celda",
            toolbarExport: "Exportar",
          }}
          slots={{ toolbar: CustomToolbar }}
    /*     localeText={{
          toolbarColumns: "Columnas",
          toolbarFilters: "Filtros",
          toolbarDensity: "Tamaño Celda",
          toolbarExport: "Exportar",
        }}
        slots={{ toolbar: CustomToolbar }}
        processRowUpdate={processRowUpdate}  */
      /> 

      </Box>
  )
}

export default PlacesGrid