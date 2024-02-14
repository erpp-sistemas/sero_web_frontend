import { Box, Button } from '@mui/material'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import React from 'react'
import { useEffect } from 'react';
import { getAllPlaceAndServiceAndProcess } from '../../../../api/place';
import { AddOutlined } from '@mui/icons-material';

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
              Agregar Nuevo Proceso
            </Button> 
          </GridToolbarContainer>
        );
      }

      


    const fetchPlaceAndServiceAndProcess = async () => {
        try {
          // Aquí deberías hacer tu solicitud de red para obtener los datos
          // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
          const response = await getAllPlaceAndServiceAndProcess();
    
          // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
          const rowsWithId = response.map((row, index) => ({
            ...row,
            id: row.id_proceso,
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
            field: "id_plaza",
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>
                {"Plaza"}
                {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
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
                {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
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
                {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
              </strong>
            ),
            width: 130,
            editable: true,
          },
        
        
      
        
         
      
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