// Fotografías de cuenta: hoy NO se suben a S3; solo se muestra una vista previa local (URL blob:)
// con fecha y descripción de prueba. Las llaves y el código muerto de AWS se quitaron en S00-H0.5.
// Subir estas fotos de verdad queda pendiente (ver docs/PROGRESO.md).

const isDevelopment = true

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
function getRandomNumber(min, max) {
  if (min >= 0 && max >= 0 && max >= min) {
    const random = Math.random();
    return Math.floor(random * (max - min + 1) + min);
  } else {
    throw new Error(
      "Los límites del rango deben ser números positivos y max debe ser mayor o igual que min."
    );
  }
}

const urlTest =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVZLvGl8kGyJxxepfFIlWltS3t3JUtk0dXKbzzlItdX5TunXsncFUMYntJDYiwGMml2-s&usqp=CAU";
// /**
//  *
//  * @param {((params: { url: string; }) => any)} callback
//  * @returns
//  */
const descriptions = [
  "Carta invitación fachada predio.",
  "Carta invitación evidencia.",
];
const getTestParmas = () => {
  const date = getCurrentDate();
  const indexDescription = getRandomNumber(0, 1);
  const description = descriptions[indexDescription];
  return {
    date,
    description,
  };
};

const handleUploadToAWSS3 = async ({ file, date, description }) => {
  const url = URL.createObjectURL(file);
  if (isDevelopment) {
    const testParams = getTestParmas();
    date = testParams.date;
    description = testParams.description;
  }
  // const date = getCurrentDate();
  // const indexDescription = getRandomNumber(0, 1);
  // const description = descriptions[indexDescription];
  // const isValidUrl = Boolean(url);
  // const isValidCallback = (callback && typeof (callback) === 'function');
  // if (isValidUrl && isValidCallback) await callback({ url });

  return { url, date, description };
};

export default handleUploadToAWSS3;
