import { createSlice } from "@reduxjs/toolkit";

// Slice para 'apikeyGeocodingSlice'
export const apikeyGeocodingSlice = createSlice({
    name: 'apikeyGeocodingSlice',
    initialState: null,
    reducers: {
        setApikeyGeocodingSlice: (state, action) => action.payload,
    },
  });
  
  // Exportar la acción y el reducer
  export const { setApikeyGeocodingSlice } = apikeyGeocodingSlice.actions;
  export default apikeyGeocodingSlice.reducer;