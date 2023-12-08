import { Box, Typography } from '@mui/material';
import './styles/GraficasSection.css'
import GraficaBarrasAgrupadas from '../graficas/GraficaBarrasAgrupadas';
import StackedAreaChart from '../graficas/StackedAreaChart';

//* busquedaContribuyenteGraficas
//* busquedaContribuyenteGraficasTitulo
//* busquedaContribuyenteGraficasGraficas
//* busquedaContribuyenteGraficasGrafica
const classNames = {
  contenedor: 'busquedaContribuyenteGraficas',
  Titulo: 'busquedaContribuyenteGraficasTitulo',
  Graficas: 'busquedaContribuyenteGraficasGraficas',
  Grafica: 'busquedaContribuyenteGraficasGrafica',
}

const GraficasSection = ({ pagos, adeudo }) => {

  return (
    <div className={classNames.contenedor}>
      <Typography className={classNames.contenedor} variant="h5" >
        Grafica adeudos / Pagos
      </Typography>
      <Box className={classNames.Graficas} >
        <div className={classNames.Grafica}>
          <GraficaBarrasAgrupadas pagos={pagos} adeudos={adeudo} />
        </div>
        <div className={classNames.Grafica}>
          <StackedAreaChart pagos={pagos} adeudos={adeudo} />
        </div>
      </Box>
    </div>
  )
};

export default GraficasSection;