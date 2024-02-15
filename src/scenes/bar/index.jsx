import { useState, useEffect } from 'react'
import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import SelectFormPregunta from '../../components/MaterialUI/SelectFormPreguntaEncuesta';

import dashboardService from '../../services/dashboard.service';

const Bar = () => {

  const [data, setData] = useState([])
  const [idPreguntaSeleccionada, setIdPreguntaSeleccionada] = useState(0);
  const [tipo, setTipo] = useState(1)


  React.useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const userStorage = localStorage.getItem('user')
    const user = JSON.parse(userStorage)
    dashboardService.setToken(user.token)
    const dataBar = await dashboardService.getPreferenciaGeneral()
    setData(dataBar.data)
  }

  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle={data[0]?.pregunta} />
      <Box height="75vh">
        <BarChart dataSQL={data} tipo={tipo} />
      </Box>
    </Box>
  );
};

export default Bar;
