//import './styles/TablaGeolocalización.css'
import { FC, ReactNode } from "react";
import useStore from "../../store/useStore.";

const TablaPagos = () => {
  const store =useStore()
  const pagos = store.pagos
  return (
    <table className="tabla-acciones-contribuyente ">
      <thead>
        <tr style={{ backgroundColor: "#253F60", color: "white" }}>
          <th colSpan={5}>Pagos del contribuyente</th>
        </tr>
      </thead>
      <tbody>
        {/* <tr className="tr-odd">
          <td colSpan={4} className="celda">
            20 DE NOVIEMBRE VIV 31, VIV 3, COL. SAN FRANCISCO TEPOJACO SAN
            FRANCISCO TEPOJACO Cuautitlán Izcalli
          </td>
        </tr> */}
        <tr className="tr-pair">
          <th className="celda">No. factura</th>
          <th className="celda">Fecha de pago</th>
          <th className="celda">Monto pagado</th>
        </tr>
        <tr className="tr-odd">
          <td className="celda">2023-06-01 </td>
          <td className="celda">2023-06-07</td>
          <td className="celda">$3,189.49</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TablaPagos;
