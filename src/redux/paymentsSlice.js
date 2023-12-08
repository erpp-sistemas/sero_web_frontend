import { createSlice } from '@reduxjs/toolkit';

export const paymentsSlice = createSlice({
    name: 'payments',
    initialState: null,
    reducers: {
      setPayments: (state, action) => action.payload,
    },
  });
  
  // Exportar la acción y el reducer
  export const { setPayments } = paymentsSlice.actions;
  export default paymentsSlice.reducer;
  