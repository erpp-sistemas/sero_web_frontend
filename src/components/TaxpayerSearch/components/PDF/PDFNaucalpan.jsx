import "./components/styles/PDFCuatitlan.css";
import "./styles/PDFNaucalpan.css";
import TablaGeolocalizacion from "./components/TablaGeolocalizacion";
import TablaAccionesContribuyente from "./components/TablaAccionesContribuyente";
import TablaDatosContribuyente from "./components/TablaDatosContribuyente";
import TablaAdeudo from "./components/TablaAdeudo";
import TablaPagos from "./components/TablaPagos";

//* Coordenadas: [-99.077326, 19.6363853]
export const PDFNaucalpan = (params) => {
  console.log(params);
  params.contribuyente;
  params.domicilio
  return (
    // tabla-acciones-contribuyente
    <>
      <div className="PDFInformacionGeneral" id="PDFNaucalpan">
        <h3 className="title">ERPP Corporativo S.A de C.V</h3>
        {/* src="/images/LogoERPP.png" */}
        {/* src="/images/CUATITLAN.png" */}
        <img src="/images/LogoERPP.png" alt="" className={"icon_top_left"} />
        {/* <img src="CUATITLAN.png" alt="" className={"icon_top_right"} /> */}
        <h4 className="subtitle">Información general de la cuenta</h4>

        <div className="container-fol">
          <p className="fol">Folio:ERPP/NAOA/30JUN/DOM/0001/00000911-00</p>
        </div>
        <div style={{ marginTop: 30 }} />
        <TablaDatosContribuyente contribuyente={params.contribuyente} domicilioContribuyente={params.domicilio}/>
        <TablaGeolocalizacion fotos={params.fotos} coordenadas={params.coordenadas} />
        <TablaAccionesContribuyente />
        <TablaAdeudo />
        <TablaPagos />

        {/* <PDFFirmaJhovany altoFirma={60} />
      <PDFFirmaElvira altoFirma={60} /> */}
        {/* <PDFFirmaAlejandro altoFirma={110} /> */}

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
      {/* <PaginaCartaInvitacion /> */}
    </>
  );
};

export default PDFNaucalpan;
