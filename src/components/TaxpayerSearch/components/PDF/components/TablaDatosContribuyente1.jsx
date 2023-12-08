
const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Cuenta</th>
        <th>Clave Catastral</th>
        <th>Propietario</th>
        <th>Tipo de Servicio</th>
      </tr>
    </thead>
  );
};
const DataColumns = ({ data }) => {
  console.log(data);
  return data?.map((row, index) => {
    console.log(row);
    return (
    <tr key={index}>
      <td>{row.cuenta}</td>
      <td>{row.claveCatastral}</td>
      <td>{row.propietario}</td>
      <td>{row.tipoServicio}</td>
    </tr>
  )});
};
// Puedes agregar aquí las filas de datos de la tabla
// Ejemplo:
const data = [
  {
    cuenta: "Cuenta 1",
    claveCatastral: "Clave 1",
    propietario: "Propietario 1",
    tipoServicio: "Servicio 1",
  },
  {
    cuenta: "Cuenta 2",
    claveCatastral: "Clave 2",
    propietario: "Propietario 2",
    tipoServicio: "Servicio 2",
  },
  // Agrega más filas según sea necesario
];

const TablaDatosContribuyente = () => {
  return (
    <table>
      <TableHeader />
      <tbody>
        <DataColumns data={data} />
      </tbody>
    </table>
  );
};

export default TablaDatosContribuyente;
