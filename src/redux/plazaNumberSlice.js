import { createSlice } from "@reduxjs/toolkit";

// Slice para 'plazaNumber'
export const plazaNumberSlice = createSlice({
    name: 'plazaNumber',
    initialState: null,
    reducers: {
      setPlazaNumber: (state, action) => action.payload,
    },
  });
  
  // Exportar la acción y el reducer
  export const { setPlazaNumber } = plazaNumberSlice.actions;
  export default plazaNumberSlice.reducer;