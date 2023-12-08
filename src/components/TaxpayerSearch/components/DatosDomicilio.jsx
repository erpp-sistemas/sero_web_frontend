//import './styles/DatosDomicilio.css'
import { useEffect } from "react";
import classNames from "./styles/classNames";
import { DomicilioNodos } from "./Domicilio";
import { DatosContribuyenteNodos } from "./DatosContribuyente";
import FormularioDatosContribuyente from "./forms/FormularioDatosContribuyente";
import { ROL_VISIBILIDAD_FORMULARIO } from "./Custom/roles";


const DatosDomicilio = ({
  contribuyente,
  domicilio,
  rol
}) => {
  useEffect(() => {
    // console.log(contribuyente);
  }, []);
  return (
    <div
      className={classNames.containerArticle}
      style={{
        display: "flex",
        flexWrap: "wrap",
        // gap: "20px",
        justifyContent: "space-around",
      }}
    >
      <div style={{ width: "fit-content" }}>
        <DatosContribuyenteNodos contribuyente={contribuyente} />
      </div>
      <div style={{ width: "fit-content" }}>
        <DomicilioNodos domicilio={domicilio} />
      </div>

      {rol === ROL_VISIBILIDAD_FORMULARIO && < FormularioDatosContribuyente />}
    </div>
  );
};
export default DatosDomicilio;
