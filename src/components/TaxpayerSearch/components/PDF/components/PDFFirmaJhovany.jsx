//import './styles/PDFFirmaJhovany.css'


const PDFFirmaJhovany = ({ altoFirma = 0 }) => {
  return (
    <div className="firma-jhovany">
      <img
        style={{ height: altoFirma }}
        className="firma-jhovany-firma"
        src="./Firma/Firma1.png"
        alt=""
      />
      <p className="firma-jhovany-texto">Firma</p>
      <p className="firma-jhovany-nombre">Jhovany Francisco Cedillo Carden</p>
      <p className="firma-jhovany-descripcion">Representante legal ERPP</p>
    </div>
  );
};

export default PDFFirmaJhovany;
