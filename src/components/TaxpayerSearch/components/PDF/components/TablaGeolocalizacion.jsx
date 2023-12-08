//import './styles/TablaGeolocalización.css'
import MapboxMap from "./MapboxMap.jsx";
import fotosTomadas from "../../Custom/fotos.tomadas";
import { useEffect, useState } from "react";
import useStore from "../../store/useStore..js";

/* 
apoyame con una funcion  recibe imagenes donde rendizara un tbody contendra un <tr className="tr-pair tr-location flex">
las celdas sean formato a cada celda:
<td key={foto.url + i} className={`celda flex-grow-1 cell-location`}>
  <p style={{ margin: 0, lineHeight: 2 }}>{foto.description}</p>
  <img className="evidencia" src={foto.url} alt="" />
</td>
en filas de columnas de 3 imagenes, excepto la primera fila donde la primera celda tendra:
<td
  className="celda first-cell-location flex-grow-1"
  style={{
    position: "relative",
    display: "flex",
    flexDirection: "column",
  }}
>
  <p style={{ margin: 0, lineHeight: 2 }}>Geolocalizacion</p>
  <MapboxMap coordenadas={coordenadas} />
</td> 
*/

/* function renderImages(images, coordenadas) {
  const rows = [];
  for (let i = 0; i < images.length; i += 3) {
    const rowImages = images.slice(i, i + 3);

    const rowCells = rowImages.map((foto, index) => (
      <td key={foto.imageUrl + index} className={`celda flex-grow-1 cell-location`}>
        <p style={{ margin: 0, lineHeight: 2 }}>{foto.imageType}</p>
        <img className="evidencia" src={foto.imageUrl} alt={foto.imageType} />
      </td>
    ));

    rows.push(
      <tr key={i} className="tr-pair tr-location flex">
        {i === 0 && (
          <td
            className="celda first-cell-location flex-grow-1"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p style={{ margin: 0, lineHeight: 2 }}>Geolocalizacion</p>
            <MapboxMap coordenadas={coordenadas} />
          </td>
        )}
        {rowCells}
      </tr>
    );
  }

  return <tbody>{rows}</tbody>;
} */

const TablaContenido = ({ fotos, coordenadas }) => {
  console.log({ fotos });
  console.log(coordenadas);

  return (
    <>
      <tr className="tr-pair tr-location block">
        <td
          className="first-cell-location"
          /* style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }} */
        >
          <p style={{ margin: 0, lineHeight: 2 }}>Geolocalizacion</p>
          <MapboxMap coordenadas={coordenadas} />
        </td>
        {fotos.slice(0, 2).map((foto, i) => {
          console.log(foto);
          console.log(foto.imageUrl);
       
            return (
              <td key={foto.imageUrl + i} className={`cell-location`}>
                <p style={{ margin: 0, lineHeight: 2 }}>{foto.imageType}</p>
                <img className="evidencia" src={foto.imageUrl} alt={foto.imageType} />
            
              </td>
            )
         
        })}
      </tr>

      <tr className="tr-pair tr-location flex">
        {fotos.slice(2, 5)?.map((foto, i) => (
          <td
            key={foto.imageUrl + i}
            className={`cell-location`}
            style={{ flex: "1" }}
          >
            <p style={{ margin: 0, lineHeight: 2 }}>{foto.imageType}</p>
            <img className="evidencia" src={foto.imageUrl} alt="" />
          </td>
        ))}
      </tr>

      <tr className="tr-pair tr-location flex">
        {fotos.slice(5, 8)?.map((foto, i) => {
          
          console.log(foto);
          return (
          <td
            key={foto.url + i}
            className={`cell-location`}
            style={{ flex: "1" }}
          >
            <p style={{ margin: 0, lineHeight: 2 }}>{foto.imageType}</p>
            <img className="evidencia" src={foto.imageUrl} alt="" />
          </td>
        )})}
      </tr>
    </>
  );
};
function useFilteredPhotos(fotos) {
  const [filteredPhotos, setFilteredPhotos] = useState([]);

  useEffect(() => {
    setFilteredPhotos(fotos.filter((foto) => foto.isActive));
  }, [fotos]);

  return filteredPhotos;
}

const TablaGeolocalizacion = ({ coordenadas, fotos }) => {
  // const { fotos } = useStore();
  console.log(fotos);
  const filteredPhotos = useFilteredPhotos(fotos);
  console.log(filteredPhotos);
  return (
    <table className="tabla-datos-geolocalizacion ">
      <thead>
        <tr style={{ backgroundColor: "#253F60", color: "white" }}>
          <th style={{ paddingBottom: 2 }}>
            Geolocalización y reporte fotográfico del inmueble
          </th>
        </tr>
      </thead>
      <tbody>
        <TablaContenido coordenadas={coordenadas} fotos={filteredPhotos} />
      </tbody>
    </table>
  );
};

export default TablaGeolocalizacion;
