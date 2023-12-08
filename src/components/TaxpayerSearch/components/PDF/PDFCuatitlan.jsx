import "./components/styles/PDFCuatitlan.css";
import TablaGeolocalizacion from "./components/TablaGeolocalizacion";
import TablaAccionesContribuyente from "./components/TablaAccionesContribuyente";
import TablaDatosContribuyente from "./components/TablaDatosContribuyente";
import PDFFirmaJhovany from "./components/PDFFirmaJhovany";
import PDFFirmaElvira from "./components/PDFFirmaElvira";
import TablaAdeudo from "./components/TablaAdeudo";
import TablaPagos from "./components/TablaPagos";

export const PDFCuatitlan = () => {
  return (
    // tabla-acciones-contribuyente
    <div className="PDFInformacionGeneral">
      <h3 className="title">ERPP Corporativo S.A de C.V</h3>
      <img src="/images/LogoERPP.png" alt="" className={"icon_top_left"} />
      <img src="/images/CUATITLAN.png" alt="" className={"icon_top_right"} />

      <h4 className="subtitle">Información general de la cuenta</h4>

      <div className="container-fol">
        <p className="fol">Folio:ERPP/NAOA/30JUN/DOM/0001/00000911-00</p>
      </div>

      <TablaDatosContribuyente servicio="Regularización predio" />
      <TablaGeolocalizacion />
      <TablaAccionesContribuyente />
      <TablaAdeudo />
      <TablaPagos />

      <PDFFirmaJhovany altoFirma={60} />
      <PDFFirmaElvira altoFirma={60} />

      <div
        className="pdf-informacion-pagina-contenedor"
        style={{ bottom: "-110px", position: "relative" }}
      >
        <div className="pdf-informacion-pagina">
          <p>Pagina 1 de 1</p>
          <p>Detalles del contribuyente: 100177, Cuautitlan Izcalli</p>
          <p>https://www.erpp.mx/</p>
          <p>SER0®</p>
        </div>
      </div>
    </div>
  );
};

export default PDFCuatitlan;
