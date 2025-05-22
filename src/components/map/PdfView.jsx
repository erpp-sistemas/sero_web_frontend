import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image, } from '@react-pdf/renderer';
import Logo from '../../assets/ser0_space_fondoclaro.png'


const PdfView = ({ polygon, data, imageMap }) => {

    const date = new Date();
    const fecha_date = date.toISOString();
    const fecha_format = fecha_date.split('T')[0];

    const anio = fecha_format.substring(0, 4);
    const mes = fecha_format.substring(5, 7);
    const dia = fecha_format.substring(8);
    const fecha = `${dia}/${mes}/${anio}`


    const styles = StyleSheet.create({
        page: {
            position: 'relative', // Posicionamiento relativo para facilitar la colocación del footer
        },
        content: {
            flexGrow: 1, // Esto permitirá que el contenido crezca y ocupe el espacio disponible
        },
        imageContainer: {
            marginTop: '9px',
            padding: '16px'
        },
        fechaContainer: {
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'flex-end'
        },
        fecha: {
            fontWeight: 'bold',
            fontSize: '12px',
            textAlign: 'right',
            padding: '0 20px'
        },
        titleContainer: {
            backgroundColor: '#374151',
            width: '95%',
            margin: '0 auto',
            padding: '4px 0',
            marginTop: '15px'
        },
        title: {
            fontSize: '12px',
            color: 'white',
            textAlign: 'center',
            textTransform: 'uppercase'
        },
        informationPolygonContainer: {
            width: '95%',
            margin: '0 auto',
            marginTop: '16px',
            backgroundColor: '#E2E8F0',
            padding: '8px 16px',
            borderRadius: '7px',
            color: 'rgb(17,24,39)',
            fontWeight: 'bold'
        },
        textInformation: {
            fontSize: '12px',
            marginBottom: '5px'
        },
        textInformationValue: {
            color: '#3B73EC',
            textTransform: 'uppercase'
        },

        // TABLE
        table: {
            width: "95%",
            margin: "20px auto",
            borderStyle: "solid",
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0
        },
        tableRow: {
            flexDirection: "row",
            color: '#000000'
        },
        tableCol: {
            width: "50%",
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            backgroundColor: '#4B5563'
        },
        tableCell: {
            margin: "auto",
            padding: '5px 2px',
            fontSize: '10px'
        },
        noData: {
            width: '95%',
            margin: '15px auto',
        },
        noDataText: {
            fontSize: '12px',
            textAlign: 'center',
            padding: '10px 0'
        }, 
        footer: {
            position: 'absolute', // Posiciona el footer en la parte inferior de la página
            bottom: 20, // Distancia desde la parte inferior de la página
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 12,
            borderTopWidth: 1,
            borderColor: '#000',
            paddingTop: 10,
        },
    })

    return (
        <Document>
            <Page size="A4">
                <View>
                    <View style={styles.imageContainer}>
                        <Image style={{ width: '33%' }} src={Logo} />
                    </View>
                    <View style={styles.fechaContainer}>
                        <Text style={styles.fecha}> Fecha: {fecha} </Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}> Información del poligono </Text>
                    </View>
                    <View style={styles.informationPolygonContainer}>
                        <Text style={styles.textInformation}>Nombre: <Text style={styles.textInformationValue}> {polygon.name ? polygon.name : 'Sin nombre'} </Text></Text>
                        <Text style={styles.textInformation}>Área: <Text style={styles.textInformationValue}> {polygon.area} </Text></Text>
                        <Text style={styles.textInformation}>Distancia: <Text style={styles.textInformationValue}> {polygon.distancia ? `${polygon.distancia.toLocaleString('en-US', { minimumFractionDigits: 2 })} km` : 'No trazada'} </Text></Text>
                        <Text style={styles.textInformation}>Número de puntos: <Text style={styles.textInformationValue}>  {polygon.number_points} </Text> </Text>
                        <Text style={styles.textInformation}>Usuario asignado: <Text style={styles.textInformationValue}>  {polygon.user ? `${polygon.user.nombre} ${polygon.user.apellido_paterno} ${polygon.user.apellido_materno}` : 'Sin asignación'} </Text> </Text>
                    </View>

                    {data.totalGeneral && data.totalGeneral.totalSum ? (
                        <View style={styles.table}>

                            {/* TITULOS */}
                            <View style={{ ...styles.tableRow, color: '#A9C1E0' }}>
                                <View style={{ ...styles.tableCol, width: '25%', backgroundColor: '#10B981' }}>
                                    <Text style={{ ...styles.tableCell, color: 'black' }}>USO</Text>
                                </View>
                                {data.serviciosUnicos.map(servicio => (
                                    <View style={{ ...styles.tableCol }}>
                                        <Text style={styles.tableCell}>{servicio}</Text>
                                    </View>
                                ))}
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>TOTAL</Text>
                                </View>
                            </View>

                            {/* SEGUNDA FILA */}
                            <View style={styles.tableRow}>
                                <View style={{ ...styles.tableCol, width: '25%', backgroundColor: '#9CA3AF' }}>
                                    <Text style={styles.tableCell}></Text>
                                </View>
                                {data.serviciosUnicos.map(servicio => (
                                    <>
                                        <View style={{ ...styles.tableCol, backgroundColor: '#9CA3AF', width: '25%' }}>
                                            <Text style={styles.tableCell}>Número</Text>
                                        </View>
                                        <View style={{ ...styles.tableCol, backgroundColor: '#9CA3AF', width: '25%' }}>
                                            <Text style={styles.tableCell}>Adeudo</Text>
                                        </View>
                                    </>
                                ))}
                                <View style={{ ...styles.tableCol, backgroundColor: '#9CA3AF', width: '25%' }}>
                                    <Text style={styles.tableCell}>Número</Text>
                                </View>
                                <View style={{ ...styles.tableCol, backgroundColor: '#9CA3AF', width: '25%' }}>
                                    <Text style={styles.tableCell}>Adeudo</Text>
                                </View>
                            </View>

                            {/* CONTENIDO */}
                            {Object.keys(data.resultado).map(tipoUsuario => (
                                <View style={styles.tableRow}>
                                    <View style={{ ...styles.tableCol, backgroundColor: 'white', width: '25%' }}>
                                        <Text style={styles.tableCell}>{tipoUsuario}</Text>
                                    </View>

                                    {data.serviciosUnicos.map(servicio => (
                                        <>
                                            <View style={{ ...styles.tableCol, backgroundColor: 'white', width: '25%' }}>
                                                <Text style={styles.tableCell}> {data.resultado[tipoUsuario].servicios[servicio]?.count || 0} </Text>
                                            </View>

                                            <View style={{ ...styles.tableCol, backgroundColor: 'white', width: '25%' }}>
                                                <Text style={{ ...styles.tableCell, fontSize: '8px' }}> {data.resultado[tipoUsuario].servicios[servicio]?.sum.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0} </Text>
                                            </View>

                                        </>
                                    ))}
                                    <View style={{ ...styles.tableCol, backgroundColor: 'white', width: '25%' }}>
                                        <Text style={styles.tableCell}> {data.resultado[tipoUsuario].totalCount} </Text>
                                    </View>

                                    <View style={{ ...styles.tableCol, backgroundColor: 'white', width: '25%' }}>
                                        <Text style={{ ...styles.tableCell, fontSize: '8px' }}> {data.resultado[tipoUsuario].totalSum.toLocaleString('en-US', { minimumFractionDigits: 2 })} </Text>
                                    </View>
                                </View>
                            ))}

                            <View style={styles.tableRow}>
                                <View style={{ ...styles.tableCol, backgroundColor: '#EAE6E0', width: '25%' }}>
                                    <Text style={styles.tableCell}></Text>
                                </View>
                                {data.serviciosUnicos.map(servicio => (
                                    <>

                                        <View style={{ ...styles.tableCol, backgroundColor: '#EAE6E0', width: '25%' }}>
                                            <Text style={{ ...styles.tableCell, fontWeight: 'bold' }}> {data.totales[servicio]?.totalCount || 0} </Text>
                                        </View>

                                        <View style={{ ...styles.tableCol, backgroundColor: '#EAE6E0', width: '25%' }}>
                                            <Text style={{ ...styles.tableCell, fontSize: '8px', fontWeight: 'bold' }}> {data.totales[servicio]?.totalSum.toLocaleString('en-US', { minimumFractionDigits: 2 }) || 0} </Text>
                                        </View>

                                    </>
                                ))}

                                <View style={{ ...styles.tableCol, backgroundColor: '#EAE6E0', width: '25%' }}>
                                    <Text style={{ ...styles.tableCell, fontWeight: 'bold' }}> {data.totalGeneral.totalCount} </Text>
                                </View>

                                <View style={{ ...styles.tableCol, backgroundColor: '#EAE6E0', width: '25%' }}>
                                    <Text style={{ ...styles.tableCell, fontSize: '8px', fontWeight: 'bold' }}> {data.totalGeneral.totalSum.toLocaleString('en-US', { minimumFractionDigits: 2 })} </Text>
                                </View>
                            </View>
                        </View>
                    ): (
                        <View style={styles.noData}>
                            <Text style={styles.noDataText}> Este layer no cuenta con información de adeudos para poder mostrar la tabla de resumen. </Text>
                        </View>
                    )}


                    {/* IMAGE */}
                    <View style={{ marginTop: '30px', width: '90%', margin: '0 auto' }}>
                        <Image style={{ width: '100%' }} src={imageMap} />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text>&copy; SER0 - Jaime Balmes #11 Torre A Polanco primera sección Miguel Hidalgo CDMX</Text>
                </View>

            </Page>
        </Document>
    )
}

export default PdfView