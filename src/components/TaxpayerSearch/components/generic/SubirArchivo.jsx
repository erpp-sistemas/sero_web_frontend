import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";


const SubirArchivo = ({
  children,
  NodeOnDrag,
  onAcceptedFiles,
  className,
  ...options
}) => {
  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      // acceptedFiles: Archivos aceptados por el filtro de extensión.
      // rejectedFiles: Archivos rechazados por el filtro de extensión.
      // console.log({ acceptedFiles, rejectedFiles });
      if (rejectedFiles.length > 0) {
        // Puedes mostrar un mensaje de error aquí si se rechazan archivos debido al filtro de extensión.
        console.error(
          "Archivos rechazados debido a extensiones no permitidas:",
          rejectedFiles
        );
        alert(`Archivo/s rechazado/s debido a extension/es no permitida/s.
  Verifica que la extension sea alguna de las siguientes: 
    - jpg 
    - jpeg 
    - png 
    - gif 
    - bmp 
    - webp`);
      }

      // Procede a manejar los archivos aceptados.
      if (acceptedFiles.length > 0) {
        if (onAcceptedFiles) onAcceptedFiles(acceptedFiles);

        // Realiza la solicitud POST o cualquier otra acción con el archivo.
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
      "application/x-msi": [".msi"],
    },
    ...options,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "active" : ""} ${className}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (NodeOnDrag ? NodeOnDrag : children) : children}
    </div>
  );
};

export default SubirArchivo;
