// PDFGenerator.jsx

import React, { useState } from "react";
import { Page, Text, View, Document, StyleSheet,Image } from '@react-pdf/renderer';
import { Button } from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import instance from "../../../api/axios";
import {pdf} from '@react-pdf/renderer';
import { log } from "mathjs";

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        // backgroundColor: '#1C3D54',
        padding: 20,
        fontFamily: 'Helvetica',
        width:"100%",
      },
      profileContainer: {
        backgroundColor: '#1C3D54',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottom: '1 solid #fff',
        paddingBottom: 10,
        padding:10
      },
      photo: {
        width: 100,
        height: 100,
        borderRadius: '50%',
        border: '2 solid #00BFFF',
      },
      infoContainer: {
        marginLeft: 15,
        width:"70%"
      },
      name: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
      },
      label: {
        color: '#1C3D54',
        fontSize: 15,
        fontWeight: 'bold',
      },
      label_section: {
        color: '#1C3D54',
        fontSize: 10,
        fontWeight: 'bold',
      },
      text_info: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
      },
      email: {
        color: '#00BFFF',
        fontSize: 12,
      },
      status: {
        color: '#00FF00',
        fontSize: 12,
      },
      conten_info: {
        flex: 1, // Para que los elementos ocupen el mismo espacio
        marginRight: 10,
        color: 'red',
        fontSize: 12,
        // borderRight:"2px solid black",
        borderBottom:"2px solid #9c9c9c"
      },
      group_info: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      separador: {
        flexDirection: 'row',
        justifyContent: 'space-between',
       marginVertical:"20px"
      },
      line:{
        backgroundColor:"#00FF00",
        height:"3px",
        width:"30%"
      },
      plaza:{
        backgroundColor:"#03a9f4",
        color:"#fff",
        borderRadius:"20px",
        padding:"5px",
        display:"flex",
        width:"auto"
      }
});




// Componente PDFGenerator
const PDFfichaEmpleado = ({ empleado,expediente,close }) => {
    const [cargando,setCargando]=useState(false)

    const downloadFiles = async () => {
        setCargando(true)
        try {

          const response = await instance.get(`/awsFiles/${empleado.id_usuario}`, {
            responseType: 'blob',
          });
    
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${empleado.nombre}_expediente_${new Date().getTime()}.zip`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          await downloadPDF();
    
          setTimeout(() => {
            close(false);
          }, 1500);
        } catch (error) {
          console.error('Error al descargar los archivos:', error);
        }
      };
    
      const downloadPDF = async () => {
        setCargando(true)
        const pdfBlob = await generatePDF();
        const pdfUrl = window.URL.createObjectURL(pdfBlob);
        const pdfLink = document.createElement('a');
        pdfLink.href = pdfUrl;
        pdfLink.setAttribute('download', `${empleado.nombre}_Ficha.pdf`);
        document.body.appendChild(pdfLink);
        pdfLink.click();
        document.body.removeChild(pdfLink);
        setCargando(false)
        close(false)
      };
    
      const generatePDF = async () => {
        return new Promise((resolve) => {
          const document = pdf(<FichaPDFcomponent data={empleado} />);
          document.toBlob().then((blob) => {
            resolve(blob);
          });
        });
      };
    
   
    
      return (
        <Button
          sx={{ margin: '5px 10px', display: 'flex', justifyContent: 'start' }}
          startIcon={<InsertDriveFileIcon />}
          color={expediente ? 'info' : 'error'}
          variant="contained"
          onClick={expediente ? downloadFiles:downloadPDF}
        >
          {cargando?"Cargando ...":(expediente ? 'Descargar expediente' : ' Descargar PDF')}
        </Button>
      );
    };


const FichaPDFcomponent = ({ data }) => {
    const fotoPerfil = data?.foto || 'ruta/de/la/foto.jpg';
    const nombre = data?.nombre || 'Nombre Desconocido';
    const correo = data?.correo || 'correo.desconocido@ser0.mx';
    const estado = data?.info_empleado?.correo || 'SIN CORREO AUN';

    const empleado=data?.info_empleado
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.profileContainer}>
            <Image style={styles.photo} src={fotoPerfil} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{nombre}</Text>
                <Text style={styles.email}>{correo}</Text>
                <Text style={styles.status}>{estado}</Text>
            </View>

          </View>

          <View style={styles.separador}>
                <View style={styles.line}></View>
                     <Text style={styles.label_section}>DATOS PERSONALES </Text>
                <View style={styles.line}></View>
          </View>

            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>Fecha de Cumpleaños </Text>
                    <Text style={styles.text_info}>{data?.fecha_nacimiento}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>NSS </Text>
                    <Text style={styles.text_info}>{empleado?.nss}</Text>
                </View>
            </View>

            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>RFC </Text>
                    <Text style={styles.text_info}>{empleado?.rfc}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>CURP </Text>
                    <Text style={styles.text_info}>{empleado?.curp}</Text>
                </View>
            </View>

            <View style={styles.separador}>
                <View style={styles.line}></View>
                     <Text style={styles.label_section}>CONTACTO </Text>
                <View style={styles.line}></View>
            </View>

            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>TELÉFONO </Text>
                    <Text style={styles.text_info}>{data?.telefono_personal}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>CORREO </Text>
                    <Text style={styles.text_info}>{empleado?.correo}</Text>
                </View>
            </View>
            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>CONTACTO DE EMERGENCIA </Text>
                    <Text style={styles.text_info}>{empleado?.contacto_de_emergencia}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>CALLE </Text>
                    <Text style={styles.text_info}>{empleado?.calle}</Text>
                </View>
            </View>
            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>NO. EXT </Text>
                    <Text style={styles.text_info}>{empleado?.no_ext}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>NO. INT </Text>
                    <Text style={styles.text_info}>{empleado?.no_int}</Text>
                </View>
            </View>
            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>CODIGO POSTAL </Text>
                    <Text style={styles.text_info}>{empleado?.cp}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>COLONIA </Text>
                    <Text style={styles.text_info}>{empleado?.colonia}</Text>
                </View>
            </View>
            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>ALCALDIA/MUNICIPIO </Text>
                    <Text style={styles.text_info}>{empleado?.municipio_alcaldia}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>ESTADO/CIUDAD </Text>
                    <Text style={styles.text_info}>{empleado?.estado_ciudad}</Text>
                </View>
            </View>

            <View style={styles.separador}>
                <View style={styles.line}></View>
                     <Text style={styles.label_section}>CONTRATACIÓN </Text>
                <View style={styles.line}></View>
            </View>

            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>CARGO </Text>
                    <Text style={styles.text_info}>{data?.nombre_rol.toUpperCase()}</Text>
                </View>
                <View style={{...styles.conten_info}}>
                    <Text style={styles.label}>PLAZAS ASIGNADAS </Text>
                  <View style={{flexWrap:"wrap",flexDirection: 'row'}}>
                  {
                        data.plazas.map(place=>(
                        <View style={styles.plaza}>
                            <Text >{place.nombre}</Text>
                        </View>
                        ))
                    }
                  </View>
                </View>
            </View>
            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>FECHA INGRESO </Text>
                    <Text style={styles.text_info}>{empleado?.fecha_ingreso}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>ALTA IMMS </Text>
                    <Text style={styles.text_info}>{empleado?.alta_imms}</Text>
                </View>
            </View>
            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>C. DETERMINADO 1 </Text>
                    <Text style={styles.text_info}>{empleado?.contrato_determinado_1}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>C. DETERMINADO 2 </Text>
                    <Text style={styles.text_info}>{empleado?.contrato_determinado_2}</Text>
                </View>
            </View>
            <View style={styles.group_info}>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>C. DETERMINADO 3 </Text>
                    <Text style={styles.text_info}>{empleado?.contrato_determinado_3}</Text>
                </View>
                <View style={styles.conten_info}>
                    <Text style={styles.label}>C. INDETERMINADO  </Text>
                    <Text style={styles.text_info}>{empleado?.contrato_indeterminado}</Text>
                </View>
            </View>


        </Page>
      </Document>
    );
};






export default PDFfichaEmpleado;
