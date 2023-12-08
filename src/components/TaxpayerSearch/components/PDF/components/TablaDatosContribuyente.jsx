import React from "react";

const data = {
  cuenta: "00000911-00",
  claveCatastral: " ",
  propietario: "GUADALUPE BELTRAN",
  tipoDeServicio: "POPULAR",
  tipoDeTarifa: "SERVICIO MEDIDO",
  giro: " ",
  serieDelMedidor: "A15-6040071",
  servicio: "Regularización agua",
  domicilio:
    "20 DE NOVIEMBRE VIV 31, VIV 3, COL. SAN FRANCISCO TEPOJACO SAN FRANCISCO TEPOJACO Cuautitlán Izcalli",
};

const TablaDatosContribuyente = ({ contribuyente,domicilioContribuyente }) => {
  console.log(domicilioContribuyente);
  return (
    <table className="tabla-datos-contribuyente">
      <thead>
        <tr style={{ backgroundColor: "#253F60", color: "white" }}>
          <th colSpan={4}>Datos del contribuyente</th>
        </tr>
        {/* <tr style={{ backgroundColor: "#253F60", color: "white" }}>
          <th>Columna 1</th>
          <th>Columna 2</th>
          <th>Columna 3</th>
          <th>Columna 4</th>
        </tr> */}
      </thead>
      <tbody>
        <tr className="tr-pair small-bold">
          <td className="celda"> Cuenta </td>
          <td className="celda"> Clave catastral </td>
          <td className="celda"> Propietario </td>
          <td className="celda"> Tipo de servicio </td>
        </tr>

        <tr className="tr-odd">
          <td className="celda"> {contribuyente["Cuenta"] || ' '} </td>
          <td className="celda"> {contribuyente["Clave Catastral"] ||  ' ' } </td>
          <td className="celda"> {contribuyente["Propietario"] || ' '} </td>
          <td className="celda"> {contribuyente["TipoServicio"] || ' '} </td>
        </tr>

        <tr className="tr-pair small-bold">
          <td className="celda">Tipo de tarifa</td>
          <td className="celda">Giro</td>
          <td className="celda">Serie del medidor</td>
          <td className="celda">Servicio</td>
        </tr>

        <tr className="tr-odd">
          <td className="celda">{contribuyente["TipoTarifa"] || ' '}</td>
          <td className="celda">{contribuyente["Giro"] || ' '}</td>
          <td className="celda">{contribuyente["SerieMedidor"] || ' '}</td>
          <td className="celda">{contribuyente["Servicio"] || 'Agua'}</td>
        </tr>
        <tr className="tr-pair">
          <td colSpan={4} className="celda">
            Domicilio del contribuyente
          </td>
        </tr>
        <tr className="tr-odd">
          <td colSpan={4} className="celda">{domicilioContribuyente["Calle"]}</td>
        </tr>
        {/* {[1, 2, 3].map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? "tr-pair" : "tr-odd"}>
            <td className="celda">Valor {row}</td>
            <td className="celda">Valor {row * 2}</td>
            <td className="celda">Valor {row * 3}</td>
            <td className="celda">Valor {row * 4}</td>
          </tr>
        ))} */}
      </tbody>
    </table>
  );
};

export default TablaDatosContribuyente;
