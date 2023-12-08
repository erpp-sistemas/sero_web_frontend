import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

const SliderWithResize = ({ children }) => {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  return (
    <div>
      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        aria-labelledby="slider-label"
        step={1}
        min={0}
        max={100}
      />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{
          transform: `scale(${sliderValue / 100})`,
          transition: `transform 200ms`,
          width: `${sliderValue}px`,
          height: `${sliderValue}px`,
        }}
        border="1px solid #ccc"
        padding="16px"
      >
        {children}
      </Box>
    </div>
  );
};

export default SliderWithResize;
