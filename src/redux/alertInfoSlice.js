
import { createSlice } from '@reduxjs/toolkit';
// Slice para 'alertInfo'
export const alertInfoSlice = createSlice({
    name: 'alertInfo',
    initialState: null,
    reducers: {
      setAlertInfoFromRequest: (state, action) => action.payload,
    },
  });

  // Exportar la acción y el reducer
export const { setAlertInfoFromRequest } = alertInfoSlice.actions;
export default alertInfoSlice.reducer;