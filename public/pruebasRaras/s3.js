import AWS from "aws-sdk";
import fs from "fs/promises";

const AWS_BUCKET_NAME = "bucket-files-msg";
const AWS_BUCKET_REGION = "us-east-2";
const AWS_PUBLIC_KEY = "AKIAT5FEWJS6F645GO3V";
const AWS_SECRET_KEY = "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";
const AWS_EXPIRE_SECONDS = 3600;
const AWS_LIST_MAX_KEYS = 100;

AWS.config.update({
  accessKeyId: AWS_PUBLIC_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_BUCKET_REGION,
});

const s3 = new AWS.S3();
const bucketName = AWS_BUCKET_NAME;

const uploadFile = async (localFilePath, remoteFileName) => {
  const fileContent = await fs.readFile(localFilePath);

  const params = {
    Bucket: bucketName,
    Key: remoteFileName,
    Body: fileContent,
  };

  return s3.upload(params).promise();
};

const listFiles = async (fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3.listObjectsV2(params).promise();
};

const getFile = async (fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3.getObject(params).promise();
};

const deleteFile = async (fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3
    .deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
    })
    .promise();
};

// Función para firmar una URL de un archivo en S3
const signUrl = async (fileName, expirationTimeInSeconds = 60) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: expirationTimeInSeconds,
  };

  return s3.getSignedUrlPromise("getObject", params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
};

const main = async () => {
  console.log("prueba");
  try {
    // Subir un archivo
    await uploadFile(
      "C:/Users/machineOne/Downloads/imagenExito.png",
      "imagenExito.png"
    );
    console.log("Archivo subido con éxito");

    // Listar archivos en el bucket
    /*  const files = await listFiles(".");
    console.log('Archivos en el bucket:', files.Contents.map(file => file.Key)); */

    // Obtener un archivo
    /* const fileContent = await getFile('archivo.txt');
    console.log('Contenido del archivo:', fileContent.Body.toString()); */

    // Firmar una URL para descargar el archivo
    const signedUrl = await signUrl("imagenExito.png");
    console.log("URL firmada para el archivo:", signedUrl);

    // Eliminar un archivo
    /*  await deleteFile('imagenExito.png');
    console.log('Archivo eliminado con éxito'); */
  } catch (error) {
    console.error("Error:", error);
  }
};

// Ejecutar el ejemplo
main();
