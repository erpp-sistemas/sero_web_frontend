import React from "react";
import Container from "../Container";
import DataGridTaskCrud from "./components/DataGridTaskCrud";


/**
 * TaskCrud component for managing tasks.
 *
 * @component
 * @return {JSX.Element} TaskCrud component
 */

function TaskCrud() {
  return <Container>
    <DataGridTaskCrud/>
  </Container>;
}

export default TaskCrud;
