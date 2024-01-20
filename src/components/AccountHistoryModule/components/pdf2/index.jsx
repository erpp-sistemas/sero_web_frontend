import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import LogoSer0 from "./assets/images/sero-logo.png";
import LogoErpp from "./assets/images/erpp.png";
import LogoCheck from "./assets/images/marcaAgua.png";
import QRCode from "qrcode";
import Roboto from "../pdf/assets/fonts/Oswald-Regular.ttf";
import { get } from "react-hook-form";

// Función para dividir un array en chunks de un tamaño específico
function chunkArray(array, chunkSize) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArray.push(array.slice(i, i + chunkSize));
  }
  return chunkedArray;
}

/* Functions */

/**
 * Generates a QR code data URL.
 *
 * @param {string} url - URL to encode in the QR code.
 * @returns {string} - Data URL of the generated QR code.
 */

const generateQRCodeData = (url) => {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
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
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formattedDate = new Date(dateString).toLocaleString("es-MX", options);

  switch (format) {
    case "date":
      return formattedDate.split(",")[0]; // Get only the date part
    case "time":
      return formattedDate.split(",")[1].trim(); // Get only the time part
    case "full":
      return formattedDate; // Get the complete date and time
    default:
      return "Invalid format";
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
    const formattedAmount = numericAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formattedAmount;
  } else {
    // En caso de que amount no sea un número válido
    return "Invalid amount";
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
const totalPayments = (array) => {
  let totalCount = 0;
  array.forEach((payments) => {
    if (payments.amount_paid != undefined) {
      totalCount += Number(payments.amount_paid);
    }
  });

  return `$${totalCount.toFixed(2)}`;
};

// Create styles

Font.register({
  family: "Roboto",
  format: "truetype",
  src: Roboto,
});
const styles = StyleSheet.create({
  body: {
    minHeight: "100%",
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
    fontFamily: "Roboto",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: "table",
    width: "auto",
    borderColor: "black",
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
    borderColor: "black",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    color: "white",
    backgroundColor: "#254061",
  },
  tableColContentTitle: {
    width: "100%",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    color: "gray",
    backgroundColor: "white",
  },
  tableColHeader: {
    width: "25%",
    borderColor: "black",
    borderStyle: "solid",
    fontWeight: "bold",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    color: "#254061",
    backgroundColor: "#e6e6e6",
  },
  tableColHeaderImages: {
    width: "33.33%",
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    color: "white",
    backgroundColor: "#254061",
  },
  tableCol: {
    width: "25%",
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColCoordinates: {
    width: "100%",
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellCoordinates: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    fontFamily: "Roboto",
  },
  tableColImage: {
    width: "33.33%",
    height:80,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColImageMap: {
    width: "100%",
    height: 150,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center", // Center the content horizontally
    justifyContent: "center", // Center the content vertically
  },

  imageMap: {
    width: "100%",
    height: "auto",
    resizeMode: "cover", // Adjust resizeMode based on your needs
  },
  tableColMap: {
    width: "50%",
    height: 300,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    fontFamily: "Roboto",
  },
  tableCellContent: {
    fontSize: 11,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  cellMap: {
    width: "100%",
    height: "auto",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
/*  */
/*  */

function Pdf2({
  ownerDetails,
  ownerHomeImages,
  ownerDebts,
  ownerPayments,
  ownerActions,
}) {
  const sortedOwnerActions = [...ownerActions].sort((a, b) => {
    // Convierte las propiedades task_done a números antes de comparar
    const taskDoneA = parseFloat(a.task_done);
    const taskDoneB = parseFloat(b.task_done);

    // Compara los valores numéricos
    return taskDoneA - taskDoneB;
  });

  /*  console.log(ownerHomeImages); */

  const qrCodeData = generateQRCodeData("https://example.com");

  const [image, setImage] = React.useState("");
  React.useEffect(() => {
    setImage(ownerHomeImages[1]?.imageUrl);
  }, [ownerHomeImages]);

  function getMap(longitude, latitude) {
    const geo_punto = `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-l+000(${longitude},${latitude})/${longitude},${latitude},17,0/400x250?access_token=pk.eyJ1IjoibGVzdGF0eCIsImEiOiJjbDJoMzJrbmYwYTNrM2NteGVtMzBsODFvIn0.lTrpDiiVnBWEv141_PnuUg`;
    return geo_punto;
  }

  

  return (
    <Document title={`Cuenta No. ${ownerDetails[0].account}`}>
      <Page size="A4" style={{ ...styles.body, height: 1000 }} wrap={true}>
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            top: "-5%",
            left: "-10%",
            color: "rgba(255, 255, 255, 0.3)",
            opacity: 0.1,
            filter: "blur(8px)",
          }}
        >
          <Image style={styles.logoWaterMark} src={LogoCheck} />
        </View>
        <View  style={styles.header}>
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
                  {ownerDetails[0].account || ""}{" "}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellContent}>
                  {ownerDetails[0]["owner_name"] || ""}{" "}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {ownerDetails[0]["type_service"] || ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {ownerDetails[0]["rate_type"] || ""}
                </Text>
              </View>
            </View>

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
                <Text style={styles.tableCell}>{ownerDetails.turn || ""} </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {ownerDetails[0]["meter_series"] || ""}{" "}
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
                <Text style={styles.tableCell}>Domicilio del Propietario</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColContentTitle}>
                <Text style={styles.tableCell}>{ownerDetails[0].street}</Text>
              </View>
            </View>

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
                  {ownerDetails[0]["outdoor_number"] || ""}{" "}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {ownerDetails[0]["interior_number"] || ""}{" "}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellContent}>
                  {ownerDetails[0]["cologne"] || ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {ownerDetails[0]["square"] || ""}
                </Text>
              </View>
            </View>

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
                  {ownerDetails[0]["between_street_1"] || ""}{" "}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {ownerDetails[0]["between_street_2"] || ""}{" "}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {ownerDetails[0]["town"] || ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {ownerDetails[0]["poastal_code"] || ""}
                </Text>
              </View>
            </View>

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

            <View style={styles.tableRow}></View>

            <View style={styles.tableRow}>
              <View style={styles.tableColTitle}>
                <Text style={styles.tableCell}>Geolocalizaciòn</Text>
              </View>
            </View>

            <View style={styles.tableColImageMap}>
              <Image
                src={getMap(
                  ownerDetails[0].longitude,
                  ownerDetails[0].latitude
                )}
                style={styles.imageMap}
              />
            </View>

            <View style={styles.tableColCoordinates}>
              <Text style={styles.tableCellCoordinates}>
                {`Longitud: ${ownerDetails[0].longitude}   Latitud: ${ownerDetails[0].latitude}`}
              </Text>
            </View>

            {/*        <View style={styles.tableRow}>
                    <View style={styles.tableColTitle}>
                      <Text style={styles.tableCell}>Imagenes</Text>
                    </View>
                  </View>

            {ownerHomeImages.length > 0 ? (
              chunkArray(ownerHomeImages, 3).map((imageRow, rowIndex) => (
                
                <React.Fragment key={rowIndex}>
                 

                  <View style={styles.tableRow}>
                    {imageRow.map((image, colIndex) => (
                      <View key={colIndex} style={styles.tableColHeaderImages}>
                        <Text style={styles.tableCell}>{image.image_type}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.tableRow}>
                    {imageRow.map((image, colIndex) => (
                      <View key={colIndex} style={styles.tableColImage}>
                        <Image
                          style={styles.image}
                          src={{
                            uri: image.image_url,
                            method: "GET",
                            headers: { "Cache-Control": "no-cache" },
                            body: "",
                          }}
                        />
                      </View>
                    ))}
                  </View>
                </React.Fragment>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
            )} */}

            {/* <View style={styles.tableRow}>
               <View style={styles.tableColImage}>
              <Image style={styles.image} src={image}/>
                    </View> 
                   {ownerHomeImages.slice(0,1).map((image, index) => (
    <View key={index} style={styles.tableColImage}>
      <Image style={styles.image} src={image.imageUrl} />
    </View>
  ))} 
                
              </View> */}
            {/*    {sortedOwnerActions.length > 0 ? (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.tableColTitle}>
                    <Text style={styles.tableCell}>Acciones Realizadas</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Tarea</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Gestor</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Fecha de captura</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Proceso</Text>
                  </View>
                </View>
                {sortedOwnerActions.map((actions, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{actions.task_done}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellContent}>
                        {actions.person_who_capture}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {formatDate(actions.date_capture, "full") || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
            )} */}

            {/*    {ownerDebts.length > 0 ? (
              <>
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
                          {formatCurrency(debt.debt_amount) || ""}{" "}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {formatDate(debt.last_payment_date, "full") || ""}{" "}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {formatDate(debt.update_date, "full") || ""}{" "}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {formatDate(debt.cutoff_date, "full") || ""}{" "}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </>
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
            )}
          */}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>
            www.erpp.mx
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            Jaimes Balmes no. 11
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            Polanco I Sección
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            Miguel Hgo. CDMX
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            C.P. 11510
          </Text>
        </View>
      </Page>
      <Page
        size="A4"
        style={{ ...styles.body, minHeight: "100vh" }}
        wrap={false}
      >
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            top: "-5%",
            left: "-10%",
            color: "rgba(255, 255, 255, 0.3)",
            opacity: 0.1,
            filter: "blur(8px)",
          }}
        >
          <Image style={styles.logoWaterMark} src={LogoCheck} />
        </View>
        <View style={styles.header}>
          <Image style={styles.logo} src={LogoErpp} />
          <Image style={styles.logo} src={LogoSer0} />
        </View>

        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColTitle}>
                <Text style={styles.tableCell}>Imagenes</Text>
              </View>
            </View>

            {ownerHomeImages.length > 0 ? (
              chunkArray(ownerHomeImages.slice(0, 9), 3).map(
                (imageRow, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <View style={styles.tableRow}>
                      {imageRow.map((image, colIndex) => (
                        <View
                          key={colIndex}
                          style={styles.tableColHeaderImages}
                        >
                          <Text style={styles.tableCell}>
                            {image.image_type}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.tableRow}>
                      {imageRow.map((image, colIndex) => (
                        <View key={colIndex} style={styles.tableColImage}>
                          <Image
                            style={styles.image}
                            src={{
                              uri: image.image_url,
                              method: "GET",
                              headers: { "Cache-Control": "no-cache" },
                              body: "",
                            }}
                          />
                        </View>
                      ))}
                    </View>
                  </React.Fragment>
                )
              )
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
            )}

            {/* {sortedOwnerActions.length > 0 ? (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.tableColTitle}>
                    <Text style={styles.tableCell}>Acciones Realizadas</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Tarea</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Gestor</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Fecha de captura</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Proceso</Text>
                  </View>
                </View>
                {sortedOwnerActions.map((actions, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>{actions.task_done}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>
                        {actions.person_who_capture}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>
                        {formatDate(actions.date_capture, "full") || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                      </Text>
                    </View>
                  </View>

                ))}
                  <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              </>
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
            )} */}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>
            www.erpp.mx
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            Jaimes Balmes no. 11
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            Polanco I Sección
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            Miguel Hgo. CDMX
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            C.P. 11510
          </Text>
        </View>
      </Page>
      {ownerHomeImages.slice(9, 18).length > 0 ? (
        <Page
          size="A4"
          style={{ ...styles.body, minHeight: "100vh" }}
          wrap={false}
        >
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              top: "-5%",
              left: "-10%",
              color: "rgba(255, 255, 255, 0.3)",
              opacity: 0.1,
              filter: "blur(8px)",
            }}
          >
            <Image style={styles.logoWaterMark} src={LogoCheck} />
          </View>
          <View style={styles.header}>
            <Image style={styles.logo} src={LogoErpp} />
            <Image style={styles.logo} src={LogoSer0} />
          </View>

          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColTitle}>
                  <Text style={styles.tableCell}>Imagenes</Text>
                </View>
              </View>

              {ownerHomeImages.length > 0 ? (
                chunkArray(ownerHomeImages.slice(9, 18), 3).map(
                  (imageRow, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <View style={styles.tableRow}>
                        {imageRow.map((image, colIndex) => (
                          <View
                            key={colIndex}
                            style={styles.tableColHeaderImages}
                          >
                            <Text style={styles.tableCell}>
                              {image.image_type}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.tableRow}>
                        {imageRow.map((image, colIndex) => (
                          <View key={colIndex} style={styles.tableColImage}>
                            <Image
                              style={styles.image}
                              src={{
                                uri: image.image_url,
                                method: "GET",
                                headers: { "Cache-Control": "no-cache" },
                                body: "",
                              }}
                            />
                          </View>
                        ))}
                      </View>
                    </React.Fragment>
                  )
                )
              ) : (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{""}</Text>
                </View>
              )}

              {/* {sortedOwnerActions.length > 0 ? (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.tableColTitle}>
                    <Text style={styles.tableCell}>Acciones Realizadas</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Tarea</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Gestor</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Fecha de captura</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Proceso</Text>
                  </View>
                </View>
                {sortedOwnerActions.map((actions, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>{actions.task_done}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>
                        {actions.person_who_capture}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>
                        {formatDate(actions.date_capture, "full") || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                      </Text>
                    </View>
                  </View>

                ))}
                  <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              </>
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
            )} */}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>
              www.erpp.mx
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Jaimes Balmes no. 11
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Polanco I Sección
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Miguel Hgo. CDMX
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              C.P. 11510
            </Text>
          </View>
        </Page>
      ) : null}
      {ownerHomeImages.slice(18, 27).length > 0 ? (
        <Page
          size="A4"
          style={{ ...styles.body, minHeight: "100vh" }}
          wrap={false}
        >
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              top: "-5%",
              left: "-10%",
              color: "rgba(255, 255, 255, 0.3)",
              opacity: 0.1,
              filter: "blur(8px)",
            }}
          >
            <Image style={styles.logoWaterMark} src={LogoCheck} />
          </View>
          <View style={styles.header}>
            <Image style={styles.logo} src={LogoErpp} />
            <Image style={styles.logo} src={LogoSer0} />
          </View>

          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColTitle}>
                  <Text style={styles.tableCell}>Imagenes</Text>
                </View>
              </View>

              {ownerHomeImages.length > 0 ? (
                chunkArray(ownerHomeImages.slice(18, 27), 3).map(
                  (imageRow, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <View style={styles.tableRow}>
                        {imageRow.map((image, colIndex) => (
                          <View
                            key={colIndex}
                            style={styles.tableColHeaderImages}
                          >
                            <Text style={styles.tableCell}>
                              {image.image_type}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.tableRow}>
                        {imageRow.map((image, colIndex) => (
                          <View key={colIndex} style={styles.tableColImage}>
                            <Image
                              style={styles.image}
                              src={{
                                uri: image.image_url,
                                method: "GET",
                                headers: { "Cache-Control": "no-cache" },
                                body: "",
                              }}
                            />
                          </View>
                        ))}
                      </View>
                    </React.Fragment>
                  )
                )
              ) : (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{""}</Text>
                </View>
              )}

              {/* {sortedOwnerActions.length > 0 ? (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.tableColTitle}>
                    <Text style={styles.tableCell}>Acciones Realizadas</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Tarea</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Gestor</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Fecha de captura</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Proceso</Text>
                  </View>
                </View>
                {sortedOwnerActions.map((actions, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>{actions.task_done}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>
                        {actions.person_who_capture}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>
                        {formatDate(actions.date_capture, "full") || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                      </Text>
                    </View>
                  </View>

                ))}
                  <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              </>
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
            )} */}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>
              www.erpp.mx
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Jaimes Balmes no. 11
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Polanco I Sección
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Miguel Hgo. CDMX
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              C.P. 11510
            </Text>
          </View>
        </Page>
      ) : null}
      {ownerHomeImages.slice(27, 36).length > 0 ? (
        <Page
          size="A4"
          style={{ ...styles.body, minHeight: "100vh" }}
          wrap={false}
        >
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              top: "-5%",
              left: "-10%",
              color: "rgba(255, 255, 255, 0.3)",
              opacity: 0.1,
              filter: "blur(8px)",
            }}
          >
            <Image style={styles.logoWaterMark} src={LogoCheck} />
          </View>
          <View style={styles.header}>
            <Image style={styles.logo} src={LogoErpp} />
            <Image style={styles.logo} src={LogoSer0} />
          </View>

          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColTitle}>
                  <Text style={styles.tableCell}>Imagenes</Text>
                </View>
              </View>

              {ownerHomeImages.length > 0 ? (
                chunkArray(ownerHomeImages.slice(27, 36), 3).map(
                  (imageRow, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <View style={styles.tableRow}>
                        {imageRow.map((image, colIndex) => (
                          <View
                            key={colIndex}
                            style={styles.tableColHeaderImages}
                          >
                            <Text style={styles.tableCell}>
                              {image.image_type}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.tableRow}>
                        {imageRow.map((image, colIndex) => (
                          <View key={colIndex} style={styles.tableColImage}>
                            <Image
                              style={styles.image}
                              src={{
                                uri: image.image_url,
                                method: "GET",
                                headers: { "Cache-Control": "no-cache" },
                                body: "",
                              }}
                            />
                          </View>
                        ))}
                      </View>
                    </React.Fragment>
                  )
                )
              ) : (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{""}</Text>
                </View>
              )}

              {/* {sortedOwnerActions.length > 0 ? (
              <>
                <View style={styles.tableRow}>
                  <View style={styles.tableColTitle}>
                    <Text style={styles.tableCell}>Acciones Realizadas</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Tarea</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Gestor</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Fecha de captura</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Proceso</Text>
                  </View>
                </View>
                {sortedOwnerActions.map((actions, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>{actions.task_done}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>
                        {actions.person_who_capture}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={{ ...styles.tableCell, color: 'gray' }}>
                        {formatDate(actions.date_capture, "full") || ""}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                      </Text>
                    </View>
                  </View>

                ))}
                  <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
              </>
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{""}</Text>
              </View>
            )} */}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>
              www.erpp.mx
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Jaimes Balmes no. 11
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Polanco I Sección
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Miguel Hgo. CDMX
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              C.P. 11510
            </Text>
          </View>
        </Page>
      ) : null}
      {sortedOwnerActions.length > 0 ? (
        <Page
          size="A4"
          style={{ ...styles.body, minHeight: "100vh" }}
          wrap={false}
      
        >
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              top: "-5%",
              left: "-10%",
              color: "rgba(255, 255, 255, 0.3)",
              opacity: 0.1,
              filter: "blur(8px)",
            }}
          >
            <Image style={styles.logoWaterMark} src={LogoCheck} />
          </View>
          <View style={styles.header}>
            <Image style={styles.logo} src={LogoErpp} />
            <Image style={styles.logo} src={LogoSer0} />
          </View>

          <View style={styles.section}>
            <View style={styles.table}>
              {sortedOwnerActions.length > 0 ? (
                <>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColTitle}>
                      <Text style={styles.tableCell}>Acciones Realizadas</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Tarea</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Gestor</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Fecha de captura</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Proceso</Text>
                    </View>
                  </View>
                  {sortedOwnerActions.map((actions, index) => (
                    <View style={styles.tableRow} key={index}>
                      <View style={styles.tableCol}>
                        <Text style={{ ...styles.tableCell, color: "gray" }}>
                          {actions.task_done}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={{ ...styles.tableCell, color: "gray" }}>
                          {actions.person_who_capture}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={{ ...styles.tableCell, color: "gray" }}>
                          {formatDate(actions.date_capture, "full") || ""}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{""}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{""}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{""}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{""}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{""}</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{""}</Text>
                  </View>
                </>
              ) : null}

              {ownerDebts.length > 0 ? (
                <>
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
                      <Text style={styles.tableCell}>
                        Fecha de Actualizacion
                      </Text>
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
                            {formatCurrency(debt.debt_amount) || ""}{" "}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {formatDate(debt.last_payment_date, "full") || ""}{" "}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {formatDate(debt.update_date, "full") || ""}{" "}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {formatDate(debt.cutoff_date, "full") || ""}{" "}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : null}

              {ownerPayments.length > 0 ? (
                <>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColTitle}>
                      <Text style={styles.tableCell}>Pagos</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Referencia</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Descripción</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Fecha de Pago</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Monto a pagar</Text>
                    </View>
                  </View>
                  {ownerPayments.map((payments, index) => (
                    <View style={styles.tableRow} key={index}>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {payments.reference || ""}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {payments.description || ""}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {formatDate(payments.payment_date, "full") || ""}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {formatCurrency(payments.amount_paid) || ""}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>Total</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {totalPayments(ownerPayments) || ""}
                      </Text>
                    </View>
                  </View>
                </>
              ) : null}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>
              www.erpp.mx
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Jaimes Balmes no. 11
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Polanco I Sección
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              Miguel Hgo. CDMX
            </Text>
            <Text
              style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
            >
              C.P. 11510
            </Text>
          </View>
        </Page>
      ) : null}
      {/*  <Page
        size="A4"
        style={{ ...styles.body, minHeight: "100vh" }}
        wrap={false}
      >
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            top: "-5%",
            left: "-10%",
            color: "rgba(255, 255, 255, 0.3)",
            opacity: 0.1,
            filter: "blur(8px)",
          }}
        >
          <Image style={styles.logoWaterMark} src={LogoCheck} />
        </View>
        <View style={styles.header}>
          <Image style={styles.logo} src={LogoErpp} />
          <Image style={styles.logo} src={LogoSer0} />
        </View>
        <View style={styles.header}>
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColTitle}>
                  <Text style={styles.tableCell}>Pagos</Text>
                </View>
              </View>
              {ownerPayments.length > 0 ? (
                <>
                  <View style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Referencia</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Descripción</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Fecha de Pago</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>Monto a pagar</Text>
                    </View>
                  </View>
                  {ownerPayments.map((payments, index) => (
                    <View style={styles.tableRow} key={index}>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {payments.reference || ""}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {payments.description || ""}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {formatDate(payments.payment_date, "full") || ""}
                        </Text>
                      </View>
                      <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>
                          {formatCurrency(payments.amount_paid) || ""}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>Total</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {totalPayments(ownerPayments) || ""}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    No hay pagos registrados.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={{ color: "#17E85D", fontFamily: "Roboto" }}>
            www.erpp.mx
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            Jaimes Balmes no. 11
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            Polanco I Sección
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            Miguel Hgo. CDMX
          </Text>
          <Text
            style={{ fontSize: 9, color: "lightgray", fontFamily: "Roboto" }}
          >
            C.P. 11510
          </Text>
        </View>
      </Page> */}
    </Document>
  );
}

export default Pdf2;
