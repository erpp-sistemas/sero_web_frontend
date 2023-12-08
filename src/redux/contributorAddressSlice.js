import { createSlice } from '@reduxjs/toolkit';

// Slice para 'contributorAddress'
export const contributorAddressSlice = createSlice({
  name: 'contributorAddress',
  initialState: null,
  reducers: {
    setContributorAddress: (state, action) => action.payload,
  },
});

// Exportar la acción y el reducer
export const { setContributorAddress } = contributorAddressSlice.actions;
export default contributorAddressSlice.reducer;