import { createSlice } from "@reduxjs/toolkit"

export const photosSlice = createSlice({
	name: 'photos',
	initialState: null,
	reducers: {
		setPhotos: (state, action) => action.payload,
	},
})

export const { setPhotos } = photosSlice.actions
export default photosSlice.reducer