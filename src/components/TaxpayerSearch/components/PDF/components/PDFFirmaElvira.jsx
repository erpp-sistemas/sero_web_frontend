import "./styles/PDFFirmaElvira.css";

const PDFFirmaElvira = ({ altoFirma = 0 }) => {
  return (
    <div className="firma-elvira">
      <img
        style={{ height: altoFirma }}
        className="firma-elvira-firma"
        src="./Firma/Firma2.png"
        alt=""
      />
      <p className="firma-elvira-texto">Firma</p>
      <p className="firma-elvira-nombre">Elvira Francisco Cedillo Carden</p>
      <p className="firma-elvira-descripcion">Representante legal ERPP</p>
    </div>
  );
};

export default PDFFirmaElvira;
