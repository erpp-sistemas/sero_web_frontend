//import './styles/TablaGeolocalización.css'
import { FC, ReactNode } from "react";

const TablaAccionesContribuyente = () => {
  return (
    <table className="tabla-acciones-contribuyente ">
      <thead>
        <tr style={{ backgroundColor: "#253F60", color: "white" }}>
          <th colSpan={5}>
            Acciones realizadas al contribuyente
          </th>
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
          <th className="celda">Tarea</th>
          <th className="celda">Gestor</th>
          <th className="celda">Fecha de captura</th>
          <th className="celda">Servicio</th>
          <th className="celda">Proceso</th>

        </tr>
        <tr className="tr-odd">

          <td className="celda">3ra Carta Invitación</td>
          <td className="celda">Juan Carlos Perez Gonzalez</td>
          <td className="celda">15/6/2023 10:16:38</td>
          <td className="celda">Regularización predio</td>
          <td className="celda">carta_invitacion</td>

        </tr>

      </tbody>
    </table>
  );
};

export default TablaAccionesContribuyente;
