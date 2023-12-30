import React from 'react'
import { getAllMenus } from '../../../../api/menu';
import { Box, IconButton } from '@mui/material';
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid } from '@mui/x-data-grid';
  /**
   * CheckCell component for rendering an IconButton with check or clear icon based on data.
   *
   * @component
   * @param {Object} props - The component props.
   * @param {boolean} props.data - Boolean data to determine the icon.
   * @returns {JSX.Element} - The rendered CheckCell component.
   *
   * @example
   * // Usage example
   * <CheckCell data={true} />
   */
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
function DataGridMenuCrud() {
  const [rows, setRows] = React.useState([]);


  const fetchMenus = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllMenus();

      // Agrega el campo 'id_menu' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_menu ,
      }));

      setRows(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }; 

  
  React.useEffect(() => {
    /**
     * Función asíncrona para obtener y establecer los datos de las tareas.
     *
     * @function
     * @async
     * @private
     */

    fetchMenus();
  }, []);

  const buildColumns = () => {
    const columns = [ {
      field: "nombre",
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>
          {"Nombre"}
          {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
        </strong>
      ),
      width: 180,
      editable: true,
    }, 
    {
      field: "id_menu_padre",
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>
          {"Menu Padre"}
          {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
        </strong>
      ),
      width: 180,
      editable: true,
    },
    {
      field: "descripcion",
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>
          {"Descripción"}
          {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
        </strong>
      ),
      width: 180,
      editable: true,
    },
  
    {
      field: "url",
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>
          {"Url"}
          {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
        </strong>
      ),
      width: 180,
      editable: true,
    },
    {
      field: "icono",
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>
          {"Icono"}
          {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
        </strong>
      ),
      width: 180,
      editable: true,
    },
    {
      field: "activo",
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>
          {"Estado"}
          {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
        </strong>
      ),
      width: 80,
      type: "boolean",
      editable: true,
      renderCell: (params) => <CheckCell data={params.row.activo} />,
    },{
      field: "icon_mui",
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>
          {"Icon Mui"}
          {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
        </strong>
      ),
      width: 180,
      editable: true,
    },
    {
      field: "route",
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>
          {"Ruta"}
          {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
        </strong>
      ),
      width: 180,
      editable: true,
    }]
    return columns
  }


  return (
    <Box sx={{ height: 400, width: "100%",'.css-196n7va-MuiSvgIcon-root': {
      fill:"white"
    }  }}>
    
      <DataGrid
        
        rows={rows}
        columns={buildColumns()}
       
      />
      </Box>
  )
}

export default DataGridMenuCrud