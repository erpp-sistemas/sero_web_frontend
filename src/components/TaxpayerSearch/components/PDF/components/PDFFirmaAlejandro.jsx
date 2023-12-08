import "./styles/PDFFirmaAlejandro.css";

const PDFFirmaAlejandro = ({ altoFirma = 0 }) => {
  return (
    <div className="firma-alejandro-aguilar">
      <img
        style={{ height: altoFirma }}
        className="firma-alejandro-aguilar-firma"
        src="./Firma/FirmaAlejandro.png"
        alt=""
      />
      <p className="firma-alejandro-aguilar-texto">Firma</p>
      <p className="firma-alejandro-aguilar-nombre">
        Alejandro Aguilar Alderete
      </p>
      <p className="firma-alejandro-aguilar-descripcion">
        Gerente de Plaza ERPP

      </p>
    </div>
  );
};

export default PDFFirmaAlejandro;
