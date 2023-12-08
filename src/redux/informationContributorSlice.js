import { createSlice } from '@reduxjs/toolkit';

// Slice para 'informationContributorPersonalData'
export const informationContributorSlice = createSlice({
  name: 'informationContributor',
  initialState: null,
  reducers: {
    setInformationContributor: (state, action) => action.payload,
  },
});

// Exportar la acción y el reducer
export const { setInformationContributor } = informationContributorSlice.actions;
export default informationContributorSlice.reducer;