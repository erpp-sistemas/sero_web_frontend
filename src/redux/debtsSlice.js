import { createSlice } from "@reduxjs/toolkit";

// Slice para 'debts'
export const debtsSlice = createSlice({
    name: 'debts',
    initialState: null,
    reducers: {
      setDebts: (state, action) => action.payload,
    },
  });
  
  // Exportar la acción y el reducer
  export const { setDebts } = debtsSlice.actions;
  export default debtsSlice.reducer;
  