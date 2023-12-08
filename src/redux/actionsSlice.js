import { createSlice } from "@reduxjs/toolkit";


// Slice para 'actions'
export const actionsSlice = createSlice({
    name: 'actions',
    initialState: null,
    reducers: {
      setActions: (state, action) => action.payload,
    },
  });
  
  // Exportar la acción y el reducer
  export const { setActions } = actionsSlice.actions;
  export default actionsSlice.reducer;