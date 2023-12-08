//import './styles/TablaGeolocalización.css'

import { dateConverter } from "../../../helpers/dateConverter";
import useStore from "../../store/useStore.";

const TablaAdeudo = () => {
  const store = useStore();
  const adeudos = store.adeudos;
  return (
    <table className="tabla-acciones-contribuyente ">
      <thead>
        <tr style={{ backgroundColor: "#253F60", color: "white" }}>
          <th colSpan={5}>Adeudo del contribuyente</th>
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
          <th className="celda">Fecha de actualización</th>
          <th className="celda">Fecha de corte</th>
          <th className="celda">Monto original de adeudo</th>
        </tr>

        {adeudos?.map((adeudo) => (
          <tr className="tr-odd">
            <td className="celda">{dateConverter(adeudo.updateDate) }</td>
            <td className="celda">{dateConverter(adeudo.cutoffDate) }</td>
            <td className="celda">{"$"+adeudo.debtAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaAdeudo;
