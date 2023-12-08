import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import LogoSer0 from "./assets/images/sero-logo.png";
import LogoErpp from './assets/images/erpp.png'
import LogoCheck from './assets/images/marcaAgua.png'
import QRCode from 'qrcode';



/* Functions */

/**
 * Generates a QR code data URL.
 * 
 * @param {string} url - URL to encode in the QR code.
 * @returns {string} - Data URL of the generated QR code.
 */


const generateQRCodeData = (url) => {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    scale: 4,
  });
};
/**
 * Formats a date string.
 * 
 * @param {string} dateString - Input date string.
 * @param {string} format - Desired format ('date', 'time', 'full').
 * @returns {string} - Formatted date string.
 */
function formatDate(dateString, format) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const formattedDate = new Date(dateString).toLocaleString('es-MX', options);
  
  switch (format) {
    case 'date':
      return formattedDate.split(',')[0]; // Get only the date part
    case 'time':
      return formattedDate.split(',')[1].trim(); // Get only the time part
    case 'full':
      return formattedDate; // Get the complete date and time
    default:
      return 'Invalid format';
  }
}


/* // Example usage
const originalDate = '2023-10-26T10:28:50.000Z';

console.log(formatDate(originalDate, 'date'));    // 10/26/2023
console.log(formatDate(originalDate, 'time'));    // 10:28:50
console.log(formatDate(originalDate, 'full'));    // 10/26/2023, 10:28:50 */
/**
 * Formats a currency amount.
 * 
 * @param {number} amount - Amount to format.
 * @returns {string} - Formatted currency amount.
 */
function formatCurrency(amount) {
  // Asegura que amount sea un número
  const numericAmount = Number(amount);

  // Verifica si es un número válido
  if (!isNaN(numericAmount)) {
    // Formatea el número con el signo "$" y dos decimales
    const formattedAmount = numericAmount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formattedAmount;
  } else {
    // En caso de que amount no sea un número válido
    return 'Invalid amount';
  }
}
/* // Ejemplo de uso
const amount1 = 123.45;
const amount2 = 678;

console.log(formatCurrency(amount1)); // $123.45
console.log(formatCurrency(amount2)); // $678.00 */
/**
 * Calcula el monto total de los pagos en un array de objetos.
 *
 * @function
 * @param {Array} array - El array de objetos que contiene los pagos.
 * @returns {string} - El monto total formateado como una cadena con el símbolo de dólar y dos decimales.
 */
const totalPayments=(array)=>{

  let totalCount = 0
  array.forEach((payments)=>{
    if (payments.montoPagado != undefined) {
      totalCount+=Number(payments.montoPagado)
    }

    

  })

  return `$${totalCount.toFixed(2)}`

}

// Create styles

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 50,
  },
  image: {
    width: "100%",
    height: "auto",
  },
  logoWaterMark: {
    width: 700,
    height: 800,
  },
  title: {
    color: "#254061",
    textAlign: "center",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: "table",
    width: "auto",
    borderColor:"lightgray",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    color: "gray",
  },
  tableTitle: { color: "gray", fontSize: 14 },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColTitle: {
    width: "100%",
    borderStyle: "solid",
    borderColor:"lightgray",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    color: "white",
    backgroundColor: "#254061",
  },
  tableColContentTitle:{
    width: "100%",
    borderStyle: "solid",
    borderColor:"lightgray",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    color: "gray",
    backgroundColor: "white",

  },
  tableColHeader: {
    width: "25%",
    borderColor:"lightgray",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    color: "white",
    backgroundColor: "#254061",
  },
  tableColHeaderImages: {
    width: "33.33%",
    borderColor:"lightgray",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    color: "white",
    backgroundColor: "#254061",
  },
  tableCol: {
    width: "25%",
    borderColor:"lightgray",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColImage: {
    width: "33.33%",
    borderColor:"lightgray",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColMap: {
    width: "50%",
    height: 300,
    borderColor:"lightgray",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  cellMap: {
    width: "100%",
    height: "auto",
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});
/*  */
/*  */

function Pdf({ ownerDetails, ownerHomeImages, ownerDebts,ownerPayments }) {

 /*  console.log(ownerHomeImages); */
  

  const qrCodeData = generateQRCodeData('https://example.com');
  




  /* const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=13&size=200x150&maptype=roadmap
  &markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318
  &markers=color:red%7Clabel:C%7C40.718217,-73.998284
  &key=AIzaSyBSbHAclLiEeiClEXfeZ2zn9OT850Mw55A`;
  console.log(imageUrl); */
  /* console.log(ownerHomeImages[1]?.imageUrl); */
  const [image, setImage] = React.useState("");
  React.useEffect(() => {
    setImage(ownerHomeImages[1]?.imageUrl);
  }, [ownerHomeImages]);

  
 
    return (
      <Document>
        <Page size="A4" style={styles.body}>
          <View style={{position:'absolute',zIndex:1,top:"-5%",left:"-10%",color: 'rgba(255, 255, 255, 0.3)',opacity:0.1,filter:"blur(8px)"}}>
          <Image style={styles.logoWaterMark} src={LogoCheck} />

          </View >
          <View style={styles.header}>
            {/* Primer logo */}
            <Image style={styles.logo} src={LogoErpp} />
            <Image style={styles.logo} src={LogoSer0} />
            

            {/* Segundo logo */}
          </View>

          {/* Contenido de la tabla (puedes personalizarlo según tus necesidades) */}
          <View>
            <Text style={styles.title}>Historial de Cuenta</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColTitle}>
                  <Text style={styles.tableCell}>Datos del Propietario</Text>
                </View>
              </View>
              {/* -------------------------- */}
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Cuenta</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Propietario</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Servicio</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Tarifa</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails.account || ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["owner_name"] || ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["type_service"] || ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["rate_type"] || ""}
                  </Text>
                </View>
              </View>
              {/* ------------------------------ */}
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Giro</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Serie de Medidor</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>{""}</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>{""}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails.turn || ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["meter_series"] || ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{""}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{""}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColTitle}>
                  <Text style={styles.tableCell}>
                    Domicilio del Propietraio
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColContentTitle}>
                  <Text style={styles.tableCell}>{ownerDetails.street}</Text>
                </View>
              </View>
              //!----------------------
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Num. Interior</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Num. Exterior</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Colonia</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Manzana</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["outdoor_number"] || ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["interior_number"] || ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["cologne"] || ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["square"] || ""}
                  </Text>
                </View>
              </View>
              //!----------------------
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Entre Calles </Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Entre Calles 2</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Poblaciòn</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>C.P.</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["between_street_1"] || ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["between_street_2"] || ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["town"] || ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {ownerDetails["poastal_code"] || ""}
                  </Text>
                </View>
              </View>
              //!mapas
              {/* <View style={styles.tableRow}> 
         
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCell}>Mapa </Text> 
            </View> 
           
          </View>
          <View style={styles.tableRow}> 
          
         
          <View style={styles.tableColMap}>
          <Image style={styles.cellMap} src={imageUrl}/>
              
            </View>
           
          </View> */}
              //!Imagenes
              <View style={styles.tableRow}>
                <View style={styles.tableColTitle}>
                  <Text style={styles.tableCell}>Imagenes</Text>
                </View>
              </View>
             {/*  {ownerHomeImages?.map((dataImage)=>{
                console.log(dataImage);
              })} */}
              <View style={styles.tableRow}>
                {
                  ownerHomeImages.slice(0,3).map((image, index) => (
                    <View style={styles.tableColHeaderImages}>
                      <Text style={styles.tableCell}>{image.imageType}</Text>
                    </View>
                  ))
                }
             
                
                </View>
              <View style={styles.tableRow}>
              {/* <View style={styles.tableColImage}>
              <Image style={styles.image} src={image}/>
                    </View> */}
                    {ownerHomeImages.slice(0,1).map((image, index) => (
    <View key={index} style={styles.tableColImage}>
      <Image style={styles.image} src={image.imageUrl} />
    </View>
  ))}
                
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColTitle}>
                  <Text style={styles.tableCell}>Adeudos</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Monto del Adeudo </Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Ultima Fecha de Pago</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Fecha de Actualizacion</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Fecha de Corte</Text>
                </View>
              </View>
              {ownerDebts.map((debt, index) => {
                return (
                  <View style={styles.tableRow}>
                    {" "}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {formatCurrency(debt.debtAmount)  || ""}{" "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {formatDate(debt.lastPaymentDate, "full")  || ""}{" "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {formatDate(debt.updateDate ,"full") || ""}{" "}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        { formatDate(debt.cutoffDate,"full")  || ""}{" "}
                      </Text>
                    </View>
                  </View>
                );
              })}
              
            
              
             
            </View>
            <View style={{borderColor:"lightgray",padding:5,borderStyle: "solid",borderWidth:1}}>
               <Image src={qrCodeData} style={{ width: 100, height: 100 }} />

               </View>
          </View>
          <View style={styles.footer}>
          <Text style={{color:"#17E85D"}}>www.erpp.mx</Text>
          <Text style={{fontSize:9,color:"lightgray"}}>Jaimes Balmes no. 11</Text>
          <Text style={{fontSize:9,color:"lightgray"}}>Polanco I Sección</Text>
          <Text style={{fontSize:9,color:"lightgray"}}>Miguel Hgo. CDMX</Text> 
          <Text style={{fontSize:9,color:"lightgray"}}>C.P. 11510</Text>
        </View>
        </Page>
        <Page size="A4" style={styles.body}>
          <View style={styles.header}>
          <View style={styles.section}>
            <View style={styles.table}>

          <View style={styles.tableRow}>
                <View style={styles.tableColTitle}>
                  <Text style={styles.tableCell}>
                    Pagos
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Referencia</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Descripciòn</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Fecha de Pago</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCell}>Monto a pagar</Text>
                </View>
              </View>
              {ownerPayments.map((payments, index) => {
                for (const key in payments) {
                  if (payments[key]!=undefined) {
                    return (
                      <View style={styles.tableRow}>
                        {" "}
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {payments.referencia|| ""}{" "}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {payments.descripcion  || ""}{" "}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {formatDate(payments.fechaDePago ,"full") || ""}{" "}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            { formatCurrency(payments.montoPagado)    || ""}{" "}
                          </Text>
                        </View>
                      </View>
                    );
                    
                  }
                 
                }
                
             
              })}
               <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    { ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    { ""}{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    Total
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {totalPayments(ownerPayments) || ""}
                  </Text>
                </View> 
              </View>
            
               </View>
               <View style={{borderColor:"lightgray",padding:5,borderStyle: "solid",borderWidth:1}}>
               <Image src={qrCodeData} style={{ width: 100, height: 100 }} />

               </View>
              
               </View>


          </View>
        </Page>
      </Document>
    );
  
}

export default Pdf;
