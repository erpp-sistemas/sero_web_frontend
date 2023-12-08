import { createSlice } from "@reduxjs/toolkit";


// Slice para 'photos'
export const photosSlice = createSlice({
  name: 'photos',
  initialState: null,
  reducers: {
    setPhotos: (state, action) => action.payload,
  },
});

// Exportar la acción y el reducer
export const { setPhotos } = photosSlice.actions;
export default photosSlice.reducer;