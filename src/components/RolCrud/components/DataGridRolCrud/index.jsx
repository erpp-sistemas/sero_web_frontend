import React from "react";
import { getAllRoles } from "../../../../api/rol";
import { Box, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid } from "@mui/x-data-grid";
/**
 * Componente de celda que muestra un ícono de verificación o de cruz según el valor de la propiedad 'data'.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {any} props.data - Valor que determina si se muestra el ícono de verificación o de cruz.
 * @returns {JSX.Element} Elemento JSX que representa un ícono de verificación o de cruz.
 */
const CheckCell = ({ data }) => {
  /**
   * Renderiza un ícono de verificación si 'data' es verdadero, de lo contrario, muestra un ícono de cruz en rojo.
   *
   * @returns {JSX.Element} Elemento JSX que representa un ícono de verificación o de cruz.
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
 * Componente que muestra una tabla de roles utilizando la biblioteca Material-UI DataGrid.
 *
 * @component
 * @returns {JSX.Element} Elemento JSX que representa la tabla de roles.
 */
function DataGridRolCrud() {
  const [rows, setRows] = React.useState([]);

  /**
   * Función asíncrona para obtener los datos de los roles y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchRoles = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllRoles();

      // Agrega el campo 'id_rol' a cada fila usando el índice como valor único si no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_rol || index.toString(),
      }));

      setRows(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Efecto secundario para cargar los datos al montar el componente
  React.useEffect(() => {
    /**
     * Función asíncrona para obtener y establecer los datos de los roles.
     *
     * @function
     * @async
     * @private
     */

    fetchRoles();
  }, []);

  /**
   * Construye las columnas para la tabla de roles.
   *
   * @function
   * @private
   * @returns {Array} Arreglo de objetos que representan las columnas de la tabla.
   */
  const buildColumns = () => {
    const columns = [
      {
        field: "nombre",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Nombre"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
                  📃
                  </span> */}
          </strong>
        ),
        width: 300,
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
        width: 300,
        type: "boolean",
        editable: true,
        renderCell: (params) => <CheckCell data={params.row.activo} />,
      },
    ];

    return columns;
  };
  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
        ".css-196n7va-MuiSvgIcon-root": {
          fill: "white",
        },
      }}
    >
      <DataGrid rows={rows} columns={buildColumns()} />
    </Box>
  );
}

export default DataGridRolCrud;
