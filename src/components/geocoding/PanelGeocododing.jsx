import React, { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SubirCordenadasPanel from "./SubirCordenadasPanel";
import { useSelector } from "react-redux";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { dispatch } from "../../redux/store";
import { setCordendasComparacion } from "../../redux/dataGeocodingSlice";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import PanelInfoMap from "./PanelInfoMap";
import instance from "../../api/axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(1);
  const [markerInstances, setMarkerInstances] = useState([]);
  const [mark, setMarkortt] = useState([]);

  const cordenadas = useSelector((c) => c.dataGeocoding?.cordenadas);
  const comparacion = useSelector((c) => c.dataGeocoding?.cordendasComparacion);
  const plaza = useSelector((p) => p.plazaNumber);
  const mapaRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };



  useEffect(() => {
    mapaRef.current = null;
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2lzdGVtYXMyMzEyIiwiYSI6ImNsdThuaGczYTAwcnoydG54dG05OGxocXgifQ.J6tkaSWvRwfhXfiHoXzGFQ";

    const mapa = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      zoom: 10,
      center: [-102.552784, 23.634501],
    });

    mapa.on("load", () => {
      mapaRef.current = mapa;
    });
    setTimeout(() => {
      setValue(0);
    }, 800);
    return () => {
      mapa.remove();
    };
  }, []);

  const removeMarkers = () => {
    setMarkortt([]);
    console.log("removimos")
    for (let marker of markerInstances) {
      marker.remove();
    }
    setMarkerInstances([]);
    markerDescart();
  };

  const generateMarker = (data) => {
    const Instances = [];
    const markers = comparacion ? comparacion : data ? data : mark;
    
    const Repetidas = [...mark];
    console.log(markers)
    for (let coordenada of markers) {
      const exist = mark.find((m) => m.cuenta == coordenada.cuenta);
      const existInstance = Repetidas.find((m) => m.cuenta == coordenada.cuenta);
      // console.log("queriamos meter") 
      if ((!exist && !existInstance) || comparacion) {
        console.log("metimos")

        Repetidas.push(coordenada);
      const popupContent = `<h3 style="color: black;">${coordenada.cuenta}</h3><p style="color: black;"></p>`;

      const popup = new mapboxgl.Popup({
        offset: 25,
      }).setHTML(popupContent);

      const customMarker = document.createElement("div");
      customMarker.className = "customMarker";
      customMarker.style.backgroundColor =
        coordenada?.color && coordenada.color;

      const marker =  new mapboxgl.Marker(customMarker)
        .setLngLat([
          parseFloat(coordenada.longitud),
          parseFloat(coordenada.latitud),
        ])
        .addTo(mapaRef.current);

      customMarker.addEventListener("mouseenter", () => {
        marker.setPopup(popup);
        marker.togglePopup();
      });

      customMarker.addEventListener("mouseleave", () => {
        marker.togglePopup();
      });
      Instances.push(marker);
      
     }
    };
  
    setMarkortt(Repetidas);
    setMarkerInstances(Instances);
    
    if (markers.length > 0) {
      mapaRef.current.setCenter([
        parseFloat(markers[0].longitud),
        parseFloat(markers[0].latitud),
      ]);
    }
  };

  const markerDescart = () => {
   
    const Instances = [...mark];
    const Nuevas = [];

    for (let c of cordenadas) {
      const exist = mark.find((m) => m.cuenta == c.cuenta);
      const existInstance = Instances.find((m) => m.cuenta == c.cuenta);

      if ((!exist && !existInstance) || comparacion) {
        Instances.push(c);
        Nuevas.push(c);
      }
    }

   
    if (Nuevas.length) {
      generateMarker(Nuevas);
    } else if (markerInstances.length == 0) {
      generateMarker();
    }
  };

  const resetMarkers = (cambioPlaza) => {
    if (comparacion||cambioPlaza=="cambioPlza") {
      dispatch(setCordendasComparacion());
      setValue(0);
      removeMarkers();
    }
  };


  useEffect(() => {
    if (!mapaRef.current) return;
      resetMarkers("cambioPlza")
  }, [plaza]);

  useEffect(() => {
    if (!mapaRef.current) return;
    markerDescart();
  }, [cordenadas]);

  useEffect(() => {
    setTimeout(() => {
      if (!mapaRef?.current) return;
      markerDescart();
    }, 1000);
  }, []);

  useEffect(() => {
    if (!mapaRef.current) return;
    removeMarkers();
  }, [comparacion]);

  
  const test = () => {
    console.log(markerInstances);
  };

  return (
    <Box
      sx={{ bgcolor: "background.paper", width: 500 }}
      minHeight={"100%"}
      minWidth={"100%"}
    >
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            label="SUBIR O ACTUALIZAR"
            {...a11yProps(0)}
            onClick={resetMarkers}
          />
          <Tab label="MAPA" {...a11yProps(1)} onClick={() => markerDescart()} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <Box hidden={value !== 0}>
          <SubirCordenadasPanel setValue={setValue} value={value} />
        </Box>
        <Box hidden={value !== 1} sx={{ height: "5px" }}>
          {/* NO hay cotenido por el mapa, para renderizarlo una sola vez */}
        </Box>
      </SwipeableViews>
      <div
        id="map"
        style={{
          width: "100%",
          minHeight: "400px",
          position: "relative",
          backgroundColor: "white",
          display: value == 0 ? "none" : "block",
        }}
      >
        <div className="panleMapInfo">
          <PanelInfoMap resetMarkers={resetMarkers} />
        </div>
      </div>
    </Box>
  );
}

export default FullWidthTabs;
