import React from "react";
import Container from "../Container";
import DataGridUsers from "./components/DataGridUsers";
import HorizontalNonLinearStepper from "../StepperComponent";
import { getUserById } from "../../api/user";

function UserModule() {
  const [componentesVisibility, setComponentesVisibility] = React.useState({
    dataGridVisible: true,
    stepperVisible: false,
  });
  const [users, setUsers] = React.useState();


    /**
   * Función asíncrona para obtener los datos de los servicios y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
    const fetchUser = async () => {
      try {
        // Aquí deberías hacer tu solicitud de red para obtener los datos
        // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
  
        const response = await getUserById(151);
  
        console.log(response);
  
        // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
        const rowsWithId = response.map((row, index) => ({
          ...row,
          id: row.id_servicio || index.toString(),
        }));
  
        setUsers(rowsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

  return (
    <Container>
      {componentesVisibility.dataGridVisible && <DataGridUsers fetchUser={fetchUser} setComponentesVisibility={setComponentesVisibility} componentesVisibility={componentesVisibility}/>}
     {componentesVisibility.stepperVisible && <HorizontalNonLinearStepper fetchUser={fetchUser} setComponentesVisibility={setComponentesVisibility} componentName="stepperVisible"/>}
      
    </Container>
  );
}

export default UserModule;
