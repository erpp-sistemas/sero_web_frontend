import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';



const PdfView = ({ data }) => {


    const styles = StyleSheet.create({
        imagenPortada: { width: '90%', height: '70%' },
    })
    console.log(img)

    return (
        <Document>
            <Page size="A4">
                <Image
                    src={img}
                    style={styles.imagenPortada}
                />
            </Page>
        </Document>
    )
}

export default PdfView