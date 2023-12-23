import React from "react";
import { getAllTasks } from "../../../../api/task";
import { DataGrid, GridActionsCellItem, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { getAllProcesses } from "../../../../api/process";








/**
 * Componente funcional que representa una celda de verificación.
 *
 * @component
 * @example

 * <CheckCell data={true} />
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.data - Valor que determina el estado de la celda.
 * @returns {JSX.Element} - Elemento JSX que representa la celda de verificación.
 */
const CheckCell = ({ data }) => {
  /**
   * Renderiza un icono de verificación si el valor de data es verdadero,
   * o un icono de cruz si el valor de data es falso.
   *
   * @returns {JSX.Element} - Elemento JSX que representa el icono de verificación o cruz.
   */
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

/**
 * Componente que representa una interfaz para la gestión CRUD de tareas en un DataGrid.
 *
 * @component
 * @example

 * <DataGridTaskCrud />
 */
function DataGridTaskCrud() {




  
  /**
   * Estado para almacenar las filas de datos.
   *
   * @type {Array}
   * @default []
   * @private
   */
  const [rows, setRows] = React.useState([]);
  const [getProcesses,setProcesses]=React.useState([])
  /**
   * Construye y devuelve la configuración de columnas para el DataGrid.
   *
   * @function
   * @returns {Array} - Configuración de columnas para el DataGrid.
   * @private
   */
  const buildColumns = () => {
    const columns = [
      {
        field: "nombre",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Nombre"}</strong>
        ),
        width: 300,
        editable: true,
      },
      {
        field: "activo",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Activo"}</strong>
        ),
        type: "boolean",
        width: 80,
        align: "left",
        headerAlign: "left",
        editable: true,
        renderCell: (params) => <CheckCell data={params.row.activo} />,
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
        type: "singleSelect",
        width: 150,
        align: "left",
        headerAlign: "left",
        editable: true,
        valueGetter: ({ row }) => {
          const targetProcess = getProcesses.find(
            (process) => process.id_proceso === row.id_proceso
          );
          return targetProcess ? targetProcess.nombre : "";
        },
        valueOptions: () => getProcesses.map((process) => process.nombre),
        valueParser: (newValue) => {
          const targetProcess = getProcesses.find(
            (process) => process.nombre === newValue
          );
          return targetProcess ? targetProcess.id_proceso : "";
        },
      },
      {
        field: "actions",
        type: "actions",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Proceso"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
          </strong>
        ),
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              /* onClick={() => handleDeleteClick(id)} */
              color="inherit"
            />,
          ];
        },
      },
    ];

    return columns;
  };




  React.useEffect(() => {
    /**
    * Función asíncrona para obtener y establecer los datos de las tareas.
    *
    * @function
    * @async
    * @private
    */
   const fetchData = async () => {
     try {
       // Aquí deberías hacer tu solicitud de red para obtener los datos
       // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
       const response = await getAllTasks();
  
       
  
       // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
       const rowsWithId = response.map((row, index) => ({
         ...row,
         id: row.id_tarea || index.toString(),
       }));
  
       setRows(rowsWithId);
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   };
  
   fetchData();
  }, []);
  /**
   * Hook de efecto para cargar datos iniciales al montar el componente.
   *
   * @effect
   * @private
   */

  React.useEffect(() => {
     /**
     * Función asíncrona para obtener y establecer los datos de las tareas.
     *
     * @function
     * @async
     * @private
     */
    const fetchData = async () => {
      try {
        // Aquí deberías hacer tu solicitud de red para obtener los datos
        // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
        const response = await getAllProcesses();

        // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
        const rowsWithId = response.map((row, index) => ({
          ...row,
          id: row.id_tarea || index.toString(),
        })).filter((row)=>{
          return row.activo
        });


       


        setProcesses(rowsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

   


/**
 * Componente funcional que representa una barra de herramientas personalizada para un DataGrid.
 *
 * @component
 * @example
 * // Uso en un DataGrid
 * <DataGrid components={{ Toolbar: CustomToolbar }} />
 */
   function CustomToolbar() {
     /**
   * Renderiza una barra de herramientas con botones para gestionar las columnas, filtros, densidad y exportación de un DataGrid.
   *
   * @returns {JSX.Element} - Elemento JSX que representa la barra de herramientas personalizada.
   */
    

 
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="secondary" />
        <GridToolbarFilterButton color="secondary" />
        <GridToolbarDensitySelector color="secondary" />
        <GridToolbarExport color="secondary" />
        {/* <Button
          color="secondary"
          startIcon={<FaTasks />}
          onClick={handleOpenDialog}
        >
          Agregar Nueva Tarea
        </Button> */}
      </GridToolbarContainer>
    );
  }

  /**
   * Renderiza el componente DataGrid con las filas y columnas configuradas.
   *
   * @returns {JSX.Element} - Elemento JSX que representa el DataGrid.
   */
  return <DataGrid rows={rows} columns={buildColumns()}   slots={{ toolbar: CustomToolbar }}  localeText={{
    toolbarColumns: "Columnas",
    toolbarFilters: "Filtros",
    toolbarDensity: "Tamaño Celda",
    toolbarExport: "Exportar",
  }}/>;
}

export default DataGridTaskCrud;
