import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { getAllServices } from "../../../../api/service";
import { useEffect } from "react";
import { getAllProcesses } from "../../../../api/process";

function SwitchBox({ buttons }) {
    const [services,setServices] = React.useState([])
    const [processes,setProcesses] = React.useState([])
    const [selectedServices, setSelectedServices] = React.useState({});

  // ... (resto del código)

  console.log(buttons);
  
  const handleServiceSelection = (serviceId) => {
    setSelectedServices((prevSelectedServices) => ({
      ...prevSelectedServices,
      [serviceId]: !prevSelectedServices[serviceId],
    }));
  };
   

    const fetchProcesses = async () => {
        try {
          // Aquí deberías hacer tu solicitud de red para obtener los datos
          // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
          const response = await getAllProcesses();
    
          // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
          const rowsWithId = response.map((row, index) => ({
            ...row,
            id: row.id_proceso,
          }));
    
          setProcesses(rowsWithId);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    const fetchServices = async () => {
        try {
          // Aquí deberías hacer tu solicitud de red para obtener los datos
          // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
          const response = await getAllServices();
    
          // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
          const rowsWithId = response.map((row, index) => ({
            ...row,
            id: row.id_servicio || index.toString(),
          }));
    
          setServices(rowsWithId);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      React.useEffect(() => {
        fetchServices()
        fetchProcesses()
      }, [])
      
  const arrayPlaces = [
    "Zinacantepec",
    "Cuautitlan Izcalli",
    "Demo",
    "Naucalpan",
  ];
  const renderSwitchBox = (buttonName) => {
    if (buttons?.[buttonName]) {
      return (
        <>
          <Paper
            sx={{
              border: "1px solid white",
              margin: "1rem",
              width: "400px",
              padding: "1rem",
            }}
          >
            <Typography>{`${
              arrayPlaces[Number(buttons?.[buttonName]) - 1]
            }`}</Typography>
            <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Servicios de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              }`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row"}}>
                {services?.map((service)=>{

                    return   <FormControlLabel
                    control={<Checkbox color="secondary"   checked={selectedServices[service.id_servicio] || false}
                    onChange={() => handleServiceSelection(service.id_servicio)}/>}
                    label={`${service.nombre}`}
                  />
                })}
              
             
              </FormGroup>
            </Box>
            {selectedServices["1"] && buttons["button1"] &&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de agua`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["2"] &&  buttons["button1"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de predio`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["3"] &&  buttons["button1"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de antenas `}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["4"] &&  buttons["button1"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de Licencias`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}

{selectedServices["1"] && buttons["button2"] &&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de agua`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["2"] &&  buttons["button2"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de predio`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["3"] &&  buttons["button2"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de antenas `}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["4"] &&  buttons["button2"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de Licencias`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}

{selectedServices["1"] && buttons["button3"] &&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de agua`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["2"] &&  buttons["button3"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de predio`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["3"] &&  buttons["button3"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de antenas `}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["4"] &&  buttons["button3"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de Licencias`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}

            
{selectedServices["1"] && buttons["button4"] &&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de agua`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["2"] &&  buttons["button4"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de predio`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["3"] &&  buttons["button4"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de antenas `}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
            {selectedServices["4"] &&  buttons["button4"]&&(  <Box
              sx={{
                border: "1px solid white",
                margin: "1rem",
                width: "320px",
                padding: "1rem",
              }}
            >
              <Typography>{`Procesos de la plaza ${
                arrayPlaces[Number(buttons?.[buttonName]) - 1]
              } para el servicio de Licencias`}</Typography>
              <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
               {processes?.map((process)=>{
                return  <FormControlLabel
                control={<Checkbox color="secondary" />}
                label={`${process.nombre}`}
              />
               })}
              </FormGroup>
            </Box>

            )}
          
          </Paper>
          {/*   <div key={buttonName}>{`${buttons?.[buttonName]}`}</div> */}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          border: "1px solid white",
          height: "auto",
        }}
      >
        {renderSwitchBox("button1")}
        {renderSwitchBox("button2")}{" "}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          border: "1px solid white",
          height: "auto",
        }}
      >
        {renderSwitchBox("button3")}
        {renderSwitchBox("button4")}{" "}
      </Box>
    </>
  );
}

export default SwitchBox;
