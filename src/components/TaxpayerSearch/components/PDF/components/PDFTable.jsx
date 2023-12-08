import "./styles/PDFTable.css";

const PDFTable = ({ }) => {
  return (
    <table id="myTable" border={1} className="PDFGeneratorTable">
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
      </tr>
      <tr>
        <td>Row 1, Cell 1</td>
        <td>Row 1, Cell 2</td>
      </tr>
      <tr>
        <td>Row 2, Cell 1</td>
        <td>Row 2, Cell 2</td>
      </tr>
    </table>
  );
};

export default PDFTable;
