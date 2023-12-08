// import AWS from 'aws-sdk';

const isDevelopment = true

// Ejemplo de uso:
const imageFile = "..."; // Tu archivo de imagen como un objeto ReadableStream
const s3Bucket = "nombre-de-tu-bucket";
const s3Key = "nombre-de-tu-imagen.jpg";
const s3PublicKey = "Publickey";
const s3SecretKey = "secretkey";
const s3Region = "us-east-2";
const uploadToAWSS3 = async ({ file, bucket, key }) => {
  // Configuracion AWS credenciales y región
  return;
  AWS.config.update({
    accessKeyId: s3PublicKey,
    secretAccessKey: s3SecretKey,
    region: s3Region,
  });

  const s3 = new AWS.S3();

  // Parámetros para la carga de la imagen
  const params = {
    Bucket: bucket,
    Key: key,
    Body: file,
    ACL: "public-read", // Esto hace que el objeto sea público
  };

  try {
    await s3.upload(params).promise();
    const imageUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
    return { url: imageUrl, name: key };
  } catch (error) {
    throw error;
  }
};
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
