// PDFGenerator.jsx

import React from "react";
import { PDFDownloadLink, PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Componente PDFGenerator
const PDFGenerator = ({ data }) => {
  console.log(data)
  return (
    <div>
      <PDFDownloadLink document={<MyDocument data={data} />} fileName="account_details.pdf">
        {({ blob, url, loading, error }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
      </PDFDownloadLink>
    </div>
  );
};

// Componente MyDocument que define la estructura del PDF
const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Detalles de la cuenta:</Text>
        <Text>{JSON.stringify(data, null, 2)}</Text>
      </View>
    </Page>
  </Document>
);

export default PDFGenerator;
