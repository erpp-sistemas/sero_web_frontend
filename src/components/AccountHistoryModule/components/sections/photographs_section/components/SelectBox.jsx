import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import e from "cors";
import React from "react";
import { useStoreZustand } from "../../../../../../zustan_store/useStoreZustand";

function SelectBox({
  hasFetchData,
  title,
  array,
  field,
  setImageDataNew,
  imageDataNew,
  setValidateInputs,
}) {
  const { setImageData, getImageData } = useStoreZustand();
  const [task, setTask] = React.useState("");
  const [taskCatalog, setTaskCatalog] = React.useState([]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;

    setTask(selectedValue);

    // Update only the 'idTarea' field in getImageData state
    switch (field) {
      case "idTarea":
        setImageDataNew((prevImageData) => ({
          ...prevImageData,
          task_id: selectedValue,
        }));
        setValidateInputs((prev) => ({
          ...prev,
          taskInput: !!event.target.value,
        }));

        break;

      case "id_servicio":
        setImageDataNew((prevImageData) => ({
          ...prevImageData,
          service_id: selectedValue,
        }));
        setValidateInputs((prev) => ({
          ...prev,
          serviceInput: !!event.target.value,
        }));

        break;
      case "tipo":
        setImageDataNew((prevImageData) => ({
          ...prevImageData,
          type: selectedValue,
        }));
        setValidateInputs((prev) => ({
          ...prev,
          typeInput: !!event.target.value,
        }));

        break;

      default:
        break;
    }
  };

  switch (true) {
    case hasFetchData === true:
      React.useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              "http://localhost:3000/api/GetTaskCatalog"
            );
            setTaskCatalog(response.data); // Assuming the response contains the task catalog data
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();
      }, []); // Empty dependency array ensures the effect runs only once when the component mounts

      return (
        <FormControl variant="filled" sx={{ marginTop: "3rem", width: "100%" }}>
          <InputLabel id={`demo-simple-select-filled-label_${title}`}>
            {title}
          </InputLabel>
          <Select
            color="secondary"
            labelId={`demo-simple-select-filled-label_${title}`}
            id={`demo-simple-select-filled_${title}`}
            value={task}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {taskCatalog
              ? taskCatalog.map((task) => (
                  <MenuItem key={task.id_tarea} value={task.id_tarea}>
                    {task.nombre}
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
      );

    case hasFetchData === false:
      if (array) {
        return (
          <FormControl
            variant="filled"
            sx={{ marginTop: "3rem", width: "100%" }}
          >
            <InputLabel id={`demo-simple-select-filled-label_${title}`}>
              {title}
            </InputLabel>
            <Select
              color="secondary"
              labelId={`demo-simple-select-filled-label_${title}`}
              id={`demo-simple-select-filled_${title}`}
              value={task}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {array
                ? array.map((element) => (
                    <MenuItem key={element.value} value={element.value}>
                      {element.name}
                    </MenuItem>
                  ))
                : null}
            </Select>
          
          </FormControl>
        );
      }

    default:
      return null;
  }
}

export default SelectBox;
